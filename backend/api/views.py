from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import User, Doctor
from .serializers import UserSerializer
from .zsl_model.predict import predict_disease
from django.core.files.storage import default_storage
import fitz
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import requests
import urllib.parse



def find_nearest_hospital(latitude, longitude, num_results, radius=5000):
    """Fetches the nearest num_results hospitals/clinics and generates Google Maps links."""
    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json];
    (node["amenity"="hospital"](around:{radius},{latitude},{longitude});
    node["amenity"="clinic"](around:{radius},{latitude},{longitude});
    way["amenity"="hospital"](around:{radius},{latitude},{longitude});
    way["amenity"="clinic"](around:{radius},{latitude},{longitude});
    relation["amenity"="hospital"](around:{radius},{latitude},{longitude});
    relation["amenity"="clinic"](around:{radius},{latitude},{longitude});
    );
    out center;
    """
    response = requests.get(overpass_url, params={'data': overpass_query})
    if response.status_code != 200:
        return {"error": "Failed to fetch data from OpenStreetMap API."}
    data = response.json()
    if 'elements' not in data or not data['elements']:
        return {"message": "No hospitals or clinics found within the radius."}
    facilities = []
    for element in data['elements']:
        if 'lat' in element and 'lon' in element:
            facility_lat = element['lat']
            facility_lon = element['lon']
        elif 'center' in element:
            facility_lat = element['center']['lat']
            facility_lon = element['center']['lon']
        else:
            continue
        name = element.get('tags', {}).get('name')
        if not name or name == "Unknown Medical Facility":
            continue
        distance = geodesic((latitude, longitude), (facility_lat, facility_lon)).meters
        encoded_name = urllib.parse.quote(name)
        google_maps_link = f"https://www.google.com/maps/search/?api=1&query={encoded_name}+{facility_lat},{facility_lon}"
        
        facilities.append({
            "name": name,
            "latitude": facility_lat,
            "longitude": facility_lon,
            "distance_meters": round(distance, 2),
            "google_maps_link": google_maps_link
        })
    facilities.sort(key=lambda x: x["distance_meters"])
    if len(facilities) == 0:
        return {"message": "No hospitals or clinics found."}
    else:
        return {"hospitals": facilities[:num_results]}


    

@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        first_name = data.get('first_name')
        print(first_name)
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already in use'}, status=400)

        user = User.objects.create_user(
            email=email, # Using email as username
            password=password ,
            first_name=first_name,
            last_name=last_name,
            username=email,
            
        )
        user.save()
        return JsonResponse({'message': 'User registered successfully'})
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)

        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                return JsonResponse({'message': 'Login successful'})
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

    return JsonResponse({'error': 'Invalid request'}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def disease_prediction(request):
    symptoms = request.data.get("symptoms", "")
    if not symptoms:
        return JsonResponse({"error": "No symptoms provided"}, status=400)
    prediction = predict_disease(symptoms)
    return JsonResponse({"predicted_disease": prediction})

class PDFUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        if 'file' not in request.FILES:
            return JsonResponse({"error": "No file uploaded"}, status=400)
        pdf_file = request.FILES['file']
        file_path = default_storage.save(f"uploads/{pdf_file.name}", pdf_file)
        try:
            text = self.extract_text_from_pdf(file_path)
            prediction = predict_disease(text)
            return JsonResponse({"predicted_disease": prediction})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    def extract_text_from_pdf(self, file_path):
        text = ""
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text("text")
        return text.strip()

@api_view(['GET'])
@permission_classes([AllowAny])
def nearby_doctors(request):
    user_location = request.GET.get('location')
    num_results = int(request.GET.get('num', 5))
    if not user_location:
        return JsonResponse({'error': 'Location is required'}, status=400)
    
    geolocator = Nominatim(user_agent="health_monitoring")
    location = geolocator.geocode(user_location)
    if not location:
        error_message = f"Invalid location: '{user_location}'. Please provide a valid location."
        return JsonResponse({'error': error_message}, status=400)

    nearby_doctors_data = find_nearest_hospital(location.latitude, location.longitude, num_results)

    return JsonResponse(nearby_doctors_data, safe=False)


   


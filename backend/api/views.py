from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
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
from .models import ChatMessage
from django.contrib.auth.decorators import login_required
import logging



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


   

### ✅ Save Chat Message ###
# @api_view(["POST"])
# @csrf_exempt
# def save_message(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)
#             user_id = data.get("user_id")  # Get user ID from request
#             # user_id = 1

#             if not user_id:
#                 return JsonResponse({"error": "User ID is required"}, status=400)

#             user = User.objects.get(id=user_id)
#             messages = data.get("messages", [])

#             for msg in messages:
#                 ChatMessage.objects.create(
#                     user=user,
#                     role=msg["role"],
#                     content=msg["content"]
#                 )

#             return JsonResponse({"success": True})

#         except User.DoesNotExist:
#             return JsonResponse({"error": "User not found"}, status=404)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Invalid request method"}, status=400)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@api_view(["POST"])
@csrf_exempt
def save_message(request):
    if request.method == "POST":
        try:
            logging.debug("Request received.")

            # Read request body
            raw_data = request.body.decode("utf-8")
            logging.debug(f"Raw request body: {raw_data}")

            # Parse JSON
            data = json.loads(raw_data)
            logging.debug(f"Parsed JSON data: {data}")

            # Extract user_id
            user_id = data.get("user_id")
            logging.debug(f"Extracted user_id: {user_id}")

            if not user_id:
                return JsonResponse({"error": "User ID is required"}, status=400)

            # Fetch user from database
            user = User.objects.get(id=user_id)
            logging.debug(f"User found: {user}")

            messages = data.get("messages", [])
            logging.debug(f"Received messages: {messages}")

            # Save messages to the database
            for msg in messages:
                ChatMessage.objects.create(
                    user=user,
                    role=msg["role"],
                    content=msg["content"]
                )

            return JsonResponse({"success": True})

        except User.DoesNotExist:
            logging.error(f"User with ID {user_id} not found.")
            return JsonResponse({"error": "User not found"}, status=404)
        except json.JSONDecodeError as e:
            logging.error(f"JSON Decode Error: {e}")
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)



@api_view(["POST"])
@csrf_exempt
def get_chat_history(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_id = 1  # Get user ID from request

            if not user_id:
                return JsonResponse({"error": "User ID is required"}, status=400)

            user = User.objects.get(id=user_id)
            messages = ChatMessage.objects.filter(user=user).order_by("timestamp")

            history = [{"role": msg.role, "content": msg.content} for msg in messages]
            return JsonResponse({"messages": history})

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)
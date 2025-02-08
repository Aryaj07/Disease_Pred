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
import fitz  # PyMuPDF
from geopy.geocoders import Nominatim
from geopy.distance import geodesic

@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already in use'}, status=400)

        user = User.objects.create_user(
            username=email,  # Using email as username
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password
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
                # Authentication successful
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
    if not user_location:
        return JsonResponse({'error': 'Location is required'}, status=400)

    geolocator = Nominatim(user_agent="health_monitoring")
    location = geolocator.geocode(user_location)
    if not location:
        return JsonResponse({'error': 'Invalid location'}, status=400)

    user_coords = (location.latitude, location.longitude)

    doctors = Doctor.objects.all()
    nearby_doctors = []

    for doctor in doctors:
        doctor_coords = (doctor.latitude, doctor.longitude)
        distance = geodesic(user_coords, doctor_coords).kilometers
        if distance <= 10:  # within 10 km
            nearby_doctors.append({
                'name': doctor.name,
                'address': doctor.address,
                'distance': distance
            })

    return JsonResponse(nearby_doctors, safe=False)
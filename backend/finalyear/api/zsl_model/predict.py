from transformers import pipeline

# Expanded list of prompts with various symptom descriptions
prompts = [
    "The patient has a high fever and cough.",
    "The patient is experiencing headaches and dizziness.",
    "The patient has a runny nose and sore throat.",
    "The patient has a rash and itchy skin.",
    "The patient is feeling extremely tired and weak.",
    "The patient has severe stomach pain and vomiting.",
    "The patient has chest pain and difficulty breathing.",
    "The patient is experiencing joint pain and swelling.",
    "The patient has sudden weight loss and night sweats.",
    "The patient has blurred vision and excessive thirst.",
] * 10  # Duplicated to ensure 100 prompts

# Expanded list of possible diseases
POSSIBLE_DISEASES = [
    "Flu", "Cold", "Malaria", "Typhoid", "Diabetes", "Hypertension", "COVID-19", "Tuberculosis",
    "Dengue", "Chikungunya", "Asthma", "Bronchitis", "Pneumonia", "Chickenpox", "Measles", "Mumps",
    "Hepatitis A", "Hepatitis B", "Hepatitis C", "Hepatitis D", "Hepatitis E", "Zika Virus", "Ebola",
    "Rabies", "Tetanus", "Leprosy", "Plague", "Anthrax", "Meningitis", "Encephalitis", "Celiac Disease",
    "Crohn's Disease", "Ulcerative Colitis", "Gastritis", "GERD", "Peptic Ulcer", "Kidney Stones", "UTI",
    "Liver Cirrhosis", "Fatty Liver", "Appendicitis", "Pancreatitis", "Anemia", "Leukemia", "Lymphoma",
    "Thyroid Disorder", "Goiter", "Polio", "Parkinson's Disease", "Alzheimer's Disease", "Multiple Sclerosis",
    "Epilepsy", "Migraine", "Stroke", "Heart Attack", "Congenital Heart Disease", "Arrhythmia", "Hemophilia",
    "Sickle Cell Anemia", "Lupus", "Psoriasis", "Eczema", "Vitiligo", "Dermatitis", "Skin Cancer", "Breast Cancer",
    "Lung Cancer", "Colon Cancer", "Prostate Cancer", "Ovarian Cancer", "Cervical Cancer", "Throat Cancer",
    "Bone Cancer", "Liver Cancer", "Pancreatic Cancer", "Esophageal Cancer", "Gastric Cancer", "Kidney Cancer",
    "Bladder Cancer", "Testicular Cancer", "Sarcoma", "Melanoma", "HIV/AIDS", "Syphilis", "Gonorrhea",
    "Chlamydia", "Herpes", "Human Papillomavirus (HPV)", "Toxoplasmosis", "Candidiasis", "Cryptosporidiosis",
    "Brucellosis", "Leptospirosis", "Q Fever", "Scrub Typhus", "Typhus Fever"
]

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def predict_disease(symptoms):
    results = []
    for prompt in prompts:
        result = classifier(prompt, POSSIBLE_DISEASES)
        results.append(result)

    combined_scores = {disease: 0 for disease in POSSIBLE_DISEASES}
    for result in results:
        for i, disease in enumerate(result["labels"]):
            combined_scores[disease] += result["scores"][i]

    predicted_disease = max(combined_scores, key=combined_scores.get)
    return predicted_disease

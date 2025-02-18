"use client";
import { useState } from 'react';
import axios from 'axios';

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState('');
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [location, setLocation] = useState('');

  const handlePredict = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/predict/', { symptoms });
      setPrediction(response.data.prediction);
    } catch (err) {
      console.error('Prediction Failed:', err.response.data);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true); // Start loading
      const response = await axios.post('http://127.0.0.1:8000/api/upload-pdf/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setPrediction(response.data.predicted_disease);
    } catch (err) {
      console.error('PDF Upload Failed:', err.response.data);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const fetchNearbyDoctors = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/nearby-doctors/?location=${location}`);
      setDoctors(response.data);
    } catch (err) {
      console.error('Fetching Doctors Failed:', err.response.data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-gray-200 flex items-center justify-center p-4 relative">
      {/* Moving Gradient Background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-green-100 to-gray-200 animate-gradient-slide"
      ></div>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg relative z-10 transition-shadow duration-300 hover:shadow-3xl">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-gray-700 mb-4 flex items-center justify-center">
          <span role="img" aria-label="health">
            ⚕️
          </span>{" "}
          Health Dashboard
        </h1>
        {/* Textarea with animated focus */}
        <textarea
          placeholder="Enter your symptoms..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-4 focus:ring-green-400 resize-none transition-all duration-300 mb-2 text-gray-800"
          style={{ minHeight: '8rem', maxHeight: '12rem' }}
        ></textarea>
        {/* Progress Indicator */}
        <div className="relative h-2 w-full bg-gray-200 rounded overflow-hidden mb-2">
          <div
            className="h-full bg-green-400"
            style={{ width: `${Math.min(symptoms.length, 100)}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-500 mb-4">
          {symptoms.length} characters
        </p>
        {/* Button with loading animation */}
        <button
          onClick={handlePredict}
          className="w-full py-2 text-white bg-green-400 rounded shadow-md hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2 transition-transform transform hover:scale-105 active:scale-95"
        >
          {loading ? (
            <div className="loader border-t-4 border-green-500 rounded-full w-5 h-5 mx-auto animate-spin"></div>
          ) : (
            'Predict'
          )}
        </button>
        {/* PDF Upload Button */}
        <div className="mt-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-4 focus:ring-green-400 transition-all duration-300"
          />
        </div>
        {/* Location Input for Nearby Doctors */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter your location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-4 focus:ring-green-400 transition-all duration-300"
          />
          <button
            onClick={fetchNearbyDoctors}
            className="w-full py-2 text-white bg-green-400 rounded shadow-md hover:bg-green-500 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2 transition-transform transform hover:scale-105 active:scale-95 mt-2"
          >
            Find Nearby Doctors
          </button>
        </div>
        {/* Prediction Display */}
        {prediction && (
          <div
            className="mt-6 p-4 bg-green-50 border border-green-300 rounded text-green-700 shadow-lg transform transition-transform duration-500 hover:scale-105 animate-fade-in"
          >
            <strong>Prediction:</strong> {prediction}
          </div>
        )}
        {/* Nearby Doctors Display */}
        {doctors.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Nearby Doctors</h2>
            <ul className="list-disc list-inside">
              {doctors.map((doctor, index) => (
                <li key={index} className="mb-2">
                  {doctor.name} - {doctor.address}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Powered by AI Health Predictor
        </p>
      </div>
    </div>
  );
}
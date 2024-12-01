"use client";
import { useState } from 'react';
import axios from 'axios';

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState('');
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post('/api/health/predict', { symptoms });
      setPrediction(response.data.prediction);
    } catch (err) {
      console.error('Prediction Failed:', err.response.data);
    } finally {
      setLoading(false); // Stop loading
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
        {/* Prediction Display */}
        {prediction && (
          <div
            className="mt-6 p-4 bg-green-50 border border-green-300 rounded text-green-700 shadow-lg transform transition-transform duration-500 hover:scale-105 animate-fade-in"
          >
            <strong>Prediction:</strong> {prediction}
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

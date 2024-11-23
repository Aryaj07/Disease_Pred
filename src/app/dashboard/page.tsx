"use client";
import { useState } from 'react';
import axios from 'axios';

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState('');
  const [prediction, setPrediction] = useState('');

  const handlePredict = async () => {
    try {
      const response = await axios.post('/api/health/predict', { symptoms });
      setPrediction(response.data.prediction);
    } catch (err) {
      console.error('Prediction Failed:', err.response.data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-gray-200 flex items-center justify-center p-4 relative">
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-10"
        style={{
          backgroundImage:
            "url('https://www.example.com/health-background.png')",
        }}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative z-10">
        <h1 className="text-3xl font-semibold text-gray-700 mb-4 flex items-center justify-center">
          <span role="img" aria-label="health">
            ⚕️
          </span>{" "}
          Health Dashboard
        </h1>
        <textarea
          placeholder="Enter your symptoms..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none mb-2 text-gray-800"
        ></textarea>
        <p className="text-right text-sm text-gray-500 mb-4">
          {symptoms.length} characters
        </p>
        <button
          onClick={handlePredict}
          className="w-full py-2 text-white bg-green-400 rounded hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-300 transition-transform transform hover:scale-105 active:scale-95"
        >
          Predict
        </button>
        {prediction && (
          <div
            className="mt-6 p-4 bg-green-50 border border-green-300 rounded text-green-700 animate-fade-in"
          >
            <strong>Prediction:</strong> {prediction}
          </div>
        )}
      </div>
    </div>
  );
}

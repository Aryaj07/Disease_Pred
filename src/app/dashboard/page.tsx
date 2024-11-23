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
    <div>
      <h1>Health Dashboard</h1>
      <textarea
        placeholder="Enter your symptoms..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      ></textarea>
      <button onClick={handlePredict}>Predict</button>
      {prediction && <div>Prediction: {prediction}</div>}
    </div>
  );
}


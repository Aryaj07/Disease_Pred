"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const [symptoms, setSymptoms] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/predict/", {
        symptoms,
      });
      setPrediction(response.data.prediction);
    } catch (err) {
      console.error("Prediction Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyDoctors = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/nearby-doctors/?location=${location}`
      );
      console.log(response.data);
      setDoctors(response.data);
    } catch (err) {
      console.error("Fetching Doctors Failed:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-gray-200 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-green-100 to-gray-200 animate-gradient-slide"></div>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg relative z-10 transition-shadow duration-300 hover:shadow-3xl">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-gray-700 mb-4 text-center">
          ⚕️ Health Dashboard
        </h1>

        {/* Textarea for Symptoms */}
        <textarea
          placeholder="Enter your symptoms..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-4 focus:ring-green-400 resize-none transition-all duration-300 mb-2 text-gray-800"
          style={{ minHeight: "8rem", maxHeight: "12rem" }}
        ></textarea>

        {/* Prediction Button */}
        <button
          onClick={handlePredict}
          className="w-full py-2 text-white bg-green-400 rounded shadow-md hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-105 active:scale-95 mt-2"
        >
          {loading ? (
            <div className="loader border-t-4 border-green-500 rounded-full w-5 h-5 mx-auto animate-spin"></div>
          ) : (
            "Predict"
          )}
        </button>

        {/* Location Input for Doctors */}
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
            className="w-full py-2 text-white bg-green-400 rounded shadow-md hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-300 transition-transform transform hover:scale-105 active:scale-95 mt-2"
          >
            Find Nearby Doctors
          </button>
        </div>

        {/* Prediction Display */}
        {prediction && (
          <div className="mt-6 p-4 bg-green-50 border border-green-300 rounded text-green-700 shadow-lg transform transition-transform duration-500 hover:scale-105 animate-fade-in">
            <strong>Prediction:</strong> {prediction}
          </div>
        )}

        {doctors.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Nearby Doctors
            </h2>
            <ul className="list-disc list-inside">
              {doctors.map((doctor, index) => (
                <li
                  key={index}
                  className="mb-2"
                >
                  {doctor.name} - {doctor.address}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Logout Button at Bottom */}
        <button
          onClick={handleLogout}
          className="w-full py-2 text-white bg-red-500 rounded shadow-md hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition-transform transform hover:scale-105 active:scale-95 mt-6"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

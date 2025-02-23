"use client";
import { useState } from "react";
import axios from "axios";
import { doctor } from "@/types";
import { useRouter } from "next/navigation";

export default function NearbyDoctorsPage() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [doctors, setDoctors] = useState<doctor[]>([]);
  const [error, setError] = useState("");

  const fetchNearbyDoctors = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/nearby-doctors/?location=${location}`
      );
      
      const doctorsData = Array.isArray(response.data) ? response.data : [response.data];
      
      const sortedDoctors = doctorsData
        .map(doctor => ({
          ...doctor,
          distance_meters: Number(doctor.distance_meters)
        }))
        .sort((a, b) => a.distance_meters - b.distance_meters);

      setDoctors(sortedDoctors);
      setError("");
    } catch (err) {
      console.error("Fetching Doctors Failed:", err);
      setError("Failed to fetch doctors. Please try again.");
      setDoctors([]);
    }
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} meters`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-200 flex items-center justify-center p-4 pb-0 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-gray-200 animate-gradient-slide"></div>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg relative z-10 transition-shadow duration-300 hover:shadow-3xl">
        {/* Back to Dashboard Button */}
        <div className="mb-4 flex justify-start">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-semibold text-gray-700 mb-4 text-center">
          🏥 Find Nearby Doctors
        </h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter your location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
          />
          <button
            onClick={fetchNearbyDoctors}
            className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
          >
            Search
          </button>
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-center">{error}</div>
        )}

        {doctors.length > 0 ? (
          <div className="mt-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Nearby Doctors ({doctors.length})
            </h2>
            <div className="space-y-3">
              {doctors.map((doctor, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDistance(doctor.distance_meters)} away
                      </p>
                    </div>
                    <a
                      href={doctor.google_maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      <span className="sr-only">Open in Google Maps</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414-1.414l-3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6 text-gray-500 text-center">
            {location ? "No doctors found in this area" : "Enter location to search"}
          </div>
        )}
      </div>
    </div>
  );
}
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

  const fetchNearbyDoctors = async (providedLocation?: string) => {
    const loc = providedLocation || location;
    if (!loc) {
      setError("Please enter a location or use your current location");
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/nearby-doctors/?location=${loc}`
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

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationStr = `${latitude},${longitude}`;
        setLocation(locationStr);
        fetchNearbyDoctors(locationStr);
      },
      (error) => {
        setError("Unable to retrieve your location. Please enter manually.");
      }
    );
  };

  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} meters`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex flex-col items-center justify-start p-4 pb-0">
      <div className="w-full max-w-4xl space-y-6">
        {/* Back to Dashboard Button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="group flex items-center text-purple-200 hover:text-white transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 group-hover:-translate-x-1 transition-transform"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-lg font-medium">Return to Dashboard</span>
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
              Find Nearby Doctors
            </span>
            🩺
          </h1>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            <input
              type="text"
              placeholder="Enter location or use current position..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 p-4 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-purple-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 shadow-lg text-gray-800 placeholder-purple-400 transition-all duration-300"
            />
            
            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={() => fetchNearbyDoctors()}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Search
              </button>
              <button
                onClick={handleUseCurrentLocation}
                className="px-6 py-4 bg-white/20 hover:bg-white/30 border-2 border-cyan-200/30 text-cyan-100 font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Current
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-100/90 border-2 border-red-300 rounded-xl text-red-700 font-medium text-center backdrop-blur-sm animate-pulse-fast">
              {error}
            </div>
          )}

          {doctors.length > 0 ? (
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">
                Found {doctors.length} Nearby Doctor{doctors.length > 1 ? 's' : ''}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor, index) => (
                  <div 
                    key={index}
                    className="group p-6 bg-white/95 backdrop-blur-sm rounded-xl border-2 border-purple-100 hover:border-cyan-300 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {doctor.name}
                        </h3>
                        <p className="text-sm font-medium text-cyan-600">
                          {formatDistance(doctor.distance_meters)} away
                        </p>
                      </div>
                      <a
                        href={doctor.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 group/link"
                      >
                        <span className="font-medium group-hover/link:underline">
                          View on Map
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
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
            <div className="mt-8 p-6 bg-white/20 backdrop-blur-sm rounded-xl border-2 border-dashed border-white/30 text-center">
              <p className="text-xl text-white/80">
                {location 
                  ? "No doctors found in this area 🌐"
                  : "Enter location to begin search 🔍"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
)
}

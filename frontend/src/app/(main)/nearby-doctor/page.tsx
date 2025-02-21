"use client";
import { useState } from "react";
import axios from "axios";
import { doctor } from "@/types";

export default function NearbyDoctorsPage() {
  const [location, setLocation] = useState("");
  const [doctors, setDoctors] = useState<doctor>();

  const fetchNearbyDoctors = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/nearby-doctors/?location=${location}`
      );
      setDoctors(response.data);
    } catch (err) {
      console.error("Fetching Doctors Failed:", err );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-200 flex items-center justify-center p-4 pb-0 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-gray-200 animate-gradient-slide"></div>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg relative z-10 transition-shadow duration-300 hover:shadow-3xl">
        <h1 className="text-3xl font-semibold text-gray-700 mb-4 text-center">
          🏥 Find Nearby Doctors
        </h1>

        <input
          type="text"
          placeholder="Enter your location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300"
        />
        <button
          onClick={fetchNearbyDoctors}
          className="w-full py-2 text-white bg-blue-500 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 active:scale-95 mt-2"
        >
          Find Nearby Doctors
        </button>

        {doctors ? (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Nearby Doctors</h2>
            <ul className="list-disc list-inside">
                <li className="mb-2">
                  {doctors.name}
                </li>
                <li className="mb-2">
                  {doctors.distance_meters}
                </li>
                <a className="mb-2" href={doctors.google_maps_link} target="_blank">
                  {doctors.google_maps_link}
                </a>
            </ul>
          </div>
        ): (
          <div>no doctors found</div>
        )}
      </div>
    </div>
  );
}

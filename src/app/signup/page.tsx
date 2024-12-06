"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter(); // Initialize the router

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Add your signup logic here (e.g., API call)
    console.log({ firstName, lastName, email, password });

    // Navigate to the Dashboard page on successful signup
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-pink-100 to-purple-200 relative overflow-hidden">
      {/* Background Gradient Shapes */}
      <div className="absolute w-60 h-60 bg-pink-300 rounded-full blur-3xl opacity-50 top-20 left-10 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-purple-400 rounded-full blur-2xl opacity-40 bottom-20 right-10 animate-spin-slow"></div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-500 ease-in-out hover:shadow-2xl relative z-10"
      >
        <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">
          Create an Account
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-pink-400 transition-transform duration-300 shadow-sm"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-pink-400 transition-transform duration-300 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-purple-400 transition-transform duration-300 shadow-sm"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-purple-400 transition-transform duration-300 shadow-sm"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-purple-400 transition-transform duration-300 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 text-white bg-purple-500 rounded hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

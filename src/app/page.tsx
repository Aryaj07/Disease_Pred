"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    router.push("/dashboard");
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.status === 200) {
        // Handle login
      }
      console.log('Login Successful:', response.data);
    } catch (err) {
      console.error('Login Failed:', err.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm transform transition-all duration-500 ease-in-out hover:shadow-2xl"
        style={{ animation: "fadeIn 1.5s" }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Login to Your Account
        </h2>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:scale-105 transition-transform duration-300"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 active:scale-95"
        >
          Login
        </button>
      </form>
    </div>
  );
}

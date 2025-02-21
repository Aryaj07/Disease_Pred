"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password, confirm_password: confirmPassword })
        });
        const data = await response.json();
        if (response.status === 200) {
            console.log("Signup Successful:", data);
            router.push("/dashboard");
        } else {
            console.error("Signup Failed:", data.error);
            alert(data.error);
        }
    } catch (err) {
        console.error("Signup Failed:", err);
    }
};
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-tr from-teal-200 via-white to-blue-50 overflow-hidden">
      {/* Background: Geometric Lines */}
      <div className="absolute inset-0 bg-grid opacity-10" />

      {/* Background: Abstract Gradient Circles */}
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-br from-blue-400 to-white rounded-full blur-[120px] top-20 left-16"></div>
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-tl from-teal-400 to-blue-300 rounded-full blur-[150px] bottom-10 right-20"></div>

      {/* Signup Form */}
      <form 
        onSubmit={handleSubmit}
        className="relative z-10 bg-white px-8 py-10 rounded-xl shadow-xl max-w-lg w-full"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Sign Up
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 text-white bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

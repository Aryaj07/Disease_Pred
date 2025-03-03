"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 200) {
        console.log("Login Successful:", data);
        router.push("/dashboard");
      } else {
        console.error("Login Failed:", data.error);
        alert(data.error);
      }
    } catch (err) {
      console.error("Login Failed:", err);
    }
  };
  
  const socialAction = async () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };
  
  return (
    <div
      className="flex items-center justify-center h-screen relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('https://wallpaperaccess.com/full/2314950.jpg')",
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Animated Background Circles */}
      <div className="absolute w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-50 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-400 rounded-full blur-2xl opacity-40 bottom-10 right-10 animate-bounce"></div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm transform transition-all duration-500 ease-in-out hover:shadow-2xl relative z-10"
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
            className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-400 focus:scale-105 transition-transform duration-300 shadow-sm"
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-4 focus:ring-blue-400 focus:scale-105 transition-transform duration-300 shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-[48%] py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="w-[48%] py-2 text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-transform transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              Sign Up
            </button>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={socialAction}
            className="flex items-center justify-center gap-2 w-full py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-transform transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <FcGoogle size={20} />
            Sign in with Google
          </button>
        </div>
      </form>
    </div>
  );
}

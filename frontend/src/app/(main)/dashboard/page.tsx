"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Rishit ka penis small

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || loading) return;

    setMessages(prev => [...prev, { role: "user", content: inputMessage }]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/predict/",
        { symptoms: inputMessage },
        { timeout: 180000 }
      );

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `Based on your symptoms, the predicted condition is:\n\n**${response.data.predicted_disease}**\n\nPlease consult a healthcare professional for accurate diagnosis.`
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Unable to process your request. Please try again later."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">⚕️ Health Assistant</h1>
        <div className="flex gap-4">
        <div className='flex justify-center items-center ml-auto gap-x-4'>
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="p-2 ml-auto text-white bg-blue-500 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 active:scale-95"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push("/nearby-doctor")}
            className="p-2 ml-auto text-white bg-blue-500 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 active:scale-95"
          >
            Nearby Doctors
          </button>
        </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* System Greeting */}
        <div className="flex justify-center">
          <div className="max-w-3xl w-full text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-gray-600 dark:text-blue-200">
              Welcome! Describe your symptoms and I'll help predict possible conditions.
              <br />
              <span className="text-sm text-gray-500 dark:text-blue-300">
                Note: This is not a substitute for professional medical advice.
              </span>
            </p>
          </div>
        </div>

        {/* Messages */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-3xl p-4 rounded-lg ${
                message.role === "user"
                  ? "bg-green-100 dark:bg-green-800 text-gray-800 dark:text-green-100"
                  : "bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm dark:text-gray-100"
              }`}
            >
              {message.content.split("**").map((text, i) => 
                i % 2 === 1 ? (
                  <strong key={i} className="text-green-600 dark:text-green-300">{text}</strong>
                ) : (
                  <span key={i}>{text}</span>
                )
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-3xl p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm rounded-lg">
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <div className="animate-pulse"><i>thinking...</i></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Describe your symptoms..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors dark:bg-green-600 dark:hover:bg-green-700"
            disabled={!inputMessage.trim() || loading}
          >
            {loading ? "Analyzing..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
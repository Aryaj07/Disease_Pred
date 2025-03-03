"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const API_BASE_URL = "http://127.0.0.1:8000/api";
  const [token, setToken] = useState<string | null>(null);

  // ✅ Ensure localStorage is accessed client-side only
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!storedToken) {
      router.push("/dashboard");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  // ✅ Fetch chat history when token is set
  useEffect(() => {
    if (token) fetchChatHistory();
  }, [token]);

  // ✅ Apply dark mode theme dynamically
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/get_chat_history/", {
        user_id: 1,
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Failed to fetch chat history", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  // ✅ Add a loading state for refresh button
const [refreshing, setRefreshing] = useState(false);

// ✅ Function to manually fetch chat history
const handleRefreshChat = async () => {
  setRefreshing(true);
  try {
    console.log("🔄 Refreshing chat history...");
    await fetchChatHistory();
  } finally {
    setRefreshing(false);
  }
};


  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const newMessage: Message = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/predict/",
        { symptoms: inputMessage },
        { timeout: 180000 }
      );

      const botResponse: Message = {
        role: "assistant",
        content: `Based on your symptoms, the predicted condition is:\n\n**${response.data.predicted_disease}**\n\nPlease consult a healthcare professional for accurate diagnosis.`,
      };

      setMessages((prev) => [...prev, botResponse]);

      await axios.post(
        "http://127.0.0.1:8000/api/save_message/",
        {
          user_id: 1, // Dynamically fetch the logged-in user's ID
          messages: [newMessage, botResponse]
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    } catch {
      const errorResponse: Message = {
        role: "assistant",
        content: "⚠️ Unable to process your request. Please try again later.",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          ⚕️ Health Assistant
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 text-white bg-blue-500 rounded shadow-md hover:bg-blue-600"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push("/nearby-doctor")}
            className="p-2 text-white bg-blue-500 rounded shadow-md hover:bg-blue-600"
          >
            Nearby Doctors
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ✅ Refresh Chat Button */}
    <div className="p-4 flex justify-center">
      <button 
        onClick={handleRefreshChat} 
        className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:opacity-50"
        disabled={refreshing}
      >
        {refreshing ? "Refreshing..." : "🔄 Refresh Chat"}
      </button>
    </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* System Greeting */}
        <div className="flex justify-center">
          <div className="max-w-3xl w-full text-center p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-gray-600 dark:text-blue-200">
              Welcome! Describe your symptoms and I will help predict possible conditions.
              <br />
              <span className="text-sm text-gray-500 dark:text-blue-300">
                Note: This is not a substitute for professional medical advice.
              </span>
            </p>
          </div>
        </div>

        {/* Messages (Including History) */}
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-3xl p-4 rounded-lg ${
                message.role === "user"
                  ? "bg-green-100 dark:bg-green-800 text-gray-800 dark:text-green-100"
                  : "bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm dark:text-gray-100"
              }`}
            >
              {message.content.split("**").map((text, i) =>
                i % 2 === 1 ? (
                  <strong key={i} className="text-green-600 dark:text-green-300">
                    {text}
                  </strong>
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
                <div className="animate-pulse">
                  <i>Thinking...</i>
                </div>
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
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            disabled={!inputMessage.trim() || loading}
          >
            {loading ? "Analyzing..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

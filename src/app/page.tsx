"use client";
import { useRouter } from 'next/navigation';

export default function GetStarted() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/login');
  };

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-orange-100 to-yellow-200 overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://source.unsplash.com/1600x900/?sunrise,people"
          alt="Warm Welcome Background"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Content */}
      <div className="relative text-center z-10 bg-white/60 backdrop-blur-md p-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 animate-fade-in-down">
          Welcome to Your New Journey!
        </h1>
        <p className="text-lg text-gray-600 mb-8 animate-fade-in-up">
          Start your adventure with us today.
        </p>
        <button
          onClick={handleClick}
          className="px-8 py-4 bg-orange-500 text-white text-xl font-semibold rounded-lg shadow-lg hover:bg-orange-600 hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Get Started
        </button>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-yellow-200 to-transparent"></div>

      {/* Additional Styles */}
      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 1.5s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1.5s ease-out;
        }
      `}</style>
    </div>
  );
}

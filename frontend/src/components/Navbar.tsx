"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  const router = useRouter();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.push("/login");
  };
  
  return (
    <section className='flex w-full items-center justify-center p-2'>
        <div className='flex justify-center items-center ml-auto gap-x-4'>
      <a href="/dashboard" className="p-2 ml-auto text-white bg-blue-500 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 active:scale-95"> 
        Dashboard
      </a>
      <a href="/nearby-doctor" className="p-2 ml-auto text-white bg-blue-500 rounded shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform transform hover:scale-105 active:scale-95"> 
        Nearby Doctors
      </a>
        </div>
      <button
        onClick={handleLogout}
        className="p-2 text-white ml-auto mr-2 bg-red-500 rounded shadow-md hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition-transform transform hover:scale-105 active:scale-95"
      >
        Logout
      </button>
    </section>
  );
}

export default Navbar;

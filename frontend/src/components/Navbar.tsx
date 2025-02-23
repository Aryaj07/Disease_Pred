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

}

export default Navbar;

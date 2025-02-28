// import Navbar from '@/components/Navbar';
import React from 'react'

interface MainLayoutProps {
    children:React.ReactNode;
}

export default function MainLayout({children}:MainLayoutProps){
    return(
        <div className='flex flex-col w-full h-screen'>
            {/* <Navbar /> */}
            {children}
        </div>
    )
}
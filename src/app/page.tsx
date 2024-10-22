"use client";

import Spline from '@splinetool/react-spline/next';
import React, { useEffect, useState } from 'react';
import './globals.css'; // Import your global CSS file

export default function Home() {
  const [isAnimationVisible, setAnimationVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationVisible(false);
    }, 3000); // Adjust the delay as needed for the fade-out effect

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div
        id="spline-animation"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ${isAnimationVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
          width: '100vw',
          height: '100vh',
          pointerEvents: isAnimationVisible ? 'auto' : 'none', // Prevent interaction when invisible
        }}
      >
        <Spline
          scene="https://prod.spline.design/YbvEj6rcezUmzA-H/scene.splinecode" 
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      <nav
        className={`absolute transition-opacity duration-1000 ${isAnimationVisible ? 'opacity-0' : 'opacity-100'}`}
        style={{
          top: '38px',
          left: '189.76px',
          width: '1063.24px',
          height: '79.34px',
        }}
      >
        <div className="flex justify-between items-center h-full">
          <div className="text-3xl font-bold">Brev</div>
          <ul className="flex space-x-8 text-lg">
            <li><a href="#about" className="hover:text-gray-400">about</a></li>
            <li><a href="#pricing" className="hover:text-gray-400">pricing</a></li>
            <li><a href="#contact" className="hover:text-gray-400">contact</a></li>
            <li><a href="#nfts" className="hover:text-gray-400">buy nfts</a></li>
          </ul>
        </div>
      </nav>

      <main className={`flex flex-col items-center justify-center text-center mt-16 transition-opacity duration-1000 ${isAnimationVisible ? 'opacity-0' : 'opacity-100'}`}>
        <h1
          className="text-5xl font-bold absolute"
          style={{
            top: '212px',
            left: '190px',
            width: '305px',
            height: '216px',
          }}
        >
          You got this, brev!
        </h1>
        <p
          className="text-base absolute"
          style={{
            top: '379px',
            left: '190px',
            width: '396px',
            height: '83px',
          }}
        >
          Your go-to tool for smarter learning, helping you stay on top of your game without the stress.
        </p>
        <a
          href="/responsePage"
          className="bg-blue-600 text-white rounded-full text-base font-medium hover:bg-blue-700 absolute flex items-center justify-center"
          style={{
            top: '501px',
            left: '188px',
            width: '139px',
            height: '51px',
          }}
        >
          Start Brewing
        </a>
      </main>
    </div>
  );
}

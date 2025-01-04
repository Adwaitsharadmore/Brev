"use client"
import React, { useState } from 'react'
import ScrollProgress from "@/components/ui/scroll-progress";
import Link from 'next/link';


    
export default function navbar() {

      const [isOpen, setIsOpen] = useState(false);

      const toggleMenu = () => {
        setIsOpen(!isOpen);
      };
      const handleScroll = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };
  return (
    <div className="w-screen sticky top-0 z-50 bg-[#f8f6ef] supports-backdrop-blur:bg-background/90 bg-background/40 backdrop-blur-lg justify-between gap-between">
      <ScrollProgress className="top-[65px]" />
      <div className="w-3/4 mx-auto gap-between justify-between">
        <div className="flex justify-between items-center px-4 py-3 gap-between">
          <div className="text-[#0023FF] text-3xl sm:text-4xl font-extrabold font-inter capitalize">
            <Link href="/">Brev</Link>
          </div>
          <div className="sm:hidden">
            <button
              onClick={toggleMenu}
              className="text-[#0023FF] hover:text-[#0023FF] transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div className="hidden sm:flex gap-4 sm:gap-6 md:gap-8">
            <div
              onClick={() => handleScroll("about")}
              className="text-[#0023FF] hover:text-[#0023FF] cursor-pointer"
            >
              Key Features
            </div>
            <div
              onClick={() => handleScroll("features")}
              className="text-[#0023FF] hover:text-[#0023FF] cursor-pointer"
            >
              How to Brev
            </div>
            <div
              className="text-[#0023FF] hover:text-[#0023FF] cursor-pointer"
              onClick={() => handleScroll("story")}
            >
              Our Story
            </div>
            <div
              className="text-[#0023FF] hover:text-[#0023FF] cursor-pointer"
              onClick={() => handleScroll("contact")}
            >
              Contact Us
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden mt-4 items-center text-center">
          <div>
            <div
              className="hover:text-[#0023FF] text-black"
              onClick={() => handleScroll("features")}
            >
              key features
            </div>
          </div>
          <div>
            <div
              className="hover:text-[#0023FF] text-black"
              onClick={() => handleScroll("story")}
            >
              Our story
            </div>
          </div>
          <div>
            <div
              className="hover:text-[#0023FF] text-black"
              onClick={() => handleScroll("about")}
            >
              how to brev
            </div>
          </div>
          <div
            className="hover:text-[#0023FF] text-black"
            onClick={() => handleScroll("contact")}
          >
            contact us
          </div>
        </div>
      )}
    </div>
  );
}

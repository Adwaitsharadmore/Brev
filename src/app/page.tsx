"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useEffect } from "react";
import Typewriter from "./typewriter";
import Marquee from "@/components/ui/marquee";
import { MarqueeDemo } from './marque'
import { BentoDemo } from './bentogrid'
import ShimmerButton from "@/components/ui/shimmer-button";
import { ShimmerButtonDemo } from './shimmer'
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import BlurFade from "@/components/ui/blur-fade";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import ScrollProgress from "@/components/ui/scroll-progress";
import BoxReveal from "@/components/ui/box-reveal";
import { DockDemo } from "./dock";
import { Dock } from "@/components/magicui/dock";

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      ref={ref}
      className={`py-20 ${className}`}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};
 

const HomePage = () => {

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
    
 
 const [width, setWidth] = useState(0);
  const [duplicatedImages, setDuplicatedImages] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

   const toggleMenu = () => {
     setIsOpen(!isOpen);
   };

  const images = [
    "/images/work1.jpg",
    "/images/work2.PNG",
    "/images/work3.PNG",  
    "/images/work4.png",
    "/images/work5.png",
    "/images/work6.png",
    "/images/work7.png",
    "/images/work8.png",
    "/images/work9.png",
    "/images/work10.png",
    "/images/work11.png",
    "/images/work12.png",
    "/images/work13.png",
  ];
  useEffect(() => {
    // Create an array with enough duplicates to ensure smooth scrolling
    setDuplicatedImages([...images, ...images, ...images, ...images]);
  }, []);

  useEffect(() => {
    // Calculate the total width of the images container
    const calculateWidth = () => {
      const imageWidth = 320; // 300px width + 20px margin
      return duplicatedImages.length * imageWidth;
    };
    setWidth(calculateWidth());
  }, [duplicatedImages]);

   
  const router = useRouter();


  const handleStartBreving = () => {
    router.push("/responsePage");
  };

  return (
    <div>
      <div className="w-screen h-screen items-center scroll-smooth">
        <div className="mx-auto flex flex-col items-center">
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

          <BlurFade delay={0.25} inView>
            <section id="about" className="about">
              <motion.div className="relative mx-auto pt-[200px] md:items-center justify-center my-50 pb-50">
                <div className="flex flex-col md:items-center items-center justify-center md:leading-tight">
                  <div className="text-black text-4xl md:text-center text-center sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-semibold leading-tight tracking-tighter font-Inter">
                    Your go-to tool for smarter learning
                  </div>{" "}
                  <div className="text-black md:text-center text-center md:items-start items-center md:w-[53%] text-lg md:text-2xl font-light md:leading-none tracking-tighter font-Inter pb-2">
                    acheive more with less stress
                  </div>
                  <div className="z-10 pt-5">
                    <ShimmerButtonDemo></ShimmerButtonDemo>
                  </div>
                </div>

                {/* <div className="items-center hidden md:flex-col md:flex justify-center mt-[-30px] w-[100%]">
                <Image
                  width={500}
                  height={300}
                  src="/images/mainlogo.svg"
                  alt="Meeet"
                />
                <span className="text-[#0023ff] bg-white px-2 font-inter font-bold text-3xl">
                  <Typewriter></Typewriter>
                </span>
              </div> */}
              </motion.div>
            </section>

            <section id="features">
              <div className="bg-[#f8f6ef] pt-8 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-[200px] mx-auto my-4 sm:my-6 md:my-8 lg:my-10">
                <div className="text-black md:flex md:flex-col flex text-center md:text-start gap-2 md:gap-0">
                  <div>
                    {" "}
                    <span className="break-words font-bold text-5xl sm:text-5xl md:text-6xl tracking-tighter leading-none">
                      key features{" "}
                    </span>
                  </div>
                </div>
              </div>
              {/* <div className="grid grid-cols-1 grid-flow-col md:grid-cols-3 justify-between w-full pb-8 sm:pb-12 md:pb-16 lg:pb-20">
                <div className="md:col-span-2 items-center md:items-start text-[#F8F6EF] font-inter text-base sm:text-lg md:text-xl space-y-4">
                  <div className="bg-black p-7 rounded-2xl md:w-[75%] w-[100%]">
                    {" "}
                    <span className="text-white font-inter text-2xl md:text-3xl font-semibold tracking-tighter">
                      Cheat sheet generation
                    </span>
                    <div className="text-white font-inter text-xl tracking-tighter font-Inter pt-2">
                      Quickly convert detailed notes into concise, organized
                      cheat sheets that focus on essential topics. Save time and
                      ace exams with effective study tools.
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex-col md:flex">
                  <HeroVideoDialog
                    className="dark:hidden block"
                    animationStyle="top-in-bottom-out"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                    thumbnailAlt="Hero Video"
                  />
                </div>
              </div>
              <div className="bg-[#f8f6ef] grid grid-cols-1 grid-flow-col md:grid-cols-3 w-full pb-8 sm:pb-12 md:pb-16 lg:pb-20">
                <div className="hidden md:flex-col col-span-1 md:flex">
                  <HeroVideoDialog
                    className="dark:hidden block"
                    animationStyle="top-in-bottom-out"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                    thumbnailAlt="Hero Video"
                  />
                </div>
                <div className="col-span-3 text-[#F8F6EF] font-inter place-items-end text-base sm:text-lg md:text-xl space-y-4 ">
                  <div className="bg-black p-7 rounded-2xl md:w-[75%] w-[100%]">
                    {" "}
                    <span className="text-white font-inter text-2xl md:text-3xl font-semibold tracking-tighter">
                      Practice Quizzes
                    </span>
                    <div className="text-white font-inter text-xl tracking-tighter font-Inter pt-2">
                      Test your knowledge with AI-generated quizzes tailored to
                      your notes. Identify weak areas and focus on improvement
                      for exam success.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between w-full pb-[100px]">
                <div className="col-span-2 text-[#F8F6EF] font-inter text-base sm:text-lg md:text-xl space-y-4">
                  <div className="bg-black p-7 rounded-2xl md:w-[75%] w-[100%]">
                    {" "}
                    <span className="text-white font-inter text-2xl md:text-3xl font-semibold tracking-tighter">
                      Targeted Quizzes
                    </span>
                    <div className="text-white font-inter text-xl tracking-tighter font-Inter pt-2">
                      Quickly convert detailed notes into concise, organized
                      cheat sheets that focus on essential topics. Save time and
                      ace exams with effective study tools.
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex-col md:flex w-[75%]">
                  <HeroVideoDialog
                    className="dark:hidden block"
                    animationStyle="top-in-bottom-out"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                    thumbnailAlt="Hero Video"
                  />
                </div>
              </div>
              <div className="flex justify-between w-full "></div> */}
              <div className="md:p-0 p-5">
                <BentoDemo></BentoDemo>
              </div>
            </section>
          </BlurFade>
        </div>

        <section id="story">
          {" "}
          <div className="h-auto relative scroll-smooth">
            <div className="w-3/4 mx-auto flex flex-col items-start">
              <div>
                <div
                  className="pt-[100px] flex"
                  style={{
                    color: "black",
                    fontSize: "69px",
                    font: "Inter",
                    fontWeight: 600,
                    lineHeight: "61px",
                    wordWrap: "break-word",
                  }}
                >
                  Our Story.
                  <div
                    className="pt-5 text-black"
                    style={{
                      fontSize: "20px",
                      font: "Inter",
                      fontWeight: 200,
                      lineHeight: "27.50px",
                      wordWrap: "break-word",
                    }}
                  >
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <div className="bg-[#0023FF] text-white p-5 rounded-2xl text-2xl w-[90%]">
                      Brev began as an ambitious idea during a hackathon at
                      Arizona State University. What started as a project for a
                      24-hour challenge turned into something much bigger. We
                      were a team of four passionate students who worked
                      tirelessly day and night to build a full-stack web app.
                      Though we were confident in our creation and excited about
                      its potential, the hackathon didn’t result in any awards
                      or recognition. But we didn’t let that stop us. Instead of
                      giving up, we saw this as an opportunity to turn Brev into
                      something greater—a full-fledged startup with a mission to
                      help students conquer their exams. Our vision became
                      clear: to relieve the stress and anxiety that come with
                      exam preparation and create the best study tool out there.
                      Since then, we’ve poured countless hours into Brev,
                      refining it to be the ultimate study companion. What began
                      as a simple hackathon idea is now a tool designed to help
                      students maximize their study time, reduce stress, and
                      excel in their exams. We’re just getting started, and
                      we’re excited for the journey ahead.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*<div
            className="pt-20"
            style={{
              overflow: "hidden",

              position: "relative",
            }}
          >
            <motion.div
              style={{
                display: "flex",
              }}
              animate={{
                x: [-width / 2, 0],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            >
              {duplicatedImages.map((src, index) => (
                <motion.img
                  key={index}
                  src={src}
                  style={{
                    width: "500px",
                    height: "500px", // Same as width to make it square
                    objectFit: "cover",
                    marginRight: "20px",
                    borderRadius: "10px", // Optional: for rounded corners
                  }}
                  whileHover={{ scale: 1.1 }}
                  alt={`Infinite scroll image ${index + 1}`}
                />
              ))}
            </motion.div>
          </div> */}
            <MarqueeDemo></MarqueeDemo>
          </div>
        </section>

        {/* <div className="w-screen relative scroll-smooth">
          <section id="contact">
            {" "}
            <div className="bg-[#0023FF] flex items-center w-full">
              <div className="pr-20">
                <div className="pt-[100px] text-center text-white">
                  <div className="text-7xl font-inter">Brev</div>
                  <div className="text-2xl font-inter">© 2021 Brev, Inc.</div>
                </div>
              </div>
              <div>
                {" "}
                <div className="pt-[100px] text-center font-inter text-7xl items-center flex-col justify-center">
                  Follow us on our socials.
                </div>
                <div className="flex justify-center items-center gap-20 p-10 ">
                  <Link href="">
                    <FaXTwitter className="text-7xl hover:text-[#0023FF]" />
                  </Link>
                  <Link href="https://www.instagram.com/meetbrev/">
                    <FaInstagram className="text-7xl hover:text-[#0023FF]" />
                  </Link>
                  <Link href="">
                    <FaYoutube className="text-7xl hover:text-[#0023FF]" />
                  </Link>
                  <Link href="">
                    <FaLinkedin className="text-7xl hover:text-[#0023FF]" />
                  </Link>
                </div>
                <div className="flex justify-center pb-[150px]">
                  <Link href="">
                    <button
                      className="px-8 py-4 bg-white text-black"
                      style={{
                        borderRadius: "31px",

                        fontSize: "20px",
                        font: "Inter",
                        lineHeight: "27.50px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Email Us!
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section> 
        </div> */}

        <section>
          <footer className="bg-[#0023FF]">
            
          </footer>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

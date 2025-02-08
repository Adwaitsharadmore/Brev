"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaTiktok, FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useEffect } from "react";
import Typewriter from "./typewriter";
import Marquee from "@/components/ui/marquee";
import { MarqueeDemo } from "./marque";
import { BentoDemo } from "./bentogrid";
import {ShimmerButton} from "@/components/magicui/shimmer-button";
import { ShimmerButtonDemo } from "./shimmer";
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
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Linkedin } from "lucide-react";
import { Video } from "lucide-react";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { useRef } from "react";

export const runtime = 'edge';


const Section = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
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

const content = [
  {
    title: "Personalized Cheat Sheets",
    description:
      "Transform your study materials into perfectly organized cheat sheets in seconds. Whether you need a quick-glance summary or an in-depth review, our AI crafts custom study guides that highlight exactly what you need to know.",
    videoSrc: "/videos/cheatsheet.mp4",
  },
  {
    title: "Memory-Boosting Mnemonics",
    description:
      "Turn complex concepts into unforgettable memory hooks. Upload your study material and watch as clever acronyms, rhymes, and memorable phrases make learning effortless. No more struggling to remember key facts—our mnemonics stick with you.",
    videoSrc: "/videos/mnemonics.mp4",
  },
  {
    title: "Adaptive testing and feedback",
    description:
      "Take the guesswork out of exam prep with adaptive quizzes that evolve with your learning. Our system identifies your knowledge gaps and automatically adjusts to strengthen your weak spots, ensuring you're fully prepared for exam day.",
    videoSrc: "/videos/testing.mp4", // Assuming you have this video
  },
];

const HomePage = () => {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
          <div className="w-screen sticky top-0 z-50 supports-backdrop-blur:bg-background/90 bg-background/40 backdrop-blur-lg justify-between gap-between">
            <ScrollProgress className="top-[60px]" />
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
                    onClick={() => handleScroll("features")}
                    className="text-[#0023FF] hover:text-[#0023FF] cursor-pointer"
                  >
                    Key Features
                  </div>
                  <div
                    onClick={() => handleScroll("howtobrev")}
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
                    onClick={() => handleScroll("howtobrev")}
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
            <section id="about" className="pt-[200px]">
              <motion.div className="relative mx-auto md:items-center justify-center my-50 pb-50">
                <div className="flex flex-col md:items-center items-center justify-center md:leading-tight">
                  <div className="text-black text-4xl md:text-center text-center sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-semibold leading-tight tracking-tighter font-Inter">
                    Streamline your exam prep with{" "}
                    <span className="text-[#2343fdfa]"> Brev</span>
                  </div>

                  <div className="text-transparent mt-2 bg-clip-text bg-gradient-to-r from-blue-400 to-blue-900 md:text-center text-center md:items-start items-center md:w-[53%] text-xl md:text-3xl font-medium md:leading-relaxed tracking-tight font-Inter pb-4">
                    achieve more with less stress
                  </div>
                  <div className="z-10 pt-5">
                    <ShimmerButton>Start Breving</ShimmerButton>
                  </div>
                </div>
              </motion.div>
            </section>
            <section id="howtobrev" className="mt-20 md:mt-32">
              <ContainerScroll
                titleComponent={
                  <>
                    <h1 className="text-4xl font-semibold text-black dark:text-white mb-8 md:mb-12">
                      How to use <br />
                      <span className="text-4xl md:text-[7rem] font-bold mt-1 leading-none">
                        Brev
                      </span>
                    </h1>
                  </>
                }
              >
                <div>
                  {/* Add your content here */}
                  <video autoPlay muted loop className="rounded-lg w-[100%]">
                    <source src="/videos/how to use brev tut.mp4" />
                  </video>
                </div>
              </ContainerScroll>
            </section>

            <section className="w-full justify-center items-center flex flex-col md:pt-10 pt-0">
              <div
                className="w-full pt-8 mx-auto my-0 md:my-8 scroll-mt-20"
                id="features"
              >
                <div className="text-black md:flex md:flex-col flex text-center md:text-start gap-2 md:gap-0">
                  <div>
                    <span className="break-words font-bold text-5xl sm:text-5xl md:text-6xl tracking-tighter leading-none bg-gradient-to-r from-blue-800 to-blue-700 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                      key features
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <StickyScroll content={content} />
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
                    <div className="transform hover:scale-105 transition-all duration-300 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg">
                      <div className="max-w-3xl mx-auto">
                        <div className="text-lg md:text-xl text-gray-700 leading-relaxed space-y-4">
                          Born from a hackathon project, Brev evolved into a
                          mission-driven startup dedicated to transforming exam
                          preparation. We're building the ultimate study
                          companion that helps students maximize efficiency,
                          minimize stress, and achieve excellence. Our journey
                          is just beginning, and we're excited to revolutionize
                          how students prepare for their exams.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <MarqueeDemo></MarqueeDemo>
          </div>
        </section>
        <section id="contact">
          <footer className="p-4 bg-[#0023FF] sm:p-6 dark:bg-gray-800">
            <div className="mx-auto max-w-screen-xl">
              <div className="md:flex md:justify-between">
                <div className="mb-6 md:mb-0">
                  <a href="#" className="flex items-center">
                    <img
                      src="/images/2.png"
                      className="mr-1 h-12 rounded-full"
                      alt="Brev Logo"
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                      Brev
                    </span>
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                  <div>
                    <h2 className="mb-6 text-sm font-semibold text-white uppercase dark:text-white">
                      Navigate
                    </h2>
                    <ul className="text-gray-100 dark:text-gray-400">
                      <li className="mb-4">
                        <a href="#" className="hover:underline">
                          Homepage
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline">
                          Start Breving
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="mb-6 text-sm font-semibold text-white uppercase dark:text-white">
                      Follow us
                    </h2>
                    <ul className="text-gray-100 dark:text-gray-400 space-y-4">
                      <li>
                        <a
                          href="https://www.instagram.com/meetbrev/"
                          className="hover:underline "
                        >
                          Instagram
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.tiktok.com/@meetbrev"
                          className="hover:underline"
                        >
                          TikTok
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://x.com/meetbrev"
                          className="hover:underline"
                        >
                          X
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://discord.gg/4eeurUVvTy"
                          className="hover:underline"
                        >
                          Discord
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.linkedin.com/company/meetbrev"
                          className="hover:underline"
                        >
                          Linkedin
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="mb-6 text-sm font-semibold text-white uppercase dark:text-white">
                      Legal
                    </h2>
                    <ul className="text-gray-100 dark:text-gray-400">
                      <li className="mb-4">
                        <a href="#" className="hover:underline">
                          Privacy Policy
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline">
                          Terms &amp; Conditions
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
              <div className="sm:flex sm:items-center sm:justify-between">
                <span className="text-sm text-white sm:text-center dark:text-gray-400">
                  © 2025{" "}
                  <a href="https://meetbrev.com" className="hover:underline">
                    Brev™
                  </a>
                  . All Rights Reserved.
                </span>
                <div className="flex mt-4 space-x-6 text-white sm:justify-center sm:mt-0">
                  <FaLinkedin
                    className="hover:text-slate-400"
                    href="https://www.linkedin.com/company/meetbrev"
                  />
                  <FaYoutube className="hover:text-slate-400" href="#" />
                  <FaInstagram
                    className="hover:text-slate-400"
                    href="https://www.instagram.com/meetbrev/"
                  />
                  <FaXTwitter
                    className="hover:text-slate-400"
                    href="https://x.com/meetbrev"
                  />
                  <FaTiktok
                    className="hover:text-slate-400"
                    href="https://www.tiktok.com/@meetbrev"
                  />
                </div>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

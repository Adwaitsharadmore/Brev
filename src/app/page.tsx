"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import Navbar from "./Navbar";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useEffect } from "react";
import { motion } from "framer-motion";



const HomePage = () => {
 const [width, setWidth] = useState(0);
 const [duplicatedImages, setDuplicatedImages] = useState<string[]>([]);

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
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="w-full h-screen relative bg-black scroll-smooth">
        <div className="w-3/4 mx-auto flex flex-col items-start">
          <div className="w-full bg-black flex justify-between items-center pt-10 pb-5">
            <div className="text-white text-4xl font-extrabold font-inter capitalize">
              <Link href="/">Brev</Link>
            </div>
            <div className="flex gap-8">
              <div className="text-white text-lg font-normal font-inter hover:text-[#0023FF] cursor-pointer">
                About
              </div>
              <div className="text-white text-lg font-normal font-Inter hover:text-[#0023FF] cursor-pointer">
                Pricing
              </div>
              <div className="text-white text-lg font-normal font-Inter  hover:text-[#0023FF] cursor-pointer">
                Contact
              </div>
            </div>
          </div>
          <motion.div
            className="w-full pt-[100px] mx-auto my-50 pb-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="text-white text-8xl font-semibold leading-tight font-Inter">
              You got{" "}
            </div>
            <div className="text-white text-8xl font-semibold leading-tight font-Inter">
              {" "}
              this, Brev!
            </div>
            <img
              className="Meeet11470x8331"
              style={{
                width: "459px",
                height: "544px",
                left: "800px",
                top: "115px",
                position: "absolute",
              }}
              src="/images/sphere.png"
              alt="Meeet"
            />
            <div className="text-white text-[2vw] md:text-3xl font-light leading-tight font-Inter mt-4">
              Your go-to tool for smarter learning,
            </div>
            <div className="text-white text-[2vw] md:text-3xl font-light leading-tight font-Inter mt-4">
              helping you achieve{" "}
              <span className="bg-white text-[#0023FF] italic">
                more with less
              </span>
            </div>
            <div className="text-white text-[2vw] md:text-3xl font-light leading-tight font-Inter mt-4 flex items-center">
              <span>stress and stay on top of your game.</span>
            </div>
            <div className="pt-5">
              <button
                className="px-8 py-4 hover:bg-[#3526ff] bg-[#0023FF]"
                onClick={handleStartBreving}
                style={{
                  borderRadius: "31px",
                  color: "white",
                  fontSize: "18px",
                  font: "Inter",
                  lineHeight: "27.50px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Start Breving
              </button>
            </div>
          </motion.div>

          <div className="w-full pt-[50px] sm:pt-[80px] md:pt-[100px] lg:pt-[150px] mx-auto my-5 sm:my-8 lg:my-10">
            <div className="flex flex-col -space-y-4 sm:-space-y-6 md:-space-y-7 lg:-space-y-8">
              <span className="break-words font-bold text-4xl sm:text-6xl md:text-7xl lg:text-9xl">
                Key
              </span>
              <span className="break-words font-bold text-4xl sm:text-6xl md:text-7xl lg:text-9xl">
                Features
              </span>
            </div>
          </div>

          <div className="flex justify-between w-full pb-[100px]">
            <div className="text-[#F8F6EF] font-inter text-2xl">
              <span className="bg-[#0023FF] text-white font-inter text-4xl font-semibold">
                Cheat sheet generation--
              </span>
              <br />
              <span className="bg-[#0023FF] text-white font-inter text-4xl font-semibold">
                precise or detailed
                <br />
              </span>
              <br />
              Quickly convert lengthy notes into concise, organized <br /> cheat
              sheets that highlight essential information and core <br />
              concepts. This feature saves time and provides students <br />{" "}
              with an efficient way to review high-yield information <br />{" "}
              before exams.
              <div>
                <div className="w-full flex ">
                  <div>
                    <svg
                      width="163"
                      height="175"
                      viewBox="0 0 163 175"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M45.8684 96.8821C46.5224 100.78 44.0743 116.97 42.7045 117.826C41.5556 118.544 43.9156 122.37 49.8366 117.883C54.753 114.148 57.5392 112.904 64.3827 111.32C67.9318 110.51 68.9781 109.235 66.7475 108.517C65.0275 107.977 59.5398 108.88 55.5582 110.374C53.372 111.201 53.5545 110.756 56.8556 106.747C64.8206 97.1734 72.8276 92.5841 90.6823 87.4319C111.801 81.3581 122.457 73.0428 123.345 61.9278C123.728 57.1332 119.231 57.9978 117.822 63.0193C114.83 73.6681 107.66 78.811 87.0887 85.1222C68.0037 90.9604 60.4929 95.1153 53.0967 103.878C51.8921 105.293 50.8712 106.511 50.8049 106.552C50.7607 106.58 50.8313 105.169 50.9928 103.412C51.4584 98.1099 50.4512 95.2197 47.9893 94.7704C46.1076 94.4139 45.5379 94.9766 45.8684 96.8821Z"
                        fill="#F8F6EF"
                      />
                    </svg>
                    Precise Cheat Sheet: <br /> A concise summary ideal for{" "}
                    <br />
                    last-minute review.
                  </div>
                  <div>
                    <svg
                      width="255"
                      height="255"
                      viewBox="0 0 255 255"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M184.368 153.116C183.625 158.471 188.755 182.472 191 184.164C192.882 185.582 189.419 190.253 179.656 181.816C171.55 174.797 167.022 172.067 156.013 167.468C150.304 165.1 148.542 162.92 152.036 162.652C154.732 162.465 163.532 165.626 169.98 169.121C173.522 171.05 173.197 170.351 167.64 163.489C154.237 147.076 141.147 137.781 112.347 124.326C78.2828 108.44 60.6949 92.9105 58.4337 76.7028C57.4582 69.7112 64.6804 72.4808 67.305 80.1464C72.8778 96.4038 84.6776 106.206 117.888 122.245C148.698 137.101 160.965 145.605 173.401 160.664C175.426 163.1 177.143 165.19 177.251 165.272C177.324 165.327 177.104 163.283 176.713 160.714C175.568 152.968 176.95 149.176 180.832 149.372C183.799 149.503 184.748 150.502 184.368 153.116Z"
                        fill="#F8F6EF"
                      />
                    </svg>
                    Detailed Cheat Sheet: <br />A comprehensive, in-depth
                    version that’s <br /> perfect for studying a subject from
                    scratch, <br />
                    with all necessary information included to <br />
                    thoroughly cover the topic.
                  </div>
                </div>
              </div>
            </div>

            <div>
              {" "}
              <img
                className="PexelsJeshootsCom1474587146991"
                style={{
                  width: "100%",
                  maxWidth: "auto",
                  height: "auto",
                }}
                src="/images/Cheatsheetboard.svg"
                alt="Pexels Jeshoots"
              />
            </div>
          </div>

          <div className="flex justify-between w-full pb-[100px]">
            <div>
              {" "}
              <img
                className="PexelsJeshootsCom1474587146991"
                style={{
                  width: "100%",
                  maxWidth: "auto",
                  height: "auto",
                }}
                src="/images/memoryaid.svg"
                alt="Pexels Jeshoots"
              />
            </div>
            <div className="text-[#F8F6EF] font-inter text-2xl text-end">
              <span className="bg-[#0023FF] text-white font-inter text-4xl font-semibold">
                Memory Aids & Mnemonics <br />
              </span>
              <br />
              Brev’s AI-powered mnemonic generator creates <br />
              personalized memory aids that cater to the student’s <br />{" "}
              learning style, making complex topics easier to retain. <br />{" "}
              These mnemonics leverage proven memory techniques— <br />
              like acronyms, visualization, and chunking—to reinforce <br />
              learning and aid long-term recall.
            </div>
          </div>

          <div className="flex justify-between w-full pb-[100px]">
            <div className="text-[#F8F6EF] font-inter text-2xl">
              <span className="bg-[#0023FF] text-white font-inter text-4xl font-semibold">
                Targeted Quizzes <br />
              </span>
              <br />
              Brev offers custom quizzes designed to test knowledge in <br />{" "}
              areas where students need the most practice. Through <br />
              adaptive question generation, Brev helps reinforce <br />
              understanding, identify knowledge gaps, and build exam <br />{" "}
              readiness.
            </div>
            <div>
              {" "}
              <img
                className="PexelsJeshootsCom1474587146991"
                style={{
                  width: "100%",
                  maxWidth: "auto",
                  height: "auto",
                }}
                src="/images/quiz.svg"
                alt="Pexels Jeshoots"
              />
            </div>
          </div>
          <div className="flex justify-between w-full pb-[100px]">
            <div>
              {" "}
              <img
                className="PexelsJeshootsCom1474587146991"
                style={{
                  width: "100%",
                  maxWidth: "auto",
                  height: "auto",
                }}
                src="/images/memoryaid.svg"
                alt="Pexels Jeshoots"
              />
            </div>
            <div className="text-[#F8F6EF] font-inter text-2xl ">
              <span className="bg-[#0023FF] text-white font-inter text-end text-4xl font-semibold">
                Feedback & Progress Tracking <br />
              </span>
              <div className="text-[#F8F6EF] font-inter text-2xl">
                <span className="text-start">
                  <br />
                  After each quiz, students receive detailed feedback, with{" "}
                  <br />
                  actionable insights into their strengths and areas needing{" "}
                  <br />
                  improvement. Brev tracks progress over time, helping <br />
                  students focus on weaker topics and measure their
                  <br /> improvement through tailored follow-up quizzes.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-auto relative bg-white scroll-smooth">
          <div className="w-3/4 mx-auto flex flex-col items-start">
            <div>
              <div
                className="pt-[100px] flex w-full"
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
                  <div className="bg-[#0023FF] text-white p-5 rounded-2xl text-3xl">
                    Brev began as an ambitious idea during a hackathon at
                    Arizona State University. What started as a project for a
                    24-hour challenge turned into something much bigger. We were
                    a team of four passionate students who worked tirelessly day
                    and night to build a full-stack web app. Though we were
                    confident in our creation and excited about its potential,
                    the hackathon didn’t result in any awards or recognition.
                    But we didn’t let that stop us.
                    <br />
                    <br />
                    Instead of giving up, we saw this as an opportunity to turn
                    Brev into something greater—a full-fledged startup with a
                    mission to help students conquer their exams. Our vision
                    became clear: to relieve the stress and anxiety that come
                    with exam preparation and create the best study tool out
                    there.
                    <br />
                    <br />
                    Since then, we’ve poured countless hours into Brev, refining
                    it to be the ultimate study companion. What began as a
                    simple hackathon idea is now a tool designed to help
                    students maximize their study time, reduce stress, and excel
                    in their exams. We’re just getting started, and we’re
                    excited for the journey ahead.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
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
          </div>
        </div>

        <div className="w-full relative bg-white scroll-smooth">
          <div className="w-3/4 pb-[200px] mx-auto flex flex-col items-start">
            <div className="items-center flex-col item-center justify-center w-full">
              <div
                className="pt-[200px] text-center text-black"
                style={{
                  fontSize: "170px",
                  font: "Inter",
                  fontWeight: 10,
                  wordWrap: "break-word",
                  letterSpacing: "-4px",
                  lineHeight: "1",
                }}
              >
                SHHH, there is more to come!
              </div>
              <div className="pt-5 flex justify-center w-full">
                <button
                  className="px-8 py-4"
                  onClick={handleStartBreving}
                  style={{
                    background: "#0023FF",
                    borderRadius: "31px",
                    color: "white",
                    fontSize: "18px",
                    font: "Inter",
                    lineHeight: "27.50px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Wanna know more?
                </button>
              </div>
            </div>
          </div>

          <footer className="bg-[#0023FF] flex justify-center items-center">
            <div className="pr-20">
              <div className="pt-[100px] text-center text-white">
                <div className="text-7xl font-inter">Brev</div>
                <div className="text-2xl font-inter">© 2021 Brev, Inc.</div>
              </div>
            </div>
            <div>
              {" "}
              <div className="pt-[100px] text-center font-inter text-7xl w-full items-center flex-col justify-center">
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
              <div className="flex justify-center w-full pb-[150px]">
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
          </footer>
        </div>
      </div>
    </>
  );
};

export default HomePage;

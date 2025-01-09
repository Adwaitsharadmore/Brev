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
import ShimmerButton from "@/components/ui/shimmer-button";
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
    title: "Collaborative Editing",
    description:
      "Work together in real time with your team, clients, and stakeholders. Collaborate on documents, share ideas, and make decisions quickly. With our platform, you can streamline your workflow and increase productivity.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Collaborative Editing
      </div>
    ),
  },
  {
    title: "Real time changes",
    description:
      "See changes as they happen. With our platform, you can track every modification in real time. No more confusion about the latest version of your project. Say goodbye to the chaos of version control and embrace the simplicity of real-time updates.",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        <Image
          src="/linear.webp"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Version control",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Version control
      </div>
    ),
  },
  {
    title: "Running out of content",
    description:
      "Experience real-time updates and never stress about version control again. Our platform ensures that you're always working on the most recent version of your project, eliminating the need for constant manual updates. Stay in the loop, keep your team aligned, and maintain the flow of your work without any interruptions.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Running out of content
      </div>
    ),
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
            <section id="about" className="pt-[250px]">
              <motion.div className="relative mx-auto md:items-center justify-center my-50 pb-50">
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
            <section id="howtobrev">
              <ContainerScroll
                titleComponent={
                  <>
                    <h1 className="text-4xl font-semibold text-black dark:text-white">
                      How to use <br />
                      <span className="text-4xl md:text-[7rem] font-bold mt-1 leading-none">
                        Brev
                      </span>
                    </h1>
                  </>
                }
              >
                <div className="space-y-4">
                  {/* Add your content here */}
                  <p className="text-black">Content goes here</p>
                </div>
              </ContainerScroll>
            </section>

            <section
              id="features"
              className="w-full justify-center items-center flex flex-col"
            >
              <div className="w-full bg-[#f8f6ef] pt-8 mx-auto my-4 sm:my-6 md:my-8 lg:my-5">
                <div className="text-black md:flex md:flex-col flex text-center md:text-start gap-2 md:gap-0">
                  <div>
                    {" "}
                    <span className="break-words font-bold text-5xl sm:text-5xl md:text-6xl tracking-tighter leading-none">
                      key features{" "}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <StickyScroll content={content} />
                {/* <BentoDemo></BentoDemo> */}
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
            <MarqueeDemo></MarqueeDemo>
          </div>
        </section>
        <section>
          <footer className="p-4 bg-[#0023FF] sm:p-6 dark:bg-gray-800">
            <div className="mx-auto max-w-screen-xl">
              <div className="md:flex md:justify-between">
                <div className="mb-6 md:mb-0">
                  <a href="https://flowbite.com" className="flex items-center">
                    <img
                      src="/images/mainlogo.svg"
                      className="mr-3 h-8 rounded-full"
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
                      Resources
                    </h2>
                    <ul className="text-gray-100 dark:text-gray-400">
                      <li className="mb-4">
                        <a
                          href="https://flowbite.com"
                          className="hover:underline"
                        >
                          Flowbite
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://tailwindcss.com/"
                          className="hover:underline"
                        >
                          Tailwind CSS
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="mb-6 text-sm font-semibold text-white uppercase dark:text-white">
                      Follow us
                    </h2>
                    <ul className="text-gray-100 dark:text-gray-400">
                      <li className="mb-4">
                        <a
                          href="https://github.com/themesberg/flowbite"
                          className="hover:underline "
                        >
                          Github
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
                  <a href="https://flowbite.com" className="hover:underline">
                    Flowbite™
                  </a>
                  . All Rights Reserved.
                </span>
                <div className="flex mt-4 space-x-6 text-white sm:justify-center sm:mt-0">
                  <a
                    href="#"
                    className=" hover:text-gray-900 dark:hover:text-white"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className=" hover:text-gray-900 dark:hover:text-white"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className=" hover:text-gray-900 dark:hover:text-white"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className=" hover:text-gray-900 dark:hover:text-white"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className=" hover:text-gray-900 dark:hover:text-white"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
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

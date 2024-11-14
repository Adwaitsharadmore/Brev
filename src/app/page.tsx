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
            className="w-full pt-[200px] mx-auto my-50 pb-50"
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
              <span className="break-words font-bold text-4xl sm:text-6xl md:text-7xl lg:text-9xl italic">
                KEY
              </span>
              <span className="break-words font-bold text-4xl sm:text-6xl md:text-7xl lg:text-9xl">
                FEATURES
              </span>
            </div>
          </div>

          <div className="flex justify-between w-full pb-[100px]">
            <div className="text-[#F8F6EF] font-inter text-2xl">
              <span className="bg-white text-black font-inter text-4xl font-semibold">
                Cheat sheet generation--
              </span>
              <br />
              <span className="bg-white text-black font-inter text-4xl font-semibold">
                precise or detailed
              </span>
              <br />
              Quickly convert lengthy notes into concise, organized <br /> cheat
              sheets that highlight essential information and core <br />
              concepts. This feature saves time and provides students <br />{" "}
              with an efficient way to review high-yield information <br />{" "}
              before exams.
              <div>
                <br />
                Precise Cheat Sheet: <br /> A concise summary ideal for
                last-minute review. <br /> <br />
                Detailed Cheat Sheet: <br />A comprehensive, in-depth version
                that’s <br /> perfect for studying a subject from scratch,{" "}
                <br />
                with all necessary information included to <br />
                thoroughly cover the topic.
              </div>
            </div>

            <div>
              {" "}
              <img
                className="PexelsJeshootsCom1474587146991"
                style={{
                  width: "325px",
                  height: "145px",
                  left: "747px",
                  top: "13px",
                }}
                src="/images/pexels-jeshoots-com-147458-714699.jpg"
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
                  width: "325px",
                  height: "145px",
                  left: "747px",
                  top: "13px",
                }}
                src="/images/pexels-jeshoots-com-147458-714699.jpg"
                alt="Pexels Jeshoots"
              />
            </div>
            <div className="text-[#F8F6EF] font-inter text-2xl text-end">
              <span className="bg-white text-black font-inter text-4xl font-semibold">
                Memory Aids & Mnemonics
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

          <div className="flex justify-between w-full">
            <div className="text-[#F8F6EF] font-inter text-2xl">
              <span className="bg-white text-black font-inter text-4xl font-semibold">
                Targeted Quizzes
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
                  width: "325px",
                  height: "145px",
                  left: "747px",
                  top: "13px",
                }}
                src="/images/pexels-jeshoots-com-147458-714699.jpg"
                alt="Pexels Jeshoots"
              />
            </div>
          </div>
          <div>
            <div
              className="pt-[200px] flex w-full"
              style={{
                color: "white",
                fontSize: "69px",
                font: "Inter",
                fontWeight: 600,
                lineHeight: "61px",
                wordWrap: "break-word",
              }}
            >
              Our Story.
              <div
                className="BrevBeganAsAnAmbitiousIdeaDuringAHackathonAtArizonaStateUniversityWhatStartedAsAProjectForA24HourChallengeTurnedIntoSomethingMuchBiggerWeWereATeamOfFourPassionateStudentsWhoWorkedTirelesslyDayAndNightToBuildAFullStackWebAppThoughWeWereConfidentInOurCreationAndExcitedAboutItsPotentialTheHackathonDidnTResultInAnyAwardsOrRecognitionButWeDidnTLetThatStopUsInsteadOfGivingUpWeSawThisAsAnOpportunityToTurnBrevIntoSomethingGreaterAFullFledgedStartupWithAMissionToHelpStudentsConquerTheirExamsOurVisionBecameClearToRelieveTheStressAndAnxietyThatComeWithExamPreparationAndCreateTheBestStudyToolOutThereSinceThenWeVePouredCountlessHoursIntoBrevRefiningItToBeTheUltimateStudyCompanionWhatBeganAsASimpleHackathonIdeaIsNowAToolDesignedToHelpStudentsMaximizeTheirStudyTimeReduceStressAndExcelInTheirExamsWeReJustGettingStartedAndWeReExcitedForTheJourneyAhead"
                style={{
                  color: "white",
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
                Brev began as an ambitious idea during a hackathon at Arizona
                State University. What started as a project for a 24-hour
                challenge turned into something much bigger. We were a team of
                four passionate students who worked tirelessly day and night to
                build a full-stack web app. Though we were confident in our
                creation and excited about its potential, the hackathon didn’t
                result in any awards or recognition. But we didn’t let that stop
                us.
                <br />
                <br />
                Instead of giving up, we saw this as an opportunity to turn Brev
                into something greater—a full-fledged startup with a mission to
                help students conquer their exams. Our vision became clear: to
                relieve the stress and anxiety that come with exam preparation
                and create the best study tool out there.
                <br />
                <br />
                Since then, we’ve poured countless hours into Brev, refining it
                to be the ultimate study companion. What began as a simple
                hackathon idea is now a tool designed to help students maximize
                their study time, reduce stress, and excel in their exams. We’re
                just getting started, and we’re excited for the journey ahead.
              </div>
            </div>
          </div>

          <div className="items-center flex-col item-center justify-center w-full">
            <div
              className="pt-[200px] text-center"
              style={{
                color: "white",
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
          <div className="pt-[260px] text-center font-bold font-inter text-7xl w-full items-center flex-col justify-center">
            Follow us on our socials.
          </div>
          <div className="w-full flex justify-between pt-[100px]">
            <Link href="">
              <FaXTwitter className="text-9xl hover:text-[#0023FF]" />
            </Link>
            <Link href="https://www.instagram.com/meetbrev/">
              <FaInstagram className="text-9xl hover:text-[#0023FF]" />
            </Link>
            <Link href="">
              <FaYoutube className="text-9xl hover:text-[#0023FF]" />
            </Link>
            <Link href="">
              <FaLinkedin className="text-9xl hover:text-[#0023FF]" />
            </Link>
          </div>
          <div className="pt-[150px] flex justify-center w-full pb-[150px]">
            <Link href="">
              <button
                className="px-8 py-4"
                style={{
                  background: "#0023FF",
                  borderRadius: "31px",
                  color: "white",
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
    </>
  );
};

export default HomePage;

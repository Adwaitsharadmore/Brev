"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";


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
      <div className="w-full h-screen relative bg-black">
        <div className="w-3/4 mx-auto flex flex-col items-start">
          <div className="w-full flex justify-between items-center pt-10 pb-5">
            <div className="text-white text-4xl font-extrabold font-inter capitalize">
              <Link href="/">Brev</Link>
            </div>
            <div className="flex gap-8">
              <div className="text-white text-lg font-normal font-inter">
                About
              </div>
              <div className="text-white text-lg font-normal font-Inter">
                Pricing
              </div>
              <div className="text-white text-lg font-normal font-Inter">
                Contact
              </div>
            </div>
          </div>
          <div className="w-full pt-[20px] mx-auto my-10">
            <div className="text-white text-[4vw] md:text-[69px] font-semibold leading-tight font-Inter">
              You got,{" "}
            </div>
            <div className="text-white text-[4vw] md:text-[69px] font-semibold leading-tight font-Inter">
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
              <span className="bg-white text-[#313eff] italic">
                more with less
              </span>
            </div>
            <div className="text-white text-[2vw] md:text-3xl font-light leading-tight font-Inter mt-4 flex items-center">
              <span>stress and stay on top of your game.</span>
            </div>
            <div className="pt-5">
              <button
                className="px-8 py-4"
                onClick={handleStartBreving}
                style={{
                  background: "#1D5DB6",
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
          </div>
        </div>

        <div
          className="Group42"
          style={{ width: "1158px", height: "4217px", position: "relative" }}
        >
          <div
            className="ShhhThereIsMoreToCome"
            style={{
              width: "1220px",
              left: "60px",
              top: "2860px",
              position: "absolute",
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
          <div
            className="Group41"
            style={{
              width: "1158px",
              height: "4217px",
              left: "0px",
              top: "0px",
              position: "absolute",
            }}
          >
            <div
              className="Group39"
              style={{
                width: "1158px",
                height: "4217px",
                left: "0px",
                top: "0px",
                position: "absolute",
              }}
            >
              <div
                className="CheckoutHowToUseBrev"
                style={{
                  width: "305px",
                  height: "216px",
                  left: "2px",
                  top: "1343px",
                  position: "absolute",
                  color: "white",
                  fontSize: "69px",
                  font: "Inter",
                  fontWeight: 600,
                  lineHeight: "61px",
                  wordWrap: "break-word",
                }}
              >
                Checkout how to use brev.
              </div>
              <div
                className="OurStory"
                style={{
                  width: "201px",
                  height: "143px",
                  left: "0px",
                  top: "2156px",
                  position: "absolute",
                  color: "white",
                  fontSize: "69px",
                  font: "Inter",
                  fontWeight: 600,
                  lineHeight: "61px",
                  wordWrap: "break-word",
                }}
              >
                Our Story.
              </div>
              <div
                className="FollowUsOnOurSocialsToLearnMore"
                style={{
                  width: "1153px",
                  height: "83px",
                  left: "5px",
                  top: "3623px",
                  position: "absolute",
                  color: "white",
                  fontSize: "65px",
                  font: "Inter",
                  fontWeight: 600,
                  lineHeight: "61px",
                  wordWrap: "break-word",
                }}
              >
                Follow us on our socials to learn more!
              </div>

              <div
                className="Group39"
                style={{
                  width: "188px",
                  height: "51px",
                  left: "455px",
                  top: "3330px",
                  position: "absolute",
                }}
              >
                <div
                  className="Rectangle20"
                  style={{
                    width: "176px",
                    height: "51px",
                    left: "0px",
                    top: "0px",
                    position: "absolute",
                    background: "#1D5DB6",
                    borderRadius: "31px",
                  }}
                />
                <div
                  className="WannaKnowMore"
                  style={{
                    left: "17px",
                    top: "12px",
                    position: "absolute",
                    color: "white",
                    fontSize: "18px",
                    fontFamily: "Inter",
                    fontWeight: 600,
                    lineHeight: "27.50px",
                    wordWrap: "break-word",
                  }}
                >
                  Wanna know more?
                </div>
              </div>
              <div
                className="Group40"
                style={{
                  width: "88px",
                  height: "51px",
                  left: "513px",
                  top: "4166px",
                  position: "absolute",
                }}
              >
                <div
                  className="Rectangle20"
                  style={{
                    width: "88px",
                    height: "51px",
                    left: "0px",
                    top: "0px",
                    position: "absolute",
                    background: "#1D5DB6",
                    borderRadius: "31px",
                  }}
                />
                <div
                  className="EmailUs"
                  style={{
                    left: "10px",
                    top: "12px",
                    position: "absolute",
                    color: "white",
                    fontSize: "18px",
                    fontFamily: "Inter",
                    fontWeight: 600,
                    lineHeight: "27.50px",
                    wordWrap: "break-word",
                  }}
                >
                  Email us!
                </div>
              </div>
              <div
                className="BrevBeganAsAnAmbitiousIdeaDuringAHackathonAtArizonaStateUniversityWhatStartedAsAProjectForA24HourChallengeTurnedIntoSomethingMuchBiggerWeWereATeamOfFourPassionateStudentsWhoWorkedTirelesslyDayAndNightToBuildAFullStackWebAppThoughWeWereConfidentInOurCreationAndExcitedAboutItsPotentialTheHackathonDidnTResultInAnyAwardsOrRecognitionButWeDidnTLetThatStopUsInsteadOfGivingUpWeSawThisAsAnOpportunityToTurnBrevIntoSomethingGreaterAFullFledgedStartupWithAMissionToHelpStudentsConquerTheirExamsOurVisionBecameClearToRelieveTheStressAndAnxietyThatComeWithExamPreparationAndCreateTheBestStudyToolOutThereSinceThenWeVePouredCountlessHoursIntoBrevRefiningItToBeTheUltimateStudyCompanionWhatBeganAsASimpleHackathonIdeaIsNowAToolDesignedToHelpStudentsMaximizeTheirStudyTimeReduceStressAndExcelInTheirExamsWeReJustGettingStartedAndWeReExcitedForTheJourneyAhead"
                style={{
                  width: "869px",
                  height: "403px",
                  left: "198px",
                  top: "2324px",
                  position: "absolute",
                  color: "white",
                  fontSize: "20px",
                  fontFamily: "Inter",
                  fontWeight: 200,
                  lineHeight: "27.50px",
                  wordWrap: "break-word",
                }}
              >
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
              <div
                className="Group38"
                style={{
                  width: "1072px",
                  height: "433px",
                  left: "1px",
                  top: "743px",
                  position: "absolute",
                }}
              >
                <div
                  className="BrevTurnsYourStudyNotesIntoStreamlinedCheatSheetsHelpingYouFocusOnWhatMattersMostWithBrevYouNoLongerHaveToSiftThroughEndlessMaterial"
                  style={{
                    width: "268px",
                    height: "163px",
                    left: "9px",
                    top: "270px",
                    position: "absolute",
                    color: "white",
                    fontSize: "20px",
                    fontFamily: "Inter",
                    fontWeight: 200,
                    lineHeight: "27.50px",
                    wordWrap: "break-word",
                  }}
                >
                  Brev turns your study notes into streamlined cheat sheets,
                  helping you focus on what matters most. With Brev, you no
                  longer have to sift through endless material
                </div>
                <div
                  className="BrevCreatesCustomizedQuizzesBasedOnYourStudyMaterialHelpingYouTestYourKnowledgeInRealTimeAfterEachQuizBrevAnalyzesYourPerformanceAndGeneratesPersonalizedFeedback"
                  style={{
                    width: "300px",
                    height: "140px",
                    left: "377px",
                    top: "261px",
                    position: "absolute",
                    color: "white",
                    fontSize: "20px",
                    fontFamily: "Inter",
                    fontWeight: 200,
                    lineHeight: "27.50px",
                    wordWrap: "break-word",
                  }}
                >
                  Brev creates customized quizzes based on your study material,
                  helping you test your knowledge in real-time. After each quiz,
                  Brev analyzes your performance and generates personalized
                  feedback.
                </div>
                <div
                  className="BrevAlsoOffersMnemonicGenerationMakingItEasierToRememberKeyConceptsByUsingCreativeMemoryAidsBrevHelpsYouRetainInformationWithLessEffort"
                  style={{
                    width: "300px",
                    height: "140px",
                    left: "760px",
                    top: "261px",
                    position: "absolute",
                    color: "white",
                    fontSize: "20px",
                    fontFamily: "Inter",
                    fontWeight: 200,
                    lineHeight: "27.50px",
                    wordWrap: "break-word",
                  }}
                >
                  Brev also offers mnemonic generation, making it easier to
                  remember key concepts. By using creative memory aids, Brev
                  helps you retain information with less effort.
                </div>
                <img
                  className="PexelsPadrinan7453651"
                  style={{
                    width: "256px",
                    height: "243px",
                    left: "0px",
                    top: "0px",
                    position: "absolute",
                  }}
                  src="/images/pexels-padrinan-745365.png"
                  alt="Pexels Padrinan"
                />
                <img
                  className="PexelsEye4dtail3749181"
                  style={{
                    width: "308px",
                    height: "140px",
                    left: "367px",
                    top: "49px",
                    position: "absolute",
                  }}
                  src="/images/pexels-eye4dtail-374918.jpg"
                  alt="Pexels Eye"
                />
                <img
                  className="PexelsJeshootsCom1474587146991"
                  style={{
                    width: "325px",
                    height: "145px",
                    left: "747px",
                    top: "13px",
                    position: "absolute",
                  }}
                  src="/images/pexels-jeshoots-com-147458-714699.jpg"
                  alt="Pexels Jeshoots"
                />
              </div>
              <img
                className="NexbotRobotCharacterConcept11366x6331"
                style={{
                  width: "180px",
                  height: "407px",
                  left: "0px",
                  top: "1559px",
                  position: "absolute",
                }}
                src="/images/robot.png"
                alt="Nexbot Robot"
              />
              <img
                className="1"
                style={{
                  width: "777px",
                  height: "430px",
                  left: "288px",
                  top: "1559px",
                  position: "absolute",
                }}
                src="/images/10.webp"
                alt="Image 1"
              />
            </div>
            <img
              className="Image12"
              style={{
                width: "217px",
                height: "211px",
                left: "449px",
                top: "3841px",
                position: "absolute",
              }}
              src="/images/instagram.png"
              alt="Image 12"
            />
            <img
              className="Image13"
              style={{
                width: "202px",
                height: "241px",
                left: "5px",
                top: "3840px",
                position: "absolute",
              }}
              src="/images/x.jpg"
              alt="Image 13"
            />
            <img
              className="Image14"
              style={{
                width: "186px",
                height: "222px",
                left: "907px",
                top: "3836px",
                position: "absolute",
              }}
              src="/images/github.png"
              alt="Image 14"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

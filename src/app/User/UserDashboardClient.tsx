"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaTiktok,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa6";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import Image from "next/image";
import { Box, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import BlurFade from "@/components/ui/blur-fade";
import ScrollProgress from "@/components/ui/scroll-progress";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  role?: string;
  permissions?: string[];
}

export default function UserDashboardClient({
  userData,
}: {
  userData: UserData;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const userFields = [
    ["First name", userData?.firstName],
    ["Last name", userData?.lastName],
    ["Email", userData?.email],
    userData?.role ? ["Role", userData.role] : [],
    userData?.permissions
      ? ["Permissions", userData.permissions.join(", ")]
      : [],
    ["Id", userData?.id],
  ].filter((arr) => arr.length > 0);

  const recentActivity = [
    {
      date: "April 15, 2025",
      action: "Created Biology final exam cheat sheet",
    },
    {
      date: "April 12, 2025",
      action: "Generated mnemonics for Chemistry formulas",
    },
    {
      date: "April 10, 2025",
      action: "Completed adaptive test on Mathematics",
    },
    { date: "April 5, 2025", action: "Created History timeline summary" },
  ];

  const upcomingExams = [
    { date: "April 20, 2025", subject: "Biology Final", prepared: "75%" },
    { date: "April 25, 2025", subject: "Chemistry Mid-term", prepared: "60%" },
    { date: "May 2, 2025", subject: "Mathematics Quiz", prepared: "90%" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Heading size="6" className="mb-4 text-[#0023FF]">
              Account Details
            </Heading>
            <div className="grid grid-cols-1 gap-4">
              {userFields.map(([label, value]) => (
                <div key={label} className="flex flex-col">
                  <Text weight="bold" size="2" className="text-gray-600 mb-1">
                    {label}
                  </Text>
                  <TextField.Root
                    value={String(value) || ""}
                    readOnly
                    className="bg-gray-50 border border-gray-200"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case "activity":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Heading size="6" className="mb-4 text-[#0023FF]">
              Recent Activity
            </Heading>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-3">
                  <Text weight="bold" size="2">
                    {item.action}
                  </Text>
                  <Text size="1" className="text-gray-500">
                    {item.date}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        );
      case "exams":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Heading size="6" className="mb-4 text-[#0023FF]">
              Upcoming Exams
            </Heading>
            <div className="space-y-6">
              {upcomingExams.map((exam, index) => (
                <div key={index} className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between mb-2">
                    <Text weight="bold" size="3">
                      {exam.subject}
                    </Text>
                    <Text size="2" className="text-gray-500">
                      {exam.date}
                    </Text>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#0023FF] h-2.5 rounded-full"
                      style={{ width: exam.prepared }}
                    ></div>
                  </div>
                  <Text size="1" className="text-right mt-1 text-gray-600">
                    {exam.prepared} prepared
                  </Text>
                </div>
              ))}
            </div>
          </div>
        );
      case "create":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Heading size="6" className="mb-4 text-[#0023FF]">
              Create New Study Material
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center hover:border-[#0023FF] transition-all cursor-pointer">
                <Image
                  src="/images/feature1.png"
                  width={80}
                  height={80}
                  alt="Cheat Sheet"
                />
                <Text weight="bold" className="mt-3">
                  Cheat Sheet
                </Text>
                <Text size="2" className="text-center text-gray-600 mt-1">
                  Create a compact summary of key information
                </Text>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center hover:border-[#0023FF] transition-all cursor-pointer">
                <Image
                  src="/images/feature2.png"
                  width={80}
                  height={80}
                  alt="Mnemonics"
                />
                <Text weight="bold" className="mt-3">
                  Mnemonics
                </Text>
                <Text size="2" className="text-center text-gray-600 mt-1">
                  Generate memory aids for complex information
                </Text>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center hover:border-[#0023FF] transition-all cursor-pointer">
                <Image
                  src="/images/feature3.png"
                  width={80}
                  height={80}
                  alt="Practice Test"
                />
                <Text weight="bold" className="mt-3">
                  Practice Test
                </Text>
                <Text size="2" className="text-center text-gray-600 mt-1">
                  Create adaptive tests to identify knowledge gaps
                </Text>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center justify-center hover:border-[#0023FF] transition-all cursor-pointer">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-[#0023FF] text-3xl font-bold">+</span>
                </div>
                <Text weight="bold" className="mt-3">
                  Custom
                </Text>
                <Text size="2" className="text-center text-gray-600 mt-1">
                  Design your own study material
                </Text>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-screen sticky top-0 z-50 supports-backdrop-blur:bg-background/90 bg-background/40 backdrop-blur-lg justify-between">
        <ScrollProgress className="top-[60px]" />
        <div className="w-full mx-auto">
          <div className="flex justify-between items-center px-6 py-3">
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
            <div className="hidden sm:flex gap-4 sm:gap-6 md:gap-8 items-center">
              <Link
                href="/dashboard"
                className="text-[#0023FF] hover:text-blue-700"
              >
                Dashboard
              </Link>
              <Link
                href="/materials"
                className="text-[#0023FF] hover:text-blue-700"
              >
                My Materials
              </Link>
              <div className="relative">
                <Image
                  src="/images/mainlogo1.png"
                  width={40}
                  height={40}
                  alt="Profile"
                  className="rounded-full cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="sm:hidden mt-4 items-center text-center pb-4">
            <Link
              href="/dashboard"
              className="block py-2 hover:text-[#0023FF] text-black"
            >
              Dashboard
            </Link>
            <Link
              href="/materials"
              className="block py-2 hover:text-[#0023FF] text-black"
            >
              My Materials
            </Link>
            <Link
              href="/account"
              className="block py-2 hover:text-[#0023FF] text-black"
            >
              Account
            </Link>
          </div>
        )}
      </div>

      <BlurFade delay={0.25} inView>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <div className="flex-shrink-0 mr-4">
              <Image
                src="/images/mainlogo1.png"
                width={60}
                height={60}
                alt="Profile"
                className="rounded-full border-2 border-[#0023FF]"
              />
            </div>
            <div>
              <Heading size="6" className="text-gray-800">
                Welcome back, {userData?.firstName}!
              </Heading>
              <Text size="2" className="text-gray-600">
                Let's continue improving your study routine
              </Text>
            </div>
            <div className="ml-auto">
              <ShimmerButton onClick={() => router.push("/responsePage")}>
                Start New Session
              </ShimmerButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                <div
                  onClick={() => setActiveTab("account")}
                  className={`p-3 rounded-md cursor-pointer ${
                    activeTab === "account"
                      ? "bg-blue-100 text-[#0023FF]"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Text weight={activeTab === "account" ? "bold" : "regular"}>
                    Account
                  </Text>
                </div>
                <div
                  onClick={() => setActiveTab("activity")}
                  className={`p-3 rounded-md cursor-pointer ${
                    activeTab === "activity"
                      ? "bg-blue-100 text-[#0023FF]"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Text weight={activeTab === "activity" ? "bold" : "regular"}>
                    Recent Activity
                  </Text>
                </div>
                <div
                  onClick={() => setActiveTab("exams")}
                  className={`p-3 rounded-md cursor-pointer ${
                    activeTab === "exams"
                      ? "bg-blue-100 text-[#0023FF]"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Text weight={activeTab === "exams" ? "bold" : "regular"}>
                    Upcoming Exams
                  </Text>
                </div>
                <div
                  onClick={() => setActiveTab("create")}
                  className={`p-3 rounded-md cursor-pointer ${
                    activeTab === "create"
                      ? "bg-blue-100 text-[#0023FF]"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Text weight={activeTab === "create" ? "bold" : "regular"}>
                    Create New
                  </Text>
                </div>
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Heading size="3" className="mb-3 text-gray-700">
                  Quick Stats
                </Heading>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text size="2" className="text-gray-600">
                        Materials Created
                      </Text>
                      <Text size="2" weight="bold">
                        12
                      </Text>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-[#0023FF] h-1.5 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text size="2" className="text-gray-600">
                        Study Hours
                      </Text>
                      <Text size="2" weight="bold">
                        26
                      </Text>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-[#0023FF] h-1.5 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text size="2" className="text-gray-600">
                        Efficiency Score
                      </Text>
                      <Text size="2" weight="bold">
                        85%
                      </Text>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-[#0023FF] h-1.5 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3">{renderTabContent()}</div>
          </div>
        </div>
      </BlurFade>

      <footer className="p-4 bg-[#0023FF] mt-12 sm:p-6 dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl">
          <div className="sm:flex sm:items-center sm:justify-between">
            <span className="text-sm text-white sm:text-center dark:text-gray-400">
              © 2025{" "}
              <a href="https://meetbrev.com" className="hover:underline">
                Brev™
              </a>
              . All Rights Reserved.
            </span>
            <div className="flex mt-4 space-x-6 text-white sm:justify-center sm:mt-0">
              <FaLinkedin className="hover:text-slate-400" />
              <FaYoutube className="hover:text-slate-400" />
              <FaInstagram className="hover:text-slate-400" />
              <FaXTwitter className="hover:text-slate-400" />
              <FaTiktok className="hover:text-slate-400" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

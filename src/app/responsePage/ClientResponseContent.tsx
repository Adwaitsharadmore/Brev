"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ClientUploadComponent from "./ClientUploadComponent";

import Typewriter from "./p";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import CheatsheetList from "./CheatsheetContainer";
import StudentNotes from "./StudentNotes";

// Define the props type for ClientResponseContent
interface ClientResponseProps {
  user?: any;
  role?: string;
  permissions?: string[];
  [key: string]: any; // For other potential props from authProps
}

interface CheatsheetSection {
  title: string;
  explanation: string;
  subtopic: string;
  details: string[];
}

// Client component with all the hooks and interactivity
const ClientResponseContent = ({
  user,
  role,
  permissions,
}: ClientResponseProps) => {
  const [showingMnemonics, setShowingMnemonics] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cheatsheetContent, setCheatsheetContent] = useState<
    CheatsheetSection[]
  >([]);
  const [file, setFile] = useState<File | null>(null);
  const [textPrompt, setTextPrompt] = useState("");
  const [loadingCheatsheet, setLoadingCheatsheet] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [loadingMnemonics, setLoadingMnemonics] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tempFilePath, setTempFilePath] = useState<string | null>(null);
  const [hasSpecialCharacters, setHasSpecialCharacters] = useState(false);
  const [mnemonicsContent, setMnemonicsContent] = useState<string | null>(null);
  const [html2pdf, setHtml2pdf] = useState<typeof import("html2pdf.js") | null>(
    null
  );
  const [showDialog, setShowDialog] = useState(false);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudyMaterial, setSelectedStudyMaterial] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadHtml2Pdf = async () => {
      const { default: pdf } = await import("html2pdf.js");
      setHtml2pdf(pdf); // Set the library to state
    };
    loadHtml2Pdf();
  }, []);

  useEffect(() => {
    if (isCustomPrompt) {
      handleGenerateContent();
    }
  }, [isCustomPrompt]);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    resetForm();

    const handleBeforeUnload = () => {
      resetForm();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  function resetForm() {
    setFile(null);
    setTextPrompt("");
    setLoadingCheatsheet(false);
    setLoadingQuiz(false);
    setShowDialog(false);
  }

  const handleGenerateClick = () => {
    setIsCustomPrompt(false);
    setShowDialog(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleGenerateContent();
    }
  };

  const handleGenerateContent = async () => {
    if (!file) {
      // Fetch the file from the database instead of using an uploaded file
      const { data: documentsData, error: fetchError } = await supabase
        .from("users_documents")
        .select("*")
        .eq("user_id", user.id);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const document = documentsData[documentsData.length - 1]; // Assuming you want the first document
      if (!document) {
        alert("No document found.");
        return;
      }

      const fileUrl = document.document_url;

      // Fetch the file content using the URL
      const fileResponse = await fetch(fileUrl);
      const fileBlob = await fileResponse.blob();

      // Create a new File object
      const newFile = new File(
        [fileBlob],
        document.document_url.split("/").pop() || "document",
        {
          type:
            fileResponse.headers.get("Content-Type") ||
            "application/octet-stream",
        }
      );

      setIsLoading(true);
      setIsCustomPrompt(true);

      const formData = new FormData();
      formData.append("file", newFile);
      formData.append("textPrompt", textPrompt);

      try {
        const response = await fetch("/api/doubts", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Generated content:", data);
        // Updated to use the sections from the new API response format
        setCheatsheetContent(data.sections || []);
        setTempFilePath(data.tempFilePath);
      } catch (error) {
        console.error("Error fetching generated content:", error);
        setErrorMessage("Failed to generate content. Please try again.");
      } finally {
        setLoadingCheatsheet(false);
        setIsLoading(false);
      }
    } else {
      // If a file is already uploaded, use it
      setIsLoading(true);
      setIsCustomPrompt(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("textPrompt", textPrompt);

      try {
        const response = await fetch("/api/doubts", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Generated content:", data);
        // Updated to use the sections from the new API response format
        setCheatsheetContent(data.sections || []);
        setTempFilePath(data.tempFilePath);
      } catch (error) {
        console.error("Error fetching generated content:", error);
        setErrorMessage("Failed to generate content. Please try again.");
      } finally {
        setLoadingCheatsheet(false);
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const maxSizeInBytes = 200 * 100 * 1024; // 200 pages * 100KB per page

      if (selectedFile.size > maxSizeInBytes) {
        alert(
          "File is too large. Please upload a file with 200 pages or less."
        );
        event.target.value = ""; // Reset the file input
      } else {
        setFile(selectedFile);
        handleUpload();
      }
    } else {
      alert("No file selected. Please try again.");
    }
  };

  // Function to upload the selected file
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch("/api/files/upload-doc", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        alert("Upload failed: " + result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (option: "Detailed" | "Precise") => {
    if (!file) {
      // Fetch the file from the database instead of using an uploaded file
      const { data: documentsData, error: fetchError } = await supabase
        .from("users_documents")
        .select("*")
        .eq("user_id", user.id);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const document = documentsData[documentsData.length - 1]; // Assuming you want the first document
      if (!document) {
        alert("No document found.");
        return;
      }

      const fileUrl = document.document_url;

      // Fetch the file content using the URL
      const fileResponse = await fetch(fileUrl);
      const fileBlob = await fileResponse.blob();

      // Create a new File object
      const newFile = new File(
        [fileBlob],
        document.document_url.split("/").pop() || "document",
        {
          type:
            fileResponse.headers.get("Content-Type") ||
            "application/octet-stream",
        }
      );

      setIsCustomPrompt(false);

      setSelectedOption(option);
      setShowDialog(false);
      setLoadingCheatsheet(true);
      setSelectedStudyMaterial(option);

      let customPrompt = textPrompt || "";

      if (option === "Detailed") {
        customPrompt =
          customPrompt ||
          `Imagine you are a student and you need to prepare for an exam based on the provided document. It is essential to understand the concepts and details to perform well. You need good quality notes to help you study effectively. Your task is to generate really good notes based the key points of the provided document and explaining the key concepts in minimum words. Structure the content as follows:
         Structure the content as follows:

## Content Organization Rules:
1. Begin each major topic with "TITLE: " followed by the main concept.
2. Each TITLE section must include an "Explanation: " that provides brief context and importance.
3. Break down topics into "SUBTOPIC: " sections.
4. List all details with "DETAIL_N: " where N is a sequential number.
5. Use three dashes (---) to separate major sections.

Required Content Structure:
TITLE: [Main Topic]
Explanation: [Brief context and significance]
SUBTOPIC: [Key Component/Concept]
DETAIL_1: [Core concept summarized]
DETAIL_2: [Implementation details or use cases]
DETAIL_3: [Examples or applications]
DETAIL_4: [Common pitfalls to avoid]
DETAIL_5: [Best practices]
--- 

Note: Each section must be concise, focusing on key points to ensure the study guide fits within one to two pages.

Call setStructuredCheatsheet({ sections: [...] }) with the structured content.`;
      } else if (option === "Precise") {
        customPrompt =
          customPrompt ||
          `Imagine you are a student and you need to prepare for an exam based on the provided document. It is essential to understand the key concepts and details to perform well. You need a cheatsheet to help you study effectively. Your task is to generate a concise cheatsheet summarizing the key points of the provided document and explaining the key concepts in minimum words. Structure the content as follows:
        
Generate a concise exam cheatsheet summarizing the key points of the provided document. Structure the content as follows:

## Content Organization Rules:
1. Begin each major topic with "TITLE: " followed by the main concept.
2. Each TITLE section must include an "Explanation: " that provides brief context and importance.
3. Break down topics into "SUBTOPIC: " sections.
4. List all details with "DETAIL_N: " where N is a sequential number.
5. Use three dashes (---) to separate major sections.

Required Content Structure:
TITLE: [Main Topic]
Explanation: [Brief context and significance]
SUBTOPIC: [Key Component/Concept]
DETAIL_1: [Core concept summarized]
DETAIL_2: [Implementation details or use cases]
DETAIL_3: [Examples or applications]
DETAIL_4: [Common pitfalls to avoid]
DETAIL_5: [Best practices]
--- 

Note: Each section must be concise, focusing on key points to ensure the study guide fits within one to two pages.

Call setStructuredCheatsheet({ sections: [...] }) with the structured content.`;
      }

      const formData = new FormData();
      formData.append("file", newFile);
      formData.append("textPrompt", customPrompt);

      try {
        const response = await fetch("/api/upload-and-generate", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Cheatsheet content set:", data);
        // Updated to use the sections from the new API response format
        setCheatsheetContent(data.sections);
        setTempFilePath(data.tempFilePath);
        setShowingMnemonics(false);
      } catch (error) {
        console.error("Error fetching cheatsheet content:", error);
        setErrorMessage("Failed to generate cheatsheet. Please try again.");
      } finally {
        setLoadingCheatsheet(false);
      }
    } else {
      // If a file is already uploaded, use it
      setIsCustomPrompt(false);

      setSelectedOption(option);
      setShowDialog(false);
      setLoadingCheatsheet(true);
      setSelectedStudyMaterial(option);

      let customPrompt = textPrompt || "";

      if (option === "Detailed") {
        customPrompt =
          customPrompt ||
          `Imagine you are a student and you need to prepare for an exam based on the provided document. It is essential to understand the concepts and details to perform well. You need good quality notes to help you study effectively. Your task is to generate really good notes based the key points of the provided document and explaining the key concepts in minimum words. Structure the content as follows:
         Structure the content as follows:

## Content Organization Rules:
1. Begin each major topic with "TITLE: " followed by the main concept.
2. Each TITLE section must include an "Explanation: " that provides brief context and importance.
3. Break down topics into "SUBTOPIC: " sections.
4. List all details with "DETAIL_N: " where N is a sequential number.
5. Use three dashes (---) to separate major sections.

Required Content Structure:
TITLE: [Main Topic]
Explanation: [Brief context and significance]
SUBTOPIC: [Key Component/Concept]
DETAIL_1: [Core concept summarized]
DETAIL_2: [Implementation details or use cases]
DETAIL_3: [Examples or applications]
DETAIL_4: [Common pitfalls to avoid]
DETAIL_5: [Best practices]
--- 

Note: Each section must be concise, focusing on key points to ensure the study guide fits within one to two pages.

Call setStructuredCheatsheet({ sections: [...] }) with the structured content.`;
      } else if (option === "Precise") {
        customPrompt =
          customPrompt ||
          `Imagine you are a student and you need to prepare for an exam based on the provided document. It is essential to understand the key concepts and details to perform well. You need a cheatsheet to help you study effectively. Your task is to generate a concise cheatsheet summarizing the key points of the provided document and explaining the key concepts in minimum words. Structure the content as follows:
        
Generate a concise exam cheatsheet summarizing the key points of the provided document. Structure the content as follows:

## Content Organization Rules:
1. Begin each major topic with "TITLE: " followed by the main concept.
2. Each TITLE section must include an "Explanation: " that provides brief context and importance.
3. Break down topics into "SUBTOPIC: " sections.
4. List all details with "DETAIL_N: " where N is a sequential number.
5. Use three dashes (---) to separate major sections.

Required Content Structure:
TITLE: [Main Topic]
Explanation: [Brief context and significance]
SUBTOPIC: [Key Component/Concept]
DETAIL_1: [Core concept summarized]
DETAIL_2: [Implementation details or use cases]
DETAIL_3: [Examples or applications]
DETAIL_4: [Common pitfalls to avoid]
DETAIL_5: [Best practices]
--- 

Note: Each section must be concise, focusing on key points to ensure the study guide fits within one to two pages.

Call setStructuredCheatsheet({ sections: [...] }) with the structured content.`;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("textPrompt", customPrompt);

      try {
        const response = await fetch("/api/upload-and-generate", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Cheatsheet content set:", data);
        // Updated to use the sections from the new API response format
        setCheatsheetContent(data.sections);
        console.log(data.sections);
        setTempFilePath(data.tempFilePath);
        setShowingMnemonics(false);
      } catch (error) {
        console.error("Error fetching cheatsheet content:", error);
        setErrorMessage("Failed to generate cheatsheet. Please try again.");
      } finally {
        setLoadingCheatsheet(false);
      }
    }
  };

  const handleGenerateQuiz = async () => {
    setLoadingCheatsheet(false);
    setLoadingQuiz(true);
    setLoadingMnemonics(false);

    if (!file) {
      alert("Please upload a file");
      return;
    }

    setLoadingQuiz(true);

    const quizPrompt = hasSpecialCharacters
      ? `Generate multiple-choice questions focusing on the most important topics of the document. The number of questions should be proportional to the size and content density of the document. Each question should test the user's understanding of the key points, concepts, or details in the document. Format each question as follows:

QUESTION: Write the question here
OPTION_A: First option
OPTION_B: Second option
OPTION_C: Third option
OPTION_D: Fourth option
CORRECT: Write the correct option letter (A, B, C, or D)

Separate each question with three dashes (---).`
      : `Generate multiple-choice questions focusing on the most important topics of the document. The number of questions should be proportional to the size and content density of the document. Each question should test the user's understanding of the key points, concepts, or details in the document. Format each question as follows:

QUESTION: Write the question here
OPTION_A: First option
OPTION_B: Second option
OPTION_C: Third option
OPTION_D: Fourth option
CORRECT: Write the correct option letter (A, B, C, or D)

Separate each question with three dashes (---).`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("textPrompt", quizPrompt);

    try {
      const response = await fetch("/api/upload-and-generate-quiz", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }
      const data = await response.json();

      // Store the tempFilePath for later use
      setTempFilePath(data.tempFilePath);

      // Redirect to the new quiz page with generated quiz content
      window.location.href = `/quizPage?quiz=${encodeURIComponent(
        data.generatedQuiz
      )}&originalFileName=${encodeURIComponent(file.name)}`;
    } catch (error) {
      console.error("Error fetching quiz content:", error);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleDownloadPDF = async () => {
    if (typeof window === "undefined") {
      console.error("Cannot use html2pdf on the server side.");
      return;
    }

    try {
      // Import html2pdf dynamically
      const html2pdf = (await import("html2pdf.js")).default;

      await document.fonts.ready;
      const images = document.images;
      const promises = Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(promises);

      const element = document.getElementById("cheatsheet-content");
      if (!element) {
        console.error("Cheatsheet content element not found");
        return;
      }

      const opt = {
        margin: 10,
        filename: "cheatsheet.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
          letterRendering: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center w-screen h-screen relative">
        {/* Nav Bar */}
        <div className="w-screen sticky top-0 z-50 supports-backdrop-blur:bg-background/90 bg-background/40 backdrop-blur-lg justify-between">
          <div className="w-3/4 mx-auto gap-between justify-between">
            <div className="gap-between justify-between">
              <div className="flex justify-between items-center py-3 gap-between">
                <div className="text-[#0023FF] text-3xl sm:text-4xl font-extrabold font-inter capitalize">
                  <Link href="/">Brev</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phrases Section */}
        <div className="w-full md:pt-[20px] pt-[10px] mx-auto">
          <div className="w-3/4 mx-auto gap-between justify-between">
            <div className="w-full pt-[30px]">
              <span className="text-black tracking-tighter md:text-5xl text-2xl font-semibold leading-tight font-Inter">
                Don't worry,{" "}
              </span>
              <span className="text-[#0023FF] tracking-tighter md:text-5xl text-2xl font-semibold leading-tight font-Inter">
                {" "}
                Brev's
              </span>
              <span className="text-black tracking-tighter md:text-5xl text-2xl font-semibold leading-tight font-Inter">
                {" "}
                got your back.
              </span>
            </div>
            <div className="text-black tracking-tighter md:text-5xl text-2xl font-light leading-tight font-Inter mt-4">
              Just upload a file
            </div>
            <div className="text-black tracking-tighter md:text-5xl text-2xl font-light leading-tight font-Inter mt-4">
              and choose your
            </div>
            <div className="text-black tracking-tighter md:text-5xl text-2xl gap-4 font-light leading-tight font-Inter mt-4 flex items-center">
              <span>desired </span>
              <Typewriter></Typewriter>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center px-4 md:px-0">
          <form className="w-full md:w-3/4 bg-black border border-gray-700 shadow-md rounded-lg p-4 md:p-6 mt-6">
            <ClientUploadComponent userId={user.id} />

            <div className="mb-4 bg-black rounded-lg">
              <label className="block text-lg font-medium text-white">
                Anything you wanna ask your Notes?
              </label>
              <input
                type="text"
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleKeyPress(e);
                    setTextPrompt("");
                  }
                }}
                className="mt-2 p-2 border border-gray-500 rounded w-full bg-black text-white"
                placeholder="Enter any additional prompt (optional)"
              />
            </div>

            <div className="flex flex-col sm:flex-col gap-4">
              <label className="block text-lg font-medium text-white mb-2 w-full">
                Select an option:
              </label>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="button"
                      className={`bg-white text-black px-4 py-2 rounded-full ${
                        loadingCheatsheet
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#0023FF] hover:text-white"
                      }`}
                      onClick={handleGenerateClick}
                      disabled={loadingCheatsheet}
                    >
                      {loadingCheatsheet
                        ? "Generating Cheatsheet..."
                        : "Generate Study Material"}
                    </button>
                  </div>
                </div>

                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                  <DialogContent className="sm:max-w-md">
                    <DialogTitle className="text-white">
                      Choose Cheatsheet Type
                    </DialogTitle>
                    <DialogDescription className="text-gray-300">
                      Select how you would like your cheatsheet to be generated.
                    </DialogDescription>
                    <div className="flex flex-col gap-4">
                      <button
                        className="px-4 py-2 rounded-full bg-white text-black hover:bg-[#0023FF] hover:text-white transition-colors"
                        onClick={() => handleSubmit("Detailed")}
                      >
                        Exam Cheatsheet
                      </button>
                      <button
                        className="px-4 py-2 rounded-full bg-white text-black hover:bg-[#0023FF] hover:text-white transition-colors"
                        onClick={() => handleSubmit("Precise")}
                      >
                        Notes
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>

                <button
                  type="button"
                  className={`bg-white text-black px-4 py-2 rounded-full ${
                    loadingQuiz
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#0023FF] hover:text-white"
                  }`}
                  onClick={handleGenerateQuiz}
                  disabled={loadingQuiz}
                >
                  {loadingQuiz ? "Generating Quiz..." : "Generate Quiz"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="w-full md:w-3/4 bg-white shadow-md rounded-lg p-5 mt-6">
          <div id="cheatsheet-content" className="text-lg text-black">
            {loadingCheatsheet || loadingQuiz || isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600 font-medium">
                  Generating your study materials...
                </p>
              </div>
            ) : cheatsheetContent && cheatsheetContent.length > 0 ? (
              selectedStudyMaterial === "Precise" ? (
                <StudentNotes
                  loadingCheatsheet={loadingCheatsheet}
                  isLoading={isLoading}
                  cheatsheetContent={cheatsheetContent}
                  isCustomPrompt={isCustomPrompt}
                />
              ) : (
                <CheatsheetList
                  loadingCheatsheet={loadingCheatsheet}
                  isLoading={isLoading}
                  cheatsheetContent={cheatsheetContent}
                  isCustomPrompt={isCustomPrompt}
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                <p className="text-gray-500 mb-2">
                  Your study materials will appear here once generated.
                </p>
                <p className="text-sm text-gray-400">
                  Start by providing your study content above
                </p>
              </div>
            )}
          </div>
        </div>

        {cheatsheetContent && cheatsheetContent.length > 0 && (
          <button
            onClick={handleDownloadPDF}
            className="mt-4 px-4 py-2 bg-[#0023FF] text-white rounded-full hover:bg-[#172688] transition-colors"
          >
            Download as PDF
          </button>
        )}

        <div className="flex gap-4 mt-8 pb-10">
          <Link href="/">
            <label className="flex items-center justify-center w-58 p-4 bg-[#0023FF] text-white border rounded-full cursor-pointer hover:bg-custom-hover transition-colors">
              <span className="font-bold">Back</span>
            </label>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientResponseContent;

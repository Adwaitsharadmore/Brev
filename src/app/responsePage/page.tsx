"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import fs from "fs";
import Typewriter from "./p";
import ScrollProgress from "@/components/ui/scroll-progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface Mnemonic {
  text: string;
  type: string;
  title: string;
  subtopic: string;
  explanation: string;
}

interface CustomContentItem {
  type: "detail" | "text";
  content: string;
}

const ResponsePage = () => {
  const [showingMnemonics, setShowingMnemonics] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [cheatsheetContent, setCheatsheetContent] = useState<string | null>(
    null
  );
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

  useEffect(() => {
    const loadHtml2Pdf = async () => {
      const { default: pdf } = await import("html2pdf.js");
      setHtml2pdf(pdf); // Set the library to state
    };
    loadHtml2Pdf();
  }, []);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGenerateClick = () => {
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
      alert("Please upload a file first");
      return;
    }

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
      console.log("Generated content:", data.generatedText);
      setCheatsheetContent(data.generatedText);
      setTempFilePath(data.tempFilePath);
    } catch (error) {
      console.error("Error fetching generated content:", error);
      setErrorMessage("Failed to generate content. Please try again.");
    } finally {
      setLoadingCheatsheet(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      alert("No file selected. Please try again.");
    }
  };

  const handleSubmit = async (option: "Detailed" | "Precise") => {
    if (!file) {
      alert("Please upload a file first");
      return;
    }

    setSelectedOption(option);
    setShowDialog(false);
    setLoadingCheatsheet(true);

    let customPrompt = textPrompt || "";

    if (option === "Detailed") {
      customPrompt =
        customPrompt ||
        `Generate a comprehensive cheat sheet based on the provided document.Provide explanations, context, and insights to enhance understanding. Use clear and simple language for each detail to ensure a thorough grasp of the topic. If the document is an exam study guide with topics organized by chapters, reference each chapter and summarize its contents. Use the following format strictly:

## Main formatting rules:
1. Start main titles with "TITLE: " (include the space after colon)
2. Start subtopics with "SUBTOPIC: " (include the space after colon)
3. Start details with "DETAIL_N: " where N is a number (include the space after colon)
4. Use three dashes (---) to separate different sections
5. Do not use any markdown symbols, asterisks, double asterisks or other formatting characters
6. Maintain consistent indentation
7. Keep all text in normal font

Example format:
TITLE: Your Main Title
SUBTOPIC: Your Subtopic
DETAIL_1: Your first detail point
DETAIL_2: Your second detail point
DETAIL_3: Your third detail point
---
TITLE: Your Next Section
[and so on...]

Guidelines for content:
- Provide clear explanations and context for each topic
- Use simple, straightforward language
- If working with an exam study guide, reference chapters clearly
- Include relevant examples where appropriate
- Break down complex topics into digestible details
- Ensure each detail provides meaningful information
- Keep formatting consistent throughout the document

Please structure the content following this format exactly as it matches the frontend rendering system.`;
    } else if (option === "Precise") {
      customPrompt =
        customPrompt ||
        `Please create a precise cheat sheet from the provided document. Use the following format strictly:

## Main formatting rules:
1. Start main titles with "TITLE: " (include the space after colon)
2. Start subtopics with "SUBTOPIC: " (include the space after colon)
3. Start details with "DETAIL_N: " where N is a number (include the space after colon)
4. Use three dashes (---) to separate different sections
5. Do not use any markdown symbols, asterisks, double asterisks or other formatting characters
6. Maintain consistent indentation
7. Keep all text in normal font

Example format:
TITLE: Your Main Title
SUBTOPIC: Your Subtopic
DETAIL_1: Your first detail point
DETAIL_2: Your second detail point
DETAIL_3: Your third detail point
---
TITLE: Your Next Section
[and so on...]

Guidelines for content:
- Keep explanations brief and concise
- Include only essential information
- Use clear, simple language
- Break down complex topics into digestible points
- Maintain consistent formatting throughout

Please structure the content following this format exactly as it matches the frontend rendering system.`;
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
      console.log("Cheatsheet content set:", data.generatedText);
      setCheatsheetContent(data.generatedText);
      setTempFilePath(data.tempFilePath);
      setShowingMnemonics(false);
    } catch (error) {
      console.error("Error fetching cheatsheet content:", error);
      setErrorMessage("Failed to generate cheatsheet. Please try again.");
    } finally {
      setLoadingCheatsheet(false);
    }
  };

  const handleGenerateQuiz = async () => {
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

  const handleGenerateMnemonics = async () => {
    if (!file) {
      alert("Please upload a file");
      return;
    }

    setLoadingMnemonics(true);

    const customPrompt = `Analyze the document and create mnemonics for all the key concepts of the provided document to aid in memorizing key concepts. Use the most effective and suitable mnemonic technique for the respective key concepts. Use the following format strictly:

Each concept in this framework should follow this pattern:
1. Start with a brief explanation of the concept
2. Follow with relevant mnemonics using specified formatting
3. Include memory technique type and explanation
4. Separate sections with triple dashes

## Basic Format

TITLE: [Main Topic/Concept]
Explanation: [Brief, clear explanation of the concept]
SUBTOPIC: [Specific Area of Focus]
MNEMONIC_N: [The actual mnemonic]
TYPE: [Memory technique used + brief explanation]
---

## Memory Techniques Arsenal

TITLE: Memory Techniques Overview
Explanation: Memory techniques are systematic methods to enhance recall. Each technique serves a specific purpose and works best for particular types of information.
SUBTOPIC: Core Memory Methods
MNEMONIC_1: "A Clever Visitor Makes Real Music"
TYPE: Acrostic (Acronyms, Chunking, Visual, Method of loci, Rhyming)

1. Acronyms
Explanation: Create meaningful words using first letters of key terms
Example Format:
TITLE: Chemical Elements
Explanation: First 5 noble gases in order
MNEMONIC_1: "KHAN" (Krypton, Helium, Argon, Neon)
TYPE: Acronym

2. Acrostics
Explanation: Create memorable sentences where each word begins with the target letter
Example Format:
TITLE: Planet Order
Explanation: Order of planets from the sun
MNEMONIC_1: "My Very Educated Mother Just Served Us Noodles"
TYPE: Acrostic (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune)

3. Chunking
Explanation: Group related items into manageable clusters
Example Format:
TITLE: Phone Numbers
Explanation: Breaking down 10-digit numbers
MNEMONIC_1: "555-867-5309"
TYPE: Chunking (Three groups of 3-3-4 digits)

4. Visual Association
Explanation: Link concepts to vivid mental images
Example Format:
TITLE: Cell Parts
Explanation: Visualizing cell membrane function
MNEMONIC_1: "Cell membrane is like a bouncer at a club"
TYPE: Visual Association (Controls what enters and exits)

5. Method of Loci
Explanation: Associate items with locations along a familiar route
Example Format:
TITLE: Grocery List
Explanation: Items needed using house walkthrough
MNEMONIC_1: "Front door (milk), Kitchen (bread), Bedroom (eggs)"
TYPE: Method of Loci

6. Musical/Rhyming
Explanation: Use rhythm and rhyme for memorization
Example Format:
TITLE: History Dates
Explanation: Remember Columbus's voyage
MNEMONIC_1: "In fourteen-hundred and ninety-two, Columbus sailed the ocean blue"
TYPE: Musical/Rhyming

## Quality Guidelines

TITLE: Mnemonic Quality Standards
Explanation: Each mnemonic must meet specific criteria to ensure effectiveness
SUBTOPIC: Quality Criteria
MNEMONIC_1: "SUPER" 
TYPE: Acronym (Simple, Unique, Practical, Engaging, Relevant)

## Implementation Process

TITLE: Creating Effective Mnemonics
Explanation: Follow a structured approach to develop and test mnemonics
SUBTOPIC: Development Steps
MNEMONIC_1: "PIPE"
TYPE: Acronym (Plan, Implement, Practice, Evaluate)

Steps for each mnemonic:
1. Plan: Identify concept and choose the best mnemonic technique
2. Implement: Create mnemonic that suits the concept and memory type

## Usage Guidelines

TITLE: Practical Application
Explanation: Guidelines for effectively using mnemonics in learning
SUBTOPIC: Application Principles
MNEMONIC_1: "TEACH"
TYPE: Acronym (Test, Explain, Apply, Check, Help)

Remember: Choose the most effective method based on the content.

Remember: Each new mnemonic created should follow this enhanced format with explanation first, then the mnemonic itself, maintaining consistent formatting throughout.
    `;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("textPrompt", customPrompt);

    try {
      const response = await fetch("/api/upload-and-generate-mnemonics", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCheatsheetContent(data.generatedMnemonics);
      setShowingMnemonics(true);
    } catch (error) {
      console.error("Error fetching mnemonics:", error);
      setErrorMessage("Failed to generate mnemonics. Please try again.");
    } finally {
      setLoadingMnemonics(false);
    }
  };

  const parseMnemonics = (content: string) => {
    const sections = content.split("---").filter((section) => section.trim());
    const mnemonics: Mnemonic[] = [];

    sections.forEach((section) => {
      const lines = section
        .trim()
        .split("\n")
        .filter((line) => line.trim());
      let currentMnemonic: Partial<Mnemonic> = {};

      lines.forEach((line) => {
        const titleMatch = line.match(/^TITLE:\s(.+)/);
        const subtopicMatch = line.match(/^SUBTOPIC:\s(.+)/);
        const explanationMatch = line.match(/^Explanation:\s(.+)/);
        const mnemonicMatch = line.match(/^MNEMONIC_\d+:\s(.+)/);
        const typeMatch = line.match(/^TYPE:\s(.+)/);

        if (titleMatch) currentMnemonic.title = titleMatch[1];
        else if (subtopicMatch) currentMnemonic.subtopic = subtopicMatch[1];
        else if (explanationMatch)
          currentMnemonic.explanation = explanationMatch[1];
        else if (mnemonicMatch) currentMnemonic.text = mnemonicMatch[1];
        else if (typeMatch) {
          currentMnemonic.type = typeMatch[1];
          mnemonics.push(currentMnemonic as Mnemonic);
          currentMnemonic = {};
        }
      });
    });

    return mnemonics;
  };

  const renderCheatsheetAsList = () => {
    if (!cheatsheetContent) return null;

    if (showingMnemonics) {
      const mnemonics = parseMnemonics(cheatsheetContent);
      return <MnemonicCards mnemonics={mnemonics} />;
    }

    const sections = cheatsheetContent
      .split("---")
      .filter((section) => section.trim());

    // Helper function to format mathematical notation (keeping existing implementation)
    const formatMathText = (text: string) => {
      let formattedText = text.replace(/([a-z])(\d)/gi, "$1$2");
      formattedText = formattedText.replace(/\^(\d+)/g, "$1");
      const symbolMap = {
        ">=": "≥",
        "<=": "≤",
        "!=": "≠",
        "->": "→",
        N: "N",
        Z: "Z",
      };
      Object.entries(symbolMap).forEach(([key, value]) => {
        formattedText = formattedText.replace(new RegExp(key, "g"), value);
      });
      return formattedText;
    };

    const formatCodeBlock = (text: string) => {
      if (text.includes("{") || text.includes("if") || text.includes("→")) {
        return (
          <pre className="bg-gray-100 p-4 rounded-md font-mono text-sm my-2 whitespace-pre-wrap">
            {text}
          </pre>
        );
      }
      return formatMathText(text);
    };

    return (
      <div id="cheatsheet-content" className="text-black max-w-4xl mx-auto">
        {sections.map((section, index) => {
          const lines = section
            .trim()
            .split("\n")
            .filter((line) => line.trim());

          // Extract all mnemonics and their associated info for this section
          let currentTitle = "";
          let currentSubtopic = "";
          let currentExplanation = "";
          let mnemonics: Mnemonic[] = [];
          let currentMnemonic: Mnemonic | null = null;
          let customContent: CustomContentItem[] = [];

          lines.forEach((line) => {
            const titleMatch = line.match(/^TITLE:\s(.+)/);
            const subtopicMatch = line.match(/^SUBTOPIC:\s(.+)/);
            const explanationMatch = line.match(/^Explanation:\s(.+)/);
            const mnemonicMatch = line.match(/^MNEMONIC_\d+:\s(.+)/);
            const typeMatch = line.match(/^TYPE:\s(.+)/);
            const detailMatch = line.match(/^DETAIL_\d+:\s(.+)/);

            if (titleMatch) {
              currentTitle = titleMatch[1];
            } else if (subtopicMatch) {
              currentSubtopic = subtopicMatch[1];
            } else if (explanationMatch) {
              currentExplanation = explanationMatch[1];
            } else if (mnemonicMatch) {
              currentMnemonic = {
                text: mnemonicMatch[1],
                type: "",
                title: currentTitle,
                subtopic: currentSubtopic,
                explanation: currentExplanation,
              };
            } else if (typeMatch && currentMnemonic) {
              currentMnemonic.type = typeMatch[1];
              mnemonics.push(currentMnemonic);
              currentMnemonic = null;
            } else if (detailMatch) {
              customContent.push({ type: "detail", content: detailMatch[1] });
            } else {
              customContent.push({ type: "text", content: line });
            }
          });

          return (
            <div key={index} className="mb-8 bg-white rounded-lg shadow-md p-6">
              {lines.map((line, lineIndex) => {
                const titleMatch = line.match(/^TITLE:\s(.+)/);
                const subtopicMatch = line.match(/^SUBTOPIC:\s(.+)/);
                const detailMatch = line.match(/^DETAIL_\d+:\s(.+)/);
                const explanationMatch = line.match(/^Explanation:\s(.+)/);

                if (titleMatch) {
                  return (
                    <h2
                      key={lineIndex}
                      className="text-3xl font-bold mb-4 text-blue-900 border-b pb-2"
                    >
                      {formatMathText(titleMatch[1])}
                    </h2>
                  );
                } else if (explanationMatch) {
                  return (
                    <div className="ml-4 mb-4 text-gray-700 bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium text-blue-800 mb-1">
                        Explanation:
                      </p>
                      <p>{explanationMatch[1]}</p>
                    </div>
                  );
                } else if (subtopicMatch) {
                  return (
                    <h3
                      key={lineIndex}
                      className="text-xl font-semibold mb-3 text-blue-700 mt-4"
                    >
                      {formatMathText(subtopicMatch[1])}
                    </h3>
                  );
                } else if (detailMatch) {
                  const detailContent = detailMatch[1].trim();
                  return (
                    <div key={lineIndex} className="ml-4 mb-3">
                      <div className="flex">
                        <div className="mr-2 text-blue-500">•</div>
                        <div className="flex-1">
                          {detailContent.includes("\n") ||
                          detailContent.includes("    ") ? (
                            <div className="font-normal">
                              {detailContent
                                .split("\n")
                                .map((part, partIndex) => (
                                  <div
                                    key={partIndex}
                                    className={
                                      part.startsWith("    ")
                                        ? "ml-4 font-mono"
                                        : ""
                                    }
                                  >
                                    {formatCodeBlock(part.trim())}
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="font-normal">
                              {formatMathText(detailContent)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}

              {customContent.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2 text-blue-800">
                    Additional Content
                  </h4>
                  {customContent.map((item, idx) => (
                    <div key={idx} className="ml-4 mb-2">
                      {item.type === "detail" ? (
                        <div className="flex">
                          <div className="mr-2 text-blue-500">•</div>
                          <div className="flex-1">
                            {formatMathText(item.content)}
                          </div>
                        </div>
                      ) : (
                        <p>{formatMathText(item.content)}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {mnemonics.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3 text-blue-800">
                    Mnemonics
                  </h4>
                  <MnemonicCards
                    mnemonics={mnemonics.map((m) => ({
                      text: m.text,
                      type: m.type,
                      title: m.title,
                      subtopic: m.subtopic,
                      explanation: m.explanation,
                    }))}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const MnemonicCards = ({ mnemonics }: { mnemonics: Mnemonic[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!touchStartX.current || !touchEndX.current) return;

      const diff = touchStartX.current - touchEndX.current;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentIndex < mnemonics.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else if (diff < 0 && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
      }

      touchStartX.current = null;
      touchEndX.current = null;
    };

    const navigateCard = (direction: "next" | "prev") => {
      if (direction === "next" && currentIndex < mnemonics.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (direction === "prev" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };

    return (
      <div className="relative w-full mx-auto">
        <Card
          className="bg-blue-50 shadow-lg transform transition-transform duration-300 border border-slate-700"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <CardContent className="p-6">
            <div className="text-lg font-semibold text-blue-600 mb-2">
              {mnemonics[currentIndex]?.subtopic}
            </div>
            <div className="text-lg font-medium text-gray-800 mb-4">
              {mnemonics[currentIndex]?.text}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Type:</span>{" "}
              {mnemonics[currentIndex]?.type}
            </div>
            {mnemonics[currentIndex]?.explanation && (
              <div className="text-sm text-gray-600 mt-2 bg-white p-3 rounded-lg">
                {mnemonics[currentIndex]?.explanation}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => navigateCard("prev")}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full ${
              currentIndex === 0
                ? "text-gray-400"
                : "text-blue-600 hover:bg-blue-100"
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {mnemonics.length}
          </span>

          <button
            onClick={() => navigateCard("next")}
            disabled={currentIndex === mnemonics.length - 1}
            className={`p-2 rounded-full ${
              currentIndex === mnemonics.length - 1
                ? "text-gray-400"
                : "text-blue-600 hover:bg-blue-100"
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  };

  // Define the toggleSelection function to handle option changes
  const toggleSelection = (option: string) => {
    // If the clicked option is already selected, deselect it; otherwise, select the new option.
    if (selectedOption === option) {
      setSelectedOption(""); // Deselect if it's the current option
    } else {
      setSelectedOption(option); // Select the clicked option
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

  if (typeof window !== "undefined") {
    // Code that uses window, document, or self
  }

  return (
    <div>
      <div className="flex flex-col items-center w-screen h-screen relative bg-[#f8f6ef]">
        <div className="w-3/4  flex flex-col items-start">
          {/* Nav Bar */}
          <div className="w-full sticky top-0 z-50 bg-[#f8f6ef] supports-backdrop-blur:bg-background/90 bg-background/40 backdrop-blur-lg justify-between">
            <div className="gap-between justify-between">
              <div className="flex justify-between items-center py-3 gap-between">
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
                    className="text-[#0023FF] hover:text-[#0023FF] cursor-pointer hover:underline"
                  >
                    Key Features
                  </div>
                  <div
                    onClick={() => handleScroll("features")}
                    className="text-[#0023FF] hover:text-[#0023FF] cursor-pointer hover:underline"
                  >
                    How to Brev
                  </div>
                  <div
                    className="text-[#0023FF] hover:text-[#0023FF] cursor-pointer hover:underline"
                    onClick={() => handleScroll("story")}
                  >
                    Our Story
                  </div>
                  <div
                    className="text-[#0023FF] hover:text-[#0023FF] cursor-pointer hover:underline"
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

          {/* Phrases Section */}
          <div className="w-full md:pt-[20px] pt-[10px] mx-auto">
            <div className="w-full pt-[30px]">
              <span className="text-black tracking-tighter md:text-5xl text-2xl font-semibold leading-tight font-Inter">
                Don’t worry,{" "}
              </span>
              <span className="text-[#0023FF] tracking-tighter md:text-5xl text-2xl font-semibold leading-tight font-Inter">
                {" "}
                Brev’s
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
            <div className="mb-4">
              <label className="block text-lg font-medium text-white">
                Upload File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer mt-2 px-4 py-2 bg-white text-black border rounded-full inline-block text-center hover:bg-[#0023FF] hover:text-white transition-colors"
              >
                Choose File
              </label>
              {file && (
                <p className="text-white mt-2">
                  Selected file:{" "}
                  <span className="font-semibold">{file.name}</span>
                </p>
              )}
            </div>

            <div className="mb-4 bg-black rounded-lg">
              <label className="block text-lg font-medium text-white">
                Anything you wanna ask your Notes?
              </label>
              <input
                type="text"
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
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
                        : "Generate Cheatsheet"}
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
                        Detailed
                      </button>
                      <button
                        className="px-4 py-2 rounded-full bg-white text-black hover:bg-[#0023FF] hover:text-white transition-colors"
                        onClick={() => handleSubmit("Precise")}
                      >
                        Precise
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>

                <button
                  type="button"
                  className={`bg-white text-black px-4 py-2 rounded-full ${
                    loadingMnemonics
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#0023FF] hover:text-white"
                  }`}
                  onClick={handleGenerateMnemonics}
                  disabled={loadingMnemonics}
                >
                  {loadingMnemonics
                    ? "Generating Mnemonics..."
                    : "Generate Mnemonics"}
                </button>

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
            {cheatsheetContent ? (
              renderCheatsheetAsList()
            ) : (
              <p>
                {loadingCheatsheet
                  ? "Generating your cheatsheet..."
                  : "Your cheatsheet content will be displayed here once generated."}
              </p>
            )}
          </div>
        </div>

        {cheatsheetContent && (
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

export default ResponsePage;

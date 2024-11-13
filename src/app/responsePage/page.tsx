"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import html2pdf from 'html2pdf.js';
import fs from 'fs';



  const ResponsePage = () => {
     const [cheatsheetContent, setCheatsheetContent] = useState(null);
     const [file, setFile] = useState<File | null>(null);
     const [textPrompt, setTextPrompt] = useState("");
     const [loadingCheatsheet, setLoadingCheatsheet] = useState(false);
     const [loadingQuiz, setLoadingQuiz] = useState(false);
     const [loadingMnemonics, setLoadingMnemonics] = useState(false);
     const [selectedOption, setSelectedOption] = useState("");
     const [errorMessage, setErrorMessage] = useState("");
    const [html2pdf, setHtml2pdf] = useState(null);   
    const [tempFilePath, setTempFilePath] = useState<string | null>(null);
    const [hasSpecialCharacters, setHasSpecialCharacters] = useState(false);


     useEffect(() => {
       const loadHtml2Pdf = async () => {
         const { default: pdf } = await import("html2pdf.js");
         setHtml2pdf(pdf); // Set the library to state
       };
       loadHtml2Pdf();
     }, []);
    
 const handleFileChange = (event) => {
   const selectedFile = event.target.files[0];
   if (selectedFile) {
     setFile(selectedFile);
   } else {
     alert("No file selected. Please try again.");
   }
 };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      alert("Please upload a file");
      return;
    }

    if (!selectedOption) {
      setErrorMessage("Please select if you want a detailed or precise cheatsheet first");
      return;
    }

    setLoadingCheatsheet(true);
    setErrorMessage("");

    let customPrompt = textPrompt || "";

    if (selectedOption === "Detailed") {
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

Please structure the content following this format exactly as it matches the frontend rendering system.
      `;
    } else if (selectedOption === "Precise") {
      customPrompt =
        customPrompt ||
        `
       Please create a precise cheat sheet from the provided document. Use the following format strictly:

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


Please structure the content following this format exactly as it matches the frontend rendering system.
      `;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("textPrompt", customPrompt);

    try {
      const response = await fetch(
        "http://localhost:3001/upload-and-generate",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Cheatsheet content set:", data.generatedText);
      setCheatsheetContent(data.generatedText);
      setTempFilePath(data.tempFilePath);
    } catch (error) {
      console.error("Error fetching cheatsheet content:", error);
      setErrorMessage("Failed to generate cheatsheet. Please try again.");
    } finally {
      setLoadingCheatsheet(false); // Reset loading state here
    }
  };



    const handleGenerateQuiz = async () => {
      if (!file) {
        alert("Please upload a file");
        return;
      }

      setLoadingQuiz(true);

      const formData = new FormData();
      formData.append("file", file);
       const quizPrompt = hasSpecialCharacters
         ? `Generate 5 multiple-choice questions based on the document provided. Format each question as follows:
         QUESTION: Write the question here
         OPTION_A: First option
         OPTION_B: Second option
         OPTION_C: Third option
         OPTION_D: Fourth option
         CORRECT: Write the correct option letter (A, B, C, or D)
         
         Please separate each question with three dashes (---).`
         : `Generate 5 multiple-choice questions based on the document provided. Format each question as follows:
         QUESTION: Write the question here
         OPTION_A: First option
         OPTION_B: Second option
         OPTION_C: Third option
         OPTION_D: Fourth option
         CORRECT: Write the correct option letter (A, B, C, or D)
         
         Please separate each question with three dashes (---).`;

       formData.append("textPrompt", quizPrompt);

      try {
        const response = await fetch(
          "http://localhost:3001/upload-and-generate-quiz",
          {
            method: "POST",
            body: formData,
          }
        );
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

  const customPrompt = `
      Please create mnemonics for the provided document to aid in memorizing key concepts. Use the following format and apply the best memory strategy that fits each piece of content:

      Main Titles: Enclose in curly brackets {}.
      Subtopics: Enclose in square brackets [].
      Mnemonics: Present each mnemonic as a bullet point under the corresponding subtopic.
      Use a variety of memory techniques, such as:

      Acronyms: Form words from the first letter of key terms.
      Acrostics: Create sentences where each word starts with the first letter of the concept.
      Chunking: Break information into smaller, manageable groups.
      Association: Link new information to familiar concepts or images.
      Method of Loci: Visualize placing the information in familiar locations.
      Songs or Rhymes: Use catchy rhymes or short songs.
      Choose the most effective strategy for each concept and present it in the following format:

      {Main Title}
      [Subtopic]
      Mnemonic 1
      Mnemonic 2

      Ensure the mnemonics are easy to remember and align with the content.
    `;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("textPrompt", customPrompt);

  try {
    const response = await fetch(
      "http://localhost:3001/upload-and-generate-mnemonics",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setCheatsheetContent(data.generatedMnemonics);
  } catch (error) {
    console.error("Error fetching mnemonics:", error);
    setErrorMessage("Failed to generate mnemonics. Please try again.");
  } finally {
    setLoadingMnemonics(false);
  }
};


const renderCheatsheetAsList = () => {
  if (!cheatsheetContent) return null;

  // Split by `---` to get sections and then iterate over each line for parsing
  const sections = cheatsheetContent
    .split("---")
    .filter((section) => section.trim());

  // Helper function to format mathematical notation
  const formatMathText = (text) => {
    // Format subscripts (e.g., a₀, n₁)
    let formattedText = text.replace(/([a-z])(\d)/gi, "$1₍$2₎");

    // Format superscripts (e.g., x², 2ⁿ)
    formattedText = formattedText.replace(/\^(\d+)/g, "⁽$1⁾");

    // Format special symbols
    const symbolMap = {
      ">=": "≥",
      "<=": "≤",
      "!=": "≠",
      phi: "φ",
      sqrt: "√",
      "->": "→",
      N0: "ℕ₀",
      N: "ℕ",
      Z: "ℤ",
    };

    Object.entries(symbolMap).forEach(([key, value]) => {
      formattedText = formattedText.replace(new RegExp(key, "g"), value);
    });

    return formattedText;
  };

  // Helper function to handle code-like blocks
  const formatCodeBlock = (text) => {
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

        return (
          <div key={index} className="mb-8 bg-white rounded-lg shadow-md p-6">
            {lines.map((line, lineIndex) => {
              const titleMatch1 = line.match(/^TITLE:\s(.+)/);
              const subtopicMatch = line.match(/^SUBTOPIC:\s(.+)/);
              const detailMatch = line.match(/^DETAIL_\d+:\s(.+)/);

              if (titleMatch1) {
                return (
                  <h2
                    key={lineIndex}
                    className="text-3xl font-bold mb-4 text-blue-900 border-b pb-2"
                  >
                    {formatMathText(titleMatch1[1])}
                  </h2>
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
              } else {
                return (
                  <p key={lineIndex} className="ml-4 mb-2 font-normal">
                    {formatMathText(line.trim())}
                  </p>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
};

  // Define the toggleSelection function to handle option changes
  const toggleSelection = (option) => {
    // If the clicked option is already selected, deselect it; otherwise, select the new option.
    if (selectedOption === option) {
      setSelectedOption(""); // Deselect if it's the current option
    } else {
      setSelectedOption(option); // Select the clicked option
    }
  };

const handleDownloadPDF = async () => {
  // Wait for images to load
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

  // Then generate PDF
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

  html2pdf()
    .set(opt)
    .from(element)
    .save()
    .catch((err) => {
      console.error("Error generating PDF:", err);
    });
};

  if (typeof window !== "undefined") {
    // Code that uses window, document, or self
  }

    
    return (
      <div>
        <div className="flex-1 flex flex-col items-center w-full h-screen relative bg-black">
          <div className="w-3/4 mx-auto flex flex-col items-start">
            {/* Nav Bar */}
            <div className="w-full flex justify-between items-center pt-10 pb-5">
              <div className="text-white text-4xl font-extrabold font-inter capitalize">
                Brev
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

            {/* Phrases Section */}
            <div className="w-full pt-[20px] mx-auto my-10">
              <div className="w-full">
                <span className="text-white text-[4vw] md:text-[69px] font-semibold leading-tight font-Inter">
                  Don’t worry,{" "}
                </span>
                <span className="text-[#2d64dd] text-[4vw] md:text-[69px] font-semibold leading-tight font-Inter">
                  {" "}
                  Brev’s
                </span>
                <span className="text-white text-[4vw] md:text-[69px] font-semibold leading-tight font-Inter">
                  {" "}
                  got your back.
                </span>
              </div>
              <div className="text-white text-[2vw] md:text-6xl font-light leading-tight font-Inter mt-4">
                Just upload a file
              </div>
              <div className="text-white text-[2vw] md:text-6xl font-light leading-tight font-Inter mt-4">
                and choose your
              </div>
              <div className="text-white text-[2vw] md:text-6xl font-light leading-tight font-Inter mt-4 flex items-center">
                <span>desired </span>
                <img
                  className="w-[40vw] max-w-[254px] h-auto ml-2"
                  src="https://via.placeholder.com/254x85"
                  alt="Message GIF"
                />
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl bg-black border border-gray-700 shadow-md rounded-lg p-6 mt-6"
          >
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
                className="cursor-pointer mt-2 px-4 py-2 bg-white text-black border rounded-full inline-block text-center hover:bg-gray-700 transition-colors"
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
                Text Prompt (Optional)
              </label>
              <input
                type="text"
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                className="mt-2 p-2 border border-gray-500 rounded w-full bg-black text-white"
                placeholder="Enter any additional prompt (optional)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-lg font-medium text-white mb-2">
                Select an option:
              </label>
              <div className="flex justify-start gap-4">
                <button
                  type="submit"
                  className={`bg-${
                    loadingCheatsheet ? "yellow-500" : "white"
                  } text-black px-4 py-2 rounded-full`}
                  disabled={loadingCheatsheet}
                >
                  {loadingCheatsheet ? "Generating..." : "Generate Cheatsheet"}
                </button>
                <button
                  type="button"
                  className={`bg-${
                    loadingMnemonics ? "yellow-500" : "white"
                  } text-black px-4 py-2 rounded-full ml-4`}
                  onClick={handleGenerateMnemonics}
                  disabled={loadingMnemonics}
                >
                  {loadingMnemonics ? "Generating..." : "Generate Mnemonics"}
                </button>
                <button
                  type="button"
                  className={`bg-${
                    loadingQuiz ? "yellow-500" : "white"
                  } text-black px-4 py-2 rounded-full ml-4`}
                  onClick={handleGenerateQuiz}
                  disabled={loadingQuiz}
                >
                  {loadingQuiz ? "Generating..." : "Generate Quiz"}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 mt-2">{errorMessage}</p>
            )}

            <div className="mb-4">
              <div className="flex justify-start gap-4">
                <button
                  type="button"
                  className={`px-3 py-1 rounded-full ${
                    selectedOption === "Detailed"
                      ? "bg-yellow-500 text-black"
                      : "bg-white text-black"
                  }`}
                  onClick={() => toggleSelection("Detailed")}
                >
                  Detailed
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-full ${
                    selectedOption === "Precise"
                      ? "bg-yellow-500 text-black"
                      : "bg-white text-black"
                  }`}
                  onClick={() => toggleSelection("Precise")}
                >
                  Precise
                </button>
              </div>
            </div>
          </form>

          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mt-6">
            <div
              id="cheatsheet-content"
              className="text-lg text-black min-h-[500px]"
            >
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
              className="mt-4 px-4 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
            >
              Download as PDF
            </button>
          )}

          <div className="flex gap-4 mt-8">
            <Link href="/">
              <label className="flex items-center justify-center w-58 p-4 bg-white text-black border rounded-full cursor-pointer hover:bg-custom-hover transition-colors">
                <span className="font-bold">Back</span>
              </label>
            </Link>
          </div>
        </div>
      </div>
    );
};

export default ResponsePage;

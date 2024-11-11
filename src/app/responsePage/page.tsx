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
        `Generate a comprehensive cheat sheet based on the provided document. Structure each section as follows:
        TITLE: Main title goes here
        SUBTOPIC: Subtopic title goes here
        DETAIL_1: First detail
        DETAIL_2: Second detail (add additional details as needed)
        Provide explanations, context, and insights to enhance understanding. Use clear and simple language for each detail to ensure a thorough grasp of the topic. If the document is an exam study guide with topics organized by chapters, reference each chapter and summarize its contents. Separate each main title with three dashes (---).
      `;
    } else if (selectedOption === "Precise") {
      customPrompt = customPrompt || `
        Please create a concise cheat sheet from the provided document. Use the following format:
        
        Main Titles: Enclose in curly brackets {}.
        Subtopics: Enclose in square brackets [].
        Details: Present each detail as a bullet point under the corresponding subtopic.
        Ensure all text is in normal font. Use the format strictly:
        
        {Main Title}
        [Subtopic]
        Bullet point 1
        Bullet point 2
        
        Keep explanations brief and to the point. Only include essential details for each topic, avoiding any unnecessary expansion.
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
  const sections = cheatsheetContent.split("---").filter((section) => section.trim());

  return (
    <div id="cheatsheet-content" className="text-black">
      {sections.map((section, index) => {
        // Split each section into lines
        const lines = section.trim().split("\n").filter((line) => line.trim());

        return (
          <div key={index} className="mb-6">
            {lines.map((line, lineIndex) => {
              const titleMatch = line.match(/^## (.+)/); // Main Title
              const subtopicMatch = line.match(/^\*\*SUBTOPIC:\s*(.+)\*\*/); // Subtopic
              const detailMatch = line.match(/^\*\*DETAIL_\d+:\s*(.+)/); // Detail

              if (titleMatch) {
                // Render Main Title as bold, large font
                return (
                  <h2 key={lineIndex} className="text-3xl font-bold mb-4">
                    {titleMatch[1]}
                  </h2>
                );
              } else if (subtopicMatch) {
                // Render Subtopic as semi-bold, medium font
                return (
                  <h3
                    key={lineIndex}
                    className="text-xl font-semibold ml-4 mb-2"
                  >
                    {subtopicMatch[1]}
                  </h3>
                );
              } else if (detailMatch) {
                // Render Detail as bullet point
                return (
                  <ul key={lineIndex} className="ml-8 list-disc">
                    <li className="mb-2">{detailMatch[1]}</li>
                  </ul>
                );
              } else {
                // Render any unformatted text as fallback
                return (
                  <p key={lineIndex} className="ml-8 mb-2">
                    {line.trim()}
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

  const handleDownloadPDF = () => {
    const element = document.getElementById('cheatsheet-content');
    
    if (!element) {
      console.error('Cheatsheet content element not found');
      return;
    }

    const opt = {
      margin: 10,
      filename: 'cheatsheet.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true,
        letterRendering: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Add pagebreak options
    };

    html2pdf().set(opt).from(element).save().catch(err => {
      console.error('Error generating PDF:', err);
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
              <div className="text-white text-4xl font-extrabold font-['Inter'] capitalize">
                Brev
              </div>
              <div className="flex gap-8">
                <div className="text-white text-lg font-normal font-['Inter']">
                  About
                </div>
                <div className="text-white text-lg font-normal font-['Inter']">
                  Pricing
                </div>
                <div className="text-white text-lg font-normal font-['Inter']">
                  Contact
                </div>
              </div>
            </div>

            {/* Phrases Section */}
            <div className="w-full pt-[20px] mx-auto my-10">
              <div className="w-full">
                <span className="text-white text-[4vw] md:text-[69px] font-semibold leading-tight font-['Inter']">
                  Don’t worry,{" "}
                </span>
                <span className="text-[#2d64dd] text-[4vw] md:text-[69px] font-semibold leading-tight font-['Inter']">
                  {" "}
                  Brev’s
                </span>
                <span className="text-white text-[4vw] md:text-[69px] font-semibold leading-tight font-['Inter']">
                  {" "}
                  got your back.
                </span>
              </div>
              <div className="text-white text-[2vw] md:text-6xl font-light leading-tight font-['Inter'] mt-4">
                Just upload a file
              </div>
              <div className="text-white text-[2vw] md:text-6xl font-light leading-tight font-['Inter'] mt-4">
                and choose your
              </div>
              <div className="text-white text-[2vw] md:text-6xl font-light leading-tight font-['Inter'] mt-4 flex items-center">
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

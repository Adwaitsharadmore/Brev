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
      // Read the file content to check for special characters
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        if (typeof content === "string" && /[\{\}\[\]\(\)]/.test(content)) {
          setTextPrompt(
            "Special characters found in document. Adjust prompt accordingly."
          );
        }
      };
      reader.readAsText(selectedFile);
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
      customPrompt = customPrompt || `
        Create a comprehensive cheat sheet from the provided document. Use the following format:
        
        1. Main Titles: Enclose in curly brackets {}.
        2. Subtopics: Enclose in square brackets [].
        3. Details: Present each detail as a bullet point under the corresponding subtopic.
        
        Ensure all text is in normal font. Follow this structure consistently:
        
        - {Main Title}
          - [Subtopic]
            - Bullet point 1
            - Bullet point 2
      
        Use clear and simple language for bullet points. Provide additional explanations, context, and insights beyond the document to enhance understanding. Expand on each point to ensure a thorough grasp of the topic. If the uploaded file is a exam study guide with topics of specific chapter numbers, read through each chapter and their contents.
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
      formData.append(
        "textPrompt",
        "Generate 5 multiple-choice questions based on the document provided. Each question should be enclosed in curly brackets {}. List the four options within square brackets [], with each option labeled with a), b), c), and d) on a new line using \n to separate them. Place the correct option in parentheses () as a letter (a, b, c, or d) on a new line after the options. Ensure the output strictly follows this format: {Question text} [a) Option A\nb) Option B\nc) Option C\nd) Option D] \n(Correct option letter). Please use this format exactly as described."
      );

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

    const lines = cheatsheetContent.split("\n").filter((line) => line.trim() !== "");


    return (
      <div className="text-black">
        {lines.map((line, index) => {
          const mainTitleMatch = line.match(/\{(.+?)\}/);
          const subtopicMatch = line.match(/\[(.+?)\]/);

          if (mainTitleMatch) {
            // Main Title
            const mainTitle = mainTitleMatch[1];
            return (
              <h2 key={index} className="text-3xl font-bold mb-4">
                {mainTitle}
              </h2>
            );
          } else if (subtopicMatch) {
            // Subtopic
            const subtopic = subtopicMatch[1];
            return (
              <h3 key={index} className="text-xl font-semibold ml-4 mb-2">
                {subtopic}
              </h3>
            );
          } else {
            // Detail
            return (
              <p key={index} className="ml-8 mb-2">
                {line.replace(/^\-\s*/, "").trim()}
              </p>
            );
          }
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
    <div className="min-h-screen bg-gradient-preppal text-white">
      <div>
        <Link href="/">
          <Image
            src="/images/logo.JPG"
            alt="PrepPal Logo"
            width={100}
            height={100}
            className="object-cover rounded-full"
          />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="min-h-screen flex-1 flex justify-center items-center flex-col">
          <div className="font-semibold text-6xl text-white font-inter mb-6">
            Here's your
            <span className="font-semibold text-6xl" style={{ color: "rgba(235, 255, 92, 1)" }}>
              {" "}
              cheatsheet!
            </span>
          </div>
          <div className="font text-2xl pb-5 pt-2 text-white">
            Your file has been converted to the following cheatsheet:
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
                  Selected file: <span className="font-semibold">{file.name}</span>
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
              <label className="block text-lg font-medium text-white mb-2">Select an option:</label>
              <div className="flex justify-start gap-4">
                <button
                  type="submit"
                  className={`bg-${loadingCheatsheet ? "yellow-500" : "white"} text-black px-4 py-2 rounded-full`}
                  disabled={loadingCheatsheet}
                >
                  {loadingCheatsheet ? "Generating..." : "Generate Cheatsheet"}
                </button>
                <button
                  type="button"
                  className={`bg-${loadingMnemonics ? "yellow-500" : "white"} text-black px-4 py-2 rounded-full ml-4`}
                  onClick={handleGenerateMnemonics}
                  disabled={loadingMnemonics}
                >
                  {loadingMnemonics ? "Generating..." : "Generate Mnemonics"}
                </button>
                <button
                  type="button"
                  className={`bg-${loadingQuiz ? "yellow-500" : "white"} text-black px-4 py-2 rounded-full ml-4`}
                  onClick={handleGenerateQuiz}
                  disabled={loadingQuiz}
                >
                  {loadingQuiz ? "Generating..." : "Generate Quiz"}
                </button>
              </div>
            </div>

            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

            <div className="mb-4">
              <div className="flex justify-start gap-4">
                <button
                  type="button"
                  className={`px-3 py-1 rounded-full ${selectedOption === "Detailed" ? "bg-yellow-500 text-black" : "bg-white text-black"}`}
                  onClick={() => toggleSelection("Detailed")}
                >
                  Detailed
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-full ${selectedOption === "Precise" ? "bg-yellow-500 text-black" : "bg-white text-black"}`}
                  onClick={() => toggleSelection("Precise")}
                >
                  Precise
                </button>
              </div>
            </div>
          </form>

          <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mt-6">
            <div id="cheatsheet-content" className="text-lg text-black min-h-[500px]">
              {cheatsheetContent ? (
                renderCheatsheetAsList()
              ) : (
                <p>{loadingCheatsheet ? "Generating your cheatsheet..." : "Your cheatsheet content will be displayed here once generated."}</p>
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
    </div>
  );
};

export default ResponsePage;

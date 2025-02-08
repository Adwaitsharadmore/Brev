import React, { useState, useEffect } from "react";
import { BookOpen, CheckCircle2, AlertCircle, X } from "lucide-react";

interface CustomContentItem {
  type: "detail" | "text";
  content: string;
}

// Helper functions moved outside component
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
      <pre className="bg-gray-800 p-4 rounded-md font-mono text-sm my-2 whitespace-pre-wrap text-gray-100">
        {text}
      </pre>
    );
  }
  return formatMathText(text);
};

interface CheatsheetListProps {
  loadingCheatsheet: boolean;
 
  isLoading: boolean;
  cheatsheetContent: string;
  isCustomPrompt: boolean;
}

// Add this type for storing mnemonics
interface MnemonicsContent {
  [topicTitle: string]: {
    acronyms: string;
    rhymes: string;
    loci: string;
    keywords: string;
  };
}

// Main component
const StudentNotes = ({
  loadingCheatsheet,
  isLoading,
  cheatsheetContent,
  isCustomPrompt,
}: CheatsheetListProps) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [activeTab, setActiveTab] = useState("acronyms");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<MnemonicsContent>(
    {}
  );
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!cheatsheetContent) return null;

  const sections = cheatsheetContent
    .split("---")
    .filter((section) => section.trim());

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Function to check if mnemonics exist for a topic
  const hasMnemonicsForTopic = (title: string) => {
    return !!generatedContent[title];
  };

  // Add this new function after hasMnemonicsForTopic
  const getContainerContent = (title: string) => {
    const section = sections.find((section) => section.includes(title));
    return section ? section.replace(/\n/g, " ") : title;
  };

  // Update generateMnemonic function
  const generateMnemonic = async (type: string) => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-mnemonics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedTitle,
          content: getContainerContent(selectedTitle), // Send full container content
          type: type,
        }),
      });

      const data = await response.json();

      setGeneratedContent((prev) => ({
        ...prev,
        [selectedTitle]: {
          ...prev[selectedTitle],
          [type]: data.generatedText,
        },
      }));
    } catch (error) {
      console.error("Error generating mnemonic:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Modify the button click handler
  const handleMnemonicsClick = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTitle(title);
    setIsModalOpen(true);

    // Only generate if we don't already have content for this topic
    if (!hasMnemonicsForTopic(title)) {
      setIsGeneratingAll(true);
      setProgress(0);
      generateAllMnemonics(title);
    }
  };

  // Update generateAllMnemonics function
  const generateAllMnemonics = async (title: string) => {
    setIsGeneratingAll(true);
    setProgress(0);

    const types = ["acronyms", "rhymes", "loci", "keywords"];
    const newContent = {
      acronyms: "",
      rhymes: "",
      loci: "",
      keywords: "",
    };

    for (let i = 0; i < types.length; i++) {
      try {
        const response = await fetch("/api/generate-mnemonics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            content: getContainerContent(title), // Send full container content
            type: types[i],
          }),
        });

        const data = await response.json();
        newContent[types[i] as keyof typeof newContent] = data.generatedText;
        setProgress((i + 1) * 25);
      } catch (error) {
        console.error(`Error generating ${types[i]}:`, error);
        newContent[
          types[i] as keyof typeof newContent
        ] = `Error generating ${types[i]}`;
      }
    }

    setGeneratedContent((prev) => ({
      ...prev,
      [title]: newContent,
    }));
    setIsGeneratingAll(false);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 bg-gray-50">
        {sections.map((section, index) => {
          const lines = section
            .trim()
            .split("\n")
            .filter((line) => line.trim());

          let currentTitle = "";
          let currentSubtopic = "";
          let currentExplanation = "";
          let customContent: CustomContentItem[] = [];

          lines.forEach((line) => {
            const titleMatch = line.match(/^TITLE:\s(.+)/);
            const subtopicMatch = line.match(/^SUBTOPIC:\s(.+)/);
            const explanationMatch = line.match(/^Explanation:\s(.+)/);
            const detailMatch = line.match(/^DETAIL_\d+:\s(.+)/);

            if (titleMatch) {
              currentTitle = titleMatch[1];
            } else if (subtopicMatch) {
              currentSubtopic = subtopicMatch[1];
            } else if (explanationMatch) {
              currentExplanation = explanationMatch[1];
            } else if (detailMatch) {
              customContent.push({ type: "detail", content: detailMatch[1] });
            } else {
              customContent.push({ type: "text", content: line });
            }
          });

          const isExpanded = expandedSections[index] ?? true;

          return (
            <div
              key={index}
              className="mb-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`p-6 ${isExpanded ? "" : "cursor-pointer"}`}>
                {lines.map((line, lineIndex) => {
                  const titleMatch = line.match(/^TITLE:\s(.+)/);
                  const subtopicMatch = line.match(/^SUBTOPIC:\s(.+)/);
                  const detailMatch = line.match(/^DETAIL_\d+:\s(.+)/);
                  const explanationMatch = line.match(/^Explanation:\s(.+)/);

                  if (titleMatch) {
                    return (
                      <div
                        key={lineIndex}
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection(index)}
                      >
                        <div className="flex items-center space-x-3">
                          <BookOpen className="w-6 h-6 text-purple-600" />
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {formatMathText(titleMatch[1])}
                          </h2>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                            onClick={(e) =>
                              handleMnemonicsClick(titleMatch[1], e)
                            }
                          >
                            Generate Mnemonics
                          </button>
                          <div className="text-gray-400">
                            {isExpanded ? "▼" : "▶"}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (!isExpanded) return null;

                  if (explanationMatch) {
                    return (
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold text-purple-800">
                            Key Points:
                          </span>
                        </div>
                        <p className="text-gray-700">{explanationMatch[1]}</p>
                      </div>
                    );
                  }

                  if (subtopicMatch) {
                    return (
                      <div className="mt-6 mb-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <h3 className="text-xl font-semibold text-gray-800">
                            {formatMathText(subtopicMatch[1])}
                          </h3>
                        </div>
                      </div>
                    );
                  }

                  if (detailMatch) {
                    const detailContent = detailMatch[1].trim();
                    return (
                      <div className="ml-8 mb-4 group">
                        <div className="flex items-start space-x-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
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
                              <div className="font-normal text-gray-700">
                                {formatMathText(detailContent)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {isExpanded && isCustomPrompt && customContent.length > 0 && (
                <div className="mt-4">
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
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[70%] h-[70%] relative overflow-hidden">
            {/* Modal Header */}
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-purple-600">
                Mnemonics for: {selectedTitle}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex space-x-8 px-6">
                {[
                  { id: "acronyms", label: "Acronyms" },
                  { id: "rhymes", label: "Rhymes" },
                  { id: "loci", label: "Method of Loci" },
                  { id: "keywords", label: "Keywords" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 relative ${
                      activeTab === tab.id
                        ? "text-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto h-[calc(100%-8rem)]">
              {isGeneratingAll ? (
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-gray-600">
                    Generating mnemonics... {progress}%
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {activeTab === "acronyms" && (
                    <div className="space-y-4">
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold text-purple-800">
                            Acronym:
                          </span>
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap font-medium">
                          {generatedContent[selectedTitle]?.acronyms}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "rhymes" && (
                    <div className="space-y-4">
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold text-purple-800">
                            Rhyme:
                          </span>
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap font-medium">
                          {generatedContent[selectedTitle]?.rhymes}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "loci" && (
                    <div className="space-y-4">
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold text-purple-800">
                            Memory Palace Visualization:
                          </span>
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap font-medium">
                          {generatedContent[selectedTitle]?.loci}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "keywords" && (
                    <div className="space-y-4">
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold text-purple-800">
                            Key Associations:
                          </span>
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap font-medium">
                          {generatedContent[selectedTitle]?.keywords}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentNotes;

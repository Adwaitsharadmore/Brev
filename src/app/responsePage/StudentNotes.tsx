import React, { useState } from "react";
import { BookOpen, CheckCircle2, AlertCircle, X } from "lucide-react";

interface CheatsheetSection {
  title: string;
  explanation: string;
  subtopic: string;
  details: string[];
}

interface MnemonicsContent {
  [topicTitle: string]: {
    acronyms?: {
      acronym: string;
      letters: string[];
      explanation: string;
    };
    rhymes?: {
      rhyme: string;
      explanation: string;
    };
    loci?: {
      setting: string;
      visualizations: string[];
      connections: string;
      instructions: string;
    };
    keywords?: {
      keywords: string[];
      significance: string;
      connections: string;
      usage: string;
    };
  };
}

interface CheatsheetListProps {
  loadingCheatsheet: boolean;
  isLoading: boolean;
  cheatsheetContent: CheatsheetSection[];
  isCustomPrompt: boolean;
}

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

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const hasMnemonicsForTopic = (title: string) => {
    return !!generatedContent[title];
  };

  // const generateMnemonic = async (type: string) => {
  //   setIsGenerating(true);
  //   try {
  //     const response = await fetch("/api/generate-mnemonics", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         title: selectedTitle,
  //         type,
  //       }),
  //     });

  //     const data = await response.json();

  //     setGeneratedContent((prev) => ({
  //       ...prev,
  //       [selectedTitle]: {
  //         ...prev[selectedTitle],
  //         [type]: data.result,
  //       },
  //     }));
  //   } catch (error) {
  //     console.error("Error generating mnemonic:", error);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  const handleMnemonicsClick = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTitle(title);
    setIsModalOpen(true);

    if (!hasMnemonicsForTopic(title)) {
      setIsGeneratingAll(true);
      setProgress(0);
      generateAllMnemonics(title);
    }
  };

  const generateAllMnemonics = async (title: string) => {
    setIsGeneratingAll(true);
    setProgress(0);
    const types = ["acronyms", "rhymes", "loci", "keywords"];
    const newContent: any = {};

    for (let i = 0; i < types.length; i++) {
      try {
        const response = await fetch("/api/generate-mnemonics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            type: types[i],
            content: cheatsheetContent,
          }),
        });
        const data = await response.json();
        newContent[types[i]] = data.result;
        setProgress((i + 1) * 25);
      } catch (error) {
        console.error(`Error generating ${types[i]}:`, error);
        newContent[types[i]] = { error: `Error generating ${types[i]}` };
      }
    }

    setGeneratedContent((prev) => ({
      ...prev,
      [title]: newContent,
    }));
    setIsGeneratingAll(false);
  };

  if (!cheatsheetContent || cheatsheetContent.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50">
      {cheatsheetContent.map((section, index) => (
        <div
          key={index}
          className="mb-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div
            className={`p-6 ${
              expandedSections[index] ?? true ? "" : "cursor-pointer"
            }`}
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection(index)}
            >
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {section.title}
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition-colors"
                  onClick={(e) => handleMnemonicsClick(section.title, e)}
                >
                  Generate Mnemonics
                </button>
                <div className="text-gray-400">
                  {expandedSections[index] ?? true ? "▼" : "▶"}
                </div>
              </div>
            </div>

            {(expandedSections[index] ?? true) && (
              <>
                {section.explanation && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">
                        Explanation:
                      </span>
                    </div>
                    <p className="text-gray-700">{section.explanation}</p>
                  </div>
                )}

                {section.subtopic && (
                  <div className="mt-6 mb-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <h3 className="text-xl font-semibold text-gray-800">
                        {section.subtopic}
                      </h3>
                    </div>
                  </div>
                )}

                <div className="ml-8 mb-4">
                  {section.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 mb-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <div className="text-gray-700">{detail}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {isModalOpen && selectedTitle === section.title && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl w-[90%] md:w-[70%] max-h-[90%] overflow-y-auto relative">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-semibold text-purple-600">
                      Mnemonics for: {selectedTitle}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)}>
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  <div className="flex justify-around border-b text-sm font-medium">
                    {["acronyms", "rhymes", "loci", "keywords"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 px-4 ${
                          activeTab === tab
                            ? "text-purple-600 border-b-2 border-purple-600"
                            : "text-gray-500"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="p-6 text-sm text-gray-700 whitespace-pre-wrap">
                    {isGeneratingAll ? (
                      <div className="text-center">
                        Generating mnemonics... {progress}%
                      </div>
                    ) : (
                      <>
                        {activeTab === "acronyms" &&
                          generatedContent[selectedTitle]?.acronyms && (
                            <>
                              <p className="mb-2">
                                <strong>Acronym:</strong>{" "}
                                {
                                  generatedContent[selectedTitle].acronyms!
                                    .acronym
                                }
                              </p>
                              <p className="mb-2">
                                <strong>Letters:</strong>{" "}
                                {generatedContent[
                                  selectedTitle
                                ]?.acronyms?.letters?.join(", ") || "N/A"}
                              </p>
                              <p>
                                <strong>Explanation:</strong>{" "}
                                {
                                  generatedContent[selectedTitle].acronyms!
                                    .explanation
                                }
                              </p>
                            </>
                          )}
                        {activeTab === "rhymes" &&
                          generatedContent[selectedTitle]?.rhymes && (
                            <>
                              <p className="mb-2">
                                <strong>Rhyme:</strong>{" "}
                                {generatedContent[selectedTitle].rhymes!.rhyme}
                              </p>
                              <p>
                                <strong>Explanation:</strong>{" "}
                                {
                                  generatedContent[selectedTitle].rhymes!
                                    .explanation
                                }
                              </p>
                            </>
                          )}
                        {activeTab === "loci" &&
                          generatedContent[selectedTitle]?.loci && (
                            <>
                              <p className="mb-2">
                                <strong>Setting:</strong>{" "}
                                {generatedContent[selectedTitle].loci!.setting}
                              </p>
                              <p className="mb-2">
                                <strong>Visualizations:</strong>{" "}
                                {generatedContent[
                                  selectedTitle
                                ].loci!.visualizations.join(", ")}
                              </p>
                              <p className="mb-2">
                                <strong>Connections:</strong>{" "}
                                {
                                  generatedContent[selectedTitle].loci!
                                    .connections
                                }
                              </p>
                              <p>
                                <strong>Instructions:</strong>{" "}
                                {
                                  generatedContent[selectedTitle].loci!
                                    .instructions
                                }
                              </p>
                            </>
                          )}
                        {activeTab === "keywords" &&
                          generatedContent[selectedTitle]?.keywords && (
                            <>
                              <p className="mb-2">
                                <strong>Keywords:</strong>{" "}
                                {generatedContent[
                                  selectedTitle
                                ].keywords!.keywords.join(", ")}
                              </p>
                              <p className="mb-2">
                                <strong>Significance:</strong>{" "}
                                {
                                  generatedContent[selectedTitle].keywords!
                                    .significance
                                }
                              </p>
                              <p className="mb-2">
                                <strong>Connections:</strong>{" "}
                                {
                                  generatedContent[selectedTitle].keywords!
                                    .connections
                                }
                              </p>
                              <p>
                                <strong>Usage:</strong>{" "}
                                {
                                  generatedContent[selectedTitle].keywords!
                                    .usage
                                }
                              </p>
                            </>
                          )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentNotes;

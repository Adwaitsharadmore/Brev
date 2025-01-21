import React, { useState } from "react";
import { BookOpen, CheckCircle2, AlertCircle } from "lucide-react";

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
  loadingMnemonics: boolean;
  loadingQuiz: boolean;
  isLoading: boolean;
  cheatsheetContent: string;
  showingMnemonics: boolean;
  parseMnemonics: (content: string) => Mnemonic[];
  isCustomPrompt: boolean;
  MnemonicCards: React.ComponentType<{ mnemonics: Mnemonic[] }>;
}

// Main component
const StudentNotes= ({
  loadingCheatsheet,
  loadingMnemonics,
  loadingQuiz,
  isLoading,
  cheatsheetContent,
  showingMnemonics,
  parseMnemonics,
  isCustomPrompt,
  MnemonicCards,
}: CheatsheetListProps) => {
  const [expandedSections, setExpandedSections] = useState<
    Record<number, boolean>
  >({});

  if (!cheatsheetContent) return null;

  if (showingMnemonics) {
    const mnemonics = parseMnemonics(cheatsheetContent);
    return <MnemonicCards mnemonics={mnemonics} />;
  }

  const sections = cheatsheetContent
    .split("---")
    .filter((section) => section.trim());

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50">
      {sections.map((section, index) => {
        const lines = section
          .trim()
          .split("\n")
          .filter((line) => line.trim());

        // Extract section information
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
                      <div className="text-gray-400">
                        {isExpanded ? "▼" : "▶"}
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
                      <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
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

            {isExpanded && mnemonics.length > 0 && (
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

export default StudentNotes;

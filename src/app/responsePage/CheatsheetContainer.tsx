import React, { useState } from "react";
import {
  BookOpen,
  Code,
  Terminal,
  FileCode,
  Command,
  Hash,
  ChevronRight,
} from "lucide-react";

interface Mnemonic {
  text: string;
  type: string;
  title: string;
  subtopic: string;
  explanation: string;
}

interface CustomContentItem {
  type: "detail" | "text" | "command";
  content: string;
}

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

const formatCodeBlock = (text: string, type: "detail" | "text" | "command") => {
  if (type === "command") {
    return (
      <div className="flex items-start gap-2 rounded-md p-2 font-inter text-sm text-zinc-100">
       
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    );
  }

  if (text.includes("{") || text.includes("if") || text.includes("→")) {
    return (
      <p className="my-2 whitespace-pre-wrap rounded-md text-zinc-950">
        {text}
      </p>
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

const CheatsheetList = ({
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

  return (
    <div className="min-h-[210mm] w-[297mm] bg-gradient-to-b from-purple-50 to-white p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="columns-1 md:columns-2 gap-6">
          {sections.map((section: string, sectionIndex: number) => {
            const lines = section
              .trim()
              .split("\n")
              .filter((line) => line.trim());

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
              const commandMatch = line.match(/^\$\s(.+)/);

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
              } else if (commandMatch) {
                customContent.push({
                  type: "command",
                  content: commandMatch[1],
                });
              } else {
                customContent.push({ type: "text", content: line });
              }
            });

            return (
              <div
                key={sectionIndex}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all mb-6 break-inside-avoid-column"
              >
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {`${sectionIndex + 1}. ${currentTitle}`}
                  </h2>
                </div>

                {currentExplanation && (
                  <p className="text-sm text-gray-600 mb-4 font-inter">
                    {currentExplanation}
                  </p>
                )}

                {currentSubtopic && (
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    {currentSubtopic}
                  </h3>
                )}

                <div className="space-y-4">
                  {customContent.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-purple-500 mt-1" />
                      <div className="flex-1 font-inter">
                        {formatCodeBlock(item.content, item.type)}
                      </div>
                    </div>
                  ))}
                </div>

                {mnemonics.length > 0 && (
                  <div className="mt-6 bg-purple-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-3 text-purple-700">
                      Memory Aids
                    </h4>
                    <div className="ml-4">
                      <MnemonicCards mnemonics={mnemonics} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheatsheetList;

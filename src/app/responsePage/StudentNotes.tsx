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

interface CheatsheetSection {
  title: string;
  explanation: string;
  subtopic: string;
  details: string[];
}

interface CheatsheetListProps {
  loadingCheatsheet: boolean;
  isLoading: boolean;
  cheatsheetContent: CheatsheetSection[];
  isCustomPrompt: boolean;
}

interface MnemonicsContent {
  [topicTitle: string]: {
    acronyms: string;
    rhymes: string;
    loci: string;
    keywords: string;
  };
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

  const getContainerContent = (title: string) => {
    const section = cheatsheetContent.find(
      (section) => section.title === title
    );
    if (!section) return title;
    return `TITLE: ${section.title}\nExplanation: ${
      section.explanation
    }\nSUBTOPIC: ${section.subtopic}\n${section.details
      .map((detail, idx) => `DETAIL_${idx + 1}: ${detail}`)
      .join("\n")}`;
  };

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
          content: getContainerContent(selectedTitle),
          type,
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
            title,
            content: getContainerContent(title),
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

  if (!cheatsheetContent || cheatsheetContent.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50">
      {/* Rendering logic goes here, similar to what was previously done, mapping over cheatsheetContent */}
    </div>
  );
};

export default StudentNotes;

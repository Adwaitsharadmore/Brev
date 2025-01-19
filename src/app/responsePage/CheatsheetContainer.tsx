import React, { useState } from "react";
import { Paper, Typography, Box, Card, CardContent } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { ChevronRight } from "lucide-react";

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
      <Box
        display="flex"
        alignItems="start"
        gap={1}
        sx={{
          p: 1,
          fontFamily: "Inter, sans-serif",
          fontSize: "0.875rem",
          color: "text.primary",
        }}
      >
        <Typography sx={{ whiteSpace: "pre-wrap" }}>{text}</Typography>
      </Box>
    );
  }

  if (text.includes("{") || text.includes("if") || text.includes("→")) {
    return (
      <Typography
        sx={{
          my: 1,
          whiteSpace: "pre-wrap",
          color: "text.primary",
        }}
      >
        {text}
      </Typography>
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
    <Box
      sx={{
        minHeight: "210mm",
        background: "linear-gradient(to bottom, #F3E8FF, #FFFFFF)",
        p: 4,
      }}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3 }}
          spacing={3}
          sx={{ width: "auto" }}
        >
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
              <Paper
                key={sectionIndex}
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  "&:hover": {
                    boxShadow: 3,
                    transition: "box-shadow 0.3s ease-in-out",
                  },
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Typography variant="h6" color="text.primary">
                    {`${sectionIndex + 1}. ${currentTitle}`}
                  </Typography>
                </Box>

                {currentExplanation && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, fontFamily: "Inter, sans-serif" }}
                  >
                    {currentExplanation}
                  </Typography>
                )}

                {currentSubtopic && (
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                  >
                    {currentSubtopic}
                  </Typography>
                )}

                <Box sx={{ mt: 2 }}>
                  {customContent.map((item, idx) => (
                    <Box key={idx} display="flex" alignItems="start" gap={1}>
                      <ChevronRight className="w-2 h-2 text-blue-600 mt-0.5" />
                      <Box sx={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize:"1rem"}}>
                        {formatCodeBlock(item.content, item.type)}
                      </Box>
                    </Box>
                  ))}
                </Box>

                {mnemonics.length > 0 && (
                  <Card
                    sx={{ mt: 3, bgcolor: "primary.light", borderRadius: 2 }}
                  >
                    <CardContent>
                      <Typography
                        variant="h2"
                        color="primary.dark"
                        sx={{ mb: 1.5 }}
                      >
                        Memory Aids
                      </Typography>
                      <Box sx={{ ml: 2 }}>
                        <MnemonicCards mnemonics={mnemonics} />
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Paper>
            );
          })}
        </Masonry>
      </Box>
    </Box>
  );
};

export default CheatsheetList;

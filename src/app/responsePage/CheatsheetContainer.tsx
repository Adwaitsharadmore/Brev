import React, { useState, useCallback } from "react";
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  SpeedDial,
  SpeedDialAction,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { ChevronRight, Highlighter, X, Palette } from "lucide-react";

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
interface Selection {
  text: string;
  elementId: string;
  startOffset: number;
  endOffset: number;
}

interface Highlight {
  id: string;
  text: string;
  color: string;
  sectionId: number;
  elementId: string;
  startOffset: number;
  endOffset: number;
}
interface PendingHighlight {
  selections: Selection[];
  color: string;
}

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#fef08a" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Pink", value: "#fbcfe8" },
  { name: "Purple", value: "#e9d5ff" },
];

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
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [currentColor, setCurrentColor] = useState(HIGHLIGHT_COLORS[0].value);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!cheatsheetContent) return null;

  if (showingMnemonics) {
    const mnemonics = parseMnemonics(cheatsheetContent);
    return <MnemonicCards mnemonics={mnemonics} />;
  }

  const sections = cheatsheetContent
    .split("---")
    .filter((section) => section.trim());

  const handleTextSelection = (elementId: string) => {
    if (!isHighlighting) return;

    const selection = window.getSelection();
    if (
      !selection ||
      selection.rangeCount === 0 ||
      selection.toString().trim() === ""
    )
      return;

    const range = selection.getRangeAt(0);

    const newHighlight: Highlight = {
      id: Math.random().toString(36).substr(2, 9),
      text: selection.toString(),
      elementId,
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      color: currentColor, // Use the currently selected color
      sectionId: parseInt(elementId.split("-")[1]),
    };

    setHighlights((prev) => [...prev, newHighlight]);
    selection.removeAllRanges(); // Clear the selection after highlighting
  };

  const removeHighlight = (highlightId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setHighlights((prev) => prev.filter((h) => h.id !== highlightId));
  };

const handleColorChange = (color: string) => {
  setCurrentColor(color);
  setAnchorEl(null);
  setIsHighlighting(true); // Automatically start highlighting mode
};
[1];

  const renderHighlightedText = (text: string, elementId: string) => {
    const relevantHighlights = highlights
      .filter((h) => h.elementId === elementId)
      .sort((a, b) => a.startOffset - b.startOffset);

    if (relevantHighlights.length === 0) {
      return (
        <span onMouseUp={() => handleTextSelection(elementId)}>{text}</span>
      );
    }

    let lastIndex = 0;
    const segments = [];

    relevantHighlights.forEach((highlight, index) => {
      if (highlight.startOffset > lastIndex) {
        segments.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, highlight.startOffset)}
          </span>
        );
      }

      const highlightedText = text.slice(
        highlight.startOffset,
        highlight.endOffset
      );
      segments.push(
        <span
          key={highlight.id}
          style={{
            backgroundColor: highlight.color, // Light yellow highlight color
            position: "relative",
            padding: "0 1px",
            margin: "0 -1px",
          }}
        >
          {highlightedText}
          <IconButton
            size="small"
            onClick={(e) => removeHighlight(highlight.id, e)}
            sx={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              padding: "2px",
              backgroundColor: "white",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              opacity: 0,
              transition: "opacity 0.2s",
              "&:hover": { opacity: 1 },
              ".highlighted-text:hover &": { opacity: 1 },
            }}
          >
            <X size={12} />
          </IconButton>
        </span>
      );

      lastIndex = highlight.endOffset;
    });

    if (lastIndex < text.length) {
      segments.push(<span key="text-final">{text.slice(lastIndex)}</span>);
    }

    return (
      <span
        className="highlighted-text"
        onMouseUp={() => handleTextSelection(elementId)}
      >
        {segments}
      </span>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "210mm",
        background: "linear-gradient(to bottom, #F3E8FF, #FFFFFF)",
        p: 4,
        position: "relative",
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
                  cursor: isHighlighting ? "text" : "default",
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
                      <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <Box sx={{ flex: 1, fontFamily: "Inter, sans-serif" }}>
                        {typeof item.content === "string"
                          ? renderHighlightedText(
                              item.content,
                              `section-${sectionIndex}-item-${idx}`
                            )
                          : formatCodeBlock(item.content, item.type)}
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
        <Tooltip title="Choose Highlight Color">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Highlighter />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {HIGHLIGHT_COLORS.map((color) => (
            <MenuItem
              key={color.value}
              onClick={() => handleColorChange(color.value)}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: color.value,
                  mr: 1,
                }}
              />
              {color.name}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default CheatsheetList;

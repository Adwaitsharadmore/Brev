import React, { useState, useRef, useCallback } from "react";
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import {
  ChevronRight,
  Highlighter,
  X,
  Palette,
  Underline,
  StickyNote,
  Eraser,
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
interface Selection {
  text: string;
  elementId: string;
  startOffset: number;
  endOffset: number;
}

interface Highlight {
  id: string;
  range: Range;
  color: string;
  sectionId: number;
  markType: "highlight" | "underline";
}

interface Range {
  startContainer: Node;
  startOffset: number;
  endContainer: Node;
  endOffset: number;
}

interface PendingHighlight {
  selections: Selection[];
  color: string;
}
type MarkingMode = "highlight" | "underline" | "none";

interface Annotation {
  id: string;
  markId: string;
  text: string;
  color: string;
}

const MARK_COLORS = [
  { name: "Yellow", value: "#fef08a" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Pink", value: "#fbcfe8" },
  { name: "Purple", value: "#e9d5ff" },
  { name: "Black", value: "#000" },
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
  const [marks, setMarks] = useState<Highlight[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [markingMode, setMarkingMode] = useState<MarkingMode>("none");
  const [currentColor, setCurrentColor] = useState(MARK_COLORS[0].value);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [annotationDialogOpen, setAnnotationDialogOpen] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<{
    markId: string;
    text: string;
  } | null>(null);
    if (!cheatsheetContent) return null;

    if (showingMnemonics) {
      const mnemonics = parseMnemonics(cheatsheetContent);
      return <MnemonicCards mnemonics={mnemonics} />;
    }

    const sections = cheatsheetContent
      .split("---")
      .filter((section) => section.trim());

  const toggleMarkingMode = (mode: MarkingMode) => {
    setMarkingMode((current) => (current === mode ? "none" : mode));
    if (anchorEl) {
      setAnchorEl(null);
    }
  };

  
  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    setAnchorEl(null);
  };


 const applyHighlights = (sectionId: number, element: HTMLElement) => {
   const sectionMarks = marks.filter((m) => m.sectionId === sectionId);

   sectionMarks.forEach((mark) => {
     try {
       const range = document.createRange();
       range.setStart(mark.range.startContainer, mark.range.startOffset);
       range.setEnd(mark.range.endContainer, mark.range.endOffset);

       // Get all text nodes within the range
       const textNodes = [];
       const iterator = document.createNodeIterator(
         range.commonAncestorContainer,
         NodeFilter.SHOW_TEXT
       );

       let currentNode;
       while ((currentNode = iterator.nextNode())) {
         if (range.intersectsNode(currentNode)) {
           textNodes.push(currentNode);
         }
       }

       // Highlight each text node
       textNodes.forEach((textNode) => {
         let start =
           textNode === range.startContainer ? mark.range.startOffset : 0;
         let end =
           textNode === range.endContainer
             ? mark.range.endOffset
             : (textNode as Text).length;

         if (start !== end) {
           const highlightSpan = document.createElement("span");
           highlightSpan.style.backgroundColor =
             mark.markType === "highlight" ? mark.color : "transparent";
           highlightSpan.style.textDecoration =
             mark.markType === "underline"
               ? `underline ${mark.color} 2px`
               : "none";
           highlightSpan.style.position = "relative";
           highlightSpan.dataset.markId = mark.id;

           // Split text node if needed
           if (start > 0) {
             (textNode as Text).splitText(start);
             textNode = textNode.nextSibling as Text;
             end -= start;
             start = 0;
           }

           if (end < (textNode as Text).length) {
             (textNode as Text).splitText(end);
           }

           // Create the remove button
           const removeButton = document.createElement("span");
           removeButton.innerHTML = "×";
           removeButton.style.cssText = `
            position: absolute;
            top: -12px;
            right: -12px;
            width: 16px;
            height: 16px;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 12px;
            color: #666;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            z-index: 100;
          `;

           // Add hover events
           highlightSpan.addEventListener("mouseenter", () => {
             const buttons = document.querySelectorAll(
               `[data-mark-id="${mark.id}"] .remove-button`
             );
             buttons.forEach(
               (button) => ((button as HTMLElement).style.display = "flex")
             );
           });

           highlightSpan.addEventListener("mouseleave", (e) => {
             const buttons = document.querySelectorAll(
               `[data-mark-id="${mark.id}"] .remove-button`
             );
             buttons.forEach((button) => {
               const rect = button.getBoundingClientRect();
               if (
                 !(
                   e.clientX >= rect.left &&
                   e.clientX <= rect.right &&
                   e.clientY >= rect.top &&
                   e.clientY <= rect.bottom
                 )
               ) {
                 (button as HTMLElement).style.display = "none";
               }
             });
           });

           removeButton.classList.add("remove-button");
           removeButton.addEventListener("mouseenter", () => {
             removeButton.style.display = "flex";
           });

           removeButton.addEventListener("mouseleave", () => {
             removeButton.style.display = "none";
           });

           // Add click handler for remove button
           removeButton.onclick = (e) => {
             e.stopPropagation();
             e.preventDefault();

             // Find all highlight spans with this mark id
             const highlights = document.querySelectorAll(
               `[data-mark-id="${mark.id}"]`
             );
             highlights.forEach((highlight) => {
               if (highlight.parentNode) {
                 const textContent = highlight.firstChild?.textContent || "";
                 highlight.parentNode.replaceChild(
                   document.createTextNode(textContent),
                   highlight
                 );
               }
             });

             // Update marks state
             setMarks((prev) => prev.filter((m) => m.id !== mark.id));
           };

           // Replace text node with highlight
           const parent = textNode.parentNode;
           if (parent) {
             const wrapper = document.createElement("span");
             wrapper.appendChild(textNode.cloneNode());
             highlightSpan.appendChild(wrapper);
             highlightSpan.appendChild(removeButton);
             parent.replaceChild(highlightSpan, textNode);
           }
         }
       });
     } catch (e) {
       console.error("Error applying highlight:", e);
     }
   });
 };
  // Advanced text selection and marking logic
  const handleTextSelection = (sectionId: number) => {
    if (markingMode === "none") return;

    const selection = window.getSelection();
    if (
      !selection ||
      selection.rangeCount === 0 ||
      selection.toString().trim() === ""
    )
      return;

    const range = selection.getRangeAt(0);

    const newMark: Highlight = {
      id: Math.random().toString(36).substr(2, 9),
      range: {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset,
      },
      color: currentColor,
      sectionId: sectionId,
      markType: markingMode,
    };

    setMarks((prev) => [...prev, newMark]);
    setAnnotationDialogOpen(true);
    setCurrentAnnotation({ markId: newMark.id, text: "" });
    selection.removeAllRanges();
  };

  const addAnnotation = () => {
    if (currentAnnotation) {
      const newAnnotation: Annotation = {
        id: Math.random().toString(36).substr(2, 9),
        markId: currentAnnotation.markId,
        text: currentAnnotation.text,
        color: currentColor,
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
      setAnnotationDialogOpen(false);
      setCurrentAnnotation(null);
    }
  };

  const removeAnnotation = (annotationId: string) => {
    setAnnotations((prev) =>
      prev.filter((annotation) => annotation.id !== annotationId)
    );
  };

const clearAllMarks = () => {
  // Remove all highlight spans from the DOM
  const highlightSpans = document.querySelectorAll("[data-mark-id]");
  highlightSpans.forEach((highlight) => {
    if (highlight.parentNode) {
      const textContent = highlight.firstChild?.textContent || "";
      highlight.parentNode.replaceChild(
        document.createTextNode(textContent),
        highlight
      );
    }
  });

  // Clear marks and annotations state
  setMarks([]);
  setAnnotations([]);
};

  const renderAnnotations = (markId: string) => {
    const relatedAnnotations = annotations.filter((a) => a.markId === markId);
    return relatedAnnotations.map((annotation) => (
      <Box
        key={annotation.id}
        sx={{
          backgroundColor: annotation.color,
          p: 1,
          m: 1,
          borderRadius: 1,
          position: "relative",
        }}
      >
        <Typography variant="body2">{annotation.text}</Typography>
        <IconButton
          size="small"
          onClick={() => removeAnnotation(annotation.id)}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            p: 0.5,
          }}
        >
          <X size={16} />
        </IconButton>
      </Box>
    ));
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* ... previous rendering logic */}
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
                  cursor: markingMode !== "none" ? "text" : "default",
                  "&:hover": {
                    boxShadow: 3,
                    transition: "box-shadow 0.3s ease-in-out",
                  },
                }}
              >
                <Box display="flex" alignItems="center">
                  <Typography variant="h6" color="text.primary">
                    {`${sectionIndex + 1}. ${currentTitle}`}
                  </Typography>
                </Box>

                {currentExplanation && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {currentExplanation}
                  </Typography>
                )}

                {currentSubtopic && (
                  <Typography variant="h6" color="text.secondary">
                    {currentSubtopic}
                  </Typography>
                )}
                <Box>
                  {customContent.map((item, idx) => (
                    <Box
                      key={idx}
                      display="flex"
                      alignItems="start"
                      gap={1}
                      ref={(el: HTMLElement | null) => {
                        if (el) applyHighlights(sectionIndex, el);
                      }}
                      onMouseUp={() => handleTextSelection(sectionIndex)}
                    >
                      <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <Box
                        sx={{
                          flex: 1,
                          fontFamily: "Inter, sans-serif",
                          fontSize: "medium",
                        }}
                      >
                        {typeof item.content === "string"
                          ? item.content
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

      </Box>
      {/* Annotation Dialog */}
      <Dialog
        open={annotationDialogOpen}
        onClose={() => setAnnotationDialogOpen(false)}
      >
        <DialogTitle>Add Annotation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Write your annotation here..."
            value={currentAnnotation?.text || ""}
            onChange={(e) =>
              setCurrentAnnotation((prev) =>
                prev ? { ...prev, text: e.target.value } : null
              )
            }
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button onClick={addAnnotation} variant="contained" color="primary">
              Save Annotation
            </Button>
            <Button
              onClick={() => setAnnotationDialogOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Additional Marking Controls */}
      <Box
    
      >
        {/* ... previous marking buttons ... */}

        <Tooltip
          title={
            markingMode === "highlight"
              ? "Stop Highlighting"
              : "Start Highlighting"
          }
        >
          <IconButton
            onClick={() => toggleMarkingMode("highlight")}
            sx={{
              backgroundColor:
                markingMode === "highlight" ? "primary.main" : "white",
              color: markingMode === "highlight" ? "white" : "primary.main",
              "&:hover": {
                backgroundColor:
                  markingMode === "highlight" ? "primary.dark" : "grey.100",
              },
            }}
          >
            <Highlighter />
          </IconButton>
        </Tooltip>

        <Tooltip
          title={
            markingMode === "underline"
              ? "Stop Underlining"
              : "Start Underlining"
          }
        >
          <IconButton
            onClick={() => toggleMarkingMode("underline")}
            sx={{
              backgroundColor:
                markingMode === "underline" ? "primary.main" : "white",
              color: markingMode === "underline" ? "white" : "primary.main",
              "&:hover": {
                backgroundColor:
                  markingMode === "underline" ? "primary.dark" : "grey.100",
              },
            }}
          >
            <Underline />
          </IconButton>
        </Tooltip>

        <Tooltip title="Choose Color">
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              backgroundColor: "white",
              "&:hover": { backgroundColor: "grey.100" },
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: currentColor,
                borderRadius: "50%",
              }}
            />
          </IconButton>
        </Tooltip>

        <Tooltip title="Clear All Marks">
          <IconButton
            onClick={clearAllMarks}
            sx={{
              backgroundColor: "white",
              "&:hover": { backgroundColor: "grey.100" },
            }}
          >
            <Eraser />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add Note">
          <IconButton
            onClick={() => {
              setAnnotationDialogOpen(true);
              setCurrentAnnotation({
                markId: Math.random().toString(36).substr(2, 9),
                text: "",
              });
            }}
            sx={{
              backgroundColor: "white",
              "&:hover": { backgroundColor: "grey.100" },
            }}
          >
            <StickyNote />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {MARK_COLORS.map((color) => (
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
                  borderRadius: "50%",
                }}
              />
              {color.name}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <div>

      </div>

      {/* Annotations Sidebar */}
      {annotations.length > 0 && (
        <Box
          sx={{
            position: "fixed",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "250px",
            maxHeight: "70vh",
            overflowY: "auto",
            backgroundColor: "background.paper",
            boxShadow: 3,
            p: 2,
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Annotations
          </Typography>
          {annotations.map((annotation) => (
            <Box key={annotation.id} sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: annotation.color,
                  p: 1,
                  borderRadius: 1,
                }}
              >
                {annotation.text}
                <IconButton
                  size="small"
                  onClick={() => removeAnnotation(annotation.id)}
                  sx={{ ml: 1 }}
                >
                  <X size={16} />
                </IconButton>
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CheatsheetList;

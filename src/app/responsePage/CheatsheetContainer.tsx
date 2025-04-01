import React, { useState } from "react";
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
  Underline,
  StickyNote,
  Eraser,
} from "lucide-react";

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

const CheatsheetList = ({
  loadingCheatsheet,
  isLoading,
  cheatsheetContent,
  isCustomPrompt,
}: CheatsheetListProps) => {
  const [markingMode, setMarkingMode] = useState<
    "none" | "highlight" | "underline" | "annotate" | "eraser"
  >("none");
  const [currentColor, setCurrentColor] = useState("#fef08a");

  if (!cheatsheetContent || cheatsheetContent.length === 0) return null;

  const toggleMarkingMode = (mode: typeof markingMode) => {
    setMarkingMode((currentMode) => (currentMode === mode ? "none" : mode));
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={3} sequential>
          {cheatsheetContent.map((section, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{
                p: 1.5,
                borderRadius: 2,
                cursor: markingMode !== "none" ? "text" : "default",
                "&:hover": {
                  boxShadow: 3,
                  transition: "box-shadow 0.3s ease-in-out",
                },
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  color: "text.primary",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                }}
              >
                {`${index + 1}. ${section.title}`}
              </Typography>

              {/* Explanation */}
              {section.explanation && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.875rem",
                  }}
                >
                  <strong>Explanation:</strong> {section.explanation}
                </Typography>
              )}

              {/* Subtopic */}
              {section.subtopic && (
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "text.secondary",
                    mb: 1,
                    fontSize: "0.925rem",
                    fontWeight: 500,
                  }}
                >
                  <strong>Subtopic:</strong> {section.subtopic}
                </Typography>
              )}

              {/* Details */}
              <Box>
                {Array.isArray(section.details) &&
                  section.details.map((detail, idx) => (
                    <Box
                      key={idx}
                      display="flex"
                      alignItems="start"
                      gap={1}
                      sx={{ mb: 0.5 }}
                    >
                      <ChevronRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <Typography
                        sx={{
                          flex: 1,
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {detail}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Paper>
          ))}
        </Masonry>
      </Box>
    </Box>
  );
};

export default CheatsheetList;

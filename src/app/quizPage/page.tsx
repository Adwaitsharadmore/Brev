"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string | null;
}

interface QuizCompletionProps {
  apiFeedback: string | null;
  generatePracticeQuestions: () => void;
  handleBackToHome: () => void;
}

// Separate QuizCompletion component
const QuizCompletion = ({
  apiFeedback,
  generatePracticeQuestions,
  handleBackToHome,
}: QuizCompletionProps) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <Card className="bg-gray-900 border border-gray-700 shadow-xl w-3/4">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 text-yellow-400">🏆</div>
            <h2 className="text-2xl font-bold text-white">Quiz Completed!</h2>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {apiFeedback ? (
            apiFeedback.split("\n").map((part, index) => {
              if (part.startsWith("{") && part.endsWith("}")) {
                return (
                  <div key={index} className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">
                      {part.slice(1, -1)}
                    </h2>
                    <div className="h-1 w-20 bg-blue-500 rounded" />
                  </div>
                );
              }
              if (part.startsWith("[") && part.endsWith("]")) {
                return (
                  <h3
                    key={index}
                    className="text-xl font-semibold text-blue-300 mt-4"
                  >
                    {part.slice(1, -1)}
                  </h3>
                );
              }
              if (part.trim().startsWith("-")) {
                return (
                  <div key={index} className="flex items-start space-x-2 ml-4">
                    <span className="text-blue-400">•</span>
                    <p className="text-gray-300">{part.slice(1).trim()}</p>
                  </div>
                );
              }
              return (
                <p key={index} className="text-gray-300">
                  {part}
                </p>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-400">
              No additional feedback required!
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
        <button
          onClick={() => {
            console.log("Practice More clicked");
            generatePracticeQuestions();
          }}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700"
        >
          Practice More
        </button>

        <button
          onClick={() => {
            console.log("Back to Home clicked");
            handleBackToHome();
          }}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

const QuizPage = () => {
  const router = useRouter();
  const [quizContent, setQuizContent] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [apiFeedback, setApiFeedback] = useState<string | null>(null);
  const [showFinalFeedback, setShowFinalFeedback] = useState(false);
  const [originalFileName, setOriginalFileName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Loading and initialization logic
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const quiz = urlParams.get("quiz");
    const fileName = urlParams.get("originalFileName");

    if (quiz && quiz !== "undefined" && quiz.length > 0) {
      const parsedQuiz = parseQuizContent(quiz);
      if (parsedQuiz.length > 0) {
        setQuizContent(parsedQuiz);
        setAttempts(new Array(parsedQuiz.length).fill(0));
      }
    }

    if (fileName && fileName !== "undefined") {
      setOriginalFileName(fileName);
    }
  }, []);

  const parseQuizContent = (quiz: string): QuizQuestion[] => {
    const questions = quiz.split("---").filter((q) => q.trim());

    return questions
      .map((questionBlock) => {
        const lines = questionBlock.trim().split("\n");
        const questionObj: Partial<QuizQuestion> = {
          options: [],
        };

        lines.forEach((line) => {
          const [key, ...valueParts] = line.split(":");
          const value = valueParts.join(":").trim();

          switch (key.trim()) {
            case "QUESTION":
              questionObj.question = value;
              break;
            case "OPTION_A":
              questionObj.options![0] = value;
              break;
            case "OPTION_B":
              questionObj.options![1] = value;
              break;
            case "OPTION_C":
              questionObj.options![2] = value;
              break;
            case "OPTION_D":
              questionObj.options![3] = value;
              break;
            case "CORRECT":
              questionObj.correctAnswer = value;
              break;
          }
        });

        // Validate question object
        if (
          !questionObj.question ||
          !questionObj.options ||
          questionObj.options.length !== 4 ||
          !questionObj.correctAnswer
        ) {
          console.error("Invalid question format:", questionObj);
          return null;
        }

        return questionObj as QuizQuestion;
      })
      .filter((q): q is QuizQuestion => q !== null);
  };

  const handleAnswerSelect = (index: number) => {
    if (isCorrect) return;

    const newAttempts = [...attempts];
    newAttempts[currentQuestion]++;
    setAttempts(newAttempts);

    const correct =
      quizContent[currentQuestion].correctAnswer ===
      String.fromCharCode(65 + index);

    setSelectedAnswer(index);
    setFeedback(correct ? "Correct!" : "Try again");
    setIsCorrect(correct);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizContent.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setFeedback(null);
      setIsCorrect(false);
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = async () => {
    if (!originalFileName || isLoading) return;
    console.log(originalFileName);

    setIsLoading(true);
    try {
      const response = await fetch("/api/get-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: quizContent.map((q) => q.question),
          attempts,
          originalFileName,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch feedback");

      const data = await response.json();
      setApiFeedback(data.feedback.join("\n"));
      setShowFinalFeedback(true);
    } catch (error) {
      setError("Failed to generate feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePracticeQuestions = async () => {
    if (!originalFileName || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/get-morequestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: quizContent.map((q) => q.question),
          attempts,
          originalFileName,
        }),
      });

   

      const data = await response.json();
      const newQuizContent = parseQuizContent(data.feedback.join("\n"));

      setQuizContent(newQuizContent);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setFeedback(null);
      setIsCorrect(false);
      setAttempts(new Array(newQuizContent.length).fill(0));
      setShowFinalFeedback(false);
    } catch (error) {
      setError("Failed to generate practice questions");
    } finally {
      setIsLoading(false);
    }
  };
  const handleBackToHome = async () => {
    try {
      await fetch("http://localhost:3001/api/cleanup", {
        method: "POST",
      });
      console.log("Cleanup successful");
    } catch (error) {
      console.error("Error during cleanup:", error);
    } finally {
      router.push("/");
    }
  };

  if (!quizContent.length) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4">
      <header className="absolute top-0 left-0 p-4">
        <Link href="/">
          <Image
            src="/images/mainlogo.svg"
            alt="PrepPal Logo"
            width={80}
            height={80}
            className="object-cover rounded-full"
          />
        </Link>
      </header>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">{error}</div>
      )}

      {!showFinalFeedback ? (
        <Card className="w-3/4 bg-[#f8f6ef] text-black border border-gray-700">
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">
                Question {currentQuestion + 1} of {quizContent.length}
              </span>
              <span className="text-red-600">
                Attempts: {attempts[currentQuestion]}
              </span>
            </div>

            <h2 className="text-2xl font-semibold mb-6 whitespace-pre-wrap">
              {quizContent[currentQuestion]?.question}
            </h2>

            <div className="space-y-4">
              {quizContent[currentQuestion]?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 rounded-lg text-left transition-colors
                    ${
                      selectedAnswer === index
                        ? isCorrect
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                        : "bg-white/50 hover:bg-gray-700 hover:text-white border border-gray-700"
                    }
                    ${option.includes("\n") ? "whitespace-pre-wrap" : ""}`}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>

            {isCorrect && (
              <Button
                onClick={handleNextQuestion}
                className="mt-6 bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {currentQuestion < quizContent.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <QuizCompletion
          apiFeedback={apiFeedback}
          generatePracticeQuestions={generatePracticeQuestions}
          handleBackToHome={handleBackToHome}
        />
      )}
    </div>
  );
};

export default QuizPage;

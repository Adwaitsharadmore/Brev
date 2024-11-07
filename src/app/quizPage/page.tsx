"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string | null;
}

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
  const [incorrectQuestions, setIncorrectQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

 useEffect(() => {
   const urlParams = new URLSearchParams(window.location.search);
   const quiz = urlParams.get("quiz");
   const fileName = urlParams.get("originalFileName");

   if (quiz && quiz !== "undefined" && quiz.length > 0) {
     const parsedQuiz = parseQuizContent(quiz);
     if (parsedQuiz.length > 0) {
       setQuizContent(parsedQuiz);
     } else {
       console.error("Parsed quiz content is empty or invalid.");
       setQuizContent([]);
     }
   } else {
     console.error("Quiz parameter is missing or invalid.");
     setQuizContent([]);
   }

   if (fileName && fileName !== "undefined") {
     setOriginalFileName(fileName);
   }
 }, []);

 useEffect(() => {
   if (quizContent.length > 0 && attempts.length === 0) {
     setAttempts(new Array(quizContent.length).fill(0));
   }
 }, [quizContent]);

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

  const fetchFeedback = async () => {
    if (!originalFileName) {
      console.error('Original file name is missing.');
      return;
    }

    try {
      const response = await fetch('/api/get-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: quizContent.map(q => q.question),
          attempts,
          originalFileName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }

      const data = await response.json();
      setApiFeedback(data.feedback.join('\n'));
      setShowFinalFeedback(true);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('Failed to fetch feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (isCorrect) return;

    setSelectedAnswer(index);
    const correct =
      quizContent[currentQuestion].correctAnswer ===
      String.fromCharCode(65 + index); // Using uppercase A,B,C,D
    setFeedback(correct ? "Correct answer!" : "Incorrect answer.");
    setIsCorrect(correct);

    if (!correct) {
      setIncorrectQuestions((prev) => [
        ...prev,
        quizContent[currentQuestion].question,
      ]);
    }


    setAttempts((prev) => {
      const newAttempts = prev.map((attempt, idx) =>
        idx === currentQuestion ? attempt + 1 : attempt
      );
      return newAttempts;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizContent.length - 1) {
      setFeedback(null);
      setSelectedAnswer(null);
      setIsCorrect(false);
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = () => {
    if (quizContent.length === 0) {
      setError('No quiz content available.');
      return;
    }

    if (!originalFileName) {
      setError('Original file name is missing.');
      return;
    }

    if (!isLoading) {
      setIsLoading(true);
      fetchFeedback();
      setShowFinalFeedback(true);
    }
  };

  const generatePracticeQuestions = async () => {
    if (!originalFileName) {
      console.error("Original file name is missing.");
      return;
    }

    try {
      const response = await fetch("/api/get-morequestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: quizContent.map((q) => q.question),
          attempts,
          originalFileName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }

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
      console.error("Error generating practice questions:", error);
      setError("Could not generate practice questions. Try again later.");
    }
  };

  const handleGenerateFeedback = () => {
    if (!isLoading) {
      setIsLoading(true);
      fetchFeedback();
    }
  };

  if (!quizContent.length) {
    return (
      <div className="min-h-screen bg-black bg-gradient-preppal text-{#1D5DB6} flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold mb-6">Loading...</h1>
      </div>
    );
  }

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
      <div className="min-h-screen bg-black bg-gradient-preppal text-{#1D5DB6} flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black bg-gradient-preppal text-white flex flex-col items-center justify-center">
      {error && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">{error}</div>
      )}
      <header className="absolute top-0 left-0 p-4">
        <div>
          <Link href="/">
            <Image
              src="/images/logo.JPG"
              alt="PrepPal Logo"
              width={100}
              height={100}
              className="object-cover rounded-full"
            />
          </Link>
        </div>
      </header>

      <h1 className="text-4xl font-semibold mb-6">Here's your quiz!</h1>

      {!showFinalFeedback ? (
        <div className="bg-black border border-gray-700 p-6 rounded-lg shadow-lg w-3/4">
          <div className="flex justify-between mb-4">
            <span className="text-gray-400">
              Question {currentQuestion + 1} of {quizContent.length}
            </span>
            <span className="text-gray-400">
              Attempts: {attempts[currentQuestion] || 0}
            </span>
          </div>

          <h2 className="text-2xl font-semibold mb-6 whitespace-pre-wrap">
            {quizContent[currentQuestion]?.question}
          </h2>

          <ul className="space-y-4">
            {quizContent[currentQuestion]?.options.map((option, index) => (
              <li
                key={index}
                className={`border p-4 rounded-lg cursor-pointer transition-colors duration-200
                  ${
                    selectedAnswer === index
                      ? isCorrect
                        ? "bg-green-600"
                        : "bg-red-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }
                  ${option.includes("\n") ? "whitespace-pre-wrap" : ""}`}
                onClick={() => handleAnswerSelect(index)}
              >
                {String.fromCharCode(65 + index)}. {option}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-black border border-gray-700 p-6 rounded-lg shadow-lg w-3/4">
          <h2 className="text-2xl font-semibold mb-4">Quiz Completed!</h2>
          {apiFeedback ? (
            <div className="mt-2 text-white">
              {apiFeedback.split("\n").map((part, index) => {
                // Check for titles and format accordingly
                if (part.startsWith("{") && part.endsWith("}")) {
                  return (
                    <div key={index}>
                      <br />
                      <h2 className="font-bold">{part.slice(1, -1)}</h2>
                    </div>
                  );
                } else if (part.startsWith("[") && part.endsWith("]")) {
                  return (
                    <div>
                      <br />
                      <h3 key={index} className="font-semibold">
                        {part.slice(1, -1)}
                      </h3>
                    </div>
                  );
                } else if (part.trim().startsWith("-")) {
                  // Render bullet points in normal font
                  return (
                    <p key={index} className="ml-4">
                      {part}
                    </p>
                  );
                } else {
                  return <p key={index}>{part}</p>;
                }
              })}
            </div>
          ) : (
            <div>No additional feedback required!</div>
          )}
          <button
            onClick={generatePracticeQuestions}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Practice More
          </button>
          <button
            onClick={handleBackToHome}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Back to Home
          </button>
        </div>
      )}

      {showFinalFeedback && feedback && (
        <div
          className={`mt-4 text-lg font-semibold ${
            feedback.includes("Correct") ? "text-green-500" : "text-red-500"
          }`}
        >
          {feedback}
        </div>
      )}

      {!showFinalFeedback && isCorrect && (
        <button
          onClick={
            currentQuestion < quizContent.length - 1
              ? handleNextQuestion
              : handleGenerateFeedback
          }
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          {currentQuestion < quizContent.length - 1
            ? "Next Question"
            : "Generate Feedback"}
        </button>
      )}

      {/*  
            {!isCorrect && currentQuestion === quizContent.length - 1 && (
        <button
          onClick={generatePracticeQuestions}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Practice More
        </button>
      )}
      {!isCorrect && currentQuestion === quizContent.length - 1 && (
        <button
          onClick={handleBackToHome}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Back to Home
        </button>
      )}
      
            {showFinalFeedback ? (
        <button
          onClick={handleGenerateFeedback}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Generate Feedback
        </button>
      ) : (
        <></>
      )}*/}
    </div>
  );
};

export default QuizPage;

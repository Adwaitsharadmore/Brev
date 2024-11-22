import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import path from 'path';

// Remove dotenv import and config if you're using Next.js built-in environment variables
// import dotenv from 'dotenv';
// dotenv.config();
// Remove this line completely
// console.log(process.env.API_KEY);

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { questions, attempts, originalFileName } = req.body;

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Invalid or missing questions data" });
  }
  if (!attempts || !Array.isArray(attempts) || attempts.length === 0) {
    return res.status(400).json({ error: "Invalid or missing attempts data" });
  }
  if (!originalFileName || typeof originalFileName !== 'string') {
    return res.status(400).json({ error: "Invalid or missing original file name" });
  }

  try {
    // Use an absolute path to the uploads directory
    const uploadsDir = path.resolve(__dirname, 'E:\\soohum\\prepal\\pages\\api\\uploads');
    const filePath = path.join(uploadsDir, originalFileName);
    console.log("Reading file from:", filePath); // Debugging line
    

    // Upload the file to get a URI
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName: originalFileName,
    });

    const fileUri = uploadResponse.file.uri;

    const questionsWithMultipleAttempts = questions.filter((_, index) => attempts[index] > 1);

    if (questionsWithMultipleAttempts.length === 0) {
      return res.json({ feedback: ["No additional feedback is needed. All questions were answered correctly in one attempt."] });
    }

    const prompt = `Generate new multiple-choice questions based on the areas where the user struggled in the previous quiz. Format each question as follows:
         QUESTION: Write the question here
         OPTION_A: First option
         OPTION_B: Second option
         OPTION_C: Third option
         OPTION_D: Fourth option
         CORRECT: Write the correct option letter (A, B, C, or D)
         
         Please separate each question with three dashes (---).
      ${questionsWithMultipleAttempts.map((q, index) => `Question: "${q}" (${attempts[index]} attempts)`).join("\n")}`;

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: "application/pdf",
          fileUri: fileUri,
        },
      },
      { text: prompt }
    ]);

    const generatedFeedback = await result.response.text();

    res.json({
      feedback: generatedFeedback.split("\n"),
    });
  } catch (error) {
    console.error("Error in feedback generation:", error);
    res.status(500).json({ error: "Failed to generate feedback. Please try again later." });
  }
}



import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { questions, attempts, originalFileName, fileContent } = req.body;

  // Validate input data
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Invalid or missing questions data" });
  }
  if (!attempts || !Array.isArray(attempts) || attempts.length === 0) {
    return res.status(400).json({ error: "Invalid or missing attempts data" });
  }
  if (!originalFileName || typeof originalFileName !== 'string') {
    return res.status(400).json({ error: "Invalid or missing original file name" });
  }
  if (!fileContent) {
    return res.status(400).json({ error: "No file content provided" });
  }

  try {
    // Create a temporary file in the system's temp directory
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, originalFileName);

    // Write file content to temp directory
    const fileBuffer = Buffer.from(fileContent, 'base64');
    await fs.writeFile(filePath, fileBuffer);

    // Filter questions with multiple attempts
    const questionsWithMultipleAttempts = questions.filter((_, index) => attempts[index] > 1);

    if (questionsWithMultipleAttempts.length === 0) {
      return res.json({ 
        feedback: ["No additional feedback is needed. All questions were answered correctly in one attempt."] 
      });
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

    // Generate content using inline data
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: fileBuffer.toString('base64')
        }
      },
      { text: prompt }
    ]);

    const generatedFeedback = await result.response.text();

    // Delete temporary file
    await fs.unlink(filePath);

    res.json({
      feedback: generatedFeedback.split("\n"),
    });
  } catch (error) {
    console.error("Error in feedback generation:", error);
    
    // Ensure response is only sent if not already sent
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "Failed to generate feedback", 
        details: error.message 
      });
    }
  }
}
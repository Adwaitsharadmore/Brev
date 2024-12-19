import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from 'dotenv';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import mime from 'mime-types';
import multer from 'multer';

// For ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configure multer with disk storage in temp directory
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const tempDir = os.tmpdir();
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});


const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

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

  // Validate input
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Invalid or missing questions data" });
  }
  if (!attempts || !Array.isArray(attempts) || attempts.length === 0) {
    return res.status(400).json({ error: "Invalid or missing attempts data" });
  }
  if (!originalFileName || typeof originalFileName !== "string") {
    return res.status(400).json({ error: "Invalid or missing original file name" });
  }

  try {
    // Retrieve the file using the originalFileName
    const filePath = path.join(os.tmpdir(), originalFileName);
    console.log("File path:", filePath);
    console.log(filePath);
    const fileBuffer = await fs.readFile(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    const questionsWithMultipleAttempts = questions.filter((_, index) => attempts[index] > 1);
    

    const prompt = `Generate new multiple-choice questions based on the areas where the user struggled in the previous quiz. Format each question as follows:
         QUESTION: Write the question here
         OPTION_A: First option
         OPTION_B: Second option
         OPTION_C: Third option
         OPTION_D: Fourth option
         CORRECT: Write the correct option letter (A, B, C, or D)
         
         Please separate each question with three dashes (---).
      ${questionsWithMultipleAttempts.map((q, index) => `Question: "${q}" (${attempts[index]} attempts)`).join("\n")}`;




    // Generate content based on the provided data
 const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: fileBuffer.toString('base64')
        }
      },
      { text: prompt },
    ]);

        const generatedFeedback = await result.response.text();


    res.json({
      feedback: generatedFeedback.split("\n"),
    });
  } catch (error) {
    console.error("Feedback generation failed:", error);
    res.status(500).json({
      error: "Failed to generate feedback",
      details: error.message,
    });
  }
}
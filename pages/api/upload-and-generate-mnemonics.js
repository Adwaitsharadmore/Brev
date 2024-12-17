import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
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
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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

export default async function handler(req, res) {
  // Use a promise-based wrapper for multer upload
  const uploadMiddleware = (req, res) => {
    return new Promise((resolve, reject) => {
      upload.single('file')(req, res, (err) => {
        if (err) {
          // Handle specific multer errors
          if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              return reject(new Error('File is too large. Maximum size is 50MB.'));
            }
            return reject(err);
          } else if (err) {
            return reject(err);
          }
          resolve();
        } else {
          resolve();
        }
      });
    });
  };

  try {
    // Await the file upload
    await uploadMiddleware(req, res);

    const { file } = req;
    const { textPrompt } = req.body;

    // Validate file and prompt
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!textPrompt) {
      return res.status(400).json({ error: "No text prompt provided" });
    }

    // Read the file as a buffer
    const fileBuffer = await fs.readFile(file.path);

    // Delete the temporary file after reading
    await fs.unlink(file.path);

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Generate content using inline data
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.mimetype,
          data: fileBuffer.toString('base64')
        }
      },
      { text: textPrompt },
    ]);

    const generatedText = result.response.text();
    console.log("Generated mnemonics content:", generatedText);

    res.json({
      message: "Mnemonics generated successfully",
      generatedMnemonics: generatedText,
    });
    
  } catch (error) {
    console.error("Error during mnemonics generation:", error);
    
    // Ensure response is only sent if not already sent
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "File upload or mnemonics generation failed", 
        details: error.message 
      });
    }
  }
}

// Explicitly set the config for API route
export const config = {
  api: {
    bodyParser: false, // Disables the default body parser
  },
};
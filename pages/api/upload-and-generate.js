import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from 'dotenv';
import fs from 'fs';
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


// Configure multer with more robust options
const storage = multer.memoryStorage()({
destination: (req, file, cb) => {
      const uploadsDir = path.join(__dirname, 'uploads');
      console.log("Saving file to:", uploadsDir); // Debugging line
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Save with original name
    },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Optional: Add file type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
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
            // A Multer error occurred when uploading.
            if (err.code === 'LIMIT_FILE_SIZE') {
              return reject(new Error('File is too large. Maximum size is 50MB.'));
            }
            return reject(err);
          } else if (err) {
            // An unknown error occurred when uploading.
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

    // Rest of your existing logic remains the same
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const filePath = file.path;
    const mimeType = mime.lookup(file.originalname);

    // Add more detailed logging
    console.log('File details:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: filePath
    });

    // Async function to upload file with retry
    async function uploadFileWithRetry(filePath, fileMetadata, maxRetries = 3) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const uploadResponse = await fileManager.uploadFile(filePath, fileMetadata);
          return uploadResponse;
        } catch (error) {
          console.error(`Upload attempt ${attempt} failed:`, error);
          if (attempt === maxRetries) throw error;
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    const uploadResponse = await uploadFileWithRetry(filePath, {
      mimeType,
      displayName: file.originalname,
    });

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: textPrompt },
    ]);



    res.status(200).json({
      message: "Content generated successfully",
      generatedText: result.response.text(),
    });

  } catch (error) {
    console.error("Detailed error:", error);

    // Ensure a response is always sent
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "File upload or content generation failed", 
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
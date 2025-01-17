import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import os from 'os';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configure multer for file upload
const upload = multer({
  storage:multer.diskStorage({
  destination: async (req, file, cb) => {
    const tempDir = os.tmpdir();
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
}),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export default async function handler(req, res) {
  const uploadMiddleware = (req, res) => {
    return new Promise((resolve, reject) => {
      upload.single('file')(req, res, (err) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              return reject(new Error('File is too large. Maximum size is 50MB.'));
            }
            return reject(err);
          } else {
            return reject(err);
          }
        }
        resolve();
      });
    });
  };

  try {
    await uploadMiddleware(req, res);

    const { file } = req;
    const { textPrompt } = req.body;
    console.log(file.path);
    console.log(os.tmpdir());

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!textPrompt) {
      return res.status(400).json({ error: "No text prompt provided" });
    }

    // Read the file as a buffer
    const fileBuffer = await fs.readFile(file.path);

    // Delete the temporary file after reading
  

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the file
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.mimetype,
          data: fileBuffer.toString('base64')
        }
      },
      { text: textPrompt }
    ]);


    res.status(200).json({
      message: "Content generated successfully",
      generatedText: result.response.text()
    });

  } catch (error) {
    console.error("Detailed error:", error);

    if (!res.headersSent) {
      res.status(500).json({ 
        error: "File upload or content generation failed", 
        details: error.message 
      });
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
    externalResolver: true,
  },
};
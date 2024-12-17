import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mime from 'mime-types';
import multer from 'multer';
import { put } from '@vercel/blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const upload = multer({
  storage: multer.memoryStorage(),
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
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);

async function uploadFileWithRetry(fileUrl, fileMetadata, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const uploadResponse = await fileManager.uploadFile(fileUrl, fileMetadata);
      return uploadResponse;
    } catch (error) {
      console.error(`Upload attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

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

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!textPrompt) {
      return res.status(400).json({ error: "No text prompt provided" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const mimeType = file.mimetype;

    console.log('File details:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });

    // Upload file to Vercel Blob Store
    const blob = await put(file.originalname, file.buffer, {
      access: 'public',
    });

    console.log('File uploaded to Blob Store:', blob.url);

    // Use the Blob Store URL for Google AI FileManager
    const uploadResponse = await uploadFileWithRetry(blob.url, {
      mimeType,
      displayName: file.originalname,
    });

    // Generate content using the uploaded file
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
      fileUrl: blob.url
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
  },
};

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { Buffer } from 'buffer';

// Load environment variables
dotenv.config();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const textPrompt = formData.get("textPrompt") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!textPrompt) {
      return NextResponse.json(
        { error: "No text prompt provided" },
        { status: 400 }
      );
    }

    // Read file content as a buffer
    const fileBuffer = await file.arrayBuffer();
    const fileContent = Buffer.from(fileBuffer);

    // Generate content using the file
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type,
          data: fileContent.toString('base64')
        }
      },
      { text: textPrompt }
    ]);

    return NextResponse.json({
      message: "Content generated successfully",
      generatedText: result.response.text()
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

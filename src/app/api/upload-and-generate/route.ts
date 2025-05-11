import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { Buffer } from "buffer";

// Load environment variables
dotenv.config();

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Define the function the model should call
const setCheatsheetContentDeclaration = {
 name: "setStructuredCheatsheet",
  description: "Sets the structured study content with titles, explanations, subtopics, and details",
  parameters: {
    type: Type.OBJECT,
    properties: {
      sections: {
        type: Type.ARRAY,
        description: "List of major sections",
        items: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "Main concept of the section",
            },
            explanation: {
              type: Type.STRING,
              description: "Brief explanation of the topic",
            },
            subtopic: {
              type: Type.STRING,
              description: "Subtopic related to the title",
            },
            details: {
              type: Type.ARRAY,
              description: "List of supporting points",
              items: { type: Type.STRING },
            },
          },
          required: ["title", "explanation", "subtopic", "details"],
        },
      },
    },
    required: ["sections"],
  },
};

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const textPrompt = formData.get("textPrompt") as string;

    if (!file || !textPrompt) {
      return NextResponse.json(
        { error: "Missing file or prompt" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const fileBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    // Call Gemini with function declarations
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // or gemini-1.5-pro if you want
       contents: [
    {
      role: "user",
      parts: [
        {
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        },
        {
          text: `${textPrompt}\n\nCall setStructuredCheatsheet({ sections: [...] }) with the structured content.`,
        },
      ],
    },
  ],
  config: {
    tools: [
      {
        functionDeclarations: [setCheatsheetContentDeclaration],
      },
    ],

      },
    });

   if (response.functionCalls && response.functionCalls.length > 0) {
  const functionCall = response.functionCalls[0];

  if (
    functionCall.name === "setStructuredCheatsheet" &&
    functionCall.args &&
    typeof functionCall.args === "object" &&
    "sections" in functionCall.args
  ) {
    const structuredSections = functionCall.args["sections"];
    return NextResponse.json({
      message: "Structured content generated successfully",
      sections: structuredSections,
    });
  }
}


    return NextResponse.json(
      {
        error:
          "No function call was made. Make sure your prompt explicitly asks the model to call the function.",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

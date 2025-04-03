import { NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema, FunctionDeclaration } from "@google/genai";
import dotenv from "dotenv";
import { Buffer } from "buffer";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Define function declarations individually to prevent schema type overlap
const setAcronymMnemonic: FunctionDeclaration = {
  name: "setAcronymMnemonic",
  description: "Returns a structured acronym mnemonic for a concept",
  parameters: {
    type: Type.OBJECT,
    properties: {
      acronym: { type: Type.STRING },
      letters: { type: Type.ARRAY, items: { type: Type.STRING } },
      explanation: { type: Type.STRING },
    },
    required: ["acronym", "letters", "explanation"],
  },
};

const setRhymeMnemonic: FunctionDeclaration = {
  name: "setRhymeMnemonic",
  description: "Returns a rhyme mnemonic for a concept",
  parameters: {
    type: Type.OBJECT,
    properties: {
      rhyme: { type: Type.STRING },
      explanation: { type: Type.STRING },
    },
    required: ["rhyme", "explanation"],
  },
};

const setLociMnemonic: FunctionDeclaration = {
  name: "setLociMnemonic",
  description: "Returns a memory palace-style mnemonic",
  parameters: {
    type: Type.OBJECT,
    properties: {
      setting: { type: Type.STRING },
      visualizations: { type: Type.ARRAY, items: { type: Type.STRING } },
      connections: { type: Type.STRING },
      instructions: { type: Type.STRING },
    },
    required: ["setting", "visualizations", "connections", "instructions"],
  },
};

const setKeywordMnemonic: FunctionDeclaration = {
  name: "setKeywordMnemonic",
  description: "Returns a set of keyword associations for memory recall",
  parameters: {
    type: Type.OBJECT,
    properties: {
      keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
      significance: { type: Type.STRING },
      connections: { type: Type.STRING },
      usage: { type: Type.STRING },
    },
    required: ["keywords", "significance", "connections", "usage"],
  },
};

// Add declarations in array
const mnemonicFunctionDeclarations: FunctionDeclaration[] = [
  setAcronymMnemonic,
  setRhymeMnemonic,
  setLociMnemonic,
  setKeywordMnemonic,
];
const promptTemplates: Record<string, (title: string, content: string) => string> = {
  acronyms: (title, content) => `
Create a meaningful and memorable acronym for the concept: "${title}" using the following details:\n"${content}"

An acronym mnemonic is a word made from the first letters of key points. Each letter should stand for an important part of the concept.

Respond by calling the setAcronymMnemonic function with:
- acronym: the word
- letters: what each letter stands for
- explanation: how this helps recall the concept.
`,

  rhymes: (title, content) => `
Create a catchy rhyme or short poem for the concept: "${title}" based on:\n"${content}"

A rhyme mnemonic uses rhythm and sound to improve recall.

Call the setRhymeMnemonic function with:
- rhyme: your original rhyme or poem
- explanation: how this connects to the concept
`,

  loci: (title, content) => `
Create a memory palace (method of loci) for the concept: "${title}" using the following content:\n"${content}"

The loci method maps ideas to locations in a familiar setting. Use vivid mental images and a clear walk-through.

Call the setLociMnemonic function with:
- setting: the familiar place
- visualizations: list of vivid images
- connections: how visuals tie to the concept
- instructions: how to walk through the scene in your mind
`,

  keywords: (title, content) => `
Generate keyword associations for: "${title}" from:\n"${content}"

A keyword mnemonic links important terms to memory triggers.

Call the setKeywordMnemonic function with:
- keywords: list of memory hooks
- significance: why they matter
- connections: how they link
- usage: how to use them to recall the topic
`,
};

export async function POST(request: Request) {
  try {
    const { title, content, type } = await request.json(); 
  
      
     if (!title || !type || !content) {
      return NextResponse.json({ error: "Missing title, type, or content" }, { status: 400 });
    }
const textPrompt = promptTemplates[type]?.(title, content);

    const response = await ai.models.generateContent({
      model: "models/gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${textPrompt}\n\nCall one of the mnemonic functions with a structured result.`,
            },
          ],
        },
      ],
      config: {
        tools: [{ functionDeclarations: mnemonicFunctionDeclarations }],
      },
    });

    const functionCall = response.functionCalls?.[0];

    if (functionCall?.args) {
      return NextResponse.json({
        message: "Mnemonic content generated",
        result: functionCall.args,
      });
    }

    return NextResponse.json({ error: "No valid function call returned by Gemini." }, { status: 500 });
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json({ error: "Failed to generate mnemonic content" }, { status: 500 });
  }
}

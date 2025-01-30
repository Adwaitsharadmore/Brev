import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, content, type } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompts = {
      acronyms: `Create a meaningful and memorable acronym for the concept: "${title}", using the following details: "${content}". 
Ensure the acronym directly relates to the provided information, making it easy to recall and understand.

Format your response as follows:

Acronym:
[The acronym]

Letters:
[What each letter stands for, one per line, corresponding to important aspects of the topic]

Explanation:
[A brief and clear explanation of how the acronym relates to the topic, ensuring it aids memory effectively]`,

      rhymes: `Create a catchy rhyme or short poem to help remember the concept: "${title}", using the following details: "${content}".
               
Format your response as follows:

Rhyme:
[The rhyme written in clear verses]

Explanation:
[How this rhyme relates to the concept]`,

      loci: `Create a method of loci (memory palace) visualization for: "${title}", using the following details: "${content}".

Format your response as follows:

Setting:
[A familiar setting or journey]

Visualizations:
[3-5 vivid visual associations, one per line]

Connections:
[How each visual connects to key points]

Instructions:
[How to mentally walk through this visualization]`,

      keywords: `Generate memorable keyword associations for: "${title}", using the following details: "${content}".

Format your response as follows:

Keywords:
[3-5 key words or phrases, one per line]

Significance:
[Why each word is important]

Connections:
[How these words link together]

Usage:
[Tips for using these keywords to recall the concept]`,
    };

    const result = await model.generateContent(prompts[type]);
    let generatedText = result.response.text();

    generatedText = generatedText.replace(/\*\*/g, "").replace(/\*/g, "").replace(/_{2,}/g, "").replace(/#{1,6}\s/g, "");

    res.status(200).json({ generatedText });
  } catch (error) {
    console.error("Error generating mnemonic:", error);
    res.status(500).json({ error: "Error generating mnemonic" });
  }
}

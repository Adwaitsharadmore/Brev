import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const GOOGLE_CSE_API_KEY = process.env.GOOGLE_CSE_API_KEY;
const GOOGLE_CSE_CX = process.env.GOOGLE_CSE_CX;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function fetchEducationalImage(concept) {
  try {
    const prompt = `Generate a precise Google search query to find the best image showing: ${concept}. Focus on academic and technical illustrations. Respond only with the query, no extra text.`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const searchQuery = "image of explaining probability";
    
    console.log('Generated Search Query:', searchQuery);

    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        q: searchQuery,
        key: GOOGLE_CSE_API_KEY,
        cx: GOOGLE_CSE_CX,
        searchType: 'image',
        num: 5,
        imgSize: 'large',
        fileType: 'png,jpg'
      }
    });

    const images = response.data.items || [];
    
    if (images.length > 0) {
      const imageUrl = images[0].link;
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
      const base64Image = imageBuffer.toString('base64');
      const mimeType = imageResponse.headers['content-type'];
      
      return {
        data: `data:${mimeType};base64,${base64Image}`,
        mimeType: mimeType
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Image search error:', error);
    return null;
    }
    

}



async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const { searchImage, query } = body;

      if (!query) {
        return res.status(400).json({ error: "Missing query parameter" });
      }

      if (searchImage) {
        const imageData = await fetchEducationalImage(query);
        
        if (!imageData) {
          return res.status(404).json({ error: "No suitable educational image found" });
        }

        return res.status(200).json({
          message: "Educational image found successfully",
          imageData: imageData.data,
          mimeType: imageData.mimeType,
          searchQuery: query
        });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

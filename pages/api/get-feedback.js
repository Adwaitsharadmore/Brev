import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import path from 'path';
import fs from 'fs';

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

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: "Invalid or missing questions data" });
  }
  if (!attempts || !Array.isArray(attempts) || attempts.length === 0) {
    return res.status(400).json({ error: "Invalid or missing attempts data" });
  }
  if (!originalFileName || typeof originalFileName !== 'string') {
    return res.status(400).json({ error: "Invalid or missing original file name" });
  }

  try {
    // Use an absolute path to the uploads directory
  const uploadsDir = path.join(process.cwd(), 'pages', 'api', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, originalFileName);
    console.log("Reading file from:", filePath); // Debugging line

    // Upload the file to get a URI
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName: originalFileName,
    });

    const fileUri = uploadResponse.file.uri;

    const questionsWithMultipleAttempts = questions.filter((_, index) => attempts[index] > 1);

    if (questionsWithMultipleAttempts.length === 0) {
      return res.json({ feedback: ["No additional feedback is needed. All questions were answered correctly in one attempt."] });
    }

    const prompt = `Generate a performance feedback report based on the user's quiz attempts, strictly following this format without bold or italic text. Use only hyphens (-) for bullet points, as shown in the format below. Focus on providing concise feedback for each question where multiple attempts were required. The format must be adhered to exactly as specified:

Performance Analysis Framework

1. Report Structure

{Performance Summary}

[Core Strengths]
- Strong understanding demonstrated in: [areas]
- Effective problem-solving shown in: [question types]

[Knowledge Gaps]
- Areas requiring reinforcement: [topics]
- Concepts needing review: [specific concepts]

[Question-by-Question Analysis]
For each question requiring multiple attempts:

Question ID: [number]
Prompt: "[exact question text]"
Pattern Analysis:
- First attempt error: [what went wrong]
- Common misconception: [if applicable]
- Final understanding: [how they reached correct answer]
Improvement Strategy:
- Review: [specific topics/concepts]
- Practice: [recommended exercises]
- Focus on: [key learning points]

[Targeted Recommendations]
- Study Materials: [specific resources]
- Practice Areas: [types of questions]
- Review Topics: [concepts to strengthen]

2. Feedback Guidelines

Response Analysis:
- Time patterns
  * Quick correct responses
  * Delayed responses
  * Time distribution across attempts
- Error patterns
  * Consistent mistake types
  * Misconception indicators
  * Progress patterns

Feedback Components:
- Objective observations
  * Number of attempts
  * Time taken
  * Pattern of responses
- Constructive guidance
  * Specific improvement areas
  * Resource recommendations
  * Practice suggestions
- Positive reinforcement
  * Successful strategies used
  * Progress indicators
  * Strength areas

3. Implementation Rules

Formatting:
- Use only plain text
- Use hyphens (-) for all bullet points
- Maintain consistent spacing
- No bold or italic text
- Clear section separation

Content Structure:
- Begin with overview
- Follow with detailed analysis
- End with actionable recommendations
- Include specific examples
- Provide clear next steps

4. Example Format:

{Performance Review: Database Fundamentals Quiz}

[Strengths]
- Excellent understanding of SQL JOIN operations
- Quick mastery of database normalization concepts
- Consistent performance in table design questions

[Areas for Improvement]

Question: "Explain the difference between INNER and LEFT JOIN"
Feedback: Initial attempts showed confusion between JOIN types. Consider reviewing JOIN operations with visual diagrams and practicing with simple table examples.

5. Quality Metrics

Feedback Quality Checklist:
- Specific and actionable
- Evidence-based
- Forward-looking
- Balanced perspective
- Clear improvement path
- Measurable goals
- Resource-linked
- Time-bound suggestions

6. Usage Notes

Report Generation:
- Focus on patterns across attempts
- Identify recurring challenges
- Note improvement trajectories
- Link to learning resources
- Suggest practice exercises

Analysis Depth:
- Surface-level patterns
- Underlying concepts
- Knowledge connections
- Skill application
- Learning progression

7. Response Categories

Immediate Success:
- Note speed and accuracy
- Identify supporting knowledge
- Highlight effective strategies

Multiple Attempts:
- Analyze error patterns
- Track improvement path
- Identify breakthrough moments
- Document learning process

Persistent Challenges:
- Map concept gaps
- Suggest review materials
- Recommend practice exercises
- Outline improvement strategy

Include each question with its number of attempts, and provide specific feedback only for questions that required multiple attempts:
${questionsWithMultipleAttempts.map((q, index) => `Question: "${q}" (${attempts[index]} attempts)`).join("\n")}`;

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: "application/pdf",
          fileUri: fileUri,
        },
      },
      { text: prompt }
    ]);

    const generatedFeedback = await result.response.text();

    console.log(result.response.text()); 

    res.json({
      feedback: generatedFeedback.split("\n"),
    });
  } catch (error) {
    console.error("Error in feedback generation:", error);
    res.status(500).json({ error: "Failed to generate feedback. Please try again later." });
  }
}



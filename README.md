# 🧠 Brev – The AI-Powered Study Companion

**Brev** is an open-source AI-powered tool that generates structured study notes and mnemonic aids to help students learn faster and retain more. It leverages Google Gemini to convert complex topics into easy-to-digest cheatsheets, with support for acronyms, rhymes, loci, and keyword mnemonics.

> "Turn concepts into memory hooks — automatically."

---

## 🚀 Features

- ✅ Generate detailed **cheatsheets** with explanations and subtopics
- ✅ Generate personalized **quizzes** with feedback and scope of improvement
- 🧠 Create **mnemonics** using:
  - Acronyms
  - Rhymes
  - Method of Loci (Memory Palace)
  - Keywords
- 🔄 Click-to-generate all mnemonics at once per topic
- 📘 Easy-to-navigate UI with tabs for each mnemonic type
- 🔒 Backend function calling via Google Gemini's structured output API

---

## 🖼 Demo

![Demo Screenshot](./public/demo.png)

---

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Next.js API routes with Google GenAI SDK
- **AI Model**: Gemini 1.5 (Flash) with function calling
- **Hosting**: Vercel (recommended)

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/brev.git
cd brev
````

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add the following:

```env
GOOGLE_API_KEY=your_google_genai_api_key_here
```

You can get a Google API Key by joining [Google AI Studio](https://makersuite.google.com/) and enabling the Gemini API.

---

### 4. Run Locally

```bash
npm run dev
```

Navigate to `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```bash
brev/
├── app/                  # Next.js app directory
├── components/           # UI components
├── pages/api/            # API routes (e.g. /generate-mnemonics)
├── public/               # Public assets
├── styles/               # Tailwind and global CSS
├── .env.local            # API keys and secrets (not committed)
└── README.md             # This file
```
---

## 🧑‍💻 Contributing

Brev is open to contributions! To get started:

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feat/your-feature`
5. Submit a pull request 🚀

---

## 📝 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute.

---

## 🙌 Acknowledgements

* [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* Inspired by the desire to make studying smarter, not harder.

---

## 🌍 Join the Community

Feel free to [open issues](https://github.com/Adwaitsharadmore/Brev/issues) for feature requests, bugs, or suggestions. If you build on top of Brev, we’d love to feature your work!

---

> With Brev, your memory has a shortcut.

```

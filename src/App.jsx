import { useState } from "react";
import MCQCard from "./components/MCQCard";

const BACKEND_URL = "https://autoquiz-backend-x434.onrender.com";

export default function App() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parseMCQs = (rawText) => {
    return rawText.split("\n\n").map((block) => {
      const lines = block.split("\n");
      const questionLine = lines.find((l) => l.startsWith("Q:"));
      const optionLines = lines.filter((l) => /^[A-D]\)/.test(l));
      const answerLine = lines.find((l) => l.startsWith("Correct:"));

      return {
        question: questionLine?.replace("Q: ", "") || "",
        options: optionLines.map((l) => l.trim()) || [],
        answer: answerLine?.replace("Correct: ", "") || "",
      };
    });
  };

  const handleGenerateText = async () => {
    if (!text.trim()) return setError("Please enter some text first.");
    setError(""); setLoading(true); setQuestions([]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/generate-mcqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.mcqs) {
        setQuestions(parseMCQs(data.mcqs[0]));
      } else setError("Failed to generate MCQs.");
    } catch (err) {
      setError("Backend unreachable. Is it deployed?");
    }

    setLoading(false);
  };

  const handleGeneratePDF = async () => {
    if (!file) return setError("Please select a PDF first.");
    setError(""); setLoading(true); setQuestions([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BACKEND_URL}/api/from-pdf`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.mcqs) setQuestions(parseMCQs(data.mcqs[0]));
      else setError("Failed to generate MCQs from PDF.");
    } catch (err) {
      setError("Backend unreachable. Is it deployed?");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">AutoQuiz 🔥</h1>

      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-2xl shadow-xl space-y-4">
        <textarea
          placeholder="Enter topic or paste text..."
          className="w-full h-40 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full py-2 text-gray-800 rounded-lg"
        />

        <button
          onClick={handleGenerateText}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
        >
          {loading ? "Generating..." : "Generate MCQs from Text"}
        </button>

        <button
          onClick={handleGeneratePDF}
          className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
        >
          {loading ? "Generating..." : "Generate MCQs from PDF"}
        </button>

        {error && <p className="text-red-400 font-medium text-center">{error}</p>}
      </div>

      {/* MCQ Output */}
      <div className="mt-8 w-full max-w-3xl space-y-6">
        {questions.map((q, i) => (
          <MCQCard key={i} q={q} index={i} />
        ))}
      </div>
    </div>
  );
}

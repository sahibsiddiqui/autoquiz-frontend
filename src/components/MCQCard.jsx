export default function MCQCard({ q, index }) {
  return (
    <div className="bg-gray-800 border border-gray-700 p-5 rounded-xl shadow-md hover:shadow-lg transition">
      <p className="text-lg font-semibold mb-2 text-blue-400">
        Q{index + 1}: {q.question}
      </p>

      <ul className="list-disc list-inside space-y-1 mb-2">
        {q.options.map((opt, i) => (
          <li key={i} className="text-gray-200">{opt}</li>
        ))}
      </ul>

      <p className="text-green-400 font-medium">Answer: {q.answer}</p>
    </div>
  );
}

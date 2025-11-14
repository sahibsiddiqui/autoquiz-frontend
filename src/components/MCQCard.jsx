export default function MCQCard({ q, index }) {
  return (
    <div className="mcq-card">
      <p><strong>Q{index + 1}:</strong> {q.question}</p>

      <ul>
        {q.options.map((opt, i) => (
          <li key={i}>{opt}</li>
        ))}
      </ul>

      <p><strong>Correct:</strong> {q.answer}</p>
    </div>
  );
}

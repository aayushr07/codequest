export default function MCQQuestion({ question, selectedOption, onSelect }) {
    return (
        <div style={{ marginBottom: "1rem" }}>
            <h3>{question.question}</h3>
            {question.options.map((opt, idx) => (
                <div key={idx}>
                    <label>
                        <input
                            type="radio"
                            name={`q-${question.id}`}
                            checked={selectedOption === idx}
                            onChange={() => onSelect(idx)}
                        />
                        {opt}
                    </label>
                </div>
            ))}
        </div>
    );
}

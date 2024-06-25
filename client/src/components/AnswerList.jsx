import { useState, useEffect } from "react";

const Answer = ({ answer, deleteAnswer }) => (
  <li className="border-b py-2">
    <p><strong>User:</strong> {answer.user}</p>
    <p><strong>Answer:</strong> {answer.answer}</p>
    <p><strong>Tournament ID:</strong> {answer.tournamentId}</p>
    <button 
      onClick={() => deleteAnswer(answer._id)}
      className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
    >
      Delete
    </button>
  </li>
);

export default function AnswerList() {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState({ tournamentId: '', user: '', answer: '' });

  useEffect(() => {
    fetchAnswers();
  }, []);

  async function fetchAnswers() {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5050/answer');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnswers(data);
    } catch (error) {
      console.error("Could not fetch answers:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addAnswer(e) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5050/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnswer),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setNewAnswer({ tournamentId: '', user: '', answer: '' });
      fetchAnswers();
    } catch (error) {
      console.error("Could not add answer:", error);
    }
  }

  async function deleteAnswer(id) {
    try {
      const response = await fetch(`http://localhost:5050/answer/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchAnswers();
    } catch (error) {
      console.error("Could not delete answer:", error);
    }
  }

  if (loading) {
    return <div>Loading answers...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Answers</h1>
      
      <form onSubmit={addAnswer} className="mb-4">
        <input
          type="text"
          placeholder="Tournament ID"
          value={newAnswer.tournamentId}
          onChange={(e) => setNewAnswer({...newAnswer, tournamentId: e.target.value})}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="User"
          value={newAnswer.user}
          onChange={(e) => setNewAnswer({...newAnswer, user: e.target.value})}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          placeholder="Answer"
          value={newAnswer.answer}
          onChange={(e) => setNewAnswer({...newAnswer, answer: e.target.value})}
          className="border p-2 mr-2"
          required
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Answer
        </button>
      </form>

      {answers.length > 0 ? (
        <ul>
          {answers.map((answer) => (
            <Answer key={answer._id} answer={answer} deleteAnswer={deleteAnswer} />
          ))}
        </ul>
      ) : (
        <p>No answers available.</p>
      )}
    </div>
  );
}
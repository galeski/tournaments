import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const AnswerList = () => {
  const { id } = useParams();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, user must be logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5050/answer`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const tournament = await(await fetch(`http://localhost:5050/tournaments/${id}`)).json();
        const tournamentQuestions = tournament.questions;
        
        setQuestions(tournamentQuestions);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allAnswers = await response.json();

        console.log(allAnswers)
        
        // Filter answers for the specific tournament
        const tournamentAnswers = allAnswers.filter(answer => answer.tournamentId === id);
        
        setAnswers(tournamentAnswers);
        setLoading(false);
      } catch (error) {
        console.error('An error occurred while fetching answers:', error);
        setError('Failed to fetch answers');
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Answers for Tournament {id}</h2>
      {answers.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User</th>
              <th className="border p-2">Answer</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((answer, index) => (
              <tr key={index} className="border-b">
                <td className="border p-2">{answer.user}</td>
                <td className="border p-2">
                  {answer.answer && typeof answer.answer === 'object' ? (
                    questions.map((question, idx) => (
                      <div key={idx}>
                        <strong>{question}:</strong> {answer.answer[idx]?.answer1}:{answer.answer[idx]?.answer2}
                      </div>
                    ))
                  ) : (
                    <span>Invalid answer format</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No answers submitted for this tournament yet.</p>
      )}
      <Link
        to="/"
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go back
      </Link>
    </div>
  );
};

export default AnswerList;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ResultView = () => {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5050/result/${id}`);
        if (!response.ok) {
          throw new Error(`An error has occurred: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data) {
          throw new Error(`Results for tournament with id ${id} not found`);
        }
        setResults(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!results) return <div>No results found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tournament Results</h1>
      <h2 className="text-xl font-semibold mb-2">Tournament ID: {results.tournamentId}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">User</th>
              <th className="py-2 px-4 border">Total Correct</th>
              <th className="py-2 px-4 border">Total Answers</th>
              <th className="py-2 px-4 border">Answers</th>
            </tr>
          </thead>
          <tbody>
            {results.userResults.map((user, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2 px-4 border">{user.user}</td>
                <td className="py-2 px-4 border text-center">{user.totalCorrect}</td>
                <td className="py-2 px-4 border text-center">{user.totalAnswers}</td>
                <td className="py-2 px-4 border">
                  <ul>
                    {user.answers.map((answer, answerIndex) => (
                      <li key={answerIndex} className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        Q{answer.questionIndex + 1}: User: {answer.userAnswer}, Correct: {answer.correctAnswer}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultView;
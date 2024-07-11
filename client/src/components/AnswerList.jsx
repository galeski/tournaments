import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const AnswerList = () => {
  const { id } = useParams();
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [tournamentTitle, setTournamentTitle] = useState();

  useEffect(() => {
    fetchAnswersAndScores();
  }, [id]);

  const fetchAnswersAndScores = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, user must be logged in');
      setLoading(false);
      return;
    }

    try {
      const [answersResponse, scoresResponse, tournamentResponse] = await Promise.all([
        fetch(`http://localhost:5050/answer`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:5050/score/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:5050/tournaments/${id}`)
      ]);

      if (!answersResponse.ok || !scoresResponse.ok || !tournamentResponse.ok) {
        throw new Error(`HTTP error! status: ${answersResponse.status || scoresResponse.status || tournamentResponse.status}`);
      }

      const [allAnswers, scoresData, tournament] = await Promise.all([
        answersResponse.json(),
        scoresResponse.json(),
        tournamentResponse.json()
      ]);

      const tournamentAnswers = allAnswers.filter(answer => answer.tournamentId === id);
      
      setAnswers(tournamentAnswers);
      setScores(scoresData);
      setQuestions(tournament.questions);
      setTournamentTitle(tournament.title);
      setLoading(false);
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, user must be logged in');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5050/answer/${answerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the answers list after successful deletion
      fetchAnswersAndScores();
    } catch (error) {
      console.error('An error occurred while deleting the answer:', error);
      setError('Failed to delete answer');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Answers and Scores for Tournament "{tournamentTitle}" ({id})</h2>
      {answers.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">User</th>
              <th className="border p-2">Answer</th>
              <th className="border p-2">Score</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((answer) => {
              const userScore = scores.find(score => score.tournamentId === answer.tournamentId);
              return (
                <tr key={answer._id} className="border-b">
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
                  <td className="border p-2">
                    {userScore ? (
                      userScore.scores.map((score, idx) => (
                        <div key={idx}>{score}</div>
                      ))
                    ) : (
                      <span>No score available</span>
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleDeleteAnswer(answer._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete answer
                    </button>
                  </td>
                </tr>
              );
            })}
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
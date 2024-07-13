import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ScoreView = () => {
  const { id } = useParams();
  const [scores, setScores] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        const [scoresResponse, tournamentResponse] = await Promise.all([
          fetch(`http://localhost:5050/score/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch(`http://localhost:5050/tournaments/${id}`)
        ]);

        if (!scoresResponse.ok || !tournamentResponse.ok) {
          throw new Error(`An error has occurred: ${scoresResponse.statusText || tournamentResponse.statusText}`);
        }

        const [scoresData, tournamentData] = await Promise.all([
          scoresResponse.json(),
          tournamentResponse.json()
        ]);

        setScores(scoresData);
        setTournament(tournamentData);
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
  if (!tournament) return <div>No tournament found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Scores for "{tournament.title}"</h1>
      {scores && scores.length > 0 ? (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Scores:</h2>
          {scores.map((score, scoreIndex) => (
            <div key={scoreIndex} className="mb-4 p-4 border rounded">
              {score.scores.map((questionScore, questionIndex) => (
                <p key={questionIndex} className="mb-2">
                  Question {questionIndex + 1}: {questionScore}
                </p>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>No scores submitted for this tournament yet.</p>
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

export default ScoreView;
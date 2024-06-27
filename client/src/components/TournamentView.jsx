import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TournamentView = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5050/tournaments/${id}`);
        if (!response.ok) {
          throw new Error(`An error has occurred: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data) {
          throw new Error(`Tournament with id ${id} not found`);
        }
        setTournament(data);
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
      <h1 className="text-2xl font-bold mb-4">{tournament.title}</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Questions:</h2>
        <ul className="list-disc pl-5">
          {tournament.questions.map((question, index) => (
            <li key={index} className="mb-2">
              {question}
            </li>
          ))}
        </ul>
      </div>
      {/* Add other tournament details here */}
    </div>
  );
};

export default TournamentView;
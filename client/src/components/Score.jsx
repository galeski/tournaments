import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Scoring() {
  const [tournament, setTournament] = useState(null);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTournament() {
      const id = params.id?.toString();
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5050/tournaments/${id}`);
        if (!response.ok) {
          throw new Error(`An error has occurred: ${response.statusText}`);
        }
        const tournamentData = await response.json();
        if (!tournamentData) {
          throw new Error(`Tournament with id ${id} not found`);
        }
        setTournament(tournamentData);
        // Initialize scores object
        const initialScores = tournamentData.questions.reduce((acc, _, index) => {
          acc[index] = { score1: "", score2: "" };
          return acc;
        }, {});
        setScores(initialScores);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTournament();
  }, [params.id]);

  function updateScores(index, field, value) {
    setScores(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: value }
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const scoringData = {
      tournamentId: tournament._id,
      scores: Object.values(scores).map(score => `${score.score1}:${score.score2}`)
    };
  
    try {
      // First, check if a score already exists for this tournament
      const checkResponse = await fetch(`http://localhost:5050/score/${tournament._id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      let method, url;
      if (checkResponse.ok) {
        // Score exists, use PATCH
        method = "PATCH";
        url = `http://localhost:5050/score/${tournament._id}`;
      } else if (checkResponse.status === 404) {
        // Score doesn't exist, use POST
        method = "POST";
        url = "http://localhost:5050/score";
      } else {
        // Unexpected error
        throw new Error(`Error checking existing score: ${checkResponse.statusText}`);
      }
  
      // Now send the actual score data
      const submitResponse = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(scoringData),
      });
  
      if (!submitResponse.ok) {
        throw new Error(`HTTP error! status: ${submitResponse.status}`);
      }
  
      // If we reach here, the submission was successful
      navigate("/");
    } catch (error) {
      console.error('A problem occurred submitting the scores: ', error);
      setError('Failed to submit scores. Please try again.');
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tournament) return <div>No tournament found</div>;

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Score Tournament: {tournament.title}</h3>
      <form onSubmit={onSubmit} className="border rounded-lg overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-y-10 border-b border-slate-900/10 pb-12">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Questions and Scores
            </h2>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-y-8">
            {tournament.questions.map((question, index) => (
              <div key={index}>
                <label htmlFor={`score-${index}`} className="block text-sm font-medium leading-6 text-slate-900">
                  {question}
                </label>
                <div className="mt-2 flex space-x-2">
                  <input
                    type="text"
                    name={`score1-${index}`}
                    id={`score1-${index}`}
                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={scores[index].score1}
                    onChange={(e) => updateScores(index, 'score1', e.target.value)}
                    placeholder="Team 1 Score"
                    required
                  />
                  <input
                    type="text"
                    name={`score2-${index}`}
                    id={`score2-${index}`}
                    className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={scores[index].score2}
                    onChange={(e) => updateScores(index, 'score2', e.target.value)}
                    placeholder="Team 2 Score"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <input
          type="submit"
          value="Submit Scores"
          className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </form>
    </>
  );
}
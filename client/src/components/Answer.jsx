import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Answer = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
        const initialAnswers = data.questions.reduce((acc, _, index) => {
          acc[index] = { answer1: '', answer2: '' };
          return acc;
        }, {});
        setAnswers(initialAnswers);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleAnswerChange = (questionIndex, answerType, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        [answerType]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const submissionData = {
      tournamentId: id,
      user: username,
      answer: answers
    };

    console.log('Submission data:', submissionData);

    try {
      const response = await fetch(`http://localhost:5050/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.statusText}`);
      }

      // Handle successful submission
      alert('Answers submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tournament) return <div>No tournament found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{tournament.title}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 mb-4 w-full"
            required
          />
          <h2 className="text-xl font-semibold mb-2">Questions:</h2>
          <ul className="list-none pl-0">
            {tournament.questions.map((question, index) => (
              <li key={index} className="mb-4">
                <p className="mb-2">{question}</p>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Answer 1"
                    value={answers[index]?.answer1 || ''}
                    onChange={(e) => handleAnswerChange(index, 'answer1', e.target.value)}
                    className="border p-2 flex-1"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Answer 2"
                    value={answers[index]?.answer2 || ''}
                    onChange={(e) => handleAnswerChange(index, 'answer2', e.target.value)}
                    className="border p-2 flex-1"
                    required
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </button>
        {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
      </form>
    </div>
  );
};

export default Answer;
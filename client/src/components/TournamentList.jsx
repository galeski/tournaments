import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Note: You'll need to set up a route in your application to handle these hashed links and redirect to the appropriate tournament. Also, this simple hashing function might produce collisions for a large number of tournaments, so for a production application, you might want to use a more robust hashing algorithm or generate unique short IDs another way.
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substr(0, 6); // Convert to base 36 and take first 6 characters
}

const Tournament = (props) => {
  const hashedLink = `${window.location.origin}/tournaments/${hashCode(props.tournament._id)}`;

  const copyHashedLink = () => {
    navigator.clipboard.writeText(hashedLink).then(() => {
      alert("Hashed link copied to clipboard!");
    });
  };

  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
        {props.tournament._id}
      </td>
      <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
        {props.tournament.title}
      </td>
      <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
        {props.tournament.questions.length}
      </td>
      <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
        <div className="flex gap-2">
          <Link
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            to={`/view/${props.tournament._id}`}
          >
            View
          </Link>
          <Link
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            to={`/edit/${props.tournament._id}`}
          >
            Edit
          </Link>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            onClick={copyHashedLink}
          >
            Copy Link
          </button>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
            color="red"
            type="button"
            onClick={() => {
              props.deleteTournament(props.tournament._id);
            }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function TournamentList() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    async function getTournaments() {
      const response = await fetch(`http://localhost:5050/tournaments/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const tournaments = await response.json();
      setTournaments(tournaments);
    }
    getTournaments();
  }, [tournaments.length]);

  async function deleteTournament(id) {
    await fetch(`http://localhost:5050/tournaments/${id}`, {
      method: "DELETE",
    });
    const newTournaments = tournaments.filter((el) => el._id !== id);
    setTournaments(newTournaments);
  }

  function tournamentList() {
    return tournaments.map((tournament) => {
      return (
        <Tournament
          tournament={tournament}
          deleteTournament={() => deleteTournament(tournament._id)}
          key={tournament._id}
        />
      );
    });
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Tournaments</h3>
      {tournaments.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&amp;_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    ID
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    Title
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    Number of Questions
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="[&amp;_tr:last-child]:border-0">
                {tournamentList()}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg"></div>
      )}
    </>
  );
}
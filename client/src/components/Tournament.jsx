import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Tournament() {
  const [form, setForm] = useState({
    title: "",
    questions: []
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString();
      if (!id) return;
      setIsNew(false);
      const response = await fetch(`http://localhost:5050/tournaments/${id}`);
      if (!response.ok) {
        console.error(`An error has occurred: ${response.statusText}`);
        return;
      }
      const tournament = await response.json();
      if (!tournament) {
        console.warn(`Tournament with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(tournament);
    }
    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    return setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const tournament = { ...form };
    try {
      let response;
      if (isNew) {
        response = await fetch("http://localhost:5050/tournaments", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(tournament),
        });
      } else {
        response = await fetch(`http://localhost:5050/tournaments/${tournament._id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(tournament),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If we reach here, the submission was successful
      setForm({ title: "", questions: [] });
      navigate("/");
    } catch (error) {
      console.error('A problem occurred managing the tournament: ', error);
      // You might want to show an error message to the user here
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">
        {isNew ? "Create Tournament" : "Edit Tournament"}
      </h3>
      <form onSubmit={onSubmit} className="border rounded-lg overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-y-10 border-b border-slate-900/10 pb-12">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Tournament Info
            </h2>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-y-8">
            <div>
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-slate-900">
                Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label htmlFor="questions" className="block text-sm font-medium leading-6 text-slate-900">
                Questions (comma-separated)
              </label>
              <div className="mt-2">
                <textarea
                  name="questions"
                  id="questions"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={form.questions.join(", ")}
                  onChange={(e) => updateForm({ questions: e.target.value.split(",").map(q => q.trim()) })}
                />
              </div>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value={isNew ? "Create Tournament" : "Update Tournament"}
          className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </form>
    </>
  );
}
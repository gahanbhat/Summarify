import { FC, useEffect, useState } from "react";

interface Note {
  _id: string; // MongoDB generates an _id field by default
  content: string;
}

const SavedNotes: FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved notes from the backend
  useEffect(() => {
    const backendUrl = import.meta.env.BACKEND_URL;
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${backendUrl}/notes`); // API URL
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }
        const data = await response.json();
        console.log("Fetched data:", data); // Log data for debugging

        if (data?.notes) {
          setNotes(data.notes); // Set notes if response contains 'notes'
        } else {
          setError("No notes found.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching notes.");
        console.error("Fetch error:", err); // Log error for debugging
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="p-6 max-h-screen bg-neutral-700">
      <h1 className="text-2xl font-bold mb-4">Saved Notes</h1>

      {/* Loading state */}
      {isLoading && <p>Loading notes...</p>}

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* List of notes */}
      {!isLoading && !error && notes.length > 0 && (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note._id}
              className="p-4 border border-gray-300 rounded dark:border-gray-700 dark:bg-neutral-800 overflow-x-hidden break-words"
            >
              {/* Render note content */}
              <div dangerouslySetInnerHTML={{ __html: note.content }} />
            </li>
          ))}
        </ul>
      )}

      {/* No notes available */}
      {!isLoading && !error && notes.length === 0 && (
        <p>No saved notes available.</p>
      )}
    </div>
  );
};

export default SavedNotes;

import { useState } from "react";
import ReactMarkdown from "react-markdown";

const Editor = () => {
  const [text, setText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const backendUrl = import.meta.env.BACKEND_URL;

  // Toggle the preview visibility
  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };

  // Function to summarize the text
  const handleSummarize = async () => {
    if (!text.trim()) {
      alert("Please enter text to summarize!");
      return;
    }

    setIsSummarizing(true);
    try {
      const response = await fetch(`http://localhost:5000/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
      });

      const data = await response.json();

      if (response.ok) {
        setSummarizedText(data.summary);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Error summarizing text");
      console.error(error);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Function to save the note
  const handleSave = async () => {
    if (!text.trim()) {
      alert("Please enter text to save!");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${backendUrl}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: text }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Note saved successfully!");
        setText("");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Error saving note");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to clear the text
  const handleClearText = () => {
    setText("");
    setSummarizedText("");
  };

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      {/* Textarea for Markdown Input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your note here..."
        className="p-4 w-1/2 h-1/2 mb-4 mx-0 dark:bg-neutral-800 rounded"
        rows={10}
      />
      <div className="flex gap-4">
        {/* Button to toggle full-screen preview */}
        <button
          onClick={togglePreview}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Preview Full Screen
        </button>

        {/* Summarize button */}
        <button
          onClick={handleSummarize}
          className="mt-4 p-2 bg-yellow-500 text-white rounded"
          disabled={isSummarizing || !text.trim()}
        >
          {isSummarizing ? "Summarizing..." : "Summarize"}
        </button>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="mt-4 p-2 bg-green-500 text-white rounded"
          disabled={isSaving || !text.trim()}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        {/* Clear Text button */}
        <button
          onClick={handleClearText}
          className="mt-4 p-2 bg-red-500 text-white rounded"
        >
          Clear
        </button>
      </div>

      {/* Display Summarized Text */}
      {summarizedText && (
        <div className="mt-6 p-4 w-1/2 bg-neutral-800 rounded text-white overflow-y-auto max-h-screen overflow-x-hidden break-words">
          <h3 className="font-bold">Summarized Text:</h3>
          <ReactMarkdown>{summarizedText}</ReactMarkdown>
        </div>
      )}

      {/* Full-screen preview overlay */}
      {isPreviewVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="relative w-full max-w-5xl p-10 bg-white text-black dark:bg-neutral-900 dark:text-white rounded-xl overflow-auto max-h-screen">
            <button
              onClick={togglePreview}
              className="absolute top-4 font-extrabold right-4 p-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
            <div className="text-lg font-bold mb-4">Preview</div>
            <div className="overflow-y-auto max-h-screen overflow-x-hidden break-words text-sm">
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;

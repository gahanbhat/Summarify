import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import Note from "./models/note.js";
import axios from "axios"; // Import axios for making HTTP requests

// Initialize environment variables
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://summarify-jet.vercel.app",
];
app.use(cors({ origin: allowedOrigins }));

app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find(); // Fetching all notes from MongoDB
    res.status(200).json({ notes }); // Returning the notes
  } catch (err) {
    console.error("Error fetching notes:", err); // Log detailed error
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});
// Save a note
app.post("/save", async (req, res) => {
  const { content } = req.body;

  try {
    const newNote = new Note({
      content,
    });
    await newNote.save();
    res
      .status(201)
      .json({ message: "Note saved successfully!", note: newNote });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save note", details: err });
  }
});

// Summarize text using Hugging Face
app.post("/summarize", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res
      .status(400)
      .json({ error: "Text is required for summarization" });
  }

  try {
    // Make a POST request to Hugging Face API for summarization
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn", // BART model for summarization
      { inputs: text }, // No need to stringify JSON; axios handles it
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data[0].summary_text) {
      const summary = response.data[0].summary_text; // Extract summary from the response
      return res.status(200).json({ summary });
    } else {
      return res.status(500).json({ error: "Unexpected response format" });
    }
  } catch (err) {
    console.error(err); // Log the error to the console for easier debugging
    res
      .status(500)
      .json({ error: "Error summarizing text", details: err.message });
  }
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

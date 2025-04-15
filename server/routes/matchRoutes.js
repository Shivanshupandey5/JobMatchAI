const express = require("express");
const { PythonShell } = require("python-shell");
const Match = require("../models/Match");

const router = express.Router();

// POST /api/match → run Python + save result to DB
router.post("/api/match", async (req, res) => {
  const { resume, jobDescription } = req.body;

  const options = {
    mode: "text",
    pythonOptions: ["-u"],
    scriptPath: "../ai-engine", // path to your Python script
    args: [resume, jobDescription],
  };

  try {
    const results = await PythonShell.run("matcher_wrapper.py", options);
    const result = JSON.parse(results[0]);

    // Save match result to MongoDB
    const newMatch = new Match({
      resumeText: resume,
      jobDescription,
      matchScore: result.match_score,
      summary: result.summary,
    });

    await newMatch.save();

    res.status(200).json(result);
  } catch (err) {
    console.error("Error running Python script or saving to DB:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/matches → fetch all saved match results
router.get("/api/matches", async (req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
// This code defines two routes for the Express server:
// 1. POST /api/match: This route accepts a POST request with resume and job description data, runs a Python script to get the match score, and saves the result to MongoDB.
// 2. GET /api/matches: This route fetches all saved match results from MongoDB
// and returns them as JSON. It sorts the results by creation date in descending order (most recent first).
// The router is then exported for use in the main server file. The Python script is expected to return a JSON object with match_score and summary fields.
// The Python script is expected to return a JSON object with match_score and summary fields. The match
// score is a number between 0 and 1, where 1 means the resume perfectly matches
// the job description. The summary is a string that summarizes the match result.
// The match score is a number between 0 and 1, where 1 means the resum
 

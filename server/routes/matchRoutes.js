const express  = require("express");
const { PythonShell } = require("python-shell");
const path     = require("path");
const Match    = require("../models/Match");

const router = express.Router();

// POST /api/match → run Python AI engine + save to DB
router.post("/api/match", async (req, res) => {
  const { resume, jobDescription } = req.body;

  if (!resume || !jobDescription) {
    return res.status(400).json({ error: "resume and jobDescription are required" });
  }

  const options = {
    mode: "text",
    pythonOptions: ["-u"],
    scriptPath: path.join(__dirname, "../../ai-engine"),
    args: [resume, jobDescription],
  };

  try {
    const results = await PythonShell.run("matcher_wrapper.py", options);
    const result  = JSON.parse(results[0]);

    // Save full result to MongoDB
    const newMatch = new Match({
      resumeText:    resume,
      jobDescription,
      matchScore:    result.match_score,
      methodUsed:    result.method_used,
      sbertScore:    result.scores?.sbert_score,
      spacyjScore:   result.scores?.spacy_score,
      keywordScore:  result.scores?.keyword_score,
      matchedSkills: result.matched_skills || [],
      missingSkills: result.missing_skills || [],
      summary:       result.summary,
    });

    await newMatch.save();
    res.status(200).json(result);

  } catch (err) {
    console.error("Python/DB error:", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

// GET /api/matches → fetch all saved results
router.get("/api/matches", async (req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  resumeText: String,
  jobDescription: String,
  matchScore: Number,
  summary: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Match', MatchSchema);
// This model defines the structure of the match data that will be stored in the MongoDB database.
// It includes fields for the resume text, job description, match score, and a summary of the match.
const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  resumeText:     String,
  jobDescription: String,
  matchScore:     Number,
  methodUsed:     String,
  sbertScore:     Number,
  spacyjScore:    Number,
  keywordScore:   Number,
  matchedSkills:  [String],
  missingSkills:  [String],
  summary:        String,
  createdAt: {
    type:    Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Match', MatchSchema);
import React, { useState } from "react";
import axios from "axios";

function Home() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/match", {
        resume,
        jobDescription,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error matching:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Enter your Resume and Job Description</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Resume</label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows="6"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Paste your resume here"
          />
        </div>
        <div>
          <label className="block font-medium">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows="6"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Paste the job description here"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Match
        </button>
      </form>

      {result && (
        <div className="mt-4 bg-white p-4 rounded shadow">
            <p className="text-lg font-semibold">Score: {result.match_score?.toFixed(2)*100}%</p>
            <p className="text-gray-700 mt-1">{result.summary}</p>
        </div>
    )}
    </div>
  );
}

export default Home;

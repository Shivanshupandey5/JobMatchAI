import React from 'react';

function MatchCard({ match }) {
    if (!match) return null;
  
    const rawDate = match.timestamp;
    let formattedDate = "Unknown Date";
    if (rawDate) {
      const date = new Date(rawDate);
      if (!isNaN(date.getTime())) { // Check if it's a valid date
        formattedDate = date.toLocaleString();
      }
    }
  
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <p className="text-sm text-gray-500">{formattedDate}</p>
        <p className="font-semibold text-blue-600">
          Score: {match?.match_score !== undefined ? `${match.match_score.toFixed(2)}%` : "N/A"}
        </p>
        <p className="text-gray-700 mt-1">{match?.summary || "No summary available."}</p>
      </div>
    );
  }
  

export default MatchCard;

import React, { useState, useEffect } from 'react';
import { getMatches } from '../utils/api'; // Assuming this function fetches matches from backend

const History = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getMatches()
      .then((res) => {
        console.log('Fetched matches:', res);
        setMatches(res);
      })
      .catch((err) => console.error('Failed to fetch matches:', err));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Converts to local date format
  };

  return (
    <div>
      <h2>Match History</h2>
      {matches.length > 0 ? (
        matches.map((match, index) => (
          <div key={index} className="match-card">
            <div>{formatDate(match.createdAt)}</div>
            <div>Score: {typeof match.matchScore === 'number' ? match.matchScore : 'N/A'}</div>
            <div>{match.summary ? match.summary : 'Summary not available'}</div>
          </div>
        ))
      ) : (
        <div>No matches found</div>
      )}
    </div>
  );
};

export default History;

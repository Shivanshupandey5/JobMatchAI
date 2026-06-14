import React from "react";

function MatchCard({ match }) {
  if (!match) return null;

  const formattedDate = match.createdAt
    ? new Date(match.createdAt).toLocaleString()
    : "Unknown Date";

  const score = match.match_score ?? match.matchScore;
  const scoreColor = score >= 60 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626";

  return (
    <div style={{
      background: "#fff", border: "1px solid #e2e8f0",
      borderRadius: 10, padding: 16, marginBottom: 12
    }}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: scoreColor }}>
          {score !== undefined ? `${Number(score).toFixed(1)}%` : "N/A"}
        </span>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>{formattedDate}</span>
      </div>

      {/* Method scores */}
      {(match.sbertScore || match.spacyjScore || match.keywordScore) && (
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          {[
            { label: "SBERT",   val: match.sbertScore },
            { label: "spaCy",   val: match.spacyjScore },
            { label: "Keyword", val: match.keywordScore },
          ].map(m => m.val !== undefined && (
            <span key={m.label} style={{
              fontSize: 12, padding: "3px 10px", borderRadius: 20,
              background: "#f1f5f9", color: "#475569"
            }}>
              {m.label}: {Number(m.val).toFixed(1)}%
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      <p style={{ fontSize: 13, color: "#475569", margin: "0 0 10px" }}>
        {match.summary || "No summary available."}
      </p>

      {/* Skills */}
      {match.matchedSkills?.length > 0 && (
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>Matched: </span>
          {match.matchedSkills.map(s => (
            <span key={s} style={{
              fontSize: 11, background: "#dcfce7", color: "#166534",
              padding: "2px 8px", borderRadius: 20, marginRight: 4
            }}>{s}</span>
          ))}
        </div>
      )}
      {match.missingSkills?.length > 0 && (
        <div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#b91c1c" }}>Missing: </span>
          {match.missingSkills.map(s => (
            <span key={s} style={{
              fontSize: 11, background: "#fee2e2", color: "#991b1b",
              padding: "2px 8px", borderRadius: 20, marginRight: 4
            }}>{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default MatchCard;
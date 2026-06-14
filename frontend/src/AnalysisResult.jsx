import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = { SBERT: "#6366f1", spaCy: "#8b5cf6", Keyword: "#a78bfa" };

export default function AnalysisResult({ result }) {
  if (!result) return null;
  const { match_score, method_used, scores, matched_skills = [], missing_skills = [], summary } = result;

  const scoreColor = match_score >= 60 ? "#22c55e" : match_score >= 40 ? "#f59e0b" : "#ef4444";
  const scoreLabel = match_score >= 60 ? "Strong Match" : match_score >= 40 ? "Partial Match" : "Weak Match";

  const chartData = [
    { method: "SBERT",   score: scores?.sbert_score   ?? 0 },
    { method: "spaCy",   score: scores?.spacy_score   ?? 0 },
    { method: "Keyword", score: scores?.keyword_score ?? 0 },
  ];

  const card = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16, padding: 24,
    backdropFilter: "blur(20px)"
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: "#f1f5f9" }}>

      {/* ── Top row: Primary Score + Summary ── */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16, marginBottom: 16 }}>

        {/* Score circle */}
        <div style={{ ...card, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12"/>
            <circle cx="70" cy="70" r="58" fill="none"
              stroke={scoreColor} strokeWidth="12"
              strokeDasharray={`${(match_score / 100) * 364.4} 364.4`}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
            <text x="70" y="66" textAnchor="middle" fill="#f1f5f9" fontSize="26" fontWeight="800">{match_score}%</text>
            <text x="70" y="86" textAnchor="middle" fill={scoreColor} fontSize="11" fontWeight="600">{scoreLabel}</text>
          </svg>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "#64748b" }}>Primary: {method_used?.split(" ")[0]}</p>
        </div>

        {/* Summary + 3 score pills */}
        <div style={{ ...card }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Analysis Summary</p>
          <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7, margin: "0 0 20px" }}>{summary}</p>
          <div style={{ display: "flex", gap: 12 }}>
            {chartData.map(d => (
              <div key={d.method} style={{
                flex: 1, textAlign: "center", padding: "12px 8px",
                background: "rgba(255,255,255,0.05)", borderRadius: 10,
                border: `1px solid ${COLORS[d.method]}40`
              }}>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{d.method}</p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: COLORS[d.method] }}>{d.score}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bar Chart ── */}
      <div style={{ ...card, marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Method Comparison
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 0, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
            <XAxis dataKey="method" tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} tickLine={false}/>
            <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} unit="%"/>
            <Tooltip
              contentStyle={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9" }}
              formatter={(v) => [`${v}%`, "Score"]}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={60}>
              {chartData.map(d => <Cell key={d.method} fill={COLORS[d.method]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Skill Gap ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        <div style={{ ...card, border: "1px solid rgba(34,197,94,0.2)", background: "rgba(34,197,94,0.04)" }}>
          <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            ✅ Matched Skills — {matched_skills.length}
          </p>
          {matched_skills.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {matched_skills.map(s => (
                <span key={s} style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  background: "rgba(34,197,94,0.1)", color: "#4ade80",
                  border: "1px solid rgba(34,197,94,0.2)"
                }}>{s}</span>
              ))}
            </div>
          ) : <p style={{ color: "#475569", fontSize: 13 }}>No matched skills found.</p>}
        </div>

        <div style={{ ...card, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)" }}>
          <p style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            ❌ Missing Skills — {missing_skills.length}
          </p>
          {missing_skills.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {missing_skills.map(s => (
                <span key={s} style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  background: "rgba(239,68,68,0.1)", color: "#f87171",
                  border: "1px solid rgba(239,68,68,0.2)"
                }}>{s}</span>
              ))}
            </div>
          ) : <p style={{ color: "#475569", fontSize: 13 }}>No missing skills detected.</p>}
        </div>

      </div>
    </div>
  );
}
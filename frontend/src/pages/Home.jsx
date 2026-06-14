import React, { useState } from "react";
import axios from "axios";
import AnalysisResult from "../AnalysisResult";

function Home() {
  const [resume, setResume]                 = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult]                 = useState(null);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const resultRef                           = React.useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post("http://localhost:5000/api/match", {
        resume,
        jobDescription,
      });
      setResult(response.data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      console.error("Error matching:", err);
      setError("Something went wrong. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      boxSizing: "border-box",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#f1f5f9"
    }}>

      {/* ── Navbar ── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700
          }}>J</div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>JobMatchAI</span>
        </div>
        <a href="/history" style={{
          color: "#a5b4fc", textDecoration: "none", fontSize: 14,
          padding: "6px 16px", border: "1px solid rgba(165,180,252,0.3)",
          borderRadius: 20, transition: "all 0.2s"
        }}>View History</a>
      </nav>

      {/* ── Hero ── */}
      <div style={{ textAlign: "center", padding: "52px 24px 40px" }}>
        <div style={{
          display: "inline-block", padding: "6px 16px", borderRadius: 20,
          background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
          fontSize: 12, color: "#a5b4fc", marginBottom: 20, letterSpacing: "0.5px"
        }}>
          AI-POWERED ATS OPTIMIZATION
        </div>
        <h1 style={{
          fontSize: 44, fontWeight: 800, margin: "0 0 14px",
          background: "linear-gradient(135deg, #fff 0%, #a5b4fc 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>
          Resume–Job Match Analyzer
        </h1>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 500, margin: "0 auto" }}>
          Compare your resume against any job description using three NLP methods —
          Keyword, spaCy, and Sentence-BERT
        </p>
      </div>

      {/* ── Main Card ── */}
      <div style={{
        maxWidth: 960, margin: "0 auto", padding: "0 24px 60px"
      }}>
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20, padding: 32,
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)"
        }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            {/* Resume */}
            <div>
              <label style={{
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 600, color: "#cbd5e1", marginBottom: 10
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: "rgba(99,102,241,0.2)", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 11
                }}>📄</span>
                RESUME TEXT
              </label>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                rows={12}
                placeholder="Paste your full resume here..."
                style={{
                  width: "100%", padding: "14px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, color: "#f1f5f9", fontSize: 13,
                  resize: "vertical", outline: "none", fontFamily: "inherit",
                  boxSizing: "border-box", lineHeight: 1.6,
                  transition: "border 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {/* JD */}
            <div>
              <label style={{
                display: "flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 600, color: "#cbd5e1", marginBottom: 10
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: "rgba(99,102,241,0.2)", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 11
                }}>💼</span>
                JOB DESCRIPTION
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={12}
                placeholder="Paste the job description here..."
                style={{
                  width: "100%", padding: "14px 16px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, color: "#f1f5f9", fontSize: 13,
                  resize: "vertical", outline: "none", fontFamily: "inherit",
                  boxSizing: "border-box", lineHeight: 1.6
                }}
                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
          </div>

          {error && (
            <p style={{
              color: "#f87171", fontSize: 13, marginBottom: 14,
              padding: "10px 14px", background: "rgba(239,68,68,0.1)",
              borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)"
            }}>{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "14px 0",
              background: loading
                ? "rgba(99,102,241,0.4)"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.3px",
              boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
              transition: "all 0.2s"
            }}
          >
            {loading ? "⚙️  Analyzing with SBERT + spaCy + Keyword..." : "🚀  Analyze Resume"}
          </button>
        </div>

        {/* Results */}
        {result && (
        <div ref={resultRef} style={{ marginTop: 32 }}>
            <AnalysisResult result={result} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
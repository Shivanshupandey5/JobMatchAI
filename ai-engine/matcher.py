import re
from collections import Counter

# ── lazy imports so the wrapper doesn't crash if a lib is missing ──────────
try:
    import spacy
    nlp = spacy.load("en_core_web_md")
    SPACY_OK = True
except Exception:
    SPACY_OK = False

try:
    from sentence_transformers import SentenceTransformer, util
    sbert_model = SentenceTransformer("all-MiniLM-L6-v2")
    SBERT_OK = True
except Exception:
    SBERT_OK = False


# ── helpers ────────────────────────────────────────────────────────────────

def _clean(text: str) -> str:
    """Lowercase, strip punctuation, collapse whitespace."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


STOPWORDS = {
    # common english
    "and","the","for","with","of","in","a","an","to","is","are","was",
    "were","be","been","has","have","that","this","on","at","by","from",
    "or","as","it","its","we","you","your","our","their","will","can",
    "not","but","if","so","do","does","did","which","who","how","what",
    "when","where","why","all","any","some","more","also","about","than",
    "into","through","such","these","those","they","he","she","his","her",
    "my","me","us","him","them","up","out","over","under","between","both",
    # job-description filler words (not real skills)
    "looking","seeking","required","requirements","requirement","preferred",
    "experience","experienced","skills","skill","ability","abilities",
    "knowledge","understanding","strong","good","great","excellent",
    "candidate","candidates","applicant","applicants","role","position",
    "job","work","working","team","engineer","developer","manager",
    "minimum","years","year","least","plus","responsible","responsibilities",
    "including","include","includes","must","should","would","like","well",
    "using","use","used","build","building","built","develop","developing",
    "maintain","maintaining","ensure","support","supporting","helping",
    "across","within","along","per","various","related","relevant",
    "degree","bachelor","master","phd","equivalent","field","fields",
    "preferred","bonus","nice","have","need","needed","apply","get",
}

def _tokens(text: str):
    return [w for w in _clean(text).split() if w not in STOPWORDS and len(w) > 1]


# ── Method 1 : Keyword overlap (baseline) ─────────────────────────────────

def keyword_match(resume_text: str, jd_text: str) -> float:
    """
    Jaccard-style keyword overlap between resume and JD token sets.
    Returns 0-100.
    """
    r_tokens = set(_tokens(resume_text))
    j_tokens = set(_tokens(jd_text))
    if not j_tokens:
        return 0.0
    overlap = r_tokens & j_tokens
    score = len(overlap) / len(j_tokens) * 100
    return round(min(score, 100.0), 2)


# ── Method 2 : spaCy semantic similarity ──────────────────────────────────

def spacy_match(resume_text: str, jd_text: str) -> float:
    """
    Word-vector cosine similarity via spaCy en_core_web_md.
    Returns 0-100, or -1 if spaCy unavailable.
    """
    if not SPACY_OK:
        return -1.0
    doc1 = nlp(_clean(resume_text))
    doc2 = nlp(_clean(jd_text))
    if not doc1.has_vector or not doc2.has_vector:
        return 0.0
    return round(doc1.similarity(doc2) * 100, 2)


# ── Method 3 : Sentence-BERT semantic similarity ──────────────────────────

def sbert_match(resume_text: str, jd_text: str) -> float:
    """
    Dense embedding cosine similarity via all-MiniLM-L6-v2.
    Returns 0-100, or -1 if sentence-transformers unavailable.
    """
    if not SBERT_OK:
        return -1.0
    emb1 = sbert_model.encode(resume_text, convert_to_tensor=True)
    emb2 = sbert_model.encode(jd_text,   convert_to_tensor=True)
    score = float(util.cos_sim(emb1, emb2)[0][0])
    # cosine can be slightly negative for unrelated texts → clamp to 0
    return round(max(score, 0.0) * 100, 2)


# ── Skill-gap helper ───────────────────────────────────────────────────────

def skill_gap(resume_text: str, jd_text: str) -> dict:
    """
    Returns skills mentioned in JD but absent from resume (missing)
    and skills present in resume (matched).
    """
    r_tokens = set(_tokens(resume_text))
    j_tokens = set(_tokens(jd_text))
    missing  = sorted(j_tokens - r_tokens)
    matched  = sorted(j_tokens & r_tokens)
    return {"matched_skills": matched, "missing_skills": missing}


# ── Primary entry-point (called by matcher_wrapper.py) ────────────────────

def match_resume_to_job(resume_text: str, job_description: str) -> dict:
    """
    Run all three matching methods + skill-gap analysis.
    Returns a JSON-serialisable dict.
    """
    kw    = keyword_match(resume_text, job_description)
    sp    = spacy_match(resume_text,   job_description)
    sb    = sbert_match(resume_text,   job_description)

    # Use SBERT as the primary score if available, else spaCy, else keyword
    if sb >= 0:
        primary = sb
        method  = "SBERT (all-MiniLM-L6-v2)"
    elif sp >= 0:
        primary = sp
        method  = "spaCy (en_core_web_md)"
    else:
        primary = kw
        method  = "Keyword Overlap"

    gap = skill_gap(resume_text, job_description)

    return {
        "match_score":     primary,
        "method_used":     method,
        "scores": {
            "sbert_score":   sb,
            "spacy_score":   sp,
            "keyword_score": kw,
        },
        "matched_skills":  gap["matched_skills"],
        "missing_skills":  gap["missing_skills"],
        "summary": (
            f"Resume matches the job description with {primary:.1f}% confidence "
            f"(method: {method}). "
            f"{len(gap['matched_skills'])} skills matched, "
            f"{len(gap['missing_skills'])} skills missing."
        )
    }


# ── Local smoke-test ───────────────────────────────────────────────────────

if __name__ == "__main__":
    resume = (
        "Python developer with 2 years of experience in machine learning, "
        "data analysis, pandas, scikit-learn, and REST API development using Flask."
    )
    job = (
        "Looking for a Python engineer with experience in machine learning, "
        "deep learning, TensorFlow, data pipelines, and API development."
    )
    import json
    print(json.dumps(match_resume_to_job(resume, job), indent=2))
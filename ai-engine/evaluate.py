import pandas as pd
import json
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix
from matcher import match_resume_to_job

# ── Load dataset ───────────────────────────────────────────────────────────
df = pd.read_csv("dataset.csv")
print(f"Loaded {len(df)} resume-JD pairs\n")

# ── Run all 3 methods on every pair ───────────────────────────────────────
sbert_scores, spacy_scores, keyword_scores = [], [], []

for i, row in df.iterrows():
    result = match_resume_to_job(row["resume_text"], row["jd_text"])
    sbert_scores.append(result["scores"]["sbert_score"])
    spacy_scores.append(result["scores"]["spacy_score"])
    keyword_scores.append(result["scores"]["keyword_score"])
    print(f"[{i+1}/50] {row['job_category']} | SBERT={result['scores']['sbert_score']} | spaCy={result['scores']['spacy_score']} | KW={result['scores']['keyword_score']}")

df["sbert_score"]   = sbert_scores
df["spacy_score"]   = spacy_scores
df["keyword_score"] = keyword_scores

# ── Convert scores to labels using thresholds ─────────────────────────────
# Tuned per method — SBERT/spaCy scores are higher in range than keyword
def label_sbert(s):
    if s >= 60: return 2
    elif s >= 40: return 1
    else: return 0

def label_spacy(s):
    if s >= 85: return 2
    elif s >= 72: return 1
    else: return 0

def label_keyword(s):
    if s >= 40: return 2
    elif s >= 20: return 1
    else: return 0

df["sbert_pred"]   = df["sbert_score"].apply(label_sbert)
df["spacy_pred"]   = df["spacy_score"].apply(label_spacy)
df["keyword_pred"] = df["keyword_score"].apply(label_keyword)

# ── Compute metrics ────────────────────────────────────────────────────────
y_true = df["human_label"]
results = {}

print("\n" + "="*55)
print(f"{'Method':<12} {'Precision':>10} {'Recall':>10} {'F1':>10}")
print("="*55)

for method in ["sbert", "spacy", "keyword"]:
    y_pred = df[f"{method}_pred"]
    p = precision_score(y_true, y_pred, average="macro", zero_division=0)
    r = recall_score(y_true, y_pred, average="macro", zero_division=0)
    f = f1_score(y_true, y_pred, average="macro", zero_division=0)
    results[method] = {"precision": round(p,4), "recall": round(r,4), "f1": round(f,4)}
    label = {"sbert":"SBERT","spacy":"spaCy","keyword":"Keyword"}[method]
    print(f"{label:<12} {p:>10.4f} {r:>10.4f} {f:>10.4f}")

print("="*55)

# ── Save scored dataset ────────────────────────────────────────────────────
df.to_csv("dataset_scored.csv", index=False)
print("\nScored dataset saved to dataset_scored.csv")

# ── Save results to JSON (use in paper) ───────────────────────────────────
with open("evaluation_results.json", "w") as f:
    json.dump(results, f, indent=2)
print("Metrics saved to evaluation_results.json")
print("\nCopy these numbers directly into Table 1 of your paper.")
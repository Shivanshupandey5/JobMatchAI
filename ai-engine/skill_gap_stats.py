import pandas as pd
from matcher import skill_gap

df = pd.read_csv("dataset.csv")

results = []
for _, row in df.iterrows():
    gap = skill_gap(row["resume_text"], row["jd_text"])
    results.append({
        "job_category":    row["job_category"],
        "human_label":     row["human_label"],
        "matched_count":   len(gap["matched_skills"]),
        "missing_count":   len(gap["missing_skills"]),
    })

rdf = pd.DataFrame(results)

print("\n=== Average matched and missing skills per job category ===")
summary = rdf.groupby("job_category")[["matched_count","missing_count"]].mean().round(2)
print(summary.to_string())

print("\n=== Overall averages ===")
print(f"Avg matched skills : {rdf['matched_count'].mean():.2f}")
print(f"Avg missing skills : {rdf['missing_count'].mean():.2f}")

print("\n=== By match quality label ===")
label_map = {2: "Good Match", 1: "Partial Match", 0: "Poor Match"}
for label, name in label_map.items():
    sub = rdf[rdf["human_label"] == label]
    print(f"{name}: avg matched={sub['matched_count'].mean():.2f}, avg missing={sub['missing_count'].mean():.2f}")
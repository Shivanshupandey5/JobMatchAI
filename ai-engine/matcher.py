from difflib import SequenceMatcher

def match_resume_to_job(resume_text, job_description):
    matcher = SequenceMatcher(None, resume_text.lower(), job_description.lower())
    score = round(matcher.ratio() * 100, 2)
    return {
        "match_score": score,
        "summary": f"Resume matches the job description with {score}% confidence."
    }

# Optional test run
if __name__ == "__main__":
    resume = "Python developer experienced in ML and data science"
    job = "Looking for a Python engineer with experience in machine learning"
    result = match_resume_to_job(resume, job)
    print(result)

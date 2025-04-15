import sys
import json
from matcher import match_resume_to_job

def main():
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Two arguments required: resume text and job description"}))
        sys.exit(1)

    resume_text = sys.argv[1]
    job_description = sys.argv[2]

    result = match_resume_to_job(resume_text, job_description)
    print(json.dumps(result))

if __name__ == "__main__":
    main()

from jobs.models import Job
from candidates.models import CandidateProfile
from resumes.models import Resume

def compute_job_match(candidate_profile: CandidateProfile, resume: Resume, job: Job) -> dict:
    """
    Computes an explainable, deterministic match score between a candidate and a job listing.
    """
    # 1. Aggregate candidate skills from profile and primary resume
    candidate_skills = set()
    if candidate_profile and candidate_profile.skills:
        candidate_skills.update([s.lower() for s in candidate_profile.skills])
    if resume and resume.parsed_skills:
        candidate_skills.update([s.lower() for s in resume.parsed_skills])

    job_required = [s.lower() for s in (job.required_skills or [])]
    job_preferred = [s.lower() for s in (job.preferred_skills or [])]

    # Required skills calculation
    if job_required:
        matched_req = [s for s in job_required if s in candidate_skills]
        missing_req = [s for s in job_required if s not in candidate_skills]
        req_score = (len(matched_req) / len(job_required)) * 100
    else:
        matched_req = []
        missing_req = []
        req_score = 50.0 if candidate_skills else 0.0  # Only score if candidate has skills

    # Preferred skills calculation
    if job_preferred:
        matched_pref = [s for s in job_preferred if s in candidate_skills]
        missing_pref = [s for s in job_preferred if s not in candidate_skills]
        pref_score = (len(matched_pref) / len(job_preferred)) * 100
    else:
        matched_pref = []
        missing_pref = []
        pref_score = 40.0 if candidate_skills else 0.0

    # Experience level match
    exp_score = 100.0
    cand_years = float(candidate_profile.experience_years or 0) if candidate_profile else 0.0
    job_min_exp = float(job.min_experience_years or 0)
    
    if cand_years >= job_min_exp:
        exp_score = 100.0
    elif cand_years >= (job_min_exp - 1):
        exp_score = 75.0
    else:
        exp_score = 40.0

    # Work mode & Location preference match
    work_mode_score = 100.0
    if candidate_profile:
        if candidate_profile.preferred_work_mode != CandidateProfile.WorkMode.ANY:
            if candidate_profile.preferred_work_mode.upper() != job.work_mode.upper():
                work_mode_score = 60.0

    # Weighted Overall Match:
    # 50% Required Skills, 20% Preferred Skills, 15% Experience, 15% Work Mode
    total_score = (
        (req_score * 0.50) +
        (pref_score * 0.20) +
        (exp_score * 0.15) +
        (work_mode_score * 0.15)
    )
    total_score = int(min(max(total_score, 15), 98))

    # Reasons why the job matches or has gaps
    reasons = []
    if matched_req:
        reasons.append(f"Matched {len(matched_req)}/{len(job_required)} required skills including {', '.join([s.title() for s in matched_req[:3]])}.")
    if missing_req:
        reasons.append(f"Missing required skills: {', '.join([s.title() for s in missing_req[:3]])}.")
    if exp_score == 100.0 and job_min_exp > 0:
        reasons.append(f"Meets minimum experience requirement of {job_min_exp} years.")
    if job.work_mode == Job.WorkMode.REMOTE:
        reasons.append("Matches remote work preference.")

    return {
        "match_score": total_score,
        "matched_skills": [s.title() for s in matched_req + matched_pref],
        "missing_required_skills": [s.title() for s in missing_req],
        "missing_preferred_skills": [s.title() for s in missing_pref],
        "breakdown": {
            "required_skills_score": int(req_score),
            "preferred_skills_score": int(pref_score),
            "experience_score": int(exp_score),
            "work_mode_score": int(work_mode_score)
        },
        "reasons": reasons
    }

def get_recommended_jobs_for_candidate(user, limit: int = 10) -> list:
    """
    Ranks published jobs for a candidate user by match score.
    Returns empty list if candidate has insufficient data (no skills, target role, or resume).
    """
    try:
        candidate_profile = user.candidate_profile
    except Exception:
        candidate_profile = None

    resume = Resume.objects.filter(user=user, is_primary=True).first()
    if not resume:
        resume = Resume.objects.filter(user=user).order_by('-uploaded_at').first()

    # Collect candidate skills
    candidate_skills = set()
    if candidate_profile and candidate_profile.skills:
        candidate_skills.update([s.lower() for s in candidate_profile.skills])
    if resume and resume.parsed_skills:
        candidate_skills.update([s.lower() for s in resume.parsed_skills])

    target_role_title = (candidate_profile.target_role or "").strip() if candidate_profile else ""

    # Requirement 8: If insufficient information exists, do not display job matches based on assumed skills
    if not candidate_skills and not target_role_title and not resume:
        return []

    jobs = Job.objects.filter(
        status__in=[Job.Status.APPROVED, Job.Status.PUBLISHED],
        has_scam_warning=False
    ).select_related('company')
    scored_jobs = []

    for job in jobs:
        match_data = compute_job_match(candidate_profile, resume, job)
        scored_jobs.append({
            "job": job,
            "match": match_data
        })

    # Sort descending by match_score
    scored_jobs.sort(key=lambda x: x["match"]["match_score"], reverse=True)
    return scored_jobs[:limit]


"""
CareerLens AI — Skill Service
Skill normalization and set-based matching.
Lifted directly from main_code.py.
"""

import logging
from dataclasses import dataclass, field

logger = logging.getLogger("careerlens.skills")


def normalize_skill(skill: str) -> str:
    """
    Normalize a skill so that small formatting differences
    don't prevent matching.
    Lifted directly from main_code.py.
    """
    skill = skill.strip().lower()

    # Common aliases
    aliases = {
        "amazon web services": "aws",
        "aws": "aws",
        "react": "react.js",
        "reactjs": "react.js",
        "react.js": "react.js",
        "node": "node.js",
        "nodejs": "node.js",
        "node.js": "node.js",
        "postgres": "postgresql",
        "postgresql": "postgresql",
        "ml": "machine learning",
        "k8s": "kubernetes",
        "js": "javascript",
        "ts": "typescript",
        "py": "python",
        "cpp": "c++",
        "c sharp": "c#",
        "csharp": "c#",
        "golang": "go",
        "mongo": "mongodb",
        "express": "express.js",
        "expressjs": "express.js",
        "vue": "vue.js",
        "vuejs": "vue.js",
        "angular": "angular",
        "angularjs": "angular",
        "nextjs": "next.js",
        "next": "next.js",
        "tensorflow": "tensorflow",
        "tf": "tensorflow",
        "pytorch": "pytorch",
        "gcp": "google cloud platform",
        "azure": "microsoft azure",
    }

    return aliases.get(skill, skill)


@dataclass
class SkillMatchResult:
    """Result of skill matching analysis."""
    resume_skills: list[str] = field(default_factory=list)
    matched_required: set[str] = field(default_factory=set)
    missing_required: set[str] = field(default_factory=set)
    matched_preferred: set[str] = field(default_factory=set)
    missing_preferred: set[str] = field(default_factory=set)
    partial: list[str] = field(default_factory=list)
    skill_score: float = 0.0


def match(
    resume_skills: list[str],
    required_skills: list[str],
    preferred_skills: list[str],
) -> SkillMatchResult:
    """
    Normalize and match skills using set operations.
    Lifted from main_code.py with addition of partial matching.
    """
    # Normalize all skill sets
    resume_skills_normalized = {normalize_skill(s) for s in resume_skills}
    required_skills_normalized = {normalize_skill(s) for s in required_skills}
    preferred_skills_normalized = {normalize_skill(s) for s in preferred_skills}

    # Set-based matching (exact from main_code.py)
    matched_required = resume_skills_normalized & required_skills_normalized
    missing_required = required_skills_normalized - resume_skills_normalized
    matched_preferred = resume_skills_normalized & preferred_skills_normalized
    missing_preferred = preferred_skills_normalized - resume_skills_normalized

    # Calculate skill score
    if required_skills_normalized:
        skill_score = (len(matched_required) / len(required_skills_normalized)) * 100
    else:
        skill_score = 100.0

    # Simple partial matching: check for substring containment
    partial_matches = []
    remaining_missing = set()

    for missing in missing_required:
        found_partial = False
        for resume_skill in resume_skills_normalized:
            # Check if one contains the other or they share significant overlap
            if (missing in resume_skill or resume_skill in missing) and missing != resume_skill:
                partial_matches.append(missing)
                found_partial = True
                break
            # Check word overlap
            missing_words = set(missing.split())
            resume_words = set(resume_skill.split())
            if len(missing_words) > 1 and len(missing_words & resume_words) >= 1:
                partial_matches.append(missing)
                found_partial = True
                break
        if not found_partial:
            remaining_missing.add(missing)

    result = SkillMatchResult(
        resume_skills=sorted(resume_skills_normalized),
        matched_required=matched_required,
        missing_required=remaining_missing,
        matched_preferred=matched_preferred,
        missing_preferred=missing_preferred,
        partial=partial_matches,
        skill_score=skill_score,
    )

    logger.info(
        f"Skills: {len(matched_required)} matched, "
        f"{len(partial_matches)} partial, "
        f"{len(remaining_missing)} missing, "
        f"score={skill_score:.1f}%"
    )

    return result

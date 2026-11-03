import { SKILL_TAXONOMY } from '../data/skillTaxonomy';

export interface SkillMatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchTier: 'Perfect Match' | 'Strong Match' | 'Good Match' | 'Potential Match';
  explanation: string;
}

export function parseSkills(skillsString?: string | null): string[] {
  if (!skillsString) return [];
  return skillsString
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function normalizeSkill(skill: string): string {
  const clean = skill.trim().toLowerCase();
  for (const item of SKILL_TAXONOMY) {
    if (item.name.toLowerCase() === clean) {
      return item.name.toLowerCase();
    }
    if (item.aliases?.some((a) => a.toLowerCase() === clean)) {
      return item.name.toLowerCase();
    }
  }
  return clean;
}

export function calculateSkillMatch(
  candidateSkills: string[],
  requiredSkills: string[],
  optionalSkills: string[] = []
): SkillMatchResult {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercentage: 100,
      matchedSkills: [],
      missingSkills: [],
      matchTier: 'Perfect Match',
      explanation: 'No specific prerequisite skills restricted for this task.',
    };
  }

  const normalizedCandidate = candidateSkills.map(normalizeSkill);
  const matchedRequired: string[] = [];
  const missingRequired: string[] = [];

  for (const req of requiredSkills) {
    const norm = normalizeSkill(req);
    const isMatch = normalizedCandidate.some(
      (cand) => cand === norm || norm.includes(cand) || cand.includes(norm)
    );

    if (isMatch) {
      matchedRequired.push(req);
    } else {
      missingRequired.push(req);
    }
  }

  let optionalBonus = 0;
  if (optionalSkills && optionalSkills.length > 0) {
    for (const opt of optionalSkills) {
      const norm = normalizeSkill(opt);
      if (normalizedCandidate.some((cand) => cand === norm || norm.includes(cand))) {
        optionalBonus += 5;
      }
    }
  }

  const basePercentage = Math.round((matchedRequired.length / requiredSkills.length) * 100);
  const matchPercentage = Math.min(100, basePercentage + optionalBonus);

  let matchTier: SkillMatchResult['matchTier'] = 'Potential Match';
  if (matchPercentage === 100) {
    matchTier = 'Perfect Match';
  } else if (matchPercentage >= 75) {
    matchTier = 'Strong Match';
  } else if (matchPercentage >= 50) {
    matchTier = 'Good Match';
  }

  let explanation = '';
  if (matchedRequired.length === requiredSkills.length) {
    explanation = `Full match on all ${requiredSkills.length} required skills. You are exceptionally well-positioned for this task.`;
  } else if (matchedRequired.length > 0) {
    explanation = `Matched ${matchedRequired.length} of ${requiredSkills.length} skills (${matchedRequired.join(', ')}). Missing: ${missingRequired.join(', ')}.`;
  } else {
    explanation = `None of the required skills present in your profile yet. Great opportunity to learn and demonstrate capability.`;
  }

  return {
    matchPercentage,
    matchedSkills: matchedRequired,
    missingSkills: missingRequired,
    matchTier,
    explanation,
  };
}

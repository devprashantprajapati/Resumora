import { ResumeData } from '@/types/resume';

export interface ATSResult {
  score: number;
  good: string[];
  improvements: string[];
}

const ACTION_VERBS = [
  'achieved', 'improved', 'trained', 'managed', 'created', 'resolved', 
  'volunteered', 'influenced', 'increased', 'decreased', 'launched', 
  'negotiated', 'developed', 'led', 'optimized', 'spearheaded', 
  'orchestrated', 'implemented', 'designed', 'built', 'transformed',
  'analyzed', 'collaborated', 'directed', 'established', 'executed',
  'facilitated', 'generated', 'guided', 'identified', 'initiated',
  'innovated', 'maximized', 'motivated', 'operated', 'organized',
  'pioneered', 'planned', 'produced', 'promoted', 'reduced',
  'revamped', 'saved', 'streamlined', 'supervised', 'upgraded',
  'accelerated', 'adapted', 'administered', 'advocated', 'allocated',
  'amplified', 'assessed', 'audited', 'calculated', 'centralized',
  'championed', 'clarified', 'coached', 'compiled', 'completed',
  'composed', 'computed', 'conceived', 'conducted', 'consolidated',
  'constructed', 'consulted', 'controlled', 'converted', 'coordinated',
  'cultivated', 'customized', 'delegated', 'delivered', 'demonstrated',
  'deployed', 'devised', 'diagnosed', 'discovered', 'dispatched',
  'drafted', 'drove', 'earned', 'edited', 'educated', 'elevated',
  'empowered', 'enabled', 'engineered', 'enhanced', 'evaluated',
  'examined', 'expanded', 'expedited', 'extracted', 'forecasted',
  'formulated', 'fostered', 'founded', 'gained', 'gathered', 'halted',
  'headed', 'hosted', 'illustrated', 'incorporated', 'inspired',
  'installed', 'instituted', 'instructed', 'integrated', 'interpreted',
  'interviewed', 'introduced', 'invented', 'investigated', 'mentored',
  'mobilized', 'modeled', 'moderated', 'monitored', 'navigated',
  'overhauled', 'overversaw', 'participated', 'partnered', 'performed',
  'persuaded', 'pitched', 'positioned', 'predicted', 'prepared',
  'presented', 'prevented', 'processed', 'programmed', 'projected',
  'published', 'purchased', 'qualified', 'quantified', 'recommended',
  'reconciled', 'recruited', 'redesigned', 'regulated', 'rehabilitated',
  'reinforced', 'remodeled', 'rendered', 'reorganized', 'reported',
  'represented', 'researched', 'restored', 'restructured', 'retrieved',
  'reviewed', 'revised', 'revitalized', 'routed', 'safeguarded',
  'screened', 'secured', 'selected', 'shaped', 'simplified', 'solved',
  'sparked', 'specified', 'standardized', 'steered', 'stimulated',
  'strategized', 'strengthened', 'structured', 'succeeded', 'suggested',
  'supplied', 'supported', 'surpassed', 'sustained', 'synthesized',
  'systematized', 'targeted', 'taught', 'tested', 'tracked', 'traded',
  'translated', 'troushot', 'unified', 'updated', 'utilized', 'validated',
  'verified', 'visualized', 'won', 'wrote'
];

export const analyzeResume = (data: ResumeData): ATSResult => {
  let score = 0;
  const good: string[] = [];
  const improvements: string[] = [];

  // 1. Contact Info (15 points)
  if (data.personalInfo.email && data.personalInfo.email.includes('@')) {
    score += 5;
    good.push('Email address is included.');
  } else {
    improvements.push('Add a valid professional email address.');
  }

  if (data.personalInfo.phone && data.personalInfo.phone.length >= 7) {
    score += 5;
    good.push('Phone number is included.');
  } else {
    improvements.push('Add a valid phone number for recruiters to reach you.');
  }

  const hasLinkedIn = data.personalInfo.links?.some(l => 
    l.label.toLowerCase().includes('linkedin') || l.url.toLowerCase().includes('linkedin')
  );
  if (hasLinkedIn) {
    score += 5;
    good.push('LinkedIn profile is linked.');
  } else {
    improvements.push('Add a LinkedIn profile to your contact links.');
  }

  // 2. Summary (10 points)
  const summaryText = data.personalInfo.summary?.toLowerCase() || '';
  if (summaryText.length > 0) {
    score += 4;
    
    if (summaryText.length > 150) {
      score += 3;
      good.push('Professional summary is detailed and comprehensive.');
    } else {
      improvements.push('Expand your professional summary to at least 3-4 sentences (150+ characters).');
    }

    // Check if summary contains skills
    if (data.skills.length > 0) {
      const hasSkillsInSummary = data.skills.some(skill => 
        skill.name.length > 2 && summaryText.includes(skill.name.toLowerCase())
      );
      if (hasSkillsInSummary) {
        score += 3;
        good.push('Professional summary effectively incorporates your listed skills.');
      } else {
        improvements.push('Incorporate some of your key skills into your professional summary.');
      }
    } else {
      improvements.push('Add skills to your resume and mention them in your summary.');
    }
  } else {
    improvements.push('Add a professional summary to highlight your key qualifications.');
  }

  // 3. Experience (45 points)
  const expCount = data.experience.length;
  if (expCount > 0) {
    score += 5;
    good.push('Work experience section is present.');

    let rolesWithGoodLength = 0;
    let rolesWithActionVerbs = 0;
    let rolesWithMetrics = 0;
    let allExpText = '';

    data.experience.forEach(exp => {
      const desc = exp.description || '';
      allExpText += desc.toLowerCase() + ' ';

      if (desc.length >= 100) rolesWithGoodLength++;

      const lowerDesc = desc.toLowerCase();
      
      // Check for at least 2 action verbs per role for better scoring
      const verbsFound = ACTION_VERBS.filter(verb => lowerDesc.includes(verb));
      if (verbsFound.length >= 1) {
        rolesWithActionVerbs++;
      }

      // Improved metrics detection: looks for %, $, or numbers that aren't just years (like 2023)
      // Matches numbers followed by +, k, m, %, or preceded by $, or numbers that are 1-3 digits long (like "increased by 20")
      const hasMetrics = /(?:%|\$|#)|(?:\b\d{1,3}\b(?!\s*(?:st|nd|rd|th|year|years|month|months|day|days)))|(?:\b\d+(?:k|m|b)\b)/i.test(desc);
      if (hasMetrics) {
        rolesWithMetrics++;
      }
    });

    // Detail Length (10 points)
    if (rolesWithGoodLength === expCount) {
      score += 10;
      good.push('All experience descriptions are sufficiently detailed.');
    } else if (rolesWithGoodLength > 0) {
      score += 5;
      improvements.push('Add more detail to some of your work experience descriptions (aim for 100+ characters each).');
    } else {
      improvements.push('Your work experience descriptions are too brief. Add more details and bullet points.');
    }

    // Action Verbs (10 points)
    if (rolesWithActionVerbs === expCount) {
      score += 10;
      good.push('Strong action verbs used in all experience descriptions.');
    } else if (rolesWithActionVerbs > 0) {
      score += 5;
      improvements.push('Use strong action verbs (e.g., "Developed", "Managed") in ALL your experience entries.');
    } else {
      improvements.push('Start bullet points with strong action verbs to make your impact clear.');
    }

    // Metrics (10 points)
    if (rolesWithMetrics === expCount) {
      score += 10;
      good.push('Achievements are quantified with metrics in all roles.');
    } else if (rolesWithMetrics > 0) {
      score += 5;
      improvements.push('Try to quantify achievements (using numbers, %, $) in all of your roles, not just some.');
    } else {
      improvements.push('Quantify your achievements using numbers, percentages, or dollar amounts.');
    }

    // Skill Contextualization (10 points)
    if (data.skills.length > 0) {
      const skillsInExp = data.skills.filter(skill => 
        skill.name.length > 2 && allExpText.includes(skill.name.toLowerCase())
      );
      const skillMatchRatio = skillsInExp.length / data.skills.length;

      if (skillMatchRatio >= 0.4) {
        score += 10;
        good.push('Excellent contextualization! Many of your listed skills are backed up in your experience descriptions.');
      } else if (skillMatchRatio > 0) {
        score += 5;
        improvements.push('Mention more of your listed skills within your experience descriptions to prove your proficiency.');
      } else {
        improvements.push('None of your listed skills appear in your experience section. ATS systems look for skills used in context.');
      }
    } else {
      improvements.push('Add skills and mention them in your experience descriptions for better ATS matching.');
    }

  } else {
    improvements.push('Add your work experience. If you are a student, include internships or relevant projects.');
  }

  // 4. Education (10 points)
  if (data.education.length > 0) {
    score += 10;
    good.push('Education section is present.');
  } else {
    improvements.push('Add your educational background.');
  }

  // 5. Skills (10 points)
  if (data.skills.length > 0) {
    score += 3;
    if (data.skills.length >= 10) {
      score += 7;
      good.push('Strong number of skills listed for optimal ATS keyword matching.');
    } else if (data.skills.length >= 5) {
      score += 3;
      improvements.push('Add a few more skills (aim for 10+) to maximize ATS keyword matching.');
    } else {
      improvements.push('Add more skills (aim for at least 5-10) to improve ATS keyword matching.');
    }
  } else {
    improvements.push('Add a skills section with relevant keywords from your target job descriptions.');
  }

  // 6. Projects/Certifications (10 points)
  if (data.projects.length > 0 || data.certifications.length > 0) {
    score += 10;
    good.push('Additional sections (Projects/Certifications) add value to your profile.');
  } else {
    improvements.push('Consider adding Projects or Certifications to stand out.');
  }

  // Ensure score doesn't exceed 100 (floating point safety)
  score = Math.min(100, Math.max(0, Math.round(score)));

  return { score, good, improvements };
};

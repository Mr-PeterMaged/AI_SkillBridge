# SkillBridge AI Proposal

## Project

**SkillBridge AI** is a career readiness copilot for students and fresh graduates. It
turns "I don't know what I'm missing" into a clear, evidence-based plan: a readiness
score, a prioritized list of skill gaps, a personalized learning roadmap, and the
practical proof (projects, evidence, a tailored CV) needed to close those gaps.

## Team

**Apex Innovators**

## Impact Area

Education and employability.

## Problem

Many university students and fresh graduates do not know why they are not ready for a
target role or what they should learn next. They follow random courses with no clear
connection to actual job requirements, while employers expect practical technical and
soft skills that may not be visible anywhere in a student's CV.

Even students who do the right learning often struggle to prove it: a course
certificate is not evidence of skill, and most students have no structured way to turn
what they've learned into a project, a CV bullet, or something a recruiter can verify.

SkillBridge AI turns this confusing gap into a clear, actionable, and provable plan.

## Solution

SkillBridge AI compares a student's CV or profile text with a real job description,
extracts structured skills on both sides, highlights matched, partial, and missing
requirements, and calculates a transparent, deterministic readiness score. From there
it generates a personalized multi-week learning roadmap, adjusted to how many hours per
week the student can realistically commit.

Beyond the initial analysis, the platform supports the full cycle of closing a skill
gap:

- **Portfolio Project Builder** — AI-suggested project ideas tied directly to a
  student's specific missing skills, with GitHub/deliverable checklists.
- **Evidence Builder & Reassessment** — students log real evidence (repos, live demos,
  case studies, written reflections) against specific skills, and can reassess their
  readiness score to see it improve as they build proof, not just claim it.
- **Skill Quizzes** — short, skill-specific quizzes that check understanding beyond
  self-reported confidence.
- **Weekly Check-ins** — a lightweight adaptive loop that adjusts the roadmap based on
  actual weekly progress instead of the original static plan.
- **Resume Builder** — turns logged evidence into honest, specific CV bullet points.
- **Job Application Tracker** — a simple place to track where a student has applied and
  what stage each application is at.

The roadmap and every recommendation focus on practical, honest skill development and
portfolio evidence — never fabricated credentials or claims.

## AI Usage

AI (Google Gemini) is used strictly for extraction and generation, never for scoring:

- Extract technical and soft skills from the user's CV or profile text.
- Extract structured requirements from a target job description.
- Generate a personalized, multi-week learning roadmap and curated resource suggestions.
- Suggest practical mini-projects that help the user prove specific missing skills
  honestly.

The readiness score itself is computed by **deterministic application logic**, not by
the AI model — the same inputs always produce the same score, and the score can be
audited and explained. This separation is a core design principle: AI proposes,
code decides. The readiness indicator is educational guidance only and should never be
treated as a hiring decision.

## Target Users

- University students.
- Fresh graduates.
- Junior job seekers across software, design, data, marketing, and IT/support roles.
- Bootcamp learners.
- University career centers and mentors.

## Supported Roles

SkillBridge AI launched with 3 roles and has since expanded to a growing, hand-curated
role library spanning multiple career tracks — each with its own skill rubric,
priorities, portfolio project ideas, curated resources, and job description template
(not a generic keyword list):

- **Software Development** — Junior Frontend Developer, Junior Backend Developer, Full
  Stack Developer, Mobile App Developer.
- **Quality & DevOps** — QA/Test Engineer, DevOps Engineer, Cloud Engineer.
- **Data** — Junior Data Analyst, Data Engineer.
- **Design** — UI/UX Designer.
- **Marketing & Growth** — Digital Marketing Specialist.
- **Security** — Cybersecurity Analyst.
- **Product & Program** — Product Manager.
- **Content & Documentation** — Technical Writer.
- **IT & Support** — IT Support Specialist.

The role library is being expanded further, with the explicit goal of covering the
breadth of roles a computer science or tech-adjacent student might realistically target
— not just software engineering job titles.

## Monetization

SkillBridge AI offers a Free tier (one analysis per month, a locked roadmap preview)
alongside paid tiers (Starter, Pro, Annual, and a one-time Job Sprint package) that
unlock the full roadmap, Portfolio Evidence Builder, reassessment, and unlimited
analyses under a fair-use policy. Payment is currently verified manually through
InstaPay while the platform validates demand before integrating an automated payment
processor, with promo codes and an ambassador/referral program to support
partner-driven growth (university clubs, mentors, and student communities).

## Expected Impact

SkillBridge AI helps learners understand what employers need, what skills they already
have, what skills they are missing, and what projects they can build — with real,
verifiable evidence — to close the gap between education and employment.

## Safety and Ethics

SkillBridge AI provides educational career guidance only. It does not guarantee
employment, make hiring decisions, or encourage users to fabricate skills, credentials,
projects, or work experience. Every feature that touches evidence or CV content is
designed to make honest proof easier to produce, never to manufacture false claims.

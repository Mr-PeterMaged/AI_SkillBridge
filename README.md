# SkillBridge AI

> **Career Readiness Copilot for Students and Fresh Graduates**

> Bridging the gap between what students know and what employers need.

SkillBridge AI is an AI-powered career readiness platform that compares a student's CV with a real job description, identifies skill gaps, calculates a transparent readiness indicator, and creates a personalized four-week learning roadmap with practical projects and portfolio evidence.

> SkillBridge AI provides educational career guidance. It does not make hiring decisions, guarantee employment, or recommend fabricating skills or experience.

## Repository Documents

| Document | Description |
|---|---|
| [Proposal](./PROPOSAL.md) | Project problem, solution, AI usage, audience, and impact summary. |
| [Business Model Canvas](./BMC.md) | BMC summary for partners, judges, mentors, and future pilots. |
| [License](./LICENSE.md) | Proprietary ownership and permitted reference-use terms. |

## Project Overview

SkillBridge AI helps students and fresh graduates move from vague career advice to a practical, evidence-driven learning plan. A user uploads a CV or pastes profile text, adds a target job description, reviews AI-extracted skills, and receives a deterministic readiness indicator with matched, partial, and missing skills.

The MVP focuses on three initial roles: Junior Frontend Developer, Junior Backend Developer, and Junior Data Analyst.

## Key Features

- CV upload or pasted profile text.
- Job description input and role templates.
- AI-powered structured skill extraction.
- User review and correction of extracted skills.
- Deterministic readiness indicator.
- Matched, partial, and missing skills.
- Critical / important / nice-to-have priorities.
- Personalized 4-week roadmap.
- Practical mini-project recommendations.
- GitHub, portfolio, and live-demo evidence tracking.
- Privacy controls and analysis deletion.
- Initial roles: Junior Frontend Developer, Junior Backend Developer, and Junior Data Analyst.

## How It Works

```text
CV / Profile + Job Description
            ↓
Structured Skill Extraction
            ↓
User Review and Correction
            ↓
Skill-Gap Analysis and Readiness Indicator
            ↓
4-Week Learning Roadmap
            ↓
Mini-Projects and Portfolio Evidence
```

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS, shadcn/ui, Radix UI, lucide-react |
| Authentication | Clerk |
| Database | PostgreSQL on Neon |
| ORM | Prisma |
| AI | Google Gemini API with Structured Output |
| Validation | Zod, React Hook Form |
| CV Parsing | unpdf for PDF and mammoth for DOCX |
| Deployment | Vercel |

## Architecture

```text
Client Application
      ↓
Next.js Server Routes
      ↓
CV / Job Description Parsing
      ↓
Gemini Structured Skill Extraction
      ↓
Zod Validation + Curated Role Taxonomy
      ↓
Deterministic Readiness Score Engine
      ↓
Neon PostgreSQL via Prisma
      ↓
Personalized Roadmap and Evidence Tracking
```

## Product Architecture Notes

- The readiness score is computed by deterministic TypeScript logic, not by the AI model.
- Gemini is used for structured extraction and roadmap generation, with responses validated through Zod before persistence.
- Users review extracted skills before scoring so incorrect extractions can be corrected.
- API routes check authentication and scope analysis data to the signed-in user.
- CV and job-description parsing happens server-side.

## Local Setup

### Prerequisites

- Node.js 20+
- A PostgreSQL database, such as [Neon](https://neon.tech)
- A [Clerk](https://clerk.com) application
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Run Locally

```bash
git clone https://github.com/Mr-PeterMaged/AI_SkillBridge.git
cd AI_SkillBridge
npm install
cp .env.example .env.local
npx prisma migrate dev
npm run dev
```

The app runs at:

```text
http://localhost:3000
```

## Environment Variables

Create `.env.local` from `.env.example` and fill in your local values. Never commit `.env`, `.env.local`, production credentials, API keys, tokens, passwords, database URLs, or user data.

```env
DATABASE_URL=
GEMINI_API_KEY=
GEMINI_MODEL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
```

## Privacy and AI Safety

- CVs and job descriptions may include personal data, so they should be handled as sensitive user content.
- Files are parsed server-side, and API keys must remain server-side only.
- Users should be able to delete their analyses and related stored data.
- The platform should not use user data to train a public model.
- The readiness indicator is educational guidance only, not a hiring decision.
- AI suggestions should never invent credentials, projects, work experience, education, or achievements.
- SkillBridge AI should recommend honest portfolio evidence: projects, repositories, demos, case studies, and learning artifacts the user can actually build.

## Roadmap

- [x] Core project architecture.
- [x] CV and job-description analysis workflow.
- [x] Skill-gap analysis and readiness indicator.
- [x] Initial role templates.
- [x] Roadmap progress tracking.
- [ ] Portfolio evidence review.
- [ ] Arabic interface and bilingual CV testing.
- [ ] PDF report export.
- [ ] InterviewAI integration for interview practice.
- [ ] University career-center dashboard.
- [ ] Expanded role templates and learning-resource library.

## Demo Scenario

A synthetic Junior Frontend Developer candidate with HTML, CSS, JavaScript, React, Git, and one dashboard project can be evaluated against a job description requiring TypeScript, REST API integration, testing, deployment, and Next.js/Tailwind experience.

Expected output:

- A readiness indicator based on critical, important, and evidence coverage.
- Matched skills such as HTML, CSS, JavaScript, React, and Git.
- Skill gaps such as TypeScript, REST APIs, testing, and deployment.
- A four-week roadmap with a practical project that can produce GitHub, portfolio, and live-demo evidence.

## Known MVP Limitations

- The current role taxonomy is intentionally limited to three launch roles.
- Arabic CV and job-description input has not been fully tested end-to-end.
- PDF parsing may not work for scanned or image-only PDFs.
- Payment and university administration workflows are outside the current MVP.

## Team

Built by **Apex Innovators**.

| Name | Role |
|---|---|
| Peter Maged Wadie Markos | Team Leader |
| Yahia Waleed Elmaghraby | Team Member |
| Hassan Waleed Elmaghraby | Team Member |
| Hussein Waleed Elmaghraby | Team Member |

## Contact

For feedback, collaboration, university pilots, or partnership opportunities:

- **Project Lead:** Peter Maged Wadie Markos
- **Email:** petermaged.20187@gmail.com
- **GitHub:** [@Mr-PeterMaged](https://github.com/Mr-PeterMaged)
- **Portfolio:** [petermaged.com](https://petermaged.com)

## Support SkillBridge AI

Are you a student, mentor, career center, bootcamp, or employer?

- Try SkillBridge AI and share feedback.
- Help us validate role requirements and learning roadmaps.
- Partner with us to run a student career-readiness pilot.
- Contribute role templates, project ideas, or curated learning resources.

> We are building a clearer path from education to employment—one skill, one project, and one opportunity at a time.

## Contributing

SkillBridge AI is not open source, but feedback and collaboration proposals are welcome.

- Open an issue for bugs or ideas.
- Fork the repository only for permitted evaluation or collaboration work.
- Create a feature branch for proposed changes.
- Submit a pull request with a clear description.
- Never commit secrets or personal user data.

## License and Ownership

Copyright © 2026 **Apex Innovators**. All rights reserved.

This repository is shared for portfolio, hackathon evaluation, and educational reference.
It is not open source. Reuse, redistribution, commercial deployment, or derivative work
requires prior written permission from Apex Innovators.

See [LICENSE.md](./LICENSE.md) for full terms.

## Acknowledgments

SkillBridge AI is being developed as an education-impact project by Apex Innovators.

We appreciate the students, mentors, educators, career-service professionals, and developer communities whose feedback helps shape a more practical path from learning to employment.

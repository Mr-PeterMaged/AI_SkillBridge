import { RoleTemplate } from "./types";

export const fullStackDeveloper: RoleTemplate = {
  id: "FULL_STACK_DEVELOPER",
  category: "Software Development",
  label: "Full Stack Developer",
  shortLabel: "Full Stack",
  description:
    "Builds both the user-facing interface and the server/database layer behind it, and connects the two end to end.",
  skills: [
    // --- Critical ---
    { canonicalName: "JavaScript", aliases: ["JS", "Javascript", "ES6"], category: "technical", priority: "critical", whyItMatters: "The one language that spans both the frontend and a Node backend.", learningObjective: "Write both client-side and server-side logic confidently.", estimatedHours: 8, suggestedProof: "A small full-stack app with a JS frontend and JS backend." },
    { canonicalName: "React", aliases: ["ReactJS", "React.js"], category: "technical", priority: "critical", whyItMatters: "The default choice for the UI layer in most full-stack job postings.", learningObjective: "Build component-driven UIs that consume your own API.", estimatedHours: 10, suggestedProof: "A React frontend wired to a real backend you built." },
    { canonicalName: "APIs", aliases: ["API Development", "Building APIs", "REST APIs"], category: "technical", priority: "critical", whyItMatters: "Full-stack work means designing the contract both sides of the app agree on.", learningObjective: "Design and consume endpoints end to end, from database to UI.", estimatedHours: 6, suggestedProof: "A working API with a frontend that calls every endpoint." },
    { canonicalName: "Databases", aliases: ["Database Design", "Relational Databases"], category: "technical", priority: "critical", whyItMatters: "Full-stack developers own the data model, not just the screens on top of it.", learningObjective: "Design normalized tables and connect them to a real application.", estimatedHours: 6, suggestedProof: "A schema plus a running app that reads and writes to it." },
    { canonicalName: "SQL", aliases: ["Structured Query Language"], category: "technical", priority: "critical", whyItMatters: "Needed to query and reason about the data your app persists.", learningObjective: "Write joins and aggregations against your own application's data.", estimatedHours: 5, suggestedProof: "A feature backed by a non-trivial SQL query you wrote yourself." },
    { canonicalName: "Git", aliases: ["Git/GitHub", "Version Control"], category: "tool", priority: "critical", whyItMatters: "Every engineering team collaborates through Git; it's assumed knowledge.", learningObjective: "Branch, commit clearly, and open pull requests across a full-stack codebase.", estimatedHours: 3, suggestedProof: "A public GitHub profile with regular, well-described commits." },
    { canonicalName: "Authentication Basics", aliases: ["Auth", "JWT", "Sessions"], category: "technical", priority: "critical", whyItMatters: "Almost every real product needs to know who is using it, on both ends.", learningObjective: "Implement login end to end: hashed passwords, tokens, and protected UI routes.", estimatedHours: 5, suggestedProof: "An app with working signup/login and a protected page that requires it." },
    // --- Important ---
    { canonicalName: "Node.js", aliases: ["Express", "Express.js", "NestJS"], category: "technical", priority: "important", whyItMatters: "The most common backend runtime for JS-based full-stack roles.", learningObjective: "Build a REST API with a Node framework and connect it to a database.", estimatedHours: 6, suggestedProof: "An Express (or similar) API with routing, middleware, and DB access." },
    { canonicalName: "TypeScript", aliases: ["TS"], category: "technical", priority: "important", whyItMatters: "Shared types between frontend and backend reduce whole classes of bugs.", learningObjective: "Type both your API contracts and your UI components.", estimatedHours: 6, suggestedProof: "A project with typed API responses consumed by typed React components." },
    { canonicalName: "PostgreSQL", aliases: ["Postgres"], category: "tool", priority: "important", whyItMatters: "The most widely used production-grade relational database.", learningObjective: "Model and query real application data in Postgres.", estimatedHours: 4, suggestedProof: "A project connected to a live Postgres database (e.g. via Neon)." },
    { canonicalName: "Testing", aliases: ["Unit Testing", "Integration Testing", "Jest"], category: "technical", priority: "important", whyItMatters: "Shows you can ship both layers of an app without silent breakage.", learningObjective: "Write tests covering both an API endpoint and a UI component.", estimatedHours: 5, suggestedProof: "A test suite with at least one backend and one frontend test." },
    { canonicalName: "Deployment", aliases: ["Hosting", "Vercel Deployment", "Full-Stack Deployment"], category: "tool", priority: "important", whyItMatters: "A project only counts as proof if someone else can open and use it.", learningObjective: "Deploy both the frontend and backend so the full app works publicly.", estimatedHours: 3, suggestedProof: "A live URL where the whole app (UI + API + DB) works end to end." },
    { canonicalName: "State Management", aliases: ["useState", "Context API", "Redux", "Zustand"], category: "technical", priority: "important", whyItMatters: "Full-stack apps need to keep server data and UI state in sync.", learningObjective: "Manage server data and local UI state without prop-drilling everywhere.", estimatedHours: 5, suggestedProof: "A project using a state library or data-fetching cache tied to your API." },
    // --- Nice to have ---
    { canonicalName: "Next.js", aliases: ["NextJS"], category: "technical", priority: "nice_to_have", whyItMatters: "A single framework that covers both the frontend and API layer.", learningObjective: "Build routed pages plus API routes in one Next.js project.", estimatedHours: 6, suggestedProof: "A Next.js project with both UI routes and API routes, deployed." },
    { canonicalName: "Docker", aliases: ["Containerization"], category: "tool", priority: "nice_to_have", whyItMatters: "Standard for making a full-stack app's services portable and reproducible.", learningObjective: "Containerize a full-stack app's backend (and optionally frontend).", estimatedHours: 4, suggestedProof: "A Dockerfile (or docker-compose) that runs the project locally." },
    { canonicalName: "CI/CD", aliases: ["GitHub Actions", "Continuous Integration"], category: "tool", priority: "nice_to_have", whyItMatters: "Signals awareness of how real teams ship both layers of an app safely.", learningObjective: "Set up a pipeline that tests and deploys on every push.", estimatedHours: 3, suggestedProof: "A green CI badge in a GitHub README." },
    { canonicalName: "System Design Basics", aliases: ["Scalability Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "Full-stack developers are expected to reason about the whole system, not one layer.", learningObjective: "Explain the tradeoffs of a simple end-to-end architecture.", estimatedHours: 4, suggestedProof: "A one-page diagram of your app's architecture with a short write-up." },
  ],
  projects: [
    {
      title: "Full-Stack Job Application Tracker",
      description:
        "A Next.js + TypeScript app with a Postgres-backed API: users sign up, add job applications, and track status. Covers the full stack from schema to deployed UI in one deliverable.",
      requiredSkills: ["React", "APIs", "Databases", "Authentication Basics", "Deployment"],
      deliverables: ["Deployed live demo URL", "Public GitHub repo with README", "A working signup/login flow"],
      githubChecklist: [
        "README explains the stack and how to run it locally, frontend and backend",
        "Environment variables documented in .env.example, not committed",
        "Live demo link at the top of the README",
        "Commit history shows incremental full-stack progress",
      ],
    },
    {
      title: "Community Notes / Bookmarking App",
      description:
        "A small social app (React frontend, Node/Express or Next.js API routes, Postgres) where users can post and browse short notes or links, demonstrating CRUD across the whole stack.",
      requiredSkills: ["Node.js", "SQL", "PostgreSQL", "State Management"],
      deliverables: ["Deployed live demo URL", "Public GitHub repo", "A seeded database with sample data"],
      githubChecklist: [
        "README documents the data model and every endpoint",
        "Handles empty/loading/error states in the UI",
        "Seed script to populate sample data for reviewers",
      ],
    },
  ],
  resources: [
    { title: "React official docs — Learn React", url: "https://react.dev/learn", skill: "React" },
    { title: "Node.js official Guides", url: "https://nodejs.org/en/docs/guides", skill: "Node.js" },
    { title: "Next.js documentation", url: "https://nextjs.org/docs", skill: "Next.js" },
    { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", skill: "PostgreSQL" },
    { title: "JWT Introduction", url: "https://jwt.io/introduction", skill: "Authentication Basics" },
    { title: "TypeScript for JS Programmers", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html", skill: "TypeScript" },
    { title: "Docker Get Started", url: "https://docs.docker.com/get-started/", skill: "Docker" },
  ],
  cvEvidenceExamples: [
    "Built and deployed a full-stack job tracker (Next.js, PostgreSQL, JWT auth) from schema design to production UI.",
    "Designed a REST API and the React frontend that consumes it for a community notes app, covered by tests on both ends.",
    "Migrated a JavaScript full-stack project to TypeScript end to end, sharing types between the API and the UI.",
  ],
  jobDescriptionTemplate: `Full Stack Developer

We're looking for a Full Stack Developer who can own a feature from database to UI.

Requirements:
- Solid JavaScript, comfortable on both frontend and backend
- Experience building UIs with React
- Experience building and consuming REST APIs
- Understanding of relational databases and SQL
- Familiarity with Git and collaborative workflows
- Basic understanding of authentication

Nice to have:
- TypeScript across the stack
- Next.js
- Docker and CI/CD exposure
- Basic system design awareness`,
};

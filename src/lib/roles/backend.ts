import { RoleTemplate } from "./types";

export const juniorBackendDeveloper: RoleTemplate = {
  id: "JUNIOR_BACKEND_DEVELOPER",
  category: "Software Development",
  label: "Junior Backend Developer",
  shortLabel: "Backend",
  description:
    "Builds and maintains server-side logic, APIs, and databases that power applications.",
  skills: [
    // --- Critical ---
    { canonicalName: "JavaScript", aliases: ["JS", "Node.js basics", "TypeScript backend"], category: "technical", priority: "critical", whyItMatters: "The most common language for junior backend roles alongside Python.", learningObjective: "Write server-side logic and handle async I/O confidently.", estimatedHours: 8, suggestedProof: "A small script or API that reads/writes data asynchronously." },
    { canonicalName: "Python", aliases: ["Python3"], category: "technical", priority: "critical", whyItMatters: "One of the two dominant backend languages for junior roles.", learningObjective: "Write clean, tested Python functions and scripts.", estimatedHours: 8, suggestedProof: "A Python service or script with tests." },
    { canonicalName: "APIs", aliases: ["API Development", "Building APIs"], category: "technical", priority: "critical", whyItMatters: "Backend engineers spend most of their time designing and exposing APIs.", learningObjective: "Build endpoints that accept input, validate it, and return structured responses.", estimatedHours: 6, suggestedProof: "A working API with at least 3 endpoints (GET/POST/PUT)." },
    { canonicalName: "Databases", aliases: ["Database Design", "Relational Databases"], category: "technical", priority: "critical", whyItMatters: "Almost every backend service persists data in a database.", learningObjective: "Design normalized tables and write queries to read/write them.", estimatedHours: 6, suggestedProof: "An ER diagram plus a working schema with seed data." },
    { canonicalName: "SQL", aliases: ["Structured Query Language"], category: "technical", priority: "critical", whyItMatters: "The universal language for querying relational data.", learningObjective: "Write joins, aggregations, and filtered queries confidently.", estimatedHours: 5, suggestedProof: "A set of queries answering real questions against a seeded database." },
    { canonicalName: "Git", aliases: ["Git/GitHub", "Version Control"], category: "tool", priority: "critical", whyItMatters: "Every engineering team collaborates through Git; it's assumed knowledge.", learningObjective: "Branch, commit clearly, and open pull requests.", estimatedHours: 3, suggestedProof: "A public GitHub profile with regular, well-described commits." },
    { canonicalName: "Authentication Basics", aliases: ["Auth", "JWT", "Sessions"], category: "technical", priority: "critical", whyItMatters: "Nearly every real API needs to know who is calling it.", learningObjective: "Implement a login flow using hashed passwords and tokens or sessions.", estimatedHours: 5, suggestedProof: "An API with working signup/login endpoints and protected routes." },
    // --- Important ---
    { canonicalName: "Node.js", aliases: ["Express", "Express.js", "NestJS"], category: "technical", priority: "important", whyItMatters: "The most common JS backend runtime/framework combo in junior postings.", learningObjective: "Build a REST API with a Node framework and middleware.", estimatedHours: 6, suggestedProof: "An Express (or similar) API with routing, middleware, and error handling." },
    { canonicalName: "FastAPI", aliases: ["Flask", "Django"], category: "technical", priority: "important", whyItMatters: "The most common Python backend framework family in junior postings.", learningObjective: "Build a REST API with a Python framework, including validation.", estimatedHours: 6, suggestedProof: "A FastAPI/Flask/Django API deployed with working docs (e.g. Swagger)." },
    { canonicalName: "PostgreSQL", aliases: ["Postgres"], category: "tool", priority: "important", whyItMatters: "The most widely used production-grade relational database.", learningObjective: "Model and query a real dataset in Postgres.", estimatedHours: 4, suggestedProof: "A project connected to a live Postgres database (e.g. via Neon)." },
    { canonicalName: "REST API Design", aliases: ["API Design"], category: "technical", priority: "important", whyItMatters: "Well-designed APIs are easier to consume, test, and maintain.", learningObjective: "Apply consistent naming, status codes, and versioning to an API.", estimatedHours: 3, suggestedProof: "API documentation showing consistent, RESTful endpoint design." },
    { canonicalName: "Testing", aliases: ["Unit Testing", "Integration Testing", "Pytest", "Jest"], category: "technical", priority: "important", whyItMatters: "Shows you can ship backend logic that doesn't silently break.", learningObjective: "Write unit and integration tests for API endpoints.", estimatedHours: 5, suggestedProof: "A test suite covering success and failure cases for at least 2 endpoints." },
    { canonicalName: "Deployment", aliases: ["Hosting", "Railway", "Render Deployment"], category: "tool", priority: "important", whyItMatters: "An API only counts as proof if it's reachable outside your machine.", learningObjective: "Deploy an API to a public host with environment variables configured.", estimatedHours: 3, suggestedProof: "A live, publicly callable API endpoint (e.g. via Postman)." },
    { canonicalName: "Security Basics", aliases: ["Input Validation", "OWASP Basics"], category: "technical", priority: "important", whyItMatters: "Junior developers are expected to avoid the most common vulnerabilities.", learningObjective: "Validate input and avoid SQL injection / plaintext secrets.", estimatedHours: 3, suggestedProof: "A short write-up of how your API validates input and stores secrets." },
    // --- Nice to have ---
    { canonicalName: "Docker", aliases: ["Containerization"], category: "tool", priority: "nice_to_have", whyItMatters: "Standard for making backend services portable and reproducible.", learningObjective: "Containerize an API with a Dockerfile.", estimatedHours: 4, suggestedProof: "A Dockerfile that builds and runs the project locally." },
    { canonicalName: "Redis", aliases: ["Caching"], category: "tool", priority: "nice_to_have", whyItMatters: "Common for caching and session storage in production backends.", learningObjective: "Cache a slow query or endpoint response.", estimatedHours: 3, suggestedProof: "A before/after latency comparison with and without caching." },
    { canonicalName: "CI/CD", aliases: ["GitHub Actions", "Continuous Integration"], category: "tool", priority: "nice_to_have", whyItMatters: "Signals awareness of how real teams ship backend code safely.", learningObjective: "Set up a pipeline that runs tests on every push.", estimatedHours: 3, suggestedProof: "A green CI badge in a GitHub README." },
    { canonicalName: "System Design Basics", aliases: ["Scalability Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "Shows early awareness of how systems scale beyond a single machine.", learningObjective: "Explain the tradeoffs of a simple system design (e.g. caching, load balancing).", estimatedHours: 4, suggestedProof: "A one-page write-up or diagram of a simple system design." },
    { canonicalName: "Cloud Fundamentals", aliases: ["AWS Basics", "GCP Basics"], category: "tool", priority: "nice_to_have", whyItMatters: "Most companies deploy to a cloud provider; basic fluency helps.", learningObjective: "Deploy or configure one resource on a cloud provider's free tier.", estimatedHours: 4, suggestedProof: "A screenshot of a deployed cloud resource plus a short explanation." },
  ],
  projects: [
    {
      title: "Task Management API",
      description:
        "A REST API (Node/Express or FastAPI) with authenticated users, PostgreSQL persistence, CRUD endpoints for tasks, and tests. Covers APIs, databases, auth, and testing in one deliverable.",
      requiredSkills: ["APIs", "Databases", "Authentication Basics", "Testing", "Deployment"],
      deliverables: ["Deployed public API URL", "Public GitHub repo with README", "Postman/Swagger collection"],
      githubChecklist: [
        "README documents every endpoint and how to run it locally",
        "Environment variables documented in .env.example, not committed",
        "At least 2 automated tests covering success and failure paths",
        "Live, callable deployment link",
      ],
    },
    {
      title: "Public Data Aggregator API",
      description:
        "An API that pulls data from a public source, stores it in PostgreSQL, and exposes filtered/aggregated endpoints — demonstrating SQL and API design skills.",
      requiredSkills: ["SQL", "PostgreSQL", "REST API Design"],
      deliverables: ["Deployed public API URL", "Public GitHub repo", "Sample queries in README"],
      githubChecklist: [
        "README with ER diagram or schema description",
        "Consistent REST naming and status codes",
        "Seed script to populate sample data",
      ],
    },
  ],
  resources: [
    { title: "Node.js official Guides", url: "https://nodejs.org/en/docs/guides", skill: "Node.js" },
    { title: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/", skill: "FastAPI" },
    { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", skill: "PostgreSQL" },
    { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", skill: "SQL" },
    { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", skill: "Security Basics" },
    { title: "Docker Get Started", url: "https://docs.docker.com/get-started/", skill: "Docker" },
    { title: "JWT Introduction", url: "https://jwt.io/introduction", skill: "Authentication Basics" },
  ],
  cvEvidenceExamples: [
    "Designed and deployed a REST API with JWT authentication and PostgreSQL persistence, covered by integration tests.",
    "Reduced average query latency by 40% by introducing Redis caching on a frequently-hit endpoint.",
    "Containerized a Node.js API with Docker and documented local setup for new contributors.",
  ],
  jobDescriptionTemplate: `Junior Backend Developer

We're looking for a Junior Backend Developer to help build and maintain our core APIs.

Requirements:
- Proficiency in JavaScript or Python
- Experience building REST APIs
- Understanding of relational databases and SQL
- Familiarity with Git and collaborative workflows
- Basic understanding of authentication

Nice to have:
- Node.js/Express or FastAPI/Django experience
- PostgreSQL experience
- Docker
- Awareness of basic system design and security practices`,
};

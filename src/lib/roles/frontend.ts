import { RoleTemplate } from "./types";

export const juniorFrontendDeveloper: RoleTemplate = {
  id: "JUNIOR_FRONTEND_DEVELOPER",
  label: "Junior Frontend Developer",
  shortLabel: "Frontend",
  description:
    "Builds user-facing web interfaces with HTML, CSS, JavaScript and a component framework, and integrates with backend APIs.",
  skills: [
    // --- Critical ---
    { canonicalName: "HTML", aliases: ["HTML5"], category: "technical", priority: "critical", whyItMatters: "The structural foundation of every web page.", learningObjective: "Write semantic, accessible HTML for real layouts.", estimatedHours: 4, suggestedProof: "A hand-built semantic page with no div-soup, validated with an HTML validator." },
    { canonicalName: "CSS", aliases: ["CSS3"], category: "technical", priority: "critical", whyItMatters: "Required to style and lay out any interface employers will ask you to build.", learningObjective: "Use Flexbox and Grid confidently to build responsive layouts.", estimatedHours: 6, suggestedProof: "A responsive layout screenshot at 3 breakpoints (mobile/tablet/desktop)." },
    { canonicalName: "JavaScript", aliases: ["JS", "Javascript", "Vanilla JS", "ES6"], category: "technical", priority: "critical", whyItMatters: "The language every frontend framework and interview question is built on.", learningObjective: "Manipulate the DOM, handle events, and work with async code (promises/fetch).", estimatedHours: 8, suggestedProof: "A small interactive app (to-do list, calculator) with no framework." },
    { canonicalName: "React", aliases: ["ReactJS", "React.js"], category: "technical", priority: "critical", whyItMatters: "The most requested frontend framework in junior job postings.", learningObjective: "Build component trees with props, state, hooks, and conditional rendering.", estimatedHours: 10, suggestedProof: "A multi-page React app deployed and linked from GitHub." },
    { canonicalName: "Git", aliases: ["Git/GitHub", "Version Control"], category: "tool", priority: "critical", whyItMatters: "Every engineering team collaborates through Git; it's assumed knowledge.", learningObjective: "Branch, commit with clear messages, open a pull request, resolve a merge conflict.", estimatedHours: 3, suggestedProof: "A public GitHub profile with regular, well-described commits." },
    { canonicalName: "REST APIs", aliases: ["REST API", "API Integration", "Fetch API", "Consuming APIs"], category: "technical", priority: "critical", whyItMatters: "Frontend apps are rarely static — you'll fetch and render real data on day one.", learningObjective: "Fetch data from a public API, handle loading/error/empty states.", estimatedHours: 5, suggestedProof: "A project that consumes a real API with visible loading and error handling." },
    // --- Important ---
    { canonicalName: "TypeScript", aliases: ["TS"], category: "technical", priority: "important", whyItMatters: "Most modern frontend codebases are typed; it catches bugs before runtime.", learningObjective: "Type components, props, and API responses.", estimatedHours: 6, suggestedProof: "A JavaScript component converted to TypeScript with no `any` types." },
    { canonicalName: "Responsive Design", aliases: ["Mobile-First Design", "Media Queries"], category: "technical", priority: "important", whyItMatters: "Most traffic to any product is mobile; layouts must adapt.", learningObjective: "Design layouts that adapt cleanly across screen sizes.", estimatedHours: 4, suggestedProof: "Side-by-side screenshots of one page at mobile and desktop widths." },
    { canonicalName: "Testing", aliases: ["Unit Testing", "Jest", "React Testing Library", "Vitest"], category: "technical", priority: "important", whyItMatters: "Shows you can ship code that doesn't silently break.", learningObjective: "Write unit tests for components covering normal, loading and error states.", estimatedHours: 5, suggestedProof: "A test suite with a coverage report screenshot." },
    { canonicalName: "Deployment", aliases: ["CI Deployment", "Hosting", "Vercel Deployment"], category: "tool", priority: "important", whyItMatters: "A project only counts as proof if someone else can open it in a browser.", learningObjective: "Deploy a project to a public URL (Vercel/Netlify).", estimatedHours: 2, suggestedProof: "A live, working deployment link in your README." },
    { canonicalName: "Accessibility", aliases: ["a11y", "ARIA"], category: "technical", priority: "important", whyItMatters: "Accessible UIs are a baseline expectation at most companies.", learningObjective: "Use semantic HTML and ARIA attributes so a screen reader can use your app.", estimatedHours: 3, suggestedProof: "A Lighthouse accessibility score screenshot above 90." },
    { canonicalName: "State Management", aliases: ["useState", "useReducer", "Context API", "Redux", "Zustand"], category: "technical", priority: "important", whyItMatters: "Real apps need to coordinate state across many components.", learningObjective: "Manage shared state across components without prop-drilling everywhere.", estimatedHours: 5, suggestedProof: "A project using Context or a state library for cross-component data." },
    // --- Nice to have ---
    { canonicalName: "Next.js", aliases: ["NextJS"], category: "technical", priority: "nice_to_have", whyItMatters: "Common in production React jobs; shows you can work in a real framework.", learningObjective: "Build routed pages with a mix of client and server components.", estimatedHours: 6, suggestedProof: "A Next.js project with at least 3 routed pages, deployed." },
    { canonicalName: "Tailwind CSS", aliases: ["TailwindCSS", "Tailwind"], category: "tool", priority: "nice_to_have", whyItMatters: "Widely used utility-first styling in modern frontend teams.", learningObjective: "Style a full page using utility classes without custom CSS files.", estimatedHours: 3, suggestedProof: "A page styled entirely with Tailwind, no separate CSS file." },
    { canonicalName: "CI/CD", aliases: ["GitHub Actions", "Continuous Integration"], category: "tool", priority: "nice_to_have", whyItMatters: "Signals awareness of how real teams ship code safely.", learningObjective: "Set up a GitHub Action that runs tests on every push.", estimatedHours: 3, suggestedProof: "A green CI badge in a GitHub README." },
    { canonicalName: "Performance Optimization", aliases: ["Web Performance", "Lighthouse"], category: "technical", priority: "nice_to_have", whyItMatters: "Differentiates candidates who ship fast, production-grade UIs.", learningObjective: "Diagnose and fix a slow page using Lighthouse.", estimatedHours: 3, suggestedProof: "Before/after Lighthouse performance score screenshots." },
  ],
  projects: [
    {
      title: "Job Application Tracker",
      description:
        "A Next.js + TypeScript app where users add job applications, fetch company data from a public API, track status, and persist state. Covers routing, API integration, typing, testing and deployment in one deliverable.",
      requiredSkills: ["React", "TypeScript", "REST APIs", "Testing", "Deployment"],
      deliverables: ["Deployed live demo URL", "Public GitHub repo with README", "At least 2 component tests"],
      githubChecklist: [
        "README explains the problem, stack, and how to run it locally",
        "Commit history shows incremental progress, not one giant commit",
        "Live demo link at the top of the README",
        "Screenshots or GIF of the working app",
      ],
    },
    {
      title: "Weather / Public-Data Dashboard",
      description:
        "A responsive dashboard that fetches from a free public API, shows loading/error/empty states, and is fully responsive and accessible.",
      requiredSkills: ["JavaScript", "React", "Responsive Design", "Accessibility"],
      deliverables: ["Deployed live demo URL", "Public GitHub repo", "Lighthouse accessibility screenshot"],
      githubChecklist: [
        "README with setup instructions",
        "Handles API failure gracefully (visible error state)",
        "Passes a basic accessibility check",
      ],
    },
  ],
  resources: [
    { title: "The Odin Project — Foundations", url: "https://www.theodinproject.com/", skill: "HTML" },
    { title: "CSS Flexbox & Grid — web.dev", url: "https://web.dev/learn/css", skill: "CSS" },
    { title: "JavaScript.info", url: "https://javascript.info/", skill: "JavaScript" },
    { title: "React official docs — Learn React", url: "https://react.dev/learn", skill: "React" },
    { title: "TypeScript for JS Programmers", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html", skill: "TypeScript" },
    { title: "Testing Library docs", url: "https://testing-library.com/docs/", skill: "Testing" },
    { title: "Vercel Deployment docs", url: "https://vercel.com/docs", skill: "Deployment" },
    { title: "web.dev — Accessibility", url: "https://web.dev/learn/accessibility", skill: "Accessibility" },
  ],
  cvEvidenceExamples: [
    "Built and deployed a React + TypeScript job tracker consuming a public REST API, with unit tests and CI.",
    "Converted a legacy JavaScript component library to TypeScript, reducing runtime type errors.",
    "Improved Lighthouse accessibility score from 62 to 96 on a production landing page.",
  ],
  jobDescriptionTemplate: `Junior Frontend Developer

We're looking for a Junior Frontend Developer to join our product team.

Requirements:
- Solid understanding of HTML, CSS, and JavaScript
- Experience building UIs with React
- Familiarity with Git and collaborative workflows
- Comfortable consuming REST APIs

Nice to have:
- TypeScript
- Experience with responsive design and accessibility
- Basic testing experience (Jest/RTL)
- Next.js or Tailwind CSS
- Exposure to CI/CD pipelines`,
};

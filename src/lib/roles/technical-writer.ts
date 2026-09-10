import { RoleTemplate } from "./types";

export const technicalWriter: RoleTemplate = {
  id: "TECHNICAL_WRITER",
  category: "Content & Documentation",
  label: "Technical Writer",
  shortLabel: "Tech Writer",
  description:
    "Turns complex technical systems into documentation that developers and users can actually understand and use.",
  skills: [
    // --- Critical ---
    { canonicalName: "Technical Writing Fundamentals", aliases: ["Clear Writing", "Plain Language"], category: "technical", priority: "critical", whyItMatters: "The core skill of the role: explaining something complex in the clearest possible way.", learningObjective: "Write instructions a stranger could follow successfully on the first try.", estimatedHours: 5, suggestedProof: "A how-to guide tested on someone unfamiliar with the topic, revised from their feedback." },
    { canonicalName: "API Documentation", aliases: ["API Docs", "Reference Docs"], category: "technical", priority: "critical", whyItMatters: "One of the most requested and highest-value forms of technical documentation.", learningObjective: "Document a real API's endpoints clearly enough for a developer to integrate without help.", estimatedHours: 6, suggestedProof: "API reference documentation for a real or public API, with working examples." },
    { canonicalName: "Markdown / Docs-as-Code", aliases: ["Markdown", "Docs-as-Code"], category: "tool", priority: "critical", whyItMatters: "Most modern documentation is written and versioned like code, in Markdown.", learningObjective: "Write and structure documentation using Markdown and a docs-as-code workflow.", estimatedHours: 3, suggestedProof: "A documentation set written in Markdown and tracked in a Git repo." },
    { canonicalName: "Information Architecture for Docs", aliases: ["Docs Structure", "Navigation Design"], category: "technical", priority: "critical", whyItMatters: "Even great content fails if readers can't find it.", learningObjective: "Organize a documentation set so readers can find what they need quickly.", estimatedHours: 4, suggestedProof: "A documentation site map or nav structure with a rationale for the grouping." },
    { canonicalName: "Editing & Style Guides", aliases: ["Copyediting", "Style Consistency"], category: "technical", priority: "critical", whyItMatters: "Consistency across a docs set is what makes it feel trustworthy and professional.", learningObjective: "Apply a style guide consistently across multiple documents.", estimatedHours: 3, suggestedProof: "Before/after edits of a document brought into line with a style guide." },
    { canonicalName: "Git", aliases: ["Git/GitHub", "Version Control"], category: "tool", priority: "critical", whyItMatters: "Docs-as-code workflows require the same version control as application code.", learningObjective: "Branch, commit, and open pull requests for documentation changes.", estimatedHours: 3, suggestedProof: "A public GitHub repo with a documentation project and clear commit history." },
    // --- Important ---
    { canonicalName: "Documentation Tooling", aliases: ["Docusaurus", "GitBook", "MkDocs"], category: "tool", priority: "important", whyItMatters: "Most teams publish docs through a dedicated static-site tool, not raw files.", learningObjective: "Build and publish a documentation site using a real docs tool.", estimatedHours: 5, suggestedProof: "A published documentation site built with Docusaurus, GitBook, or similar." },
    { canonicalName: "Basic Coding Literacy", aliases: ["Reading Code for Docs"], category: "technical", priority: "important", whyItMatters: "Writers who can read code write far more accurate developer documentation.", learningObjective: "Read and correctly summarize what a code sample does.", estimatedHours: 5, suggestedProof: "Documentation that correctly explains a real code sample you didn't write." },
    { canonicalName: "User-Centered Writing", aliases: ["Audience Analysis"], category: "technical", priority: "important", whyItMatters: "The same feature needs different explanations for beginners vs. experienced users.", learningObjective: "Write the same concept differently for two distinct audiences.", estimatedHours: 3, suggestedProof: "Two versions of the same doc written for different audience skill levels." },
    { canonicalName: "Diagramming", aliases: ["Mermaid", "draw.io"], category: "tool", priority: "important", whyItMatters: "Some concepts are explained far faster with a diagram than a paragraph.", learningObjective: "Create a diagram that clarifies a process or architecture.", estimatedHours: 3, suggestedProof: "A diagram embedded in documentation that clarifies a real process." },
    { canonicalName: "Interviewing Subject-Matter Experts", aliases: ["SME Interviews"], category: "soft", priority: "important", whyItMatters: "Writers rarely build the systems they document; getting accurate info from engineers is a skill.", learningObjective: "Extract accurate, complete information from a technical expert.", estimatedHours: 3, suggestedProof: "Documentation produced from notes taken during a real SME interview." },
    // --- Nice to have ---
    { canonicalName: "Tutorial / Video Content", aliases: ["Screencasts"], category: "technical", priority: "nice_to_have", whyItMatters: "Some users learn faster from a walkthrough video than written steps.", learningObjective: "Produce a short instructional video alongside written docs.", estimatedHours: 4, suggestedProof: "A short tutorial video paired with its written equivalent." },
    { canonicalName: "Localization Awareness", aliases: ["i18n for Docs"], category: "technical", priority: "nice_to_have", whyItMatters: "Global products need docs written in a way that translates cleanly.", learningObjective: "Write docs avoiding idioms and structures that break in translation.", estimatedHours: 2, suggestedProof: "A short write-up of localization-friendly writing choices you made." },
    { canonicalName: "Changelog Writing", aliases: ["Release Notes"], category: "technical", priority: "nice_to_have", whyItMatters: "A common, high-visibility writing task in most software teams.", learningObjective: "Write release notes that are clear to both technical and non-technical readers.", estimatedHours: 2, suggestedProof: "A set of release notes for a real or mock product update." },
    { canonicalName: "Basic SEO for Docs", aliases: ["Docs Discoverability"], category: "technical", priority: "nice_to_have", whyItMatters: "Public docs are often found through search, not navigation.", learningObjective: "Structure a doc page so it's easy to find via search.", estimatedHours: 2, suggestedProof: "A doc page optimized with clear headings and a descriptive title." },
  ],
  projects: [
    {
      title: "API Documentation Set for a Public API",
      description:
        "Pick a public API and write complete reference documentation: authentication, endpoints, request/response examples, and error handling — published as a docs-as-code site.",
      requiredSkills: ["API Documentation", "Markdown / Docs-as-Code", "Documentation Tooling"],
      deliverables: ["A published documentation site", "Complete endpoint reference", "Working request/response examples"],
      githubChecklist: [
        "Every documented endpoint includes a working example",
        "Docs are organized with clear, logical navigation",
        "Site is built and published with a docs-as-code tool",
      ],
    },
    {
      title: "Beginner-to-Advanced Tutorial Series",
      description:
        "Write a tutorial series that takes a reader from zero knowledge to completing a real task with a tool or library, tested on someone unfamiliar with it.",
      requiredSkills: ["Technical Writing Fundamentals", "User-Centered Writing", "Information Architecture for Docs"],
      deliverables: ["A multi-part tutorial", "Notes from a real test reader", "Revisions based on that feedback"],
      githubChecklist: [
        "Tutorial was tested on a real person unfamiliar with the topic",
        "Structure moves logically from simple to advanced",
        "Feedback-driven revisions are documented",
      ],
    },
  ],
  resources: [
    { title: "Google Developer Documentation Style Guide", url: "https://developers.google.com/style", skill: "Editing & Style Guides" },
    { title: "Write the Docs guides", url: "https://www.writethedocs.org/guide/", skill: "Technical Writing Fundamentals" },
    { title: "Docusaurus documentation", url: "https://docusaurus.io/docs", skill: "Documentation Tooling" },
    { title: "Stripe API Reference (example of great API docs)", url: "https://stripe.com/docs/api", skill: "API Documentation" },
    { title: "Mermaid documentation", url: "https://mermaid.js.org/intro/", skill: "Diagramming" },
  ],
  cvEvidenceExamples: [
    "Wrote complete API reference documentation for a public API, published as a docs-as-code site with working examples.",
    "Produced a beginner tutorial series tested on 3 unfamiliar readers, revising based on where they got stuck.",
    "Reorganized a scattered documentation set into a clear information architecture, cutting reported 'can't find it' issues.",
  ],
  jobDescriptionTemplate: `Technical Writer

We're looking for a Technical Writer to make our product and APIs easy to understand.

Requirements:
- Strong, clear writing skills
- Experience writing API or developer documentation
- Comfortable with Markdown and docs-as-code workflows
- Ability to organize large documentation sets logically
- Basic ability to read and understand code samples

Nice to have:
- Experience with a documentation tool (Docusaurus, GitBook, MkDocs)
- Experience interviewing engineers/SMEs for content
- Diagramming skills (Mermaid, draw.io)
- Video/tutorial content creation`,
};

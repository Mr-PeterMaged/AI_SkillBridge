import { RoleTemplate } from "./types";

export const uiUxDesigner: RoleTemplate = {
  id: "UI_UX_DESIGNER",
  category: "Design",
  label: "UI/UX Designer",
  shortLabel: "UI/UX",
  description:
    "Researches user needs and designs interfaces that are usable, consistent, and ready for developers to build.",
  skills: [
    // --- Critical ---
    { canonicalName: "User Research", aliases: ["UX Research", "User Interviews"], category: "technical", priority: "critical", whyItMatters: "Good design starts from real user needs, not assumptions.", learningObjective: "Plan and run a short user interview or survey and summarize findings.", estimatedHours: 5, suggestedProof: "A research summary with at least 3 real user insights and how they shaped a decision." },
    { canonicalName: "Wireframing", aliases: ["Low-Fidelity Design", "Sketching"], category: "technical", priority: "critical", whyItMatters: "Wireframes let you validate structure and flow before investing in visuals.", learningObjective: "Sketch low-fidelity layouts for a multi-screen flow.", estimatedHours: 4, suggestedProof: "A set of wireframes covering a complete user flow, before any visual polish." },
    { canonicalName: "Figma", aliases: ["Sketch", "Adobe XD"], category: "tool", priority: "critical", whyItMatters: "The industry-standard design tool used in almost every design job posting.", learningObjective: "Design and organize screens using components, auto layout, and styles.", estimatedHours: 8, suggestedProof: "A Figma file with reusable components and organized layers for a real project." },
    { canonicalName: "Prototyping", aliases: ["Interactive Prototypes", "Clickable Prototypes"], category: "technical", priority: "critical", whyItMatters: "Clickable prototypes let you test a flow before any code is written.", learningObjective: "Build a clickable prototype that simulates a real multi-screen flow.", estimatedHours: 4, suggestedProof: "A shareable Figma prototype link someone else can click through." },
    { canonicalName: "Visual Design Principles", aliases: ["Layout", "Hierarchy", "Whitespace"], category: "technical", priority: "critical", whyItMatters: "Hierarchy, spacing, and alignment are what make an interface feel professional.", learningObjective: "Apply consistent hierarchy, spacing, and alignment across a screen set.", estimatedHours: 5, suggestedProof: "Before/after screenshots showing a visual redesign of an existing screen." },
    { canonicalName: "Usability Testing", aliases: ["User Testing", "Moderated Testing"], category: "technical", priority: "critical", whyItMatters: "Designs that look good can still be unusable; testing catches that early.", learningObjective: "Run a short usability test with real users and identify friction points.", estimatedHours: 4, suggestedProof: "A usability test report with at least 3 identified friction points and fixes." },
    // --- Important ---
    { canonicalName: "Design Systems", aliases: ["Component Libraries", "Design Tokens"], category: "technical", priority: "important", whyItMatters: "Most product teams design and build from a shared system, not one-off screens.", learningObjective: "Build a small reusable component library with consistent styles.", estimatedHours: 6, suggestedProof: "A Figma component library used consistently across a multi-screen project." },
    { canonicalName: "Information Architecture", aliases: ["IA", "Sitemaps", "User Flows"], category: "technical", priority: "important", whyItMatters: "Poor structure makes even beautiful screens hard to navigate.", learningObjective: "Map out a clear sitemap or user flow before designing individual screens.", estimatedHours: 3, suggestedProof: "A sitemap or user flow diagram for a real product." },
    { canonicalName: "Interaction Design", aliases: ["Micro-interactions", "Motion Design Basics"], category: "technical", priority: "important", whyItMatters: "How a screen responds to input is as important as how it looks.", learningObjective: "Design meaningful transitions and feedback for key interactions.", estimatedHours: 4, suggestedProof: "A prototype demonstrating at least 2 thoughtful micro-interactions." },
    { canonicalName: "Accessibility", aliases: ["a11y", "Color Contrast", "WCAG Basics"], category: "technical", priority: "important", whyItMatters: "Accessible design is a baseline expectation, not a nice-to-have, at most companies.", learningObjective: "Design with sufficient contrast, readable type sizes, and clear focus states.", estimatedHours: 3, suggestedProof: "A contrast-checker report showing a design passes WCAG AA." },
    { canonicalName: "Handoff to Developers", aliases: ["Dev Handoff", "Design Specs"], category: "technical", priority: "important", whyItMatters: "A design only ships correctly if developers can implement it precisely.", learningObjective: "Prepare specs (spacing, sizes, states) that a developer could build from without guessing.", estimatedHours: 3, suggestedProof: "A Figma file with dev-ready specs, redlines, or exported assets." },
    // --- Nice to have ---
    { canonicalName: "Typography & Color Theory", aliases: ["Type Systems", "Color Systems"], category: "technical", priority: "nice_to_have", whyItMatters: "Deepens the craft quality of visual design work.", learningObjective: "Build a type scale and color palette with clear usage rules.", estimatedHours: 3, suggestedProof: "A style guide page documenting a type scale and color system." },
    { canonicalName: "User Personas", aliases: ["Persona Development"], category: "technical", priority: "nice_to_have", whyItMatters: "Helps communicate research findings to stakeholders who weren't in the room.", learningObjective: "Turn research findings into a concise, usable persona.", estimatedHours: 2, suggestedProof: "A one-page persona grounded in real research notes, not guesses." },
    { canonicalName: "Portfolio Presentation", aliases: ["Case Study Writing"], category: "soft", priority: "nice_to_have", whyItMatters: "Design roles are hired largely on how well a portfolio tells the story of the work.", learningObjective: "Write a case study explaining the problem, process, and outcome of a project.", estimatedHours: 4, suggestedProof: "A published case study page for one of your projects." },
    { canonicalName: "Basic HTML/CSS", aliases: ["Design-to-Code Awareness"], category: "technical", priority: "nice_to_have", whyItMatters: "Understanding the medium you're designing for improves handoff quality.", learningObjective: "Recognize what's easy vs. hard to build so designs stay realistic.", estimatedHours: 4, suggestedProof: "A simple page you coded yourself from one of your own designs." },
  ],
  projects: [
    {
      title: "End-to-End App Redesign Case Study",
      description:
        "Pick an app with a real usability problem, research the issue, wireframe and design a fix in Figma, and prototype it — documented as a full case study from problem to outcome.",
      requiredSkills: ["User Research", "Wireframing", "Figma", "Prototyping"],
      deliverables: ["Published case study", "Figma file with wireframes and final screens", "Clickable prototype link"],
      githubChecklist: [
        "Case study explains the problem, process, and outcome clearly",
        "Wireframes are included, not just final polished screens",
        "Prototype link is shareable and actually clickable",
      ],
    },
    {
      title: "Mini Design System",
      description:
        "Build a small, reusable design system (colors, type scale, buttons, inputs, cards) in Figma and apply it consistently across a 3-5 screen mock product.",
      requiredSkills: ["Design Systems", "Visual Design Principles", "Accessibility"],
      deliverables: ["Figma component library", "3-5 screens built entirely from the system", "A contrast-check report"],
      githubChecklist: [
        "Components use auto layout and are reusable, not duplicated per screen",
        "Color palette passes basic contrast checks",
        "Style guide page documents usage rules",
      ],
    },
  ],
  resources: [
    { title: "Figma Learn", url: "https://help.figma.com/hc/en-us/categories/360002051613-Getting-started", skill: "Figma" },
    { title: "Nielsen Norman Group articles", url: "https://www.nngroup.com/articles/", skill: "User Research" },
    { title: "Laws of UX", url: "https://lawsofux.com/", skill: "Visual Design Principles" },
    { title: "WebAIM Contrast Checker", url: "https://webaim.org/resources/contrastchecker/", skill: "Accessibility" },
    { title: "Refactoring UI (blog excerpts)", url: "https://www.refactoringui.com/", skill: "Visual Design Principles" },
  ],
  cvEvidenceExamples: [
    "Redesigned a checkout flow after usability testing revealed a 40% drop-off point, documented as a full case study.",
    "Built a reusable Figma component library adopted across 3 student projects, cutting design time significantly.",
    "Ran 5 user interviews and turned findings into 2 personas that shaped a product's information architecture.",
  ],
  jobDescriptionTemplate: `UI/UX Designer

We're looking for a UI/UX Designer to help us design usable, polished product experiences.

Requirements:
- Strong Figma skills, including components and auto layout
- Experience with wireframing and prototyping
- Basic user research and usability testing experience
- Understanding of visual design principles (hierarchy, spacing, contrast)
- Ability to prepare designs for developer handoff

Nice to have:
- Experience building or contributing to a design system
- Accessibility (WCAG) awareness
- Basic HTML/CSS understanding
- A portfolio with documented case studies`,
};

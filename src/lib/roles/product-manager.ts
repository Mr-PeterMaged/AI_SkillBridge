import { RoleTemplate } from "./types";

export const productManager: RoleTemplate = {
  id: "PRODUCT_MANAGER",
  category: "Product & Program",
  label: "Product Manager",
  shortLabel: "Product",
  description:
    "Decides what gets built and why, by turning user needs and business goals into a prioritized, well-communicated roadmap.",
  skills: [
    // --- Critical ---
    { canonicalName: "Product Discovery", aliases: ["User Research", "Problem Discovery"], category: "technical", priority: "critical", whyItMatters: "Building the wrong thing well is still a failure; discovery prevents that.", learningObjective: "Talk to real users and turn their input into a validated problem statement.", estimatedHours: 5, suggestedProof: "A discovery summary based on at least 3 real user conversations." },
    { canonicalName: "Writing PRDs", aliases: ["Product Specs", "Requirements Writing"], category: "technical", priority: "critical", whyItMatters: "A clear spec is what lets a team build the right thing without constant back-and-forth.", learningObjective: "Write a PRD that a team could build from with minimal clarifying questions.", estimatedHours: 4, suggestedProof: "A complete PRD for a real feature, including goals, scope, and edge cases." },
    { canonicalName: "Prioritization Frameworks", aliases: ["RICE", "MoSCoW"], category: "technical", priority: "critical", whyItMatters: "PMs have infinite ideas and finite time; prioritization is the actual job.", learningObjective: "Apply a structured framework to rank competing feature ideas.", estimatedHours: 3, suggestedProof: "A prioritized backlog with a stated framework and reasoning for the ranking." },
    { canonicalName: "Stakeholder Communication", aliases: ["Status Updates", "Cross-Functional Communication"], category: "soft", priority: "critical", whyItMatters: "PMs spend most of their time aligning engineering, design, and business stakeholders.", learningObjective: "Communicate a decision and its tradeoffs clearly to a non-technical audience.", estimatedHours: 3, suggestedProof: "A written status update or decision memo aimed at mixed stakeholders." },
    { canonicalName: "Metrics & Analytics Basics", aliases: ["Product Metrics", "KPIs"], category: "technical", priority: "critical", whyItMatters: "Decisions without data are just opinions with better formatting.", learningObjective: "Define and track metrics that show whether a feature is working.", estimatedHours: 4, suggestedProof: "A metrics definition doc for a real or mock feature, with a target and rationale." },
    { canonicalName: "Roadmapping", aliases: ["Product Roadmap"], category: "technical", priority: "critical", whyItMatters: "A roadmap is how a PM communicates direction and sequencing to the whole company.", learningObjective: "Build a roadmap that sequences work against clear themes and goals.", estimatedHours: 4, suggestedProof: "A quarter-long roadmap for a real or mock product with stated themes." },
    // --- Important ---
    { canonicalName: "Agile Basics", aliases: ["Scrum Basics", "Sprint Planning"], category: "soft", priority: "important", whyItMatters: "Most product work happens inside sprint cycles alongside an engineering team.", learningObjective: "Run or participate in a sprint cycle from planning to review.", estimatedHours: 3, suggestedProof: "A short write-up of how you ran or contributed to a sprint cycle." },
    { canonicalName: "Wireframing Basics", aliases: ["Low-Fidelity Mockups"], category: "technical", priority: "important", whyItMatters: "PMs often need to communicate an idea visually before design gets involved.", learningObjective: "Sketch a rough flow to communicate a feature idea clearly.", estimatedHours: 3, suggestedProof: "A set of wireframes communicating a feature idea end to end." },
    { canonicalName: "A/B Testing", aliases: ["Experimentation Basics"], category: "technical", priority: "important", whyItMatters: "A structured way to validate whether a change actually improved the product.", learningObjective: "Design and interpret a simple A/B test for a product change.", estimatedHours: 3, suggestedProof: "A write-up of an A/B test design and how you'd interpret the results." },
    { canonicalName: "Competitive Analysis", aliases: ["Market Research Basics"], category: "technical", priority: "important", whyItMatters: "Understanding the landscape shapes realistic, differentiated product decisions.", learningObjective: "Compare a product against 2-3 competitors on specific dimensions.", estimatedHours: 3, suggestedProof: "A competitive analysis doc comparing a real product against its competitors." },
    { canonicalName: "SQL Basics", aliases: ["Data Querying for PMs"], category: "technical", priority: "important", whyItMatters: "PMs who can pull their own data move faster and ask better questions.", learningObjective: "Write a simple query to answer a real product question.", estimatedHours: 4, suggestedProof: "A query and result answering a real question about product usage." },
    // --- Nice to have ---
    { canonicalName: "UX Writing", aliases: ["Microcopy"], category: "technical", priority: "nice_to_have", whyItMatters: "Small wording choices meaningfully affect how users understand a product.", learningObjective: "Write clear, concise in-product copy for a real flow.", estimatedHours: 2, suggestedProof: "Before/after copy for a real in-product flow with reasoning for the change." },
    { canonicalName: "Basic Technical Fluency", aliases: ["API Literacy for PMs"], category: "technical", priority: "nice_to_have", whyItMatters: "Understanding technical constraints helps PMs scope realistic requirements.", learningObjective: "Read basic API documentation and understand what's feasible to build.", estimatedHours: 4, suggestedProof: "A PRD that correctly scopes a feature based on real API/technical constraints." },
    { canonicalName: "Pricing & Business Model Basics", aliases: ["Monetization Basics"], category: "soft", priority: "nice_to_have", whyItMatters: "Product decisions ultimately need to connect to how a business makes money.", learningObjective: "Explain how a product decision affects revenue or growth.", estimatedHours: 3, suggestedProof: "A short write-up connecting a product decision to a business outcome." },
    { canonicalName: "Presentation Skills", aliases: ["Public Speaking"], category: "soft", priority: "nice_to_have", whyItMatters: "PMs regularly pitch ideas and present results to leadership.", learningObjective: "Present a product decision clearly to an audience.", estimatedHours: 3, suggestedProof: "A recorded or delivered presentation of a real product decision." },
  ],
  projects: [
    {
      title: "End-to-End Feature Case Study",
      description:
        "Pick a real app with a clear gap, run lightweight discovery, write a full PRD, prioritize it against other ideas, and define the metrics you'd use to judge success.",
      requiredSkills: ["Product Discovery", "Writing PRDs", "Prioritization Frameworks", "Metrics & Analytics Basics"],
      deliverables: ["A discovery summary", "A complete PRD", "A metrics definition doc"],
      githubChecklist: [
        "Discovery is grounded in real user input, not assumptions",
        "PRD is specific enough that someone else could build from it",
        "Metrics have clear targets and a stated rationale",
      ],
    },
    {
      title: "Quarterly Roadmap + Competitive Analysis",
      description:
        "Build a quarter-long roadmap for a real or mock product, backed by a competitive analysis explaining why each theme was prioritized over alternatives.",
      requiredSkills: ["Roadmapping", "Competitive Analysis", "Stakeholder Communication"],
      deliverables: ["A quarterly roadmap", "A competitive analysis doc", "A stakeholder-facing summary"],
      githubChecklist: [
        "Roadmap themes are tied to specific goals, not a random feature list",
        "Competitive analysis compares specific, relevant dimensions",
        "Summary is written for a non-technical audience",
      ],
    },
  ],
  resources: [
    { title: "Reforge blog", url: "https://www.reforge.com/blog", skill: "Product Discovery" },
    { title: "Product School blog", url: "https://productschool.com/blog", skill: "Writing PRDs" },
    { title: "Intercom on Product Management", url: "https://www.intercom.com/blog/category/product-management/", skill: "Roadmapping" },
    { title: "Amplitude — Product Metrics guide", url: "https://amplitude.com/blog", skill: "Metrics & Analytics Basics" },
    { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", skill: "SQL Basics" },
  ],
  cvEvidenceExamples: [
    "Wrote a full PRD for a feature idea based on 5 user interviews, prioritized against 3 alternatives using RICE.",
    "Built a quarterly roadmap backed by competitive analysis, presented to a mock stakeholder group.",
    "Defined success metrics for a feature case study and designed the A/B test to validate it.",
  ],
  jobDescriptionTemplate: `Product Manager

We're looking for a Product Manager to help define and ship what we build next.

Requirements:
- Experience running lightweight user research or discovery
- Ability to write clear product requirements (PRDs)
- Familiarity with prioritization frameworks
- Strong written and verbal communication with technical and non-technical audiences
- Comfort defining and tracking product metrics

Nice to have:
- Basic SQL for pulling your own data
- Wireframing or prototyping experience
- A/B testing experience
- Basic technical fluency (reading API docs, understanding constraints)`,
};

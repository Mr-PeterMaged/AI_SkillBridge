import { RoleTemplate } from "./types";

export const digitalMarketingSpecialist: RoleTemplate = {
  id: "DIGITAL_MARKETING_SPECIALIST",
  category: "Marketing & Growth",
  label: "Digital Marketing Specialist",
  shortLabel: "Digital Marketing",
  description:
    "Plans and runs campaigns across search, social, and email to attract and convert an audience, and measures what actually works.",
  skills: [
    // --- Critical ---
    { canonicalName: "SEO Fundamentals", aliases: ["Search Engine Optimization", "On-Page SEO"], category: "technical", priority: "critical", whyItMatters: "Organic search is one of the highest-leverage, lowest-cost channels for most companies.", learningObjective: "Optimize a page's title, headings, and content for a target keyword.", estimatedHours: 5, suggestedProof: "A page you optimized with a before/after ranking or traffic screenshot." },
    { canonicalName: "Content Marketing", aliases: ["Content Strategy", "Blogging"], category: "technical", priority: "critical", whyItMatters: "Content is the raw material that fuels SEO, social, and email all at once.", learningObjective: "Plan and write content that targets a specific audience and goal.", estimatedHours: 5, suggestedProof: "A published piece of content with a stated goal and audience." },
    { canonicalName: "Social Media Marketing", aliases: ["Social Media Management"], category: "technical", priority: "critical", whyItMatters: "Nearly every brand needs a presence and a posting strategy on social platforms.", learningObjective: "Plan and execute a short content calendar for a real or mock brand.", estimatedHours: 4, suggestedProof: "A 2-week content calendar with published or mocked posts and stated goals." },
    { canonicalName: "Google Analytics", aliases: ["GA4", "Web Analytics"], category: "tool", priority: "critical", whyItMatters: "You can't prove a campaign worked without measuring it properly.", learningObjective: "Set up goals/events and read a traffic and conversion report.", estimatedHours: 5, suggestedProof: "A GA4 report screenshot showing traffic sources and a defined conversion goal." },
    { canonicalName: "Copywriting", aliases: ["Ad Copy", "Marketing Writing"], category: "technical", priority: "critical", whyItMatters: "Every channel — ads, email, landing pages — lives or dies on the words used.", learningObjective: "Write clear, persuasive copy for a specific audience and call to action.", estimatedHours: 4, suggestedProof: "Before/after copy for a real ad, email, or landing page with reasoning for the change." },
    { canonicalName: "Email Marketing", aliases: ["Mailchimp", "Email Campaigns"], category: "tool", priority: "critical", whyItMatters: "Still one of the highest-ROI channels for retention and conversion.", learningObjective: "Build and send a segmented email campaign with a clear goal.", estimatedHours: 4, suggestedProof: "A designed email campaign with open/click data or a mock report." },
    // --- Important ---
    { canonicalName: "Paid Ads", aliases: ["Google Ads", "Meta Ads", "PPC"], category: "tool", priority: "important", whyItMatters: "Paid acquisition is a core skill for growth-focused marketing roles.", learningObjective: "Set up and structure a basic paid campaign with clear targeting.", estimatedHours: 6, suggestedProof: "A campaign structure (targeting, budget, ad copy) for a real or mock product." },
    { canonicalName: "Keyword Research", aliases: ["SEO Keyword Research"], category: "technical", priority: "important", whyItMatters: "Good SEO and content start with knowing what people actually search for.", learningObjective: "Find and prioritize keywords by intent, volume, and competition.", estimatedHours: 3, suggestedProof: "A keyword research sheet with intent and priority notes for a real topic." },
    { canonicalName: "A/B Testing", aliases: ["Experimentation Basics", "Conversion Testing"], category: "technical", priority: "important", whyItMatters: "Marketing decisions backed by tests beat decisions backed by opinion.", learningObjective: "Design and interpret a simple A/B test on copy or a landing page.", estimatedHours: 3, suggestedProof: "A write-up of an A/B test you ran or analyzed, with a clear conclusion." },
    { canonicalName: "Marketing Funnels", aliases: ["Funnel Analysis", "Conversion Funnels"], category: "technical", priority: "important", whyItMatters: "Understanding where people drop off is key to improving results anywhere in the funnel.", learningObjective: "Map a funnel and identify where the biggest drop-off happens.", estimatedHours: 3, suggestedProof: "A funnel diagram with real or estimated drop-off rates at each stage." },
    { canonicalName: "Landing Page Optimization", aliases: ["CRO Basics", "Conversion Rate Optimization"], category: "technical", priority: "important", whyItMatters: "A campaign that drives traffic to a weak page wastes the whole budget.", learningObjective: "Identify and fix friction points on a landing page.", estimatedHours: 4, suggestedProof: "A before/after landing page redesign with reasoning for each change." },
    // --- Nice to have ---
    { canonicalName: "Marketing Automation", aliases: ["HubSpot Basics", "Drip Campaigns"], category: "tool", priority: "nice_to_have", whyItMatters: "Automation lets a small team run consistent, timely campaigns at scale.", learningObjective: "Set up a basic automated sequence triggered by user behavior.", estimatedHours: 4, suggestedProof: "A mapped-out automation flow (trigger, steps, goal) for a real scenario." },
    { canonicalName: "Brand Strategy", aliases: ["Positioning", "Brand Voice"], category: "soft", priority: "nice_to_have", whyItMatters: "Consistent positioning makes every other channel more effective.", learningObjective: "Define a clear positioning statement and voice guidelines for a brand.", estimatedHours: 3, suggestedProof: "A one-page brand brief with positioning and voice guidelines." },
    { canonicalName: "Basic Design Tools", aliases: ["Canva", "Figma Basics"], category: "tool", priority: "nice_to_have", whyItMatters: "Marketers frequently need to produce simple visuals without waiting on a designer.", learningObjective: "Produce clean, on-brand visuals for social or ads without a designer.", estimatedHours: 3, suggestedProof: "A set of social or ad graphics you designed yourself." },
    { canonicalName: "SQL Basics", aliases: ["Marketing Data Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "Growth-focused marketing roles increasingly expect comfort pulling your own data.", learningObjective: "Write a simple query to answer a marketing question from campaign data.", estimatedHours: 4, suggestedProof: "A query and result answering a real question about campaign performance." },
  ],
  projects: [
    {
      title: "Full-Funnel Campaign Plan for a Product",
      description:
        "Pick a real or fictional product and build an end-to-end campaign: keyword research, a landing page critique/redesign, ad copy, an email sequence, and a GA4 measurement plan.",
      requiredSkills: ["SEO Fundamentals", "Copywriting", "Email Marketing", "Google Analytics"],
      deliverables: ["A campaign plan document", "Landing page before/after mockup", "An email sequence with subject lines and copy"],
      githubChecklist: [
        "Plan states clear goals and how success will be measured",
        "Keyword research backs the SEO and content choices",
        "Email sequence has a clear goal for each message",
      ],
    },
    {
      title: "Social Media Content Calendar + Performance Report",
      description:
        "Build a 2-4 week content calendar for a real or mock brand, publish (or mock) the posts, and produce a simple performance report analyzing what worked.",
      requiredSkills: ["Social Media Marketing", "Content Marketing", "A/B Testing"],
      deliverables: ["A content calendar", "Published or mocked posts", "A short performance write-up"],
      githubChecklist: [
        "Calendar ties each post to a specific goal or audience",
        "Performance report draws a real conclusion, not just raw numbers",
        "At least one test or comparison (format, timing, or copy) is included",
      ],
    },
  ],
  resources: [
    { title: "Google Analytics Academy", url: "https://analytics.google.com/analytics/academy/", skill: "Google Analytics" },
    { title: "Google SEO Starter Guide", url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide", skill: "SEO Fundamentals" },
    { title: "HubSpot Academy", url: "https://academy.hubspot.com/", skill: "Content Marketing" },
    { title: "Meta Blueprint", url: "https://www.facebookblueprint.com/", skill: "Paid Ads" },
    { title: "CXL Institute blog", url: "https://cxl.com/blog/", skill: "Landing Page Optimization" },
  ],
  cvEvidenceExamples: [
    "Planned and ran a full-funnel campaign (SEO, email, landing page) for a mock product, projecting a 3x lift in conversion from redesign alone.",
    "Grew a student org's social following by 40% in 6 weeks using a structured content calendar and A/B tested post formats.",
    "Optimized a landing page based on funnel analysis, identifying the single step causing the largest drop-off.",
  ],
  jobDescriptionTemplate: `Digital Marketing Specialist

We're looking for a Digital Marketing Specialist to help grow our audience and conversions.

Requirements:
- Solid understanding of SEO fundamentals
- Experience with content and social media marketing
- Comfortable with Google Analytics (GA4)
- Strong copywriting skills across channels (ads, email, landing pages)
- Basic email marketing experience

Nice to have:
- Paid ads experience (Google Ads / Meta Ads)
- A/B testing and conversion rate optimization
- Marketing automation tools
- Basic design skills (Canva/Figma)`,
};

import { RoleTemplate } from "./types";

export const juniorDataAnalyst: RoleTemplate = {
  id: "JUNIOR_DATA_ANALYST",
  category: "Data",
  label: "Junior Data Analyst",
  shortLabel: "Data Analyst",
  description:
    "Turns raw data into clean, visualized, and communicated insights that support business decisions.",
  skills: [
    // --- Critical ---
    { canonicalName: "Excel", aliases: ["Google Sheets", "Spreadsheets", "MS Excel"], category: "tool", priority: "critical", whyItMatters: "Still the most common first tool for exploring and reporting on data.", learningObjective: "Use pivot tables, lookups, and charts to summarize a dataset.", estimatedHours: 4, suggestedProof: "A pivot-table summary and chart built from a real dataset." },
    { canonicalName: "SQL", aliases: ["Structured Query Language"], category: "technical", priority: "critical", whyItMatters: "The universal language for querying data warehouses and databases.", learningObjective: "Write joins, aggregations, and filtered queries confidently.", estimatedHours: 6, suggestedProof: "A set of SQL queries answering real business questions against a public dataset." },
    { canonicalName: "Data Cleaning", aliases: ["Data Wrangling", "Data Preparation"], category: "technical", priority: "critical", whyItMatters: "Real-world data is messy; cleaning it is most of an analyst's job.", learningObjective: "Handle missing values, duplicates, and inconsistent formats in a dataset.", estimatedHours: 4, suggestedProof: "A before/after dataset with a written summary of cleaning steps taken." },
    { canonicalName: "Data Visualization", aliases: ["Charting", "Dataviz"], category: "technical", priority: "critical", whyItMatters: "Insights only matter if stakeholders can understand them at a glance.", learningObjective: "Choose the right chart type and build clear, labeled visualizations.", estimatedHours: 4, suggestedProof: "A set of 3-5 charts answering specific questions about a dataset." },
    { canonicalName: "Statistics Basics", aliases: ["Descriptive Statistics"], category: "technical", priority: "critical", whyItMatters: "Analysts need to reason about averages, distributions, and significance.", learningObjective: "Explain and compute mean, median, variance, and correlation for a dataset.", estimatedHours: 5, suggestedProof: "A short written analysis using at least 3 statistical concepts correctly." },
    // --- Important ---
    { canonicalName: "Python", aliases: ["Python3"], category: "technical", priority: "important", whyItMatters: "Increasingly expected for analysts handling larger or messier datasets.", learningObjective: "Load, clean, and summarize a dataset using Python.", estimatedHours: 6, suggestedProof: "A Jupyter notebook performing an end-to-end analysis." },
    { canonicalName: "Pandas", aliases: ["Pandas Library"], category: "tool", priority: "important", whyItMatters: "The standard Python library for tabular data analysis.", learningObjective: "Filter, group, and merge dataframes to answer analytical questions.", estimatedHours: 5, suggestedProof: "A notebook using groupby/merge operations on a real dataset." },
    { canonicalName: "Power BI", aliases: ["Tableau", "Looker Studio"], category: "tool", priority: "important", whyItMatters: "The dominant BI tools used to share dashboards with stakeholders.", learningObjective: "Build an interactive dashboard connected to a real dataset.", estimatedHours: 6, suggestedProof: "A published or screen-recorded interactive dashboard." },
    { canonicalName: "Dashboard Design", aliases: ["BI Dashboard Design"], category: "technical", priority: "important", whyItMatters: "A cluttered dashboard is as bad as no dashboard.", learningObjective: "Design a dashboard that answers a specific business question at a glance.", estimatedHours: 3, suggestedProof: "A one-page dashboard with a clear headline metric and supporting charts." },
    { canonicalName: "Data Storytelling", aliases: ["Insight Communication"], category: "soft", priority: "important", whyItMatters: "Analysts are hired to influence decisions, not just produce charts.", learningObjective: "Write a short narrative that connects data findings to a recommendation.", estimatedHours: 3, suggestedProof: "A one-page written summary translating an analysis into a recommendation." },
    // --- Nice to have ---
    { canonicalName: "Machine Learning Basics", aliases: ["ML Basics", "Predictive Modeling Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "Useful context even for analysts who won't build models day-to-day.", learningObjective: "Train and evaluate a simple regression or classification model.", estimatedHours: 6, suggestedProof: "A notebook training and evaluating one simple model with a written interpretation." },
    { canonicalName: "ETL Basics", aliases: ["Extract Transform Load"], category: "technical", priority: "nice_to_have", whyItMatters: "Understanding how data pipelines feed your analysis builds credibility.", learningObjective: "Build a simple script that extracts, transforms, and loads data into a table.", estimatedHours: 4, suggestedProof: "A script that automates pulling and cleaning a dataset on a schedule." },
    { canonicalName: "Cloud Data Tools", aliases: ["BigQuery", "Snowflake Basics"], category: "tool", priority: "nice_to_have", whyItMatters: "Many companies analyze data directly in cloud warehouses.", learningObjective: "Run queries against a cloud data warehouse's free tier.", estimatedHours: 4, suggestedProof: "Screenshots of queries run against a cloud warehouse free tier." },
    { canonicalName: "A/B Testing", aliases: ["Experimentation Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "A common way analysts support product decisions with evidence.", learningObjective: "Explain and analyze the results of a simple A/B test.", estimatedHours: 3, suggestedProof: "A write-up analyzing a sample A/B test dataset for statistical significance." },
  ],
  projects: [
    {
      title: "Sales / Public Dataset Deep-Dive",
      description:
        "An end-to-end analysis of a public dataset (e.g. Kaggle sales data): clean it in Python/Pandas, query it with SQL, and present findings as a dashboard with a written recommendation.",
      requiredSkills: ["SQL", "Data Cleaning", "Data Visualization", "Data Storytelling"],
      deliverables: ["Jupyter notebook or SQL scripts", "Dashboard (Power BI/Tableau or charts)", "One-page written recommendation"],
      githubChecklist: [
        "README explains the business question being answered",
        "Data cleaning steps are documented, not just performed silently",
        "Final recommendation is stated in plain language, not just charts",
      ],
    },
    {
      title: "KPI Dashboard Build",
      description:
        "Take a messy public CSV, clean it, and build a polished, stakeholder-ready dashboard with 3-5 key metrics and clear labeling.",
      requiredSkills: ["Excel", "Data Visualization", "Dashboard Design"],
      deliverables: ["Cleaned dataset", "Published or recorded dashboard", "Short methodology note"],
      githubChecklist: [
        "Dashboard has a clear headline metric",
        "Charts are labeled and use consistent color coding",
        "Methodology note explains any assumptions made",
      ],
    },
  ],
  resources: [
    { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", skill: "SQL" },
    { title: "Kaggle Learn — Pandas", url: "https://www.kaggle.com/learn/pandas", skill: "Pandas" },
    { title: "Kaggle Learn — Data Cleaning", url: "https://www.kaggle.com/learn/data-cleaning", skill: "Data Cleaning" },
    { title: "Power BI Guided Learning", url: "https://learn.microsoft.com/power-bi/guided-learning/", skill: "Power BI" },
    { title: "Storytelling with Data (blog)", url: "https://www.storytellingwithdata.com/blog", skill: "Data Storytelling" },
    { title: "Khan Academy — Statistics", url: "https://www.khanacademy.org/math/statistics-probability", skill: "Statistics Basics" },
  ],
  cvEvidenceExamples: [
    "Cleaned and analyzed a 50k-row public dataset in Python/Pandas, identifying 3 actionable trends.",
    "Built a Power BI dashboard tracking 5 KPIs, adopted informally by a student org for weekly reporting.",
    "Wrote a data-driven recommendation memo that translated SQL analysis into a stakeholder decision.",
  ],
  jobDescriptionTemplate: `Junior Data Analyst

We're looking for a Junior Data Analyst to help turn our data into decisions.

Requirements:
- Strong Excel or Google Sheets skills
- Working knowledge of SQL
- Experience cleaning and preparing messy datasets
- Ability to build clear data visualizations
- Basic understanding of statistics

Nice to have:
- Python (Pandas) experience
- Power BI or Tableau experience
- Experience communicating findings to non-technical stakeholders
- Exposure to A/B testing or basic ML concepts`,
};

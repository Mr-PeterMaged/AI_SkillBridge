import { RoleTemplate } from "./types";

export const dataEngineer: RoleTemplate = {
  id: "DATA_ENGINEER",
  category: "Data",
  label: "Data Engineer",
  shortLabel: "Data Engineer",
  description:
    "Builds the pipelines and infrastructure that move, clean, and organize data so analysts and applications can rely on it.",
  skills: [
    // --- Critical ---
    { canonicalName: "SQL", aliases: ["Structured Query Language"], category: "technical", priority: "critical", whyItMatters: "The universal language for querying and transforming structured data.", learningObjective: "Write complex joins, aggregations, and window functions confidently.", estimatedHours: 6, suggestedProof: "A set of advanced SQL queries solving real data transformation problems." },
    { canonicalName: "Python", aliases: ["Python3"], category: "technical", priority: "critical", whyItMatters: "The dominant language for writing data pipelines and transformations.", learningObjective: "Write scripts that extract, transform, and load data reliably.", estimatedHours: 8, suggestedProof: "A Python ETL script processing a real dataset end to end." },
    { canonicalName: "ETL Basics", aliases: ["Extract Transform Load", "ELT"], category: "technical", priority: "critical", whyItMatters: "Moving and reshaping data between systems is the core of the role.", learningObjective: "Build a pipeline that extracts, transforms, and loads data into a usable table.", estimatedHours: 6, suggestedProof: "A working ETL pipeline with clear extract/transform/load stages." },
    { canonicalName: "Data Warehousing Basics", aliases: ["Star Schema", "Dimensional Modeling"], category: "technical", priority: "critical", whyItMatters: "Analytics teams query data warehouses, not raw source systems.", learningObjective: "Design a simple star schema for an analytics use case.", estimatedHours: 5, suggestedProof: "A star-schema design with fact and dimension tables for a real dataset." },
    { canonicalName: "Databases", aliases: ["Database Design", "Relational Databases"], category: "technical", priority: "critical", whyItMatters: "Data engineers design and optimize how data is stored, not just how it's queried.", learningObjective: "Design normalized and denormalized schemas for different use cases.", estimatedHours: 5, suggestedProof: "A schema design with a written rationale for normalization choices." },
    { canonicalName: "Git", aliases: ["Git/GitHub", "Version Control"], category: "tool", priority: "critical", whyItMatters: "Pipeline code needs the same version control discipline as any other software.", learningObjective: "Branch, commit, and review pipeline code changes.", estimatedHours: 3, suggestedProof: "A public GitHub repo with a maintained data pipeline project." },
    // --- Important ---
    { canonicalName: "Apache Airflow", aliases: ["Orchestration", "Workflow Scheduling"], category: "tool", priority: "important", whyItMatters: "The most common tool for scheduling and monitoring production data pipelines.", learningObjective: "Schedule and monitor a multi-step pipeline as a DAG.", estimatedHours: 6, suggestedProof: "A working Airflow DAG orchestrating a multi-step pipeline." },
    { canonicalName: "PostgreSQL", aliases: ["Postgres"], category: "tool", priority: "important", whyItMatters: "The most widely used production-grade relational database for pipeline targets.", learningObjective: "Load and query pipeline output in a real Postgres database.", estimatedHours: 4, suggestedProof: "A pipeline loading transformed data into a live Postgres database." },
    { canonicalName: "Cloud Data Tools", aliases: ["BigQuery", "Snowflake", "Redshift"], category: "tool", priority: "important", whyItMatters: "Most production data warehouses now run in the cloud, not on-prem servers.", learningObjective: "Load and query data in a cloud data warehouse's free tier.", estimatedHours: 5, suggestedProof: "Queries run against a cloud data warehouse loaded with your own pipeline output." },
    { canonicalName: "Data Modeling", aliases: ["Schema Design"], category: "technical", priority: "important", whyItMatters: "Good models make downstream analytics fast and understandable; bad ones don't.", learningObjective: "Model a dataset for both storage efficiency and query usability.", estimatedHours: 4, suggestedProof: "A data model diagram with a written explanation of key tradeoffs." },
    { canonicalName: "Data Quality Testing", aliases: ["Great Expectations", "dbt Tests"], category: "tool", priority: "important", whyItMatters: "Bad data silently breaks every dashboard and model downstream of it.", learningObjective: "Write automated checks that catch bad data before it reaches consumers.", estimatedHours: 4, suggestedProof: "A pipeline with automated data-quality checks that catch a real bad-data case." },
    // --- Nice to have ---
    { canonicalName: "Apache Spark", aliases: ["PySpark", "Spark Basics"], category: "tool", priority: "nice_to_have", whyItMatters: "Common for processing datasets too large for a single machine.", learningObjective: "Process a larger-than-memory dataset using distributed processing basics.", estimatedHours: 6, suggestedProof: "A PySpark script processing a dataset with a documented performance note." },
    { canonicalName: "Streaming Basics", aliases: ["Kafka", "Event Streaming"], category: "tool", priority: "nice_to_have", whyItMatters: "Real-time data needs pipelines that don't wait for a nightly batch job.", learningObjective: "Build a basic producer/consumer for a streaming data source.", estimatedHours: 6, suggestedProof: "A working producer/consumer example against a streaming data source." },
    { canonicalName: "Docker", aliases: ["Containerization"], category: "tool", priority: "nice_to_have", whyItMatters: "Makes pipeline environments portable and reproducible across machines.", learningObjective: "Containerize a data pipeline so it runs consistently anywhere.", estimatedHours: 4, suggestedProof: "A Dockerfile that runs a pipeline reproducibly on any machine." },
    { canonicalName: "CI/CD for Data Pipelines", aliases: ["dbt CI", "Pipeline Testing"], category: "tool", priority: "nice_to_have", whyItMatters: "Signals awareness of how production data teams ship pipeline changes safely.", learningObjective: "Set up a pipeline that tests transformations automatically on every change.", estimatedHours: 4, suggestedProof: "A green CI badge showing pipeline tests running automatically." },
  ],
  projects: [
    {
      title: "End-to-End ETL Pipeline",
      description:
        "Build a pipeline that extracts data from a public API or file source, transforms and validates it in Python, and loads it into a Postgres warehouse modeled as a star schema.",
      requiredSkills: ["ETL Basics", "Python", "Data Warehousing Basics", "PostgreSQL"],
      deliverables: ["A working pipeline script or DAG", "A star-schema database", "A README documenting the data flow"],
      githubChecklist: [
        "README explains each stage of the pipeline clearly",
        "Schema follows a documented star-schema design",
        "Pipeline handles at least one real data-quality issue",
      ],
    },
    {
      title: "Orchestrated Multi-Step Pipeline",
      description:
        "Take an existing pipeline and orchestrate it with Airflow (or a similar scheduler), adding automated data-quality checks that fail loudly on bad data.",
      requiredSkills: ["Apache Airflow", "Data Quality Testing", "SQL"],
      deliverables: ["A working Airflow DAG", "Automated data-quality checks", "A monitoring/logging screenshot"],
      githubChecklist: [
        "DAG shows clear task dependencies, not one giant script",
        "At least one data-quality check catches a real bad-data scenario",
        "README explains how to run and monitor the pipeline",
      ],
    },
  ],
  resources: [
    { title: "Apache Airflow documentation", url: "https://airflow.apache.org/docs/", skill: "Apache Airflow" },
    { title: "dbt Fundamentals", url: "https://docs.getdbt.com/docs/introduction", skill: "Data Quality Testing" },
    { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", skill: "PostgreSQL" },
    { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", skill: "SQL" },
    { title: "Google BigQuery documentation", url: "https://cloud.google.com/bigquery/docs", skill: "Cloud Data Tools" },
  ],
  cvEvidenceExamples: [
    "Built an end-to-end ETL pipeline loading a public dataset into a star-schema Postgres warehouse.",
    "Orchestrated a multi-step data pipeline with Airflow, adding automated quality checks that caught a real bad-data case.",
    "Modeled a dimensional schema for a student analytics project, cutting query time for common reports significantly.",
  ],
  jobDescriptionTemplate: `Data Engineer

We're looking for a Data Engineer to build and maintain the pipelines behind our analytics.

Requirements:
- Strong SQL skills
- Python experience for writing data pipelines
- Understanding of ETL concepts and data warehousing basics
- Experience designing relational database schemas
- Familiarity with Git and collaborative workflows

Nice to have:
- Apache Airflow or another orchestration tool
- Experience with a cloud data warehouse (BigQuery, Snowflake, Redshift)
- Data quality testing tools (dbt tests, Great Expectations)
- Exposure to Spark or streaming data (Kafka)`,
};

import { RoleTemplate } from "./types";

export const devopsEngineer: RoleTemplate = {
  id: "DEVOPS_ENGINEER",
  category: "Quality & DevOps",
  label: "DevOps Engineer",
  shortLabel: "DevOps",
  description:
    "Builds and maintains the infrastructure, pipelines, and automation that let teams ship and run software reliably.",
  skills: [
    // --- Critical ---
    { canonicalName: "Linux Fundamentals", aliases: ["Linux Basics", "Shell Basics"], category: "technical", priority: "critical", whyItMatters: "Nearly all production servers and CI runners are Linux-based.", learningObjective: "Navigate, manage processes, and read logs on a Linux server confidently.", estimatedHours: 6, suggestedProof: "A short recording or write-up of diagnosing an issue purely from the terminal." },
    { canonicalName: "Git", aliases: ["Git/GitHub", "Version Control"], category: "tool", priority: "critical", whyItMatters: "Infrastructure and pipeline config live in Git just like application code.", learningObjective: "Branch, commit, and review infrastructure-as-code changes.", estimatedHours: 3, suggestedProof: "A public GitHub profile with a maintained infra/config repo." },
    { canonicalName: "CI/CD", aliases: ["GitHub Actions", "Continuous Integration", "Continuous Delivery"], category: "tool", priority: "critical", whyItMatters: "Automating build/test/deploy is the core day-to-day of the role.", learningObjective: "Build a pipeline that tests, builds, and deploys an app automatically.", estimatedHours: 6, suggestedProof: "A working CI/CD pipeline with a green badge and a real deployment step." },
    { canonicalName: "Docker", aliases: ["Containerization"], category: "tool", priority: "critical", whyItMatters: "Containers are the standard unit of deployment in modern infrastructure.", learningObjective: "Containerize an application and run it reliably from the image.", estimatedHours: 5, suggestedProof: "A Dockerfile that builds and runs a real app, with a short README." },
    { canonicalName: "Cloud Fundamentals", aliases: ["AWS Basics", "Azure Basics", "GCP Basics"], category: "tool", priority: "critical", whyItMatters: "Most infrastructure now runs on a major cloud provider.", learningObjective: "Provision and configure basic compute, storage, and networking resources.", estimatedHours: 6, suggestedProof: "A screenshot/walkthrough of a resource you provisioned on a cloud free tier." },
    { canonicalName: "Bash Scripting", aliases: ["Shell Scripting"], category: "technical", priority: "critical", whyItMatters: "Automation glue between tools is still frequently written in shell scripts.", learningObjective: "Write a script that automates a real repetitive task.", estimatedHours: 4, suggestedProof: "A shell script that automates a real setup or deployment step." },
    // --- Important ---
    { canonicalName: "Kubernetes", aliases: ["K8s"], category: "tool", priority: "important", whyItMatters: "The dominant container orchestration platform in production environments.", learningObjective: "Deploy and scale a containerized app on a Kubernetes cluster.", estimatedHours: 8, suggestedProof: "A deployment manifest and a running pod on a local or free-tier cluster." },
    { canonicalName: "Infrastructure as Code", aliases: ["Terraform", "IaC"], category: "tool", priority: "important", whyItMatters: "Manually clicking through cloud consoles doesn't scale or reproduce reliably.", learningObjective: "Define and provision infrastructure from code instead of a UI.", estimatedHours: 6, suggestedProof: "A Terraform (or similar) config that provisions a real resource." },
    { canonicalName: "Monitoring & Logging", aliases: ["Observability", "Grafana", "Prometheus"], category: "tool", priority: "important", whyItMatters: "You can't fix what you can't see; monitoring is core to reliability work.", learningObjective: "Set up basic metrics or log aggregation for a running service.", estimatedHours: 5, suggestedProof: "A dashboard or log view showing real metrics from a deployed app." },
    { canonicalName: "Networking Basics", aliases: ["DNS Basics", "TCP/IP Basics"], category: "technical", priority: "important", whyItMatters: "Diagnosing outages usually starts with understanding how traffic flows.", learningObjective: "Explain and troubleshoot basic DNS, HTTP, and firewall/networking issues.", estimatedHours: 4, suggestedProof: "A short write-up diagnosing a real connectivity or DNS issue." },
    { canonicalName: "Security Basics", aliases: ["Secrets Management", "Least Privilege"], category: "technical", priority: "important", whyItMatters: "Infrastructure engineers are a frequent last line of defense against misconfiguration.", learningObjective: "Apply least-privilege access and avoid hardcoding secrets in config.", estimatedHours: 3, suggestedProof: "A write-up of how a project manages secrets and access permissions." },
    // --- Nice to have ---
    { canonicalName: "Python Scripting", aliases: ["Python Automation"], category: "technical", priority: "nice_to_have", whyItMatters: "Common for more complex automation than shell scripts can comfortably handle.", learningObjective: "Write a Python script that automates an infrastructure or ops task.", estimatedHours: 5, suggestedProof: "A Python automation script solving a real ops problem." },
    { canonicalName: "System Design Basics", aliases: ["Scalability Basics", "Reliability Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "Shows early awareness of how systems stay reliable under load or failure.", learningObjective: "Explain the tradeoffs of a simple, resilient system design.", estimatedHours: 4, suggestedProof: "A one-page write-up or diagram of a simple resilient architecture." },
    { canonicalName: "Configuration Management", aliases: ["Ansible"], category: "tool", priority: "nice_to_have", whyItMatters: "Keeps server configuration consistent and repeatable at scale.", learningObjective: "Automate the configuration of a server using a config-management tool.", estimatedHours: 4, suggestedProof: "An Ansible playbook (or similar) that configures a server from scratch." },
    { canonicalName: "Incident Response Basics", aliases: ["On-Call Basics", "Postmortems"], category: "soft", priority: "nice_to_have", whyItMatters: "Shows readiness for the operational side of the role, not just the build side.", learningObjective: "Write a clear postmortem for a simulated or real incident.", estimatedHours: 3, suggestedProof: "A postmortem document for an outage you caused or fixed yourself." },
  ],
  projects: [
    {
      title: "CI/CD Pipeline for a Containerized App",
      description:
        "Take an existing app, containerize it with Docker, and build a CI/CD pipeline (GitHub Actions) that tests, builds the image, and deploys it automatically on every push.",
      requiredSkills: ["Docker", "CI/CD", "Git"],
      deliverables: ["Public GitHub repo with the pipeline config", "Green CI/CD badge", "A short README explaining the pipeline stages"],
      githubChecklist: [
        "README explains each pipeline stage and how to reproduce it locally",
        "Pipeline runs tests before building the image",
        "Deployment step is automated, not manual",
      ],
    },
    {
      title: "Infrastructure-as-Code Cloud Deployment",
      description:
        "Provision a small piece of real infrastructure (e.g. a VM or storage bucket) using Terraform on a cloud free tier, with monitoring/logging wired up for the deployed resource.",
      requiredSkills: ["Cloud Fundamentals", "Infrastructure as Code", "Monitoring & Logging"],
      deliverables: ["Terraform config in a public repo", "A screenshot of the provisioned resource", "A basic dashboard or log view"],
      githubChecklist: [
        "README documents how to apply and destroy the infrastructure",
        "No hardcoded secrets committed to the repo",
        "At least one metric or log is visible for the deployed resource",
      ],
    },
  ],
  resources: [
    { title: "Docker Get Started", url: "https://docs.docker.com/get-started/", skill: "Docker" },
    { title: "Kubernetes documentation", url: "https://kubernetes.io/docs/home/", skill: "Kubernetes" },
    { title: "Terraform documentation", url: "https://developer.hashicorp.com/terraform/docs", skill: "Infrastructure as Code" },
    { title: "GitHub Actions documentation", url: "https://docs.github.com/actions", skill: "CI/CD" },
    { title: "Prometheus documentation", url: "https://prometheus.io/docs/introduction/overview/", skill: "Monitoring & Logging" },
    { title: "Linux Journey", url: "https://linuxjourney.com/", skill: "Linux Fundamentals" },
  ],
  cvEvidenceExamples: [
    "Built a CI/CD pipeline that tests, containerizes, and deploys an app automatically on every push to main.",
    "Provisioned cloud infrastructure with Terraform and wired up basic monitoring, cutting manual setup time to zero.",
    "Diagnosed and fixed a DNS misconfiguration causing intermittent downtime on a personal project's deployment.",
  ],
  jobDescriptionTemplate: `DevOps Engineer

We're looking for a DevOps Engineer to help us build and maintain reliable infrastructure.

Requirements:
- Solid Linux fundamentals and shell scripting
- Experience with Git and CI/CD pipelines
- Experience containerizing applications with Docker
- Basic cloud provider experience (AWS, Azure, or GCP)
- Understanding of networking and security basics

Nice to have:
- Kubernetes experience
- Infrastructure as Code (Terraform)
- Monitoring/observability tooling (Prometheus, Grafana)
- Python scripting for automation`,
};

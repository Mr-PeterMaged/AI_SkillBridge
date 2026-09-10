import { RoleTemplate } from "./types";

export const cloudEngineer: RoleTemplate = {
  id: "CLOUD_ENGINEER",
  category: "Quality & DevOps",
  label: "Cloud Engineer",
  shortLabel: "Cloud",
  description:
    "Designs, provisions, and maintains cloud infrastructure so applications run reliably, securely, and cost-effectively.",
  skills: [
    // --- Critical ---
    { canonicalName: "Cloud Fundamentals", aliases: ["AWS Basics", "Azure Basics", "GCP Basics"], category: "tool", priority: "critical", whyItMatters: "The core of the role: provisioning and configuring resources on a major cloud provider.", learningObjective: "Provision compute, storage, and networking resources confidently.", estimatedHours: 8, suggestedProof: "A documented cloud environment you provisioned from scratch on a free tier." },
    { canonicalName: "Linux Fundamentals", aliases: ["Linux Basics", "Shell Basics"], category: "technical", priority: "critical", whyItMatters: "Most cloud compute instances run Linux under the hood.", learningObjective: "Manage and troubleshoot a Linux-based cloud instance.", estimatedHours: 5, suggestedProof: "A write-up diagnosing an issue on a real cloud VM from the terminal." },
    { canonicalName: "Networking Basics", aliases: ["VPC", "Subnets", "DNS Basics"], category: "technical", priority: "critical", whyItMatters: "Cloud networking (VPCs, subnets, security groups) is where most misconfigurations happen.", learningObjective: "Design a basic secure network topology for a cloud application.", estimatedHours: 6, suggestedProof: "A network diagram plus a working VPC/subnet setup in a cloud account." },
    { canonicalName: "Infrastructure as Code", aliases: ["Terraform", "IaC", "CloudFormation"], category: "tool", priority: "critical", whyItMatters: "Modern cloud teams provision infrastructure from code, not manual console clicks.", learningObjective: "Define and provision real infrastructure using code instead of a UI.", estimatedHours: 7, suggestedProof: "A Terraform (or CloudFormation) config that provisions a real, working resource." },
    { canonicalName: "Git", aliases: ["Git/GitHub", "Version Control"], category: "tool", priority: "critical", whyItMatters: "Infrastructure-as-code lives in Git and follows the same review workflow as app code.", learningObjective: "Branch, commit, and review infrastructure changes like application code.", estimatedHours: 3, suggestedProof: "A public GitHub repo with a maintained infrastructure-as-code project." },
    { canonicalName: "CI/CD", aliases: ["GitHub Actions", "Continuous Delivery"], category: "tool", priority: "critical", whyItMatters: "Cloud engineers are expected to automate infrastructure deployment, not run it by hand.", learningObjective: "Build a pipeline that validates and applies infrastructure changes automatically.", estimatedHours: 5, suggestedProof: "A pipeline that plans/applies an infrastructure-as-code change on push." },
    // --- Important ---
    { canonicalName: "Docker", aliases: ["Containerization"], category: "tool", priority: "important", whyItMatters: "Containers are the standard deployable unit across most cloud platforms.", learningObjective: "Containerize an application and deploy it to a cloud container service.", estimatedHours: 5, suggestedProof: "A containerized app running on a cloud container service (ECS/Cloud Run/similar)." },
    { canonicalName: "Kubernetes", aliases: ["K8s", "EKS", "GKE"], category: "tool", priority: "important", whyItMatters: "Common orchestration layer for teams running containers at any real scale.", learningObjective: "Deploy and manage a containerized app on a managed Kubernetes service.", estimatedHours: 8, suggestedProof: "A running deployment on a managed Kubernetes cluster (EKS/GKE/AKS)." },
    { canonicalName: "Cloud Security Basics", aliases: ["IAM", "Security Groups"], category: "technical", priority: "important", whyItMatters: "Misconfigured permissions are one of the most common causes of cloud breaches.", learningObjective: "Apply least-privilege IAM policies to cloud resources.", estimatedHours: 5, suggestedProof: "An IAM policy you wrote and justified for a specific real use case." },
    { canonicalName: "Monitoring & Logging", aliases: ["CloudWatch", "Observability"], category: "tool", priority: "important", whyItMatters: "You can't operate infrastructure reliably without visibility into it.", learningObjective: "Set up basic metrics, alarms, or log aggregation for a cloud resource.", estimatedHours: 4, suggestedProof: "A dashboard or alarm configuration for a real deployed cloud resource." },
    { canonicalName: "Cost Optimization Basics", aliases: ["Cloud Cost Management", "FinOps Basics"], category: "technical", priority: "important", whyItMatters: "Unmanaged cloud spend is a constant, visible business concern.", learningObjective: "Identify and reduce unnecessary cost in a cloud environment.", estimatedHours: 3, suggestedProof: "A before/after cost estimate showing a real optimization you made." },
    // --- Nice to have ---
    { canonicalName: "Serverless Basics", aliases: ["Lambda", "Cloud Functions"], category: "tool", priority: "nice_to_have", whyItMatters: "An increasingly common pattern for event-driven, low-ops workloads.", learningObjective: "Deploy a basic function that responds to an event.", estimatedHours: 4, suggestedProof: "A working serverless function deployed and triggered by a real event." },
    { canonicalName: "Python Scripting", aliases: ["Python Automation"], category: "technical", priority: "nice_to_have", whyItMatters: "Useful for automation beyond what shell scripts or IaC alone can express.", learningObjective: "Automate a cloud operations task with a Python script.", estimatedHours: 4, suggestedProof: "A Python script automating a real cloud management task." },
    { canonicalName: "Multi-Cloud Awareness", aliases: ["Cloud Portability Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "Shows the underlying concepts are understood, not just one provider's console.", learningObjective: "Explain the equivalent service across at least two cloud providers.", estimatedHours: 3, suggestedProof: "A comparison table of equivalent services across two cloud providers." },
    { canonicalName: "Disaster Recovery Basics", aliases: ["Backup Strategy Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "Shows awareness of reliability beyond the happy path.", learningObjective: "Design a basic backup and recovery plan for a cloud resource.", estimatedHours: 3, suggestedProof: "A one-page backup/recovery plan for a real deployed resource." },
  ],
  projects: [
    {
      title: "Infrastructure-as-Code Web App Deployment",
      description:
        "Provision a small web app's infrastructure (compute, networking, storage) entirely with Terraform on a cloud free tier, deployed via a CI/CD pipeline.",
      requiredSkills: ["Cloud Fundamentals", "Infrastructure as Code", "CI/CD"],
      deliverables: ["Terraform config in a public repo", "A working deployed app URL", "CI/CD pipeline that applies changes"],
      githubChecklist: [
        "README documents how to plan/apply/destroy the infrastructure",
        "No hardcoded secrets or credentials committed",
        "Pipeline validates changes before applying them",
      ],
    },
    {
      title: "Containerized App on Managed Kubernetes",
      description:
        "Containerize an application and deploy it to a managed Kubernetes cluster, with basic monitoring and a documented IAM/security setup.",
      requiredSkills: ["Docker", "Kubernetes", "Cloud Security Basics"],
      deliverables: ["A running deployment on a managed cluster", "Documented IAM policy", "A basic monitoring dashboard"],
      githubChecklist: [
        "README explains the deployment steps and cluster setup",
        "IAM policy follows least-privilege principles",
        "At least one metric or alert is configured",
      ],
    },
  ],
  resources: [
    { title: "AWS Free Tier documentation", url: "https://aws.amazon.com/free/", skill: "Cloud Fundamentals" },
    { title: "Terraform documentation", url: "https://developer.hashicorp.com/terraform/docs", skill: "Infrastructure as Code" },
    { title: "Kubernetes documentation", url: "https://kubernetes.io/docs/home/", skill: "Kubernetes" },
    { title: "AWS Well-Architected Framework", url: "https://aws.amazon.com/architecture/well-architected/", skill: "Cost Optimization Basics" },
    { title: "Docker Get Started", url: "https://docs.docker.com/get-started/", skill: "Docker" },
  ],
  cvEvidenceExamples: [
    "Provisioned a full web app's infrastructure with Terraform, deployed via CI/CD, cutting manual setup to zero.",
    "Deployed a containerized app to a managed Kubernetes cluster with monitoring and least-privilege IAM policies.",
    "Identified and eliminated unused cloud resources, reducing a personal project's monthly cost estimate by 60%.",
  ],
  jobDescriptionTemplate: `Cloud Engineer

We're looking for a Cloud Engineer to help design and maintain our cloud infrastructure.

Requirements:
- Solid experience with a major cloud provider (AWS, Azure, or GCP)
- Linux fundamentals and basic networking knowledge
- Experience with Infrastructure as Code (Terraform or similar)
- Familiarity with Git and CI/CD pipelines
- Understanding of cloud IAM and security basics

Nice to have:
- Docker and Kubernetes experience
- Monitoring/observability tooling
- Python scripting for automation
- Cost optimization experience`,
};

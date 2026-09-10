import { RoleTemplate } from "./types";

export const itSupportSpecialist: RoleTemplate = {
  id: "IT_SUPPORT_SPECIALIST",
  category: "IT & Support",
  label: "IT Support Specialist",
  shortLabel: "IT Support",
  description:
    "Keeps people productive by diagnosing and fixing hardware, software, account, and network issues quickly and clearly.",
  skills: [
    // --- Critical ---
    { canonicalName: "Troubleshooting Fundamentals", aliases: ["Systematic Troubleshooting"], category: "technical", priority: "critical", whyItMatters: "The core skill of the role: narrowing down a vague complaint to a root cause.", learningObjective: "Diagnose an issue methodically instead of guessing at fixes.", estimatedHours: 4, suggestedProof: "A troubleshooting log showing a step-by-step diagnosis of a real issue." },
    { canonicalName: "Operating Systems Basics", aliases: ["Windows Basics", "macOS Basics"], category: "technical", priority: "critical", whyItMatters: "Support tickets span whatever OS the user happens to be on.", learningObjective: "Navigate, configure, and troubleshoot both Windows and macOS confidently.", estimatedHours: 6, suggestedProof: "A write-up resolving a real settings or configuration issue on each OS." },
    { canonicalName: "Networking Basics", aliases: ["Wi-Fi Troubleshooting", "DNS Basics"], category: "technical", priority: "critical", whyItMatters: "A huge share of support tickets are actually connectivity issues.", learningObjective: "Diagnose common connectivity issues (Wi-Fi, DNS, VPN) methodically.", estimatedHours: 5, suggestedProof: "A write-up diagnosing a real connectivity issue to its root cause." },
    { canonicalName: "Ticketing Systems", aliases: ["Jira Service Desk", "Zendesk", "Freshdesk"], category: "tool", priority: "critical", whyItMatters: "Support work is tracked, prioritized, and measured through a ticketing system.", learningObjective: "Log, prioritize, and resolve tickets with clear documentation.", estimatedHours: 3, suggestedProof: "A set of well-documented resolved tickets with clear notes." },
    { canonicalName: "Customer Communication", aliases: ["Help Desk Communication"], category: "soft", priority: "critical", whyItMatters: "A correct fix delivered rudely or confusingly still feels like bad support.", learningObjective: "Explain a technical fix clearly and patiently to a non-technical user.", estimatedHours: 3, suggestedProof: "A sample support response explaining a fix in plain language." },
    { canonicalName: "Hardware Basics", aliases: ["PC Hardware", "Peripherals"], category: "technical", priority: "critical", whyItMatters: "Physical hardware issues are still a large share of on-site or remote support requests.", learningObjective: "Diagnose and resolve common hardware issues (peripherals, storage, boot problems).", estimatedHours: 4, suggestedProof: "A write-up diagnosing and resolving a real hardware issue." },
    // --- Important ---
    { canonicalName: "Active Directory Basics", aliases: ["AD Basics", "User Account Management"], category: "technical", priority: "important", whyItMatters: "Most organizations manage user accounts and permissions through Active Directory or similar.", learningObjective: "Create, modify, and troubleshoot user accounts and permissions.", estimatedHours: 4, suggestedProof: "A write-up of an account or permissions issue resolved in a lab AD environment." },
    { canonicalName: "Remote Support Tools", aliases: ["TeamViewer", "AnyDesk", "Remote Desktop"], category: "tool", priority: "important", whyItMatters: "A growing share of support is delivered remotely, not in person.", learningObjective: "Resolve an issue on a remote machine using remote support tooling.", estimatedHours: 3, suggestedProof: "A write-up of a real issue resolved via remote support tooling." },
    { canonicalName: "Basic Scripting for Automation", aliases: ["PowerShell Basics", "Batch Scripts"], category: "technical", priority: "important", whyItMatters: "Automating repetitive fixes scales one support person's impact across many tickets.", learningObjective: "Write a script that automates a repetitive support task.", estimatedHours: 4, suggestedProof: "A script that automates a real repetitive support task." },
    { canonicalName: "Cybersecurity Hygiene Basics", aliases: ["Phishing Awareness", "Password Policy Basics"], category: "technical", priority: "important", whyItMatters: "Support staff are often the first line of defense against social engineering.", learningObjective: "Recognize and respond correctly to common phishing or security-risk scenarios.", estimatedHours: 3, suggestedProof: "A short write-up of how you'd handle a real suspected phishing report." },
    { canonicalName: "Documentation Habits", aliases: ["Knowledge Base Articles"], category: "technical", priority: "important", whyItMatters: "Good documentation turns a one-time fix into something the whole team can reuse.", learningObjective: "Write a knowledge-base article that lets someone else solve the same issue.", estimatedHours: 3, suggestedProof: "A knowledge-base article for a real issue you resolved." },
    // --- Nice to have ---
    { canonicalName: "Cloud Productivity Suites", aliases: ["Google Workspace Admin", "Microsoft 365 Admin"], category: "tool", priority: "nice_to_have", whyItMatters: "Most companies run on Google Workspace or Microsoft 365, and IT manages both.", learningObjective: "Manage basic user and permission settings in a cloud productivity suite.", estimatedHours: 3, suggestedProof: "A write-up of a real admin task performed in Workspace or M365." },
    { canonicalName: "ITIL Basics", aliases: ["IT Service Management Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "A common framework larger IT organizations structure their processes around.", learningObjective: "Explain how incident, problem, and change management relate to daily support work.", estimatedHours: 3, suggestedProof: "A short write-up mapping your support work to ITIL processes." },
    { canonicalName: "Asset Management", aliases: ["IT Inventory"], category: "technical", priority: "nice_to_have", whyItMatters: "Organizations need to track who has what hardware and software.", learningObjective: "Maintain an accurate inventory of devices and licenses.", estimatedHours: 2, suggestedProof: "A sample asset inventory sheet with tracked devices and status." },
    { canonicalName: "Basic Networking Hardware", aliases: ["Routers", "Switches Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "Small-office IT support sometimes includes configuring basic network hardware.", learningObjective: "Configure a basic router or switch for a small network.", estimatedHours: 3, suggestedProof: "A write-up of a basic router/switch configuration for a home or lab network." },
  ],
  projects: [
    {
      title: "Support Ticket Portfolio",
      description:
        "Document 5-10 real or simulated support tickets end to end: the reported issue, your diagnosis steps, the fix, and a knowledge-base article for the most common one.",
      requiredSkills: ["Troubleshooting Fundamentals", "Ticketing Systems", "Documentation Habits"],
      deliverables: ["5-10 documented tickets", "One published knowledge-base article", "A short reflection on patterns you noticed"],
      githubChecklist: [
        "Each ticket shows a clear diagnostic path, not just the final fix",
        "Knowledge-base article is written for someone with no context",
        "Tickets cover more than one issue type (OS, network, account)",
      ],
    },
    {
      title: "Home Lab Active Directory + Automation Script",
      description:
        "Set up a small lab Active Directory environment, create and manage a few user accounts, and write a script that automates one repetitive account-management task.",
      requiredSkills: ["Active Directory Basics", "Basic Scripting for Automation"],
      deliverables: ["A documented lab AD setup", "A working automation script", "A short README explaining both"],
      githubChecklist: [
        "README explains the lab setup and what it demonstrates",
        "Script solves a real, specific repetitive task",
        "Account/permission changes are explained, not just performed",
      ],
    },
  ],
  resources: [
    { title: "Microsoft Learn — IT Support", url: "https://learn.microsoft.com/training/browse/?roles=administrator", skill: "Active Directory Basics" },
    { title: "Google IT Support Professional Certificate (syllabus)", url: "https://grow.google/certificates/it-support/", skill: "Troubleshooting Fundamentals" },
    { title: "PowerShell documentation", url: "https://learn.microsoft.com/powershell/", skill: "Basic Scripting for Automation" },
    { title: "ITIL Foundation overview", url: "https://www.axelos.com/certifications/itil-service-management", skill: "ITIL Basics" },
  ],
  cvEvidenceExamples: [
    "Resolved and documented 8 support tickets covering OS, network, and account issues, publishing 2 knowledge-base articles.",
    "Automated a repetitive account-provisioning task with a PowerShell script, saving significant manual time.",
    "Set up a lab Active Directory environment and diagnosed a permissions issue affecting a simulated user group.",
  ],
  jobDescriptionTemplate: `IT Support Specialist

We're looking for an IT Support Specialist to keep our team productive and unblocked.

Requirements:
- Strong troubleshooting skills across Windows and macOS
- Basic networking knowledge (Wi-Fi, DNS, VPN issues)
- Experience using a ticketing system
- Clear, patient communication with non-technical users
- Comfortable with basic hardware diagnostics

Nice to have:
- Active Directory or user account management experience
- Basic scripting (PowerShell) for automating tasks
- Experience with Google Workspace or Microsoft 365 admin
- Awareness of ITIL or IT service management concepts`,
};

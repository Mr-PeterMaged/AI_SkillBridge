import { RoleTemplate } from "./types";

export const cybersecurityAnalyst: RoleTemplate = {
  id: "CYBERSECURITY_ANALYST",
  category: "Security",
  label: "Cybersecurity Analyst",
  shortLabel: "Cybersecurity",
  description:
    "Monitors, detects, and responds to security threats, and helps harden systems before they're exploited.",
  skills: [
    // --- Critical ---
    { canonicalName: "Networking Basics", aliases: ["TCP/IP Basics", "DNS Basics"], category: "technical", priority: "critical", whyItMatters: "Almost every attack and defense mechanism happens at the network layer.", learningObjective: "Explain and inspect how traffic flows between hosts, ports, and services.", estimatedHours: 6, suggestedProof: "A packet-capture walkthrough explaining a real traffic exchange." },
    { canonicalName: "Linux Fundamentals", aliases: ["Linux Basics", "Shell Basics"], category: "technical", priority: "critical", whyItMatters: "Most security tooling and servers being defended or tested run on Linux.", learningObjective: "Navigate, inspect logs, and manage permissions on a Linux system confidently.", estimatedHours: 6, suggestedProof: "A write-up diagnosing a security-relevant issue purely from the Linux terminal." },
    { canonicalName: "Security Fundamentals", aliases: ["CIA Triad", "InfoSec Basics"], category: "technical", priority: "critical", whyItMatters: "The core mental model (confidentiality, integrity, availability) behind every security decision.", learningObjective: "Apply the CIA triad to evaluate real security tradeoffs.", estimatedHours: 4, suggestedProof: "A short write-up analyzing a real incident through the CIA triad lens." },
    { canonicalName: "Vulnerability Assessment", aliases: ["Vulnerability Scanning", "Nessus", "OpenVAS"], category: "technical", priority: "critical", whyItMatters: "Finding weaknesses before attackers do is the core proactive part of the job.", learningObjective: "Run a vulnerability scan and prioritize findings by real risk.", estimatedHours: 6, suggestedProof: "A vulnerability scan report on a lab environment with prioritized findings." },
    { canonicalName: "SIEM / Log Analysis", aliases: ["SIEM", "Splunk Basics", "Log Analysis"], category: "tool", priority: "critical", whyItMatters: "Detecting real attacks means reading through logs and alerts, not guessing.", learningObjective: "Investigate a suspicious event using log data and reach a conclusion.", estimatedHours: 6, suggestedProof: "A log-analysis writeup investigating a simulated suspicious event to a conclusion." },
    { canonicalName: "Incident Response Basics", aliases: ["IR Basics", "Playbooks"], category: "technical", priority: "critical", whyItMatters: "Detecting a threat is only half the job; responding correctly is the other half.", learningObjective: "Follow a basic incident response process from detection to containment.", estimatedHours: 4, suggestedProof: "A short incident-response report for a simulated breach scenario." },
    // --- Important ---
    { canonicalName: "Penetration Testing Basics", aliases: ["Ethical Hacking Basics", "OWASP ZAP", "Burp Suite"], category: "technical", priority: "important", whyItMatters: "Thinking like an attacker is what makes defensive recommendations credible.", learningObjective: "Find and document a real vulnerability in a legal practice environment (e.g. a CTF).", estimatedHours: 8, suggestedProof: "A writeup of a vulnerability found and exploited in a legal lab (HTB/TryHackMe)." },
    { canonicalName: "Cryptography Basics", aliases: ["Encryption Basics", "Hashing"], category: "technical", priority: "important", whyItMatters: "Nearly every security control relies on encryption or hashing done correctly.", learningObjective: "Explain when to use encryption vs. hashing and common failure modes.", estimatedHours: 4, suggestedProof: "A short write-up comparing 2 real-world uses of encryption and hashing." },
    { canonicalName: "Cloud Security Basics", aliases: ["AWS Security", "Cloud IAM"], category: "technical", priority: "important", whyItMatters: "Most infrastructure being secured today lives in the cloud, not on-prem.", learningObjective: "Identify and fix a misconfigured cloud permission or exposed resource.", estimatedHours: 5, suggestedProof: "A before/after fix of a misconfigured IAM policy or exposed cloud resource in a lab." },
    { canonicalName: "Security Compliance Basics", aliases: ["OWASP Top 10", "ISO 27001 Basics"], category: "technical", priority: "important", whyItMatters: "Many security decisions are driven by compliance frameworks, not just technical risk.", learningObjective: "Map real findings to a recognized framework like the OWASP Top 10.", estimatedHours: 3, suggestedProof: "A checklist mapping a small app's issues to OWASP Top 10 categories." },
    { canonicalName: "Scripting for Security", aliases: ["Python for Security", "Bash for Security"], category: "technical", priority: "important", whyItMatters: "Automating repetitive security checks scales an analyst's impact.", learningObjective: "Write a script that automates a repetitive security check.", estimatedHours: 5, suggestedProof: "A script that automates a scan, log check, or report generation task." },
    { canonicalName: "Git", aliases: ["Git/GitHub", "Version Control"], category: "tool", priority: "important", whyItMatters: "Security tooling and documentation increasingly live in version-controlled repos.", learningObjective: "Track and share security scripts/playbooks through Git.", estimatedHours: 3, suggestedProof: "A public GitHub repo with security scripts or a documented lab writeup." },
    // --- Nice to have ---
    { canonicalName: "Threat Intelligence Basics", aliases: ["OSINT Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "Understanding attacker behavior patterns helps prioritize defenses.", learningObjective: "Research a real threat actor or attack pattern and summarize it.", estimatedHours: 4, suggestedProof: "A short threat profile write-up based on public sources." },
    { canonicalName: "Malware Analysis Basics", aliases: ["Static Analysis Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "Even basic static analysis skills add real depth to an analyst's toolkit.", learningObjective: "Perform basic static analysis on a sample in a safe, isolated environment.", estimatedHours: 5, suggestedProof: "A write-up of a basic static analysis performed safely in a sandboxed VM." },
    { canonicalName: "Security Certifications Awareness", aliases: ["Security+", "CompTIA Security+"], category: "soft", priority: "nice_to_have", whyItMatters: "Shows structured, credentialed knowledge that many employers screen for.", learningObjective: "Understand the scope of an entry-level security certification.", estimatedHours: 2, suggestedProof: "A study plan or progress note toward a recognized certification." },
    { canonicalName: "Firewall / IDS Configuration", aliases: ["pfSense", "Snort", "Suricata"], category: "tool", priority: "nice_to_have", whyItMatters: "Hands-on configuration experience differentiates candidates from theory-only knowledge.", learningObjective: "Configure a basic firewall or intrusion detection rule set in a lab.", estimatedHours: 5, suggestedProof: "A lab write-up configuring firewall or IDS rules and testing them." },
  ],
  projects: [
    {
      title: "Home Lab Vulnerability Assessment",
      description:
        "Set up an isolated lab (e.g. VirtualBox VMs), run a vulnerability scan against an intentionally vulnerable machine, and produce a prioritized findings report with remediation steps.",
      requiredSkills: ["Vulnerability Assessment", "Networking Basics", "Security Fundamentals"],
      deliverables: ["A vulnerability report", "Lab setup documentation", "Prioritized remediation recommendations"],
      githubChecklist: [
        "README explains the lab setup and how it was isolated safely",
        "Findings are prioritized by real risk, not just scanner severity",
        "Report includes clear, actionable remediation steps",
      ],
    },
    {
      title: "Simulated Incident Investigation",
      description:
        "Using a log dataset (real or simulated), investigate a suspicious sequence of events, document the timeline, and write an incident report with containment recommendations.",
      requiredSkills: ["SIEM / Log Analysis", "Incident Response Basics"],
      deliverables: ["An incident report", "A timeline of the simulated event", "Containment recommendations"],
      githubChecklist: [
        "Timeline is reconstructed from log evidence, not assumptions",
        "Report follows a recognizable incident-response structure",
        "Recommendations are specific and actionable",
      ],
    },
  ],
  resources: [
    { title: "TryHackMe", url: "https://tryhackme.com/", skill: "Penetration Testing Basics" },
    { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", skill: "Security Compliance Basics" },
    { title: "Wireshark documentation", url: "https://www.wireshark.org/docs/", skill: "Networking Basics" },
    { title: "Splunk Fundamentals", url: "https://www.splunk.com/en_us/training.html", skill: "SIEM / Log Analysis" },
    { title: "NIST Incident Response Guide", url: "https://csrc.nist.gov/pubs/sp/800/61/r2/final", skill: "Incident Response Basics" },
  ],
  cvEvidenceExamples: [
    "Ran a vulnerability assessment on a home lab environment and produced a prioritized remediation report.",
    "Investigated a simulated security incident using log analysis, reconstructing the full attack timeline.",
    "Found and responsibly documented a privilege-escalation vulnerability in a legal CTF-style lab environment.",
  ],
  jobDescriptionTemplate: `Cybersecurity Analyst

We're looking for a Cybersecurity Analyst to help monitor, detect, and respond to threats.

Requirements:
- Solid networking and Linux fundamentals
- Understanding of core security concepts (CIA triad, common attack types)
- Experience with vulnerability scanning tools
- Ability to analyze logs and investigate suspicious activity
- Basic incident response process knowledge

Nice to have:
- Exposure to penetration testing (HTB/TryHackMe or similar)
- Scripting skills (Python/Bash) for automating security tasks
- Cloud security basics (AWS/Azure/GCP IAM)
- Progress toward a recognized security certification`,
};

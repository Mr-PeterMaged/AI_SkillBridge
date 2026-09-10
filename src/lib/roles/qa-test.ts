import { RoleTemplate } from "./types";

export const qaTestEngineer: RoleTemplate = {
  id: "QA_TEST_ENGINEER",
  category: "Quality & DevOps",
  label: "QA / Test Engineer",
  shortLabel: "QA / Test",
  description:
    "Finds and prevents bugs before users do, through structured manual testing and automated test suites.",
  skills: [
    // --- Critical ---
    { canonicalName: "Manual Testing", aliases: ["Exploratory Testing", "Functional Testing"], category: "technical", priority: "critical", whyItMatters: "The core skill every QA role starts with, before any automation.", learningObjective: "Explore an app systematically and find real defects, not just obvious ones.", estimatedHours: 5, suggestedProof: "A test session log listing at least 5 real bugs found in a real app." },
    { canonicalName: "Test Case Design", aliases: ["Test Cases", "Test Planning"], category: "technical", priority: "critical", whyItMatters: "Structured test cases make coverage repeatable instead of ad hoc.", learningObjective: "Write clear test cases covering happy paths, edge cases, and negative cases.", estimatedHours: 4, suggestedProof: "A test case document covering at least one feature end to end." },
    { canonicalName: "Bug Reporting", aliases: ["Defect Reporting", "Jira Basics"], category: "technical", priority: "critical", whyItMatters: "A bug that can't be reproduced from the report is a bug that won't get fixed.", learningObjective: "Write bug reports with clear repro steps, expected vs actual results, and severity.", estimatedHours: 3, suggestedProof: "A set of well-written bug reports for issues you found yourself." },
    { canonicalName: "Test Automation", aliases: ["Automated Testing", "Automation Basics"], category: "technical", priority: "critical", whyItMatters: "Manual-only testing doesn't scale; automation is expected in most junior QA roles today.", learningObjective: "Automate a repeatable UI or API test flow.", estimatedHours: 8, suggestedProof: "An automated test suite that runs and reports pass/fail without manual steps." },
    { canonicalName: "Selenium", aliases: ["Playwright", "Cypress", "WebDriver"], category: "tool", priority: "critical", whyItMatters: "The most common browser automation tools requested in junior QA postings.", learningObjective: "Automate a real user flow (login, form submit, navigation) in the browser.", estimatedHours: 8, suggestedProof: "A Selenium/Playwright/Cypress script automating a real login-and-action flow." },
    { canonicalName: "Git", aliases: ["Git/GitHub", "Version Control"], category: "tool", priority: "critical", whyItMatters: "Test code lives in the same repos as application code and needs the same workflow.", learningObjective: "Branch, commit, and open pull requests for test code.", estimatedHours: 3, suggestedProof: "A public GitHub profile with a test-automation repo and clear commits." },
    // --- Important ---
    { canonicalName: "API Testing", aliases: ["Postman", "REST Assured"], category: "tool", priority: "important", whyItMatters: "Many bugs live in the API layer, before anything reaches the UI.", learningObjective: "Test API endpoints for correct status codes, payloads, and error handling.", estimatedHours: 5, suggestedProof: "A Postman collection (or script) testing at least 5 API scenarios." },
    { canonicalName: "SQL", aliases: ["Structured Query Language"], category: "technical", priority: "important", whyItMatters: "QA engineers often verify data directly in the database, not just on screen.", learningObjective: "Write queries to verify that an action produced the correct database state.", estimatedHours: 4, suggestedProof: "A set of verification queries tied to specific test cases." },
    { canonicalName: "Regression Testing", aliases: ["Regression Suites"], category: "technical", priority: "important", whyItMatters: "New features regularly break old ones; regression coverage catches that early.", learningObjective: "Build and maintain a regression suite for core app flows.", estimatedHours: 5, suggestedProof: "A regression test suite covering at least 3 core user flows." },
    { canonicalName: "Agile Basics", aliases: ["Scrum Basics", "Sprint Testing"], category: "soft", priority: "important", whyItMatters: "Most QA work happens inside sprint cycles alongside developers.", learningObjective: "Fit testing activities into a sprint: story review, test planning, and sign-off.", estimatedHours: 3, suggestedProof: "A short write-up of how you tested a feature within a sprint-like timeline." },
    { canonicalName: "CI/CD", aliases: ["GitHub Actions", "Continuous Integration"], category: "tool", priority: "important", whyItMatters: "Automated tests are most valuable when they run on every code change automatically.", learningObjective: "Wire an automated test suite into a CI pipeline.", estimatedHours: 4, suggestedProof: "A green CI badge showing tests running automatically on push." },
    // --- Nice to have ---
    { canonicalName: "Performance Testing", aliases: ["Load Testing", "JMeter", "k6"], category: "tool", priority: "nice_to_have", whyItMatters: "Shows awareness of how an app behaves under real-world load, not just correctness.", learningObjective: "Run a basic load test and interpret the results.", estimatedHours: 4, suggestedProof: "A load test report with response-time and failure-rate numbers." },
    { canonicalName: "Accessibility Testing", aliases: ["a11y Testing"], category: "technical", priority: "nice_to_have", whyItMatters: "A growing expectation in QA scopes, especially for consumer products.", learningObjective: "Test a page against basic accessibility criteria.", estimatedHours: 3, suggestedProof: "An accessibility audit report for one real page." },
    { canonicalName: "Mobile Testing", aliases: ["Appium", "Device Testing"], category: "tool", priority: "nice_to_have", whyItMatters: "Adds coverage for teams shipping a mobile app alongside the web.", learningObjective: "Run a basic automated test against a mobile app or emulator.", estimatedHours: 5, suggestedProof: "A short automated test running against a mobile emulator." },
    { canonicalName: "Security Testing Basics", aliases: ["OWASP Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "Basic security awareness helps QA catch issues before a dedicated audit.", learningObjective: "Check an app for a few of the OWASP Top 10 issues.", estimatedHours: 3, suggestedProof: "A short write-up checking one app against 3 OWASP Top 10 items." },
  ],
  projects: [
    {
      title: "End-to-End Test Suite for a Public Demo App",
      description:
        "Pick a public demo site or your own app and write a Selenium/Playwright suite covering signup, login, and one core flow, wired into CI so it runs automatically.",
      requiredSkills: ["Test Automation", "Selenium", "CI/CD"],
      deliverables: ["Public GitHub repo with the test suite", "CI badge showing tests running on push", "A short README explaining coverage"],
      githubChecklist: [
        "README explains what's covered and how to run the suite locally",
        "At least 5 automated test cases across one full user flow",
        "Tests run automatically in CI on every push",
      ],
    },
    {
      title: "Manual + API Test Plan for a Real App",
      description:
        "Choose a real app (yours or a public one) and produce a full manual test plan plus a Postman collection testing its API, including at least 3 documented bugs found.",
      requiredSkills: ["Test Case Design", "Bug Reporting", "API Testing"],
      deliverables: ["Test case document", "Postman collection", "At least 3 real bug reports"],
      githubChecklist: [
        "Test cases cover happy path, edge cases, and negative cases",
        "Bug reports include clear repro steps and severity",
        "API tests cover both success and error responses",
      ],
    },
  ],
  resources: [
    { title: "Playwright documentation", url: "https://playwright.dev/docs/intro", skill: "Selenium" },
    { title: "Selenium documentation", url: "https://www.selenium.dev/documentation/", skill: "Selenium" },
    { title: "Postman Learning Center", url: "https://learning.postman.com/", skill: "API Testing" },
    { title: "Ministry of Testing — resources", url: "https://www.ministryoftesting.com/", skill: "Manual Testing" },
    { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", skill: "Security Testing Basics" },
  ],
  cvEvidenceExamples: [
    "Built an automated Playwright suite covering signup, login, and checkout, wired into CI and catching 2 regressions before release.",
    "Wrote a manual test plan and Postman API suite for a student project, finding and documenting 8 bugs before launch.",
    "Ran a basic load test on a class project's API and identified a bottleneck under concurrent requests.",
  ],
  jobDescriptionTemplate: `QA / Test Engineer

We're looking for a QA / Test Engineer to help us ship reliable software.

Requirements:
- Strong manual testing and test case design skills
- Ability to write clear, reproducible bug reports
- Basic experience with test automation (Selenium, Playwright, or Cypress)
- Comfortable testing APIs (Postman or similar)
- Familiarity with Git and Agile/Scrum workflows

Nice to have:
- CI/CD experience running automated tests
- Basic SQL for data verification
- Exposure to performance or accessibility testing
- Mobile testing experience`,
};

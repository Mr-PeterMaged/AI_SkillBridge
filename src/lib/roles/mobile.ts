import { RoleTemplate } from "./types";

export const mobileAppDeveloper: RoleTemplate = {
  id: "MOBILE_APP_DEVELOPER",
  category: "Software Development",
  label: "Mobile App Developer",
  shortLabel: "Mobile",
  description:
    "Builds cross-platform or native mobile apps, handling device-specific UI, offline behavior, and app store delivery.",
  skills: [
    // --- Critical ---
    { canonicalName: "JavaScript", aliases: ["JS", "Javascript", "ES6"], category: "technical", priority: "critical", whyItMatters: "The base language for React Native, the most requested cross-platform framework.", learningObjective: "Write component logic, handle async data, and manage app state.", estimatedHours: 8, suggestedProof: "A small interactive mobile screen built without a UI kit." },
    { canonicalName: "React Native", aliases: ["ReactNative", "Expo"], category: "technical", priority: "critical", whyItMatters: "The most requested cross-platform mobile framework in junior postings.", learningObjective: "Build multi-screen apps with navigation, forms, and lists.", estimatedHours: 10, suggestedProof: "A multi-screen app built with React Native/Expo, running on a real device." },
    { canonicalName: "Mobile UI Design", aliases: ["Mobile Layouts", "Touch-Friendly UI"], category: "technical", priority: "critical", whyItMatters: "Mobile screens have different constraints than the web: touch targets, safe areas, and small screens.", learningObjective: "Build layouts that respect safe areas and are comfortable to use with a thumb.", estimatedHours: 5, suggestedProof: "A screen recording showing a polished, touch-friendly UI on a real device." },
    { canonicalName: "APIs", aliases: ["REST APIs", "API Integration", "Fetch API"], category: "technical", priority: "critical", whyItMatters: "Almost no mobile app works fully offline; most fetch and sync real data.", learningObjective: "Fetch data from a public API and handle loading/error/empty states on mobile.", estimatedHours: 5, suggestedProof: "A mobile screen that fetches, caches, and displays real API data." },
    { canonicalName: "Navigation", aliases: ["React Navigation", "App Navigation"], category: "technical", priority: "critical", whyItMatters: "Multi-screen flows are the backbone of almost every real mobile app.", learningObjective: "Implement stack and tab navigation between multiple screens.", estimatedHours: 4, suggestedProof: "An app with at least 3 screens connected by working navigation." },
    { canonicalName: "Git", aliases: ["Git/GitHub", "Version Control"], category: "tool", priority: "critical", whyItMatters: "Every engineering team collaborates through Git; it's assumed knowledge.", learningObjective: "Branch, commit clearly, and open pull requests.", estimatedHours: 3, suggestedProof: "A public GitHub profile with regular, well-described commits." },
    // --- Important ---
    { canonicalName: "State Management", aliases: ["useState", "Context API", "Redux", "Zustand"], category: "technical", priority: "important", whyItMatters: "Real apps need to coordinate state across many screens and components.", learningObjective: "Manage shared state across screens without prop-drilling everywhere.", estimatedHours: 5, suggestedProof: "An app using Context or a state library for cross-screen data." },
    { canonicalName: "Offline Storage", aliases: ["AsyncStorage", "Local Persistence", "SQLite Mobile"], category: "technical", priority: "important", whyItMatters: "Good mobile apps stay usable with a flaky connection.", learningObjective: "Persist data locally so the app survives being closed or losing signal.", estimatedHours: 4, suggestedProof: "An app that keeps working (with cached data) after airplane mode is turned on." },
    { canonicalName: "Push Notifications", aliases: ["Notifications API"], category: "technical", priority: "important", whyItMatters: "A common requirement in real mobile job postings for user re-engagement.", learningObjective: "Configure and send a basic local or push notification.", estimatedHours: 3, suggestedProof: "A screen recording of a working push or local notification." },
    { canonicalName: "Testing", aliases: ["Unit Testing", "Jest", "Detox"], category: "technical", priority: "important", whyItMatters: "Shows you can ship mobile code that doesn't silently break on a real device.", learningObjective: "Write unit tests for components and core logic.", estimatedHours: 5, suggestedProof: "A test suite with a coverage report screenshot." },
    { canonicalName: "App Store Deployment", aliases: ["Play Store Deployment", "EAS Build", "TestFlight"], category: "tool", priority: "important", whyItMatters: "A mobile project only counts as proof if it can actually be installed and run.", learningObjective: "Build and share an installable version of the app (APK or TestFlight link).", estimatedHours: 4, suggestedProof: "A shareable install link or APK for a real build of your app." },
    { canonicalName: "Native Device APIs", aliases: ["Camera API", "Location API", "Permissions"], category: "technical", priority: "important", whyItMatters: "Differentiates real mobile apps from web pages wrapped in an app shell.", learningObjective: "Use at least one device capability (camera, location, or permissions) correctly.", estimatedHours: 4, suggestedProof: "A feature that uses the camera, GPS, or another device sensor with proper permission handling." },
    // --- Nice to have ---
    { canonicalName: "TypeScript", aliases: ["TS"], category: "technical", priority: "nice_to_have", whyItMatters: "Increasingly standard in production React Native codebases.", learningObjective: "Type components, props, and API responses in a mobile app.", estimatedHours: 6, suggestedProof: "A React Native component converted to TypeScript with no `any` types." },
    { canonicalName: "Performance Optimization", aliases: ["Mobile Performance", "FlatList Optimization"], category: "technical", priority: "nice_to_have", whyItMatters: "Janky scrolling or slow loads stand out immediately on mobile.", learningObjective: "Diagnose and fix a slow list or screen transition.", estimatedHours: 3, suggestedProof: "Before/after notes or a recording showing smoother scrolling after optimization." },
    { canonicalName: "Native Modules", aliases: ["Swift Basics", "Kotlin Basics"], category: "technical", priority: "nice_to_have", whyItMatters: "Shows awareness of what's happening below the cross-platform layer.", learningObjective: "Read or write a minimal native module bridge.", estimatedHours: 5, suggestedProof: "A short write-up or small demo of a native module you touched." },
    { canonicalName: "CI/CD", aliases: ["GitHub Actions", "EAS Update"], category: "tool", priority: "nice_to_have", whyItMatters: "Signals awareness of how real teams ship mobile builds safely.", learningObjective: "Set up a pipeline that runs tests or builds on every push.", estimatedHours: 3, suggestedProof: "A green CI badge in a GitHub README." },
  ],
  projects: [
    {
      title: "Habit / Task Tracker App",
      description:
        "A React Native (Expo) app where users create tasks, mark them complete, and see progress — persisted locally so it survives app restarts, with polished mobile-first UI.",
      requiredSkills: ["React Native", "Mobile UI Design", "Offline Storage", "Navigation"],
      deliverables: ["Installable build (APK or Expo Go link)", "Public GitHub repo with README", "Screen recording of the app in use"],
      githubChecklist: [
        "README explains the stack and how to run it locally",
        "Screen recording or GIF of the working app on a real device",
        "Data persists after closing and reopening the app",
      ],
    },
    {
      title: "Public API Explorer App",
      description:
        "A mobile app that fetches from a public API (weather, news, or similar), shows loading/error/empty states, and supports pull-to-refresh, demonstrating real-world data handling on mobile.",
      requiredSkills: ["APIs", "State Management", "Testing"],
      deliverables: ["Installable build", "Public GitHub repo", "At least 2 component or logic tests"],
      githubChecklist: [
        "README with setup instructions",
        "Handles API failure gracefully with a visible error state",
        "Pull-to-refresh or loading indicator implemented",
      ],
    },
  ],
  resources: [
    { title: "React Native official docs", url: "https://reactnative.dev/docs/getting-started", skill: "React Native" },
    { title: "Expo documentation", url: "https://docs.expo.dev/", skill: "React Native" },
    { title: "React Navigation docs", url: "https://reactnavigation.org/docs/getting-started", skill: "Navigation" },
    { title: "Expo Notifications guide", url: "https://docs.expo.dev/push-notifications/overview/", skill: "Push Notifications" },
    { title: "EAS Build documentation", url: "https://docs.expo.dev/build/introduction/", skill: "App Store Deployment" },
    { title: "React Native Testing Library", url: "https://callstack.github.io/react-native-testing-library/", skill: "Testing" },
  ],
  cvEvidenceExamples: [
    "Built and shipped a React Native habit tracker with offline persistence, installed and used by 15 classmates.",
    "Integrated a public REST API into a mobile app with graceful loading and error states, tested with RNTL.",
    "Configured push notifications and camera access in a React Native app, handling permissions correctly on both platforms.",
  ],
  jobDescriptionTemplate: `Mobile App Developer

We're looking for a Mobile App Developer to help build our cross-platform app.

Requirements:
- Solid JavaScript fundamentals
- Experience building apps with React Native (or willingness to learn quickly)
- Comfortable consuming REST APIs on mobile
- Understanding of mobile-specific UI constraints (touch targets, safe areas)
- Familiarity with Git and collaborative workflows

Nice to have:
- TypeScript
- Experience with offline storage and push notifications
- Exposure to native device APIs (camera, location)
- Experience publishing a build to TestFlight or the Play Store`,
};

import type { z } from "zod";
import type { quizSkillSchema } from "@/lib/validation/quiz";

export type QuizSkill = z.infer<typeof quizSkillSchema>;

export type QuizQuestion = {
  id: string;
  prompt: string;
  scenario?: string;
  options: Array<{ id: string; text: string }>;
  correctOptionId: string;
  explanation: string;
};

export type SkillQuizDefinition = {
  skill: QuizSkill;
  title: string;
  shortTitle: string;
  description: string;
  questions: QuizQuestion[];
};

export const SKILL_QUIZZES: SkillQuizDefinition[] = [
  {
    skill: "REACT_FUNDAMENTALS",
    title: "React fundamentals",
    shortTitle: "React",
    description: "Components, props, state, effects, and practical UI reasoning.",
    questions: [
      {
        id: "react-q1",
        prompt: "What is the main purpose of React state?",
        options: [
          { id: "a", text: "To store values that can change and re-render the UI" },
          { id: "b", text: "To permanently store database records" },
          { id: "c", text: "To style a component without CSS" },
          { id: "d", text: "To replace props in every component" },
        ],
        correctOptionId: "a",
        explanation: "State holds interactive values that change over time and cause React to update the UI.",
      },
      {
        id: "react-q2",
        prompt: "When should you usually create a reusable component?",
        options: [
          { id: "a", text: "When repeated UI has the same behavior or meaning" },
          { id: "b", text: "Before you understand what the UI needs" },
          { id: "c", text: "Only when a component has no props" },
          { id: "d", text: "Whenever a file is longer than 20 lines" },
        ],
        correctOptionId: "a",
        explanation: "A component is useful when it captures a repeated concept, not just because code exists.",
      },
      {
        id: "react-q3",
        prompt: "What does a controlled input use as its source of truth?",
        options: [
          { id: "a", text: "React state passed through value and onChange" },
          { id: "b", text: "Only the browser DOM value" },
          { id: "c", text: "The input placeholder" },
          { id: "d", text: "The submit button text" },
        ],
        correctOptionId: "a",
        explanation: "Controlled inputs read from React state and update that state through event handlers.",
      },
      {
        id: "react-q4",
        prompt: "Which value should be used as a stable key when rendering a list?",
        options: [
          { id: "a", text: "A durable item id from the data" },
          { id: "b", text: "Math.random()" },
          { id: "c", text: "The array index for every list" },
          { id: "d", text: "The display color" },
        ],
        correctOptionId: "a",
        explanation: "Stable data ids help React preserve item identity when lists change.",
      },
      {
        id: "react-q5",
        scenario: "A job tracker must fetch applications when the page opens.",
        prompt: "Where is client-side fetching commonly placed in a React component?",
        options: [
          { id: "a", text: "Inside an effect or a data-fetching abstraction" },
          { id: "b", text: "Directly inside a button className" },
          { id: "c", text: "Inside the package.json scripts field" },
          { id: "d", text: "In a CSS media query" },
        ],
        correctOptionId: "a",
        explanation: "Effects or framework data APIs are used for side effects like client-side fetching.",
      },
    ],
  },
  {
    skill: "TYPESCRIPT_FUNDAMENTALS",
    title: "TypeScript fundamentals",
    shortTitle: "TypeScript",
    description: "Basic types, object shapes, unions, and safer API data handling.",
    questions: [
      {
        id: "ts-q1",
        prompt: "What does TypeScript add to JavaScript?",
        options: [
          { id: "a", text: "Static type checking during development" },
          { id: "b", text: "A required database" },
          { id: "c", text: "Automatic deployment" },
          { id: "d", text: "A browser-only runtime" },
        ],
        correctOptionId: "a",
        explanation: "TypeScript checks types before runtime, helping catch mistakes earlier.",
      },
      {
        id: "ts-q2",
        prompt: "Which type is best for a value that can be either loading or loaded?",
        options: [
          { id: "a", text: "A union of explicit states" },
          { id: "b", text: "any everywhere" },
          { id: "c", text: "A string with no allowed values" },
          { id: "d", text: "A CSS class" },
        ],
        correctOptionId: "a",
        explanation: "Unions model known alternatives clearly and make invalid states harder to represent.",
      },
      {
        id: "ts-q3",
        prompt: "Why avoid unnecessary `any`?",
        options: [
          { id: "a", text: "It disables useful type checking for that value" },
          { id: "b", text: "It makes the app impossible to deploy" },
          { id: "c", text: "It only works in CSS files" },
          { id: "d", text: "It removes all runtime errors" },
        ],
        correctOptionId: "a",
        explanation: "`any` can be useful rarely, but it bypasses TypeScript's protection.",
      },
      {
        id: "ts-q4",
        prompt: "What does an interface or object type describe?",
        options: [
          { id: "a", text: "The expected shape of an object" },
          { id: "b", text: "The number of pages in an app" },
          { id: "c", text: "The color palette only" },
          { id: "d", text: "A Git branch" },
        ],
        correctOptionId: "a",
        explanation: "Object types describe which fields exist and what types those fields have.",
      },
      {
        id: "ts-q5",
        scenario: "An API returns `{ score: 74 }`.",
        prompt: "What is a good TypeScript type for this response?",
        options: [
          { id: "a", text: "{ score: number }" },
          { id: "b", text: "{ score: boolean }" },
          { id: "c", text: "string[]" },
          { id: "d", text: "HTMLElement" },
        ],
        correctOptionId: "a",
        explanation: "The response is an object with a numeric score field.",
      },
    ],
  },
  {
    skill: "REST_API_FUNDAMENTALS",
    title: "REST API fundamentals",
    shortTitle: "REST APIs",
    description: "HTTP methods, status codes, JSON, validation, and error states.",
    questions: [
      {
        id: "rest-q1",
        prompt: "Which HTTP method is most commonly used to create a new resource?",
        options: [
          { id: "a", text: "POST" },
          { id: "b", text: "GET" },
          { id: "c", text: "HEAD" },
          { id: "d", text: "OPTIONS" },
        ],
        correctOptionId: "a",
        explanation: "POST commonly submits data to create a resource or trigger a server-side operation.",
      },
      {
        id: "rest-q2",
        prompt: "What does a 404 status usually mean?",
        options: [
          { id: "a", text: "The requested resource was not found" },
          { id: "b", text: "The request succeeded" },
          { id: "c", text: "The server is asking for CSS" },
          { id: "d", text: "The client must use dark mode" },
        ],
        correctOptionId: "a",
        explanation: "404 means the server could not find the requested resource.",
      },
      {
        id: "rest-q3",
        prompt: "Why validate request bodies on the server?",
        options: [
          { id: "a", text: "Client input can be malformed or unsafe" },
          { id: "b", text: "It replaces authentication" },
          { id: "c", text: "It makes URLs shorter" },
          { id: "d", text: "It removes the need for a database" },
        ],
        correctOptionId: "a",
        explanation: "Server validation protects data quality and security even if the UI is bypassed.",
      },
      {
        id: "rest-q4",
        prompt: "What format is commonly used for REST API responses in web apps?",
        options: [
          { id: "a", text: "JSON" },
          { id: "b", text: "PSD" },
          { id: "c", text: "MP3" },
          { id: "d", text: "ZIP only" },
        ],
        correctOptionId: "a",
        explanation: "JSON is the common structured format for API requests and responses.",
      },
      {
        id: "rest-q5",
        scenario: "A request fails while saving evidence.",
        prompt: "What should the UI ideally show?",
        options: [
          { id: "a", text: "A clear, recoverable error message" },
          { id: "b", text: "Nothing at all" },
          { id: "c", text: "A fake success" },
          { id: "d", text: "The API key" },
        ],
        correctOptionId: "a",
        explanation: "Users need clear feedback and a safe way to retry.",
      },
    ],
  },
  {
    skill: "GIT_FUNDAMENTALS",
    title: "Git fundamentals",
    shortTitle: "Git",
    description: "Commits, branches, pull requests, and collaboration basics.",
    questions: [
      {
        id: "git-q1",
        prompt: "What does a Git commit represent?",
        options: [
          { id: "a", text: "A saved snapshot of changes with history" },
          { id: "b", text: "A cloud hosting invoice" },
          { id: "c", text: "A CSS animation" },
          { id: "d", text: "A database table only" },
        ],
        correctOptionId: "a",
        explanation: "Commits save a point in project history with a message and changed files.",
      },
      {
        id: "git-q2",
        prompt: "Why use a branch?",
        options: [
          { id: "a", text: "To work on changes separately before merging" },
          { id: "b", text: "To delete the repository" },
          { id: "c", text: "To minify JavaScript automatically" },
          { id: "d", text: "To replace code review" },
        ],
        correctOptionId: "a",
        explanation: "Branches isolate work so it can be reviewed and merged safely.",
      },
      {
        id: "git-q3",
        prompt: "What is a pull request commonly used for?",
        options: [
          { id: "a", text: "Reviewing and discussing changes before merge" },
          { id: "b", text: "Writing SQL queries in production" },
          { id: "c", text: "Serving images from CSS" },
          { id: "d", text: "Changing your computer password" },
        ],
        correctOptionId: "a",
        explanation: "Pull requests create a review space around a proposed change.",
      },
      {
        id: "git-q4",
        prompt: "What should a good commit message usually explain?",
        options: [
          { id: "a", text: "What changed and why" },
          { id: "b", text: "Only the time of day" },
          { id: "c", text: "Every file copied in full" },
          { id: "d", text: "A secret token" },
        ],
        correctOptionId: "a",
        explanation: "Commit messages help future readers understand the reason for a change.",
      },
      {
        id: "git-q5",
        scenario: "You are about to experiment with a new feature.",
        prompt: "What is a sensible first step?",
        options: [
          { id: "a", text: "Create a new branch" },
          { id: "b", text: "Edit production secrets" },
          { id: "c", text: "Delete package.json" },
          { id: "d", text: "Remove all tests" },
        ],
        correctOptionId: "a",
        explanation: "A branch keeps the experiment separate until it is ready.",
      },
    ],
  },
  {
    skill: "SQL_FUNDAMENTALS",
    title: "SQL fundamentals",
    shortTitle: "SQL",
    description: "SELECT, filtering, joins, aggregation, and data thinking.",
    questions: [
      {
        id: "sql-q1",
        prompt: "Which SQL statement reads data from a table?",
        options: [
          { id: "a", text: "SELECT" },
          { id: "b", text: "PUSH" },
          { id: "c", text: "STYLE" },
          { id: "d", text: "RENDER" },
        ],
        correctOptionId: "a",
        explanation: "SELECT queries rows and columns from database tables.",
      },
      {
        id: "sql-q2",
        prompt: "What does a WHERE clause do?",
        options: [
          { id: "a", text: "Filters rows by a condition" },
          { id: "b", text: "Changes the database password" },
          { id: "c", text: "Draws a chart" },
          { id: "d", text: "Creates a Git commit" },
        ],
        correctOptionId: "a",
        explanation: "WHERE narrows results to rows that match a condition.",
      },
      {
        id: "sql-q3",
        prompt: "Why use a JOIN?",
        options: [
          { id: "a", text: "To combine related rows from multiple tables" },
          { id: "b", text: "To deploy a frontend" },
          { id: "c", text: "To resize an image" },
          { id: "d", text: "To run CSS" },
        ],
        correctOptionId: "a",
        explanation: "JOINs connect related records, such as users and their analyses.",
      },
      {
        id: "sql-q4",
        prompt: "Which function counts rows?",
        options: [
          { id: "a", text: "COUNT" },
          { id: "b", text: "ROUND_BORDER" },
          { id: "c", text: "FETCH" },
          { id: "d", text: "PULL" },
        ],
        correctOptionId: "a",
        explanation: "COUNT aggregates the number of matching rows.",
      },
      {
        id: "sql-q5",
        scenario: "You need average readiness by target role.",
        prompt: "Which SQL concept is most relevant?",
        options: [
          { id: "a", text: "GROUP BY with an aggregate" },
          { id: "b", text: "A CSS grid" },
          { id: "c", text: "A Git tag only" },
          { id: "d", text: "A file upload input" },
        ],
        correctOptionId: "a",
        explanation: "GROUP BY lets you calculate aggregates per category.",
      },
    ],
  },
  {
    skill: "PYTHON_FUNDAMENTALS",
    title: "Python fundamentals",
    shortTitle: "Python",
    description: "Core syntax, data structures, functions, and practical scripts.",
    questions: [
      {
        id: "py-q1",
        prompt: "Which Python structure stores key-value pairs?",
        options: [
          { id: "a", text: "dict" },
          { id: "b", text: "list only" },
          { id: "c", text: "tuple only" },
          { id: "d", text: "print" },
        ],
        correctOptionId: "a",
        explanation: "A dict maps keys to values, such as skill names to scores.",
      },
      {
        id: "py-q2",
        prompt: "What does `def` do in Python?",
        options: [
          { id: "a", text: "Defines a function" },
          { id: "b", text: "Deletes a database" },
          { id: "c", text: "Installs a package" },
          { id: "d", text: "Creates a CSS class" },
        ],
        correctOptionId: "a",
        explanation: "`def` starts a function definition.",
      },
      {
        id: "py-q3",
        prompt: "What is a list comprehension useful for?",
        options: [
          { id: "a", text: "Building a new list from an iterable" },
          { id: "b", text: "Hosting an API key" },
          { id: "c", text: "Changing a font file" },
          { id: "d", text: "Creating a GitHub issue" },
        ],
        correctOptionId: "a",
        explanation: "List comprehensions transform or filter iterables into new lists.",
      },
      {
        id: "py-q4",
        prompt: "Why handle exceptions?",
        options: [
          { id: "a", text: "To respond gracefully when something fails" },
          { id: "b", text: "To hide all bugs forever" },
          { id: "c", text: "To replace tests" },
          { id: "d", text: "To make every variable global" },
        ],
        correctOptionId: "a",
        explanation: "Exception handling helps programs fail gracefully and recover when appropriate.",
      },
      {
        id: "py-q5",
        scenario: "A script reads CSV rows and computes totals.",
        prompt: "Which skill does this demonstrate?",
        options: [
          { id: "a", text: "Data processing with loops or comprehensions" },
          { id: "b", text: "CSS animation only" },
          { id: "c", text: "DNS configuration only" },
          { id: "d", text: "React component styling only" },
        ],
        correctOptionId: "a",
        explanation: "Reading rows and computing totals is a practical Python data-processing task.",
      },
    ],
  },
  {
    skill: "DATA_VISUALIZATION_FUNDAMENTALS",
    title: "Data visualization fundamentals",
    shortTitle: "Data viz",
    description: "Chart choice, labels, comparisons, accessibility, and honest interpretation.",
    questions: [
      {
        id: "viz-q1",
        prompt: "What is a bar chart especially good for?",
        options: [
          { id: "a", text: "Comparing values across categories" },
          { id: "b", text: "Storing passwords" },
          { id: "c", text: "Writing API routes" },
          { id: "d", text: "Compiling TypeScript" },
        ],
        correctOptionId: "a",
        explanation: "Bar charts make category comparisons easy to scan.",
      },
      {
        id: "viz-q2",
        prompt: "Why should charts have clear labels?",
        options: [
          { id: "a", text: "So viewers understand what the data represents" },
          { id: "b", text: "So the chart loads slower" },
          { id: "c", text: "So keyboard focus disappears" },
          { id: "d", text: "So the data changes automatically" },
        ],
        correctOptionId: "a",
        explanation: "Labels explain context, units, and meaning.",
      },
      {
        id: "viz-q3",
        prompt: "What is a misleading chart risk?",
        options: [
          { id: "a", text: "It can make the audience draw the wrong conclusion" },
          { id: "b", text: "It improves accessibility automatically" },
          { id: "c", text: "It validates API inputs" },
          { id: "d", text: "It creates a database table" },
        ],
        correctOptionId: "a",
        explanation: "Visualization choices affect interpretation, so charts should be honest and clear.",
      },
      {
        id: "viz-q4",
        prompt: "What helps make a chart more accessible?",
        options: [
          { id: "a", text: "A text summary of the key insight" },
          { id: "b", text: "Color-only meaning with no labels" },
          { id: "c", text: "Tiny unreadable axis text" },
          { id: "d", text: "Removing the chart title" },
        ],
        correctOptionId: "a",
        explanation: "A text alternative helps people who cannot perceive the visual chart.",
      },
      {
        id: "viz-q5",
        scenario: "You need to show readiness now versus target expectations.",
        prompt: "What should the visualization support?",
        options: [
          { id: "a", text: "A clear comparison between current and target values" },
          { id: "b", text: "Only decorative color" },
          { id: "c", text: "No labels or legend" },
          { id: "d", text: "A hidden score" },
        ],
        correctOptionId: "a",
        explanation: "The chart should help users compare current ability against the target role expectation.",
      },
    ],
  },
];

export function getSkillQuiz(skill: QuizSkill) {
  return SKILL_QUIZZES.find((quiz) => quiz.skill === skill);
}

export function quizStatus(score: number, total: number) {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio >= 0.8) return "STRONG_QUIZ_RESULT" as const;
  if (ratio >= 0.6) return "QUIZ_COMPLETED" as const;
  return "LEARNING" as const;
}

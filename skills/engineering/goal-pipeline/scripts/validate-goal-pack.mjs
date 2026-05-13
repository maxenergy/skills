#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const goalDir = path.join(root, "docs", "goal");
const required = ["PRD.md", "REQUIREMENTS.md", "NON_GOALS.md", "DESIGN.md", "IMPACT.md", "PLAN.md", "TASKS.md", "ACCEPTANCE.md", "VERIFY.md", "GOAL.md", "CODEX_START.md"];
const taskHeadings = ["Goal", "User-Visible Behavior", "Scope", "Files Likely Touched", "RED Test", "Expected Failure", "GREEN Boundary", "Refactor Allowance", "Verification Command", "Acceptance Criteria", "Rollback Condition", "Dependencies", "Do Not Touch"];

function read(rel) {
  return fs.readFileSync(path.join(goalDir, rel), "utf8");
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sectionBody(markdown, heading) {
  const re = new RegExp(
    `^#{1,6}\\s+${escapeRegex(heading)}\\s*\\n([\\s\\S]*?)(?=^#{1,6}\\s+|$(?![\\s\\S]))`,
    "m",
  );
  const match = markdown.match(re);
  return match ? match[1].trim() : null;
}

function taskBlocks(markdown) {
  const re = /^##\s+Task\s+\d+:[^\n]*\n[\s\S]*?(?=^##\s+Task\s+\d+:|$(?![\s\S]))/gm;
  return [...markdown.matchAll(re)].map((m) => m[0]);
}
const errors = [];
const fail = (message) => errors.push(message);

if (!fs.existsSync(goalDir)) {
  fail("Missing docs/goal directory");
} else {
  for (const file of required) {
    const full = path.join(goalDir, file);
    if (!fs.existsSync(full)) fail(`Missing docs/goal/${file}`);
    else if (!fs.readFileSync(full, "utf8").trim()) fail(`docs/goal/${file} is empty`);
  }

  const unknownPath = path.join(goalDir, "UNKNOWN.md");
  if (fs.existsSync(unknownPath)) {
    const unknown = fs.readFileSync(unknownPath, "utf8");
    if (/BLOCKING/i.test(unknown) && !/(no blocking|none|resolved)/i.test(unknown)) {
      fail("docs/goal/UNKNOWN.md appears to contain unresolved BLOCKING unknowns");
    }
  }

  if (fs.existsSync(path.join(goalDir, "TASKS.md"))) {
    const tasks = taskBlocks(read("TASKS.md"));
    if (tasks.length === 0) fail("docs/goal/TASKS.md must contain at least one `## Task N:` block");
    for (const [index, task] of tasks.entries()) {
      for (const heading of taskHeadings) {
        const body = sectionBody(task, heading);
        if (!body) fail(`Task ${index + 1} is missing section: ${heading}`);
        else if (/^<.*>$/.test(body) || body.includes("<command>") || body.includes("<Criterion>")) {
          fail(`Task ${index + 1} has placeholder content in section: ${heading}`);
        }
      }
    }
  }

  if (fs.existsSync(path.join(goalDir, "GOAL.md"))) {
    const goal = read("GOAL.md");
    for (const file of ["PRD.md", "REQUIREMENTS.md", "NON_GOALS.md", "DESIGN.md", "IMPACT.md", "PLAN.md", "TASKS.md", "ACCEPTANCE.md", "VERIFY.md"]) {
      if (!goal.includes(`docs/goal/${file}`)) fail(`GOAL.md does not reference docs/goal/${file}`);
    }
    if (!/Definition Of Done|Definition of Done/i.test(goal)) fail("GOAL.md is missing Definition of Done");
    if (!/RED/i.test(goal) || !/GREEN/i.test(goal)) fail("GOAL.md is missing TDD RED/GREEN rules");
  }

  if (fs.existsSync(path.join(goalDir, "CODEX_START.md"))) {
    const start = read("CODEX_START.md");
    if (!start.includes("/goal")) fail("CODEX_START.md must contain /goal");
    if (!start.includes("docs/goal/GOAL.md")) fail("CODEX_START.md must point at docs/goal/GOAL.md");
  }
}

for (const error of errors) process.stderr.write(`error: ${error}\n`);
if (errors.length) {
  process.stderr.write(`Goal pack validation failed with ${errors.length} error(s)\n`);
  process.exit(1);
}
process.stdout.write("Goal pack validation passed\n");

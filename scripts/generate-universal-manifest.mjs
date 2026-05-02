#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = path.resolve(import.meta.dirname, "..");
const skillsRoot = path.join(repoRoot, "skills");
const outDir = path.join(repoRoot, "manifests");
const outFile = path.join(outDir, "skills.json");
const claudeOutFile = path.join(outDir, "claude-plugin.generated.json");
const agentsOutFile = path.join(outDir, "AGENTS.generated.md");

const excludedBuckets = new Set(["deprecated"]);
const publicBuckets = new Set(["engineering", "productivity", "misc"]);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseFrontmatter(markdown, filePath) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    throw new Error(`${filePath} is missing YAML frontmatter`);
  }

  const raw = match[1];
  const data = {};
  const lines = raw.split(/\r?\n/);
  let currentKey = null;

  for (const line of lines) {
    const keyValue = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyValue) {
      currentKey = keyValue[1];
      const value = keyValue[2];
      data[currentKey] = value === ">" || value === "|" ? "" : value;
      continue;
    }

    if (currentKey && /^\s+/.test(line)) {
      data[currentKey] = `${data[currentKey]} ${line.trim()}`.trim();
    }
  }

  return data;
}

function relativeUnix(from, to) {
  return path.relative(from, to).split(path.sep).join("/");
}

function listResourceTypes(skillDir) {
  return ["references", "scripts", "assets", "adapters"].filter((name) =>
    fs.existsSync(path.join(skillDir, name)),
  );
}

function listLocalMarkdownReferences(markdown) {
  return [...markdown.matchAll(/\]\((?!https?:\/\/|#)([^)]+\.md)\)/g)]
    .map((match) => match[1])
    .filter((ref) => !ref.startsWith("/"))
    .sort();
}

function countMatches(markdown, pattern) {
  return [...markdown.matchAll(pattern)].length;
}

function generatedAt() {
  return process.env.SKILLS_GENERATED_AT || "1970-01-01T00:00:00.000Z";
}

function renderAgentsSnippet(skills) {
  const publicSkills = skills.filter((skill) => skill.distribution === "public");
  const lines = [
    "## Agent skills",
    "",
    "This repo provides portable agent skills. Load a skill when the user's request matches its description. After loading `SKILL.md`, follow its instructions and read sibling reference files only when needed.",
    "",
    "Skill source of truth: `manifests/skills.json`.",
    "",
    "### Available skills",
    "",
  ];

  for (const skill of publicSkills) {
    lines.push(`- \`${skill.name}\` (${skill.bucket}): ${skill.description}`);
  }

  lines.push(
    "",
    "### Loading rule",
    "",
    "When a skill triggers, read that skill's `SKILL.md` from the path listed in `manifests/skills.json`. Copy or preserve the whole skill directory when installing, because sibling Markdown files and scripts may be part of the skill.",
    "",
  );

  return `${lines.join("\n")}\n`;
}

function main() {
  const skillFiles = walk(skillsRoot).filter(
    (file) => path.basename(file) === "SKILL.md",
  );

  const skills = [];
  const names = new Set();

  for (const file of skillFiles) {
    const relParts = path.relative(skillsRoot, file).split(path.sep);
    const bucket = relParts[0];
    if (excludedBuckets.has(bucket)) continue;

    const skillDir = path.dirname(file);
    const markdown = fs.readFileSync(file, "utf8");
    const frontmatter = parseFrontmatter(markdown, relativeUnix(repoRoot, file));
    const { name, description } = frontmatter;

    if (!name || !description) {
      throw new Error(`${relativeUnix(repoRoot, file)} needs name and description`);
    }

    if (names.has(name)) {
      throw new Error(`Duplicate skill name: ${name}`);
    }
    names.add(name);

    const distribution = publicBuckets.has(bucket) ? "public" : "local";
    const localMarkdownReferences = listLocalMarkdownReferences(markdown);

    skills.push({
      name,
      bucket,
      distribution,
      description: description.replace(/\s+/g, " ").trim(),
      path: relativeUnix(repoRoot, skillDir),
      skillFile: relativeUnix(repoRoot, file),
      resources: listResourceTypes(skillDir),
      localMarkdownReferences,
      platformMentions: {
        claude: countMatches(markdown, /Claude|CLAUDE|claude/g),
        codex: countMatches(markdown, /Codex|CODEX|codex/g),
      },
    });
  }

  skills.sort((a, b) => a.name.localeCompare(b.name));

  const manifest = {
    schemaVersion: 1,
    generatedFrom: "skills/**/SKILL.md",
    generatedAt: generatedAt(),
    skills,
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`);

  const claudeManifest = {
    name: "mattpocock-skills",
    skills: skills
      .filter((skill) => skill.distribution === "public")
      .map((skill) => `./${skill.path}`),
  };
  fs.writeFileSync(claudeOutFile, `${JSON.stringify(claudeManifest, null, 2)}\n`);
  fs.writeFileSync(agentsOutFile, renderAgentsSnippet(skills));

  process.stdout.write(`Wrote ${relativeUnix(repoRoot, outFile)} (${skills.length} skills)\n`);
  process.stdout.write(
    `Wrote ${relativeUnix(repoRoot, claudeOutFile)} (${claudeManifest.skills.length} skills)\n`,
  );
  process.stdout.write(`Wrote ${relativeUnix(repoRoot, agentsOutFile)}\n`);
}

main();

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(repoRoot, "manifests", "skills.json");
const claudeManifestPath = path.join(repoRoot, "manifests", "claude-plugin.generated.json");
const claudePluginPath = path.join(repoRoot, ".claude-plugin", "plugin.json");
const agentsSnippetPath = path.join(repoRoot, "manifests", "AGENTS.generated.md");
const allowedExtraFrontmatter = new Set(["disable-model-invocation"]);
const publicBuckets = new Set(["engineering", "productivity", "misc"]);

function relativeUnix(from, to) {
  return path.relative(from, to).split(path.sep).join("/");
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    if (entry.isFile()) return [fullPath];
    return [];
  });
}

function parseFrontmatter(markdown, filePath) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    return { error: `${filePath} is missing YAML frontmatter`, fields: {} };
  }

  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const keyValue = line.match(/^([A-Za-z0-9_-]+):/);
    if (keyValue) fields[keyValue[1]] = true;
  }

  return { fields };
}

function parseFrontmatterValues(markdown, filePath) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    throw new Error(`${filePath} is missing YAML frontmatter`);
  }

  const data = {};
  let currentKey = null;

  for (const line of match[1].split(/\r?\n/)) {
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

function localMarkdownReferences(markdown) {
  const withoutFencedCode = markdown.replace(/```[\s\S]*?```/g, "");
  return [...withoutFencedCode.matchAll(/\]\((?!https?:\/\/|#)([^)]+\.md)(?:#[^)]+)?\)/g)].map(
    (match) => match[1],
  );
}

function buildExpectedManifests(skillFiles) {
  const skillsRoot = path.join(repoRoot, "skills");
  const skills = [];

  for (const file of skillFiles) {
    const relParts = path.relative(skillsRoot, file).split(path.sep);
    const bucket = relParts[0];
    if (bucket === "deprecated") continue;

    const markdown = fs.readFileSync(file, "utf8");
    const frontmatter = parseFrontmatterValues(markdown, relativeUnix(repoRoot, file));
    const skillDir = path.dirname(file);
    const distribution = publicBuckets.has(bucket) ? "public" : "local";

    skills.push({
      name: frontmatter.name,
      bucket,
      distribution,
      description: frontmatter.description.replace(/\s+/g, " ").trim(),
      path: relativeUnix(repoRoot, skillDir),
      skillFile: relativeUnix(repoRoot, file),
      resources: ["references", "scripts", "assets", "adapters"].filter((name) =>
        fs.existsSync(path.join(skillDir, name)),
      ),
      localMarkdownReferences: [
        ...markdown.matchAll(/\]\((?!https?:\/\/|#)([^)]+\.md)\)/g),
      ]
        .map((match) => match[1])
        .filter((ref) => !ref.startsWith("/"))
        .sort(),
      platformMentions: {
        claude: [...markdown.matchAll(/Claude|CLAUDE|claude/g)].length,
        codex: [...markdown.matchAll(/Codex|CODEX|codex/g)].length,
      },
    });
  }

  skills.sort((a, b) => a.name.localeCompare(b.name));

  const skillsManifest = {
    schemaVersion: 1,
    generatedFrom: "skills/**/SKILL.md",
    generatedAt: "1970-01-01T00:00:00.000Z",
    skills,
  };

  const claudeManifest = {
    name: "mattpocock-skills",
    skills: skills
      .filter((skill) => skill.distribution === "public")
      .map((skill) => `./${skill.path}`),
  };

  const agentsLines = [
    "## Agent skills",
    "",
    "This repo provides portable agent skills. Load a skill when the user's request matches its description. After loading `SKILL.md`, follow its instructions and read sibling reference files only when needed.",
    "",
    "Skill source of truth: `manifests/skills.json`.",
    "",
    "### Available skills",
    "",
  ];

  for (const skill of skills.filter((entry) => entry.distribution === "public")) {
    agentsLines.push(`- \`${skill.name}\` (${skill.bucket}): ${skill.description}`);
  }

  agentsLines.push(
    "",
    "### Loading rule",
    "",
    "When a skill triggers, read that skill's `SKILL.md` from the path listed in `manifests/skills.json`. Copy or preserve the whole skill directory when installing, because sibling Markdown files and scripts may be part of the skill.",
    "",
  );

  return {
    skillsJson: `${JSON.stringify(skillsManifest, null, 2)}\n`,
    claudeJson: `${JSON.stringify(claudeManifest, null, 2)}\n`,
    agentsMarkdown: `${agentsLines.join("\n")}\n`,
  };
}

function compareGeneratedFile(filePath, expected, errors) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing generated file: ${relativeUnix(repoRoot, filePath)}`);
    return;
  }

  const actual = fs.readFileSync(filePath, "utf8");
  if (actual !== expected) {
    errors.push(
      `${relativeUnix(repoRoot, filePath)} is out of date. Run scripts/generate-universal-manifest.mjs.`,
    );
  }
}

function compareJsonFile(filePath, expectedJson, errors) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing JSON file: ${relativeUnix(repoRoot, filePath)}`);
    return;
  }

  const actual = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const expected = JSON.parse(expectedJson);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    errors.push(
      `${relativeUnix(repoRoot, filePath)} does not match generated Claude plugin manifest.`,
    );
  }
}

function main() {
  const errors = [];
  const warnings = [];
  const skillsRoot = path.join(repoRoot, "skills");
  const skillFiles = walk(skillsRoot).filter((file) => path.basename(file) === "SKILL.md");
  const names = new Map();

  for (const file of skillFiles) {
    const rel = relativeUnix(repoRoot, file);
    const markdown = fs.readFileSync(file, "utf8");
    const { error, fields } = parseFrontmatter(markdown, rel);
    if (error) {
      errors.push(error);
      continue;
    }

    if (!fields.name) errors.push(`${rel} is missing frontmatter field: name`);
    if (!fields.description) errors.push(`${rel} is missing frontmatter field: description`);

    for (const field of Object.keys(fields)) {
      if (!["name", "description"].includes(field) && !allowedExtraFrontmatter.has(field)) {
        warnings.push(`${rel} has non-portable frontmatter field: ${field}`);
      }
    }

    const nameMatch = markdown.match(/\r?\nname:\s*([^\r\n]+)/);
    if (nameMatch) {
      const name = nameMatch[1].trim();
      if (names.has(name)) errors.push(`Duplicate skill name: ${name}`);
      names.set(name, rel);
    }

    for (const ref of localMarkdownReferences(markdown)) {
      const target = path.resolve(path.dirname(file), ref);
      if (!fs.existsSync(target)) {
        errors.push(`${rel} has broken Markdown link: ${ref}`);
      }
    }
  }

  if (!fs.existsSync(manifestPath)) {
    errors.push("Missing manifests/skills.json. Run scripts/generate-universal-manifest.mjs.");
  } else {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const manifestNames = new Set(manifest.skills.map((skill) => skill.name));
    for (const [name, rel] of names.entries()) {
      if (rel.includes("/deprecated/") || rel.includes("\\deprecated\\")) continue;
      if (!manifestNames.has(name)) {
        warnings.push(`${rel} is not present in manifests/skills.json`);
      }
    }
  }

  const expected = buildExpectedManifests(skillFiles);
  compareGeneratedFile(manifestPath, expected.skillsJson, errors);
  compareGeneratedFile(claudeManifestPath, expected.claudeJson, errors);
  compareJsonFile(claudePluginPath, expected.claudeJson, errors);
  compareGeneratedFile(agentsSnippetPath, expected.agentsMarkdown, errors);

  for (const warning of warnings) process.stdout.write(`warning: ${warning}\n`);
  for (const validationError of errors) process.stderr.write(`error: ${validationError}\n`);

  if (errors.length > 0) {
    process.stderr.write(`Validation failed with ${errors.length} error(s)\n`);
    process.exit(1);
  }

  process.stdout.write(`Validation passed (${skillFiles.length} skill files checked)\n`);
}

main();

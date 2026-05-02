#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const repoRoot = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(repoRoot, "manifests", "skills.json");

function parseArgs(argv) {
  const args = {
    target: null,
    dest: null,
    mode: "link",
    dryRun: false,
    includeLocal: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--target") args.target = argv[++i];
    else if (arg === "--dest") args.dest = argv[++i];
    else if (arg === "--mode") args.mode = argv[++i];
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--include-local") args.includeLocal = true;
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!args.target) args.target = "dir";
  if (!["claude", "codex", "dir"].includes(args.target)) {
    throw new Error("--target must be claude, codex, or dir");
  }
  if (!["link", "copy"].includes(args.mode)) {
    throw new Error("--mode must be link or copy");
  }
  if (args.target === "dir" && !args.dest) {
    throw new Error("--dest is required when --target dir");
  }

  return args;
}

function printHelp() {
  process.stdout.write(`Usage:
  node scripts/install-skills.mjs --target codex [--dry-run] [--mode link|copy]
  node scripts/install-skills.mjs --target claude [--dry-run] [--mode link|copy]
  node scripts/install-skills.mjs --target dir --dest ./vendor/skills [--dry-run]

Options:
  --include-local  Also install skills with distribution: "local"
  --mode copy      Copy directories instead of linking them
`);
}

function defaultDest(target) {
  if (target === "claude") return path.join(os.homedir(), ".claude", "skills");
  if (target === "codex") {
    return path.join(process.env.CODEX_HOME || path.join(os.homedir(), ".codex"), "skills");
  }
  throw new Error(`No default destination for target: ${target}`);
}

function removeDirectoryContents(dir) {
  for (const entry of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
}

function copyDirectory(src, dest) {
  if (fs.existsSync(dest)) {
    const stat = fs.lstatSync(dest);
    if (stat.isSymbolicLink()) {
      fs.rmSync(dest, { force: true });
    } else if (stat.isDirectory()) {
      removeDirectoryContents(dest);
    } else {
      throw new Error(`Refusing to overwrite non-directory: ${dest}`);
    }
  }

  fs.cpSync(src, dest, {
    recursive: true,
    force: true,
    filter: (candidate) => !candidate.includes(`${path.sep}node_modules${path.sep}`),
  });
}

function linkDirectory(src, dest) {
  if (fs.existsSync(dest)) {
    const stat = fs.lstatSync(dest);
    if (!stat.isSymbolicLink()) {
      throw new Error(`Refusing to replace non-symlink path: ${dest}`);
    }
    fs.rmSync(dest, { force: true });
  }

  fs.symlinkSync(src, dest, "junction");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const destRoot = path.resolve(args.dest || defaultDest(args.target));

  if (!fs.existsSync(manifestPath)) {
    throw new Error("Missing manifests/skills.json. Run generate-universal-manifest.mjs first.");
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const skills = manifest.skills.filter(
    (skill) => args.includeLocal || skill.distribution === "public",
  );

  if (args.dryRun) {
    process.stdout.write(`Would install ${skills.length} skills to ${destRoot}\n`);
  } else {
    fs.mkdirSync(destRoot, { recursive: true });
  }

  for (const skill of skills) {
    const src = path.join(repoRoot, skill.path);
    const dest = path.join(destRoot, skill.name);
    if (args.dryRun) {
      process.stdout.write(`${args.mode} ${src} -> ${dest}\n`);
      continue;
    }

    try {
      if (args.mode === "copy") copyDirectory(src, dest);
      else linkDirectory(src, dest);
      const verb = args.mode === "copy" ? "copied" : "linked";
      process.stdout.write(`${verb} ${skill.name} -> ${dest}\n`);
    } catch (error) {
      if (args.mode === "link") {
        process.stdout.write(`link failed for ${skill.name}; copying instead (${error.message})\n`);
        copyDirectory(src, dest);
        process.stdout.write(`copied ${skill.name} -> ${dest}\n`);
      } else {
        throw error;
      }
    }
  }
}

main();

#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const { CodexClient } = require('./codex-client');

const STATE_FILE = '.agent/worker-state.json';
const TASK_FILE = 'docs/goal/TASKS.md';
const MAX_RETRIES = Number(process.env.MAX_RETRIES || 2);

function loadTasks() {
  const content = fs.readFileSync(TASK_FILE, 'utf-8');
  return content.split('\n## ').slice(1).map((t, i) => ({ index: i, text: t.trim() }));
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return { index: 0, retries: {} };
  return JSON.parse(fs.readFileSync(STATE_FILE));
}

function saveState(state) {
  fs.mkdirSync('.agent', { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function gitDiff() {
  try {
    return execSync('git diff --name-only', { encoding: 'utf-8' });
  } catch {
    return '';
  }
}

function runVerify() {
  const cmd = process.env.VERIFY_COMMAND;
  if (!cmd) return { ok: true, output: '' };
  try {
    const out = execSync(cmd, { encoding: 'utf-8' });
    return { ok: true, output: out };
  } catch (e) {
    return { ok: false, output: e.stdout + '\n' + e.stderr };
  }
}

function failurePrompt(task, verify, diff) {
  return `Fix this task failure:\n\nTask:\n${task.text}\n\nVerification:\n${verify.output}\n\nDiff:\n${diff}`;
}

async function main() {
  const tasks = loadTasks();
  const state = loadState();
  const client = new CodexClient();

  await client.start();

  while (state.index < tasks.length) {
    const task = tasks[state.index];
    const retry = state.retries[task.index] || 0;

    console.log(`Task ${state.index + 1}/${tasks.length}`);

    await client.runTurn(task.text);

    const verify = runVerify();
    const diff = gitDiff();

    if (!verify.ok) {
      if (retry >= MAX_RETRIES) {
        console.error('Max retries reached');
        process.exit(1);
      }

      state.retries[task.index] = retry + 1;
      saveState(state);

      await client.runTurn(failurePrompt(task, verify, diff));
      continue;
    }

    state.index++;
    saveState(state);
  }

  console.log('Done');
  await client.stop();
}

main();

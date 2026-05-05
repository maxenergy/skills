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

function runVerify() {
  const cmd = process.env.VERIFY_COMMAND;
  if (!cmd) return { ok: true };
  try {
    execSync(cmd, { stdio: 'inherit' });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

async function main() {
  const tasks = loadTasks();
  const state = loadState();
  const client = new CodexClient();

  await client.start();

  while (state.index < tasks.length) {
    const task = tasks[state.index];
    const retry = state.retries[task.index] || 0;

    console.log(`Task ${state.index + 1}/${tasks.length} retry ${retry}`);

    await client.runTurn(task.text);

    const verify = runVerify();

    if (!verify.ok) {
      if (retry >= MAX_RETRIES) {
        console.error('Max retries reached');
        process.exit(1);
      }

      state.retries[task.index] = retry + 1;
      saveState(state);

      await client.runTurn(`Fix failure for task:\n${task.text}`);
      continue;
    }

    state.index++;
    saveState(state);
  }

  console.log('Done');
  await client.stop();
}

main();

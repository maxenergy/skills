#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

const STATE_FILE = '.agent/worker-state.json';
const TASK_FILE = 'docs/goal/TASKS.md';

function loadTasks() {
  if (!fs.existsSync(TASK_FILE)) {
    console.error('No TASKS.md found');
    process.exit(1);
  }
  const content = fs.readFileSync(TASK_FILE, 'utf-8');
  return content.split('\n## ').slice(1).map(t => t.trim());
}

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return { index: 0 };
  return JSON.parse(fs.readFileSync(STATE_FILE));
}

function saveState(state) {
  fs.mkdirSync('.agent', { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function runVerify() {
  const cmd = process.env.VERIFY_COMMAND;
  if (!cmd) return true;
  try {
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

function main() {
  const tasks = loadTasks();
  const state = loadState();

  while (state.index < tasks.length) {
    console.log(`Running task ${state.index + 1}/${tasks.length}`);

    // Placeholder for Codex execution
    console.log('>>> TODO: send task to Codex app-server');

    const ok = runVerify();

    if (!ok) {
      console.log('Verification failed, retry required');
      break;
    }

    state.index++;
    saveState(state);
  }

  if (state.index === tasks.length) {
    console.log('All tasks complete');
  }
}

main();

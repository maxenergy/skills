const { spawn } = require('child_process');

class CodexClient {
  constructor() {
    this.proc = null;
    this.id = 0;
  }

  async start() {
    this.proc = spawn('codex', ['app-server'], { stdio: ['pipe', 'pipe', 'inherit'] });

    this.proc.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const msg = JSON.parse(line);
          if (msg.method === 'turn/completed') {
            console.log('Codex turn completed');
          }
        } catch {}
      }
    });

    this.send({ method: 'initialize', id: this.nextId(), params: {} });
    this.send({ method: 'initialized', params: {} });

    this.send({ method: 'thread/start', id: this.nextId(), params: {} });
  }

  nextId() {
    return ++this.id;
  }

  send(msg) {
    this.proc.stdin.write(JSON.stringify(msg) + '\n');
  }

  async runTurn(text) {
    this.send({
      method: 'turn/start',
      id: this.nextId(),
      params: {
        threadId: 'main',
        input: [{ type: 'text', text }],
      },
    });

    await new Promise((r) => setTimeout(r, 3000));
  }

  async stop() {
    this.proc.kill();
  }
}

module.exports = { CodexClient };

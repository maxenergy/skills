const { spawn } = require('child_process');
const { EventEmitter } = require('events');

class CodexClient extends EventEmitter {
  constructor(options = {}) {
    super();
    this.proc = null;
    this.id = 0;
    this.buffer = '';
    this.threadId = options.threadId || `worker-${Date.now()}`;
    this.command = options.command || process.env.CODEX_COMMAND || 'codex app-server';
    this.turnTimeoutMs = Number(process.env.CODEX_TURN_TIMEOUT_MS || 20 * 60 * 1000);
  }

  async start() {
    const [cmd, ...args] = this.command.split(/\s+/);
    this.proc = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });

    this.proc.stderr.on('data', (data) => {
      process.stderr.write(`[codex] ${data}`);
    });

    this.proc.stdout.on('data', (data) => {
      this.buffer += data.toString();
      let index;
      while ((index = this.buffer.indexOf('\n')) >= 0) {
        const line = this.buffer.slice(0, index).trim();
        this.buffer = this.buffer.slice(index + 1);
        if (line) this.handleLine(line);
      }
    });

    this.proc.on('exit', (code, signal) => {
      this.emit('exit', { code, signal });
    });

    this.send({ method: 'initialize', id: this.nextId(), params: {} });
    this.send({ method: 'initialized', params: {} });
    this.send({ method: 'thread/start', id: this.nextId(), params: { threadId: this.threadId } });
  }

  handleLine(line) {
    try {
      const msg = JSON.parse(line);
      this.emit('message', msg);
      if (msg.method) this.emit(msg.method, msg);
    } catch (error) {
      this.emit('raw', line);
    }
  }

  nextId() {
    return ++this.id;
  }

  send(msg) {
    if (!this.proc || !this.proc.stdin.writable) {
      throw new Error('Codex app-server is not running');
    }
    this.proc.stdin.write(JSON.stringify(msg) + '\n');
  }

  async runTurn(text) {
    const turnId = this.nextId();

    const completion = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error(`Codex turn timed out after ${this.turnTimeoutMs}ms`));
      }, this.turnTimeoutMs);

      const onCompleted = (msg) => {
        cleanup();
        resolve(msg);
      };

      const onExit = ({ code, signal }) => {
        cleanup();
        reject(new Error(`Codex app-server exited during turn: code=${code} signal=${signal}`));
      };

      const cleanup = () => {
        clearTimeout(timer);
        this.off('turn/completed', onCompleted);
        this.off('exit', onExit);
      };

      this.on('turn/completed', onCompleted);
      this.on('exit', onExit);
    });

    this.send({
      method: 'turn/start',
      id: turnId,
      params: {
        threadId: this.threadId,
        input: [{ type: 'text', text }],
      },
    });

    return completion;
  }

  async stop() {
    if (this.proc) this.proc.kill();
  }
}

module.exports = { CodexClient };

/* Browser integration checks using Chrome's native DevTools protocol. No npm install required. */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const browserPath = process.env.CHROME_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/chromium', '/usr/bin/google-chrome'].find(p => fs.existsSync(p));
if (!browserPath) throw new Error('Set CHROME_PATH to a Chromium browser executable.');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'tharindu-ui-'));
const server = require('../scripts/profile-server.cjs').createProfileServer({root,storeFile:null});
class CDP {
  constructor(socket) { this.socket = socket; this.next = 1; this.pending = new Map(); this.errors = []; socket.onmessage = event => { const message = JSON.parse(event.data); if (message.method === 'Runtime.exceptionThrown') this.errors.push(message.params.exceptionDetails); if (message.id) { const p = this.pending.get(message.id); this.pending.delete(message.id); if (message.error) p.reject(Error(JSON.stringify(message.error))); else p.resolve(message.result); } }; }
  send(method, params = {}) { return new Promise((resolve, reject) => { const id = this.next++; this.pending.set(id, { resolve, reject }); this.socket.send(JSON.stringify({ id, method, params })); }); }
  async evaluate(expression) { const result = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (result.exceptionDetails) throw Error(JSON.stringify(result.exceptionDetails)); return result.result.value; }
}
(async () => {
  let browser, cdp;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    browser = spawn(browserPath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--remote-allow-origins=*', '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore', windowsHide: true });
    let devtoolsPort;
    for (let i = 0; i < 100; i++) { try { devtoolsPort = Number(fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]); break; } catch { await sleep(100); } }
    if (!devtoolsPort) throw new Error('Chrome did not start a DevTools endpoint.');
    const target = await (await fetch(`http://127.0.0.1:${devtoolsPort}/json/new?http://127.0.0.1:${port}/`, { method: 'PUT' })).json();
    const socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; }); cdp = new CDP(socket);
    await cdp.send('Runtime.enable'); await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    for (let i = 0; i < 100; i++) { if (await cdp.evaluate("document.readyState === 'complete' && document.querySelectorAll('.tool-card').length === 18")) break; await sleep(100); }
    await require('./experience.cjs')(cdp,port,root);
  } finally {
    if (cdp) cdp.socket.close();
    if (browser) browser.kill();
    server.stopTracker();server.closeAllConnections();server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

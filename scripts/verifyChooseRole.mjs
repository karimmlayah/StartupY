const port = process.env.CDP_PORT || '9223';
const baseUrl = `http://127.0.0.1:${port}`;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const targets = await fetch(`${baseUrl}/json`).then((response) => response.json());
const target = targets.find((item) => item.type === 'page' && item.url.includes('localhost:5175'));
if (!target) throw new Error('Choose Role browser target was not found.');

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 0;
const pending = new Map();
const runtimeErrors = [];

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
    return;
  }
  if (message.method === 'Runtime.exceptionThrown') {
    runtimeErrors.push(message.params.exceptionDetails?.text || 'Runtime exception');
  }
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
    runtimeErrors.push(message.params.args.map((arg) => arg.value || arg.description).join(' '));
  }
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
};

const waitFor = async (predicate, label, timeout = 10000) => {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await predicate()) return;
    await delay(150);
  }
  throw new Error(`Timed out waiting for ${label}.`);
};

await send('Runtime.enable');

const visitAsUnassigned = async (id, email) => {
  const user = JSON.stringify({ id, email, full_name: 'Test Bidaya', role: null, avatar_url: '' });
  const token = `role-${Date.now()}`;
  await evaluate(`localStorage.setItem('bidaya_demo_auth_user', ${JSON.stringify(user)}); location.href=${JSON.stringify(`/choose-role?test=${token}`)};`);
  try {
    await waitFor(async () => {
      const state = await evaluate(`({ path: location.pathname, search: location.search, text: document.body.innerText })`);
      return state.path === '/choose-role' && state.search.includes(token) && state.text.includes('Comment souhaitez-vous utiliser Bidaya Tunisia ?');
    }, 'the visible role selection page');
  } catch (error) {
    const state = await evaluate(`({ path: location.pathname, search: location.search, text: document.body.innerText, html: document.body.innerHTML.slice(0, 500) })`);
    throw new Error(`${error.message} Current state: ${JSON.stringify(state)} Console: ${runtimeErrors.join(' | ')}`);
  }
};

const choose = async (buttonText, expectedPath) => {
  const clicked = await evaluate(`(() => {
    const button = [...document.querySelectorAll('button')].find((item) => item.textContent.includes(${JSON.stringify(buttonText)}));
    if (!button || button.disabled) return false;
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error(`Enabled button not found: ${buttonText}`);
  await waitFor(async () => (await evaluate('location.pathname')) === expectedPath, expectedPath);
};

await visitAsUnassigned('demo_choose_founder', 'choose-founder@bidaya.local');
const rolePageText = await evaluate('document.body.innerText');
for (const expected of [
  'Je suis fondateur de startup',
  'Continuer comme fondateur',
  'Je suis investisseur',
  'Continuer comme investisseur',
]) {
  if (!rolePageText.includes(expected)) throw new Error(`Missing visible text: ${expected}`);
}
await choose('Continuer comme fondateur', '/dashboard/startup');

await visitAsUnassigned('demo_choose_investor', 'choose-investor@bidaya.local');
await choose('Continuer comme investisseur', '/dashboard/investor');

if (runtimeErrors.length) throw new Error(`Browser console errors:\n${runtimeErrors.join('\n')}`);
console.log('Choose Role browser checks passed for founder and investor flows.');
socket.close();

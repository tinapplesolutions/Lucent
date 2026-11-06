/* Lucent Sentence Judge: a small AI model that runs on the phone, offline once downloaded.
   It reads a sentence and answers one question: is the word used correctly? */
// Transformers.js 4.3.2 (Apache 2.0), pinned; kept offline by Lucent's service worker after the first load
import { AutoTokenizer, AutoModelForCausalLM, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2/dist/transformers.min.js';

let MODEL = 'onnx-community/Qwen3.5-0.8B-Text-ONNX', EXT = true;
env.allowLocalModels = false;
env.useBrowserCache = true;
const LIB = new URL('./lib/', self.location).href;
env.backends.onnx.wasm.wasmPaths = { mjs: LIB + 'ort-wasm-simd-threaded.asyncify.mjs', wasm: LIB + 'ort-wasm-simd-threaded.asyncify.wasm' };
if (self.crossOriginIsolated) env.backends.onnx.wasm.numThreads = Math.min(4, (self.navigator.hardwareConcurrency || 2));

/* Chrome's processor engine lacks one compressed-lookup block this model uses; Lucent ships the same model
   graph with that block rebuilt from basic math (identical results), and swaps it in here. */
const WEB_GRAPH = { 'onnx-community/Qwen3.5-0.8B-Text-ONNX': 'qwen35-q4-web.onnx' };
const _fetch = (env.fetch || self.fetch).bind(self);
const patched = (input, init) => {
  const u = typeof input === 'string' ? input : (input && input.url) || String(input);
  for (const k in WEB_GRAPH) if (u.includes(k + '/resolve/main/onnx/model_q4.onnx') && !u.endsWith('_data')) return _fetch(LIB + WEB_GRAPH[k], init);
  return _fetch(input, init);
};
env.fetch = patched; self.fetch = patched;
let tok = null, model = null, device = null, YES = [], NO = [], loading = null;
const SYS = 'You are a strict English teacher checking how a student used a vocabulary word. Answer only Yes or No.';
const ask = (w, m, s) => `Word: "${w}"\nMeaning: ${m}\nStudent's sentence: "${s}"\n\nIs the word used correctly, with this meaning, and does the whole sentence make logical sense with that meaning? Answer Yes or No.`;

async function load(pref) {
  if (model && (!pref || pref === device)) return;
  if (model && pref && pref !== device) { try { await model.dispose(); } catch { } model = null; }
  if (loading) return loading;
  loading = (async () => {
    // add up download progress across the model's files
    const files = {};
    const progress = p => {
      if (p.status === 'progress' && p.total) { files[p.file] = [p.loaded, p.total]; }
      else if (p.status === 'done' && files[p.file]) { files[p.file][0] = files[p.file][1]; }
      else return;
      let a = 0, b = 0; for (const k in files) { a += files[k][0]; b += files[k][1]; }
      postMessage({ type: 'progress', loaded: a, total: b });
    };
    tok = await AutoTokenizer.from_pretrained(MODEL, { progress_callback: progress });
    let want = 'wasm';
    if (pref === 'webgpu' || !pref || pref === 'auto') { try { if (self.navigator.gpu) { const ad = await self.navigator.gpu.requestAdapter(); if (ad) want = 'webgpu'; } } catch { } }
    if (pref === 'wasm') want = 'wasm';
    const opts = d => ({ dtype: 'q4', device: d, use_external_data_format: EXT, progress_callback: progress });
    try { model = await AutoModelForCausalLM.from_pretrained(MODEL, opts(want)); device = want; }
    catch (e) { if (want !== 'webgpu') throw e; model = await AutoModelForCausalLM.from_pretrained(MODEL, opts('wasm')); device = 'wasm'; }
    const first = s => tok.encode(s, { add_special_tokens: false })[0];
    YES = [...new Set(['Yes', ' Yes', 'YES', 'yes'].map(first))];
    NO = [...new Set(['No', ' No', 'NO', 'no'].map(first))];
  })();
  try { await loading; } finally { loading = null; }
}
const lse = a => { const m = Math.max(...a); return m + Math.log(a.reduce((s, x) => s + Math.exp(x - m), 0)); };
async function score(word, meaning, sentence) {
  if (!model) await load();
  const msgs = [{ role: 'system', content: SYS }, { role: 'user', content: ask(word, meaning, sentence) }];
  const text = tok.apply_chat_template(msgs, { tokenize: false, add_generation_prompt: true }) + (/qwen3/i.test(MODEL) ? '<think>\n\n</think>\n\n' : '');
  const enc = tok(text);
  const out = await model(enc);
  const L = out.logits, T = L.dims[1], V = L.dims[2];
  const d = L.data, off = (T - 1) * V;
  return lse(YES.map(i => d[off + i])) - lse(NO.map(i => d[off + i]));
}

self.onmessage = async e => {
  const m = e.data || {};
  try {
    if (m.type === 'load') { if (m.model) { MODEL = m.model; EXT = !!m.ext; } await load(m.device); postMessage({ type: 'ready', id: m.id, device, threads: self.crossOriginIsolated }); }
    else if (m.type === 'score') { const t0 = performance.now(); const s = await score(m.word, m.meaning, m.sentence); postMessage({ type: 'score', id: m.id, score: s, ms: Math.round(performance.now() - t0), device }); }
  } catch (err) { postMessage({ type: 'error', id: m.id, message: String(err && err.message || err) }); }
};

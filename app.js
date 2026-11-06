/* Lucent — an offline dictionary and lexicon builder. By Tin Apple. */
'use strict';
const VERSION = '1.5.0';
const WHATS_NEW = [
  { v: '1.5.0', title: 'Today and Lexis, restyled', notes: ['Today now matches Discover: your word of the day shown in its card’s own material, a sleeker deck of new words, and Word Lore bound like a black book.', 'Lexis shows your stats at a glance, and each exercise is now a book on the shelf.'] },
  { v: '1.4.0', title: 'A new Discover', notes: ['Discover is redesigned: each category is now a bound book on your shelves, with a Word of the Moment to tempt you.', 'Recent look-ups sit just under the search bar, and the keyboard only opens when you tap it.', 'Plain meanings are now signed “Written in simple English by Lucent.”'] },
  { v: '1.3.1', title: 'Discover, seals and a new face', notes: ['Search is now Discover: look up any word, or explore eight categories — Literary, Business, Legal, Medical, Science, Everyday, Ornate and Whimsical. Each gives five words to learn, with a shuffle for five more.', 'Seals are now real wax seals, each showing what it’s for, from common wine-red to the legendary silver Eloquentia seal. Tap one in Profile to see it up close.', 'A new app icon: the Lucent wax seal. Your phone may take a few days to show it.', '180 more plain meanings, written for the new categories.'] },
  { v: '1.2.0', title: 'Clearer meanings', notes: ['A bigger dictionary: Wiktionary’s clearer meanings now sit alongside the old ones, which you can still open under “More meanings.”', 'Plain meanings: the first 400 words now have a simple-English meaning and example, written for Lucent. More arrive in future updates.', 'Many more words now have a confirmed pronunciation instead of an estimate (≈), and richer word origins.', 'New in Lexis: Synonym match — find the word that means the same, against a 10- or 5-second clock.', 'The dictionary refreshes once in the background (about 13 MB).'] },
  { v: '1.1.0', title: 'Cards you can hold', notes: ['Treasury cards now move like real cards: each one follows your finger, tilts, and settles into place.', 'Every word now shows its synonyms and its opposites (antonyms), below “Close in meaning.”', 'Meanings are now ordered by how commonly each is used.', 'The dictionary refreshes once in the background (about 9 MB) to add the new opposites.'] },
  { v: '1.0.1', title: 'Installing fixed', notes: ['Lucent now installs as its own app on your phone, separate from Manna.'] },
  { v: '1.0.0', title: 'Welcome to Lucent', notes: ['Your Treasury, Lexis practice, Word Lore and the full offline dictionary are ready.', 'Pronunciations marked ≈ are estimates; they are confirmed the first time you open the word while online.'] }
];

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem('lx.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('lx.' + k, JSON.stringify(v)); } catch { toast('Your phone’s storage for Lucent is full.'); } }
};
const ymd = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const dayIndex = (d = new Date()) => Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2026, 0, 1)) / 864e5);
function hash(s) { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let s = hash(seed) || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1e6) / 1e6; }; }
function shuffle(a, r = Math.random) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const toastQ = []; let toastBusy = false;
function toast(msg) { toastQ.push(msg); if (!toastBusy) nextToast(); }
function nextToast() {
  const msg = toastQ.shift(); if (!msg) { toastBusy = false; return; } toastBusy = true;
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => { t.remove(); nextToast(); }, toastQ.length ? 1700 : 2400);
}
const ICON = {
  speak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',
  mark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3z"/></svg>',
  markOn: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3z"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  flip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4z"/></svg>'
};

/* ---------- state ---------- */
let profile = store.get('profile', null);      // {name, photo, palate, level, created}
let treasury = store.get('treasury', {});      // word -> {a: added ms, c: correct, m: missed, s: seen ms, note, sent: []}
let stats = store.get('stats', { days: [], run: 0, best: 0, ok: 0, bad: 0 });
let seals = store.get('seals', {});
let passed = store.get('passed', []);
let enr = store.get('enr', {});
let settings = store.get('settings', { theme: 'day' });
const save = {
  profile: () => store.set('profile', profile), treasury: () => store.set('treasury', treasury), stats: () => store.set('stats', stats),
  seals: () => store.set('seals', seals), passed: () => store.set('passed', passed), enr: () => store.set('enr', enr), settings: () => store.set('settings', settings)
};

/* ---------- theme ---------- */
function applyTheme() {
  let t = settings.theme;
  if (t === 'auto') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
  document.documentElement.dataset.theme = t;
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = t === 'night' ? '#12110F' : '#F6F1E7';
}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);

/* ---------- dictionary ---------- */
const Dict = {
  idx: null, starts: null, cache: new Map(), words: null,
  async index() {
    if (!this.idx) { this.idx = await (await fetch('data/dict/index.json')).json(); this.starts = this.idx.map(x => x[0]); }
    return this.idx;
  },
  async shard(w) {
    await this.index();
    const k = w.toLowerCase(); let lo = 0, hi = this.starts.length - 1, ans = 0;
    while (lo <= hi) { const m = (lo + hi) >> 1; if (this.starts[m] <= k) { ans = m; lo = m + 1; } else hi = m - 1; }
    const f = this.idx[ans][1];
    let s = this.cache.get(f);
    if (!s) {
      const r = await fetch('data/dict/' + f);
      if (!r.ok) throw new Error('offline');
      s = await r.json(); this.cache.set(f, s);
      if (this.cache.size > 6) this.cache.delete(this.cache.keys().next().value);
    }
    return s;
  },
  async get(w) {
    if (!w) return null;
    try { const s = await this.shard(w); return s[w] || s[w.toLowerCase()] || null; } catch { return null; }
  },
  /* find the dictionary form: exact, then simple inflections */
  async lookup(q) {
    q = q.trim().toLowerCase().replace(/\s+/g, ' ');
    let e = await this.get(q); if (e) return [q, e];
    const tries = [];
    if (q.endsWith('ies')) tries.push(q.slice(0, -3) + 'y');
    if (q.endsWith('es')) tries.push(q.slice(0, -2));
    if (q.endsWith('s')) tries.push(q.slice(0, -1));
    if (q.endsWith('ied')) tries.push(q.slice(0, -3) + 'y');
    if (q.endsWith('ed')) tries.push(q.slice(0, -2), q.slice(0, -1), q.slice(0, -3));
    if (q.endsWith('ing')) tries.push(q.slice(0, -3), q.slice(0, -3) + 'e', q.slice(0, -4));
    if (q.endsWith('ly')) tries.push(q.slice(0, -2), q.slice(0, -3) + 'le');
    if (q.endsWith('er')) tries.push(q.slice(0, -2), q.slice(0, -1));
    if (q.endsWith('est')) tries.push(q.slice(0, -3), q.slice(0, -2));
    for (const t of tries) { if (t.length < 2) continue; e = await this.get(t); if (e) return [t, e]; }
    return [q, null];
  },
  async wordList() {
    if (!this.words) this.words = await (await fetch('data/words.json')).json();
    return this.words;
  },
  async prefix(q, n = 30) {
    const L = await this.wordList(); q = q.toLowerCase();
    let lo = 0, hi = L.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (L[m].toLowerCase() < q) lo = m + 1; else hi = m; }
    const out = [];
    for (let i = lo; i < L.length && out.length < n; i++) { if (!L[i].toLowerCase().startsWith(q)) break; out.push(L[i]); }
    return out;
  }
};
const Pool = {
  data: null, map: null, byRoot: null,
  async load() {
    if (this.data) return this.data;
    this.data = await (await fetch('data/pool.json')).json();
    this.map = new Map(); this.byRoot = new Map();
    this.data.words.forEach((r, i) => { this.map.set(r[0], r); if (r[3] >= 0) { if (!this.byRoot.has(r[3])) this.byRoot.set(r[3], []); this.byRoot.get(r[3]).push(r[0]); } });
    return this.data;
  }
};

/* ---------- pronunciation ---------- */
const VOW = new Set(['AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'ER', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW']);
const ONSET1 = new Set('B CH D DH F G HH JH K L M N P R S SH T TH V W Y Z ZH'.split(' '));
const ONSETS = new Set(['P L', 'B L', 'K L', 'G L', 'P R', 'B R', 'T R', 'D R', 'K R', 'G R', 'F R', 'TH R', 'SH R', 'F L', 'S L', 'S M', 'S N', 'S P', 'S T', 'S K', 'S W', 'T W', 'D W', 'K W', 'G W', 'S P L', 'S P R', 'S T R', 'S K R', 'S K W', 'P Y', 'B Y', 'K Y', 'G Y', 'F Y', 'M Y', 'V Y', 'HH Y', 'HH W', 'TH W', 'V R']);
const RV = { AA: 'ah', AE: 'a', AH: 'uh', AO: 'aw', AW: 'ow', AY: 'eye', EH: 'eh', ER: 'ur', EY: 'ay', IH: 'ih', IY: 'ee', OW: 'oh', OY: 'oy', UH: 'uu', UW: 'oo' };
const RVc = { AE: 'a', EH: 'e', IH: 'i', AH: 'u', UH: 'uu', AA: 'o', AY: 'y' };
const RC = { B: 'b', CH: 'ch', D: 'd', DH: 'th', F: 'f', G: 'g', HH: 'h', JH: 'j', K: 'k', L: 'l', M: 'm', N: 'n', NG: 'ng', P: 'p', R: 'r', S: 's', SH: 'sh', T: 't', TH: 'th', V: 'v', W: 'w', Y: 'y', Z: 'z', ZH: 'zh' };
const IPA_V = [['aɪ', 'AY'], ['aʊ', 'AW'], ['eɪ', 'EY'], ['oʊ', 'OW'], ['əʊ', 'OW'], ['ɔɪ', 'OY'], ['ɜːr', 'ER'], ['ɜr', 'ER'], ['ɝ', 'ER'], ['ɚ', 'ER0'], ['ər', 'ER0'], ['ɜ', 'ER'], ['ə', 'AH0'], ['ʌ', 'AH'], ['æ', 'AE'], ['ɑ', 'AA'], ['ɒ', 'AA'], ['ɔ', 'AO'], ['ɛ', 'EH'], ['e', 'EY'], ['ɪ', 'IH'], ['ᵻ', 'IH'], ['i', 'IY'], ['ʊ', 'UH'], ['u', 'UW'], ['o', 'OW'], ['a', 'AA'], ['ɐ', 'AH0']];
const IPA_C = [['tʃ', 'CH'], ['dʒ', 'JH'], ['ð', 'DH'], ['θ', 'TH'], ['ʃ', 'SH'], ['ʒ', 'ZH'], ['ŋ', 'NG'], ['ɹ', 'R'], ['r', 'R'], ['ɾ', 'T'], ['ɡ', 'G'], ['g', 'G'], ['j', 'Y'], ['ʍ', 'W'], ['x', 'K'], ['ɫ', 'L'], ['b', 'B'], ['d', 'D'], ['f', 'F'], ['h', 'HH'], ['k', 'K'], ['l', 'L'], ['m', 'M'], ['n', 'N'], ['p', 'P'], ['s', 'S'], ['t', 'T'], ['v', 'V'], ['w', 'W'], ['z', 'Z']];
const IPA_ALL = [...IPA_V, ...IPA_C].sort((a, b) => b[0].length - a[0].length);
/* IPA with stress marks → respelling like "EL-uh-kwuhnt" */
function ipaToRespell(ipa) {
  let s = ipa.normalize('NFD').replace(/[\/\[\]()ːˑ.̀-ͯ]/g, '').replace(/ /g, '').replace(/ɹ/g, 'r').replace(/ɝ/g, 'ɜr').replace(/ɚ/g, 'ər');
  const toks = []; let stress = '0';
  while (s.length) {
    if (s[0] === 'ˈ') { stress = '1'; s = s.slice(1); continue; }
    if (s[0] === 'ˌ') { stress = '2'; s = s.slice(1); continue; }
    const m = IPA_ALL.find(([k]) => s.startsWith(k));
    if (!m) { s = s.slice(1); continue; }
    for (const p of m[1].split(' ')) {
      const base = p.replace(/\d/, '');
      if (VOW.has(base)) { const st = /0/.test(p) ? '0' : stress; toks.push([base, st]); stress = '0'; } else toks.push([base, null]);
    }
    s = s.slice(m[0].length);
  }
  if (!toks.some(t => VOW.has(t[0]))) return null;
  if (!toks.some(t => t[1] === '1')) { const v = toks.find(t => VOW.has(t[0]) && !(t[0] === 'AH' && t[1] === '0')); if (v) v[1] = '1'; }
  return respellToks(toks);
}
function respellToks(toks) {
  const nuc = toks.map((t, i) => VOW.has(t[0]) ? i : -1).filter(i => i >= 0);
  const cuts = [0];
  for (let k = 0; k < nuc.length - 1; k++) {
    const a = nuc[k], b = nuc[k + 1], cons = toks.slice(a + 1, b).map(t => t[0]);
    let j = cons.length;
    for (let x = 0; x <= cons.length; x++) { const c = cons.slice(x); if (!c.length || (c.length === 1 ? ONSET1.has(c[0]) : ONSETS.has(c.join(' ')))) { j = x; break; } }
    cuts.push(a + 1 + j);
  }
  cuts.push(toks.length);
  const S = []; for (let i = 0; i < cuts.length - 1; i++) S.push(toks.slice(cuts[i], cuts[i + 1]));
  const SHORT = new Set(['AE', 'EH', 'IH', 'UH', 'AA']);
  for (let i = 0; i < S.length - 1; i++) {
    const v = S[i].find(t => VOW.has(t[0]));
    if (v && v[1] === '1' && SHORT.has(v[0]) && VOW.has(S[i][S[i].length - 1][0]) && S[i + 1].length && !VOW.has(S[i + 1][0][0])) S[i].push(S[i + 1].shift());
  }
  return S.map(syl => {
    const v = syl.find(t => VOW.has(t[0])); const closed = !VOW.has(syl[syl.length - 1][0]);
    let r = '';
    syl.forEach(([p, st], idx) => {
      if (VOW.has(p)) {
        const nxt = syl[idx + 1] && syl[idx + 1][0];
        if (p === 'AH' && st === '0') r += 'uh';
        else if (p === 'ER' && st === '0') r += 'er';
        else if (p === 'IH' && st === '0') r += closed ? 'i' : 'ih';
        else if (p === 'UH' && nxt === 'R') r += 'oo';
        else if (closed && RVc[p] && st !== '0') r += RVc[p];
        else if (p === 'AY' && r) r += 'y';
        else r += RV[p];
      } else r += RC[p] || '';
    });
    return v && v[1] === '1' ? r.toUpperCase() : r;
  }).join('-');
}
function pronOf(w, e) {
  const k = (w || '').toLowerCase();
  if (LX.PRON[k]) return { r: LX.PRON[k][0], i: LX.PRON[k][1], est: false };
  const x = enr[k];
  if (x && x.ipa) return { r: (x.resp || (e && e.p && !e.e ? e.p : '')).replace(/uu/g, 'oo').replace(/UU/g, 'OO') || null, i: x.ipa, est: false, audio: x.audio };
  if (e && e.p) return { r: e.p.replace(/uu/g, 'oo').replace(/UU/g, 'OO'), i: e.i, est: !!e.e };
  return null;
}

/* ---------- origin ---------- */
function originText(w, e) {
  if (e && e.et) return { html: esc(e.et).replace(/\b(Latin|Greek|French|German|Italian|Spanish|English|Norse|Dutch|Arabic|Persian|Sanskrit|Hebrew)\b ([^\s,.(“]+)/g, '$1 <i>$2</i>'), src: 'wiktionary' };
  const x = enr[(w || '').toLowerCase()];
  if (x && x.origin) return { html: esc(x.origin), src: 'online' };
  if (!e || !e.o || !e.o.length) return null;
  const eng = e.o.filter(o => o[1] === 'English'), other = e.o.filter(o => o[1] !== 'English');
  const parts = [];
  if (eng.length) parts.push('Formed in English from ' + eng.map(o => '<i>' + esc(o[0]) + '</i>').reverse().join(' + '));
  if (other.length) parts.push((parts.length ? 'from ' : 'From ') + other.map(o => esc(o[1]) + ' <i>' + esc(o[0]) + '</i>').join(', from '));
  let t = parts.join('; ');
  return { html: t + '.', src: 'offline' };
}
function originShort(e, w) {
  const x = enr[(w || '').toLowerCase()];
  if (e && e.o) { const o = e.o.find(o => o[1] !== 'English') || e.o[0]; if (o) return (o[1] === 'English' ? 'From ' : o[1] + ' ') + '<i>' + esc(o[0]) + '</i>'; }
  if (x && x.origin) return esc(x.origin.split(/[;:.]/)[0]).slice(0, 60);
  return '';
}

/* ---------- online enrichment (confirmed pronunciation, recording, origin) ---------- */
async function enrich(word) {
  const k = word.toLowerCase();
  const have = enr[k];
  if (have && (have.ipa || have.none) && Date.now() - (have.t || 0) < 30 * 864e5) return have;
  if (!navigator.onLine) return have || null;
  try {
    const r = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(k));
    if (!r.ok) { enr[k] = Object.assign({}, have, { t: Date.now(), none: 1 }); save.enr(); return enr[k]; }
    const j = await r.json();
    const ph = j.flatMap(x => x.phonetics || []);
    const withStress = ph.filter(p => p.text && /ˈ/.test(p.text));
    const us = ph.find(p => p.audio && /-us\.mp3$/.test(p.audio)) || ph.find(p => p.audio);
    let audio = us && us.audio ? (us.audio.startsWith('//') ? 'https:' + us.audio : us.audio) : null;
    let ipa = (withStress.find(p => p.audio === (us && us.audio)) || withStress[0] || {}).text || null;
    if (ipa && !ipa.startsWith('/')) ipa = '/' + ipa.replace(/^\[|\]$/g, '') + '/';
    const origin = (j.find(x => x.origin) || {}).origin || null;
    const rec = { t: Date.now() };
    if (ipa) { rec.ipa = ipa; rec.resp = ipaToRespell(ipa); }
    if (audio) rec.audio = audio;
    if (origin) rec.origin = origin.charAt(0).toUpperCase() + origin.slice(1);
    if (!ipa && !audio && !origin) rec.none = 1;
    enr[k] = rec; save.enr();
    if (audio && 'caches' in window) { try { const c = await caches.open('lucent-audio'); if (!(await c.match(audio))) c.put(audio, await fetch(audio, { mode: 'no-cors' })); } catch { } }
    return rec;
  } catch { return have || null; }
}
let voice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  const vs = speechSynthesis.getVoices();
  return vs.find(v => /en-US/i.test(v.lang) && /google/i.test(v.name)) || vs.find(v => /en-US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
}
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => { voice = pickVoice(); };
async function speak(word) {
  const x = enr[word.toLowerCase()];
  if (x && x.audio) {
    try { const a = new Audio(x.audio); await a.play(); return 'recording'; } catch { }
  }
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word); voice = voice || pickVoice(); if (voice) u.voice = voice; u.lang = 'en-US'; u.rate = 0.85;
    speechSynthesis.speak(u); return 'voice';
  }
  toast('Your phone has no voice available.'); return null;
}

/* ---------- levels, ranks, seals ---------- */
const lvlIdx = c => { let i = 0; LX.CARD_LEVELS.forEach((l, k) => { if ((c || 0) >= l.at) i = k; }); return i; };
function rankOf() {
  const score = Object.values(treasury).reduce((s, r) => s + lvlIdx(r.c) + 1, 0);
  const T = [0, 15, 50, 120, 250]; let i = 0; T.forEach((t, k) => { if (score >= t) i = k; });
  return { i, name: LX.RANKS[i], score, next: T[i + 1] };
}
function streak() {
  const days = new Set(stats.days || []); let n = 0; const d = new Date();
  if (!days.has(ymd(d))) d.setDate(d.getDate() - 1);
  while (days.has(ymd(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const RARITY = { first: 'Common', ten: 'Common', streak7: 'Common', hundred: 'Rare', fluent: 'Rare', scribe: 'Rare', streak30: 'Epic', perfect: 'Epic', silver: 'Legendary' };
function sealSVG(id, size) { return `<svg width="${size}" height="${size}" viewBox="0 0 200 200" aria-hidden="true">${(LX.SEAL_ART || {})[id] || ''}</svg>`; }
const sealQ = []; let exBusy = 0, sealShowing = false;
function award(id) {
  if (seals[id]) return;
  seals[id] = Date.now(); save.seals();
  sealQ.push(id); flushSeals();
}
/* seals wait until a practice session ends, so they never interrupt a timed answer */
function flushSeals() {
  if (exBusy || sealShowing || !sealQ.length) return;
  sealShowing = true; setTimeout(() => { if (exBusy || !sealQ.length) { sealShowing = false; return; } showSeal(sealQ[0], true); }, 500);
}
function endBusy() { exBusy = Math.max(0, exBusy - 1); setTimeout(flushSeals, 300); }
function showSeal(id, fresh) {
  const s = LX.SEALS.find(x => x.id === id); if (!s) return;
  const on = !!seals[id];
  const el = document.createElement('div'); el.className = 'sealpop';
  el.innerHTML = `<div class="sp-card${fresh ? ' fresh' : ''}${on ? '' : ' locked'}"><div class="micro" style="color:${on ? 'var(--acc)' : 'var(--muted)'}">${fresh ? 'Seal earned' : on ? 'Seal' : 'Not yet earned'} · ${RARITY[id]}</div>
    <div class="sp-art">${sealSVG(id, 200)}</div><div class="serif" style="font-size:32px;font-weight:500;line-height:1.1">${esc(s.n)}</div>
    <div class="muted" style="font-size:14px">${esc(s.d)}</div>${on ? `<div class="muted" style="font-size:12px">Earned ${new Date(seals[id]).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</div>` : ''}
    <button class="btn" id="spok" style="margin-top:8px">${fresh ? 'Splendid' : 'Close'}</button></div>`;
  const close = () => { closeTop(); };
  el.addEventListener('click', ev => { if (ev.target === el || ev.target.id === 'spok') close(); });
  pushOverlay(el, () => { if (fresh) { sealQ.shift(); sealShowing = false; flushSeals(); } });
  if (fresh && navigator.vibrate) { try { navigator.vibrate([20, 40, 30]); } catch { } }
}
function checkSeals() {
  const n = Object.keys(treasury).length;
  if (n >= 1) award('first'); if (n >= 10) award('ten'); if (n >= 100) award('hundred');
  const st = streak(); if (st >= 7) award('streak7'); if (st >= 30) award('streak30');
  const lv = Object.values(treasury).map(r => lvlIdx(r.c));
  if (lv.some(l => l >= 3)) award('fluent'); if (lv.some(l => l >= 4)) award('silver');
  if ((stats.best || 0) >= 10) award('perfect');
  const sents = Object.values(treasury).reduce((s, r) => s + (r.sent ? r.sent.length : 0), 0); if (sents >= 10) award('scribe');
}

/* ---------- treasury ---------- */
const inT = w => !!treasury[w.toLowerCase()];
function keep(w) {
  w = w.toLowerCase(); if (treasury[w]) return;
  treasury[w] = { a: Date.now(), c: 0, m: 0, s: 0 }; save.treasury(); checkSeals(); toast('Added to your Treasury');
}
function unkeep(w) { delete treasury[w.toLowerCase()]; save.treasury(); toast('Removed from your Treasury'); }

/* ---------- overlays & back button ---------- */
const stack = [];
function pushOverlay(el, onClose) {
  document.body.appendChild(el); stack.push({ el, onClose });
  history.pushState({ ov: stack.length }, '');
}
let skipPop = 0;
function closeTop(fromPop) {
  const top = stack.pop(); if (!top) return;
  top.el.remove(); top.onClose && top.onClose();
  if (!fromPop) { skipPop++; history.back(); }
}
window.addEventListener('popstate', () => { if (skipPop) { skipPop--; return; } if (stack.length) closeTop(true); });
function overlay(title, bodyHTML, opts = {}) {
  const el = document.createElement('div'); el.className = 'overlay';
  el.innerHTML = `<div class="ov-head"><button class="iconbtn" data-close aria-label="Back">${ICON.back}</button><div class="micro">${esc(title || '')}</div><div style="width:44px">${opts.right || ''}</div></div><div class="ov-body">${bodyHTML}</div>`;
  el.querySelector('[data-close]').onclick = () => closeTop();
  pushOverlay(el, opts.onClose);
  return el;
}

/* ---------- tabs ---------- */
let tab = 'today';
const view = $('#view');
function go(t) {
  tab = t; $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
  view.classList.toggle('flush', t === 'treasury');
  view.scrollTop = 0;
  ({ today: renderToday, search: renderSearch, discover: renderSearch, treasury: renderTreasury, lexis: renderLexis, profile: renderProfile })[t]();
}
$$('#tabs button').forEach(b => b.onclick = () => go(b.dataset.tab));
$('#searchBtn').onclick = () => go('discover');

/* ---------- word page ---------- */
function sensesHTML(e) {
  let lastPos = null, n = 0;
  return e.s.slice(0, 8).map(s => {
    n++;
    const head = s[0] !== lastPos ? `<div class="p">${esc(s[0])}</div>` : ''; lastPos = s[0];
    const ex = (s[2] || []).slice(0, 1).map(x => `<div class="x">“${esc(x)}”</div>`).join('');
    return `<div class="sense"><div class="n">${n}</div><div class="stack">${head}<div class="d">${esc(endDot(s[1]))}</div>${ex}</div></div>`;
  }).join('');
}
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const endDot = s => { s = cap(String(s || '').trim()); return /[.!?…)”"]$/.test(s) ? s : s + '.'; };
const plainOf = w => (LX.PLAIN && LX.PLAIN[(w || '').toLowerCase()]) || null;
/* one short, easy meaning: Lucent's plain meaning when written, else the first dictionary sense */
function shortDef(w, e) {
  const p = plainOf(w); if (p) return p[0];
  if (!e || !e.s || !e.s[0]) return '';
  let d = e.s[0][1].split('; ')[0].replace(/^\([^)]*\)\s*/, '');
  return endDot(d.replace(/[.;,:]$/, ''));
}
function pronHTML(w, e) {
  const p = pronOf(w, e);
  if (!p) return `<div class="pron"><b class="muted" style="font-size:14px">Pronunciation not available offline</b><span>${navigator.onLine ? 'Checking online…' : 'Connect once to fetch it'}</span></div>`;
  return `<div class="pron"><b>${esc(p.r || '')}${p.est ? '<span class="est" title="Estimated">≈ estimate</span>' : ''}</b><span>${esc(p.i || '')}</span></div>`;
}
async function openWord(q) {
  const el = overlay('', '<div class="hint" style="margin-top:40vh">Opening…</div>');
  const body = el.querySelector('.ov-body');
  let [w, e] = await Dict.lookup(q);
  if (!e && plainOf(q)) { w = q.trim().toLowerCase(); e = { s: [] }; }
  if (!e) { body.innerHTML = `<div class="sec"><h1 class="wp-word">${esc(q)}</h1><p class="muted">This word isn’t in the dictionary yet. Check the spelling, or try its plain form.</p></div>`; return; }
  const draw = () => {
    const o = originText(w, e);
    const uniq = (k, n) => [...new Set(e.s.slice(0, 3).flatMap(s => s[k] || []))].filter(x => x.toLowerCase() !== w).slice(0, n);
    const syn = uniq(3, 10), sim = uniq(5, 8).filter(x => !syn.includes(x)), ant = uniq(4, 8);
    const chips = (title, list) => list.length ? `<section class="sec"><div class="micro">${title}</div><div class="chips">${list.map(s => `<button class="chip" data-w="${esc(s)}">${esc(s)}</button>`).join('')}</div></section>` : '';
    const kept = inT(w);
    body.innerHTML = `
      <section class="stack" style="gap:6px">
        <div class="wp-pos">${esc(e.s[0] ? e.s[0][0] : '')}</div>
        <h1 class="wp-word">${esc(w)}</h1>
        <div class="row" style="margin-top:10px"><button class="speak" id="sp" aria-label="Hear it pronounced">${ICON.speak}</button>${pronHTML(w, e)}</div>
      </section>
      ${plainOf(w) ? `<section class="plain"><div class="micro" style="color:var(--acc)">Plain meaning</div><div class="pm">${esc(plainOf(w)[0])}</div><div class="x">“${esc(plainOf(w)[1])}”</div><div class="by">Written in simple English by Lucent</div></section>` : '<div class="hr" style="margin:20px 0"></div>'}
      ${e.s.length ? `${plainOf(w) ? '<div class="micro" style="margin:22px 0 12px">Dictionary meanings</div>' : ''}<section class="stack" style="gap:14px">${sensesHTML(e)}</section>` : ''}
      ${e.m && e.m.length ? `<details class="more"><summary>More meanings (${e.m.length})</summary><div class="stack" style="gap:10px;margin-top:12px">${e.m.map(s => `<div style="font-size:14px;line-height:1.5"><i class="muted">${esc(s[0])}</i> — ${esc(endDot(s[1]))}</div>`).join('')}</div></details>` : ''}
      ${o ? `<section class="origin" style="margin-top:20px"><div class="micro" style="color:var(--acc)">Origin</div><div class="t">${o.html}</div></section>` : ''}
      ${chips('Close in meaning', sim)}
      ${chips('Synonyms', syn)}
      ${chips('Antonyms · opposites', ant)}
      ${!sim.length && !syn.length && !ant.length ? '' : ''}
      <div style="height:20px"></div>
      <button class="btn${kept ? ' ghost' : ''}" id="keepBtn">${kept ? ICON.markOn + ' In your Treasury · ' + LX.CARD_LEVELS[lvlIdx(treasury[w].c)].n : ICON.mark + ' Add to Treasury'}</button>`;
    body.querySelector('#sp').onclick = () => speak(w);
    body.querySelector('#keepBtn').onclick = () => { if (inT(w)) { if (confirm('Remove “' + w + '” from your Treasury?')) unkeep(w); } else keep(w); draw(); };
    $$('.chips [data-w]', body).forEach(b => b.onclick = () => openWord(b.dataset.w));
  };
  draw();
  if (!LX.PRON[w] && (!enr[w] || !enr[w].t)) enrich(w).then(() => { if (document.body.contains(el)) draw(); });
}

/* ---------- search ---------- */
let lastQuery = '';
function renderSearch() {
  view.innerHTML = `<div class="micro" style="color:var(--acc)">Discover</div><h1 class="big" style="margin-top:6px">Find your next word.</h1>
    <label class="sbox" id="sbox"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="q" type="search" placeholder="Look up any word" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" aria-label="Look up a word" value="${esc(lastQuery)}"><button class="sclear${lastQuery ? '' : ' hidden'}" id="sclear" aria-label="Clear">${ICON.close}</button></label>
    <div class="results" id="res"></div>`;
  const q = $('#q'), res = $('#res');
  let tm;
  const run = async () => {
    const v = q.value.trim(); lastQuery = v;
    $('#sclear').classList.toggle('hidden', !v);
    if (!v) { res.innerHTML = recentHTML() + await spotlightHTML() + catsHTML(); bindRes(); bindCats(); bindSpot(); return; }
    let list;
    try { list = await Dict.prefix(v, 30); } catch { res.innerHTML = '<p class="muted" style="margin-top:20px">The word list hasn’t downloaded yet. Connect once to finish setting up.</p>'; return; }
    if (!list.length) { res.innerHTML = `<div class="rlist"><button data-w="${esc(v)}"><span class="w">${esc(v)}</span><span class="m">look up ${ICON.next}</span></button></div>`; bindRes(); return; }
    res.innerHTML = `<div class="rlist">${list.map(w => `<button data-w="${esc(w)}"><span class="w">${esc(w)}</span><span class="m">${inT(w) ? '<i class="tdot"></i>' : ''}${ICON.next}</span></button>`).join('')}</div>`;
    bindRes();
  };
  const bindRes = () => $$('#res [data-w]').forEach(b => b.onclick = () => { remember(b.dataset.w); openWord(b.dataset.w); });
  q.oninput = () => { clearTimeout(tm); tm = setTimeout(run, 120); };
  q.onkeydown = e => { if (e.key === 'Enter' && q.value.trim()) { remember(q.value.trim()); openWord(q.value.trim()); } };
  $('#sclear').onclick = ev => { ev.preventDefault(); q.value = ''; run(); };
  run();
}
/* each shelf is bound like a book in its own material */
const COVERS = {
  Literary: ['#3B2418', '#2A190F', '#F2E6D2', '#D9C3A0'], Business: ['#14261F', '#0C1A14', '#EADBB0', '#D7B96E'],
  Legal: ['#1B2433', '#121A26', '#E6E9EC', '#AEB8C6'], Medical: ['#ECE3D1', '#D9CDB4', '#1C1A17', '#6E1F2A'],
  Science: ['#22282E', '#171C21', '#E3E8EC', '#9FB4C2'], Everyday: ['#FBF8F1', '#E6DDCB', '#1C1A17', '#6E1F2A'],
  Ornate: ['#6E1F2A', '#4E141D', '#F6E9DA', '#E6CC86'], Whimsical: ['#0D0D0F', '#000000', '#E3E6EA', '#C7CCD1']
};
const coverStyle = n => { const [bg, sp, tx, ac] = COVERS[n]; return `--cv:${bg};--sp:${sp};--tx:${tx};--ac:${ac}`; };
function catsHTML() {
  return `<div class="row" style="justify-content:space-between;align-items:baseline;margin:28px 0 12px"><div class="micro">The shelves</div><div class="muted" style="font-size:12px">${LX.CATS.reduce((s, c) => s + c.w.split(' ').length, 0)} hand-picked words</div></div>
    <div class="cats">${LX.CATS.map((c, i) => `<button class="cover" data-c="${i}" style="${coverStyle(c.n)}"><span class="spine"></span>
      <span class="ctop"><span class="ccount">${c.w.split(' ').length} words</span><span class="cicon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${c.i}</svg></span></span>
      <span class="cbot"><span class="cname">${esc(c.n)}</span><span class="cex">${esc(c.w.split(' ')[0])}</span></span></button>`).join('')}</div>`;
}
function bindCats() { $$('#res .cover').forEach(b => b.onclick = () => openCategory(+b.dataset.c)); }
let spot = null;
async function spotlightHTML() {
  if (!spot) { const ci = Math.floor(Math.random() * LX.CATS.length), ws = LX.CATS[ci].w.split(' ').filter(w => !inT(w)); spot = { ci, w: ws[Math.floor(Math.random() * ws.length)] || LX.CATS[ci].w.split(' ')[0] }; }
  const c = LX.CATS[spot.ci], e = await Dict.get(spot.w), p = pronOf(spot.w, e);
  return `<div class="micro" style="margin:26px 0 12px">Word of the moment</div>
    <article class="spot" id="spot" style="${coverStyle(c.n)}"><div class="row" style="justify-content:space-between;align-items:center"><span class="stag">From ${esc(c.n)}</span><button class="iconbtn" id="spotNew" aria-label="Another word" style="color:var(--ac);width:36px;height:36px">${ICON.shuffle.replace('<svg', '<svg width="17" height="17"')}</button></div>
      <button class="sw" data-sw="${esc(spot.w)}"><span class="sword">${esc(spot.w)}</span>${p ? `<span class="spron">${esc(p.r || '')}${p.est ? ' ≈' : ''}</span>` : ''}<span class="smean">${esc(shortDef(spot.w, e))}</span></button>
      <div class="row" style="gap:10px;margin-top:4px"><button class="spbtn" id="spotKeep">${inT(spot.w) ? ICON.markOn + ' In your Treasury' : ICON.mark + ' Keep'}</button><button class="spbtn ghost" id="spotHear">${ICON.speak} Hear it</button></div></article>`;
}
function bindSpot() {
  const s = $('#spot'); if (!s) return;
  $('.sw', s).onclick = () => openWord(spot.w);
  $('#spotNew').onclick = async () => { spot = null; s.outerHTML = (await spotlightHTML()).replace(/^[\s\S]*?(<article)/, '$1'); bindSpot(); };
  $('#spotKeep').onclick = () => { if (!inT(spot.w)) { keep(spot.w); $('#spotKeep').innerHTML = ICON.markOn + ' In your Treasury'; } else openWord(spot.w); };
  $('#spotHear').onclick = () => speak(spot.w);
}
const catDecks = {};
async function openCategory(ci) {
  const c = LX.CATS[ci];
  const deckFor = () => { const all = c.w.split(' '); const fresh = all.filter(w => !inT(w)); return shuffle(fresh.length >= 5 ? fresh : all); };
  if (!catDecks[ci] || catDecks[ci].length < 5) catDecks[ci] = (catDecks[ci] || []).concat(deckFor());
  const el = overlay('Discover', '');
  const body = $('.ov-body', el);
  const draw = async () => {
    const five = catDecks[ci].splice(0, 5);
    if (catDecks[ci].length < 5) catDecks[ci] = catDecks[ci].concat(deckFor().filter(w => !five.includes(w)));
    const rows = await Promise.all(five.map(async w => { const e = await Dict.get(w); return { w, e, p: pronOf(w, e) }; }));
    const kept = c.w.split(' ').filter(inT).length, total = c.w.split(' ').length;
    body.innerHTML = `<section class="hero" style="${coverStyle(c.n)}"><span class="spine"></span>
        <div class="row" style="justify-content:space-between;align-items:flex-start"><span class="ccount">${total} words · ${kept} kept</span><span class="cicon big"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${c.i}</svg></span></div>
        <div class="stack" style="gap:6px"><h1 class="hname">${esc(c.n)}</h1><p class="hdesc">${esc(c.d)}</p></div>
        <div class="hbar"><i style="width:${Math.round(kept / total * 100)}%"></i></div></section>
      <div class="stack" style="gap:10px;margin-top:18px">${rows.map((r, k) => `<div class="wcard" style="animation-delay:${k * 50}ms"><button class="cw" data-w="${esc(r.w)}"><span class="row" style="gap:10px;align-items:baseline;flex-wrap:wrap"><span class="serif" style="font-size:26px;font-weight:500;line-height:1">${esc(r.w)}</span>${r.p ? `<span class="muted" style="font-size:12px">${esc(r.p.r || '')}${r.p.est ? ' ≈' : ''}</span>` : ''}</span><span style="font-size:13.5px;line-height:1.45;color:var(--ink2)">${esc(shortDef(r.w, r.e))}</span></button>
        <button class="keepc${inT(r.w) ? ' on' : ''}" data-k="${esc(r.w)}" aria-label="${inT(r.w) ? 'In your Treasury' : 'Keep ' + esc(r.w)}">${inT(r.w) ? ICON.markOn : ICON.mark}</button></div>`).join('')}</div>
      <button class="btn" id="shuf" style="margin-top:18px">${ICON.shuffle} Shuffle five more</button>`;
    $$('.cw', body).forEach(b => b.onclick = () => openWord(b.dataset.w));
    $$('.keepc', body).forEach(b => b.onclick = () => { const w = b.dataset.k; if (!inT(w)) { keep(w); b.classList.add('on'); b.innerHTML = ICON.markOn; } else openWord(w); });
    $('#shuf', body).onclick = () => { body.scrollTop = 0; draw(); };
  };
  draw();
}
function remember(w) { const r = store.get('recent', []).filter(x => x !== w); r.unshift(w); store.set('recent', r.slice(0, 12)); }
function recentHTML() {
  const r = store.get('recent', []);
  if (!r.length) return '';
  return `<div class="micro" style="margin:22px 0 10px">Recent</div><div class="recent">${r.map(w => `<button class="rchip" data-w="${esc(w)}">${esc(w)}</button>`).join('')}</div>`;
}

/* ---------- cards ---------- */
function wordSize(w, big) {
  const n = w.length; if (big) return n <= 8 ? 44 : n <= 11 ? 38 : n <= 14 ? 31 : n <= 17 ? 26 : 22;
  return n <= 8 ? 30 : n <= 11 ? 26 : n <= 14 ? 22 : 19;
}
function cardHTML(w, e, rec, h = 450) {
  const li = lvlIdx(rec ? rec.c : 0), L = LX.CARD_LEVELS[li].n;
  const s = e && e.s ? e.s[0] : null, p = pronOf(w, e);
  const def = shortDef(w, e);
  const os = originShort(e, w);
  const big = h >= 380;
  if (li === 4) {
    return `<div class="card f4" style="height:${h}px"><div class="in">
      <div class="stack" style="align-items:center;gap:8px"><div class="lv">Silver-Tongued</div><div class="rule" style="margin:0"></div></div>
      <div class="stack" style="align-items:center;gap:8px"><div class="w" style="font-size:${wordSize(w, big) + 4}px">${esc(w)}</div>${p ? `<div class="pr" style="letter-spacing:1px">${esc(p.r || '')}</div>` : ''}<div class="d" style="max-width:220px">${esc(def)}</div></div>
      <div class="stack" style="align-items:center;gap:8px"><div class="rule" style="margin:0"></div><div class="o">${os}</div></div>
    </div><div class="shine"></div></div>`;
  }
  return `<div class="card f${li}" style="height:${h}px"><div class="in">
    <div class="lv">${L}</div>
    <div class="stack" style="gap:6px">
      ${s ? `<div class="po">${esc(s[0])}</div>` : ''}
      <div class="w" style="font-size:${wordSize(w, big)}px">${esc(w)}</div>
      ${p ? `<div class="pr">${esc(p.r || '')}${p.est ? ' ≈' : ''}</div>` : ''}
      ${big ? `<div class="d" style="margin-top:6px">${esc(def)}</div>` : ''}
    </div>
    <div class="o">${os}</div>
  </div><div class="shine"></div></div>`;
}

/* ---------- treasury ---------- */
let tIndex = 0;
async function renderTreasury() {
  const words = Object.keys(treasury).sort((a, b) => treasury[b].a - treasury[a].a);
  if (!words.length) {
    view.innerHTML = `<div style="padding:0 22px"><h1 class="big">Treasury</h1><p class="serif it muted" style="font-size:17px;margin:6px 0 0">Words you have chosen to keep.</p>
      <div style="margin-top:40px;border:1px dashed var(--line2);border-radius:14px;padding:28px 22px;text-align:center"><p class="serif" style="font-size:20px;margin:0 0 6px">Your Treasury is empty.</p><p class="muted" style="font-size:13px;margin:0 0 18px">Look up a word and tap “Add to Treasury,” or keep one of today’s new words.</p><button class="btn" id="goS">Look up a word</button></div></div>`;
    $('#goS').onclick = () => go('discover'); return;
  }
  view.innerHTML = `<div style="padding:0 22px"><h1 class="big">Treasury</h1><p class="serif it muted" style="font-size:17px;margin:6px 0 0">${words.length} word${words.length > 1 ? 's' : ''} you have chosen to keep.</p></div>
    <div class="deck3d" id="deck">${words.map((w, i) => `<div class="c3" data-i="${i}" role="button" tabindex="0" aria-label="${esc(w)}"><div class="card f0" style="height:450px"></div></div>`).join('')}</div>
    <div class="dots" id="dots"></div><div class="hint" style="margin-top:12px">Swipe to browse · Tap to open</div>`;
  const deck = $('#deck'), cards = $$('.c3', deck), N = words.length;
  const filled = new Set();
  const fill = async i => {
    if (filled.has(i) || i < 0 || i >= N) return; filled.add(i);
    const w = words[i], e = await Dict.get(w);
    cards[i].innerHTML = cardHTML(w, e, treasury[w], 450);
  };
  const STEP = 236;
  let pos = Math.min(tIndex, N - 1), anim = null, last = -1;
  const render = () => {
    cards.forEach((c, i) => {
      const d = i - pos, ad = Math.abs(d);
      if (ad > 3.2) { c.style.visibility = 'hidden'; return; }
      c.style.visibility = 'visible';
      const x = d * STEP * (ad > 1 ? 0.92 : 1);
      const ry = Math.max(-38, Math.min(38, -d * 22));
      const sc = 1 - Math.min(ad, 2) * 0.09;
      const tz = -Math.min(ad, 3) * 90;
      const lift = Math.max(0, 1 - ad) * 10;
      c.style.transform = `translate3d(${x}px, ${-lift}px, ${tz}px) rotateY(${ry}deg) rotateZ(${d === 0 ? 0 : 0}deg) scale(${sc})`;
      c.style.zIndex = String(100 - Math.round(ad * 10));
      c.style.opacity = String(ad > 2 ? Math.max(0, 1 - (ad - 2) * 0.8) : 1);
      c.style.filter = `brightness(${(1 - Math.min(ad, 2) * 0.12).toFixed(3)})`;
      c.classList.toggle('on', ad < 0.5);
    });
    const c = Math.max(0, Math.min(N - 1, Math.round(pos)));
    if (c !== last) {
      last = c; tIndex = c;
      [c - 2, c - 1, c, c + 1, c + 2].forEach(fill);
      const n = Math.min(N, 7), st = Math.max(0, Math.min(c - 3, N - n));
      $('#dots').innerHTML = Array.from({ length: n }, (_, k) => `<i class="${st + k === c ? 'on' : ''}"></i>`).join('');
    }
  };
  const animateTo = (target, ms = 380) => {
    cancelAnimationFrame(anim);
    const from = pos, t0 = performance.now();
    if (Math.round(target) !== Math.round(from) && navigator.vibrate) { try { navigator.vibrate(6); } catch { } }
    const tick = now => {
      const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      pos = from + (target - from) * e; render();
      if (k < 1) anim = requestAnimationFrame(tick);
    };
    anim = requestAnimationFrame(tick);
  };
  // drag: the card follows your finger, tilting slightly like a real card
  let drag = null;
  deck.addEventListener('pointerdown', ev => {
    cancelAnimationFrame(anim);
    drag = { x: ev.clientX, y: ev.clientY, p: pos, t: performance.now(), vx: 0, lx: ev.clientX, lt: performance.now(), moved: false, id: ev.pointerId, horiz: null };
  });
  deck.addEventListener('pointermove', ev => {
    if (!drag || ev.pointerId !== drag.id) return;
    const dx = ev.clientX - drag.x, dy = ev.clientY - drag.y;
    if (drag.horiz === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) { drag.horiz = Math.abs(dx) > Math.abs(dy); if (drag.horiz) deck.setPointerCapture(ev.pointerId); }
    if (!drag.horiz) return;
    drag.moved = true;
    const now = performance.now(); drag.vx = (ev.clientX - drag.lx) / Math.max(1, now - drag.lt); drag.lx = ev.clientX; drag.lt = now;
    let p = drag.p - dx / STEP;
    if (p < 0) p = p * 0.35; if (p > N - 1) p = N - 1 + (p - (N - 1)) * 0.35; // rubber-band at the ends
    pos = p; render();
    const top = cards[Math.round(Math.max(0, Math.min(N - 1, pos)))];
    if (top) top.style.transform += ` rotateZ(${Math.max(-6, Math.min(6, -drag.vx * 3)).toFixed(2)}deg)`;
  });
  const end = ev => {
    if (!drag || ev.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (!d.moved) {
      const el = ev.target.closest('.c3'); if (!el) return;
      const i = +el.dataset.i;
      if (i === Math.round(pos)) openFull(words, i); else animateTo(i);
      return;
    }
    let target = Math.round(pos - d.vx * 0.9);
    target = Math.max(0, Math.min(N - 1, target));
    if (Math.abs(target - d.p) > 3) target = d.p + Math.sign(target - d.p) * 3;
    animateTo(target, 420);
  };
  deck.addEventListener('pointerup', end); deck.addEventListener('pointercancel', end);
  deck.addEventListener('keydown', ev => { if (ev.key === 'ArrowRight') animateTo(Math.min(N - 1, Math.round(pos) + 1)); if (ev.key === 'ArrowLeft') animateTo(Math.max(0, Math.round(pos) - 1)); if (ev.key === 'Enter') openFull(words, Math.round(pos)); });
  render();
}

/* ---------- full-screen card (front/back) ---------- */
async function openFull(words, i) {
  const el = document.createElement('div'); el.className = 'fs';
  let flipped = false;
  const draw = async () => {
    const w = words[i], e = await Dict.get(w), rec = treasury[w] || { c: 0, m: 0, a: Date.now() };
    const li = lvlIdx(rec.c), nxt = LX.CARD_LEVELS[li + 1];
    const prog = nxt ? Math.round(((rec.c - LX.CARD_LEVELS[li].at) / (nxt.at - LX.CARD_LEVELS[li].at)) * 100) : 100;
    const o = originText(w, e);
    const syn = e ? [...new Set(e.s.slice(0, 3).flatMap(s => s[3] || []))].filter(x => x !== w).slice(0, 6) : [];
    const ant = e ? [...new Set(e.s.slice(0, 3).flatMap(s => s[4] || []))].filter(x => x !== w).slice(0, 5) : [];
    let fam = [];
    try { await Pool.load(); const r = Pool.map.get(w); if (r && r[3] >= 0) fam = (Pool.byRoot.get(r[3]) || []).filter(x => x !== w).slice(0, 6); } catch { }
    const acc = rec.c + rec.m ? Math.round(rec.c / (rec.c + rec.m) * 100) + '%' : '—';
    el.innerHTML = `<div class="stage"><div class="flip${flipped ? ' back' : ''}" id="flip">
        <div class="face f">${cardHTML(w, e, rec, Math.min(520, Math.round(innerHeight * 0.72)))}</div>
        <div class="face b"><div class="card backface" style="height:100%">
          <div class="row" style="justify-content:space-between"><h3>${esc(w)}</h3><button class="speak" style="border-color:#1C1A17;color:#1C1A17" id="fsp" aria-label="Hear it">${ICON.speak}</button></div>
          <div><div class="k">${esc(LX.CARD_LEVELS[li].n)}${nxt ? ' · ' + (nxt.at - rec.c) + ' more correct to ' + nxt.n : ' · highest level'}</div><div class="bar"><i style="width:${Math.max(4, prog)}%"></i></div></div>
          <div class="grid3"><div class="stat"><b>${rec.c}</b><span>correct</span></div><div class="stat"><b>${rec.m}</b><span>missed</span></div><div class="stat"><b>${acc}</b><span>accuracy</span></div></div>
          ${plainOf(w) ? `<div><div class="k">Plain meaning</div><div class="v serif" style="font-size:18px;line-height:1.35">${esc(plainOf(w)[0])}</div><div class="v serif it" style="font-size:16px;color:#4A443C;margin-top:4px">“${esc(plainOf(w)[1])}”</div></div>` : ''}
          ${e && e.s.length ? `<div><div class="k">${plainOf(w) ? 'Dictionary meanings' : 'All meanings'}</div><div class="v">${e.s.slice(0, 4).map((s, k) => `${k + 1}. <i>${esc(s[0])}</i> — ${esc(endDot(s[1]))}`).join('<br>')}</div></div>` : ''}
          ${o ? `<div><div class="k">Origin</div><div class="v serif" style="font-size:16px">${o.html}</div></div>` : ''}
          ${fam.length ? `<div><div class="k">Same root</div><div class="v">${fam.map(esc).join(' · ')}</div></div>` : ''}
          ${syn.length ? `<div><div class="k">Synonyms</div><div class="v">${syn.map(esc).join(' · ')}</div></div>` : ''}
          ${ant.length ? `<div><div class="k">Antonyms · opposites</div><div class="v">${ant.map(esc).join(' · ')}</div></div>` : ''}
          <div><div class="k">Your notes</div><textarea id="note" placeholder="Where you met it, how to remember it…">${esc(rec.note || '')}</textarea></div>
          ${rec.sent && rec.sent.length ? `<div><div class="k">Your sentences</div><div class="v serif it" style="font-size:16px">${rec.sent.map(x => '“' + esc(x) + '”').join('<br>')}</div></div>` : ''}
          <div class="k" style="margin-top:4px">Collected ${new Date(rec.a).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <button class="btn ghost" id="rm" style="height:44px;color:#6B6358;border-color:#CFC5B2">Remove from Treasury</button>
        </div></div>
      </div></div>
      <div class="tools"><button class="iconbtn" id="pv" aria-label="Previous card">${ICON.back}</button><button class="iconbtn" id="fl" aria-label="Flip card">${ICON.flip}</button><button class="iconbtn" id="nx" aria-label="Next card">${ICON.next}</button><button class="iconbtn" id="cl" aria-label="Close">${ICON.close}</button></div>
      <div class="tip">Tap the card to flip · swipe for the next</div>`;
    $('#pv', el).disabled = i === 0; $('#pv', el).style.opacity = i === 0 ? .3 : 1;
    $('#nx', el).disabled = i === words.length - 1; $('#nx', el).style.opacity = i === words.length - 1 ? .3 : 1;
    $('#fsp', el).onclick = ev => { ev.stopPropagation(); speak(w); };
    const note = $('#note', el); note.onclick = ev => ev.stopPropagation();
    note.oninput = () => { if (treasury[w]) { treasury[w].note = note.value; save.treasury(); } };
    $('#rm', el).onclick = ev => { ev.stopPropagation(); if (confirm('Remove “' + w + '” from your Treasury?')) { unkeep(w); closeTop(); if (tab === 'treasury') renderTreasury(); } };
    bindTilt();
  };
  const flip = () => { flipped = !flipped; $('#flip', el).classList.toggle('back', flipped); };
  el.addEventListener('click', ev => {
    const t = ev.target.closest('button,textarea'); if (t && t.id !== 'fl') { if (t.id === 'pv' && i > 0) { i--; flipped = false; draw(); } else if (t.id === 'nx' && i < words.length - 1) { i++; flipped = false; draw(); } else if (t.id === 'cl') closeTop(); return; }
    if (t && t.id === 'fl') { flip(); return; }
    if (ev.target.closest('.stage')) flip();
  });
  let sx = null, sy = null;
  el.addEventListener('touchstart', ev => { sx = ev.touches[0].clientX; sy = ev.touches[0].clientY; }, { passive: true });
  el.addEventListener('touchend', ev => {
    if (sx == null) return; const dx = ev.changedTouches[0].clientX - sx, dy = ev.changedTouches[0].clientY - sy; sx = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { ev.preventDefault(); if (dx < 0 && i < words.length - 1) { i++; flipped = false; draw(); } else if (dx > 0 && i > 0) { i--; flipped = false; draw(); } }
    else if (dy > 110 && Math.abs(dy) > Math.abs(dx) * 1.5 && !ev.target.closest('.backface')) closeTop();
  });
  pushOverlay(el, () => { stopTilt(); tIndex = i; if (tab === 'treasury') renderTreasury(); });
  draw();
  const w0 = words[i]; if (!enr[w0]) enrich(w0);
}
/* tilt shine */
let tiltOn = false;
function onTilt(ev) {
  const g = Math.max(-30, Math.min(30, ev.gamma || 0)), b = Math.max(-30, Math.min(30, (ev.beta || 45) - 45));
  $$('.fs .shine').forEach(s => { s.style.setProperty('--sx', (50 + g * 1.4) + '%'); s.style.setProperty('--sy', (40 + b * 1.4) + '%'); s.style.setProperty('--sp', (40 + g * 1.6) + '%'); });
}
function onPointer(ev) {
  const r = innerWidth, h = innerHeight; onTilt({ gamma: (ev.clientX / r - .5) * 60, beta: 45 + (ev.clientY / h - .5) * 60 });
}
function bindTilt() {
  if (tiltOn) return; tiltOn = true;
  window.addEventListener('deviceorientation', onTilt); window.addEventListener('pointermove', onPointer);
}
function stopTilt() { tiltOn = false; window.removeEventListener('deviceorientation', onTilt); window.removeEventListener('pointermove', onPointer); }

/* ---------- daily picks (word of the day, new words) ---------- */
function axisOrder() {
  const a = (profile && profile.palate && profile.palate.axes) || { T: 1 };
  return Object.keys(a).filter(k => k !== 'O').sort((x, y) => (a[y] || 0) - (a[x] || 0));
}
async function pickNew(n, seed) {
  await Pool.load();
  const r = rng(seed);
  const lvl = (profile && profile.level) || 3, [ta, tb] = LX.LEVEL_TIERS[lvl];
  const ornate = profile && profile.palate && (profile.palate.axes.O || 0) >= 2;
  const ex = new Set([...Object.keys(treasury), ...passed]);
  const picks = [], used = new Set();
  const add = (w, why) => { if (!w || ex.has(w) || used.has(w) || picks.length >= n) return false; used.add(w); picks.push({ w, why }); return true; };
  const tw = shuffle(Object.keys(treasury), r);
  // 1) same-root kin of a Treasury word
  for (const w of tw) {
    const row = Pool.map.get(w); if (!row || row[3] < 0) continue;
    const kin = shuffle((Pool.byRoot.get(row[3]) || []).filter(x => x !== w && !ex.has(x)), r);
    if (kin.length && add(kin[0], `Kindred of <b>${esc(w)}</b> · same root`)) break;
  }
  // 2) close in meaning to a Treasury word
  for (const w of tw.slice(0, 6)) {
    if (picks.length >= n - 1 && tw.length) break;
    const e = await Dict.get(w); if (!e) continue;
    const syn = shuffle([...new Set(e.s.flatMap(s => s[3] || []))].filter(x => /^[a-z]+$/.test(x) && Pool.map.has(x) && !ex.has(x)), r);
    if (syn.length && add(syn[0], `Close to <b>${esc(w)}</b>`)) break;
  }
  // 3) words with Lucent plain meanings, near your level
  const top = axisOrder().slice(0, 2);
  {
    const lo2 = Math.max(35, ta - 10), hi2 = Math.min(70, tb + 10);
    const pw = shuffle(Object.keys(LX.PLAIN || {}).filter(w => !ex.has(w) && !used.has(w) && (!Pool.map.has(w) || (Pool.map.get(w)[1] >= lo2 && Pool.map.get(w)[1] <= hi2))), r);
    const fit = pw.filter(w => { const x = Pool.map.get(w); return x && top.some(t => x[2].includes(t)); });
    for (const w of fit.concat(pw)) { if (picks.length >= n) break; add(w, 'Suited to your palate'); }
  }
  const lo = ornate ? ta : Math.max(35, ta - 5), hi = ornate ? Math.min(70, tb + 5) : tb;
  const cand = Pool.data.words.filter(x => x[1] >= lo && x[1] <= hi && !ex.has(x[0]) && !used.has(x[0]));
  const fav = cand.filter(x => top.some(t => x[2].includes(t)));
  const src = fav.length > 20 ? fav : cand;
  let guard = 0;
  while (picks.length < n && guard++ < 500) { const x = src[Math.floor(r() * src.length)]; if (x) add(x[0], 'Suited to your palate'); }
  return picks;
}
async function todayPlan() {
  const d = ymd(); let plan = store.get('daily', null);
  if (!plan || plan.d !== d) {
    const news = await pickNew(3, 'new' + d + (profile ? profile.name : ''));
    let wotd = null; const tw = Object.keys(treasury).sort();
    if (tw.length) wotd = tw[hash('wotd' + d) % tw.length];
    plan = { d, news, i: 0, wotd }; store.set('daily', plan);
  }
  if (!plan.wotd || !treasury[plan.wotd]) { const tw = Object.keys(treasury).sort(); if (tw.length) { plan.wotd = tw[hash('wotd' + d) % tw.length]; store.set('daily', plan); } }
  return plan;
}

/* ---------- today ---------- */
const LEVEL_COVERS = [['#FBF8F1', '#E6DDCB', '#1C1A17', '#6E1F2A'], ['#ECE3D1', '#D9CDB4', '#1C1A17', '#6E1F2A'], ['#3B2418', '#2A190F', '#F2E6D2', '#D9C3A0'], ['#14261F', '#0C1A14', '#EADBB0', '#D7B96E'], ['#0D0D0F', '#000000', '#E3E6EA', '#C7CCD1']];
const levelStyle = li => { const [bg, sp, tx, ac] = LEVEL_COVERS[li]; return `--cv:${bg};--sp:${sp};--tx:${tx};--ac:${ac}`; };
async function renderToday() {
  const now = new Date(), h = now.getHours();
  const hello = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const date = (now.toLocaleDateString('en-GB', { weekday: 'long' }) + ' · ' + now.getDate() + ' ' + now.toLocaleDateString('en-GB', { month: 'long' })).toUpperCase();
  view.innerHTML = `<div class="micro" style="color:var(--acc)">${esc(date)}</div><h1 class="big" style="margin-top:6px">${hello}, ${esc(profile ? profile.name : '')}.</h1>
    <p class="serif it muted" style="font-size:17px;margin:6px 0 0">Today, in words.</p>
    <div id="wotd"></div><div id="news"></div><div id="lore"></div>
    <div class="micro" style="margin:28px 0 12px">Practice</div>
    <button class="cta" id="toLex" style="${coverStyle('Ornate')}"><span class="spine"></span><span class="stack" style="gap:4px;text-align:left"><span class="cname" style="font-size:26px">Sharpen your tongue</span><span class="cex">Six ways to practise your Treasury words</span></span><span class="ctaarrow">${ICON.arrow}</span></button>`;
  $('#toLex').onclick = () => go('lexis');
  renderLore();
  let plan; try { plan = await todayPlan(); } catch { $('#news').innerHTML = '<p class="muted" style="margin-top:22px">Today’s words will appear once the library has downloaded.</p>'; return; }
  if (tab !== 'today') return;
  const wd = plan.wotd && treasury[plan.wotd] ? plan.wotd : null;
  const wb = $('#wotd');
  if (wd) {
    const e = await Dict.get(wd), p = pronOf(wd, e), li = lvlIdx(treasury[wd].c), s = e && e.s ? e.s[0] : null;
    wb.innerHTML = `<div class="row" style="justify-content:space-between;align-items:baseline;margin:26px 0 12px"><div class="micro">Word of the day</div><div class="muted" style="font-size:12px">from your Treasury</div></div>
      <article class="spot" style="${levelStyle(li)}"><div class="row" style="justify-content:space-between;align-items:center"><span class="stag">${LX.CARD_LEVELS[li].n}${s ? ' · ' + esc(s[0]) : ''}</span></div>
        <button class="sw" id="wopen"><span class="sword">${esc(wd)}</span>${p ? `<span class="spron">${esc(p.r || '')}${p.est ? ' ≈' : ''}</span>` : ''}<span class="smean">${esc(shortDef(wd, e))}</span></button>
        <div class="row" style="gap:10px;margin-top:4px"><button class="spbtn" id="wcardb">${ICON.flip} Open card</button><button class="spbtn ghost" id="wsp">${ICON.speak} Hear it</button></div></article>`;
    $('#wopen').onclick = () => openWord(wd);
    $('#wsp').onclick = () => speak(wd);
    $('#wcardb').onclick = () => { const ws = Object.keys(treasury).sort((a, b) => treasury[b].a - treasury[a].a); openFull(ws, Math.max(0, ws.indexOf(wd))); };
  } else {
    wb.innerHTML = `<div class="micro" style="margin:26px 0 12px">Word of the day</div><article class="spot" style="${levelStyle(0)}"><span class="stag">Your first card</span><span class="smean" style="font-size:22px">Your first card is waiting.</span><span style="font-size:13px;opacity:.75">Keep a word below, and tomorrow it can return as your word of the day.</span></article>`;
  }
  renderDeck(plan);
}
async function renderDeck(plan) {
  const box = $('#news'); if (!box) return;
  const cur = plan.news[plan.i];
  if (!cur) {
    box.innerHTML = `<div class="micro" style="margin:28px 0 12px">Today’s new words</div><article class="spot" style="${levelStyle(1)}"><span class="stag">All three met</span><span class="smean" style="font-size:22px">That’s today’s three.</span><span style="font-size:13px;opacity:.75">New words arrive tomorrow, chosen around your Treasury. Want more now? Try a shelf in Discover.</span></article>`;
    return;
  }
  const e = await Dict.get(cur.w), p = pronOf(cur.w, e), s = e ? e.s[0] : null;
  const dots = plan.news.map((_, k) => `<i class="${k < plan.i ? 'done' : k === plan.i ? 'on' : ''}"></i>`).join('');
  box.innerHTML = `<div class="row" style="justify-content:space-between;align-items:center;margin:28px 0 12px"><div class="micro">Today’s new words</div><div class="ndots">${dots}</div></div>
    <div class="deck">${plan.i < plan.news.length - 2 ? '<div class="l2"></div>' : ''}${plan.i < plan.news.length - 1 ? '<div class="l1"></div>' : ''}
      <button class="top" id="dtop"><span class="why">${cur.why}</span><span class="stack" style="gap:4px"><span class="sword" style="font-size:${Math.min(42, wordSize(cur.w, true))}px">${esc(cur.w)}</span>${p ? `<span class="muted" style="font-size:13px">${esc(p.r || '')}${p.est ? ' ≈' : ''}</span>` : ''}</span><span class="smean" style="font-size:18px;margin:0">${esc(shortDef(cur.w, e))}</span></button></div>
    <div class="deckbtns"><button class="pill ghost" id="dPass">${ICON.close} Pass</button><button class="pill" id="dKeep">${ICON.mark} Keep</button></div>`;
  const next = (kept) => {
    const top = $('#dtop'); top.style.transform = `translateX(${kept ? 120 : -120}%) rotate(${kept ? 8 : -8}deg)`; top.style.opacity = 0;
    if (kept) keep(cur.w); else { passed.push(cur.w); save.passed(); }
    plan.i++; store.set('daily', plan);
    setTimeout(() => renderDeck(plan), 260);
  };
  $('#dKeep').onclick = () => next(true); $('#dPass').onclick = () => next(false);
  const top = $('#dtop'); let sx = null, dx = 0;
  top.onclick = () => { if (Math.abs(dx) < 8) openWord(cur.w); };
  top.addEventListener('touchstart', ev => { sx = ev.touches[0].clientX; dx = 0; top.style.transition = 'none'; }, { passive: true });
  top.addEventListener('touchmove', ev => { if (sx == null) return; dx = ev.touches[0].clientX - sx; top.style.transform = `translateX(${dx}px) rotate(${dx / 30}deg)`; }, { passive: true });
  top.addEventListener('touchend', () => { top.style.transition = ''; if (Math.abs(dx) > 90) next(dx > 0); else top.style.transform = ''; sx = null; setTimeout(() => dx = 0, 50); });
}
function renderLore() {
  const L = LX.LORE, x = L[((dayIndex() % L.length) + L.length) % L.length];
  const [w, era, k, t, note] = x;
  $('#lore').innerHTML = `<div class="micro" style="margin:28px 0 12px">Word Lore</div><article class="lorecv" style="${coverStyle('Whimsical')}"><span class="spine"></span>
    <div class="row" style="justify-content:space-between;align-items:center"><span class="stag">${esc(era)}</span><span class="ltag">${k === 'fact' ? 'Recorded history' : 'A popular story'}</span></div>
    <div class="sword" style="font-size:40px">${esc(w)}</div>
    <div class="ltext">${esc(t)}</div>
    <div class="row" style="justify-content:space-between;align-items:center;gap:10px;border-top:1px solid rgba(255,255,255,.12);padding-top:12px">${note ? `<span style="font-size:11px;opacity:.6;letter-spacing:.4px">${esc(note)}</span>` : '<span></span>'}
    <button class="spbtn" id="lmark">${inT(w) ? ICON.markOn + ' Kept' : ICON.mark + ' Keep'}</button></div></article>`;
  $('#lmark').onclick = () => { if (!inT(w)) { keep(w); renderLore(); } else openWord(w); };
}

/* ---------- lexis ---------- */
const EXERCISES = [
  { id: 'meaning', n: 'Meaning match', d: 'See the word, choose its meaning.', short: 'See the word, pick its meaning' },
  { id: 'reverse', n: 'Reverse', d: 'See the meaning, choose the word.', short: 'See the meaning, pick the word' },
  { id: 'blank', n: 'Fill the blank', d: 'Complete the sentence.', short: 'Complete the sentence' },
  { id: 'spell', n: 'Hear & spell', d: 'Listen, then write it.', short: 'Listen, then write it' },
  { id: 'sentence', n: 'Your own sentence', d: 'Use the word yourself. Saved to its card.', short: 'Use it in your own words' },
  { id: 'synonym', n: 'Synonym match', d: 'Find the word that means the same — against the clock.', short: 'Same meaning, against the clock' }
];
const EX_LOOK = {
  meaning: ['Literary', '<path d="M4 5h11a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3z"/><path d="M9.5 10a2.5 2.5 0 1 1 3 2.4V14"/><path d="M12 16.8h.01"/>'],
  reverse: ['Medical', '<path d="M4 8h14l-3-3"/><path d="M20 16H6l3 3"/>'],
  blank: ['Legal', '<path d="M4 7h16"/><path d="M4 12h5"/><path d="M15 12h5"/><path d="M10 14h4"/><path d="M4 17h10"/>'],
  spell: ['Everyday', '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>'],
  sentence: ['Ornate', '<path d="M20 4C12 5 7 10 5 19c5-2 11-6 15-15z"/><path d="M5 19l5-5"/>'],
  synonym: ['Business', '<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.5l2.5 2"/><path d="M9.5 3h5"/>']
};
function renderLexis() {
  const n = Object.keys(treasury).length, st = streak();
  const acc = stats.ok + stats.bad ? Math.round(stats.ok / (stats.ok + stats.bad) * 100) + '%' : '—';
  view.innerHTML = `<div class="micro" style="color:var(--acc)">Lexis</div><h1 class="big" style="margin-top:6px">Sharpen your tongue.</h1>
    <p class="serif it muted" style="font-size:17px;margin:6px 0 0">The best way to remember a word is to use it.</p>
    <section class="stats" style="margin-top:18px"><div><b>${n}</b><span>in Treasury</span></div><div><b>${st}</b><span>day streak</span></div><div><b>${acc}</b><span>accuracy</span></div></section>
    <div class="row" style="justify-content:space-between;align-items:baseline;margin:28px 0 12px"><div class="micro">The exercises</div><div class="muted" style="font-size:12px">tap to begin</div></div>
    <div class="cats">${EXERCISES.map((x, i) => `<button class="cover ex6" data-x="${x.id}" style="${coverStyle(EX_LOOK[x.id][0])}"><span class="spine"></span>
      <span class="ctop"><span class="ccount">${['I', 'II', 'III', 'IV', 'V', 'VI'][i]}${x.id === 'synonym' ? ' · timed' : ''}</span><span class="cicon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${EX_LOOK[x.id][1]}</svg></span></span>
      <span class="cbot"><span class="cname" style="font-size:22px">${x.n}</span><span class="cex" style="font-size:14px">${x.short}</span></span></button>`).join('')}</div>
    ${n < 1 ? '<p class="muted" style="font-size:13px;margin-top:16px">Keep at least one word in your Treasury to begin.</p>' : ''}
    <div class="note" style="margin-top:22px;box-shadow:none"><div class="micro" style="margin-bottom:6px">How cards level up</div><div style="font-size:13px;line-height:1.55;color:var(--ink2)">Every correct answer in I–IV and VI raises that word’s card: Acquaintance at 3, Familiar at 8, Fluent at 15, Silver-Tongued at 30.</div></div>`;
  $$('.ex6').forEach(b => b.onclick = () => { if (!n) { toast('Keep a word in your Treasury first.'); return; } b.dataset.x === 'synonym' ? synonymSetup() : startEx(b.dataset.x); });
}
function pickForPractice(k, needEx) {
  const now = Date.now();
  const ws = Object.keys(treasury).map(w => ({ w, r: treasury[w] }))
    .map(x => ({ ...x, score: (x.r.c || 0) * 2 - (x.r.m || 0) * 3 - Math.min(10, (now - (x.r.s || 0)) / 864e5) + Math.random() * 3 }))
    .sort((a, b) => a.score - b.score).map(x => x.w);
  return ws.slice(0, k);
}
async function distractorDefs(k, avoid) {
  const out = [];
  if (plainOf(avoid)) {
    const keys = shuffle(Object.keys(LX.PLAIN).filter(w => w !== avoid));
    const tk = Object.keys(treasury).filter(w => w !== avoid && plainOf(w));
    for (const w of shuffle(tk).concat(keys)) { if (out.length >= k) break; const d = LX.PLAIN[w][0].replace(/\.$/, ''); if (!out.includes(d)) out.push(d); }
    return out;
  }
  const others = shuffle(Object.keys(treasury).filter(w => w !== avoid));
  for (const w of others) { if (out.length >= k) break; if (plainOf(w)) continue; const e = await Dict.get(w); if (e) out.push(shortDef(w, e).replace(/\.$/, '')); }
  if (out.length < k) {
    await Pool.load(); let g = 0;
    while (out.length < k && g++ < 30) { const x = Pool.data.words[Math.floor(Math.random() * Pool.data.words.length)][0]; if (plainOf(x)) continue; const e = await Dict.get(x); if (e) out.push(shortDef(x, e).replace(/\.$/, '')); }
  }
  return out;
}
async function distractorWords(k, avoid, near) {
  const out = new Set();
  shuffle(Object.keys(treasury).filter(w => w !== avoid)).slice(0, k).forEach(w => out.add(w));
  if (out.size < k) {
    await Pool.load(); const t = (Pool.map.get(avoid) || [0, 50])[1];
    const c = Pool.data.words.filter(x => Math.abs(x[1] - t) <= 10 && x[0] !== avoid);
    let g = 0; while (out.size < k && g++ < 60) out.add(c[Math.floor(Math.random() * c.length)][0]);
  }
  return [...out].slice(0, k);
}
function recordAnswer(w, ok) {
  const r = treasury[w]; if (!r) return;
  const before = lvlIdx(r.c);
  if (ok) { r.c = (r.c || 0) + 1; stats.ok++; stats.run = (stats.run || 0) + 1; stats.best = Math.max(stats.best || 0, stats.run); }
  else { r.m = (r.m || 0) + 1; stats.bad++; stats.run = 0; }
  r.s = Date.now();
  const d = ymd(); if (!stats.days.includes(d)) { stats.days.push(d); stats.days = stats.days.slice(-400); }
  save.treasury(); save.stats(); checkSeals();
  const after = lvlIdx(r.c);
  if (after > before) setTimeout(() => toast(`“${w}” is now ${LX.CARD_LEVELS[after].n}`), 700);
}
async function startEx(id) {
  const X = EXERCISES.find(x => x.id === id);
  exBusy++;
  const el = overlay(X.n, '<div class="hint" style="margin-top:40vh">Preparing…</div>', { onClose: endBusy });
  const body = $('.ov-body', el);
  let words = pickForPractice(10);
  const qs = [];
  for (const w of words) {
    const e = await Dict.get(w); if (!e) continue;
    if (id === 'blank') {
      const re = new RegExp('\\b' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\w*', 'i');
      const pl = plainOf(w);
      const own = (treasury[w].sent || []).find(s => re.test(s)) || (pl && re.test(pl[1]) ? pl[1] : null);
      const ex = own || e.s.flatMap(s => s[2] || []).find(s => re.test(s));
      if (!ex) continue;
      qs.push({ w, e, sentence: ex.replace(re, '_____') });
    } else qs.push({ w, e });
  }
  if (!qs.length) { body.innerHTML = `<p class="serif" style="font-size:20px;margin-top:30px">${id === 'blank' ? 'None of your words has an example sentence yet.' : 'Your words are still loading.'}</p><p class="muted">${id === 'blank' ? 'Write one in “Your own sentence,” and it will appear here.' : 'Try again in a moment.'}</p>`; return; }
  let qi = 0, right = 0;
  const finish = () => {
    if (id === 'sentence') { body.innerHTML = `<div class="stack" style="gap:14px;margin-top:30px;text-align:center"><div class="serif" style="font-size:34px">Well written.</div><p class="muted">Your sentences are saved on each card’s back.</p><button class="btn" id="done">Done</button></div>`; }
    else body.innerHTML = `<div class="stack" style="gap:14px;margin-top:30px;text-align:center"><div class="micro">Session complete</div><div class="serif" style="font-size:64px;line-height:1">${right}<span class="muted" style="font-size:32px"> / ${qs.length}</span></div><p class="muted">${right === qs.length ? 'Flawless.' : right >= qs.length * .7 ? 'A fine showing.' : 'Every miss makes the next one stick.'}</p><button class="btn" id="again">Another round</button><button class="btn ghost" id="done">Done</button></div>`;
    $('#done', body).onclick = () => closeTop();
    const ag = $('#again', body); if (ag) ag.onclick = () => { closeTop(); setTimeout(() => startEx(id), 50); };
  };
  const head = () => `<div class="row" style="justify-content:space-between;margin-top:6px"><div class="micro">${qi + 1} / ${qs.length}</div><div class="micro">${right} correct</div></div><div class="progress" style="margin:10px 0 0"><i style="width:${(qi / qs.length) * 100}%"></i></div>`;
  const mc = async (q, prompt, options, correct, serif) => {
    body.innerHTML = head() + `<div class="stack" style="gap:24px;margin-top:34px">${prompt}<div class="stack" style="gap:10px" id="opts">${options.map((o, k) => `<button class="opt${serif ? ' serifopt' : ''}" data-k="${k}"><span class="key">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div><div class="feedback" id="fb"></div></div>`;
    $$('#opts .opt', body).forEach(b => b.onclick = () => {
      if (body.dataset.lock) return; body.dataset.lock = 1;
      const k = +b.dataset.k, ok = options[k] === correct;
      b.classList.add(ok ? 'ok' : 'no');
      if (!ok) $$('#opts .opt', body).find(x => options[+x.dataset.k] === correct).classList.add('ok');
      recordAnswer(q.w, ok); if (ok) right++;
      setTimeout(() => { delete body.dataset.lock; qi++; qi < qs.length ? ask() : finish(); }, ok ? 650 : 1400);
    });
  };
  const ask = async () => {
    const q = qs[qi], def = shortDef(q.w, q.e).replace(/\.$/, '');
    if (id === 'meaning') {
      const ds = await distractorDefs(3, q.w);
      const p = pronOf(q.w, q.e);
      mc(q, `<div class="stack" style="align-items:center;gap:8px"><div class="muted" style="font-size:14px">What does it mean?</div><div class="qword">${esc(q.w)}</div>${p ? `<div class="muted" style="font-size:14px">${esc(p.r || '')}</div>` : ''}</div>`, shuffle([def, ...ds]), def);
    } else if (id === 'reverse' || id === 'blank') {
      const ds = await distractorWords(3, q.w);
      const prompt = id === 'reverse' ? `<div class="stack" style="gap:8px"><div class="muted" style="font-size:14px">Which word means…</div><div class="serif" style="font-size:28px;line-height:1.25">${esc(def)}.</div></div>`
        : `<div class="stack" style="gap:8px"><div class="muted" style="font-size:14px">Complete the sentence</div><div class="serif it" style="font-size:26px;line-height:1.3">“${esc(q.sentence)}”</div></div>`;
      mc(q, prompt, shuffle([q.w, ...ds]), q.w, true);
    } else if (id === 'spell') {
      body.innerHTML = head() + `<div class="stack" style="gap:22px;margin-top:40px;align-items:center;text-align:center"><div class="muted" style="font-size:14px">Listen, then write the word</div>
        <button class="speak" id="play" style="width:72px;height:72px;border-radius:36px" aria-label="Play the word">${ICON.speak}</button>
        <div class="muted" style="font-size:13px;max-width:300px">Hint: ${esc(def)}.</div>
        <input class="typed" id="typed" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Type the word">
        <div class="feedback" id="fb"></div><button class="btn" id="check">Check</button></div>`;
      const play = () => speak(q.w); $('#play', body).onclick = play; setTimeout(play, 300);
      const inp = $('#typed', body);
      const check = () => {
        if (body.dataset.lock) return;
        const v = inp.value.trim().toLowerCase(); if (!v) return; body.dataset.lock = 1;
        const ok = v === q.w.toLowerCase(); recordAnswer(q.w, ok); if (ok) right++;
        $('#fb', body).innerHTML = ok ? '<span style="color:#2F6B4F">Correct.</span>' : `It’s spelled <b class="serif" style="font-size:20px">${esc(q.w)}</b>`;
        setTimeout(() => { delete body.dataset.lock; qi++; qi < qs.length ? ask() : finish(); }, ok ? 800 : 2200);
      };
      $('#check', body).onclick = check; inp.onkeydown = ev => { if (ev.key === 'Enter') check(); };
      setTimeout(() => inp.focus(), 350);
    } else if (id === 'sentence') {
      body.innerHTML = head() + `<div class="stack" style="gap:16px;margin-top:30px"><div class="qword" style="text-align:left;font-size:44px">${esc(q.w)}</div><div style="font-size:15px;line-height:1.5">${esc(def)}.</div>
        <textarea id="sent" rows="4" style="width:100%;border:1px solid var(--line2);border-radius:14px;background:var(--paper);padding:14px;font-family:var(--serif);font-size:20px;resize:vertical" placeholder="Write a sentence using “${esc(q.w)}”…"></textarea>
        <button class="btn" id="saveS">Save to card</button><button class="btn ghost" id="skip">Skip</button></div>`;
      $('#saveS', body).onclick = () => {
        const v = $('#sent', body).value.trim(); if (!v) { toast('Write a sentence first.'); return; }
        const r = treasury[q.w]; r.sent = (r.sent || []).concat(v).slice(-10); save.treasury();
        const d = ymd(); if (!stats.days.includes(d)) { stats.days.push(d); save.stats(); }
        checkSeals(); qi++; qi < qs.length ? ask() : finish();
      };
      $('#skip', body).onclick = () => { qi++; qi < qs.length ? ask() : finish(); };
    }
  };
  if (id === 'sentence') qs.splice(5);
  ask();
}

/* ---------- synonym match (timed) ---------- */
const oneWord = x => /^[a-z][a-z-]{2,}$/.test(x);
function synsOf(e, w) {
  if (!e || !e.s) return [];
  return [...new Set(e.s.slice(0, 3).flatMap(s => s[3] || []))].filter(x => oneWord(x) && x !== w && !x.includes(w) && !w.includes(x));
}
function synonymSetup() {
  const t = settings.synTimer || 10;
  const el = overlay('Synonym match', `<div class="stack" style="gap:18px;margin-top:30px">
    <h1 class="big" style="font-size:36px">Synonym match</h1>
    <p class="muted" style="font-size:15px;line-height:1.5;margin:0">One of your Treasury words appears with four choices. Tap the word that means the same before time runs out.</p>
    <div class="micro" style="margin-top:8px">Time per word</div>
    <div class="seg" id="tsel" style="align-self:flex-start">${[10, 5].map(s => `<button data-s="${s}" class="${t === s ? 'on' : ''}" style="padding:10px 22px;font-size:15px">${s} seconds</button>`).join('')}</div>
    <div style="height:10px"></div><button class="btn" id="go">Begin</button></div>`);
  $$('#tsel button', el).forEach(b => b.onclick = () => { settings.synTimer = +b.dataset.s; save.settings(); $$('#tsel button', el).forEach(x => x.classList.toggle('on', x === b)); });
  $('#go', el).onclick = () => { closeTop(); setTimeout(() => synonymGame(settings.synTimer || 10), 60); };
}
async function synonymGame(secs) {
  exBusy++;
  const el = overlay('Synonym match', '<div class="hint" style="margin-top:40vh">Preparing…</div>', { onClose: endBusy });
  const body = $('.ov-body', el);
  await Pool.load();
  const qs = [];
  for (const w of pickForPractice(12)) {
    const e = await Dict.get(w); const syn = synsOf(e, w);
    if (!syn.length) continue;
    // prefer synonyms that point back to this word (the strongest matches)
    const mutual = [];
    for (const s of syn.slice(0, 6)) { const se = await Dict.get(s); if (se && synsOf(se, s).includes(w)) mutual.push(s); }
    const pickFrom = mutual.length ? mutual : syn.slice(0, 2);
    const answer = pickFrom[Math.floor(Math.random() * pickFrom.length)];
    // distractors: synonyms of other Treasury words, then words near the same level; never a synonym of this word
    const banned = new Set([w, ...syn, ...(e.s || []).flatMap(s => s[4] || [])]);
    const opts = new Set();
    for (const o of shuffle(Object.keys(treasury).filter(x => x !== w))) {
      if (opts.size >= 3) break; const oe = await Dict.get(o); const os = synsOf(oe, o).filter(x => !banned.has(x));
      if (os.length) opts.add(os[Math.floor(Math.random() * os.length)]);
    }
    const tier = (Pool.map.get(w) || [0, 50])[1];
    const near = Pool.data.words.filter(x => Math.abs(x[1] - tier) <= 10 && !banned.has(x[0]));
    let g = 0; while (opts.size < 3 && g++ < 80) opts.add(near[Math.floor(Math.random() * near.length)][0]);
    qs.push({ w, e, answer, options: shuffle([answer, ...[...opts].slice(0, 3)]) });
    if (qs.length >= 10) break;
  }
  if (!qs.length) { body.innerHTML = `<p class="serif" style="font-size:20px;margin-top:30px">None of your Treasury words has a synonym listed yet.</p><p class="muted">Keep a few more words and try again.</p>`; return; }
  let qi = 0, right = 0, timer = null, alive = true;
  el.addEventListener('remove', () => alive = false);
  const stop = () => { clearInterval(timer); timer = null; };
  const finish = () => {
    stop();
    body.innerHTML = `<div class="stack" style="gap:14px;margin-top:30px;text-align:center"><div class="micro">Session complete · ${secs} seconds each</div><div class="serif" style="font-size:64px;line-height:1">${right}<span class="muted" style="font-size:32px"> / ${qs.length}</span></div><p class="muted">${right === qs.length ? 'Flawless — and fast.' : right >= qs.length * .7 ? 'Quick and sharp.' : 'Speed comes with practice.'}</p><button class="btn" id="again">Another round</button><button class="btn ghost" id="done">Done</button></div>`;
    $('#done', body).onclick = () => closeTop();
    $('#again', body).onclick = () => { closeTop(); setTimeout(() => synonymGame(secs), 60); };
  };
  const ask = () => {
    if (!document.body.contains(el)) { stop(); return; }
    const q = qs[qi]; const p = pronOf(q.w, q.e);
    body.innerHTML = `<div class="row" style="justify-content:space-between;margin-top:6px"><div class="micro">${qi + 1} / ${qs.length}</div><div class="micro">${right} correct</div></div>
      <div class="timer"><i id="tbar"></i></div><div class="row" style="justify-content:flex-end"><span class="micro" id="tleft">${secs}s</span></div>
      <div class="stack" style="gap:22px;margin-top:20px"><div class="stack" style="align-items:center;gap:8px"><div class="muted" style="font-size:14px">Which word means the same?</div><div class="qword">${esc(q.w)}</div>${p ? `<div class="muted" style="font-size:14px">${esc(p.r || '')}</div>` : ''}</div>
      <div class="stack" style="gap:10px" id="opts">${q.options.map((o, k) => `<button class="opt serifopt" data-k="${k}"><span class="key">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}</div><div class="feedback" id="fb"></div></div>`;
    const t0 = Date.now(); let done = false;
    const settle = ok => {
      if (done) return; done = true; stop();
      $$('#opts .opt', body).forEach(x => { if (q.options[+x.dataset.k] === q.answer) x.classList.add('ok'); });
      recordAnswer(q.w, ok); if (ok) right++;
      setTimeout(() => { qi++; qi < qs.length ? ask() : finish(); }, ok ? 650 : 1500);
    };
    stop();
    timer = setInterval(() => {
      if (!document.body.contains(el)) { stop(); return; }
      const left = Math.max(0, secs - (Date.now() - t0) / 1000);
      const bar = $('#tbar', body); if (bar) { bar.style.width = (left / secs * 100) + '%'; bar.classList.toggle('low', left < secs * 0.3); }
      const tl = $('#tleft', body); if (tl) tl.textContent = Math.ceil(left) + 's';
      if (left <= 0) { $('#fb', body).textContent = 'Time’s up.'; settle(false); }
    }, 100);
    $$('#opts .opt', body).forEach(b => b.onclick = () => { if (done) return; const ok = q.options[+b.dataset.k] === q.answer; if (!ok) b.classList.add('no'); settle(ok); });
  };
  ask();
}

/* ---------- profile ---------- */
function avatarHTML(size) {
  const n = (profile && profile.name || '?').trim();
  return `<div class="avatar" style="width:${size}px;height:${size}px;font-size:${Math.round(size / 2)}px">${profile && profile.photo ? `<img src="${profile.photo}" alt="">` : esc(n.charAt(0).toUpperCase())}</div>`;
}
const FIN = [['#FBF8F1', '#D2C8B4'], ['#E4D9C3', '#C7B89D'], ['#3B2418', '#3B2418'], ['#14261F', '#B8954A'], ['#0D0D0F', '#8E959C']];
function renderProfile() {
  const rk = rankOf(), tw = Object.values(treasury);
  const counts = [0, 0, 0, 0, 0]; tw.forEach(r => counts[lvlIdx(r.c)]++);
  const acc = stats.ok + stats.bad ? Math.round(stats.ok / (stats.ok + stats.bad) * 100) + '%' : '—';
  const off = store.get('offline3', { done: 0, total: 0 });
  view.innerHTML = `
    <section class="row" style="gap:16px">${avatarHTML(72)}<div class="stack" style="gap:2px;min-width:0"><div class="serif" style="font-size:32px;font-weight:500;line-height:1.05;overflow:hidden;text-overflow:ellipsis">${esc(profile.name)}</div>
      <div class="serif it" style="font-size:16px;color:var(--acc)">${rk.name} · rank ${rk.i + 1} of 5</div></div>
      <button class="iconbtn" id="edit" style="margin-left:auto" aria-label="Edit profile">${ICON.edit}</button></section>
    <section class="stats" style="margin-top:18px"><div><b>${tw.length}</b><span>words kept</span></div><div><b>${streak()}</b><span>day streak</span></div><div><b>${acc}</b><span>accuracy</span></div></section>
    ${rk.next ? `<p class="muted" style="font-size:12px;margin:10px 0 0">${rk.next - rk.score} lexicon points to ${LX.RANKS[rk.i + 1]}. Each card earns points as it levels up.</p>` : ''}
    <section class="sec"><div class="micro">Your collection</div>
      <div class="collbar">${tw.length ? counts.map((n, i) => n ? `<span style="flex-grow:${n};background:${FIN[i][0]};box-shadow:inset 0 0 0 1px ${FIN[i][1]}"></span>` : '').join('') : ''}</div>
      <div class="legend">${LX.CARD_LEVELS.map((l, i) => `<div><i style="background:${FIN[i][0]};box-shadow:inset 0 0 0 1px ${FIN[i][1]}"></i><span>${l.n}</span><b>${counts[i]}</b></div>`).join('')}</div></section>
    ${profile.palate ? `<section class="sec"><div class="micro">Your palate</div><button class="setrow" id="pal" style="border-top:1px solid var(--line)"><span class="serif" style="font-size:18px">${profile.palate.title}</span><span>${ICON.next.replace('<svg', '<svg width="16" height="16"')}</span></button></section>` : ''}
    <section class="sec"><div class="micro">Seals · ${Object.keys(seals).length} of ${LX.SEALS.length}</div><div class="seals">${LX.SEALS.map(s => `<button class="seal ${seals[s.id] ? 'on' : 'off'}" data-s="${s.id}" aria-label="${esc(s.n)}${seals[s.id] ? '' : ', not yet earned'}">${sealSVG(s.id, 78)}<span>${esc(s.n)}</span></button>`).join('')}</div></section>
    <section class="sec"><div class="micro">Settings</div>
      <div class="setrow"><span>Theme</span><div class="seg" id="theme">${['day', 'night', 'auto'].map(t => `<button data-t="${t}" class="${settings.theme === t ? 'on' : ''}">${t === 'day' ? 'Day' : t === 'night' ? 'Night' : 'Auto'}</button>`).join('')}</div></div>
      <button class="setrow" id="offl"><span>Offline library</span><span id="offst">${offlineLabel(off)}</span></button>
      <button class="setrow" id="bk"><span>Back up my Treasury</span><span>to a file</span></button>
      <button class="setrow" id="rs"><span>Restore from a backup</span><span>choose file</span></button>
      <button class="setrow" id="cal"><span>Retake calibration</span><span>Level ${['I', 'II', 'III', 'IV', 'V', 'VI'][(profile.level || 3) - 1]}</span></button>
      <button class="setrow" id="rp"><span>Retake the palate</span><span></span></button>
      <button class="setrow" id="ab"><span>About Lucent</span><span>v${VERSION}</span></button>
      <input type="file" id="rsf" accept="application/json,.json" class="hidden"></section>`;
  $('#edit').onclick = editProfile;
  $$('.seal').forEach(b => b.onclick = () => showSeal(b.dataset.s, false));
  const pal = $('#pal'); if (pal) pal.onclick = () => showPalate(profile.palate, false);
  $$('#theme button').forEach(b => b.onclick = () => { settings.theme = b.dataset.t; save.settings(); applyTheme(); renderProfile(); });
  $('#offl').onclick = () => { const o = store.get('offline3', {}); if (o.total && o.done >= o.total) toast('The whole dictionary is saved on this phone.'); else { startOfflineDownload(true); toast('Saving the dictionary for offline use…'); } };
  $('#bk').onclick = backup;
  $('#rs').onclick = () => $('#rsf').click();
  $('#rsf').onchange = restore;
  $('#cal').onclick = () => onboarding('calib');
  $('#rp').onclick = () => onboarding('palate');
  $('#ab').onclick = () => overlay('About', `<div class="stack" style="gap:14px;margin-top:20px;text-align:center;align-items:center"><div class="brand"><b style="font-size:28px">LUCENT</b><small style="font-size:10px">BY TIN APPLE</small></div>
    <p class="serif it" style="font-size:18px;margin:10px 0 0">From the Latin <i>lucere</i>, “to shine.”</p>
    <p class="muted" style="font-size:13px;line-height:1.6;max-width:320px">Version ${VERSION}. A Tin Apple Solutions project.<br>Meanings and examples from Princeton WordNet 3.1. Pronunciations from the CMU Pronouncing Dictionary and Wiktionary (via WikiPron); estimates are marked ≈. Online look-ups use the Free Dictionary API. Word roots from the Etymological WordNet.</p></div>`);
}
function offlineLabel(o) { return !o.total ? 'not saved yet' : o.done >= o.total ? 'saved on this phone' : `saving… ${Math.round(o.done / o.total * 100)}%`; }
function editProfile() {
  const el = overlay('Profile', `<div class="stack" style="gap:22px;margin-top:20px;align-items:center">
    <button id="ph" aria-label="Change portrait">${avatarHTML(112)}</button><div class="row" style="gap:16px"><button class="chip" id="phc">Change portrait</button>${profile.photo ? '<button class="chip" id="phr">Remove</button>' : ''}</div>
    <div class="stack" style="gap:6px;width:100%"><label class="micro" for="nm">Your name</label><input id="nm" value="${esc(profile.name)}" maxlength="30" style="height:56px;border:0;border-bottom:1px solid var(--ink);background:transparent;font-family:var(--serif);font-size:34px;outline:0"></div>
    <button class="btn" id="sv">Save</button><input type="file" accept="image/*" id="phf" class="hidden"></div>`);
  const f = $('#phf', el);
  $('#ph', el).onclick = $('#phc', el).onclick = () => f.click();
  const r = $('#phr', el); if (r) r.onclick = () => { profile.photo = null; save.profile(); closeTop(); renderProfile(); };
  f.onchange = async () => { if (f.files[0]) { profile.photo = await shrinkPhoto(f.files[0]); save.profile(); closeTop(); renderProfile(); editProfile(); } };
  $('#sv', el).onclick = () => { const v = $('#nm', el).value.trim(); if (!v) { toast('Your name can’t be empty.'); return; } profile.name = v; save.profile(); closeTop(); renderProfile(); };
}
function shrinkPhoto(file) {
  return new Promise(res => {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => { const s = 256, c = document.createElement('canvas'); c.width = c.height = s; const x = c.getContext('2d'); const m = Math.min(img.width, img.height); x.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s); URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', .85)); };
    img.onerror = () => res(null); img.src = url;
  });
}
function backup() {
  const data = { app: 'lucent', v: 1, at: new Date().toISOString(), profile, treasury, stats, seals, passed, settings };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'lucent-backup-' + ymd() + '.json';
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast('Backup saved to your Downloads.');
}
function restore(ev) {
  const f = ev.target.files[0]; if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const d = JSON.parse(rd.result); if (d.app !== 'lucent') throw 0;
      if (!confirm(`Restore this backup from ${new Date(d.at).toLocaleDateString()}? It has ${Object.keys(d.treasury || {}).length} words and will replace what is on this phone.`)) return;
      profile = d.profile; treasury = d.treasury || {}; stats = d.stats || stats; seals = d.seals || {}; passed = d.passed || []; settings = d.settings || settings;
      save.profile(); save.treasury(); save.stats(); save.seals(); save.passed(); save.settings(); store.set('daily', null);
      applyTheme(); toast('Restored.'); go('profile');
    } catch { toast('That file isn’t a Lucent backup.'); }
  };
  rd.readAsText(f);
}

/* ---------- onboarding: name → palate → calibration ---------- */
const OB_STEPS = ['NAME', 'PALATE', 'CALIBRATION'];
function onboarding(only) {
  const el = document.createElement('div'); el.className = 'ob';
  document.body.appendChild(el);
  const draft = { name: profile ? profile.name : '', photo: profile ? profile.photo : null };
  const pal = { axes: { L: 0, P: 0, T: 0, C: 0, O: 0 }, roots: {}, drawn: [], plain: 0 };
  const frame = (step, inner) => {
    el.innerHTML = `<header><div class="row" style="justify-content:space-between"><div class="brand"><b>LUCENT</b><small>BY TIN APPLE</small></div><div class="stepno">0${step + 1} — 03</div></div>
      <div class="rail">${OB_STEPS.map((n, i) => `<div><i class="${i <= step ? 'on' : ''}"></i><span class="${i === step ? 'cur' : ''}">${n}</span></div>`).join('')}</div></header>
      <main class="fade-in">${inner}</main>`;
  };
  const sub = (roman, title, n) => `<div class="row" style="justify-content:space-between;align-items:baseline"><div class="micro"><span class="serif" style="font-size:15px;letter-spacing:1px;color:#C9CED3">${roman}</span>&nbsp; ${title}</div><div class="stepno">${n}</div></div>`;
  const done = () => { el.remove(); if (!only) { startOfflineDownload(); } go(only === 'calib' || only === 'palate' ? 'profile' : 'today'); };

  const nameStep = () => {
    frame(0, `<section class="stack" style="gap:14px"><div class="micro">THE FIRST ENTRY</div><h1 class="it">Every lexicon begins with a name.</h1></section>
      <section class="stack" style="gap:18px;border-top:1px solid #2A2622;border-bottom:1px solid #2A2622;padding:24px 0">
        <div class="row" style="justify-content:space-between;gap:16px"><div class="stack" style="gap:6px;flex:1;min-width:0"><label class="micro" for="obn">YOUR NAME</label><input class="name" id="obn" maxlength="30" placeholder="Your name" value="${esc(draft.name)}" autocomplete="given-name"></div>
        <button class="portrait" id="obp" aria-label="Add a portrait, optional">${draft.photo ? `<img src="${draft.photo}" alt="">` : ICON.plus.replace('<svg', '<svg width="20" height="20"')}</button></div>
        <div class="stack" style="gap:6px"><div style="font-size:13px;color:#9C9487"><i class="serif" style="font-size:16px;color:#C9CED3">noun</i> &nbsp;·&nbsp; the keeper of this lexicon</div><div class="serif it" style="font-size:16px;color:#9C9487" id="obx">“${esc(draft.name || 'You')} saved a first word today.”</div></div>
      </section>
      <div class="stack" style="gap:14px"><div style="font-size:12px;color:#7E776C;text-align:center">Portrait optional · change both anytime in Profile</div><button class="btn" id="obgo" ${draft.name ? '' : 'disabled'}>Continue</button><input type="file" accept="image/*" id="obf" class="hidden"></div>`);
    const n = $('#obn', el), b = $('#obgo', el), f = $('#obf', el);
    n.oninput = () => { draft.name = n.value.trim(); b.disabled = !draft.name; $('#obx', el).textContent = `“${draft.name || 'You'} saved a first word today.”`; };
    n.onkeydown = ev => { if (ev.key === 'Enter' && draft.name) b.click(); };
    $('#obp', el).onclick = () => f.click();
    f.onchange = async () => { if (f.files[0]) { draft.photo = await shrinkPhoto(f.files[0]); $('#obp', el).innerHTML = `<img src="${draft.photo}" alt="">`; } };
    b.onclick = () => { if (!draft.name) return; instinct(0); };
  };
  const instinct = i => {
    const x = LX.PALATE.instinct[i];
    if (!x) return weapon(0);
    const p = LX.PRON[x.w];
    frame(1, `${sub('I', 'FIRST INSTINCT', (i + 1) + ' / ' + LX.PALATE.instinct.length)}
      <section class="stack" style="align-items:center;gap:14px;text-align:center"><div class="serif it" style="font-size:18px;color:#9C9487">Don’t define it. Feel it.</div>
        <div class="serif it" style="font-size:${x.w.length > 9 ? 56 : 70}px;line-height:1;color:#F6F1E7;letter-spacing:-.5px">${esc(x.w)}</div>
        <div class="row" style="gap:10px;color:#C9CED3"><button class="speak" id="obs" aria-label="Hear it">${ICON.speak}</button><span style="font-size:14px;letter-spacing:1px">${esc(p ? p[0] : '')}</span></div></section>
      <div class="stack" style="gap:14px"><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px"><button class="btn ghost" id="no">Not for me</button><button class="btn" id="yes">Drawn to it</button></div><div style="font-size:12px;color:#7E776C;text-align:center">Every meaning is revealed at the end.</div></div>`);
    $('#obs', el).onclick = () => speak(x.w);
    $('#yes', el).onclick = () => { for (const k in x.axes) pal.axes[k] += x.axes[k]; pal.roots[x.root] = (pal.roots[x.root] || 0) + 1; pal.drawn.push(x.w); instinct(i + 1); };
    $('#no', el).onclick = () => instinct(i + 1);
  };
  const weapon = i => {
    const s = LX.PALATE.weapon[i];
    if (!s) return pairs(0);
    let sel = null;
    frame(1, `${sub('II', 'CHOOSE YOUR WEAPON', (i + 1) + ' / ' + LX.PALATE.weapon.length)}
      <h1>${esc(s.q.replace(/\.$/, ''))}<i>.</i></h1>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px">${s.o.map((o, k) => `<button class="tile" data-k="${k}"><span class="r">${['i', 'ii', 'iii', 'iv'][k]}</span><span class="w" style="font-size:${o.w.length > 11 ? 21 : 25}px">${esc(o.w)}</span></button>`).join('')}</div>
      <button class="btn" id="nx" disabled>Next</button>`);
    $$('.tile', el).forEach(t => t.onclick = () => { $$('.tile', el).forEach(x => x.classList.remove('on')); t.classList.add('on'); sel = s.o[+t.dataset.k]; $('#nx', el).disabled = false; });
    $('#nx', el).onclick = () => { if (!sel) return; pal.axes[sel.a] += 1.5; pal.weapons = (pal.weapons || []).concat(sel.w); weapon(i + 1); };
  };
  const pairs = i => {
    const pr = LX.PALATE.pairs[i];
    if (!pr) return reveal();
    frame(1, `${sub('III', 'ON THE TONGUE', (i + 1) + ' / ' + LX.PALATE.pairs.length)}
      <h1 style="font-size:34px">Which would you rather say?</h1>
      <div style="flex:1;display:flex;flex-direction:column;gap:10px;position:relative;min-height:330px"><button class="half" data-k="0">${esc(pr[0])}</button><div class="or">or</div><button class="half" data-k="1">${esc(pr[1])}</button></div>
      <div style="font-size:12px;color:#7E776C;text-align:center">Tap one. There is no wrong answer.</div>`);
    $$('.half', el).forEach(h => h.onclick = () => { h.classList.add('on'); if (h.dataset.k === '1') pal.axes.O += 1; else pal.plain++; setTimeout(() => pairs(i + 1), 280); });
  };
  const reveal = () => {
    const a = pal.axes, keys = ['L', 'P', 'T', 'C'];
    const order = keys.slice().sort((x, y) => a[y] - a[x]);
    let top = order[0], second = order[1];
    if (a.O >= 3 && a.O > a[top]) { second = top; top = 'O'; }
    const rootsSorted = Object.keys(pal.roots).sort((x, y) => pal.roots[y] - pal.roots[x]);
    let root = rootsSorted[0] || 'mixed';
    if (pal.plain >= 3) root = 'germanic';
    if (rootsSorted.length > 1 && pal.roots[rootsSorted[0]] === pal.roots[rootsSorted[1]] && pal.plain < 3) root = rootsSorted.includes('latin') ? 'latin' : 'mixed';
    const title = `${LX.ROOT_PHRASE[root]}, <i>${LX.FINISH[top][0]}</i>`;
    const traits = [...new Set([LX.TRAITS[top], LX.TRAITS[second], pal.plain >= 3 ? LX.TRAITS.plain : LX.TRAITS[root] || 'Well-travelled'])];
    const note = `You favour words ${LX.FINISH[top][1]}, with a taste for the ${({ L: 'exacting', P: 'reflective', T: 'expressive', C: 'practical', O: 'grand' })[second]}.`;
    const max = Math.max(1, ...Object.values(a));
    const vals = { T: a.T, P: a.P, L: a.L, C: a.C, O: a.O };
    const chart = {}; for (const k in vals) chart[k] = Math.round((0.18 + 0.82 * (vals[k] / max)) * 100) / 100;
    const palate = { axes: a, root, top, second, title, traits, note, chart, drawn: pal.drawn, at: Date.now() };
    profile = Object.assign(profile || { created: Date.now(), level: 3 }, { name: draft.name, photo: draft.photo, palate });
    save.profile(); store.set('daily', null);
    showPalate(palate, true, el, () => only === 'palate' ? done() : calib());
  };
  const calib = () => {
    let lvl = 3, n = 0; const asked = new Set(), hist = [];
    const q = () => {
      if (n >= 10) return result();
      const pool = LX.CALIB[lvl - 1].filter(x => !asked.has(x[0]));
      const it = pool[Math.floor(Math.random() * pool.length)] || LX.CALIB[lvl - 1][0];
      asked.add(it[0]);
      const [w, opts] = it, correct = opts[0], sh = shuffle(opts), p = LX.PRON[w];
      frame(2, `<div class="row" style="justify-content:space-between;align-items:baseline"><div class="micro">WHAT DOES IT MEAN?</div><div class="stepno">${n + 1} / 10</div></div>
        <section class="stack" style="align-items:center;gap:12px;text-align:center"><div class="serif" style="font-size:${w.length > 11 ? 46 : 60}px;line-height:1;color:#F6F1E7">${esc(w)}</div><div style="font-size:14px;letter-spacing:1px;color:#C9CED3">${esc(p ? p[0] : '')}</div><div style="font-size:12px;color:#7E776C">Questions adapt as you answer.</div></section>
        <div class="stack" style="gap:10px">${sh.map((o, k) => `<button class="opt" data-o="${esc(o)}"><span class="key">${'ABCD'[k]}</span><span>${esc(o)}</span></button>`).join('')}
          <button style="height:44px;color:#9C9487;font-size:14px" id="skip">I’m not sure — skip</button></div>`);
      let lock = false;
      const answer = ok => { hist.push({ lvl, ok }); n++; lvl = ok ? Math.min(6, lvl + 1) : Math.max(1, lvl - 1); setTimeout(q, ok ? 450 : 900); };
      $$('.opt', el).forEach(b => b.onclick = () => { if (lock) return; lock = true; const ok = b.dataset.o === correct; b.classList.add(ok ? 'ok' : 'no'); if (!ok) $$('.opt', el).find(x => x.dataset.o === correct).classList.add('ok'); answer(ok); });
      $('#skip', el).onclick = () => { if (lock) return; lock = true; answer(false); };
    };
    const result = () => {
      const oks = hist.filter(h => h.ok).map(h => h.lvl);
      const hiOk = oks.length ? Math.max(...oks) : 1;
      const tail = hist.slice(-4).map(h => h.lvl);
      const final = Math.max(1, Math.min(6, Math.round((hiOk + tail.reduce((s, x) => s + x, 0) / tail.length) / 2)));
      const NAMES = ['Plain-spoken', 'Well-read', 'Articulate', 'Discerning', 'Erudite', 'Recondite'];
      profile.level = final; save.profile(); store.set('daily', null);
      frame(2, `<section class="stack" style="gap:12px"><div class="micro">YOUR STARTING LEVEL</div><div class="serif" style="font-size:96px;line-height:.9;color:#F6F1E7">${['I', 'II', 'III', 'IV', 'V', 'VI'][final - 1]}</div><h1 class="it">${NAMES[final - 1]}.</h1></section>
        <div class="row" style="gap:6px">${[1, 2, 3, 4, 5, 6].map(k => `<div style="flex:1;height:4px;border-radius:2px;background:${k <= final ? '#C9CED3' : '#2A2622'}"></div>`).join('')}</div>
        <p class="serif" style="font-size:19px;line-height:1.45;color:#D9D3C7;margin:0">Your daily words will be chosen at this level — and will rise with you. You answered ${oks.length} of 10 correctly.</p>
        <button class="btn" id="enter">${only ? 'Done' : 'Enter Lucent'}</button>`);
      $('#enter', el).onclick = done;
    };
    q();
  };
  if (only === 'calib') calib(); else if (only === 'palate') instinct(0); else nameStep();
}
function radarSVG(chart) {
  const axes = [['T', 'LITERARY'], ['P', 'PHILOSOPHY'], ['L', 'LEGAL'], ['C', 'COMMERCIAL'], ['O', 'ORNATE']];
  const cx = 171, cy = 124, R = 84, pt = (i, r) => { const a = (-90 + 72 * i) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const poly = k => axes.map((_, i) => pt(i, R * k).map(v => v.toFixed(1)).join(',')).join(' ');
  let s = `<svg width="342" height="240" viewBox="0 0 342 240" role="img" aria-label="Your lexical palate" style="max-width:100%">`;
  [1 / 3, 2 / 3, 1].forEach(k => s += `<polygon points="${poly(k)}" fill="none" stroke="#2A2622"/>`);
  axes.forEach((_, i) => { const [x, y] = pt(i, R); s += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#2A2622"/>`; });
  s += `<polygon points="${axes.map(([k], i) => pt(i, R * chart[k]).map(v => v.toFixed(1)).join(',')).join(' ')}" fill="rgba(201,206,211,0.14)" stroke="#C9CED3" stroke-width="1.4" stroke-linejoin="round"/>`;
  axes.forEach(([k], i) => { const [x, y] = pt(i, R * chart[k]); s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#F1EBE0"/>`; });
  axes.forEach(([, n], i) => { const [x, y] = pt(i, R + 16); const anc = Math.abs(x - cx) < 5 ? 'middle' : x > cx ? 'start' : 'end'; s += `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${anc}" font-family="Inter, sans-serif" font-size="10" letter-spacing="1.4" fill="#9C9487">${n}</text>`; });
  return s + '</svg>';
}
function showPalate(p, inFlow, host, next) {
  const words = LX.PALATE.instinct;
  const inner = `<section class="stack" style="gap:10px"><div class="micro">YOUR LEXICAL PALATE</div><h1 style="font-size:36px">${p.title}</h1></section>
    <div style="display:flex;justify-content:center">${radarSVG(p.chart)}</div>
    <section class="stack" style="gap:14px"><div class="serif" style="font-size:18px;line-height:1.4;color:#D9D3C7">${esc(p.note)}</div>
      <div class="chips">${p.traits.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
      <div style="border-top:1px solid #2A2622;padding-top:12px;font-size:13px;color:#9C9487" id="mean"><i class="serif" style="font-size:17px;color:#F1EBE0">${esc(words[0].w)}</i> — ${esc(words[0].m)}.<button style="display:block;margin-top:4px;color:#C9CED3;font-size:13px" id="all">See all ${words.length} meanings</button></div></section>
    ${inFlow ? '<button class="btn" id="pgo">' + (next ? 'Calibrate my level' : 'Done') + '</button>' : ''}`;
  if (inFlow && host) {
    host.innerHTML = `<header><div class="row" style="justify-content:space-between"><div class="brand"><b>LUCENT</b><small>BY TIN APPLE</small></div><div class="stepno">02 — 03</div></div>
      <div class="rail">${OB_STEPS.map((n, i) => `<div><i class="${i <= 1 ? 'on' : ''}"></i><span class="${i === 1 ? 'cur' : ''}">${n}</span></div>`).join('')}</div></header><main class="fade-in">${inner}</main>`;
    $('#pgo', host).onclick = next;
  } else {
    host = document.createElement('div'); host.className = 'overlay dark';
    host.innerHTML = `<div class="ov-head"><button class="iconbtn" style="color:#C9CED3" data-close aria-label="Back">${ICON.back}</button><div></div><div style="width:44px"></div></div><div class="ov-body ob" style="position:static;display:block;padding-top:0"><main style="padding:6px 2px 24px">${inner}</main></div>`;
    host.querySelector('[data-close]').onclick = () => closeTop();
    pushOverlay(host);
  }
  $('#all', host).onclick = () => { $('#mean', host).innerHTML = words.map(x => `<div style="margin-bottom:8px"><i class="serif" style="font-size:17px;color:#F1EBE0">${esc(x.w)}</i> — ${esc(x.m)}.</div>`).join(''); };
}

/* ---------- offline download + updates ---------- */
async function startOfflineDownload(force) {
  if (!('serviceWorker' in navigator)) return;
  const o = store.get('offline3', { done: 0, total: 0 });
  if (o.total && o.done >= o.total && !force) return;
  try {
    const idx = await Dict.index();
    const urls = ['data/words.json', 'data/pool.json', 'data/dict/index.json', ...idx.map(x => 'data/dict/' + x[1])];
    const reg = await navigator.serviceWorker.ready;
    store.set('offline3', { done: o.done || 0, total: urls.length });
    reg.active && reg.active.postMessage({ type: 'download', key: 'dict', urls, cache: 'lucent-dict-v3' });
  } catch { }
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', ev => {
    const m = ev.data || {};
    if (m.type === 'dl-progress' || m.type === 'dl-done') {
      const o = store.get('offline3', { total: 0 }); o.done = m.done; if (m.type === 'dl-done' && !m.ok) o.retry = 1; store.set('offline3', o);
      const st = $('#offst'); if (st) st.textContent = offlineLabel(o);
    }
  });
}
function showUpdateBanner(reg) {
  if ($('.update-banner')) return;
  const sc = document.createElement('div'); sc.className = 'scrim';
  const b = document.createElement('div'); b.className = 'update-banner';
  b.innerHTML = `<b>A new version of Lucent is ready.</b><span class="muted" style="font-size:13px">Your Treasury stays exactly as it is.</span><button class="btn" id="upd">Update now</button><button class="btn ghost" id="later" style="height:44px">Later</button>`;
  document.body.append(sc, b);
  $('#upd', b).onclick = () => { b.innerHTML = '<b>Updating…</b>'; (reg.waiting || reg.installing) && (reg.waiting || reg.installing).postMessage({ type: 'skip-waiting' }); };
  $('#later', b).onclick = () => { b.remove(); sc.remove(); };
}
function showWhatsNew() {
  const seen = store.get('seenVersion', null);
  if (seen === VERSION) return;
  store.set('seenVersion', VERSION);
  if (!seen) return; // first install: no notes
  const missed = WHATS_NEW.filter(x => x.v > seen);
  if (!missed.length) return;
  overlay('What’s new', missed.map(x => `<div class="sec"><div class="serif" style="font-size:26px">${esc(x.title)}</div><div class="micro">Version ${esc(x.v)}</div>${x.notes.map(n => `<p style="font-size:15px;line-height:1.5;margin:6px 0">${esc(n)}</p>`).join('')}</div>`).join('') + '<div style="height:16px"></div><button class="btn" onclick="history.back()">Got it</button>');
}
async function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.register('sw.js');
    const watch = w => w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(reg); });
    if (reg.waiting && navigator.serviceWorker.controller) showUpdateBanner(reg);
    watch(reg.installing);
    reg.addEventListener('updatefound', () => watch(reg.installing));
    const check = () => reg.update().catch(() => { });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
    setInterval(check, 30 * 60 * 1000);
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloaded) return; reloaded = true; location.reload(); });
  } catch { }
}

/* ---------- start ---------- */
applyTheme();
registerSW();
if (!profile || !profile.palate || !profile.name) onboarding();
else { go('today'); showWhatsNew(); startOfflineDownload(); }

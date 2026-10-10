"""Génère la page de revue des posts (rendu « comme sur Instagram », OK / À corriger).

Usage :
    python3 CONTENU/06_GABARITS/revue.py <sortie.html> <dossier_post> [<dossier_post> ...]

Chaque dossier de post contient post.json, caption.txt et slide-NN.png (voir slides.py).
L'onglet Profil lit CONTENU/00_STRATEGIE/profil.json.

La page est publiée comme Artifact avec la capacité `db` : les retours du fondateur
sont enregistrés dans la collection `reviews` (un document par post), que Claude relit.
Le script affiche la carte des fichiers à publier (chemin publié -> fichier local).
"""

from __future__ import annotations

import base64
import html
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FONT = ROOT / "CONTENU/06_GABARITS/fonts/nohemi/Nohemi-SemiBold.woff2"
PROFILE = ROOT / "CONTENU/00_STRATEGIE/profil.json"


def load_post(folder: Path) -> dict:
    post = json.loads((folder / "post.json").read_text())
    slides = sorted(p.name for p in folder.glob("slide-*.png"))
    caption = (folder / "caption.txt").read_text().strip() if (folder / "caption.txt").exists() else ""
    return {
        "id": post["id"],
        "format": post.get("format", "carrousel"),
        "segment": post.get("segment", ""),
        "avatar": post.get("avatar", ""),
        "role": post.get("role_grille", ""),
        "cta": post.get("cta", ""),
        "verbatims": post.get("verbatims", []),
        "caption": caption,
        "slides": [f"posts/{post['id']}/{name}" for name in slides],
        "files": {f"posts/{post['id']}/{name}": str((folder / name).resolve().relative_to(ROOT)) for name in slides},
    }


def build(out: Path, folders: list[Path]) -> dict:
    posts = [load_post(f) for f in folders]
    profile = json.loads(PROFILE.read_text())
    font64 = base64.b64encode(FONT.read_bytes()).decode()
    data = json.dumps({"posts": [{k: v for k, v in p.items() if k != "files"} for p in posts],
                       "profile": profile}, ensure_ascii=False)
    page = TEMPLATE.replace("__FONT__", font64).replace("__DATA__", data.replace("</", "<\\/"))
    page = page.replace("__COUNT__", str(len(posts)))
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page)
    files = {}
    for p in posts:
        files.update(p["files"])
    return files


TEMPLATE = r"""<title>Revue ManySetter</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
<style>
@font-face { font-family: "Nohemi"; src: url(data:font/woff2;base64,__FONT__) format("woff2"); font-weight: 600; font-display: swap; }
/* Layout : un fil de posts façon Instagram, la revue à côté de chaque post ; l'onglet Profil montre la grille. */
:root {
  --bg: #faf9f8; --surface: #ffffff; --line: #e6e5e3; --muted: #76736f; --fg: #0d0c0a; --body: #42403c;
  --accent: #ff611d; --accent-ink: #e64b15; --accent-soft: #ffead8; --ok: #1f8a4c; --ok-soft: #e3f4ea; --fix: #b4410f; --fix-soft: #ffe7dc;
  --display: "Nohemi", "Inter", system-ui, sans-serif; --text: "Inter", system-ui, -apple-system, sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #0d0c0a; --surface: #1a1816; --line: #2a2825; --muted: #a3a09d; --fg: #faf9f8; --body: #d7d4d2;
  --accent: #ff884d; --accent-ink: #ff884d; --accent-soft: #421408; --ok: #5fd08f; --ok-soft: #12301f; --fix: #ff9a6b; --fix-soft: #3a1a0c; color-scheme: dark; } }
:root[data-theme="dark"] {
  --bg: #0d0c0a; --surface: #1a1816; --line: #2a2825; --muted: #a3a09d; --fg: #faf9f8; --body: #d7d4d2;
  --accent: #ff884d; --accent-ink: #ff884d; --accent-soft: #421408; --ok: #5fd08f; --ok-soft: #12301f; --fix: #ff9a6b; --fix-soft: #3a1a0c; color-scheme: dark; }
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--fg); font-family: var(--text); font-size: 15px; line-height: 1.5; }
.wrap { max-width: 1040px; margin: 0 auto; padding-inline: 16px; padding-block: 28px 64px; display: grid; gap: 28px; }
header.top { display: grid; gap: 10px; }
.eyebrow { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--accent-ink); font-weight: 600; }
h1 { font-family: var(--display); font-weight: 600; font-size: clamp(28px, 5vw, 40px); line-height: 1.08; margin: 0; text-wrap: balance; }
.lede { color: var(--body); max-width: 62ch; margin: 0; }
.bar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between; position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--bg); padding-block: 10px; border-bottom: 1px solid var(--line); }
.tabs { display: flex; gap: 6px; }
.tab { font: 600 14px var(--text); padding: 8px 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--surface); color: var(--body); cursor: pointer; }
.tab[aria-selected="true"] { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.tools { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.btn { font: 600 14px var(--text); padding: 8px 14px; border-radius: 10px; border: 1px solid var(--line); background: var(--surface); color: var(--fg); cursor: pointer; }
.btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
.btn:focus-visible, .tab:focus-visible, .choice:focus-visible, textarea:focus-visible, .nav:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
label.toggle { display: inline-flex; gap: 6px; align-items: center; font-size: 13px; color: var(--muted); }
.summary { font-size: 13px; color: var(--muted); font-variant-numeric: tabular-nums; }
.store { font-size: 12px; color: var(--muted); }

/* Un post */
.post { display: grid; grid-template-columns: minmax(0, 440px) minmax(0, 1fr); gap: 28px; align-items: start; }
@media (max-width: 860px) { .post { grid-template-columns: minmax(0, 1fr); } }
.ig { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
.ig-head { display: flex; align-items: center; gap: 10px; padding: 10px 12px; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--accent); color: #fff; display: grid; place-items: center; font: 600 15px var(--display); flex: none; }
.handle { font-weight: 600; font-size: 14px; }
.sub { font-size: 12px; color: var(--muted); }
.viewer { position: relative; }
.track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; aspect-ratio: 4 / 5; max-width: 100%; }
.track::-webkit-scrollbar { display: none; }
.track img { flex: 0 0 100%; width: 100%; height: 100%; object-fit: cover; scroll-snap-align: start; display: block; background: var(--line); }
.nav { position: absolute; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(255,255,255,.92); color: #0d0c0a; font-size: 18px; line-height: 32px; cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,.2); }
.nav.prev { left: 8px; } .nav.next { right: 8px; }
.nav[disabled] { opacity: 0; pointer-events: none; }
.pager { position: absolute; top: 10px; right: 10px; background: rgba(13,12,10,.7); color: #fff; font-size: 12px; padding: 2px 8px; border-radius: 999px; font-variant-numeric: tabular-nums; }
.dots { display: flex; gap: 4px; justify-content: center; padding: 10px 0 2px; }
.dots i { width: 6px; height: 6px; border-radius: 50%; background: var(--line); }
.dots i.on { background: var(--accent); }
.actions { display: flex; gap: 14px; padding: 6px 12px 0; color: var(--fg); }
.actions svg { width: 24px; height: 24px; }
.actions .save { margin-left: auto; }
.caption { padding: 8px 12px 14px; font-size: 14px; color: var(--fg); white-space: pre-wrap; overflow-wrap: anywhere; }
.caption b { font-weight: 600; }
.more { color: var(--muted); background: none; border: none; padding: 0; font: inherit; cursor: pointer; }

/* La revue */
.review { display: grid; gap: 14px; min-width: 0; }
.review h2 { font: 600 22px/1.2 var(--display); margin: 0; text-wrap: balance; overflow-wrap: anywhere; }
.facts { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 4px 14px; margin: 0; font-size: 14px; }
.facts dt { color: var(--muted); }
.facts dd { margin: 0; color: var(--body); overflow-wrap: anywhere; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { font-size: 12px; padding: 2px 8px; border-radius: 999px; background: var(--accent-soft); color: var(--accent-ink); font-variant-numeric: tabular-nums; }
.choices { display: flex; gap: 8px; flex-wrap: wrap; }
.choice { font: 600 15px var(--text); padding: 10px 16px; border-radius: 10px; border: 1.5px solid var(--line); background: var(--surface); color: var(--fg); cursor: pointer; }
.choice[data-v="ok"][aria-pressed="true"] { background: var(--ok-soft); border-color: var(--ok); color: var(--ok); }
.choice[data-v="fix"][aria-pressed="true"] { background: var(--fix-soft); border-color: var(--fix); color: var(--fix); }
textarea { width: 100%; min-height: 110px; resize: vertical; font: 15px/1.45 var(--text); padding: 10px 12px; border-radius: 10px; border: 1.5px solid var(--line); background: var(--surface); color: var(--fg); }
.state { font-size: 12px; color: var(--muted); min-height: 1.2em; }
hr.sep { border: none; border-top: 1px solid var(--line); margin: 8px 0 0; }

/* Profil */
.profile { max-width: 640px; width: 100%; margin: 0 auto; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
.p-top { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 18px; padding: 20px 16px 8px; align-items: center; }
.p-pic { width: 84px; height: 84px; border-radius: 50%; background: var(--accent); color: #fff; display: grid; place-items: center; font: 600 34px var(--display); }
.p-handle { font-size: 18px; font-weight: 600; }
.p-stats { display: flex; gap: 18px; font-size: 14px; color: var(--body); font-variant-numeric: tabular-nums; margin-top: 4px; }
.p-stats b { color: var(--fg); }
.p-bio { padding: 4px 16px 12px; font-size: 14px; white-space: pre-wrap; }
.p-bio .nm { font-weight: 600; display: block; }
.p-bio a { color: var(--accent-ink); text-decoration: none; font-weight: 500; }
.p-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 0 16px 14px; }
.p-btns span { text-align: center; font-size: 14px; font-weight: 600; padding: 7px; border-radius: 8px; background: var(--line); color: var(--fg); }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2px; border-top: 1px solid var(--line); }
.cell { position: relative; aspect-ratio: 3 / 4; overflow: hidden; background: var(--line); }
.cell img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cell .pin { position: absolute; top: 6px; right: 6px; background: rgba(13,12,10,.65); color: #fff; font-size: 11px; padding: 1px 6px; border-radius: 6px; }
.cell.ph { display: grid; place-items: center; padding: 10px; text-align: center; font-size: 12px; color: var(--muted); background: repeating-linear-gradient(135deg, var(--bg) 0 10px, var(--surface) 10px 20px); }
.opts { display: grid; gap: 10px; max-width: 640px; width: 100%; margin: 0 auto; }
.opt-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 14px; color: var(--body); }
.opt-row strong { font-weight: 600; color: var(--fg); min-width: 4.5em; }
.note { font-size: 13px; color: var(--muted); max-width: 640px; margin: 0 auto; }

/* Version pour la story : nom de marque flouté */
.blur-brand [data-brand] { filter: blur(7px); }
.blur-brand .viewer.cta::after { content: ""; position: absolute; left: 0; right: 0; bottom: 6%; height: 9%; backdrop-filter: blur(9px); -webkit-backdrop-filter: blur(9px); }
@media (prefers-reduced-motion: reduce) { .track { scroll-behavior: auto; } }
</style>

<div class="wrap" id="app">
  <header class="top">
    <div class="eyebrow">Revue du lot · <span id="count">__COUNT__</span> posts</div>
    <h1>Chaque post comme il apparaîtra sur Instagram</h1>
    <p class="lede">Fais défiler les slides, lis la légende, puis coche OK ou À corriger. Tes retours sont enregistrés ici et je les relis directement ; chaque retour devient une règle avant correction. Rien n'est programmé sans ton accord, post par post.</p>
  </header>

  <div class="bar">
    <div class="tabs" role="tablist">
      <button class="tab" role="tab" id="tab-posts" aria-selected="true" aria-controls="panel-posts">Posts</button>
      <button class="tab" role="tab" id="tab-profile" aria-selected="false" aria-controls="panel-profile">Profil</button>
    </div>
    <div class="tools">
      <span class="summary" id="summary"></span>
      <label class="toggle"><input type="checkbox" id="blur"> Flouter la marque (story)</label>
      <button class="btn primary" id="copy">Copier les retours</button>
    </div>
  </div>
  <div class="store" id="store">Connexion au stockage des retours…</div>

  <section id="panel-posts" role="tabpanel" aria-labelledby="tab-posts" style="display:grid;gap:44px"></section>
  <section id="panel-profile" role="tabpanel" aria-labelledby="tab-profile" hidden style="display:grid;gap:18px"></section>
</div>

<script id="data" type="application/json">__DATA__</script>
<script>
const DATA = JSON.parse(document.getElementById('data').textContent);
const state = {};           // id -> {verdict, note}
let db = null;
const $ = (s, el = document) => el.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const brandify = s => esc(s).replace(/ManySetter/g, '<span data-brand>ManySetter</span>');
const handle = DATA.profile.handle;

const ICONS = {
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7-4.4-9.2-8.6C1.3 8.4 3.2 5 6.6 5c2 0 3.5 1.1 4.4 2.6C11.9 6.1 13.4 5 15.4 5c3.4 0 5.3 3.4 3.8 6.4C19 15.6 12 20 12 20z"/></svg>',
  comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.1-4.2A8.5 8.5 0 1 1 20.5 12z"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7z"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h12v18l-6-5-6 5z"/></svg>'
};

function postCard(p, i) {
  const el = document.createElement('article');
  el.className = 'post';
  el.id = 'p-' + p.id;
  const short = p.caption.split('\n')[0];
  el.innerHTML = `
    <div class="ig">
      <div class="ig-head"><div class="avatar" aria-hidden="true">M</div>
        <div><div class="handle" data-brand>${esc(handle)}</div><div class="sub">Carrousel · ${p.slides.length} slides</div></div></div>
      <div class="viewer${''}">
        <div class="track" tabindex="0" aria-label="Slides du post ${i + 1}">${p.slides.map((s, k) => `<img src="${s}" alt="Slide ${k + 1}" loading="${i === 0 ? 'eager' : 'lazy'}" width="1080" height="1350">`).join('')}</div>
        <button class="nav prev" aria-label="Slide précédente" disabled>‹</button>
        <button class="nav next" aria-label="Slide suivante">›</button>
        <span class="pager">1/${p.slides.length}</span>
      </div>
      <div class="dots">${p.slides.map((_, k) => `<i class="${k === 0 ? 'on' : ''}"></i>`).join('')}</div>
      <div class="actions"><span>${ICONS.heart}</span><span>${ICONS.comment}</span><span>${ICONS.share}</span><span class="save">${ICONS.save}</span></div>
      <div class="caption"><b data-brand>${esc(handle)}</b> <span class="cap-short">${brandify(short)}</span> <button class="more">plus</button><span class="cap-full" hidden>${brandify(p.caption)}</span></div>
    </div>
    <div class="review">
      <div class="eyebrow">Post ${i + 1} sur ${DATA.posts.length}</div>
      <h2>${esc(p.id)}</h2>
      <dl class="facts">
        <dt>Segment</dt><dd>${esc(p.segment)}</dd>
        <dt>Avatar</dt><dd>${esc(p.avatar)}</dd>
        <dt>Rôle</dt><dd>${esc(p.role)}</dd>
        <dt>CTA</dt><dd>${esc(p.cta)}</dd>
        <dt>Verbatims</dt><dd><span class="chips">${p.verbatims.map(v => `<span class="chip">${esc(v)}</span>`).join('')}</span></dd>
      </dl>
      <div class="choices" role="group" aria-label="Verdict">
        <button class="choice" data-v="ok" aria-pressed="false">OK</button>
        <button class="choice" data-v="fix" aria-pressed="false">À corriger</button>
      </div>
      <label for="note-${p.id}" class="sub">Ce qu'il faut changer (slide, mot, idée) :</label>
      <textarea id="note-${p.id}" placeholder="Ex. slide 2, la phrase sur le canapé : trop long."></textarea>
      <div class="state" aria-live="polite"></div>
      <hr class="sep">
    </div>`;
  const track = $('.track', el), prev = $('.prev', el), next = $('.next', el), pager = $('.pager', el), dots = [...el.querySelectorAll('.dots i')];
  const n = p.slides.length;
  const idx = () => Math.round(track.scrollLeft / track.clientWidth);
  const sync = () => { const k = idx(); pager.textContent = `${k + 1}/${n}`; dots.forEach((d, j) => d.classList.toggle('on', j === k)); prev.disabled = k === 0; next.disabled = k === n - 1; $('.viewer', el).classList.toggle('cta', k === n - 1); };
  const go = d => track.scrollTo({ left: (idx() + d) * track.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  prev.onclick = () => go(-1); next.onclick = () => go(1);
  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { go(1); e.preventDefault(); } if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); } });
  $('.more', el).onclick = e => { $('.cap-short', el).hidden = true; e.target.hidden = true; $('.cap-full', el).hidden = false; };
  const ta = $('textarea', el), st = $('.state', el);
  el.querySelectorAll('.choice').forEach(b => b.onclick = () => {
    const v = b.dataset.v; const cur = (state[p.id] || {}).verdict;
    setLocal(p.id, { verdict: cur === v ? '' : v }); save(p.id, st);
  });
  let t = null;
  ta.addEventListener('input', () => { setLocal(p.id, { note: ta.value }, false); st.textContent = 'Modifié…'; clearTimeout(t); t = setTimeout(() => save(p.id, st), 900); });
  ta.addEventListener('blur', () => { clearTimeout(t); if (st.textContent === 'Modifié…') save(p.id, st); });
  el._paint = () => {
    const s = state[p.id] || {};
    el.querySelectorAll('.choice').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === s.verdict)));
    if (document.activeElement !== ta && typeof s.note === 'string') ta.value = s.note;
  };
  return el;
}

function setLocal(id, patch, repaint = true) {
  state[id] = Object.assign({ verdict: '', note: '' }, state[id], patch);
  try { localStorage.setItem('revue-ms', JSON.stringify(state)); } catch (e) {}
  if (repaint) paintAll();
}

async function save(id, st) {
  const s = state[id];
  if (!db) { st.textContent = 'Gardé sur cet appareil seulement (stockage partagé indisponible). Utilise « Copier les retours ».'; return; }
  st.textContent = 'Enregistrement…';
  try {
    await db.collection('reviews').doc(id).set({ verdict: s.verdict || '', note: s.note || '', updatedAt: new Date().toISOString() });
    st.textContent = 'Enregistré · ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    st.textContent = e && e.code === 'invalid_argument' ? "Ce compte ne peut pas enregistrer ici : copie tes retours avec le bouton." : "L'enregistrement a échoué. Réessaie, ou copie tes retours avec le bouton.";
  }
}

function paintAll() {
  document.querySelectorAll('.post').forEach(el => el._paint && el._paint());
  const vals = DATA.posts.map(p => (state[p.id] || {}).verdict);
  const ok = vals.filter(v => v === 'ok').length, fix = vals.filter(v => v === 'fix').length;
  $('#summary').textContent = `${ok} OK · ${fix} à corriger · ${DATA.posts.length - ok - fix} à voir`;
}

function profileView() {
  const pr = DATA.profile, byId = Object.fromEntries(DATA.posts.map(p => [p.id, p]));
  const order = [...pr.pins, ...pr.grid_order.filter(id => !pr.pins.includes(id))].filter(id => byId[id]);
  const sec = $('#panel-profile');
  sec.innerHTML = `
    <div class="opts">
      <div class="opt-row"><strong>Nom</strong>${pr.name_options.map((o, k) => `<button class="btn opt-name" data-k="${k}" aria-pressed="${k === 0}">${esc(o.label)}</button>`).join('')}</div>
      <div class="opt-row"><strong>Bio</strong>${pr.bio_options.map((o, k) => `<button class="btn opt-bio" data-k="${k}" aria-pressed="${k === 0}">${esc(o.label)}</button>`).join('')}</div>
    </div>
    <div class="profile">
      <div class="p-top"><div class="p-pic" aria-hidden="true">M</div>
        <div><div class="p-handle" data-brand>${esc(pr.handle)}</div>
        <div class="p-stats"><span><b>${order.length}</b> publications</span><span><b>0</b> followers</span><span><b>0</b> suivis</span></div></div></div>
      <div class="p-bio"><span class="nm" data-brand id="p-name"></span><span id="p-bio"></span>
<a data-brand>${esc(pr.link)}</a></div>
      <div class="p-btns"><span>Suivre</span><span>Message</span></div>
      <div class="grid">${order.map(id => `<div class="cell"><img src="${byId[id].slides[0]}" alt="Couverture de ${esc(id)}">${pr.pins.includes(id) ? '<span class="pin">Épinglé</span>' : ''}</div>`).join('')}${pr.placeholders.map(t => `<div class="cell ph">${esc(t)}</div>`).join('')}</div>
    </div>
    <p class="note">Maquette : le nom du compte (${esc(pr.handle)}) est provisoire, ${esc(pr.handle_note.replace(/^nom de compte provisoire : /, ''))}. La grille recadre chaque couverture en 3:4, comme Instagram. Détail des propositions : CONTENU/00_STRATEGIE/profil.md.</p>`;
  const setName = k => { $('#p-name').innerHTML = brandify(pr.name_options[k].text); sec.querySelectorAll('.opt-name').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.k === k))); };
  const setBio = k => { $('#p-bio').innerHTML = brandify(pr.bio_options[k].text); sec.querySelectorAll('.opt-bio').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.k === k))); };
  sec.querySelectorAll('.opt-name').forEach(b => b.onclick = () => setName(+b.dataset.k));
  sec.querySelectorAll('.opt-bio').forEach(b => b.onclick = () => setBio(+b.dataset.k));
  setName(0); setBio(0);
}

function exportText() {
  const lines = ['Retours de revue ManySetter', ''];
  DATA.posts.forEach((p, i) => {
    const s = state[p.id] || {};
    const v = s.verdict === 'ok' ? 'OK' : s.verdict === 'fix' ? 'À corriger' : 'Pas encore vu';
    lines.push(`${i + 1}. ${p.id} : ${v}`);
    if (s.note && s.note.trim()) lines.push('   ' + s.note.trim().replace(/\n/g, '\n   '));
  });
  return lines.join('\n');
}

// Onglets
function show(which) {
  const posts = which === 'posts';
  $('#tab-posts').setAttribute('aria-selected', String(posts)); $('#tab-profile').setAttribute('aria-selected', String(!posts));
  $('#panel-posts').hidden = !posts; $('#panel-profile').hidden = posts;
  try { localStorage.setItem('revue-ms-tab', which); } catch (e) {}
}
$('#tab-posts').onclick = () => show('posts'); $('#tab-profile').onclick = () => show('profile');
$('#blur').onchange = e => document.body.classList.toggle('blur-brand', e.target.checked);
$('#copy').onclick = async () => {
  const txt = exportText(); const b = $('#copy');
  try { await navigator.clipboard.writeText(txt); b.textContent = 'Copié'; }
  catch (e) { const ta = document.createElement('textarea'); ta.value = txt; ta.style.cssText = 'width:100%;min-height:160px'; $('#store').after(ta); ta.select(); b.textContent = 'Sélectionne et copie le texte ci-dessous'; }
  setTimeout(() => b.textContent = 'Copier les retours', 2500);
};

// Rendu initial, puis le stockage partagé quand il répond.
try { Object.assign(state, JSON.parse(localStorage.getItem('revue-ms') || '{}')); } catch (e) {}
DATA.posts.forEach((p, i) => $('#panel-posts').appendChild(postCard(p, i)));
profileView(); paintAll();
try { if (localStorage.getItem('revue-ms-tab') === 'profile' || location.hash === '#profil') show('profile'); } catch (e) {}

(async () => {
  const c = window.claude && window.claude.use ? await window.claude.use('db') : null;
  if (!c) { $('#store').textContent = 'Retours gardés sur cet appareil seulement. Pour me les transmettre, utilise « Copier les retours ».'; return; }
  db = c;
  $('#store').textContent = 'Retours enregistrés avec la page : je les relis directement.';
  db.collection('reviews').onSnapshot(snap => {
    snap.docs.forEach(d => { if (d.exists) { const v = d.data(); state[d.id] = Object.assign({}, state[d.id], { verdict: v.verdict || '', note: typeof v.note === 'string' ? v.note : '' }); } });
    paintAll();
  }, () => { $('#store').textContent = 'Le stockage partagé ne répond plus : tes retours restent sur cet appareil, copie-les avec le bouton.'; db = null; });
})();
</script>
"""


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    out = Path(sys.argv[1])
    files = build(out, [Path(a) for a in sys.argv[2:]])
    print(json.dumps(files, indent=1))

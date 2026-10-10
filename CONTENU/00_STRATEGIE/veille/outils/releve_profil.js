// À exécuter dans le navigateur intégré, sur la page publique d'un profil Instagram (sans connexion).
// Lit les 12 vignettes visibles, ouvre chaque post en arrière-plan (1,5 s d'écart) et renvoie une ligne par post :
// code;type (R reel, C carrousel, P photo);likes;commentaires;date;début de légende
// + la somme des likes, à recomparer au fichier après recopie.
(async () => {
const sleep=ms=>new Promise(r=>setTimeout(r,ms)); await sleep(2500);
const pm=((document.querySelector('meta[name="description"]')||{}).content||'').split(' - ')[0];
const items=[...document.querySelectorAll('a[href*="/p/"],a[href*="/reel/"]')].map(a=>({h:a.getAttribute('href'),t:[...a.querySelectorAll('svg')].map(s=>s.getAttribute('aria-label')).filter(Boolean).join('|')}));
const seen=new Set(); const its=items.filter(i=>!seen.has(i.h)&&seen.add(i.h)).slice(0,12);
const out=[];
for(const it of its){
  try{
    const h=await (await fetch(it.h,{credentials:'include'})).text();
    const m=h.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/);
    const d=m?m[1].replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/&#x[0-9a-f]+;/gi,' ').replace(/&#064;/g,'@').replace(/&amp;/g,'&'):'';
    const mm=d.match(/^([\d,\.]+[KkMm]?) likes?, ([\d,\.]+[KkMm]?) comments? - \S+ (?:le|on)\s+([A-Za-z]+ \d{1,2}, \d{4})(?::\s*"?([\s\S]{0,60}))?/);
    const code=it.h.split('/').filter(Boolean).pop(); const type=it.h.includes('/reel/')?'R':(it.t.includes('Carrousel')?'C':'P');
    out.push(mm?[code,type,mm[1],mm[2],mm[3],(mm[4]||'').replace(/[\s;"]+/g,' ').trim()].join(';'):[code,type,'?','?','?',d.slice(0,60).replace(/[\s;"]+/g,' ')].join(';'));
  }catch(e){ out.push(it.h+';ERR'); }
  await sleep(1500);
}
const num=s=>{if(!s||s==='?')return 0; s=s.replace(/,/g,''); const k=/k$/i.test(s)?1e3:/m$/i.test(s)?1e6:1; return Math.round(parseFloat(s)*k);};
return {user:location.pathname.split('/')[1], profile:pm, n:out.length, sumLikes: out.reduce((a,r)=>a+num(r.split(';')[2]),0), csv: out.join('\n')};
})()

// Code pour l'outil Playwright « run code » (navigateur local sans fenêtre, voir README).
// Pour chaque reel : détecte les coupes (écart d'image toutes les 0,25 s), compose une planche de 21 images
// (7 sur les 3 premières secondes, en bleu ; 14 sur le reste, en jaune) et l'enregistre dans .playwright-mcp/.
// Aucun fichier vidéo n'est téléchargé : on lit la vidéo déjà chargée par la page.
async (page) => {
  const out = {};
  for (const code of ['CODE1','CODE2']) {          // remplacer par les codes des reels retenus
    await page.goto('https://www.instagram.com/reel/' + code + '/');
    await page.waitForTimeout(3500);
    out[code] = await page.evaluate(async () => {
      const b=[...document.querySelectorAll('button')].find(x=>/Decline optional|Refuser les cookies optionnels/i.test(x.innerText)); if(b) b.click();
      await new Promise(r=>setTimeout(r,1500));
      const seek=(v,t)=>new Promise(r=>{ const f=()=>{v.removeEventListener('seeked',f); r();}; v.addEventListener('seeked',f); v.currentTime=t; setTimeout(r,3000); });
      const v=document.querySelector('video'); if(!v) return {err:'no video'}; v.pause(); v.muted=true; const D=v.duration;
      const sw=36, sh=64; const c0=document.createElement('canvas'); c0.width=sw; c0.height=sh; const x0=c0.getContext('2d',{willReadFrequently:true});
      let prev=null; const diffs=[];
      for(let t=0.05;t<D;t+=0.25){ await seek(v,t); x0.drawImage(v,0,0,sw,sh); const d=x0.getImageData(0,0,sw,sh).data; const g=new Float32Array(sw*sh); for(let i=0;i<sw*sh;i++) g[i]=(d[i*4]+d[i*4+1]+d[i*4+2])/3; if(prev){ let s=0; for(let i=0;i<g.length;i++) s+=Math.abs(g[i]-prev[i]); diffs.push([+t.toFixed(2), s/g.length]); } prev=g; }
      const vals=diffs.map(d=>d[1]).sort((a,b)=>a-b); const med=vals[Math.floor(vals.length/2)]; const thr=Math.max(18, med*4);
      const cuts=[]; for(const [t,dv] of diffs){ if(dv>thr && (!cuts.length || t-cuts[cuts.length-1]>0.6)) cuts.push(t); }
      const W=innerWidth, H=innerHeight; const cols=7, rows=3; const fh=Math.min(Math.floor(W/cols*16/9), Math.floor((H-2)/rows)); const fw=Math.floor(fh*9/16);
      let c=document.getElementById('__cs'); if(c) c.remove(); c=document.createElement('canvas'); c.id='__cs'; c.width=fw*cols; c.height=fh*rows; Object.assign(c.style,{position:'fixed',left:'0',top:'0',zIndex:2147483647,background:'#000'}); document.body.appendChild(c);
      const x=c.getContext('2d'); x.font='bold 13px sans-serif';
      const times=[]; for(let i=0;i<7;i++) times.push(0.1+i*0.5); for(let i=0;i<14;i++) times.push(3.5+(D-3.5)*(i+0.5)/14);
      for(let i=0;i<times.length;i++){ const t=times[i]; await seek(v,t); const px=(i%cols)*fw, py=Math.floor(i/cols)*fh; x.drawImage(v,px,py,fw,fh); x.fillStyle='rgba(0,0,0,.7)'; x.fillRect(px,py,46,17); x.fillStyle=i<7?'#0ff':'#ff0'; x.fillText(t.toFixed(1)+'s',px+3,py+13); }
      const m=document.querySelector('meta[property="og:title"]');
      return {D:+D.toFixed(1), nShots:cuts.length+1, avgShot:+(D/(cuts.length+1)).toFixed(2), cuts, title:m&&m.content.slice(0,700)};
    });
    await page.screenshot({path: '.playwright-mcp/sheet_' + code + '.jpg', type:'jpeg', quality:88});
  }
  return out;
}

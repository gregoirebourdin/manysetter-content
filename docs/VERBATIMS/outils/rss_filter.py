import xml.etree.ElementTree as ET, html, re, sys, os, json
ns={'a':'http://www.w3.org/2005/Atom'}
KW=re.compile(r"\b(dms?|inbox|setters?|leads?|manychat|booked|book(ing)? calls?|discovery calls?|ghost(ed|ing)?|left on read|follow[- ]?ups?|qualif\w*|no[- ]shows?|high[- ]ticket|consult(ation)? calls?|sales calls?|appointment)\b",re.I)
seen=set(); out=[]
for f in sys.argv[1:]:
    try: t=ET.parse(f).getroot()
    except Exception as e: continue
    for e in t.findall('a:entry',ns):
        link=e.find('a:link',ns).get('href')
        if '/comments/' not in link or link in seen: continue
        c=e.find('a:content',ns)
        txt=re.sub('<[^>]+>',' ',html.unescape(c.text or '')) if c is not None else ''
        txt=re.sub(r'\s+',' ',txt).split('submitted by')[0].strip()
        title=e.find('a:title',ns).text or ''
        hits=len(KW.findall(title+' '+txt))
        if hits<2: continue
        seen.add(link)
        upd=e.find('a:updated',ns); 
        out.append((os.path.basename(f)[:3],hits,(upd.text or '')[:10] if upd is not None else '',title,link.replace('https://www.reddit.com',''),len(txt),txt))
for o in out:
    print(f"{o[0]} h{o[1]} {o[2]} | {o[3][:90]} | {o[4]} | {o[5]}c")
json.dump([dict(src=o[0],hits=o[1],date=o[2],title=o[3],url='https://www.reddit.com'+o[4],text=o[6]) for o in out],open(os.environ.get('OUT','/dev/null'),'w'),ensure_ascii=False)

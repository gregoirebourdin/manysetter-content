import json, re, html, sys
def norm(s):
    s=html.unescape(s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('​','').replace('\xa0',' ')
    return re.sub(r'\s+',' ',s).strip()
corpus=json.load(open(sys.argv[1])); d=json.load(open(sys.argv[2]))
ok=0; ko=[]
for i,x in enumerate(d):
    base=re.sub(r'[?#].*$','',x['url']).rstrip('/')
    src=' '.join(v for k,v in corpus.items() if k.rstrip('/').startswith(base))
    parts=[p.strip(' .…') for p in re.split(r'\(…\)|\(\.\.\.\)| / |…',x['q']) if len(p.strip(' .…'))>3]
    good = bool(src) and all(norm(p) in src for p in parts)
    x['verified']=good
    if good: ok+=1
    else: ko.append((i,x['platform'][:20],x['q'][:90], 'NOSRC' if not src else 'MISMATCH'))
json.dump(d,open(sys.argv[2],'w'),ensure_ascii=False,indent=0)
print('verified',ok,'of',len(d))
for k in ko: print(k)

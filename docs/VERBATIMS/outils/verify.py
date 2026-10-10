"""Check that every quote appears verbatim (whitespace/quote-mark normalized) in its source URL text."""
import json, sys, re, html
sys.path.insert(0,'')
def norm(s):
    s=html.unescape(s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('​','').replace('\xa0',' ')
    return re.sub(r'\s+',' ',s).strip()
corpus=json.load(open(sys.argv[1]))
bad=0; n=0
for line in open(sys.argv[2]):
    if not line.strip(): continue
    q=json.loads(line); n+=1
    src=corpus.get(q['url'])
    if src is None:
        # comment permalinks: accept match within the thread (url prefix)
        cands=[v for k,v in corpus.items() if k.startswith(q['url'].split('?')[0].rstrip('/'))]
        src=' '.join(cands) if cands else None
    if src is None: print('NO SOURCE', q['id'], q['url']); bad+=1; continue
    if norm(q['q']) not in src: print('NOT FOUND', q['id'], q['q'][:80]); bad+=1
print(f"{n} quotes, {bad} problems")

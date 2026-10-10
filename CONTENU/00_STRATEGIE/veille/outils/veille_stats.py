import glob, os, statistics, json, sys
from datetime import datetime
S=sys.argv[1]
PINNED={'manychat':[0,1,2],'setsmart_io':[0,1,2],'inro.social':[0],'gohighlevel':[0,1,2],'stanforcreators':[0],
 'brock11johnson':[0,1,2],'therealbrianmark':[0,1,2],'colethomasgordon':[0,1],'jeremyleeminer':[0],
 'jennakutcher':[0,1,2],'amyporterfield':[0,1],'charliejohnsonfitness':[0,1,2]}
def num(s):
    s=s.replace(',','')
    if s in ('masqué','?',''): return None
    k=1000 if s.lower().endswith('k') else 1000000 if s.lower().endswith('m') else 1
    return round(float(s.rstrip('kKmM'))*k)
res={}
for f in sorted(glob.glob(S+'/*.csv')):
    acc=os.path.basename(f)[:-4]
    if acc not in PINNED: continue
    head=[l for l in open(f) if l.startswith('#')][0].split(';')[1]
    rows=[l.rstrip('\n').split(';') for l in open(f) if l.strip() and not l.startswith('#')]
    posts=[]
    for i,r in enumerate(rows):
        posts.append(dict(code=r[0],type=r[1],likes=num(r[2]),comments=num(r[3]),date=datetime.strptime(r[4],'%B %d, %Y').date().isoformat(),cap=r[5],pinned=i in PINNED[acc],
                          url=f"https://www.instagram.com/{'reel' if r[1]=='R' else 'p'}/{r[0]}/"))
    base=[p for p in posts if not p['pinned'] and p['likes'] is not None]
    ml=statistics.median([p['likes'] for p in base]); mc=statistics.median([p['comments'] for p in base])
    for p in posts:
        p["xl"]=round(p["likes"]/ml,2) if p["likes"] is not None and ml else None
        p["xc"]=round(p["comments"]/mc,2) if p['comments'] is not None and mc else None
    res[acc]=dict(profile=head,n=len(base),median_likes=ml,median_comments=mc,posts=posts)
json.dump(res,open(S+'/stats.json','w'),ensure_ascii=False,indent=1)
for acc,v in res.items():
    print(f"\n## {acc} | {v['profile']} | base {v['n']} posts | médiane likes {v['median_likes']} | médiane comm. {v['median_comments']}")
    for p in v['posts']:
        flag=('★' if (p['xl'] or 0)>=2 else ' ')+('c' if (p['xc'] or 0)>=2 else ' ')
        print(f"{flag} {'PIN' if p['pinned'] else '   '} {p['type']} {p['date']} L{p['likes']} x{p['xl']} C{p['comments']} x{p['xc']} {p['code']} {p['cap'][:55]}")

"""Build a lookup {url -> normalized text} from every raw source we downloaded."""
import json, glob, re, html, os, sys
import xml.etree.ElementTree as ET
ns={'a':'http://www.w3.org/2005/Atom'}
def norm(s):
    s=html.unescape(s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('​','').replace('\xa0',' ')
    return re.sub(r'\s+',' ',s).strip()
corpus={}
base=sys.argv[1]
for line in open(os.path.join(base,'mc_corpus.jsonl')):
    d=json.loads(line)
    for i,p in enumerate(d['posts']):
        link = d['url'] if i==0 or not p['post_id'] else f"{d['url']}?postid={p['post_id']}#post{p['post_id']}"
        corpus[link]=corpus.get(link,'')+' '+norm(p['text'])+(' '+norm(d.get('title','')) if i==0 else '')
for f in glob.glob(os.path.join(base,'raw','**','*.rss'),recursive=True):
    try: t=ET.parse(f).getroot()
    except Exception: continue
    for e in t.findall('a:entry',ns):
        link=e.find('a:link',ns).get('href')
        c=e.find('a:content',ns)
        txt=re.sub('<[^>]+>',' ',html.unescape(c.text or '')) if c is not None else ''
        title=e.find('a:title',ns).text or ''
        corpus[link]=corpus.get(link,'')+' '+norm(title+' . '+txt)
for f in glob.glob(os.path.join(base,'manual','*.txt')):
    url=None; buf=[]
    for line in open(f):
        if line.startswith('URL: '):
            if url: corpus[url]=corpus.get(url,'')+' '+norm(' '.join(buf))
            url=line[5:].strip(); buf=[]
        else: buf.append(line)
    if url: corpus[url]=corpus.get(url,'')+' '+norm(' '.join(buf))
json.dump(corpus,open(os.path.join(base,'corpus.json'),'w'),ensure_ascii=False)
print(len(corpus),'sources')

"""Extract posts (text + post anchor) from a Manychat community topic page."""
import sys, re, html, json
from html.parser import HTMLParser

class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.depth=0; self.cap=False; self.buf=[]; self.posts=[]; self.cur_id=None; self.last_id=None
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id','').startswith('post') and a['id'][4:].isdigit():
            self.last_id=a['id'][4:]
        if self.cap:
            self.depth+=1
            if tag in ('p','br','li','div'): self.buf.append('\n')
            return
        if tag=='div' and 'qa-topic-post-content' in (a.get('class') or ''):
            self.cap=True; self.depth=1; self.buf=[]; self.cur_id=self.last_id
    def handle_endtag(self, tag):
        if self.cap:
            self.depth-=1
            if self.depth==0:
                self.cap=False
                t=re.sub(r'[ \t\xa0]+',' ',''.join(self.buf))
                t=re.sub(r'\n\s*\n+','\n',t).strip()
                self.posts.append({'post_id':self.cur_id,'text':t})
    def handle_data(self, d):
        if self.cap: self.buf.append(d)

url, path = sys.argv[1], sys.argv[2]
h=open(path,encoding='utf-8',errors='replace').read()
p=P(); p.feed(h)
title=re.search(r'<title>(.*?)</title>',h,re.S)
dates=re.findall(r'datetime="([^"]+)"',h)
print(json.dumps({'url':url,'title':html.unescape(title.group(1).strip()) if title else '','dates':dates[:3],'posts':p.posts},ensure_ascii=False))

import xml.etree.ElementTree as ET, html, re, sys, os
ns={'a':'http://www.w3.org/2005/Atom'}
for f in sys.argv[1:]:
    try: t=ET.parse(f).getroot()
    except Exception as e: print('ERR',f,e); continue
    es=t.findall('a:entry',ns)
    print('########', os.path.basename(f), len(es))
    for e in es:
        c=e.find('a:content',ns)
        txt=re.sub('<[^>]+>',' ',html.unescape(c.text or '')) if c is not None else ''
        txt=re.sub(r'\s+',' ',txt).split('submitted by')[0].strip()
        link=e.find('a:link',ns).get('href').replace('https://www.reddit.com','')
        print(f"--- [{link}]\n{txt[:1200]}")

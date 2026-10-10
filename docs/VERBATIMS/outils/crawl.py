"""Polite Reddit RSS fetcher: one request per ~65 s, retries on 429."""
import sys, time, urllib.request, urllib.error, os, hashlib, re
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"
queue, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)
lines = [l.strip() for l in open(queue) if l.strip() and not l.startswith('#')]
for i, line in enumerate(lines):
    name, url = line.split(' ', 1)
    out = os.path.join(outdir, name + '.rss')
    if os.path.exists(out) and os.path.getsize(out) > 500:
        continue
    for attempt in range(4):
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        try:
            data = urllib.request.urlopen(req, timeout=30).read()
            open(out, 'wb').write(data)
            print(f"[{i+1}/{len(lines)}] OK {name} {len(data)}", flush=True)
            break
        except urllib.error.HTTPError as e:
            reset = int(float(e.headers.get('x-ratelimit-reset') or 30))
            print(f"[{i+1}/{len(lines)}] {e.code} {name}, wait {reset+5}s", flush=True)
            time.sleep(reset + 5)
        except Exception as e:
            print(f"[{i+1}/{len(lines)}] ERR {name} {e}", flush=True)
            time.sleep(20)
    time.sleep(65)
print("DONE", flush=True)

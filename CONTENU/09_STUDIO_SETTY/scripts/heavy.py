"""The shared lock of the heavy steps on this 8 GB Mac (renders, snapshots, the HyperFrames check, Whisper, the
alignment model, decoding an MP4): one at a time, served in order of arrival, visible with `studio.py queue`.

Light steps (the paid voice calls, build, the mix) never wait. studio.py takes the lock itself, around the heavy part
of each step only: never wrap a studio.py command in `lockf /tmp/setty-heavy.lock` any more (20/10 lot: the wrapper
held the lock for whole steps, in no order, and nobody could see the queue). An old-style wrapper still works: the
holder also takes /tmp/setty-heavy.lock, and a command run inside such a wrapper does not take the lock again.
"""
import contextlib
import fcntl
import json
import os
import pathlib
import subprocess
import time
import uuid

DIR = pathlib.Path("/tmp/setty-heavy")
LEGACY = pathlib.Path("/tmp/setty-heavy.lock")
_held = 0


def _alive(pid):
    try:
        os.kill(pid, 0)
        return True
    except ProcessLookupError:
        return False
    except PermissionError:
        return True


@contextlib.contextmanager
def _queue():
    """The queue file, read and written under a short exclusive lock; dead processes leave it on their own."""
    DIR.mkdir(exist_ok=True)
    with open(DIR / "meta.lock", "w") as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        qf = DIR / "queue.json"
        try:
            q = json.loads(qf.read_text()) if qf.exists() else []
        except json.JSONDecodeError:
            q = []
        box = [[e for e in q if _alive(e["pid"])]]
        yield box
        tmp = DIR / f"queue.{os.getpid()}.tmp"
        tmp.write_text(json.dumps(box[0], indent=1))
        tmp.replace(qf)


def _under_legacy():
    """True inside an old `lockf /tmp/setty-heavy.lock …` wrapper (it already holds the lock for us)."""
    pid = os.getppid()
    for _ in range(8):
        out = subprocess.run(["ps", "-o", "ppid=,command=", "-p", str(pid)], capture_output=True, text=True).stdout.strip()
        if not out:
            return False
        ppid, _, cmd = out.partition(" ")
        if "setty-heavy.lock" in cmd:
            return True
        pid = int(ppid)
        if pid <= 1:
            return False
    return False


def _ago(t):
    s = int(time.time() - t)
    return f"{s // 60} min {s % 60:02d} s" if s >= 60 else f"{s} s"


@contextlib.contextmanager
def heavy(what):
    """with heavy("reel5 render 60 fps"): … — waits its turn, prints who is ahead, releases even on an error."""
    global _held
    if _held or os.environ.get("SETTY_HEAVY_HELD") or _under_legacy():
        _held += 1
        try:
            yield
        finally:
            _held -= 1
        return
    me = {"id": uuid.uuid4().hex, "pid": os.getpid(), "what": what, "since": time.time()}
    legacy, said, said_at, t0 = None, None, 0.0, time.time()
    try:
        while True:
            with _queue() as box:
                q = box[0]
                if not any(e["id"] == me["id"] for e in q):
                    q.append(me)
                pos = next(k for k, e in enumerate(q) if e["id"] == me["id"])
                if pos == 0:
                    q[0]["start"] = time.time()
                    break
                ahead = [f"{e['what']} ({'running ' + _ago(e['start']) if e.get('start') else 'waiting'})" for e in q[:pos]]
                key = [(e["id"], bool(e.get("start"))) for e in q[:pos]]
            if key != said or time.time() - said_at > 60:  # when the queue ahead changes, else once a minute
                print(f"  ⏳ heavy lock: {pos} ahead of « {what} »: " + "; ".join(ahead), flush=True)
                said, said_at = key, time.time()
            time.sleep(1.5)
        if time.time() - t0 > 5:
            print(f"  ⏳ heavy lock: « {what} » starts after {_ago(t0)} of waiting", flush=True)
        legacy = open(LEGACY, "w")
        fcntl.flock(legacy, fcntl.LOCK_EX)  # an old-style `lockf` user, if any, finishes first
        _held += 1
        os.environ["SETTY_HEAVY_HELD"] = "1"
        yield
    finally:
        if legacy:
            _held -= 1
            os.environ.pop("SETTY_HEAVY_HELD", None)
            legacy.close()
        with _queue() as box:
            box[0] = [e for e in box[0] if e["id"] != me["id"]]


def show():
    """Who holds the lock, since when, and who waits (oldest first)."""
    with _queue() as box:
        q = list(box[0])
    if not q:
        return "heavy lock: free"
    lines = []
    for k, e in enumerate(q):
        if k == 0 and e.get("start"):
            lines.append(f"  ▶ {e['what']}: running for {_ago(e['start'])} (pid {e['pid']})")
        else:
            lines.append(f"  {k}. {e['what']}: waiting for {_ago(e['since'])} (pid {e['pid']})")
    return "heavy lock:\n" + "\n".join(lines)

"""Génère verbatims.md à partir de verbatims.jsonl (une citation par ligne).

Usage : python3 docs/VERBATIMS/build_verbatims.py
Champs d'une ligne : id, q (citation mot pour mot), url, theme (T1..T11), av (AV1, AV2, AV3), note (option).
"""
import json, os, re
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
THEMES = {  # ordre d'affichage
    "T1": "La boîte qui déborde",
    "T2": "Les leads qui disparaissent",
    "T3": "Les contournements",
    "T4": "Les flows et bots qui répondent à côté",
    "T13": "Quand l'automatisation lâche (déclencheurs, demandes de message, restrictions Meta)",
    "T5": "Le setter humain",
    "T6": "Le relais vers un humain",
    "T7": "Qualifier, les mauvais appels",
    "T8": "Les agences et leurs clients",
    "T9": "Peurs et objections : sonner comme un bot, se faire bannir",
    "T12": "Les émotions",
    "T10": "Ce qu'ils veulent",
    "T11": "Humour et autodérision",
}
VERIF = {"script": "script", "navigateur": "navigateur"}
AV = {"AV1": "Maya (S1)", "AV2": "Jordan (S2)", "AV3": "Sam (S3)"}


def source_label(url):
    m = re.search(r"reddit\.com/r/([^/]+)/", url)
    if m:
        return f"r/{m.group(1)}"
    if "community.manychat.com" in url:
        return "Communauté Manychat"
    m = re.search(r"https?://([a-z]+\.)?(trustpilot|freelancer|linkedin|skool)\.", url)
    if m:
        return {"linkedin": "LinkedIn"}.get(m.group(2), m.group(2).capitalize())
    return re.sub(r"https?://(www\.)?([^/]+).*", r"\2", url)


def thread_of(url):
    """Une discussion = un fil, quel que soit le commentaire cité."""
    m = re.search(r"(reddit\.com/r/[^/]+/comments/[^/]+)/", url)
    if m:
        return m.group(1)
    return re.sub(r"\?.*$", "", url)


def main():
    rows = [json.loads(l) for l in open(os.path.join(HERE, "verbatims.jsonl")) if l.strip()]
    by_theme = defaultdict(list)
    for r in rows:
        by_theme[r["theme"]].append(r)
    av_count = Counter(r["av"] for r in rows)
    src_count = Counter(source_label(r["url"]) for r in rows)
    threads = {thread_of(r["url"]) for r in rows}

    out = []
    out.append(open(os.path.join(HERE, "_entete.md")).read().rstrip() + "\n")
    out.append(f"**État** : {len(rows)} citations, tirées de {len(threads)} discussions. "
               + ", ".join(f"{AV[a]} : {av_count[a]}" for a in AV) + ". "
               + "Sources : " + ", ".join(f"{k} ({v})" for k, v in src_count.most_common()) + ".\n")
    out.append("## Les citations, par thème\n")
    for code, name in THEMES.items():
        items = by_theme.get(code, [])
        if not items:
            continue
        out.append(f"### {code} · {name} ({len(items)})\n")
        out.append("| # | Citation (mot pour mot) | Avatar | Source | Vérif. | Note |")
        out.append("| --- | --- | --- | --- | --- | --- |")
        for r in sorted(items, key=lambda r: (r["av"], r["id"])):
            q = r["q"].replace("|", "\\|")
            note = (r.get("note") or "").replace("|", "\\|")
            verif = VERIF.get(r.get("verif", "script"), "à revérifier")
            out.append(f"| {r['id']} | « {q} » | {AV[r['av']]} | [{source_label(r['url'])}]({r['url']}) | {verif} | {note} |")
        out.append("")
    out.append("## Index par avatar\n")
    for a, label in AV.items():
        ids = [r["id"] for r in sorted(rows, key=lambda r: r["id"]) if r["av"] == a]
        out.append(f"- **{label}** ({len(ids)}) : " + ", ".join(ids))
    out.append("")
    open(os.path.join(HERE, "verbatims.md"), "w").write("\n".join(out))
    print(f"{len(rows)} citations écrites dans verbatims.md")


if __name__ == "__main__":
    main()

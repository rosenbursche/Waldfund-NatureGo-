# Aufruf (Python mit Zertifikaten, z. B. SSL_CERT_FILE aus certifi): python3 -I testfotos_holen.py <db> <ordner> <arten_je_gruppe> <bilder_je_art>
# Testfotos für eine Zufallsauswahl deutscher Arten: nur Aufnahmen 2025/2026 (nach dem BioCLIP-2-Stichtag),
# nur Bildlizenz CC0 / CC BY / CC BY-SA / PDM (je Bild geprüft), ohne iNaturalist, Beobachtungen von Menschen.
import json, os, random, re, sqlite3, sys, time, urllib.parse, urllib.request
DB, AUS, N_JE_GRUPPE, BILDER_JE_ART = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
UA = 'WildfundApp/0.1 (https://github.com/rosenbursche/Waldfund-NatureGo-)'
COL = '7ddf754f-d193-4cc9-b351-99906754a03b'
INAT = '50c9509d-22c7-4a22-a47d-8c48425ef4a7'
LAENDER = ['DE', 'AT', 'CH', 'NL', 'DK', 'PL', 'CZ', 'BE', 'LU', 'FR', 'SE', 'NO']

def lizenz(l):
    l = (l or '').lower()
    if re.search(r'\bnc\b|-nc|\bnd\b|-nd|non-?commercial|all rights|copyright|©', l): return None
    if 'publicdomain/zero' in l or re.search(r'\bcc0\b|cc-zero', l): return 'CC0'
    if 'publicdomain/mark' in l: return 'PDM'
    m = re.search(r'licenses/(by-sa|by)/(\d\.\d)', l)
    if m: return f'CC {m.group(1).upper()} {m.group(2)}'
    return None

def holen(url, roh=False):
    for v in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60) as r:
                return r.read() if roh else json.load(r)
        except Exception:
            time.sleep(2 * (v + 1))
    return None

con = sqlite3.connect(DB)
random.seed(20261025)
auswahl = []
for g in ('saeuger', 'voegel', 'pflanzen', 'pilze'):
    z = con.execute("""SELECT a.id, a.wiss_name, a.col_id FROM art a JOIN vorkommen v ON v.art_id = a.id AND v.gebiet = 'DE'
                       WHERE a.gruppe = ? AND a.in_app = 0 AND v.nachweise >= 200 AND a.wiss_name NOT LIKE '%×%'""", (g,)).fetchall()
    random.shuffle(z)
    auswahl += [(g, *r) for r in z[:N_JE_GRUPPE * 2]]  # Reserve, falls zu wenige Fotos
os.makedirs(AUS, exist_ok=True)
meta, fertig = [], {}
for g, aid, wiss, col in auswahl:
    if fertig.get(g, 0) >= N_JE_GRUPPE: continue
    treffer = []
    for laender in (['DE'], LAENDER):
        q = [('checklistKey', COL), ('taxonKey', col), ('mediaType', 'StillImage'), ('eventDate', '2025-01-01,2026-12-31'),
             ('basisOfRecord', 'HUMAN_OBSERVATION'), ('limit', 100)] + [('country', c) for c in laender]
        d = holen('https://api.gbif.org/v1/occurrence/search?' + urllib.parse.urlencode(q)) or {}
        for r in d.get('results', []):
            if r.get('datasetKey') == INAT: continue
            for m in r.get('media', []):
                lz = lizenz(m.get('license'))
                if lz and m.get('identifier', '').startswith('http'):
                    treffer.append((r, m, lz)); break
        if len({t[0].get('recordedBy') for t in treffer}) >= BILDER_JE_ART: break
    # möglichst verschiedene Fotografen
    gesehen, wahl = set(), []
    for r, m, lz in treffer:
        if r.get('recordedBy') in gesehen: continue
        gesehen.add(r.get('recordedBy')); wahl.append((r, m, lz))
        if len(wahl) == BILDER_JE_ART: break
    if len(wahl) < BILDER_JE_ART:
        print(g, aid, "zu wenige Fotos", len(wahl), flush=True); continue
    ok = 0
    for k, (r, m, lz) in enumerate(wahl):
        daten = holen(m['identifier'], roh=True)
        if not daten or len(daten) < 5000: continue
        datei = os.path.join(AUS, f'{aid}--{k}.jpg')
        open(datei, 'wb').write(daten); ok += 1
        meta.append({'id': f'{aid}:{k}', 'datei': datei, 'art_id': aid, 'wiss': wiss, 'gruppe': g, 'url': m['identifier'],
                     'gbif': f"https://www.gbif.org/occurrence/{r['key']}", 'lizenz': lz, 'urheber': m.get('creator') or m.get('rightsHolder') or r.get('recordedBy'),
                     'datum': r.get('eventDate'), 'land': r.get('countryCode'), 'datensatz': r.get('datasetKey')})
        time.sleep(0.3)
    if ok: fertig[g] = fertig.get(g, 0) + 1
    print(g, aid, ok, flush=True)
    json.dump(meta, open(os.path.join(AUS, '..', 'test2.json'), 'w'), ensure_ascii=False, indent=1)
print('fertig', fertig, len(meta))

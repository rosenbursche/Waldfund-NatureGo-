"""Prüft, ob die Erkennung Fundstücke erkennt (Trittsiegel, Losung, Fraßspuren, Federn, Blatt, Rinde, Knospe, Frucht).

    venv/bin/python fundstuecke_testen.py <testbilder.json> <arten.json> [ergebnis.json]

testbilder.json: Liste von {"id", "art" (App-Art-ID), "typ", "datei", "quelle", "aufnahme_ab_2025"}.
    Einträge mit "nur_typ": true (z. B. ganze Tiere) zählen nur für die Typ-Erkennung (Variante D).
arten.json: {app-art-id: {"lat": "<wissenschaftlicher Name>"}} (auch Arten außerhalb der App, z. B. Rothirsch).

Varianten (Bericht: recherche/erkennung/fundstuecke-test.md):
  A  wie heute: alle Arten (erkenner.py unverändert), einmal offen, einmal mit Gruppe
  B  nur die App-Arten, die diesen Fundstück-Typ haben (src/data/fundstuecke.json), Art-Vektoren wie heute
  C  eigene Text-Vektoren je Art und Fundstück-Typ (fundstueck_vektoren.py), Kandidaten wie B
  CB Mischung: Mittel aus Art-Vektor und Fundstück-Vektor, Kandidaten wie B
  D  Typ-Erkennung: Was ist auf dem Foto (Trittsiegel, Losung, Feder, Blatt …)?
"""
import json
import sys
from collections import defaultdict
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image

from erkenner import Erkenner
from fundstueck_vektoren import FundstueckVektoren, kandidaten_je_typ

HIER = Path(__file__).resolve().parent
# Englische Namen, wo die Datenbank keinen hat (für die Text-Formulierungen)
EN_ERSATZ = {'Lepus europaeus': 'European hare', 'Castor fiber': 'Eurasian beaver'}


def main(bilder_datei, arten_datei, aus_datei=HIER / 'daten' / 'testergebnis-fundstuecke.json'):
    bilder = json.load(open(bilder_datei))
    app = json.load(open(arten_datei))
    e = Erkenner()
    fv = FundstueckVektoren(e.modell, e.geraet, e.skala)
    nach_wiss = {a['wiss']: i for i, a in enumerate(e.arten) if not a['gegen']}
    zeile = {k: nach_wiss.get(v['lat']) for k, v in app.items()}  # App-Art → Zeile in artvektoren.npz
    kand = kandidaten_je_typ()
    print(f'{len(bilder)} Bilder, {len(e.arten)} Arten, Gerät {e.geraet}')

    def en(art):
        a = e.arten[zeile[art]]
        return a['en'] or EN_ERSATZ.get(a['wiss'])

    # Vektoren für C und CB je Prüf-Typ (Kandidaten = App-Arten mit diesem Typ)
    cv = {}
    for typ, arten in kand.items():
        arten = [a for a in arten if zeile.get(a) is not None]
        c = fv.art_vektoren(typ, [(e.arten[zeile[a]]['wiss'], en(a)) for a in arten])
        b = e.vektoren[[zeile[a] for a in arten]]
        cv[typ] = (arten, c, F.normalize(c + b, dim=-1))

    def rang(p, arten, soll):
        ordnung = [arten[i] for i in np.argsort(-p)]
        return ordnung.index(soll) + 1 if soll in ordnung else None, ordnung[:6], float(p.max())

    ergebnisse = []
    for b in bilder:
        bild = Image.open(b['datei'])
        f = e.fingerabdruck(bild)
        r = {'id': b['id'], 'art': b['art'], 'typ': b['typ'], 'quelle': b.get('quelle'),
             'ab_2025': b.get('aufnahme_ab_2025', False), 'nur_typ': b.get('nur_typ', False)}
        typen = fv.typ_erkennen(f)
        r['D'] = {'typ': typen[0][0], 'p': round(typen[0][1], 3), 'top3': [t for t, _ in typen[:3]]}
        if not r['nur_typ']:
            ziel = zeile.get(b['art'])
            soll = e.arten[ziel]['id'] if ziel is not None else None
            gruppe = e.arten[ziel]['gruppe'] if ziel is not None else None
            for name, kw in (('A', {}), ('A_gruppe', {'gruppe': gruppe})):
                x = e.erkennen(bild, **kw)
                ids = [v['id'] for v in x['vorschlaege']]
                r[name] = {'rang': ids.index(soll) + 1 if soll in ids else None, 'top': ids, 'status': x['status'],
                           'p': x['vorschlaege'][0]['sicherheit'],
                           'gattung1': x['vorschlaege'][0]['wiss'].split()[0] == e.arten[ziel]['wiss'].split()[0]}
            if b['typ'] in kand and b['art'] in cv[b['typ']][0]:
                arten, c, cb = cv[b['typ']]
                ids_db = [e.arten[zeile[a]]['id'] for a in arten]
                x = e.erkennen(bild, kandidaten=ids_db)
                top = [v['id'] for v in x['vorschlaege']]
                r['B'] = {'rang': top.index(soll) + 1 if soll in top else None, 'top': top, 'status': x['status'],
                          'p': x['vorschlaege'][0]['sicherheit'], 'n': len(arten)}
                for name, m in (('C', c), ('CB', cb)):
                    rg, top, p = rang(fv.vergleichen(f, m), arten, b['art'])
                    r[name] = {'rang': rg, 'top': top, 'p': round(p, 3), 'n': len(arten)}
        ergebnisse.append(r)
        print('.', end='', flush=True)
    print()
    json.dump(ergebnisse, open(aus_datei, 'w'), ensure_ascii=False, indent=1)
    tabellen(ergebnisse)


def tabellen(ergebnisse):
    """Top-1, Top-5, Top-6 je Variante und Typ, dazu „sicher“ (≥ 0,90) und davon richtig."""
    for teil, filt in (('alle Bilder', lambda r: True), ('nur Aufnahmen ab 2025', lambda r: r['ab_2025']),
                       ('nur Aufnahmen vor 2025', lambda r: not r['ab_2025'])):
        print(f'\n=== {teil} ===')
        for v in ('A', 'A_gruppe', 'B', 'C', 'CB'):
            z = defaultdict(lambda: defaultdict(int))
            for r in ergebnisse:
                if r['nur_typ'] or v not in r or not filt(r):
                    continue
                x = r[v]
                for t in (r['typ'], 'alle'):
                    s = z[t]
                    s['n'] += 1
                    s['t1'] += x['rang'] == 1
                    s['t5'] += x['rang'] is not None and x['rang'] <= 5
                    s['t6'] += x['rang'] is not None and x['rang'] <= 6
                    s['sicher'] += x.get('status') == 'sicher' or (v in ('C', 'CB') and x['p'] >= 0.9)
                    s['sicher_ok'] += (x.get('status') == 'sicher' or (v in ('C', 'CB') and x['p'] >= 0.9)) and x['rang'] == 1
            print(f'\n{v}:  {"Typ":12} {"n":>4} {"Top-1":>6} {"Top-5":>6} {"Top-6":>6} {"sicher":>7} {"davon ok":>8}')
            for t, s in sorted(z.items()):
                n = s['n']
                ok = f"{s['sicher_ok'] / s['sicher']:.0%}" if s['sicher'] else '–'
                print(f'    {t:12} {n:4} {s["t1"] / n:6.0%} {s["t5"] / n:6.0%} {s["t6"] / n:6.0%} '
                      f'{s["sicher"] / n:7.0%} {ok:>8}')
    # Typ-Erkennung
    z = defaultdict(lambda: defaultdict(int))
    for r in ergebnisse:
        z[r['typ']][r['D']['typ']] += 1
    print('\nD (Typ-Erkennung): Zeile = echter Typ, Spalten = erkannter Typ')
    for t, s in sorted(z.items()):
        n = sum(s.values())
        print(f'    {t:12} n={n:3} richtig {s.get(t, 0) / n:4.0%}  ', dict(sorted(s.items(), key=lambda x: -x[1])))


if __name__ == '__main__':
    with torch.no_grad():
        sys.exit(main(*sys.argv[1:]))

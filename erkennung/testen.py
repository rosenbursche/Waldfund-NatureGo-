"""Prüft die Erkennung mit Testbildern, deren Art bekannt ist.

    venv/bin/python testen.py <testbilder.json> <arten.json>

testbilder.json: Liste von {"id", "datei", "art"} (Art-ID der App), arten.json: {art-id: {"lat": ...}}.
Ergebnis: Tabelle in der Konsole und daten/testergebnis.json.
"""
import json
import sys
from collections import defaultdict
from pathlib import Path

from PIL import Image

from erkenner import Erkenner

HIER = Path(__file__).resolve().parent


def main(bilder_datei, arten_datei):
    bilder = [b for b in json.load(open(bilder_datei)) if b.get('art')]
    app_arten = json.load(open(arten_datei))
    e = Erkenner()
    nach_wiss = {a['wiss']: a['id'] for a in e.arten}
    print(f'{len(bilder)} Testbilder, {len(e.arten)} Arten in der Auswahl, Gerät {e.geraet}')

    ergebnisse = []
    for b in bilder:
        soll = nach_wiss.get(app_arten[b['art']]['lat'])
        bild = Image.open(b['datei'])
        gruppe = e.arten[[a['id'] for a in e.arten].index(soll)]['gruppe'] if soll else None
        r_offen = e.erkennen(bild)
        r_gruppe = e.erkennen(bild, gruppe=gruppe) if gruppe else r_offen
        ergebnisse.append({'id': b['id'], 'soll': soll, 'gruppe': gruppe, 'offen': r_offen, 'mit_gruppe': r_gruppe})

    def auswerten(schluessel):
        zeilen = defaultdict(lambda: defaultdict(int))
        for r in ergebnisse:
            if not r['soll']:
                continue
            x = r[schluessel]
            for g in (r['gruppe'], 'alle'):
                z = zeilen[g]
                z['n'] += 1
                z['top1'] += x['vorschlaege'][0]['id'] == r['soll']
                z['top5'] += r['soll'] in [v['id'] for v in x['vorschlaege']]
                z['sicher'] += x['status'] == 'sicher'
                z['sicher_richtig'] += x['status'] == 'sicher' and x['art']['id'] == r['soll']
                z['gattung'] += x['status'] == 'gattung'
        print(f'\n{schluessel}:')
        print(f'{"Gruppe":10} {"Bilder":>6} {"Top-1":>7} {"Top-5":>7} {"sicher":>7} {"davon richtig":>14} {"Gattung":>8}')
        for g, z in sorted(zeilen.items()):
            n = z['n']
            sr = f'{z["sicher_richtig"] / z["sicher"]:.1%}' if z['sicher'] else '–'
            print(f'{g:10} {n:6} {z["top1"] / n:7.1%} {z["top5"] / n:7.1%} {z["sicher"] / n:7.1%} {sr:>14} '
                  f'{z["gattung"] / n:8.1%}')
        return {g: dict(z) for g, z in zeilen.items()}

    fehlt = sorted({b['art'] for b, r in zip(bilder, ergebnisse) if not r['soll']})
    if fehlt:
        print('Nicht in der Datenbank:', fehlt)
    zusammen = {'offen': auswerten('offen'), 'mit_gruppe': auswerten('mit_gruppe')}
    sek = [r['offen']['sekunden'] for r in ergebnisse]
    print(f'\nZeit je Bild: Median {sorted(sek)[len(sek) // 2]:.2f} s, Laden {e.ladezeit:.0f} s')
    (HIER / 'daten').mkdir(exist_ok=True)
    json.dump({'zusammenfassung': zusammen, 'ergebnisse': ergebnisse}, open(HIER / 'daten' / 'testergebnis.json', 'w'),
              ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main(*sys.argv[1:3])

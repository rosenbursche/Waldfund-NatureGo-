"""
Hilfsfunktionen und Vorbild-Icons für Art-Icons (Stilregeln: docs/ICONS.md).

Aufruf der Vorbilder:  python3 scripts/icon-helfer.py src/data/icons
Für eine neue Art: eigenes Skript schreiben, das diese Datei importiert, z. B.

    import sys; sys.path.insert(0, 'scripts'); from icon_helfer import *   # (Datei als icon_helfer.py kopieren oder per importlib laden)
    ebenen = hg_wald() + [form('M…Z', '#A0602F'), E('M…Z', '#6B3B1C', o=0.9, rolle='schatten'), …]
    speichern('dachs', ebenen, quellen=[{'titel': '…', 'url': '…'}])

Raster 120 × 120, Mitte 60/60, sichtbar ist die Scheibe mit Radius 41 (x/y etwa 19–101).
"""
import json, math, os, sys
ZIEL = sys.argv[1] if len(sys.argv) > 1 and __name__ == '__main__' else 'src/data/icons'
INK = '#1A120C'
def E(d, f=None, o=None, s=None, sw=None, rolle=None):
    e = {'d': d}
    if f: e['f'] = f
    if o is not None: e['o'] = o
    if s: e['s'] = s
    if sw: e['sw'] = sw
    if rolle: e['rolle'] = rolle
    return e
def form(d, f): return E(d, f, s=INK, sw=1.6, rolle='form')
def kreis(cx, cy, r): return f'M{cx-r} {cy} a{r} {r} 0 1 0 {2*r} 0 a{r} {r} 0 1 0 {-2*r} 0 Z'
def oval(cx, cy, rx, ry): return f'M{cx-rx} {cy} a{rx} {ry} 0 1 0 {2*rx} 0 a{rx} {ry} 0 1 0 {-2*rx} 0 Z'
def dreh(pts, cx, cy, grad):
    a = math.radians(grad); c, s = math.cos(a), math.sin(a)
    return [(round(cx + x*c - y*s, 1), round(cy + x*s + y*c, 1)) for x, y in pts]
def bez(start, segs):
    d = f'M{start[0]} {start[1]}'
    for i in range(0, len(segs), 3):
        (a, b), (c, e), (x, y) = segs[i], segs[i+1], segs[i+2]
        d += f' C{a} {b} {c} {e} {x} {y}'
    return d + ' Z'

# ---------- Hintergründe je Kategorie (weich, ohne Kontur) ----------
def hg_wald():
    return [E(kreis(60, 60, 41), '#16261B', rolle='detail'),
            E(kreis(38, 40, 20), '#2C4A30', o=0.55, rolle='detail'),
            E(kreis(88, 36, 13), '#3F5E2E', o=0.45, rolle='detail'),
            E(kreis(30, 70, 9), '#3F5E2E', o=0.35, rolle='detail'),
            E('M19 90 Q40 82 60 88 T101 86 L101 102 L19 102 Z', '#22381F', rolle='detail')]
def hg_boden():
    return [E(kreis(60, 60, 41), '#1C2618', rolle='detail'),
            E(kreis(40, 38, 18), '#3A4E2A', o=0.5, rolle='detail'),
            E(kreis(86, 46, 12), '#55663A', o=0.35, rolle='detail'),
            E('M19 92 Q60 82 101 92 L101 102 L19 102 Z', '#3B4F26', rolle='detail'),
            E('M30 92 l2 -8 l2 8 M80 90 l1.5 -7 l2 7 M90 93 l1 -6 l1.5 6', s='#6E8A3E', sw=1.2, rolle='detail')]
def hg_licht():
    return [E(kreis(60, 60, 41), '#1E2E1E', rolle='detail'),
            E(kreis(44, 36, 22), '#4C6B3A', o=0.45, rolle='detail'),
            E(kreis(84, 70, 16), '#5E7E44', o=0.3, rolle='detail'),
            E(kreis(70, 30, 8), '#B4CDBD', o=0.25, rolle='detail')]

# ---------- Reh (Bock im Sommerfell, Kopfporträt) ----------
FELL, FELL_D, FELL_H = '#A0602F', '#6B3B1C', '#C88B56'
reh = hg_wald() + [
    # Gehörn (hinter dem Kopf)
    form('M60 47 C59 39 58 33 57 22 L59.5 21.5 C60.5 30 62 37 63 46 Z M58.5 34.5 C55 32.5 52.5 31 50.5 27.5 L52.2 26.6 C54.5 30 57 31.2 59.6 32.4 Z', '#CDB68C'),
    form('M64.5 46 C65.5 37 67.5 31 69.5 22 L71.8 22.6 C70 31 68 38 67 46.5 Z M68 34 C71.5 31.5 73.5 29.5 75.5 26.2 L77.2 27.2 C74.8 30.8 72 33.5 68.6 35.8 Z', '#CDB68C'),
    E('M57.8 30 C58.4 36 59.6 41 60.4 46 L61.6 46 C60.8 40 59.8 35 59.2 29 Z M68.4 30 C67.6 36 66.9 41 66.4 46 L67 46.2 C67.6 40 68.6 35 69.6 29.5 Z', '#9C8461', rolle='schatten'),
    # Ohren
    form('M56.5 49 C50 43 44 33 43.5 23.5 C50 25.5 58 33.5 62.5 46 Z', FELL),
    form('M66 46.5 C70 36 78 28 87 25.5 C87 34 81 44 72.5 50.5 Z', FELL),
    E('M57.5 46 C52.5 40 47.5 32 46.5 27 C50.5 29.5 56 36.5 60 44.5 Z', '#D9C3A6', o=0.8, rolle='licht'),
    E('M69 46.5 C73 38.5 79 31.5 84.2 29 C83.2 35.5 78.5 42.5 72.4 47.6 Z', '#D9C3A6', o=0.8, rolle='licht'),
    # Kopf und Hals
    form('M88 106 C86 92 84 80 79 70 C77 64 74 56 70 50 C66 45 58 44 53 47 C47 51 42 57 37 62 C34 65 34 69 37 71 C41 73 46 72 50 73 C55 75 58 79 60 84 C61 92 60 100 58 106 Z', FELL),
    E('M88 106 C86 92 84 80 79 70 C76 77 74 87 73.5 106 Z', FELL_D, o=0.9, rolle='schatten'),
    E('M50 73 C55 75 58 79 60 84 C61 91 61 99 60 106 L66 106 C66 95 64 85 60 77 C57 74 54 73 50 73 Z', FELL_D, o=0.8, rolle='schatten'),
    E('M53 47.5 C58 45.5 64 46.5 68.5 49.5 C62 49.5 56 50.5 49.5 55 Z', FELL_H, o=0.9, rolle='licht'),
    E('M45 58 C49 55 53 55 56 57.5 C51 58 47 60 43.5 62.5 Z', FELL_H, o=0.6, rolle='licht'),
    # helles Maul und Kinn
    E('M37 71 C41 73 46 72 50 73 C49 76.5 45 77.5 41 76.5 C38 75.5 36 73.5 37 71 Z', '#F2EEE4', s=INK, sw=0.9, rolle='detail'),
    E('M38.5 63.2 C41.5 61.4 44.5 61.6 46.4 63.4 C44.2 65.4 41.2 66.2 38.4 66.2 Z', '#E8DCC6', o=0.85, rolle='detail'),
    # Nase
    E('M34.4 66 C34 63.4 36 62 38.6 62.6 C39.6 64.6 39.2 67.6 37.2 69.2 C35.6 68.6 34.8 67.6 34.4 66 Z', '#17110D', rolle='detail'),
    E(oval(36.4, 64.4, 0.9, 0.6), '#F2EEE4', o=0.7, rolle='detail'),
    # Auge mit Glanzlicht
    E('M51.8 55.6 C51.8 53.6 54.4 52.6 57 53.2 C58.6 53.8 58.4 56.2 56 57 C54 57.6 51.8 57.2 51.8 55.6 Z', '#120C08', rolle='detail'),
    E(kreis(54.6, 54.4, 0.95), '#FFFFFF', o=0.9, rolle='detail'),
    # Fellstriche am Hals
    E('M79 80 q3 4 2 9 M73 89 q2 4 1 8 M83 92 q2 4 1.5 8 M67 70 q2 3 1 6', s=FELL_D, sw=0.9, o=0.7, rolle='detail'),
]

# ---------- Fliegenpilz ----------
ROT, ROT_D, ROT_H = '#C8261A', '#86170F', '#EC5A45'
flocken = [(45,45,3.2,2.4),(56,38,3.6,2.6),(69,40,3.4,2.5),(80,50,3,2.2),(52,52,3.2,2.3),(66,52,3.6,2.5),(37,56,2.6,2),(86,60,2.4,1.8),(76,59,2.6,1.9),(44,61,2.4,1.8),(60,60,2.6,1.9)]
pilz = hg_boden() + [
    # Stiel
    form('M52.5 69 C51.5 80 50.5 90 47 99 L73 99 C69.5 90 68.5 80 67.5 69 Z', '#EFE8D8'),
    E('M63 69 C64 80 66 90 69.5 99 L73 99 C69.5 90 68.5 80 67.5 69 Z', '#CFC3A8', rolle='schatten'),
    # Knolle mit Warzengürteln
    form('M43 102 C43 95 50 92 60 92 C70 92 77 95 77 102 Z', '#EDE5D2'),
    E('M46 96.5 q2 -1.5 4 0 M56 94.5 q2 -1.5 4 0 M66 95 q2 -1.5 4 0 M72 97.5 q1.5 -1 3 0', s='#B8AC90', sw=1, rolle='detail'),
    # Ring (Manschette)
    form('M51.5 75 C56 79.5 64 79.5 68.5 75 C69.5 79.5 66 83.5 60 83.5 C54 83.5 50.5 79.5 51.5 75 Z', '#F6F0E2'),
    # Lamellen unter dem Hut
    form('M29 63.5 C40 70.5 80 70.5 91 63.5 C83 72.5 37 72.5 29 63.5 Z', '#EADFC6'),
    E('M40 68 l2 2.8 M48 69.4 l1.4 3 M56 70 l0.8 3 M64 70 l-0.6 3 M72 69.4 l-1.4 3 M80 68 l-2 2.8', s='#B9AA88', sw=0.8, rolle='detail'),
    # Hut
    form('M25.5 64 C27.5 40 46 29.5 60 29.5 C74 29.5 92.5 40 94.5 64 C84 68.5 72 69.5 60 69.5 C48 69.5 36 68.5 25.5 64 Z', ROT),
    E('M25.5 64 C36 68.5 48 69.5 60 69.5 C72 69.5 84 68.5 94.5 64 C93.5 58 92 54 89.5 50 C86 60 74 63 60 63 C46 63 33 61 28.5 52 C26.8 56 26 60 25.5 64 Z', ROT_D, o=0.75, rolle='schatten'),
    E('M35 47 C41 37.5 51 33 60 33 C51.5 36.5 43.5 42 39 51 Z', ROT_H, o=0.85, rolle='licht'),
] + [E(oval(x, y, rx, ry), '#F4EFE4', s='#CDBFA6', sw=0.6, rolle='detail') for x, y, rx, ry in flocken]

# ---------- Buschwindröschen ----------
BLATT, BLATT_D, BLATT_H = '#3F6B2E', '#24451B', '#6E9A4A'
def bluete(cx, cy, r, grad0, rosa=False):
    teile = []
    for i in range(6):
        g = grad0 + i * 60
        pts = dreh([(0, 0), (r*0.36, -r*0.25), (r*0.42, -r*0.85), (0, -r), (-r*0.42, -r*0.85), (-r*0.36, -r*0.25), (0, 0)], cx, cy, g)
        d = bez(pts[0], pts[1:])
        teile.append(form(d, '#F7F3EC'))
        ader = dreh([(0, -r*0.15), (0, -r*0.8)], cx, cy, g)
        teile.append(E(f'M{ader[0][0]} {ader[0][1]} L{ader[1][0]} {ader[1][1]}', s='#D6C8D4', sw=0.7, o=0.8, rolle='detail'))
        if rosa:
            hauch = dreh([(0, -r*0.2), (r*0.25, -r*0.5), (0, -r*0.92), (-r*0.25, -r*0.5), (0, -r*0.2)], cx, cy, g)
            teile.append(E(bez(hauch[0], [hauch[1], hauch[2], hauch[2], hauch[3], hauch[4], hauch[4]]), '#EBC9D8', o=0.45, rolle='licht'))
    teile.append(E(kreis(cx, cy, r*0.28), '#E2B53A', s=INK, sw=0.8, rolle='detail'))
    for i in range(12):
        x, y = dreh([(0, -r*0.36)], cx, cy, i * 30)[0]
        teile.append(E(kreis(x, y, 0.9), '#F2D45C', rolle='detail'))
    teile.append(E(kreis(cx - r*0.08, cy - r*0.08, r*0.1), '#9A7A1E', o=0.6, rolle='detail'))
    return teile
def blatt3(cx, cy, s, grad):
    # dreiteiliges, tief eingeschnittenes Blatt
    teile = []
    for w in (-40, 0, 40):
        pts = dreh([(0, 0), (4*s, -4*s), (5*s, -10*s), (1.5*s, -14*s), (2.5*s, -10*s), (-1*s, -12*s), (-1.5*s, -8*s), (-4*s, -9*s), (-4.5*s, -4*s), (0, 0)], cx, cy, grad + w)
        d = f'M{pts[0][0]} {pts[0][1]} ' + ' '.join(f'L{x} {y}' for x, y in pts[1:]) + ' Z'
        teile.append(form(d, BLATT))
        mitte = dreh([(0, -1*s), (0.5*s, -11*s)], cx, cy, grad + w)
        teile.append(E(f'M{mitte[0][0]} {mitte[0][1]} L{mitte[1][0]} {mitte[1][1]}', s=BLATT_H, sw=0.8, o=0.8, rolle='detail'))
    return teile
wind = hg_licht() + [
    form('M58 101 C58 88 59 76 60 62 L62.2 62 C61.5 76 60.8 88 61 101 Z', '#5C7A3A'),
    form('M74 101 C75 92 78 84 82 76 L84 77 C80.5 84.5 77.6 92.5 76.6 101 Z', '#5C7A3A'),
] + blatt3(46, 86, 1.6, -35) + blatt3(84, 92, 1.4, 30) + [
    E('M30 84 L44 80 M88 84 L96 78', s=BLATT_D, sw=0.8, o=0.6, rolle='detail'),
] + bluete(60, 50, 19, 8, rosa=True) + bluete(84, 72, 10, 25, rosa=True)

def speichern(art_id, ebenen, quellen=None, ziel=ZIEL):
    """Schreibt src/data/icons/<art_id>.json"""
    daten = {'id': art_id, 'ebenen': ebenen}
    if quellen:
        daten['quellen'] = quellen
    with open(os.path.join(ziel, f'{art_id}.json'), 'w') as f:
        json.dump(daten, f, ensure_ascii=False, indent=1)

if __name__ == '__main__':
    for name, ebenen in [('reh', reh), ('fliegenpilz', pilz), ('buschwind', wind)]:
        speichern(name, ebenen)
    print('Vorbilder geschrieben: reh, fliegenpilz, buschwind')

"""Moorbirke: eiförmiges Blatt mit kurzer Spitze, grob einfach gesägt, behaarter Stiel; abstehendes Fruchtkätzchen."""
import sys, math
sys.path.insert(0, 'recherche/icons/waldkiefer')
from baum3_helfer import *

BLATT = ('#4C7838', '#2F5021', '#7DA25C')
ZWEIG = ('#6A3E2C', '#43261A', '#97644C')
KAETZCHEN = ('#8C8148', '#5C5428', '#B8AC70')
HAAR = '#D8D2BC'
# rechte Blatthälfte: Grund breit gerundet bis gestutzt, Spitze kurz (nicht lang ausgezogen wie Sandbirke)
HALB = [(0, 0), (0.14, 0.02), (0.32, -0.06), (0.45, -0.22), (0.49, -0.42), (0.44, -0.62), (0.32, -0.78),
        (0.17, -0.89), (0.06, -0.95), (0, -1)]


def kaetzchen(cx, cy, grad, L=22, b=6.4):
    """walzenförmiges Fruchtkätzchen mit dreilappigen Fruchtschuppen; Ansatz bei cx/cy."""
    halb = catmull([(0, 0), (0.12, -0.04), (0.16, -0.2), (0.16, -0.8), (0.12, -0.96), (0, -1)], 6)
    halb = [(x * b / L / 0.32, y) for x, y in halb]
    t = [form(glatter_pfad(zapfen_umriss(halb, cx, cy, L, grad)), KAETZCHEN[0])]
    t.append(E(glatter_pfad(setzen(halb + [(0, -1)], cx, cy, L, grad)), KAETZCHEN[1], o=0.55, rolle='schatten'))
    hl = setzen([(-0.04, -0.15), (-0.13, -0.25), (-0.13, -0.75), (-0.04, -0.85)], cx, cy, L, grad)
    t.append(E(glatter_pfad(hl), KAETZCHEN[2], o=0.6, rolle='licht'))
    # Schuppenreihen als kleine Bögen
    d = ''
    for i in range(7):
        y = -0.12 - i * 0.12
        for xo in ((-0.09, 0.05) if i % 2 else (-0.03, 0.11)):
            p = setzen([(xo - 0.07, y), (xo, y - 0.06), (xo + 0.07, y)], cx, cy, L, grad)
            d += f'M{p[0][0]} {p[0][1]} Q{p[1][0]} {p[1][1]} {p[2][0]} {p[2][1]} '
    t.append(E(d.strip(), s=KAETZCHEN[1], sw=0.6, o=0.85, rolle='detail'))
    return t


def haare(pts, n=10, l=1.4, seite=1):
    """feine Flaumhaare entlang einer Linie (Kennzeichen Moorbirke: behaarte Triebe und Stiele)"""
    d = ''
    q = neu_abtasten(catmull(pts, 6), n)
    for i in range(1, n):
        a, c = q[i - 1], q[i + 1] if i + 1 < len(q) else q[i]
        dx, dy = c[0] - a[0], c[1] - a[1]
        m = math.hypot(dx, dy) or 1
        nx, ny = -dy / m, dx / m
        s = seite if i % 2 else -seite
        p = q[i]
        d += f'M{r1(p[0] + nx * s * 1.2)} {r1(p[1] + ny * s * 1.2)} l{r1(nx * s * l + dx / m * 0.5)} {r1(ny * s * l + dy / m * 0.5)} '
    return E(d.strip(), s=HAAR, sw=0.5, o=0.85, rolle='detail')


ebenen = hg_licht()
# behaarter, rotbrauner Zweig
zw = [(14, 96), (36, 88), (62, 80), (86, 72), (106, 66)]
ebenen += zweig(zw, 4.0, 2.8, ZWEIG)
ebenen.append(E(kreis(30, 90, 0.7) + ' ' + kreis(48, 85, 0.6) + ' ' + kreis(96, 69, 0.6), '#C9B496', o=0.8, rolle='detail'))
ebenen.append(haare(zw, 22, 1.6))
# kleines zweites Blatt rechts hinten
ebenen += zweig([(84, 73), (88, 66)], 1.6, 1.3, BLATT, licht=False)
ebenen += blatt(HALB, 88, 66, 27, 58, BLATT, n_zaehne=10, amp=0.05, adern=5, schatten_seite=1, ader_neigung=0.16)
# Fruchtkätzchen, schräg aufrecht abstehend
ebenen += zweig([(70, 78), (73, 72), (75, 67)], 1.5, 1.3, ZWEIG, licht=False)
ebenen.append(haare([(70, 78), (73, 72), (75, 67)], 5, 1.2))
ebenen += kaetzchen(75, 67, 18, L=24, b=6.6)
# großes Blatt mit behaartem Stiel
st = [(50, 84), (47, 77), (45, 71)]
ebenen += zweig(st, 1.9, 1.6, BLATT, licht=False)
ebenen.append(haare(st, 6, 1.3))
ebenen += blatt(HALB, 45, 71, 47, -28, BLATT, n_zaehne=14, amp=0.045, adern=6, schatten_seite=1, ader_neigung=0.17)

speichern('moorbirke', ebenen, quellen=quellen('moorbirke'))

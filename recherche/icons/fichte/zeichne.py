"""Gemeine Fichte: spitze, vierkantige Nadeln rundum am Zweig (Flaschenbürste) + lange, HÄNGENDE Zapfen
mit dünnen, vorn ausgerandeten Schuppen."""
import sys, math, random
sys.path.insert(0, 'recherche/icons/waldkiefer')
from baum3_helfer import *

NADEL = ('#3A6A3E', '#234426', '#6C9A64')
ZWEIG = ('#9A6A42', '#664428', '#C4966A')
ZAPFEN = ('#94542E', '#5E3018', '#C08050')
SCHUPPE = '#A8663A'


def zapfen(cx, cy, grad, L=50, b=17):
    """länglich-walzenförmiger, hängender Zapfen; Ansatz cx/cy, Spitze in Richtung grad"""
    halb = catmull([(0, 0), (0.1, -0.03), (0.16, -0.14), (0.18, -0.4), (0.17, -0.7), (0.12, -0.9), (0.05, -0.99), (0, -1)], 5)
    halb = [(x * b / L / 0.36, y) for x, y in halb]
    # Umriss mit kleinen Schuppenkanten an den Seiten
    re = []
    for i, (x, y) in enumerate(halb):
        re.append((x, y))
        if -0.92 < y < -0.08 and i % 2 == 1:
            re.append((x + 0.025, y - 0.035))
    umr = re + [(-x, y) for x, y in reversed(re)][1:-1]
    t = [form(pfad(setzen(umr, cx, cy, L, grad)), ZAPFEN[0])]
    # Schuppen: versetzte Reihen dünner, vorn gerundeter Schuppen (Rand zeigt zur Zapfenspitze)
    for i in range(12):
        y = -0.1 - i * 0.072
        w = halb_breite(halb, y)
        xs = (-0.55, 0, 0.55) if i % 2 == 0 else (-0.28, 0.28)
        for x in xs:
            x *= w
            sw_ = w * 0.3
            p = setzen([(x - sw_, y), (x - sw_ * 0.9, y - 0.05), (x, y - 0.075), (x + sw_ * 0.9, y - 0.05), (x + sw_, y)],
                       cx, cy, L, grad)
            hell = x < -0.01
            t.append(E(glatter_pfad(p, zu=False) + ' Z', ZAPFEN[2] if hell else SCHUPPE, s=ZAPFEN[1], sw=0.55, o=0.95, rolle='detail'))
    t.append(E(glatter_pfad(setzen(halb + [(0, -1)], cx, cy, L, grad)), ZAPFEN[1], o=0.4, rolle='schatten'))
    hl = setzen([(-0.03, -0.08), (-0.13, -0.14), (-0.14, -0.7), (-0.06, -0.8)], cx, cy, L, grad)
    t.append(E(glatter_pfad(hl), '#E0A878', o=0.25, rolle='licht'))
    return t


ebenen = hg_wald()
# Zweig oben, leicht durchhängend, von links nach rechts
ast = [(8, 52), (34, 46), (62, 42), (88, 40), (112, 42)]
q = neu_abtasten(catmull(ast, 8), 60)
g = richtung(ast[0], ast[-1])
random.seed(9)
oben, unten, vorn = [], [], []
for i in range(1, 60):
    p = q[i]
    w = richtung(q[i - 1], q[min(i + 1, 60)])
    if i % 2:
        oben.append((p, w - 50 + random.uniform(-10, 10), 1 + random.uniform(-0.15, 0.1)))
    else:
        unten.append((p, w + 50 + random.uniform(-10, 10), 1 + random.uniform(-0.15, 0.1)))
    if i % 3 == 0:
        vorn.append((p, w + random.choice((-24, 22)) + random.uniform(-6, 6), 0.7))
# Zapfen hängen hinter den unteren Nadeln
k1, a1 = nadelkamm(oben, 14, 3.0, NADEL)
ebenen += k1
ebenen += zweig(ast, 4.2, 3.4, ZWEIG)
ebenen += zweig([(46, 45), (45, 49), (44, 52)], 2.6, 2.4, ZWEIG, licht=False)
ebenen += zweig([(76, 41), (77, 45), (78, 48)], 2.4, 2.2, ZWEIG, licht=False)
ebenen += zapfen(78, 47, 172, L=40, b=15)
ebenen += zapfen(44, 51, 184, L=46, b=18)
k2, a2 = nadelkamm(unten, 13, 3.0, NADEL)
ebenen += k2
k3, a3 = nadelkamm(vorn, 13, 2.8, NADEL)
ebenen += k3
# Lichtkanten auf den Nadeln (vierkantig: helle Kante)
for p, w, L in a1 + a2 + a3:
    ebenen.append(linie([punkt(p, w, L * 0.2), punkt(p, w, L * 0.75)], NADEL[2], 0.5, 0.7))

speichern('fichte', ebenen, quellen=quellen('fichte'))

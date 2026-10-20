"""Waldkiefer: orangeroter Zweig mit bläulich-grünen Nadeln zu ZWEIT (Kurztrieb mit brauner Scheide)
+ kleiner, kegelförmiger Zapfen mit rautenförmigen Schuppenschildern."""
import sys, math, random
sys.path.insert(0, 'recherche/icons/waldkiefer')
from baum3_helfer import *

NADEL = ('#6E9A8A', '#41665A', '#9CC2B4')
RINDE = ('#C0683A', '#843E1E', '#E09464')   # „Spiegelrinde“: orangerot an Zweigen und oberem Stamm
ZAPFEN = ('#7A5A3C', '#4A3220', '#A07A52')
SCHILD = '#86643F'
SCHEIDE = '#4A3424'


def nadelpaar(p, grad, l, spreiz=7, dreh=1):
    """zwei Nadeln aus einer Scheide als EINE Form (V), leicht gegensinnig gedreht"""
    t, achsen = nadelkamm([(p, grad - spreiz, 1.0), (p, grad + spreiz, 0.95)], l, 3.4, NADEL, schatten=0.3)
    # helle Mittellinie (Licht von oben links), leicht gebogen = gedrehte Nadel
    for q0, w, L in achsen:
        a, m, c = punkt(q0, w, L * 0.2), punkt(q0, w + 3 * dreh, L * 0.5), punkt(q0, w, L * 0.8)
        t.append(kurve(a, m, c, NADEL[2], 0.6, 0.75))
    t.append(E(oval(r1(p[0]), r1(p[1]), 1.5, 1.5), SCHEIDE, rolle='detail'))
    return t


def zapfen(cx, cy, grad, L=24, b=15):
    """eikegelförmiger Zapfen, Ansatz cx/cy, Spitze in Richtung grad"""
    halb = catmull([(0, 0), (0.18, -0.04), (0.3, -0.2), (0.32, -0.42), (0.26, -0.68), (0.14, -0.88), (0.04, -0.98), (0, -1)], 6)
    halb = [(x * b / L / 0.64, y) for x, y in halb]
    t = [form(glatter_pfad(zapfen_umriss(halb, cx, cy, L, grad)), ZAPFEN[0])]
    # rautenförmige Schuppenschilder mit Nabel, versetzt in Reihen
    for i in range(6):
        y = -0.1 - i * 0.15
        w = halb_breite(halb, y)
        n = 3 if w > 0.12 else 2
        for k in range(n):
            x = (k - (n - 1) / 2) * 0.17 + (0.085 if i % 2 else 0)
            if abs(x) > w * 0.85:
                continue
            dx, dy = 0.085, 0.075
            p = setzen([(x, y - dy), (x + dx, y), (x, y + dy), (x - dx, y)], cx, cy, L, grad)
            hell = x < 0
            t.append(E(pfad(p), ZAPFEN[2] if hell else SCHILD, s=ZAPFEN[1], sw=0.7, rolle='detail'))
            m = setzen([(x, y)], cx, cy, L, grad)[0]
            t.append(E(kreis(m[0], m[1], 0.6), ZAPFEN[1], rolle='detail'))
    t.append(E(glatter_pfad(setzen(halb + [(0, -1)], cx, cy, L, grad)), ZAPFEN[1], o=0.45, rolle='schatten'))
    return t


ebenen = hg_wald()
# orangeroter Zweig von rechts unten zur Triebspitze in der Mitte
ast = [(106, 94), (90, 80), (74, 66), (62, 54)]
q = neu_abtasten(catmull(ast, 8), 30)
g = richtung(ast[0], ast[-1])
random.seed(5)
# Nadelpaare strahlen pinselartig vom oberen Zweigstück nach allen Seiten (nach vorn geneigt)
ansaetze = []
for k, i in enumerate(range(9, 31, 5)):  # weniger, klarere Nadelpaare
    p = q[min(i, 30)]
    for w in ((-62, 48) if k % 2 else (-40, 66)):
        ansaetze.append((p, g + w + random.uniform(-6, 6), 27 + random.uniform(-3, 3)))
hinten = [a for a in ansaetze if a[1] < g]
vorn = [a for a in ansaetze if a[1] >= g]
for p, w, l in hinten:
    ebenen += nadelpaar((r1(p[0]), r1(p[1])), w, l, dreh=1)
# Büschel an der Triebspitze
spitze = q[-1]
for w in (-28, 0, 28):
    ebenen += nadelpaar((r1(spitze[0]), r1(spitze[1])), g + w, 28)
ebenen += zweig(ast, 5.2, 3.8, RINDE)
ebenen.append(E('M96 85 l3 -1 M84 74 l3 -1.2 M74 64.5 l2.6 -1', s='#F2C29A', sw=0.6, o=0.8, rolle='detail'))  # Rindenschuppen
ebenen.append(E(oval(r1(spitze[0]), r1(spitze[1]), 2.4, 2.4), '#9A5A30', s=INK, sw=0.8, rolle='detail'))  # Endknospe
for p, w, l in vorn[1::2]:
    ebenen += nadelpaar((r1(p[0]), r1(p[1])), w, l, dreh=-1)
# kleiner Zapfen, schräg nach unten links hängend
ebenen += zweig([(84, 74), (79, 78), (74, 80)], 2.4, 2.2, RINDE, licht=False)
ebenen += zapfen(74, 80, 228, L=29, b=18)

speichern('waldkiefer', ebenen, quellen=quellen('waldkiefer'))

"""Eibe (Taxus baccata): Zweig mit flachen, dunkelgrünen, zweizeilig gescheitelten Nadeln + rote, becherförmige Samenmäntel mit dunklem Samen."""
import sys, math
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

NADEL = ('#2F5230', '#1C3520', '#5C8452')      # dunkelgrün, glänzend
ZWEIG = ('#6E7A3E', '#46502A', '#94A060')      # junger Trieb grünlich-braun
ARIL = ('#C8303A', '#86202A', '#EE6A6E')       # leuchtend rot (nicht rein)
SAME = ('#4A4436', '#2A251C', '#7A7262')

NADELFORM = [(0, 0), (0.05, -0.05), (0.07, -0.3), (0.07, -0.7), (0.05, -0.9), (0, -1)]


def nadel(x, y, L, ux, uy, b=1.7):
    """Flache Nadel von (x, y) in Richtung (ux, uy): kurzer Stielansatz, parallele Ränder, kurze Spitze."""
    nx, ny = -uy, ux
    P = lambda t, q: (r1(x + ux * L * t + nx * q), r1(y + uy * L * t + ny * q))
    pts = [P(0, 0.4), P(0.12, b), P(0.8, b), P(1, 0), P(0.8, -b), P(0.12, -b), P(0, -0.4)]
    e = [form(pfad(pts), NADEL[0])]
    # Schatten auf der unten-rechts liegenden Hälfte, Licht als Mittelrippe-Glanz
    seite = 1 if (nx + ny) > 0 else -1
    e.append(E(pfad([P(0.1, 0), P(0.12, seite * b), P(0.8, seite * b), P(1, 0)]), NADEL[1], o=0.6, rolle='schatten'))
    e.append(E(f'M{P(0.15, -seite * 0.25)[0]} {P(0.15, -seite * 0.25)[1]} L{P(0.85, -seite * 0.2)[0]} {P(0.85, -seite * 0.2)[1]}',
               s=NADEL[2], sw=0.7, o=0.8, rolle='licht'))
    return e


def aril(cx, cy, r, grad=0):
    """Samenmantel: rote, fleischige Kugel, oben offen; darin der dunkle Same (Blick schräg von vorn-oben)."""
    e = [form(kreis(cx, cy, r), ARIL[0]),
         E(kreis(r1(cx + r * 0.18), r1(cy + r * 0.2), r1(r * 0.8)), ARIL[1], o=0.55, rolle='schatten'),
         E(kreis(r1(cx - r * 0.1), r1(cy - r * 0.05), r1(r * 0.72)), ARIL[0], rolle='licht'),
         E(oval(r1(cx - r * 0.42), r1(cy + r * 0.05), r1(r * 0.24), r1(r * 0.4)), ARIL[2], o=0.6, rolle='licht')]
    # Öffnung oben (Ellipse), Rand verdickt
    ox, oy = cx + r * 0.06, cy - r * 0.34
    e.append(E(oval(r1(ox), r1(oy), r1(r * 0.64), r1(r * 0.46)), ARIL[1], s=INK, sw=0.9, rolle='detail'))
    # dunkler Same in der Öffnung
    e.append(E(oval(r1(ox + r * 0.03), r1(oy + r * 0.04), r1(r * 0.46), r1(r * 0.34)), SAME[0], rolle='detail'))
    e.append(E(oval(r1(ox - r * 0.1), r1(oy - r * 0.04), r1(r * 0.16), r1(r * 0.1)), SAME[2], o=0.8, rolle='detail'))
    # Glanzlicht auf dem Mantel
    e.append(E(oval(r1(cx - r * 0.5), r1(cy - r * 0.05), r1(r * 0.13), r1(r * 0.2)), '#FFFFFF', o=0.7, rolle='detail'))
    return e


ebenen = hg_wald()
# Zweig: leicht geschwungen von links unten nach rechts oben
zw = [(14, 74), (34, 66), (56, 56), (80, 46), (106, 38)]
q = neu_abtasten(catmull(zw, 10), 18)
oben, unten = [], []
for i in range(1, 18):
    a, b = q[i - 1], q[min(i + 1, 18)]
    tx, ty = b[0] - a[0], b[1] - a[1]
    l = math.hypot(tx, ty); tx, ty = tx / l, ty / l
    nx, ny = ty, -tx          # Normale nach oben (links der Richtung)
    w = math.radians(32)      # Nadeln leicht nach vorn geneigt
    L = 16 + 4 * math.sin(i / 18 * math.pi) - (5 if i > 15 else 0)
    x, y = q[i]
    ob = (nx * math.cos(w) + tx * math.sin(w), ny * math.cos(w) + ty * math.sin(w))
    un = (-nx * math.cos(w) + tx * math.sin(w), -ny * math.cos(w) + ty * math.sin(w))
    oben.append((x, y, L, ob))
    unten.append((x, y, L - 1, un))
for x, y, L, (ux, uy) in oben:
    ebenen += nadel(x, y, L, ux, uy)
for x, y, L, (ux, uy) in unten:
    ebenen += nadel(x, y, L, ux, uy)
ebenen += zweig(zw, 3.4, 2.0, ZWEIG)
# Samenmäntel hängen unter dem Zweig an kurzen Stielchen (vor den Nadeln)
for (sx, sy), (cx, cy), r in (((40, 68), (40, 80), 8.4), ((64, 58), (67, 72), 9.0), ((86, 49), (90, 61), 7.6)):
    ebenen += zweig([(sx, sy), (cx, cy - r + 1)], 1.8, 1.5, ZWEIG, licht=False)
    ebenen += aril(cx, cy, r)

speichern('eibe', ebenen, quellen=[
    {'titel': 'Referenzfoto: Taxus baccata arillus.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Taxus_baccata_arillus.jpg'},
    {'titel': 'Referenzfoto: Yew seeds with red arils, Dumfries, Scotland.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Yew_seeds_with_red_arils,_Dumfries,_Scotland.jpg'},
])
print('eibe geschrieben')

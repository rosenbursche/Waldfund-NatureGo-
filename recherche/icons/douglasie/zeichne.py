"""Douglasie (Pseudotsuga menziesii): Zweig mit weichen Nadeln + hängender Zapfen mit dreizipfligen Deckschuppen ("Mäuseschwänzchen")."""
import sys, math
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

NADEL = ('#4E7A3A', '#30522A', '#7FA862')
ZWEIG = ('#8A6A48', '#5C4430', '#B4926C')
ZAPFEN = ('#B08A5A', '#765A36', '#D4B282')
DECK = ('#D8C49A', '#9E8A62')        # hellere, papierartige Deckschuppen


def nadel(x, y, L, ux, uy, b=1.15):
    nx, ny = -uy, ux
    P = lambda t, q: (r1(x + ux * L * t + nx * q), r1(y + uy * L * t + ny * q))
    pts = [P(0, 0.3), P(0.15, b), P(0.75, b), P(1, 0.15), P(1, -0.15), P(0.75, -b), P(0.15, -b), P(0, -0.3)]
    e = [form(pfad(pts), NADEL[0])]
    seite = 1 if (nx + ny) > 0 else -1
    e.append(E(pfad([P(0.1, 0), P(0.15, seite * b), P(0.75, seite * b), P(1, 0)]), NADEL[1], o=0.55, rolle='schatten'))
    e.append(E(f'M{P(0.15, -seite * 0.2)[0]} {P(0.15, -seite * 0.2)[1]} L{P(0.85, -seite * 0.15)[0]} {P(0.85, -seite * 0.15)[1]}',
               s=NADEL[2], sw=0.6, o=0.8, rolle='licht'))
    return e


def zapfen(cx, cy, L, W, grad):
    """Hängender Zapfen: Basis (Stielansatz) bei cx/cy, Spitze in Richtung grad (180 = nach unten)."""
    T = lambda p: setzen(p, cx, cy, L, grad)
    w = W / L
    rechts = [(0, 0), (w * 0.3, -0.03), (w * 0.47, -0.2), (w * 0.5, -0.45), (w * 0.44, -0.72), (w * 0.26, -0.92), (0, -1)]
    q = catmull(rechts, 6)
    umr = q + [(-x, y) for x, y in reversed(q)][1:-1]
    e = [form(glatter_pfad(T(umr)), ZAPFEN[1])]
    # Hängender Zapfen: die freien Schuppenränder zeigen zur Spitze; jede Schuppe liegt über der nächsten (Richtung Spitze).
    # Darum von der Spitze zur Basis zeichnen. Die dreizipflige Deckschuppe schaut unter dem Rand hervor.
    reihen = [(-0.92, [0]), (-0.8, [-0.55, 0.55]), (-0.67, [-1, 0, 1]), (-0.53, [-0.55, 0.55]), (-0.39, [-1, 0, 1]),
              (-0.25, [-0.55, 0.55]), (-0.12, [-1, 0, 1])]
    for y, xs in reihen:
        br = halb_breite(rechts, y) or w * 0.2
        for xr in sorted(xs, key=abs, reverse=True):
            x = xr * br * 0.62
            sw_, sh = br * 0.6, 0.12
            ty = y - sh * 0.7
            k = 0.11 * (0.75 if y < -0.85 else 1)
            # Deckschuppe zuerst (liegt unter der eigenen Schuppe, ragt aber darüber hinaus)
            dz = [(x - sw_ * 0.34, ty + 0.05), (x - sw_ * 0.5, ty - k * 0.6), (x - sw_ * 0.16, ty - k * 0.28),
                  (x - sw_ * 0.08, ty - k * 1.3), (x, ty - k * 1.45), (x + sw_ * 0.08, ty - k * 1.3), (x + sw_ * 0.16, ty - k * 0.28),
                  (x + sw_ * 0.5, ty - k * 0.6), (x + sw_ * 0.34, ty + 0.05)]
            e.append(E(pfad(T(dz)), DECK[0], s='#3E2A18', sw=0.6, rolle='detail'))
            mz = T([(x, ty), (x, ty - k * 1.2)])
            e.append(E(f'M{mz[0][0]} {mz[0][1]} L{mz[1][0]} {mz[1][1]}', s=DECK[1], sw=0.5, o=0.8, rolle='detail'))
            # runde Samenschuppe, Rand zur Spitze
            pts = [(x - sw_, y + sh * 0.6), (x - sw_ * 0.95, y - sh * 0.2), (x - sw_ * 0.5, y - sh * 0.7), (x, y - sh * 0.82),
                   (x + sw_ * 0.5, y - sh * 0.7), (x + sw_ * 0.95, y - sh * 0.2), (x + sw_, y + sh * 0.6)]
            e.append(E(glatter_pfad(T(pts), zu=False) + ' Z', ZAPFEN[0], s='#4A3420', sw=0.7, rolle='detail'))
            # Licht links (Bild), Schatten rechts
            hl = T([(x - sw_ * 0.75, y - sh * 0.05), (x - sw_ * 0.35, y - sh * 0.55)])
            e.append(E(f'M{hl[0][0]} {hl[0][1]} L{hl[1][0]} {hl[1][1]}', s=ZAPFEN[2], sw=0.9, o=0.85, rolle='licht'))
            if xr >= 0:
                sl = T([(x + sw_ * 0.25, y - sh * 0.6), (x + sw_ * 0.8, y - sh * 0.15)])
                e.append(E(f'M{sl[0][0]} {sl[0][1]} L{sl[1][0]} {sl[1][1]}', s=ZAPFEN[1], sw=1.0, o=0.7, rolle='schatten'))
    return e


ebenen = hg_wald()
zw = [(12, 44), (36, 40), (60, 38), (84, 34), (108, 30)]
q = neu_abtasten(catmull(zw, 10), 20)
# Nadeln rundum: nach oben, unten und schräg nach vorn – kurz und weich
hinten, vorn = [], []
for i in range(1, 20):
    a, b = q[i - 1], q[min(i + 1, 20)]
    tx, ty = b[0] - a[0], b[1] - a[1]
    l = math.hypot(tx, ty); tx, ty = tx / l, ty / l
    nx, ny = ty, -tx
    x, y = q[i]
    L = 13 + 2 * math.sin(i * 1.3)
    for sgn, w, liste in ((1, 40, hinten), (-1, 40, hinten), (1, 70, vorn), (-1, 75, vorn)):
        ww = math.radians(w + (i % 3) * 6)
        u = (sgn * nx * math.sin(ww) + tx * math.cos(ww), sgn * ny * math.sin(ww) + ty * math.cos(ww))
        liste.append((x, y, L if w == 40 else L - 2, u))
for x, y, L, (ux, uy) in hinten:
    ebenen += nadel(x, y, L, ux, uy)
ebenen += zweig(zw, 3.4, 2.2, ZWEIG)
# hängender Zapfen am kurzen Stiel
ebenen += zweig([(58, 38), (59, 46)], 2.6, 2.6, ZWEIG, licht=False)
ebenen += zapfen(59, 45, 52, 27, 176)
for x, y, L, (ux, uy) in vorn[::2]:
    ebenen += nadel(x, y, L, ux, uy)

speichern('douglasie', ebenen, quellen=[
    {'titel': 'Referenzfoto: Cone pseudotsuga menziesii beentree.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Cone_pseudotsuga_menziesii_beentree.jpg'},
    {'titel': 'Referenzfoto: Pseudotsuga menziesii 28226.JPG', 'url': 'https://commons.wikimedia.org/wiki/File:Pseudotsuga_menziesii_28226.JPG'},
])
print('douglasie geschrieben')

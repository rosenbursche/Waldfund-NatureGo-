"""Europäische Lärche (Larix decidua): Zweig mit Nadelbüscheln an Kurztrieben + kleine, aufrechte, eiförmige Zapfen mit runden Schuppen."""
import sys, math
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *
from pflanzen_helfer import *

NADEL = ('#7FA845', '#56782E', '#B2CF72')     # weich hellgrün
ZWEIG = ('#8A7258', '#5C4A38', '#B49A7C')
KURZ = ('#6E5A44', '#4A3C2C', '#9A8468')
ZAPFEN = ('#9A6E42', '#6A4628', '#C49A68')
SCHUPPE_RAND = '#5A3A20'


def buechel(cx, cy, r, grad, n=26, spreiz=120):
    """Nadelbüschel: 20-40 weiche Nadeln fächern aus einem Kurztrieb auf.
    Grundform = Fächer mit Nadelspitzen (Silhouette), darauf einzelne Nadeln als Linien."""
    e = []
    rand = []
    for i in range(n):
        w = grad - spreiz / 2 + spreiz * i / (n - 1)
        L = r * (0.78 + 0.22 * math.sin(i * 1.9) ** 2)
        a = math.radians(w)
        rand.append((w, L))
    pts = [(cx, cy)]
    for i, (w, L) in enumerate(rand):
        a = math.radians(w)
        pts.append((r1(cx + math.sin(a) * L), r1(cy - math.cos(a) * L)))
        if i < n - 1:
            wm = math.radians(w + spreiz / (n - 1) / 2)
            pts.append((r1(cx + math.sin(wm) * L * 0.72), r1(cy - math.cos(wm) * L * 0.72)))
    e.append(E(pfad(pts), NADEL[1], s=INK, sw=1.2, rolle='form'))
    # einzelne Nadeln: vorne hell, hinten dunkel; leicht gebogen
    d_f, d_l = '', ''
    for k, (w, L) in enumerate(rand):
        a = math.radians(w)
        ex, ey = cx + math.sin(a) * L * 0.97, cy - math.cos(a) * L * 0.97
        mx, my = cx + math.sin(a + 0.06) * L * 0.5, cy - math.cos(a + 0.06) * L * 0.5
        seg = f'M{cx} {cy} Q{r1(mx)} {r1(my)} {r1(ex)} {r1(ey)} '
        d_f += seg
        if k % 2 == 0:
            d_l += f'M{r1(cx + math.sin(a) * L * 0.35)} {r1(cy - math.cos(a) * L * 0.35)} L{r1(cx + math.sin(a) * L * 0.85)} {r1(cy - math.cos(a) * L * 0.85)} '
    e.append(E(d_f.strip(), s=NADEL[0], sw=1.0, rolle='detail'))
    e.append(E(d_l.strip(), s=NADEL[2], sw=0.6, o=0.9, rolle='licht'))
    # Schatten unten rechts im Fächer
    e.append(E(f'M{cx} {cy} ' + ' '.join(f'L{x} {y}' for x, y in pts[1:] if x > cx and y > cy - r * 0.2) + ' Z', NADEL[1], o=0.35, rolle='schatten'))
    e.append(form(kreis(cx, cy, 2.0), KURZ[0]))
    e.append(E(kreis(cx - 0.6, cy - 0.6, 0.7), KURZ[2], o=0.8, rolle='licht'))
    return e


def zapfen(cx, cy, L, W, grad):
    """Aufrechter Zapfen, Basis bei cx/cy, Spitze in Richtung grad (0 = oben). Runde, leicht gewellte Schuppen."""
    T = lambda p: setzen(p, cx, cy, L, grad)
    w = W / L
    rechts = [(0, 0), (w * 0.3, -0.02), (w * 0.48, -0.25), (w * 0.5, -0.5), (w * 0.4, -0.78), (w * 0.2, -0.95), (0, -1)]
    q = catmull(rechts, 6)
    umr = q + [(-x, y) for x, y in reversed(q)][1:-1]
    e = [form(glatter_pfad(T(umr)), ZAPFEN[1])]
    # Schuppen in Reihen von unten nach oben (obere überdecken nicht – untere liegen vorn): oben zuerst zeichnen
    reihen = [(-0.86, [0]), (-0.72, [-0.5, 0.5]), (-0.56, [-1, 0, 1]), (-0.4, [-0.5, 0.5]), (-0.24, [-1, 0, 1]), (-0.09, [-0.5, 0.5])]
    for y, xs in reihen:
        br = halb_breite(rechts, y) or w * 0.2
        for xr in xs:
            x = xr * br * 0.62
            sw_, sh = br * 0.62, 0.15
            pts = [(x - sw_, y - sh * 0.4), (x - sw_ * 0.85, y + sh * 0.35), (x, y + sh * 0.62), (x + sw_ * 0.85, y + sh * 0.35), (x + sw_, y - sh * 0.4)]
            d = glatter_pfad(T(pts), zu=False)
            e.append(E(d + ' Z', ZAPFEN[0], s=SCHUPPE_RAND, sw=0.7, rolle='detail'))
            # Licht oben links auf jeder Schuppe, Schatten unten rechts
            hl = T([(x - sw_ * 0.6, y + sh * 0.05), (x - sw_ * 0.2, y + sh * 0.35)])
            e.append(E(f'M{hl[0][0]} {hl[0][1]} L{hl[1][0]} {hl[1][1]}', s=ZAPFEN[2], sw=0.8, o=0.85, rolle='licht'))
            sl = T([(x + sw_ * 0.2, y + sh * 0.5), (x + sw_ * 0.7, y + sh * 0.25)])
            e.append(E(f'M{sl[0][0]} {sl[0][1]} L{sl[1][0]} {sl[1][1]}', s=ZAPFEN[1], sw=0.8, o=0.8, rolle='schatten'))
    return e


ebenen = hg_wald()
# Langtrieb diagonal, leicht hängend
zw = [(14, 74), (36, 78), (62, 78), (86, 72), (108, 64)]
ebenen += zweig(zw, 4.0, 2.8, ZWEIG)
# hintere Büschel (unter dem Zweig)
for cx, cy, r, g in ((32, 78, 21, 170), (64, 78, 21, 185), (92, 71, 19, 155)):
    ebenen += buechel(cx, cy, r, g, n=30)
# Zapfen sitzen aufrecht auf dem Zweig
ebenen += zweig([(47, 79), (46, 70)], 2.6, 2.4, KURZ, licht=False)
ebenen += zapfen(46, 71, 30, 20, -8)
ebenen += zweig([(78, 75), (80, 66)], 2.4, 2.2, KURZ, licht=False)
ebenen += zapfen(80, 67, 25, 17, 10)
# vordere Büschel (über dem Zweig, neben den Zapfen)
for cx, cy, r, g in ((26, 76, 19, -30), (63, 77, 18, -5), (97, 67, 17, 45)):
    ebenen += buechel(cx, cy, r, g, n=30)

speichern('laerche', ebenen, quellen=[
    {'titel': 'Referenzfoto: Larix decidua cone Embrun.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Larix_decidua_cone_Embrun.jpg'},
    {'titel': 'Referenzfoto: Larix decidua cones pl.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:Larix_decidua_cones_pl.jpg'},
])
print('laerche geschrieben')

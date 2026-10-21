"""
Gemeinsame Zeichenhilfen für Pflanzen-Icons (Sträucher und Giftpflanzen, Reihe 2).
Wird von recherche/icons/<artId>/zeichne.py importiert:
    sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
    from icon_helfer import *; from pflanzen_helfer import *
Blätter werden in einem lokalen Maß gebaut: Grund bei (0, 0), Spitze bei (0, -1).
"""
import math
from icon_helfer import E, form, kreis, oval, INK


def r1(v):
    return round(v, 1)


def catmull(pts, n=8):
    """Glatte Linie durch alle Punkte (Catmull-Rom)."""
    P = [pts[0]] + list(pts) + [pts[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for k in range(n):
            t = k / n
            t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2
                                    + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3) for j in (0, 1)))
    out.append(tuple(pts[-1]))
    return out


def neu_abtasten(pts, n):
    """n+1 Punkte in gleichem Bogenabstand."""
    lang = [0.0]
    for a, b in zip(pts, pts[1:]):
        lang.append(lang[-1] + math.dist(a, b))
    ges = lang[-1]
    out, j = [], 0
    for i in range(n + 1):
        s = ges * i / n
        while j < len(lang) - 2 and lang[j + 1] < s:
            j += 1
        seg = lang[j + 1] - lang[j] or 1
        t = (s - lang[j]) / seg
        a, b = pts[j], pts[j + 1]
        out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    return out


def zaehne(pts, n, amp, doppelt=False, vorn=0.65, rand=(0.08, 0.96), glatt=False):
    """Sägezähne entlang einer Halb-Umrisslinie (Grund -> Spitze, rechte Seite, außen = +Normal)."""
    if n == 0:
        return pts
    q = neu_abtasten(pts, n * 4)
    out = []
    for i in range(n):
        a = q[i * 4]
        out.append(a)
        k = min(i * 4 + max(1, round(vorn * 4)), len(q) - 1)
        b, c = q[k - 1], q[min(k + 1, len(q) - 1)]
        dx, dy = c[0] - b[0], c[1] - b[1]
        l = math.hypot(dx, dy) or 1
        nx, ny = -dy / l, dx / l
        f = i / n
        m = amp * (1.0 if not doppelt or i % 2 == 0 else 0.45)
        if f < rand[0] or f > rand[1]:
            m *= 0.3
        p = q[k]
        out.append((p[0] + nx * m, p[1] + ny * m))
    out.append(q[-1])
    return out


def halb_breite(halb, y):
    """Breite der Halbseite (x) bei Höhe y (lokal, y negativ nach oben)."""
    best = 0
    for (x0, y0), (x1, y1) in zip(halb, halb[1:]):
        if (y0 - y) * (y1 - y) <= 0 and y0 != y1:
            x = x0 + (x1 - x0) * (y - y0) / (y1 - y0)
            best = max(best, x)
    return best


def setzen(pts, cx, cy, L, grad, sx=1.0):
    a = math.radians(grad)
    c, s = math.cos(a), math.sin(a)
    return [(r1(cx + (x * sx * L) * c - (y * L) * s), r1(cy + (x * sx * L) * s + (y * L) * c)) for x, y in pts]


def pfad(pts, zu=True):
    d = f'M{pts[0][0]} {pts[0][1]} ' + ' '.join(f'L{x} {y}' for x, y in pts[1:])
    return d + (' Z' if zu else '')


def glatter_pfad(pts, zu=True):
    """Quadratische Glättung über Mittelpunkte (für weiche Formen)."""
    if len(pts) < 3:
        return pfad(pts, zu)
    P = pts + [pts[0]] if zu else pts
    m = [((P[i][0] + P[i + 1][0]) / 2, (P[i][1] + P[i + 1][1]) / 2) for i in range(len(P) - 1)]
    d = f'M{r1(m[0][0])} {r1(m[0][1])}' if zu else f'M{P[0][0]} {P[0][1]} L{r1(m[0][0])} {r1(m[0][1])}'
    for i in range(1, len(m)):
        d += f' Q{P[i][0]} {P[i][1]} {r1(m[i][0])} {r1(m[i][1])}'
    if zu:
        d += f' Q{P[0][0]} {P[0][1]} {r1(m[0][0])} {r1(m[0][1])} Z'
    else:
        d += f' L{P[-1][0]} {P[-1][1]}'
    return d


def blatt(halb_kontrolle, cx, cy, L, grad, farben, n_zaehne=0, amp=0.0, doppelt=False, adern=6,
          schatten_seite=1, links_skala=0.94, ader_neigung=0.14, glatt=False, ader_farbe=None, zahn_vorn=0.65):
    """Fiedernerviges Blatt. halb_kontrolle: rechte Hälfte Grund->Spitze in lokalen Einheiten.
    farben = (grund, schatten, licht). Gibt Ebenen (form, schatten, licht, adern) zurück."""
    f, fd, fh = farben
    halb = catmull(halb_kontrolle, 10)
    rechts = zaehne(halb, n_zaehne, amp, doppelt, vorn=zahn_vorn)
    links = [(-x, y) for x, y in rechts]
    umriss_l = rechts + list(reversed(links))[1:-1]
    welt = setzen(umriss_l, cx, cy, L, grad)
    welt = [(x, y) for x, y in welt]
    # linke Hälfte etwas schmaler (natürliche Asymmetrie)
    umriss = setzen(rechts, cx, cy, L, grad) + setzen(list(reversed(links))[1:-1], cx, cy, L, grad, links_skala)
    d_form = glatter_pfad(umriss) if glatt else pfad(umriss)
    ebenen = [form(d_form, f)]
    # Schattenhälfte
    if schatten_seite:
        seite = rechts if schatten_seite > 0 else links
        sk = 1.0 if schatten_seite > 0 else links_skala
        sh = setzen(seite, cx, cy, L, grad, sk)
        d = pfad(sh)
        ebenen.append(E(glatter_pfad(sh) if glatt else d, fd, o=0.55, rolle='schatten'))
        # Lichtstreifen auf der anderen Hälfte
        andere = [(-x, y) for x, y in halb] if schatten_seite > 0 else halb
        ask = links_skala if schatten_seite > 0 else 1.0
        streifen = [(x * 0.62, y) for x, y in andere if -0.86 < y < -0.1]
        if streifen:
            pts = [(0, streifen[0][1])] + streifen + [(0, streifen[-1][1])]
            ebenen.append(E(glatter_pfad(setzen(pts, cx, cy, L, grad, ask)), fh, o=0.45, rolle='licht'))
    # Adern
    af = ader_farbe or fh
    mitte = setzen([(0, 0.02), (0.02, -0.5), (0, -0.97)], cx, cy, L, grad)
    ebenen.append(E(f'M{mitte[0][0]} {mitte[0][1]} Q{mitte[1][0]} {mitte[1][1]} {mitte[2][0]} {mitte[2][1]}', s=af, sw=0.9, o=0.85, rolle='detail'))
    if adern:
        y0 = min(y for _, y in halb)
        d = ''
        for i in range(adern):
            y = -0.1 - (0.78 * i / max(adern - 1, 1)) * (-y0 if y0 < -0.5 else 1) * 0.95
            for sg, sk in ((1, 1.0), (-1, links_skala)):
                w = halb_breite(halb, y - ader_neigung) * 0.88
                if w <= 0.02:
                    continue
                p = setzen([(0, y), (sg * w * 0.45, y - ader_neigung * 0.45), (sg * w, y - ader_neigung)], cx, cy, L, grad, sk)
                d += f'M{p[0][0]} {p[0][1]} Q{p[1][0]} {p[1][1]} {p[2][0]} {p[2][1]} '
        if d:
            ebenen.append(E(d.strip(), s=af, sw=0.6, o=0.7, rolle='detail'))
    return ebenen


def band(mitte, b0, b1, n=24):
    """Polygon um eine Mittellinie mit Breite b0 -> b1 (für Stängel und Zweige)."""
    q = neu_abtasten(catmull(mitte, 10), n)
    li, re = [], []
    for i, p in enumerate(q):
        a, c = q[max(i - 1, 0)], q[min(i + 1, len(q) - 1)]
        dx, dy = c[0] - a[0], c[1] - a[1]
        l = math.hypot(dx, dy) or 1
        nx, ny = -dy / l, dx / l
        b = (b0 + (b1 - b0) * i / n) / 2
        li.append((r1(p[0] - nx * b), r1(p[1] - ny * b)))
        re.append((r1(p[0] + nx * b), r1(p[1] + ny * b)))
    return li, re, q


def zweig(mitte, b0, b1, farben, n=24, licht=True):
    """Stängel/Zweig als Form mit Schattenkante (unten rechts) und Lichtkante."""
    f, fd, fh = farben
    li, re, q = band(mitte, b0, b1, n)
    ebenen = [form(pfad(li + list(reversed(re))), f)]
    # Seite, die nach unten rechts zeigt, bekommt Schatten
    mx = sum(p[0] for p in re) / len(re) - sum(p[0] for p in li) / len(li)
    my = sum(p[1] for p in re) / len(re) - sum(p[1] for p in li) / len(li)
    sch, hel = (re, li) if mx + my > 0 else (li, re)
    inn = [(r1((a[0] + c[0]) / 2), r1((a[1] + c[1]) / 2)) for a, c in zip(li, re)]
    ebenen.append(E(pfad(sch + list(reversed(inn))), fd, o=0.7, rolle='schatten'))
    if licht:
        hi = [(r1(a[0] * 0.7 + c[0] * 0.3), r1(a[1] * 0.7 + c[1] * 0.3)) for a, c in zip(hel, inn)]
        ebenen.append(E(pfad(hel[2:-2] + list(reversed(hi[2:-2]))), fh, o=0.5, rolle='licht'))
    return ebenen


def beere(cx, cy, r, farben, glanz=0.9, glanz_farbe='#FFFFFF'):
    f, fd, fh = farben
    return [
        form(kreis(cx, cy, r), f),
        E(kreis(r1(cx + r * 0.15), r1(cy + r * 0.15), r1(r * 0.8)), fd, o=0.6, rolle='schatten'),
        E(kreis(r1(cx - r * 0.12), r1(cy - r * 0.12), r1(r * 0.72)), f, o=1, rolle='licht'),
        E(oval(r1(cx - r * 0.3), r1(cy - r * 0.32), r1(r * 0.38), r1(r * 0.28)), fh, o=0.6, rolle='licht'),
        E(kreis(r1(cx - r * 0.38), r1(cy - r * 0.4), r1(max(r * 0.16, 0.5))), glanz_farbe, o=glanz, rolle='detail'),
    ]


def linie(pts, farbe, sw=0.8, o=None, rolle='detail'):
    return E(pfad([(r1(x), r1(y)) for x, y in pts], zu=False), s=farbe, sw=sw, o=o, rolle=rolle)


def kurve(p0, p1, p2, farbe, sw=0.8, o=None, rolle='detail'):
    return E(f'M{r1(p0[0])} {r1(p0[1])} Q{r1(p1[0])} {r1(p1[1])} {r1(p2[0])} {r1(p2[1])}', s=farbe, sw=sw, o=o, rolle=rolle)

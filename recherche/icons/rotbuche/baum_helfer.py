"""
Gemeinsame Zeichenhilfen für die Baum-Icons (Blatt mit Frucht).
Wird von recherche/icons/<baum>/zeichne.py importiert. Stil: docs/ICONS.md, Grundlagen: scripts/icon_helfer.py.

Punkte: (x, y, art) mit art 'c' = weich (Catmull-Rom), 'k' = Ecke.
Blätter werden lokal gezeichnet (Stielansatz 0/0, Spitze nach oben = -y) und dann gedreht/verschoben.
"""
import math, os, sys
sys.path.insert(0, 'scripts')
from icon_helfer import *  # noqa


def r1(v):
    v = round(v, 1)
    return int(v) if v == int(v) else v


# ---------- Pfade ----------
def _ctrl(pts, closed, t=1.0):
    n = len(pts)
    segs = []
    rng = range(n) if closed else range(n - 1)
    for i in rng:
        p0 = pts[i - 1] if (closed or i > 0) else pts[i]
        p1, p2 = pts[i], pts[(i + 1) % n]
        p3 = pts[(i + 2) % n] if (closed or i + 2 < n) else p2
        if p1[2] == 'k':
            c1 = (p1[0] + (p2[0] - p1[0]) * 0.25, p1[1] + (p2[1] - p1[1]) * 0.25)
        else:
            c1 = (p1[0] + (p2[0] - p0[0]) / 6 * t, p1[1] + (p2[1] - p0[1]) / 6 * t)
        if p2[2] == 'k':
            c2 = (p2[0] - (p2[0] - p1[0]) * 0.25, p2[1] - (p2[1] - p1[1]) * 0.25)
        else:
            c2 = (p2[0] - (p3[0] - p1[0]) / 6 * t, p2[1] - (p3[1] - p1[1]) / 6 * t)
        segs.append(((p1[0], p1[1]), c1, c2, (p2[0], p2[1])))
    return segs


def pfad(pts, closed=True, t=1.0):
    """Glatter Pfad durch die Punkte. Gibt (d, polygon) zurück; polygon = dicht abgetastete Kontur."""
    pts = [p if len(p) == 3 else (p[0], p[1], 'c') for p in pts]
    segs = _ctrl(pts, closed, t)
    d = f'M{r1(segs[0][0][0])} {r1(segs[0][0][1])}'
    poly = []
    for a, b, c, e in segs:
        d += f' C{r1(b[0])} {r1(b[1])} {r1(c[0])} {r1(c[1])} {r1(e[0])} {r1(e[1])}'
        for k in range(8):
            u = k / 8
            m = 1 - u
            poly.append((m**3 * a[0] + 3 * m * m * u * b[0] + 3 * m * u * u * c[0] + u**3 * e[0],
                         m**3 * a[1] + 3 * m * m * u * b[1] + 3 * m * u * u * c[1] + u**3 * e[1]))
    if closed:
        d += ' Z'
    else:
        poly.append(segs[-1][3])
    return d, poly


def poly_d(poly):
    if len(poly) < 3:
        return ''
    return 'M' + ' L'.join(f'{r1(x)} {r1(y)}' for x, y in poly) + ' Z'


def tf(pts, s, grad, tx, ty, sx=1.0):
    """Skalieren (s; sx zusätzlich nur in x), drehen (grad, positiv = Spitze nach rechts), verschieben."""
    a = math.radians(grad)
    c, si = math.cos(a), math.sin(a)
    out = []
    for p in pts:
        x, y = p[0] * s * sx, p[1] * s
        q = (tx + x * c - y * si, ty + x * si + y * c)
        out.append((q[0], q[1], p[2]) if len(p) == 3 else q)
    return out


def spiegel(rechts, versatz=(0, 0), sx=1.0):
    """Linke Blatthälfte aus der rechten (umgekehrte Reihenfolge, gespiegelt, leicht versetzt)."""
    return [(-x * sx + versatz[0], y + versatz[1], k) for x, y, k in reversed(rechts)]


# ---------- Clipping (Sutherland-Hodgman gegen Halbebene) ----------
def clip(poly, a, b, c):
    """Behält den Teil des Polygons mit a*x + b*y + c >= 0."""
    out = []
    n = len(poly)
    for i in range(n):
        p, q = poly[i], poly[(i + 1) % n]
        fp, fq = a * p[0] + b * p[1] + c, a * q[0] + b * q[1] + c
        if fp >= 0:
            out.append(p)
        if (fp >= 0) != (fq >= 0):
            t = fp / (fp - fq)
            out.append((p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t))
    return out


def clip_linie(poly, p, q, seite):
    """Clipt an der Geraden p→q; seite +1 = rechts der Richtung (im Bild), -1 = links."""
    dx, dy = q[0] - p[0], q[1] - p[1]
    a, b = -dy * seite, dx * seite
    return clip(poly, -a, -b, a * p[0] + b * p[1])


def schatten_seite(p, q):
    """Welche Seite der Linie p→q zeigt eher nach unten rechts? (+1/-1, siehe clip_linie)"""
    dx, dy = q[0] - p[0], q[1] - p[1]
    # Normale der Seite +1 ist (-dy, dx)
    return 1 if (-dy + dx) > 0 else -1


# ---------- Bausteine ----------
def band(pts, w0, w1=None):
    """Stiel/Zweig als schmale geschlossene Form entlang einer Linie (Breite w0 → w1)."""
    w1 = w0 if w1 is None else w1
    d_, poly = pfad(pts, closed=False)
    poly = poly[::2] + [poly[-1]]
    n = len(poly)
    L, R = [], []
    for i, (x, y) in enumerate(poly):
        a = poly[max(i - 1, 0)]
        b = poly[min(i + 1, n - 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]
        ln = math.hypot(dx, dy) or 1
        nx, ny = -dy / ln, dx / ln
        w = (w0 + (w1 - w0) * i / (n - 1)) / 2
        L.append((x + nx * w, y + ny * w))
        R.append((x - nx * w, y - ny * w))
    return poly_d(L + R[::-1])


def linie(pts, farbe, sw=0.8, o=None):
    d, _ = pfad(pts, closed=False)
    return E(d, s=farbe, sw=sw, o=o, rolle='detail')


def blatt_ebenen(umriss, basis, spitze, farben, licht_o=0.5, schatten_o=0.6):
    """Form + Schatten-Hälfte + Licht-Hälfte eines gefiederten Blatts (Mittelrippe basis→spitze)."""
    grund, dunkel, hell = farben
    d, poly = pfad(umriss)
    s = schatten_seite(basis, spitze)
    return [form(d, grund),
            E(poly_d(clip_linie(poly, basis, spitze, s)), dunkel, o=schatten_o, rolle='schatten'),
            E(poly_d(clip_linie(poly, basis, spitze, -s)), hell, o=licht_o, rolle='licht')], poly


def keil(poly, z, w1, w2):
    """Teil des Polygons im Winkelbereich w1..w2 (Grad, Bildkoordinaten) um den Punkt z (Bereich < 180°)."""
    p1 = (z[0] + math.cos(math.radians(w1)) * 100, z[1] + math.sin(math.radians(w1)) * 100)
    p2 = (z[0] + math.cos(math.radians(w2)) * 100, z[1] + math.sin(math.radians(w2)) * 100)
    out = clip_linie(poly, z, p1, +1)
    out = clip_linie(out, z, p2, -1)
    return out


# ---------- Ahornblatt (handförmig) ----------
def pol(w, r):
    """Punkt in Richtung w (Grad, 0 = oben, im Uhrzeigersinn) im Abstand r vom Stielansatz."""
    a = math.radians(w)
    return (math.sin(a) * r, -math.cos(a) * r)


def kante(A, B, bauch, zaehne=(), spitze_bei_B=True, zentrum=(0, 0), breiteste=None):
    """
    Punkte zwischen A und B (ohne A, B): Grundlinie mit Ausbauchung 'bauch' (Anteil der Länge) nach außen
    (weg von 'zentrum'), dazu Zähne: Liste (u, höhe, breite_u, art) – Zahnspitze zeigt nach außen und zur Lappenspitze.
    """
    ax, ay = A[0], A[1]
    bx, by = B[0], B[1]
    dx, dy = bx - ax, by - ay
    L = math.hypot(dx, dy) or 1
    nx, ny = -dy / L, dx / L
    mx, my = (ax + bx) / 2, (ay + by) / 2
    if (mx - zentrum[0]) * nx + (my - zentrum[1]) * ny < 0:
        nx, ny = -nx, -ny
    sx, sy = (dx / L, dy / L) if spitze_bei_B else (-dx / L, -dy / L)

    # breiteste: Anteil vom Buchtende aus, an dem die Ausbauchung am größten ist
    m = 0.5 if breiteste is None else (breiteste if spitze_bei_B else 1 - breiteste)
    pe = math.log(0.5) / math.log(m)

    def basis(u):
        b = bauch * L * math.sin(math.pi * max(0.0, min(1.0, u)) ** pe)
        return (ax + dx * u + nx * b, ay + dy * u + ny * b)
    pts = []
    if not zaehne:
        for u in (0.25, 0.5, 0.75):
            p = basis(u)
            pts.append((p[0], p[1], 'c'))
        return pts
    for u, h, bu, art in zaehne:
        p0 = basis(u - bu if spitze_bei_B else u + bu)
        p1 = basis(u)
        if art == 'lang':
            # lang ausgezogener, feiner Zahn (Spitzahorn): Schulter, feine Spitze, Kerbe dahinter
            p2 = basis(u + 0.05 if spitze_bei_B else u - 0.05)
            sch = (p1[0] + nx * 0.45 * h - sx * 0.1 * h, p1[1] + ny * 0.45 * h - sy * 0.1 * h, 'c')
            sp = (p1[0] + nx * h + sx * 0.9 * h, p1[1] + ny * h + sy * 0.9 * h, 'k')
            ke = (p2[0] + nx * 0.25 * h, p2[1] + ny * 0.25 * h, 'k')
            folge = [(p0[0], p0[1], 'c'), sch, sp, ke]
            pts += folge if spitze_bei_B else folge[::-1]
            continue
        kerbe = 'c' if art == 'rund' else 'k'
        if art == 'rund':
            art = 'c'
        if spitze_bei_B:
            pts.append((p0[0], p0[1], kerbe))
            pts.append((p1[0] + nx * h + sx * 0.4 * h, p1[1] + ny * h + sy * 0.4 * h, art))
        else:
            pts.append((p1[0] + nx * h + sx * 0.4 * h, p1[1] + ny * h + sy * 0.4 * h, art))
            pts.append((p0[0], p0[1], kerbe))
    return pts


def ahorn_umriss(lappen, buchten, kante_fn, spitze_fn):
    """
    lappen: Liste (winkel, länge) von links unten im Uhrzeigersinn.
    buchten: Liste (radius, art) mit len(lappen)+1 Einträgen? Nein: buchten[0] = Stielbucht, buchten[i] = Bucht vor Lappen i.
    kante_fn(i, A, B, spitze_bei_B) -> Punkte zwischen A und B.  spitze_fn(i, w, L) -> Punkte der Lappenspitze.
    Gibt (punkte, buchtpunkte, spitzen) zurück.
    """
    n = len(lappen)
    bucht = []
    for i in range(n + 1):
        if i in (0, n):
            w, (r, k) = 180, buchten[0]
        else:
            w, (r, k) = (lappen[i - 1][0] + lappen[i][0]) / 2, buchten[i]
        x, y = pol(w, r)
        bucht.append((x, y, k))
    pts, spitzen = [bucht[0]], []
    idx = [0]
    for i, (w, L) in enumerate(lappen):
        tip = spitze_fn(i, w, L)
        spitzen.append(pol(w, L))
        pts += kante_fn(i, bucht[i], tip[0], True)
        pts += tip
        pts += kante_fn(i, tip[-1], bucht[i + 1], False)
        if i < n - 1:
            idx.append(len(pts))
            pts.append(bucht[i + 1])
    idx.append(len(pts))
    return pts, idx, spitzen


# ---------- Eichel ----------
def eichel(cx, cy, grad, L, W, becher=0.33, farben=None, streifen=True):
    """
    Eichel mit Becher. (cx, cy) = Mitte der Nuss, grad = Richtung Becher→Spitze (0 = nach unten hängend).
    becher = Anteil der Nusslänge, den der Becher bedeckt.
    """
    f = farben or {}
    nuss, nuss_d, nuss_h = f.get('nuss', ('#A88A3E', '#6E5A26', '#CDB66A'))
    bech, bech_d, bech_h = f.get('becher', ('#8C7650', '#5C4C32', '#B39E74'))
    h, w = L / 2, W / 2
    # lokale Koordinaten: Becher oben (-y), Spitze unten (+y)
    nuss_pts = [(0, -h, 'c'), (w * 0.9, -h * 0.6, 'c'), (w, 0, 'c'), (w * 0.72, h * 0.6, 'c'), (w * 0.14, h * 0.96, 'c'),
                (0, h, 'c'), (-w * 0.14, h * 0.96, 'c'), (-w * 0.72, h * 0.6, 'c'), (-w, 0, 'c'), (-w * 0.9, -h * 0.6, 'c')]
    rand = -h + becher * L
    bw = w * 1.12
    becher_pts = [(-bw, rand, 'k'), (-bw * 0.98, rand - L * 0.12, 'c'), (-bw * 0.7, -h - L * 0.04, 'c'), (0, -h - L * 0.1, 'c'),
                  (bw * 0.7, -h - L * 0.04, 'c'), (bw * 0.98, rand - L * 0.12, 'c'), (bw, rand, 'k'),
                  (bw * 0.5, rand + L * 0.035, 'c'), (-bw * 0.5, rand + L * 0.035, 'c')]
    T = lambda pts: tf(pts, 1, grad, cx, cy)
    d_n, p_n = pfad(T(nuss_pts))
    d_b, p_b = pfad(T(becher_pts))
    ach = T([(0, -h), (0, h)])
    s = schatten_seite(ach[0], ach[1])
    ebenen = [form(d_n, nuss),
              E(poly_d(clip_linie(p_n, ach[0], ach[1], s)), nuss_d, o=0.55, rolle='schatten'),
              E(pfad(T([(-w * 0.55, -h * 0.2), (-w * 0.62, h * 0.25), (-w * 0.3, h * 0.6), (-w * 0.25, h * 0.1)]))[0],
                nuss_h, o=0.75, rolle='licht')]
    if streifen:
        for x in (-0.45, 0.0, 0.45):
            ebenen.append(linie(T([(w * x, rand + 1), (w * x * 1.1, 0), (w * x * 0.5, h * 0.8)]), nuss_d, 0.6, 0.45))
    spitze = T([(0, h - 0.3), (0, h + 1.6)])
    ebenen.append(E(f'M{r1(spitze[0][0])} {r1(spitze[0][1])} L{r1(spitze[1][0])} {r1(spitze[1][1])}', s='#3A2C18', sw=1.1, rolle='detail'))
    ebenen += [form(d_b, bech),
               E(poly_d(clip_linie(p_b, ach[0], ach[1], s)), bech_d, o=0.6, rolle='schatten')]
    # Schuppen als kleine Bögen in Reihen
    schuppen = []
    reihen = 3
    for r_ in range(reihen):
        yy = rand - 1.0 - r_ * (becher * L + L * 0.06) / reihen
        breite = bw * (0.95 - 0.15 * r_)
        n = 4 - (r_ > 1)
        for j in range(n):
            xx = -breite + (2 * breite) * (j + 0.5 + 0.5 * (r_ % 2) * 0) / n
            a = T([(xx - 1.1, yy - 0.6), (xx, yy + 0.7), (xx + 1.1, yy - 0.6)])
            schuppen.append(f'M{r1(a[0][0])} {r1(a[0][1])} Q{r1(a[1][0])} {r1(a[1][1])} {r1(a[2][0])} {r1(a[2][1])}')
    ebenen.append(E(' '.join(schuppen), s=bech_d, sw=0.6, o=0.9, rolle='detail'))
    hl = T([(-bw * 0.75, rand - 1.2), (-bw * 0.6, -h + 0.5), (-bw * 0.2, -h - L * 0.06)])
    ebenen.append(linie(hl, bech_h, 0.9, 0.8))
    return ebenen


def clip_punkt(poly, p, q, test):
    """Clipt an der Geraden p→q und behält die Seite, auf der 'test' liegt."""
    dx, dy = q[0] - p[0], q[1] - p[1]
    a, b = -dy, dx
    v = a * (test[0] - p[0]) + b * (test[1] - p[1])
    if v < 0:
        a, b = -a, -b
    return clip(poly, a, b, -(a * p[0] + b * p[1]))


# ---------- Ahorn: Blatt und Früchte als Ebenen ----------
def keil2(poly, z, a1, a2):
    """Teil des Polygons zwischen den Bildwinkeln a1..a2 (Grad, mathematisch im Bild) um z, Bereich < 180°."""
    am = math.radians((a1 + a2) / 2)
    test = (z[0] + math.cos(am) * 5, z[1] + math.sin(am) * 5)
    out = poly
    for a in (a1, a2):
        r = math.radians(a)
        out = clip_punkt(out, z, (z[0] + math.cos(r) * 50, z[1] + math.sin(r) * 50), test)
    return out


def ahorn_ebenen(pts, buchten, lappen, s, grad, x, y, farben, ader, schatten_o=0.5, licht_o=0.4, nebenadern=None):
    """Form + Licht/Schatten je Lappenhälfte (Lappen als Grate) + Hauptadern vom Stielansatz zu den Spitzen."""
    grund, dunkel, hell = farben
    T = lambda p: tf(p, s, grad, x, y)
    d, poly = pfad(T(pts))
    z = (x, y)
    ebenen = [form(d, grund)]
    sch, li = [], []
    for i, (w, L) in enumerate(lappen):
        i0, i1 = buchten[i] * 8, buchten[i + 1] * 8
        teil = poly[i0:i1 + 1] + [z]
        spitze = T([pol(w, L)])[0]
        a = math.atan2(spitze[1] - z[1], spitze[0] - z[0])
        for seite in (-1, 1):
            test = (z[0] + math.cos(a + seite * 0.5) * 8, z[1] + math.sin(a + seite * 0.5) * 8)
            h = clip_punkt(teil, z, spitze, test)
            if len(h) < 3:
                continue
            richtung = (math.cos(a + seite * 0.5) - math.cos(a), math.sin(a + seite * 0.5) - math.sin(a))
            (li if richtung[0] + richtung[1] < 0 else sch).append(poly_d(h))
    ebenen.append(E(' '.join(sch), dunkel, o=schatten_o, rolle='schatten'))
    ebenen.append(E(' '.join(li), hell, o=licht_o, rolle='licht'))
    for w, L in lappen:
        ebenen.append(linie(T([(0, 0), pol(w + 1.5, L * 0.5), pol(w, L * 0.94)]), ader, 1.0, 0.85))
    for a, b in (nebenadern or []):
        ebenen.append(linie(T([a, b]), ader, 0.6, 0.7))
    return ebenen


FRUCHT = [(-2.4, -2.2, 'k'), (-3.0, -9, 'c'), (-3.0, -16, 'c'), (-1.6, -21.6, 'c'), (1.6, -23.2, 'c'), (4.8, -20.4, 'c'),
          (6.0, -14, 'c'), (5.2, -7.6, 'c'), (2.8, -2.2, 'k')]


def fluegelfrucht(x, y, grad, s, farben, nuss_r=3.2, spiegeln=False, nuss_farbe=None):
    """Eine Teilfrucht (Nuss bei x/y, Flügel in Richtung grad; 0 = nach oben). Gerade Kante innen."""
    grund, dunkel, hell = farben
    sx = -1 if spiegeln else 1
    T = lambda p: tf(p, s, grad, x, y, sx=sx)
    d, poly = pfad(T(FRUCHT))
    a, b = T([(-2.6, -2), (-2.0, -21)])
    e = [form(d, grund),
         E(poly_d(clip_punkt(poly, *T([(1.2, -2), (1.8, -21)]), T([(5, -12)])[0])), dunkel, o=0.45, rolle='schatten'),
         linie(T([(-2.6, -3), (-2.9, -12), (-1.8, -20.5)]), dunkel, 1.2, 0.9),
         linie(T([(-1.6, -4), (0.4, -12), (2.4, -19)]), dunkel, 0.5, 0.6),
         linie(T([(-0.6, -3.6), (2.4, -10), (4.6, -15)]), dunkel, 0.5, 0.6),
         linie(T([(-1.4, -6), (-1.6, -13), (-0.6, -18)]), hell, 0.9, 0.7)]
    nd, _ = pfad(T([(0, -nuss_r * 1.2, 'c'), (nuss_r, -nuss_r * 0.3, 'c'), (nuss_r * 0.8, nuss_r * 0.8, 'c'),
                    (0, nuss_r * 1.1, 'c'), (-nuss_r * 0.8, nuss_r * 0.8, 'c'), (-nuss_r, -nuss_r * 0.3, 'c')]))
    e += [form(nd, nuss_farbe or grund),
          E(oval(*T([(-nuss_r * 0.3, -nuss_r * 0.35)])[0], nuss_r * 0.35, nuss_r * 0.3), hell, o=0.75, rolle='licht')]
    return e

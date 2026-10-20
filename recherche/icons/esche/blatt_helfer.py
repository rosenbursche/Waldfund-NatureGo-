"""
Zeichenhilfen für gesägte Laubblätter (Esche, Linden, Ulme, Erlen, Birke).
Baut auf scripts/icon_helfer.py und recherche/icons/rotbuche/baum_helfer.py auf.

Blätter lokal: Stielansatz 0/0, Spitze nach oben (-y). Die glatte Grundform wird aus Stützpunkten gebildet,
dann werden Zähne (einfach oder doppelt gesägt, Spitze zur Blattspitze geneigt) auf den Rand gesetzt.
"""
import math, sys
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/rotbuche')
from icon_helfer import *  # noqa
from baum_helfer import *  # noqa


def _laenge(p, q):
    return math.hypot(q[0] - p[0], q[1] - p[1])


def _abtasten(linie, schritt=0.35):
    """Polylinie gleichmäßig abtasten: Liste (s, x, y)."""
    out = [(0.0, linie[0][0], linie[0][1])]
    s = 0.0
    for a, b in zip(linie, linie[1:]):
        L = _laenge(a, b)
        n = max(1, int(L / schritt))
        for k in range(1, n + 1):
            u = k / n
            out.append((s + L * u, a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u))
        s += L
    return out


def _bei(ab, s):
    s = max(0.0, min(ab[-1][0], s))
    lo, hi = 0, len(ab) - 1
    while hi - lo > 1:
        m = (lo + hi) // 2
        if ab[m][0] <= s:
            lo = m
        else:
            hi = m
    a, b = ab[lo], ab[hi]
    u = 0 if b[0] == a[0] else (s - a[0]) / (b[0] - a[0])
    x, y = a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u
    # Tangente
    i0, i1 = max(0, lo - 2), min(len(ab) - 1, hi + 2)
    dx, dy = ab[i1][1] - ab[i0][1], ab[i1][2] - ab[i0][2]
    ln = math.hypot(dx, dy) or 1
    return x, y, dx / ln, dy / ln


def _saege_seite(seite, aussen, abstand, hoehe, muster, von, bis, vor=0.72):
    """seite: Polylinie Stiel→Spitze. aussen: +1 = Normale rechts der Laufrichtung zeigt nach außen."""
    ab = _abtasten(seite)
    S = ab[-1][0]
    pts = []
    s = S * von
    k = 0
    while s + abstand <= S * bis:
        h = hoehe * muster[k % len(muster)]
        x, y, tx, ty = _bei(ab, s)
        pts.append((x, y, 'k'))
        x2, y2, tx2, ty2 = _bei(ab, s + abstand * vor)
        nx, ny = -ty2 * aussen, tx2 * aussen
        pts.append((x2 + nx * h, y2 + ny * h, 'k'))
        s += abstand * (0.7 + 0.6 * muster[k % len(muster)]) if len(muster) > 1 else abstand
        k += 1
    return pts


def gesaegt(stuetz_rechts, stuetz_links, abstand=2.6, hoehe=1.2, muster=(1,), von=0.12, bis=0.95,
            spitze_glatt=0.0):
    """
    stuetz_rechts: Stützpunkte (x, y) vom Stiel (0/0 nicht enthalten) bis zur Spitze (letzter Punkt = Spitze).
    stuetz_links:  Stützpunkte von der Spitze (nicht enthalten) zurück bis kurz vor den Stiel.
    Gibt (punkte_mit_art, glattes_polygon) zurück. Die Punkte gehen an pfad().
    """
    roh = [(0, 0, 'k')] + [(x, y, 'c') for x, y in stuetz_rechts[:-1]] + [(stuetz_rechts[-1][0], stuetz_rechts[-1][1], 'k')] \
        + [(x, y, 'c') for x, y in stuetz_links]
    _, poly = pfad(roh)
    ti = min(range(len(poly)), key=lambda i: poly[i][1])
    rechts = poly[:ti + 1]
    links = (poly[ti:] + [poly[0]])[::-1]  # Stiel → Spitze
    pr = _saege_seite(rechts, +1, abstand, hoehe, muster, von, bis)
    pl = _saege_seite(links, -1, abstand, hoehe, muster, von, bis)
    spitze = poly[ti]
    pts = [(0, 0.2, 'k')] + pr + [(spitze[0], spitze[1] - spitze_glatt, 'k')] + pl[::-1]
    return pts, poly


def rand_bei(poly, y, seite):
    """x des glatten Randes in Höhe y (seite +1 rechts, -1 links)."""
    best = None
    n = len(poly)
    for i in range(n):
        a, b = poly[i], poly[(i + 1) % n]
        if (a[1] - y) * (b[1] - y) <= 0 and a[1] != b[1]:
            x = a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1])
            if best is None or x * seite > best * seite:
                best = x
    return best if best is not None else 0


def blatt(stuetz_r, stuetz_l, s, grad, x, y, farben, ader, adern=7, t0=0.08, t1=0.86, saege=None,
          licht_o=0.4, schatten_o=0.5, ader_sw=0.6, mittel_sw=1.0, ader_o=0.75, bogen=0.5, stiel=None,
          stiel_farbe='#6E7A3A', handadern=0):
    """Komplettes Blatt: Stiel, Form, Licht/Schatten an der Mittelrippe, Mittelrippe, Seitenadern.
    Gibt (ebenen, info) zurück; info enthält das Polygon (Bild) und Aderenden (lokal)."""
    saege = saege or {}
    T = lambda p: tf(p, s, grad, x, y)
    pts, glatt = gesaegt(stuetz_r, stuetz_l, **saege)
    L = -min(p[1] for p in glatt)
    e = []
    if stiel:
        e.append(form(band(T(stiel), 1.8, 1.4), stiel_farbe))
    basis, spitze = T([(0, 0)])[0], T([(0, -L)])[0]
    teile, poly = blatt_ebenen(T(pts), basis, spitze, farben, licht_o=licht_o, schatten_o=schatten_o)
    e += teile
    e.append(linie(T([(0, 0.5), (0.3, -L * 0.5), (0, -L * 0.96)]), ader, mittel_sw, 0.85))
    enden = []
    for j in range(adern):
        t = t0 + (t1 - t0) * j / max(1, adern - 1)
        for sx in (1, -1):
            yy = -L * t
            xr = rand_bei(glatt, yy - L * 0.06, sx)
            if abs(xr) < 1:
                continue
            start = (0, yy + L * 0.07)
            mitte = (xr * 0.5, yy - L * 0.01 + L * 0.03 * bogen)
            ende = (xr * 0.93, yy - L * 0.06)
            enden.append((sx, start, ende))
            e.append(linie(T([start, mitte, ende]), ader, ader_sw, ader_o))
    for k in range(handadern):
        # zusätzliche Grundnerven (Linden: handförmig vom Blattgrund)
        for sx in (1, -1):
            yy = -L * (0.12 + 0.1 * k)
            xr = rand_bei(glatt, yy, sx)
            e.append(linie(T([(0, -0.5), (xr * 0.5, yy * 0.4 - 1), (xr * 0.9, yy)]), ader, ader_sw, ader_o))
    return e, {'poly': poly, 'glatt': glatt, 'L': L, 'T': T, 'enden': enden}

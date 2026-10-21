"""Gemeinsame Zeichnung der Erlen (Schwarzerle / Grauerle): Blatt + verholzte Fruchtzäpfchen am Zweig."""
import sys, math
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/esche')
from blatt_helfer import *  # noqa

ZAPFEN = [(0, -6.2, 'c'), (3.4, -4.4, 'c'), (4.2, 0, 'c'), (3.4, 4.6, 'c'), (0, 6.6, 'c'), (-3.4, 4.6, 'c'), (-4.2, 0, 'c'), (-3.4, -4.4, 'c')]


def zapfen(x, y, grad, s):
    """Verholztes Erlen-Zäpfchen, (x, y) = Mitte; grad = Richtung der Längsachse (0 = hängt nach unten)."""
    Tz = lambda p: tf(p, s, grad, x, y)
    d, poly = pfad(Tz(ZAPFEN))
    e = [form(d, '#6A4428'),
         E(poly_d(clip_punkt(poly, *Tz([(-3, 6), (4, -3)]), Tz([(4, 6)])[0])), '#3A2414', o=0.6, rolle='schatten'),
         E(oval(*Tz([(-1.6, -2)])[0], 1.3 * s, 2.0 * s), '#9A6E44', o=0.7, rolle='licht')]
    # Schuppen: Reihen kleiner Bögen
    sch = []
    for j, yy in enumerate((-3.6, -1.2, 1.2, 3.6)):
        for xx in ((-1.8, 0.6, 3.0) if j % 2 else (-3.0, -0.6, 1.8)):
            if abs(xx) > 3.6 - abs(yy) * 0.25:
                continue
            a = Tz([(xx - 1.1, yy + 0.4), (xx, yy - 0.9), (xx + 1.1, yy + 0.4)])
            sch.append(f'M{r1(a[0][0])} {r1(a[0][1])} Q{r1(a[1][0])} {r1(a[1][1])} {r1(a[2][0])} {r1(a[2][1])}')
    e.append(E(' '.join(sch), s='#2A180C', sw=0.6, o=0.85, rolle='detail'))
    return e


def kaetzchen(pts, w, farbe='#7A4E3E', spitz=0.75):
    """Männliches Kätzchen: hängende Walze mit Querrillen."""
    d = band(pts, w, w * spitz)
    e = [form(d, farbe)]
    _, poly = pfad(pts, closed=False)
    rillen = []
    for i in range(3, len(poly) - 2, 3):
        (x0, y0), (x1, y1) = poly[i - 1], poly[i + 1]
        dx, dy = x1 - x0, y1 - y0
        ln = math.hypot(dx, dy) or 1
        nx, ny = -dy / ln * w * 0.45, dx / ln * w * 0.45
        x, y = poly[i]
        rillen.append(f'M{r1(x - nx)} {r1(y - ny)} Q{r1(x + dx / ln)} {r1(y + dy / ln)} {r1(x + nx)} {r1(y + ny)}')
    e.append(E(' '.join(rillen), s='#3A2A18', sw=0.6, o=0.45, rolle='detail'))
    e.append(linie(pts[:-1], '#A87A62', 0.8, 0.6))
    return e

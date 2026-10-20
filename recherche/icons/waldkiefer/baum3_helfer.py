"""Gemeinsame Hilfen für die Baum-Icons Reihe 3 (Moorbirke, Vogelbeere, Vogelkirsche, Elsbeere, Kiefer, Tanne, Fichte).
Import:  sys.path.insert(0, 'recherche/icons/waldkiefer'); from baum3_helfer import *"""
import sys, math, json
sys.path.insert(0, 'scripts'); sys.path.insert(0, 'recherche/icons/hasel')
from icon_helfer import *  # noqa
from pflanzen_helfer import *  # noqa


def quellen(art):
    """Quellen aus der Notiz (Titel + URL der angesehenen Referenzfotos)."""
    q = []
    for z in open(f'recherche/icons/{art}/notiz.md', encoding='utf-8'):
        if z.startswith('- ') and 'https://' in z:
            teile = z[2:].strip().split(' – ')
            q.append({'titel': f'Referenzfoto {teile[0]} ({teile[1]})', 'url': teile[-1]})
    return q


def richtung(a, b):
    """Winkel (Grad) von a nach b, 0 = nach oben, im Uhrzeigersinn."""
    return math.degrees(math.atan2(b[0] - a[0], -(b[1] - a[1])))


def punkt(p, grad, l):
    a = math.radians(grad)
    return (p[0] + math.sin(a) * l, p[1] - math.cos(a) * l)


def nadel(p, grad, l, b, farben, biegung=0.0, kerbe=False, spitz=True):
    """Eine Nadel als schmale Form (Ansatz p, Richtung grad, Länge l, Breite b).
    biegung: seitliche Krümmung (Anteil von l). kerbe: eingekerbte Spitze (Tanne)."""
    f, fd, fh = farben
    mitte = [(0, 0), (biegung * 0.5, -0.5), (biegung, -1.0)]
    q = catmull(mitte, 6)
    re, li = [], []
    for i, (x, y) in enumerate(q):
        t = i / (len(q) - 1)
        w = b / 2 / l * ((1 - t ** 3) if spitz else (0.75 + 0.25 * (1 - t)))
        if t == 0:
            w *= 0.7
        re.append((x + w, y)); li.append((x - w, y))
    if spitz:
        umr = re[:-1] + [q[-1]] + list(reversed(li[:-1]))
    else:
        tip = q[-1]
        umr = re + ([(tip[0], tip[1] + (0.06 if kerbe else 0))] if kerbe else []) + list(reversed(li))
    pts = setzen(umr, p[0], p[1], l, grad)
    t = [form(pfad(pts), f)]
    # Schatten auf der rechten Hälfte, Licht als feine Mittellinie
    sh = setzen(re + [q[-1]] + list(reversed(q)), p[0], p[1], l, grad)
    t.append(E(pfad(sh), fd, o=0.45, rolle='schatten'))
    return t


def zapfen_umriss(halb, cx, cy, L, grad):
    umr = halb + [(-x, y) for x, y in reversed(halb)][1:-1]
    return setzen(umr, cx, cy, L, grad)

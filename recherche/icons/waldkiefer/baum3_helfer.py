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
    t.append(E(pfad(sh), fd, o=0.35, rolle='schatten'))
    return t


def zapfen_umriss(halb, cx, cy, L, grad):
    umr = halb + [(-x, y) for x, y in reversed(halb)][1:-1]
    return setzen(umr, cx, cy, L, grad)


def nadelkamm(ansaetze, l, b, farben, kerbe=False, spitz=True, schatten=0.3):
    """Mehrere nebeneinander stehende Nadeln als EINE Form (Kamm), damit sich Konturen nicht stapeln.
    ansaetze: Liste (punkt, grad, länge-faktor). Gibt (ebenen, nadel_achsen) zurück."""
    f, fd, fh = farben
    umr, achsen = [], []
    for p, grad, fk in ansaetze:
        L = l * fk
        a = math.radians(grad)
        qx, qy = math.cos(a), math.sin(a)          # quer zur Nadel
        bl, bt = b / 2, (b / 2 * 0.15 if spitz else b / 2 * 0.8)
        tip = punkt(p, grad, L)
        basis_l = (p[0] - qx * bl, p[1] - qy * bl)
        basis_r = (p[0] + qx * bl, p[1] + qy * bl)
        mid_l = punkt(basis_l, grad, L * 0.7)
        mid_r = punkt(basis_r, grad, L * 0.7)
        if spitz:
            pts = [basis_l, mid_l, tip, mid_r, basis_r]
        else:
            tl = (tip[0] - qx * bt, tip[1] - qy * bt)
            tr = (tip[0] + qx * bt, tip[1] + qy * bt)
            kerb = punkt(tip, grad + 180, L * (0.07 if kerbe else 0))
            pts = [basis_l, tl, kerb, tr, basis_r]
        umr += pts
        achsen.append((p, grad, L))
    pts = [(r1(x), r1(y)) for x, y in umr]
    ebenen = [form(pfad(pts), f)]
    # Schatten: rechte Hälfte jeder Nadel
    d = ''
    for p, grad, L in achsen:
        a = math.radians(grad)
        qx, qy = math.cos(a), math.sin(a)
        tip = punkt(p, grad, L * (0.98 if spitz else 0.93))
        br = (p[0] + qx * b / 2, p[1] + qy * b / 2)
        mr = punkt(br, grad, L * 0.7) if spitz else (tip[0] + qx * b * 0.4, tip[1] + qy * b * 0.4)
        d += pfad([(r1(p[0]), r1(p[1])), (r1(tip[0]), r1(tip[1])), (r1(mr[0]), r1(mr[1])), (r1(br[0]), r1(br[1]))]) + ' '
    ebenen.append(E(d.strip(), fd, o=schatten, rolle='schatten'))
    return ebenen, achsen

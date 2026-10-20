"""Weißtanne: flache, stumpfe, an der Spitze eingekerbte Nadeln, gescheitelt (zweizeilig), unterseits zwei weiße
Wachsstreifen + walzenförmiger Zapfen, der AUFRECHT auf dem Zweig steht (mit herausragenden Deckschuppen)."""
import sys, math, random
sys.path.insert(0, 'recherche/icons/waldkiefer')
from baum3_helfer import *

NADEL = ('#3C7046', '#24482A', '#6E9E70')
UNTEN = '#E4EEE6'   # Wachsstreifen der Unterseite
ZWEIG = ('#8A7A62', '#5A4E3E', '#B4A68C')
ZAPFEN = ('#7C7A46', '#4E4C28', '#A8A672')
BRAKTEE = '#D8D2A6'


def tannennadel(p, grad, l, unterseite=False):
    t = nadel(p, grad, l, 3.6, NADEL, spitz=False, kerbe=True)
    if unterseite:
        # zwei weiße Streifen beiderseits der Mittelrippe
        for dx in (-0.55, 0.55):
            a = math.radians(grad)
            ox, oy = math.cos(a) * dx, math.sin(a) * dx
            s0, s1 = punkt(p, grad, l * 0.18), punkt(p, grad, l * 0.86)
            t.append(linie([(s0[0] + ox, s0[1] + oy), (s1[0] + ox, s1[1] + oy)], UNTEN, 0.7, 0.9))
    else:
        s0, s1 = punkt(p, grad, l * 0.15), punkt(p, grad, l * 0.85)
        t.append(linie([s0, s1], NADEL[2], 0.6, 0.6))
    return t


def zapfen(cx, cy, grad, L=40, b=14):
    """aufrechter, walzenförmiger Zapfen; Ansatz cx/cy, Spitze in Richtung grad"""
    halb = catmull([(0, 0), (0.12, -0.02), (0.17, -0.1), (0.18, -0.5), (0.16, -0.8), (0.11, -0.93), (0.05, -0.99), (0, -1.0)], 4)
    halb = [(x * b / L / 0.36, y) for x, y in halb]
    # Umriss rechts mit kleinen Brakteen-Spitzen, dann gespiegelt
    re = []
    for i, (x, y) in enumerate(halb):
        re.append((x, y))
        if -0.9 < y < -0.08 and i % 3 == 1:
            re.append((x + 0.06, y - 0.01))
    umr = re + [(-x, y) for x, y in reversed(re)][1:-1]
    t = [form(pfad(setzen(umr, cx, cy, L, grad)), ZAPFEN[0])]
    t.append(E(glatter_pfad(setzen(halb + [(0, -1)], cx, cy, L, grad)), ZAPFEN[1], o=0.45, rolle='schatten'))
    hl = setzen([(-0.04, -0.1), (-0.13, -0.16), (-0.14, -0.8), (-0.05, -0.88)], cx, cy, L, grad)
    t.append(E(glatter_pfad(hl), ZAPFEN[2], o=0.55, rolle='licht'))
    # Samenschuppen als Bogenreihen, dazwischen herausragende, zurückgebogene Deckschuppen
    w = halb_breite(halb, -0.5)
    d_bog, brakteen = '', []
    for i in range(10):
        y = -0.08 - i * 0.088
        for k, x in enumerate((-0.6, 0, 0.6) if i % 2 == 0 else (-0.3, 0.3)):
            x *= w
            p = setzen([(x - w * 0.3, y), (x, y + 0.05), (x + w * 0.3, y)], cx, cy, L, grad)
            d_bog += f'M{p[0][0]} {p[0][1]} Q{p[1][0]} {p[1][1]} {p[2][0]} {p[2][1]} '
            if i < 9:
                tip = setzen([(x - w * 0.07, y + 0.035), (x, y + 0.085), (x + w * 0.07, y + 0.035)], cx, cy, L, grad)
                brakteen.append(tip)
    t.append(E(d_bog.strip(), s=ZAPFEN[1], sw=0.7, o=0.9, rolle='detail'))
    for tip in brakteen:
        t.append(E(pfad(tip), BRAKTEE, s=ZAPFEN[1], sw=0.4, o=0.95, rolle='detail'))
    return t


ebenen = hg_wald()
# waagrechter Zweig
ast = [(10, 92), (36, 86), (62, 78), (88, 68), (110, 58)]
q = neu_abtasten(catmull(ast, 8), 50)
g = richtung(ast[0], ast[-1])  # ~ 80° (nach rechts)
random.seed(2)
oben, unten = [], []
for i in range(1, 49, 2):
    p = q[i]
    l = 19 + random.uniform(-1.5, 1.5)
    # gescheitelt: obere Reihe schräg nach oben-vorn, untere nach unten-vorn
    oben.append((p, g - 62 + random.uniform(-6, 6), l))
    unten.append((q[i + 1], g + 66 + random.uniform(-6, 6), l))
# Nadeln als Kämme (je Seite eine Form), Mittelrippe bzw. weiße Streifen als feine Linien
def kamm(reihe, unterseite):
    ebenen_k, achsen = nadelkamm([(p, w, l / 17) for p, w, l in reihe], 17, 3.8, NADEL, kerbe=True, spitz=False)
    for k, (p, w, L) in enumerate(achsen):
        if unterseite and k % 3 != 1:
            a = math.radians(w)
            for dx in (-0.65, 0.65):
                ox, oy = math.cos(a) * dx, math.sin(a) * dx
                s0, s1 = punkt(p, w, L * 0.2), punkt(p, w, L * 0.84)
                ebenen_k.append(linie([(s0[0] + ox, s0[1] + oy), (s1[0] + ox, s1[1] + oy)], UNTEN, 0.75, 0.9))
        else:
            ebenen_k.append(linie([punkt(p, w, L * 0.15), punkt(p, w, L * 0.85)], NADEL[2], 0.6, 0.7))
    return ebenen_k


ebenen += kamm(oben, False)
ebenen += zweig(ast, 4.0, 3.0, ZWEIG)
ebenen += kamm(unten, True)
# Zapfen steht aufrecht auf dem Zweig (Ansatz auf der Oberseite)
ebenen += zapfen(82, 70, 4, L=36, b=16)
ebenen += zapfen(54, 80, -6, L=50, b=20)

speichern('weisstanne', ebenen, quellen=quellen('weisstanne'))

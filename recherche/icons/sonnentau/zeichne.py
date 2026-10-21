import sys, math, re
sys.path.insert(0, 'scripts')
from icon_helfer import *

def r1(v): return round(v, 1)
def lf(p0, p1, w, a=0.3, b=0.8, wb=None, bieg=0.0):
    """Blatt/Blütenblatt von p0 (Grund) nach p1 (Spitze), halbe Breite w; bieg biegt die Achse seitlich."""
    if wb is None: wb = w
    ux, uy = p1[0]-p0[0], p1[1]-p0[1]; L = math.hypot(ux, uy); nx, ny = -uy/L, ux/L
    def P(t, s):
        k = bieg * math.sin(math.pi*t)
        return (r1(p0[0]+ux*t+nx*(s+k)), r1(p0[1]+uy*t+ny*(s+k)))
    return f'M{r1(p0[0])} {r1(p0[1])} C{P(a,w)[0]} {P(a,w)[1]} {P(b,wb)[0]} {P(b,wb)[1]} {r1(p1[0])} {r1(p1[1])} C{P(b,-wb)[0]} {P(b,-wb)[1]} {P(a,-w)[0]} {P(a,-w)[1]} {r1(p0[0])} {r1(p0[1])} Z'
def halb(p0, p1, w, a=0.3, b=0.8, wb=None, bieg=0.0, seite=1):
    """nur eine Hälfte eines Blatts (für Licht/Schatten)"""
    if wb is None: wb = w
    ux, uy = p1[0]-p0[0], p1[1]-p0[1]; L = math.hypot(ux, uy); nx, ny = -uy/L, ux/L
    def P(t, s):
        k = bieg * math.sin(math.pi*t)
        return (r1(p0[0]+ux*t+nx*(s+k)), r1(p0[1]+uy*t+ny*(s+k)))
    s = seite
    return f'M{r1(p0[0])} {r1(p0[1])} C{P(a,s*w)[0]} {P(a,s*w)[1]} {P(b,s*wb)[0]} {P(b,s*wb)[1]} {r1(p1[0])} {r1(p1[1])} C{P(0.75,0)[0]} {P(0.75,0)[1]} {P(0.3,0)[0]} {P(0.3,0)[1]} {r1(p0[0])} {r1(p0[1])} Z'
def achse(p0, p1, t0=0.05, t1=0.9, bieg=0.0):
    ux, uy = p1[0]-p0[0], p1[1]-p0[1]; L = math.hypot(ux, uy); nx, ny = -uy/L, ux/L
    def P(t): k = bieg*math.sin(math.pi*t); return (r1(p0[0]+ux*t+nx*k), r1(p0[1]+uy*t+ny*k))
    a, m, e = P(t0), P((t0+t1)/2), P(t1)
    return f'M{a[0]} {a[1]} Q{m[0]} {m[1]} {e[0]} {e[1]}'
def punkt(p0, p1, t, s=0.0, bieg=0.0):
    ux, uy = p1[0]-p0[0], p1[1]-p0[1]; L = math.hypot(ux, uy); nx, ny = -uy/L, ux/L
    k = bieg*math.sin(math.pi*t)
    return (r1(p0[0]+ux*t+nx*(s+k)), r1(p0[1]+uy*t+ny*(s+k)))
def quellen_aus_notiz(art):
    q = []
    for z in open(f'recherche/icons/{art}/notiz.md'):
        m = re.match(r'- (.+?) \(.+?\): (https://\S+)', z.strip())
        if m: q.append({'titel': 'Referenzfoto ' + m.group(1), 'url': m.group(2)})
    return q
def stiel(d_pts, w, farbe='#5C7A3A'):
    """Stängel als schmale Form entlang Quadratkurve p0-k-p1"""
    (x0, y0), (kx, ky), (x1, y1) = d_pts
    return form(f'M{x0-w} {y0} Q{kx-w} {ky} {x1-w*0.7} {y1} L{x1+w*0.7} {y1} Q{kx+w} {ky} {x0+w} {y0} Z', farbe)

# ---------- Rundblättriger Sonnentau (Drosera rotundifolia) ----------
SP, SP_D, SP_H = '#8FAE42', '#5E7A2A', '#B5CC6A'
ROT, ROT_D = '#C23A2E', '#8E2A22'
TROPF = '#E8F0EE'
import random
random.seed(11)

def blatt(cx, cy, r, stauch, stiel_von, gross=True):
    t = []
    # flacher, behaarter Blattstiel
    sx, sy = stiel_von
    t.append(form(lf((sx, sy), (cx, cy + r*stauch*0.6), 1.6, a=0.3, b=0.8, wb=1.4), '#8E8A4A'))
    t.append(form(oval(cx, cy, r, r*stauch), SP))
    # rot überlaufene Mitte/Rand
    t.append(E(oval(cx + r*0.15, cy + r*0.15*stauch, r*0.85, r*0.85*stauch), '#B8473A', o=0.6, rolle='schatten'))
    t.append(E(oval(cx - r*0.35, cy - r*0.35*stauch, r*0.4, r*0.3*stauch), SP_H, o=0.5, rolle='licht'))
    # lange Randtentakel strahlen nach außen
    n = 22 if gross else 14
    for i in range(n):
        g = i*360/n + random.uniform(-4, 4)
        a = math.radians(g)
        L = r*random.uniform(0.42, 0.55)
        x0, y0 = cx + r*0.92*math.cos(a), cy + r*0.92*stauch*math.sin(a)
        x1, y1 = cx + (r+L)*math.cos(a), cy + (r+L)*stauch*math.sin(a)
        mx, my = (x0+x1)/2 + random.uniform(-0.6, 0.6), (y0+y1)/2 - 0.5
        t.append(E(f'M{r1(x0)} {r1(y0)} Q{r1(mx)} {r1(my)} {r1(x1)} {r1(y1)}', s=ROT, sw=0.9 if gross else 0.75, rolle='detail'))
        t.append(E(kreis(r1(x1), r1(y1), 1.5 if gross else 1.1), ROT_D, rolle='detail'))
        t.append(E(kreis(r1(x1 - 0.2), r1(y1 - 0.2), 1.3 if gross else 0.95), TROPF, o=0.7, rolle='detail'))
        t.append(E(kreis(r1(x1 - 0.5), r1(y1 - 0.5), 0.35), '#FFFFFF', o=0.95, rolle='detail'))
    # kurze Tentakel auf der Spreite: rote Köpfchen mit Tropfen
    for ring, k in ([(0.62, 14), (0.32, 8)] if gross else [(0.55, 9)]):
        for j in range(k):
            g = math.radians(j*360/k + ring*40 + random.uniform(-6, 6))
            x, y = cx + r*ring*math.cos(g), cy + r*ring*stauch*math.sin(g)
            t.append(E(kreis(r1(x), r1(y), 1.0 if gross else 0.8), ROT, rolle='detail'))
            t.append(E(kreis(r1(x - 0.25), r1(y - 0.3), 0.6), TROPF, o=0.8, rolle='detail'))
    return t

e = hg_boden()
# Torfmoos-Polster am Boden
e.append(E('M19 96 Q30 88 44 92 Q56 86 70 92 Q84 87 101 94 L101 104 L19 104 Z', '#4E6B2C', rolle='detail'))
e.append(E('M28 94 l1.5 -3 l1.5 3 M46 92 l1.5 -3 l1.5 3 M74 92 l1.5 -3 l1.5 3 M88 94 l1.5 -3 l1.5 3', s='#7E9A4A', sw=0.8, rolle='detail'))
# Blütenschaft mit kleinen weißen Blüten, Spitze eingerollt
e.append(form('M78 96 C79 76 80 52 83 34 C84 29 88 27 90 30 L88.6 31.4 C87.4 30 85.6 30.6 85 34.8 C82.4 52 81 76 80.2 96 Z', '#9A4A3A'))
# einseitige Wickel: oben grüne Knospen, darunter eine geöffnete weiße Blüte
for x, y in [(85.6, 44), (84.6, 52)]:
    e.append(form(lf((x - 1, y), (x + 4, y - 2.5), 1.8, a=0.4, b=0.7), '#7E8F4A'))
e.append(form(lf((83.6, 60), (89.6, 58.6), 0.8, a=0.4, b=0.7), '#7E8F4A'))
for i in range(5):
    g = i*72 + 10
    a = dreh([(0, -5.0)], 91.4, 58.6, g)[0]
    e.append(form(lf((91.4, 58.6), a, 2.2, a=0.45, b=0.8, wb=2.1), '#F2EEE6'))
e.append(E(kreis(91.4, 58.6, 1.2), '#E8D9A0', rolle='detail'))
# Rosette: hinteres kleines Blatt, dann großes vorderes Blatt
e += blatt(31, 70, 7.5, 0.8, (52, 96), gross=False)
e += blatt(70, 76, 7.0, 0.8, (56, 96), gross=False)
e += blatt(52, 50, 14.0, 0.88, (54, 96), gross=True)

speichern('sonnentau', e, quellen=quellen_aus_notiz('sonnentau'))

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

# ---------- Märzenbecher (Leucojum vernum) ----------
W, W_D, W_H = '#F4F2EA', '#C3C9BE', '#FFFFFF'
GR, GR_D, GR_H = '#4F7A34', '#2F5220', '#79A250'
FLECK = '#CFC236'
e = hg_licht()
# riemenförmige, stumpfe Grundblätter
for p0, p1, w, bg in [((40, 104), (24, 52), 3.6, -4), ((50, 104), (46, 60), 3.2, 3), ((80, 104), (98, 60), 3.8, 5)]:
    e.append(form(lf(p0, p1, w, a=0.15, b=0.92, wb=w*0.9, bieg=bg), GR))
    e.append(E(halb(p0, p1, w, a=0.15, b=0.92, wb=w*0.9, bieg=bg, seite=1 if p1[0] < p0[0] else -1), GR_D, o=0.55, rolle='schatten'))
    e.append(E(achse(p0, p1, 0.1, 0.85, bg), s=GR_H, sw=0.8, o=0.7, rolle='detail'))
# Stängel (flach, aufrecht), oben die Spatha
e.append(stiel([(68, 104), (70, 70), (67, 34)], 1.7, '#5E8A3A'))
e.append(form(lf((67.5, 40), (73, 21), 2.8, a=0.3, b=0.7, wb=2.0, bieg=1.5), '#86AA5A'))
e.append(E(achse((67.5, 40), (73, 21), 0.1, 0.85, 1.5), s=GR_D, sw=0.7, o=0.7, rolle='detail'))
# gebogener Blütenstiel nach links unten
e.append(form('M67.4 35 C64 27.5 58 25.5 54.5 30 L56.4 31.4 C59 28.5 63.4 29.6 65.8 37 Z', '#5E8A3A'))
# grüner, rundlicher Fruchtknoten
e.append(form(dreh([(0,0)],0,0,0) and lf((55.5, 29.5), (50.5, 43.5), 5.6, a=0.15, b=0.85, wb=5.0), '#6A9440'))
e.append(E(oval(50.8, 35.4, 1.6, 3.0), '#A5C46E', o=0.8, rolle='licht'))

# nickende Glocke aus 6 gleich langen Hüllblättern
T = (51.5, 43.5); R = 20.0; UNTEN = 77.0; EL = 4.5; NEIG = -10
def kippe(p): return dreh([(p[0]-T[0], p[1]-T[1])], T[0], T[1], NEIG)[0]
blaetter = []
for phi in (30, 90, 150, 210, 270, 330):
    a = math.radians(phi); sx, cz = math.sin(a), math.cos(a)
    tip = kippe((T[0] + R*sx, UNTEN + EL*cz))
    base = kippe((T[0] + sx*3.2, T[1] + 1.5))
    w = 12.5*(0.3 + 0.7*abs(cz))
    blaetter.append((cz, phi, base, tip, w, sx))
blaetter.sort()
for cz, phi, base, tip, w, sx in blaetter:
    hinten = cz < 0
    bg = sx*3.2
    f = '#DCDDD2' if hinten else W
    e.append(form(lf(base, tip, w, a=0.35, b=0.84, wb=w*1.0, bieg=bg), f))
    # Schatten unten rechts bzw. Licht oben links
    if not hinten:
        e.append(E(halb(base, tip, w, a=0.35, b=0.84, wb=w*1.0, bieg=bg, seite=1), W_D, o=0.5, rolle='schatten'))
        e.append(E(halb(base, tip, w*0.6, a=0.3, b=0.6, wb=w*0.4, bieg=bg, seite=-1), W_H, o=0.85, rolle='licht'))
    # grün-gelber Fleck kurz vor der Spitze
    fx, fy = punkt(base, tip, 0.9, 0, bg)
    e.append(E(oval(fx, fy, max(1.2, w*0.3), 1.9), FLECK, s=GR_D, sw=0.5, o=0.95, rolle='detail'))
    # feine Adern
    for s in (-w*0.4, 0, w*0.4):
        p0 = punkt(base, tip, 0.15, s*0.4, bg); p1 = punkt(base, tip, 0.72, s, bg)
        e.append(E(f'M{p0[0]} {p0[1]} L{p1[0]} {p1[1]}', s='#B9BFB2', sw=0.55, o=0.7, rolle='detail'))
# kleine Spitzchen über dem Fleck: Griffel und Staubbeutel im Glockeninneren (orange)

speichern('maerzenbecher', e, quellen=quellen_aus_notiz('maerzenbecher'))

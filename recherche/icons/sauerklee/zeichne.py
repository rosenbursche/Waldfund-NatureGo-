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

# ---------- Wald-Sauerklee (Oxalis acetosella) ----------
BL, BL_D, BL_H = '#6E9A3E', '#436B27', '#94B85A'
KR, KR_D, KR_H = '#F5F1F2', '#D3C8D3', '#FFFFFF'
ADER = '#9A7CB6'
STIEL = '#8A7A4E'
def blaettchen(cx, cy, L, W, grad):
    """verkehrt-herzförmiges Blättchen, Kerbe außen"""
    def P(x, y): return dreh([(x, y)], cx, cy, grad)[0]
    pts = [P(0, 0), P(0.3*W, -0.12*L), P(1.05*W, -0.45*L), P(0.98*W, -0.8*L),
           P(0.92*W, -1.02*L), P(0.32*W, -1.06*L), P(0, -0.84*L),
           P(-0.32*W, -1.06*L), P(-0.92*W, -1.02*L), P(-0.98*W, -0.8*L),
           P(-1.05*W, -0.45*L), P(-0.3*W, -0.12*L), P(0, 0)]
    d = bez(pts[0], pts[1:])
    hl = [P(0, 0), P(-0.3*W, -0.12*L), P(-1.05*W, -0.45*L), P(-0.98*W, -0.8*L), P(-0.92*W, -1.02*L), P(-0.32*W, -1.06*L), P(0, -0.84*L), P(0, -0.5*L), P(0, -0.2*L), P(0, 0)]
    sh = [P(0, 0), P(0.3*W, -0.12*L), P(1.05*W, -0.45*L), P(0.98*W, -0.8*L), P(0.92*W, -1.02*L), P(0.32*W, -1.06*L), P(0, -0.84*L), P(0, -0.5*L), P(0, -0.2*L), P(0, 0)]
    a, b = P(0, -0.05*L), P(0, -0.82*L)
    adern = ''
    for t in (0.3, 0.5, 0.68):
        for sg in (-1, 1):
            p0 = P(0, -t*L); p1 = P(sg*0.75*W, -(t+0.12)*L)
            adern += f' M{p0[0]} {p0[1]} L{p1[0]} {p1[1]}'
    rechts_dunkel = math.cos(math.radians(grad)) + math.sin(math.radians(grad)) > 0
    dunkel, hell = (sh, hl) if rechts_dunkel else (hl, sh)
    return [form(d, BL),
            E(bez(dunkel[0], dunkel[1:]), BL_D, o=0.55, rolle='schatten'),
            E(bez(hell[0], hell[1:]), BL_H, o=0.45, rolle='licht'),
            E(f'M{a[0]} {a[1]} L{b[0]} {b[1]}', s=BL_D, sw=0.9, o=0.85, rolle='detail'),
            E(adern, s=BL_D, sw=0.5, o=0.5, rolle='detail')]
def kleeblatt(cx, cy, L, W, grad0):
    t = []
    for g in (grad0 - 120, grad0 + 120, grad0):
        t += blaettchen(cx, cy, L, W, g)
    t.append(E(kreis(cx, cy, 1.4), BL_D, rolle='detail'))
    return t

e = hg_boden()
# Blatt- und Blütenstiele (dünn, rötlich-grün)
e.append(form('M42 104 C41 94 41.5 84 43.8 76 L45.6 76.4 C43.6 84 43.4 94 44.2 104 Z', STIEL))
e.append(form('M86 104 C86 98 86.5 92 88 86 L89.6 86.4 C88.4 92 88 98 88.2 104 Z', STIEL))
e.append(form('M62 104 C63 90 66 72 72 58 L74 58.8 C68.4 72 65.4 90 64.4 104 Z', STIEL))
# kleines Kleeblatt rechts hinten, großes vorne links
e += kleeblatt(88.5, 86, 11, 6.6, 10)
e += kleeblatt(44.5, 76, 19, 11.5, -8)

# Blüte: 5 weiße, violett geaderte Kronblätter
FX, FY, FR = 72, 40, 18
for i in range(5):
    g = 15 + i*72
    def P(x, y): return dreh([(x, y)], FX, FY, g)[0]
    pts = [P(0, 0), P(0.28*FR, -0.2*FR), P(0.62*FR, -0.75*FR), P(0.4*FR, -0.98*FR),
           P(0.18*FR, -1.08*FR), P(0.04*FR, -1.0*FR), P(0, -0.97*FR),
           P(-0.04*FR, -1.0*FR), P(-0.18*FR, -1.08*FR), P(-0.4*FR, -0.98*FR),
           P(-0.62*FR, -0.75*FR), P(-0.28*FR, -0.2*FR), P(0, 0)]
    e.append(form(bez(pts[0], pts[1:]), KR))
    sh = [P(0, 0), P(0.28*FR, -0.2*FR), P(0.62*FR, -0.75*FR), P(0.4*FR, -0.98*FR), P(0.2*FR, -1.0*FR), P(0.15*FR, -0.6*FR), P(0.1*FR, -0.3*FR), P(0.06*FR, -0.2*FR), P(0.03*FR, -0.1*FR), P(0, 0)]
    if 60 < g % 360 < 240:
        e.append(E(bez(sh[0], sh[1:]), KR_D, o=0.7, rolle='schatten'))
    else:
        e.append(E(bez(sh[0], sh[1:]), '#E9DFEA', o=0.5, rolle='schatten'))
    # zart violette Adern, fächerartig
    ad = ''
    for sx in (-0.34, -0.17, 0, 0.17, 0.34):
        p0 = P(sx*0.2*FR, -0.2*FR); m = P(sx*0.8*FR, -0.55*FR); p1 = P(sx*1.1*FR, -0.86*FR)
        ad += f' M{p0[0]} {p0[1]} Q{m[0]} {m[1]} {p1[0]} {p1[1]}'
    e.append(E(ad, s=ADER, sw=0.6, o=0.9, rolle='detail'))
# Licht oben links auf der Blüte
e.append(E(oval(66, 34, 5, 3.5), KR_H, o=0.55, rolle='licht'))
# gelber Grund und 10 kurze Staubblätter
e.append(E(kreis(FX, FY, 3.8), '#E3C443', o=0.9, rolle='detail'))
for i in range(10):
    x0, y0 = dreh([(0, -1.2)], FX, FY, i*36)[0]
    x1, y1 = dreh([(0, -3.6 if i % 2 else -2.6)], FX, FY, i*36)[0]
    e.append(E(f'M{x0} {y0} L{x1} {y1}', s='#F4EED8', sw=0.7, rolle='detail'))
    e.append(E(kreis(x1, y1, 0.6), '#D9A93A', rolle='detail'))
e.append(E(kreis(FX, FY, 1.1), '#C9D58A', s=INK, sw=0.4, rolle='detail'))

speichern('sauerklee', e, quellen=quellen_aus_notiz('sauerklee'))

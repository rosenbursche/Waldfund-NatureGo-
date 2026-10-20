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

# ---------- Arnika (Arnica montana) ----------
ZU, ZU_D, ZU_H = '#F2A81E', '#C7781A', '#F8C858'
SCH, SCH_D = '#D98A1A', '#A85F14'
BL, BL_D, BL_H = '#5C8538', '#3A5C22', '#86AE5C'
import random
random.seed(3)
CX, CY = 57, 46
STAUCH = 0.86   # Korb leicht schräg von vorn

def zunge(grad, L, w, bieg):
    """schmale Zungenblüte mit dreizähniger Spitze"""
    def P(x, y):
        # leichte Biegung entlang der Länge
        x2 = x + bieg*(y/L)**2*(-L)/L if L else x
        px, py = dreh([(x2, y)], 0, 0, grad)[0]
        return (r1(CX + px), r1(CY + py*STAUCH))
    r0 = 7.5
    pts_l = [P(-0.45*w, -r0), P(-1.0*w, -r0-0.35*L), P(-0.95*w, -r0-0.8*L), P(-0.9*w, -r0-L)]
    zaehne = [P(-0.55*w, -r0-L-1.5), P(-0.3*w, -r0-L+0.2), P(0, -r0-L-1.6), P(0.3*w, -r0-L+0.2), P(0.55*w, -r0-L-1.5)]
    pts_r = [P(0.9*w, -r0-L), P(0.95*w, -r0-0.8*L), P(1.0*w, -r0-0.35*L), P(0.45*w, -r0)]
    d = f'M{pts_l[0][0]} {pts_l[0][1]} Q{pts_l[1][0]} {pts_l[1][1]} {pts_l[2][0]} {pts_l[2][1]} L{pts_l[3][0]} {pts_l[3][1]} '
    d += ' '.join(f'L{x} {y}' for x, y in zaehne)
    d += f' L{pts_r[0][0]} {pts_r[0][1]} L{pts_r[1][0]} {pts_r[1][1]} Q{pts_r[2][0]} {pts_r[2][1]} {pts_r[3][0]} {pts_r[3][1]} Z'
    hd = f'M{P(0, -r0)[0]} {P(0, -r0)[1]} L{pts_r[3][0]} {pts_r[3][1]} Q{pts_r[2][0]} {pts_r[2][1]} {pts_r[1][0]} {pts_r[1][1]} L{pts_r[0][0]} {pts_r[0][1]} L{P(0, -r0-L)[0]} {P(0, -r0-L)[1]} Z'
    ad = ''
    for sx in (-0.45, 0.45):
        a, b = P(sx*w*0.6, -r0-1), P(sx*w, -r0-L*0.92)
        ad += f' M{a[0]} {a[1]} L{b[0]} {b[1]}'
    return d, hd, ad

e = hg_licht()
# behaarter Stängel
e.append(stiel([(60, 104), (61, 76), (58, 52)], 1.8, '#6E8A3E'))
e.append(E('M58.6 60 l-2 -1 M59.6 68 l-2 -1 M61.4 74 l2 -1 M60.6 82 l-2 -1 M61.6 90 l2 -1 M60.8 97 l-2 -1', s='#A8BC80', sw=0.5, o=0.8, rolle='detail'))
# gegenständiges Stängelblattpaar und Rosettenblätter mit parallelen Längsnerven
for p0, p1, w, bg in [((60, 84), (36, 76), 5.0, -3), ((61, 84), (84, 74), 5.0, 3),
                      ((58, 101), (28, 90), 6.5, -3), ((63, 101), (93, 90), 6.5, 3)]:
    e.append(form(lf(p0, p1, w, a=0.35, b=0.75, wb=w*0.8, bieg=bg), BL))
    e.append(E(halb(p0, p1, w, a=0.35, b=0.75, wb=w*0.8, bieg=bg, seite=1 if p1[0] < 60 else -1), BL_D, o=0.45, rolle='schatten'))
    e.append(E(halb(p0, p1, w*0.7, a=0.35, b=0.7, wb=w*0.5, bieg=bg, seite=-1 if p1[0] < 60 else 1), BL_H, o=0.35, rolle='licht'))
    ad = achse(p0, p1, 0.05, 0.92, bg)
    for s in (-0.45, 0.45):
        a = punkt(p0, p1, 0.12, s*w*0.4, bg); m = punkt(p0, p1, 0.5, s*w*1.1, bg); b = punkt(p0, p1, 0.9, s*w*0.2, bg)
        ad += f' M{a[0]} {a[1]} Q{m[0]} {m[1]} {b[0]} {b[1]}'
    e.append(E(ad, s=BL_D, sw=0.6, o=0.75, rolle='detail'))

# Zungenblüten: etwas unregelmäßig, zerzaust
n = 12
strahlen = []
for i in range(n):
    g = i*360/n + random.uniform(-8, 8)
    L = random.uniform(15.5, 20.5) * (0.92 if 60 < g < 120 else 1)
    w = random.uniform(3.3, 4.1)
    strahlen.append((g, L, w, random.uniform(-5, 5)))
for g, L, w, bg in strahlen:
    d, hd, ad = zunge(g, L, w, bg)
    e.append(form(d, ZU))
    dunkel = 60 < g % 360 < 210
    e.append(E(hd, ZU_D if dunkel else ZU_H, o=0.4 if dunkel else 0.45, rolle='schatten' if dunkel else 'licht'))
    e.append(E(ad, s=ZU_D, sw=0.55, o=0.8, rolle='detail'))
# Scheibe aus Röhrenblüten
e.append(form(oval(CX, CY, 9.0, 9.0*STAUCH), SCH))
e.append(E(oval(CX + 2.2, CY + 2.0, 6.6, 5.4), SCH_D, o=0.6, rolle='schatten'))
e.append(E(oval(CX - 2.8, CY - 2.4, 3.8, 2.8), '#EFB24A', o=0.7, rolle='licht'))
for ring, k in [(7.2, 16), (5.0, 11), (2.8, 6)]:
    for j in range(k):
        x, y = dreh([(0, -ring)], 0, 0, j*360/k + ring*13)[0]
        e.append(E(kreis(r1(CX + x), r1(CY + y*STAUCH), 0.75), '#F6C552' if (y < 0 and x < 2) else '#E09A2A', s='#8A4E12', sw=0.35, rolle='detail'))

speichern('arnika', e, quellen=quellen_aus_notiz('arnika'))

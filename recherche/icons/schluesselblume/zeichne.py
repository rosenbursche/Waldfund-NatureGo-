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

# ---------- Echte Schlüsselblume (Primula veris) ----------
BL, BL_D, BL_H = '#5D8A3A', '#3A5E22', '#86AE5C'
GE, GE_D, GE_H = '#F2C230', '#C68E1E', '#F7DB6A'
KE, KE_D, KE_H = '#C9D38A', '#97A45A', '#E2E8B4'
ORANGE = '#E07A1F'

def runzelblatt(p0, p1, W, bieg=0.0, n=34):
    """eiförmiges, gekerbt-welliges Blatt, in einen geflügelten Stiel verschmälert"""
    ux, uy = p1[0]-p0[0], p1[1]-p0[1]; L = math.hypot(ux, uy); nx, ny = -uy/L, ux/L
    def P(t, s):
        k = bieg*math.sin(math.pi*t)
        return (r1(p0[0]+ux*t+nx*(s+k)), r1(p0[1]+uy*t+ny*(s+k)))
    def h(t):
        if t < 0.3: return W*(0.12 + 0.25*t/0.3)          # geflügelter Stiel
        u = (t-0.3)/0.7
        return W*(0.37 + 0.63*math.sin(math.pi*min(1, u*0.95+0.05))**0.8) if u < 0.6 else W*math.sin(math.pi*(0.5+0.5*(u-0.6)/0.4*0.95+0.0))**0.9 * (1.0)
    rechts, links = [], []
    for i in range(n+1):
        t = i/n
        kerb = 0.7*abs(math.sin(i*math.pi/2.2)) if t > 0.3 else 0
        rechts.append(P(t, h(t)+kerb)); links.append(P(t, -h(t)-kerb))
    pts = rechts + [P(1.0, 0)] + links[::-1]
    d = f'M{pts[0][0]} {pts[0][1]} ' + ' '.join(f'L{x} {y}' for x, y in pts[1:]) + ' Z'
    halb_r = f'M{P(0,0)[0]} {P(0,0)[1]} ' + ' '.join(f'L{x} {y}' for x, y in rechts) + f' L{P(1,0)[0]} {P(1,0)[1]} Z'
    halb_l = f'M{P(0,0)[0]} {P(0,0)[1]} ' + ' '.join(f'L{x} {y}' for x, y in links) + f' L{P(1,0)[0]} {P(1,0)[1]} Z'
    # Netzadern (runzlig)
    ad = f'M{P(0.05,0)[0]} {P(0.05,0)[1]} Q{P(0.5,0)[0]} {P(0.5,0)[1]} {P(0.96,0)[0]} {P(0.96,0)[1]}'
    fein = ''
    for t in (0.4, 0.5, 0.6, 0.7, 0.8, 0.88):
        for sg in (-1, 1):
            a = P(t, 0); b = P(t+0.07, sg*h(t)*0.55); c = P(t+0.1, sg*h(t)*0.85)
            ad += f' M{a[0]} {a[1]} Q{b[0]} {b[1]} {c[0]} {c[1]}'
            q0 = P(t+0.03, sg*h(t)*0.35); q1 = P(t+0.1, sg*h(t)*0.3)
            fein += f' M{q0[0]} {q0[1]} L{q1[0]} {q1[1]}'
    return d, halb_r, halb_l, ad, fein

e = hg_licht()
# Blattrosette
for p0, p1, W, bg, dunkel in [((60, 104), (24, 70), 10.5, 3, 'l'), ((62, 104), (98, 74), 9.5, -3, 'r')]:
    d, hr, hl, ad, fein = runzelblatt(p0, p1, W, bg)
    e.append(form(d, BL))
    e.append(E(hl if dunkel == 'l' else hr, BL_D, o=0.45, rolle='schatten'))
    e.append(E(hr if dunkel == 'l' else hl, BL_H, o=0.2, rolle='licht'))
    e.append(E(ad, s=BL_D, sw=0.8, o=0.85, rolle='detail'))
    e.append(E(fein, s=BL_D, sw=0.5, o=0.6, rolle='detail'))
# blattloser Schaft
e.append(stiel([(60, 104), (59, 70), (56, 36)], 1.7, '#7C9A4A'))
e.append(E('M61 100 Q60.4 70 57.4 40', s=BL_D, sw=0.6, o=0.5, rolle='schatten'))

A = (56, 35)
def kelch(w, L):
    """aufgeblasener, kantiger Kelch vom Doldenpunkt aus in Richtung w"""
    a = A
    tip = (A[0] + L*math.cos(math.radians(w)), A[1] + L*math.sin(math.radians(w)))
    t = [form(lf(a, tip, 3.6, a=0.45, b=0.85, wb=3.6), KE)]
    t.append(E(halb(a, tip, 3.6, a=0.45, b=0.85, wb=3.6, seite=1 if math.cos(math.radians(w)) < 0.3 else -1), KE_D, o=0.55, rolle='schatten'))
    for s in (-1.8, 0, 1.8):
        p0 = punkt(a, tip, 0.25, s*0.5); p1 = punkt(a, tip, 0.95, s)
        t.append(E(f'M{p0[0]} {p0[1]} L{p1[0]} {p1[1]}', s=KE_D, sw=0.6, o=0.9, rolle='detail'))
    return t, tip
def krone_seite(w, L):
    """Krone von der Seite: kurze Röhre, ausgebreitete Zipfel (Glöckchen)"""
    t, tip = kelch(w, L)
    end = (tip[0] + 5.5*math.cos(math.radians(w)), tip[1] + 5.5*math.sin(math.radians(w)))
    base = punkt(A, tip, 0.86)
    t.append(form(lf(base, end, 2.4, a=0.3, b=1.0, wb=5.2), GE))
    t.append(E(halb(base, end, 2.4, a=0.3, b=1.0, wb=5.2, seite=-1 if math.cos(math.radians(w)) < 0.3 else 1), GE_D, o=0.5, rolle='schatten'))
    # Zipfel-Kerben am Saum
    for s in (-2.4, 0, 2.4):
        p = punkt(base, end, 0.98, s)
        t.append(E(kreis(p[0], p[1], 0.55), GE_D, rolle='detail'))
    return t
def krone_vorn(w, L, r=6.0, drehung=0):
    """Krone von vorn: 5 ausgerandete Zipfel, im Schlund 5 orange Flecken"""
    t, tip = kelch(w, L)
    cx = tip[0] + 2.5*math.cos(math.radians(w)); cy = tip[1] + 2.5*math.sin(math.radians(w))
    for i in range(5):
        g = drehung + i*72
        def P(x, y): return dreh([(x, y)], cx, cy, g)[0]
        pts = [P(0, 0), P(0.5*r, -0.25*r), P(0.75*r, -0.85*r), P(0.4*r, -1.0*r),
               P(0.2*r, -1.06*r), P(0.05*r, -0.95*r), P(0, -0.85*r),
               P(-0.05*r, -0.95*r), P(-0.2*r, -1.06*r), P(-0.4*r, -1.0*r),
               P(-0.75*r, -0.85*r), P(-0.5*r, -0.25*r), P(0, 0)]
        t.append(form(bez(pts[0], pts[1:]), GE))
    t.append(E(kreis(cx + 1.2, cy + 1.2, r*0.7), GE_D, o=0.35, rolle='schatten'))
    t.append(E(kreis(cx - 1.4, cy - 1.4, r*0.45), GE_H, o=0.55, rolle='licht'))
    for i in range(5):
        x, y = dreh([(0, -r*0.36)], cx, cy, drehung + i*72)[0]
        t.append(E(oval(x, y, 1.1, 1.1), ORANGE, rolle='detail'))
    t.append(E(kreis(cx, cy, 1.1), '#7A5A14', rolle='detail'))
    return t

# einseitig nickende Dolde: hintere Blüten zuerst
for w, L in [(-12, 15), (-168, 13), (14, 17), (165, 15)]:
    e += krone_seite(w, L)
for w, L in [(40, 19), (135, 17)]:
    e += krone_seite(w, L)
e += krone_vorn(66, 24, 7.6, 10)
e += krone_vorn(112, 23, 7.4, -20)
e += krone_vorn(-8, 23, 6.8, 30)

speichern('schluesselblume', e, quellen=quellen_aus_notiz('schluesselblume'))

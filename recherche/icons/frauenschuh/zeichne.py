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

# ---------- Gelber Frauenschuh (Cypripedium calceolus) ----------
SU, SU_D, SU_H = '#F0CF3A', '#C49A1E', '#F8E27A'
PE, PE_D, PE_H = '#7A2A1C', '#4A140F', '#B0503A'
BL, BL_D, BL_H = '#6E9A48', '#46702C', '#9CC070'

def faltblatt(p0, p1, w, bieg):
    """breit-elliptisches, längs gefaltetes Blatt mit parallelen Nerven"""
    t = [form(lf(p0, p1, w, a=0.3, b=0.78, wb=w*0.75, bieg=bieg), BL)]
    sg = 1 if p1[0] < p0[0] else -1
    t.append(E(halb(p0, p1, w, a=0.3, b=0.78, wb=w*0.75, bieg=bieg, seite=sg), BL_D, o=0.4, rolle='schatten'))
    t.append(E(halb(p0, p1, w*0.6, a=0.3, b=0.7, wb=w*0.45, bieg=bieg, seite=-sg), BL_H, o=0.35, rolle='licht'))
    ad = ''
    for s in (-0.66, -0.33, 0, 0.33, 0.66):
        a = punkt(p0, p1, 0.06, s*w*0.3, bieg); m = punkt(p0, p1, 0.45, s*w*1.05, bieg); b = punkt(p0, p1, 0.94, s*w*0.12, bieg)
        ad += f' M{a[0]} {a[1]} Q{m[0]} {m[1]} {b[0]} {b[1]}'
    t.append(E(ad, s=BL_D, sw=0.6 if s else 0.8, o=0.7, rolle='detail'))
    return t

def gedreht(p0, p1, w, bieg, windungen=1.5):
    """schmales, spiralig gedrehtes Blütenblatt: Breite pulsiert, Rückseite dunkler"""
    n = 24
    links, rechts, breiten = [], [], []
    for i in range(n+1):
        t = i/n
        b = w*(0.25 + 0.75*abs(math.cos(math.pi*windungen*t + 0.3)))*(1 - 0.75*t**1.5) + 0.25
        breiten.append(b)
        links.append(punkt(p0, p1, t, -b, bieg)); rechts.append(punkt(p0, p1, t, b, bieg))
    pts = links + rechts[::-1]
    d = f'M{pts[0][0]} {pts[0][1]} ' + ' '.join(f'L{x} {y}' for x, y in pts[1:]) + ' Z'
    t_ = [form(d, PE)]
    # Abschnitte, in denen die Rückseite zu sehen ist: dunkler; Vorderseite mit Glanz
    for i in range(n):
        t = i/n
        rueck = math.cos(math.pi*windungen*t + 0.3) < 0
        q = [links[i], links[i+1], rechts[i+1], rechts[i]]
        dq = f'M{q[0][0]} {q[0][1]} L{q[1][0]} {q[1][1]} L{q[2][0]} {q[2][1]} L{q[3][0]} {q[3][1]} Z'
        if rueck:
            t_.append(E(dq, PE_D, o=0.7, rolle='schatten'))
    for i in range(0, n, 2):
        t = i/n
        if math.cos(math.pi*windungen*t + 0.3) > 0.4:
            a = punkt(p0, p1, t, -breiten[i]*0.3, bieg); b = punkt(p0, p1, t + 0.08, -breiten[i]*0.2, bieg)
            t_.append(E(f'M{a[0]} {a[1]} L{b[0]} {b[1]}', s=PE_H, sw=1.0, o=0.8, rolle='licht'))
    return t_

e = hg_wald()
# Blätter und Stängel
e += faltblatt((76, 106), (98, 46), 9.5, -3)
e += faltblatt((50, 106), (24, 74), 8.5, 3)
e.append(stiel([(64, 106), (66, 76), (62, 48)], 1.8, '#7A9A4E'))
e += faltblatt((63, 50), (82, 22), 4.0, -2)   # Hochblatt hinter der Blüte
# unteres, verwachsenes Kelchblatt (hinter dem Schuh)
e.append(form(lf((60, 58), (63, 96), 4.0, a=0.35, b=0.8, wb=2.6, bieg=-1), PE))
e.append(E(halb((60, 58), (63, 96), 4.0, a=0.35, b=0.8, wb=2.6, bieg=-1, seite=-1), PE_D, o=0.6, rolle='schatten'))
# oberes Kelchblatt: breit-lanzettlich, leicht nach vorn gebogen
S0, S1 = (59, 50), (57, 18)
e.append(form(lf(S0, S1, 8.4, a=0.4, b=0.75, wb=6.0, bieg=2), PE))
e.append(E(halb(S0, S1, 8.4, a=0.4, b=0.75, wb=6.0, bieg=2, seite=1), PE_D, o=0.6, rolle='schatten'))
e.append(E(halb(S0, S1, 5.4, a=0.4, b=0.7, wb=3.4, bieg=2, seite=-1), PE_H, o=0.55, rolle='licht'))
e.append(E(achse(S0, S1, 0.1, 0.9, 2), s=PE_D, sw=0.7, o=0.8, rolle='detail'))
# zwei seitliche, gedrehte Kronblätter
e += gedreht((55, 52), (23, 80), 4.4, -4, 1.6)
e += gedreht((65, 52), (96, 82), 4.4, 4, 1.6)
# Schuh (Lippe): aufgeblasen, gelb
e.append(form('M47.5 62 C46 54 52 52.5 60 52.5 C68 52.5 74 54 73 62 C74.5 74 70 87 60.5 87.5 C51 88 46 76 47.5 62 Z', SU))
e.append(E('M73 62 C74.5 74 70 87 60.5 87.5 C56 87.6 52.6 85 50.6 81 C57 84 66 80 68.6 70 C69.6 66 70 62 69.4 58 C71.6 58.6 73 60 73 62 Z', SU_D, o=0.75, rolle='schatten'))
e.append(E('M50.6 64 C50.6 59 53 57.6 55.4 58.6 C53.6 62 53.4 68 54.6 74 C51.6 72 50.6 68 50.6 64 Z', SU_H, o=0.9, rolle='licht'))
# Adern auf dem Schuh
e.append(E('M53 60 Q51.8 72 57 84 M58.6 59 Q57.6 72 60.6 86 M64 59 Q65.4 72 64.6 85 M68.4 60 Q70.4 70 68 80', s=SU_D, sw=0.55, o=0.45, rolle='detail'))
# Öffnung oben mit rot punktiertem Innenrand
e.append(E(oval(60.2, 56.2, 7.4, 3.0), '#9A6A14', s=INK, sw=0.8, rolle='detail'))
for x, y in [(54.6, 56.4), (56.4, 57.6), (58.6, 58.2), (61.6, 58.2), (64.2, 57.6), (65.8, 56.6)]:
    e.append(E(kreis(x, y, 0.55), '#8E2A1A', rolle='detail'))
# Staminodium: gelblich-weiß mit roten Punkten
e.append(form('M56.2 53.6 C56.2 50.6 58 49.4 60.2 49.4 C62.4 49.4 64.2 50.6 64.2 53.6 C64.2 56 62.4 57 60.2 57 C58 57 56.2 56 56.2 53.6 Z', '#F4ECC0'))
for x, y in [(58.4, 52.6), (60.4, 51.6), (62.2, 52.8), (59.4, 54.6), (61.4, 54.8)]:
    e.append(E(kreis(x, y, 0.5), '#A2301E', rolle='detail'))

speichern('frauenschuh', e, quellen=quellen_aus_notiz('frauenschuh'))

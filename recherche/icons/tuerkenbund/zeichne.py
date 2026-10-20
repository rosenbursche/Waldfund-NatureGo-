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

# ---------- Türkenbund-Lilie (Lilium martagon) ----------
PE, PE_D, PE_H = '#D88AA8', '#9E4E74', '#EDB7CC'
PUNKT = '#6A1D3C'
STG = '#5E3A34'
BL, BL_D, BL_H = '#4F7A34', '#2F5220', '#79A250'
import random
random.seed(7)
def punkte(p0, p1, w, bieg, n, t0=0.25, t1=0.85, breite=0.6):
    t = []
    for _ in range(n):
        tt = random.uniform(t0, t1); ss = random.uniform(-breite, breite)*w*math.sin(math.pi*tt)*1.2
        x, y = punkt(p0, p1, tt, ss, bieg)
        t.append(E(oval(x, y, 0.55, 0.75), PUNKT, rolle='detail'))
    return t

e = hg_wald()
# Stängel rechts (rotbraun), Blattquirl unten
e.append(stiel([(87, 106), (90, 74), (88, 42)], 1.8, STG))
for p1, bg in [((64, 99), 3), ((68, 81), -3), ((103, 80), 3), ((104, 98), -2)]:
    p0 = (88, 90)
    e.append(form(lf(p0, p1, 3.6, a=0.35, b=0.7, wb=3.0, bieg=bg), BL))
    e.append(E(halb(p0, p1, 3.6, a=0.35, b=0.7, wb=3.0, bieg=bg, seite=1 if p1[0] < 88 else -1), BL_D, o=0.5, rolle='schatten'))
    e.append(E(achse(p0, p1, 0.1, 0.85, bg), s=BL_H, sw=0.7, o=0.7, rolle='detail'))
# bogiger Blütenstiel: von rechts oben in die nickende Blüte
e.append(form('M88.6 43 C86 30 74 24 62 33 L60.4 35.6 C70 27.6 83.4 31 86.6 44 Z', STG))
# Knospe oben rechts
e.append(form('M88 43 C90 36 95 33 99 34 L99.6 35.8 C95.6 35.6 91.8 38.6 89.8 43.4 Z', STG))
e.append(form(lf((98, 35), (96, 50), 3.4, a=0.35, b=0.75, wb=3.0, bieg=-1), PE))
e.append(E(halb((98, 35), (96, 50), 3.4, a=0.35, b=0.75, wb=3.0, bieg=-1, seite=1), PE_D, o=0.6, rolle='schatten'))

C = (55, 62)
# hintere Hüllblätter (dunkler, zurückgerollt)
for tip, w, bg in [((47, 28), 8.0, 4), ((64, 28), 8.0, -4)]:
    e.append(form(lf(C, tip, w, a=0.4, b=0.8, wb=w*0.8, bieg=bg), '#B86E8E'))
    e.append(E(halb(C, tip, w, a=0.4, b=0.8, wb=w*0.8, bieg=bg, seite=1), PE_D, o=0.6, rolle='schatten'))
    e += punkte(C, tip, w, bg, 7)
# Staubblätter und Griffel hängen weit heraus
for dx, dy in [(-15, 20), (-9, 25), (-3, 27), (4, 26), (10, 24), (16, 19)]:
    x1, y1 = C[0]+dx*0.9, C[1]+dy*0.8
    e.append(E(f'M{C[0]+dx*0.15} {C[1]+2} Q{C[0]+dx*0.5} {C[1]+dy*0.4} {x1} {y1}', s='#C9C77A', sw=1.0, rolle='detail'))
    e.append(form(oval(x1, y1+1.2, 1.3, 2.6), '#6E2F1A'))
    e.append(E(oval(x1-0.4, y1+0.6, 0.4, 1.2), '#B26A3A', rolle='detail'))
e.append(E(f'M{C[0]+1} {C[1]+2} Q{C[0]+3} {C[1]+15} {C[0]+1.5} {C[1]+25}', s='#B5476A', sw=1.4, rolle='detail'))
e.append(E(kreis(C[0]+1.5, C[1]+26, 1.6), '#5A1E2E', s=INK, sw=0.5, rolle='detail'))
# seitliche Hüllblätter: stark zurückgerollte Schlaufen
for tip, w, bg, sg in [((40, 34), 8.5, -12, -1), ((71, 33), 8.5, 12, 1)]:
    e.append(form(lf(C, tip, w, a=0.4, b=0.85, wb=w*0.9, bieg=bg), PE))
    # eingerollte Spitze
    rx, ry = punkt(C, tip, 0.93, 0, bg)
    e.append(form(oval(rx - sg*0.5, ry + 3.0, 3.2, 3.4), '#B0637F'))
    # Innenseite der Rolle (dunkler)
    e.append(E(lf(punkt(C, tip, 0.35, 0, bg), tip, w*0.45, a=0.3, b=0.7, bieg=bg*0.6), PE_D, o=0.75, rolle='schatten'))
    e.append(E(halb(C, tip, w, a=0.4, b=0.82, wb=w*0.85, bieg=bg, seite=1 if sg < 0 else -1), PE_H, o=0.5, rolle='licht'))
    e += punkte(C, tip, w, bg, 10, 0.15, 0.6)
# zweites vorderes Hüllblatt, etwas seitlich
F0, F1 = (C[0]+1, C[1]+1), (51, 25)
G1 = (63, 30)
e.append(form(lf(F0, G1, 7.0, a=0.35, b=0.82, wb=6.0, bieg=-3), '#CF7E9E'))
e.append(E(halb(F0, G1, 7.0, a=0.35, b=0.82, wb=6.0, bieg=-3, seite=1), PE_D, o=0.55, rolle='schatten'))
e += punkte(F0, G1, 7.0, -3, 12, 0.15, 0.8)
# vorderes Hüllblatt: breiter, aufgebogener Lappen mit Mittelfurche
F0, F1 = (C[0]+1, C[1]+1), (51, 25)
e.append(form(lf(F0, F1, 8.0, a=0.35, b=0.82, wb=6.6, bieg=-2), PE))
e.append(E(halb(F0, F1, 8.0, a=0.35, b=0.82, wb=6.6, bieg=-2, seite=1), PE_D, o=0.45, rolle='schatten'))
e.append(E(halb(F0, F1, 6.0, a=0.3, b=0.7, wb=4.5, bieg=-2, seite=-1), PE_H, o=0.6, rolle='licht'))
e.append(E(achse(F0, F1, 0.05, 0.9, -2), s=PE_D, sw=0.8, o=0.7, rolle='detail'))
e += punkte(F0, F1, 8.0, -2, 20, 0.1, 0.85, 0.7)
# erneut das vordere Blatt obenauf (Überlappung links vorn)
speichern('tuerkenbund', e, quellen=quellen_aus_notiz('tuerkenbund'))

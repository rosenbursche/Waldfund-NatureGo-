# Braunbrustigel – Kopfporträt 3/4, Blick nach links: Stachelkleid bis über die Stirn, spitze Schnauze,
# schwarze Knopfaugen und Nase, kleine runde Ohren, braunes Gesicht und braune Brust
import sys, math, random; sys.path.insert(0, 'scripts')
from icon_helfer import *

STACHEL, STACHEL_D, STACHEL_H = '#5E4D3B', '#2E241A', '#DCD0B6'
GESICHT, GESICHT_D, GESICHT_H = '#8C6C50', '#55402D', '#B89A78'
random.seed(7)

# Stachelkleid: Zackenrand auf einem Bogen von der Stirn über den Rücken
cx, cy, R = 77, 74, 38
rand = []
n = 58
for i in range(n + 1):
    t = math.radians(192 + i * (196 / n))
    r = R + (3.2 if i % 2 else 0) + random.uniform(-0.6, 0.6)
    rand.append((round(cx + r * math.cos(t), 1), round(cy + r * math.sin(t), 1)))
# Unterkante: Nacken hinab, dann Stirnlinie (kleine Zacken) zurück nach vorn
unten = [(108, 116), (80, 116), (76, 100), (72, 86), (68, 76), (64, 68), (61, 67.5), (58, 65.4), (55, 66.4), (52, 64.2), (49, 65.4), (46, 63.2), (43, 64.8), (40.5, 64.6)]
stacheln_d = 'M' + ' L'.join(f'{x} {y}' for x, y in rand + unten) + ' Z'

poly = rand + unten
def innen(x, y):
    """Punkt-in-Polygon (Strahlverfahren)"""
    drin = False
    for i in range(len(poly)):
        (x1, y1), (x2, y2) = poly[i], poly[i - 1]
        if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1):
            drin = not drin
    return drin

def strichfeld(anzahl, laenge, farbe, sw, o, versatz=0.0):
    """viele kurze, nach hinten anliegende Stacheln, nur innerhalb des Stachelkleids"""
    d = ''; k = 0
    while k < anzahl:
        t = math.radians(random.uniform(200, 385))
        r = random.uniform(4, R + 1)
        x, y = cx + r * math.cos(t), cy + r * math.sin(t)
        w = t + math.radians(35)  # Stacheln liegen nach hinten an
        x1, y1 = x + versatz * math.cos(w), y + versatz * math.sin(w)
        x2, y2 = x + laenge * math.cos(w), y + laenge * math.sin(w)
        if not (innen(x, y) and innen(x2, y2) and innen(x + (laenge+1.5) * math.cos(w), y + (laenge+1.5) * math.sin(w))):
            continue
        d += f'M{round(x1,1)} {round(y1,1)} L{round(x2,1)} {round(y2,1)} '
        k += 1
    return E(d.strip(), s=farbe, sw=sw, o=o, rolle='detail')

ebenen = hg_wald() + [
    # Gesicht, Schnauze und Brust
    form('M47 58 C42 63 36 69 31 73 C28.6 74.6 26.8 75.8 26.4 77.4 C26.2 79 28 80.2 31.4 80.4 C35 80.8 38 82 42.6 84.6 C45 92 45.6 100 45 116 L78 116 C77 104 75 92 71 84 C69 74 63 62 55 56 Z', GESICHT),
    E('M42.6 84.6 C45 92 45.6 100 45 116 L56 116 C56 104 54 94 50 88 C48 86 45.6 85 42.6 84.6 Z', GESICHT_D, o=0.6, rolle='schatten'),
    E('M71 84 C75 92 77 104 78 116 L66 116 C67 104 67 94 65 86 Z', GESICHT_D, o=0.8, rolle='schatten'),
    E('M42 69.6 C38 71.6 34 74 30.5 76 C35 75.6 39.5 74.2 43.5 72.4 Z', GESICHT_H, o=0.85, rolle='licht'),
    # Stachelkleid
    form(stacheln_d, STACHEL),
    E('M116 74 C116 92 112 104 106 116 L88 116 C96 100 102 86 110 64 Z', STACHEL_D, o=0.75, rolle='schatten'),
    E('M48 54 C54 44 64 37.5 74 36 C66 40 59 46 54 54 Z', STACHEL_H, o=0.45, rolle='licht'),
    strichfeld(200, 4.5, STACHEL_D, 1.0, 0.9),
    strichfeld(170, 3.6, STACHEL_H, 0.8, 0.85, versatz=1.8),
    # kleines rundes Ohr am Stachelrand
    form('M60 67 C59 62.5 61.5 59.8 64.6 60.2 C67.4 60.8 68.2 64 66.6 67.6 C64.6 68.8 62 68.6 60 67 Z', GESICHT),
    E('M61.6 65.6 C61.4 63 63 61.8 64.6 62.2 C65.8 62.8 66 64.6 65.2 66.2 Z', '#C9A487', o=0.7, rolle='licht'),
    # dunkle Maske um das Auge (Braunbrustigel)
    E('M39.5 68 C43 65.4 48.5 65 52.5 67 C50.5 71.6 45 73.6 40 72.8 C38.8 71.4 38.8 69.6 39.5 68 Z', GESICHT_D, o=0.75, rolle='detail'),
    # schwarze Knopfnase mit Glanz
    E('M24.6 77.6 C24.4 75.6 26.2 74.4 28.2 74.9 C29.3 76.4 29.1 78.6 27.6 79.7 C26.1 79.5 24.8 78.8 24.6 77.6 Z', '#120D0A', rolle='detail'),
    E(oval(26.2, 75.9, 0.75, 0.45), '#F2EEE4', o=0.7, rolle='detail'),
    # Knopfauge mit Glanzlicht
    E(oval(46.4, 69.2, 2.7, 2.5), '#0B0806', rolle='detail'),
    E(kreis(45.5, 68.3, 0.9), '#FFFFFF', o=0.95, rolle='detail'),
    # Maul, Schnurrhaare, Fellstriche an Brust
    E('M29.6 80.4 C32.6 81.2 35.6 81.6 38 81.2', s='#2E2219', sw=0.8, o=0.7, rolle='detail'),
    E('M31 76 q-5 -2 -9 -1 M32 77.5 q-5 1 -8 4', s='#E8DCC6', sw=0.45, o=0.6, rolle='detail'),
    E('M52 92 q2 4 1 8 M60 88 q2 5 1.5 9 M48 100 q1.5 4 0.5 8 M64 100 q1 4 0.5 8', s=GESICHT_D, sw=0.9, o=0.6, rolle='detail'),
]

speichern('igel', ebenen, quellen=[
    {'titel': 'European hedgehog (Erinaceus europaeus) (Gaudete, CC BY-SA 2.5)', 'url': 'https://commons.wikimedia.org/wiki/File:European_hedgehog_(Erinaceus_europaeus).jpg'},
    {'titel': 'Erinaceus europaeus LC0119 (Jörg Hempel, CC BY-SA 2.0 de)', 'url': 'https://commons.wikimedia.org/wiki/File:Erinaceus_europaeus_LC0119.jpg'},
])

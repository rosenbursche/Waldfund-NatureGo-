"""Igel-Stachelbart-Icon: weißer, kompakter Polster mit langen, herabhängenden Stacheln an einem Buchenstamm.
Hinweis: H. erinaceus ist unverzweigt (Polster/Knolle); korallig verzweigt ist der Ästige Stachelbart (H. coralloides)."""
import math, random, sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

W, W_D, W_H, STACHEL = '#F2EEE2', '#C8BFA8', '#FFFDF6', '#B8AE96'
BUCHE, BUCHE_H, BUCHE_D = '#8A8C86', '#A9ABA3', '#5E605C'
random.seed(5)

def spitze(x):
    """Stachelspitzen folgen einem gerundeten Bart (Mitte am längsten)"""
    return 60 + 30 * max(0.0, 1 - ((x - 54) / 29) ** 2) ** 0.5

# Umriss: gewölbter Polster, unten Fransen aus einzelnen Stachelspitzen
d = 'M26 60 C24 45 34 32.5 50 31 C63 30 75 34 81.5 42 L83 54'
tips, kerben = [], []
x = 81.5
while x > 26:
    yt = spitze(x) + random.uniform(-1.5, 1.5)
    yk = yt - random.uniform(7.5, 10.5)
    tips.append((x, yt)); kerben.append((x - 1.7, yk))
    d += f' L{round(x+1.2,1)} {round(yk+2,1)} L{round(x,1)} {round(yt,1)} L{round(x-1.2,1)} {round(yk+2,1)} L{round(x-1.7,1)} {round(yk,1)}'
    x -= 3.4
d += ' L25.5 62 Z'

stacheln, fugen, stacheln_h = '', '', ''
for (x, yt) in tips:
    y0 = 52 - 6 * math.sin(math.pi * (x - 25) / 58) + random.uniform(0, 7)
    if x < 33: y0 = max(y0, 60)
    pfad = f' M{round(x+0.4,1)} {round(y0,1)} Q{round(x+0.6,1)} {round((y0+yt)/2,1)} {round(x,1)} {round(yt-1.5,1)}'
    if x < 40: stacheln_h += pfad
    else: stacheln += pfad
for (x, yk) in kerben:
    y0 = max(yk - 18 + random.uniform(-3, 3), 50)
    fugen += f' M{round(x+0.3,1)} {round(y0,1)} Q{round(x+0.4,1)} {round((y0+yk)/2,1)} {round(x,1)} {round(yk,1)}'
# zweite, kürzere Stachelreihe (vorn, versetzt) für den zottigen Eindruck
reihe2 = ''
for (x, yt) in tips[1:-1]:
    xx = x + 1.7; yy = (yt + spitze(xx)) / 2 - random.uniform(8, 12)
    if 31 < xx < 80:
        reihe2 += f' M{round(xx-1.3,1)} {round(yy-9,1)} L{round(xx,1)} {round(yy,1)} L{round(xx+1.3,1)} {round(yy-9,1)}'

ebenen = [
    # Hintergrund: dämmriger Wald, Buchenstamm rechts (ohne Kontur)
    E(kreis(60, 60, 41), '#16261B', rolle='detail'),
    E(kreis(36, 38, 18), '#2C4A30', o=0.5, rolle='detail'),
    E(kreis(30, 74, 9), '#3F5E2E', o=0.3, rolle='detail'),
    E('M74 18 C76 45 75 75 72 102 L102 102 L102 18 Z', BUCHE, rolle='detail'),
    E('M74 18 C76 45 75 75 72 102 L79 102 C81 75 82 45 80 18 Z', BUCHE_H, o=0.8, rolle='detail'),
    E('M92 18 L102 18 L102 102 L90 102 C93 75 94 45 92 18 Z', BUCHE_D, o=0.7, rolle='detail'),
    E('M84 30 h5 M86 58 h6 M83 88 h5 M90 74 h4', s=BUCHE_D, sw=1.1, o=0.7, rolle='detail'),
    E('M75 92 C80 88 86 90 90 94 L90 102 L73 102 Z', '#4E6B32', o=0.8, rolle='detail'),
    E('M19 94 Q40 88 72 94 L72 102 L19 102 Z', '#22381F', rolle='detail'),
    # Wundstelle am Stamm, aus der der Pilz wächst
    E(oval(80, 50, 4.5, 9), '#4A3A2C', o=0.8, rolle='detail'),
    # Fruchtkörper
    form(d, W),
    E('M70 36 C78 40 82 46 82.5 54 L82 66 C76 62 70 56 66 50 C68 45 69 40 70 36 Z', W_D, o=0.6, rolle='schatten'),
    E('M83 54 L83 62 C80 74 72 84 62 90 C68 80 72 70 71 58 C75 55 80 54 83 54 Z', W_D, o=0.55, rolle='schatten'),
    E(fugen.strip(), s='#9E9480', sw=1.2, o=0.65, rolle='schatten'),
    E('M31 48 C33 39 41 34 51 33.5 C44 37 38.5 41.5 35.5 50 Z', W_H, rolle='licht'),
    E(stacheln_h.strip(), s=W_H, sw=1.1, rolle='licht'),
    E(reihe2.strip(), s='#A89E86', sw=0.8, o=0.6, rolle='detail'),
    E(stacheln.strip(), s=W_H, sw=1.0, o=0.9, rolle='licht'),
    # kurze Stachelansätze auf der Oberseite
    E('M40 38.5 l0.6 2 M47 36 l0.4 2 M55 35 l0.2 2 M63 36 l0 2 M71 39 l-0.3 2 M35 44.5 l0.8 2 M44 42.5 l0.5 2 M52 41.5 l0.3 2 M60 42 l0 2 M68 44.5 l-0.2 2 M76 45 l-0.3 2', s=W_D, sw=0.8, o=0.8, rolle='detail'),
]
quellen = [
    {'titel': 'Referenzfoto 2006-11-03 Hericium erinaceus crop.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:2006-11-03_Hericium_erinaceus_crop.jpg'},
    {'titel': 'Referenzfoto 2012-10-03 Hericium erinaceus (Bull.) Pers 268392.jpg', 'url': 'https://commons.wikimedia.org/wiki/File:2012-10-03_Hericium_erinaceus_(Bull.)_Pers_268392.jpg'},
]
speichern('stachelbart', ebenen, quellen)

# Eichhörnchen (rote Form) – Kopfporträt 3/4, Blick nach links, buschiger Schwanz hinter dem Kopf, Pinselohren
import sys, math; sys.path.insert(0, 'scripts')
from icon_helfer import *

FELL, FELL_D, FELL_H = '#B4542A', '#77341A', '#D9874F'
SCHW, SCHW_D, SCHW_H = '#A84E28', '#6E3018', '#CB7A46'
WEISS, WEISS_D = '#F1ECE2', '#CFC5B5'
PINSEL = '#5A2C17'

def fluff(pts, tiefe=2.2):
    """geschlossene Kontur mit kleinen Fell-Bögen zwischen den Punkten (buschiger Rand)"""
    d = f'M{pts[0][0]} {pts[0][1]}'
    n = len(pts)
    for i in range(n):
        x1, y1 = pts[i]; x2, y2 = pts[(i + 1) % n]
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        dx, dy = x2 - x1, y2 - y1; l = math.hypot(dx, dy) or 1
        # Normale nach außen (Punkte im Uhrzeigersinn)
        nx, ny = -dy / l, dx / l
        d += f' Q{round(mx - nx*tiefe, 1)} {round(my - ny*tiefe, 1)} {x2} {y2}'
    return d + ' Z'

# Schwanz: großer, buschiger Bogen von unten rechts nach oben, Spitze hinter dem Kopf
schwanz = [(66, 106), (80, 105), (91, 100), (98, 91), (102, 80), (103, 68), (101, 56), (97, 46), (91, 38), (84, 32), (76, 29), (68, 29.5), (61, 33), (58, 39),
           (60, 44), (60, 56), (60, 72), (60, 90)]
ebenen = hg_wald() + [
    form(fluff(schwanz, 3.0), SCHW),
    E('M103 68 C103 82 98 95 87 103 L80 106 L94 106 C102 98 106 84 105 70 Z M86 46 C92 56 93 72 88 86 C84 95 78 101 72 104 L82 104 C90 98 96 88 97 74 C98 62 94 52 86 46 Z', SCHW_D, o=0.75, rolle='schatten'),
    E('M62 34 C68 30 77 29.5 85 33.5 C91 37 96 43 99 50 C93 44 86 38 78 35.5 C72 34 66 34.5 62 36.5 Z', SCHW_H, o=0.85, rolle='licht'),
    E('M93 46 q5 8 6 18 M88 50 q4 9 3 20 M97 76 q-1 9 -6 15 M90 84 q-2 7 -7 12 M70 33 q8 0 14 5 M76 40 q5 3 8 9', s=SCHW_D, sw=0.8, o=0.6, rolle='detail'),
    # Ohren mit langen dunklen Pinseln
    form('M45 50 C42.5 45 41.5 40 42.5 33.5 C47 35.5 50.5 40.5 52.5 47 Z', FELL),
    form('M57 46.5 C58 41 60.5 36.5 64 33 C66 38 65.5 43.5 63 49 Z', FELL),
    form('M42.5 33.5 C40.5 30.5 39.8 27 41 23.5 C41.8 26.5 43 27.6 43.2 29.4 C44.4 27 45.2 25 45.4 23 C47.4 27 47.4 31.6 45.6 35.6 Z', PINSEL),
    form('M64 33 C64.4 29.6 66 26.4 68.4 24.2 C68 27 68.4 28.4 67.8 30.2 C69.4 28.8 71 27 71.8 25.4 C72.2 29.4 70 33.6 65.6 36.6 Z', PINSEL),
    E('M45.6 48 C44 44.5 43.4 41 44 37 C46.8 39 49 42.5 50.2 46 Z', '#D9B9A0', o=0.7, rolle='licht'),
    # Kopf (rund, kurze Schnauze), Hals, Brust
    form('M51 44 C44 44 39 48 36.5 53 C34.5 56 31.5 57.8 30 60.4 C28.8 63 30 66 33 67.2 C35.5 68.2 38 69.4 40 71 C38.5 78 38 86 39 92 C40 98 41 102 42 106 L72 106 C73 98 72 90 70 84 C68 79 66.5 75 66 71 C68 66 68.6 60 66.6 54.6 C64.4 48.4 58.6 44 51 44 Z', FELL),
    # weiße Kehle und Brust
    E('M40 71 C43 73 47 73.6 51 73 C55 76.5 58 84 58 94 C58 99 57.5 103 57 106 L42 106 C41 102 40 98 39 92 C38 86 38.5 78 40 71 Z', WEISS, s=INK, sw=0.9, rolle='detail'),
    E('M57 106 C57.5 103 58 99 58 94 C58 86 56 79 52 74.8 C57 77 61 85 61.5 94 C61.6 99 61 103 60.5 106 Z', WEISS_D, o=0.8, rolle='schatten'),
    # Schatten am Nacken, Licht auf Stirn
    E('M72 106 C73 98 72 90 70 84 C68 79 66.5 75 66 71 C68 66 68.6 60 66.6 54.6 C66 64 64 74 64.5 86 C65 94 66 100 66 106 Z', FELL_D, o=0.85, rolle='schatten'),
    E('M51 45.6 C45.5 45.8 41.5 48.5 39 52.5 C43.5 50 48 49 53.5 49.4 C54.5 47.6 53.2 46.2 51 45.6 Z', FELL_H, o=0.9, rolle='licht'),
    E('M36.4 55 C34 57 31.6 58.6 30.6 60.4 C33.6 60.4 36.4 59.6 38.6 58 Z', FELL_H, o=0.7, rolle='licht'),
    # helle Lippe
    E('M30.8 64.4 C32.6 66.4 35.6 67.6 39 68.6 C38.2 66.4 35.4 65.2 32.6 64.4 Z', '#E3C6A6', o=0.85, rolle='licht'),
    # Nase
    E('M28.9 61.4 C28.9 59.9 30.4 59.2 31.7 59.7 C32.3 61 31.9 62.6 30.8 63.2 C29.8 62.9 29.1 62.3 28.9 61.4 Z', '#3A2018', rolle='detail'),
    E(oval(30.1, 60.4, 0.6, 0.4), '#F2EEE4', o=0.6, rolle='detail'),
    # großes dunkles Auge mit hellem Augenring und Glanzlicht
    E(oval(47.5, 57.5, 4.4, 4.2), '#E8C9A8', o=0.8, rolle='detail'),
    E(oval(47.5, 57.5, 3.5, 3.4), '#100A07', rolle='detail'),
    E(kreis(46.2, 56.2, 1.1), '#FFFFFF', o=0.95, rolle='detail'),
    # Schnurrhaare und Fellstriche
    E('M32 64 q-6 0 -10 3 M33 65 q-5 2 -8 6 M32 63 q-5 -2 -10 -1', s='#2A1A12', sw=0.5, o=0.6, rolle='detail'),
    E('M66 80 q2 4 1 9 M68 92 q1.5 4 0.5 8 M62 60 q2 3 1.5 6', s=FELL_D, sw=0.9, o=0.6, rolle='detail'),
]

speichern('eichhoernchen', ebenen, quellen=[
    {'titel': 'Portrait of a red (hedera.baltica, Wrocław, CC BY-SA 2.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Portrait_of_a_red_(48101667728).jpg'},
    {'titel': 'Squirrel Portrait (Peter Trimming, CC BY 2.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Squirrel_Portrait_(6822916987).jpg'},
    {'titel': 'Red Squirrel Portrait (caroline legg, CC BY 2.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Red_Squirrel_Portrait_(52079828172).jpg'},
])

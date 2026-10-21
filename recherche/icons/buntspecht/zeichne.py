"""Buntspecht (Männchen) – Kopf-und-Brust-Porträt, Blick nach links. Aufruf: python3 recherche/icons/buntspecht/zeichne.py"""
import sys
sys.path.insert(0, 'scripts')
from icon_helfer import *


def hg_laub():
    # heller Himmel mit Laub (weich, ohne Kontur) – gemeinsam für die Vogel-Icons
    return [E(kreis(60, 60, 41), '#2F4838', rolle='detail'),
            E(kreis(40, 38, 24), '#6F9278', o=0.5, rolle='detail'),
            E(kreis(34, 32, 11), '#C3D4C6', o=0.35, rolle='detail'),
            E(kreis(90, 40, 16), '#5F8462', o=0.5, rolle='detail'),
            E(kreis(26, 76, 12), '#43663F', o=0.4, rolle='detail'),
            E(kreis(92, 82, 10), '#3B5A39', o=0.35, rolle='detail')]


SCHWARZ, SCHWARZ_H = '#1C1C20', '#41434C'
WEISS, WEISS_D, WEISS_H = '#ECE7DD', '#BDB6A6', '#FAF8F2'
ROT, ROT_H = '#C2302A', '#E25A4A'

KOERPER = ('M45 44 C46 35.5 52.5 30 60.5 29.5 C69 29 76 33.5 79 40.5 C82 47 87 53 92 59 '
           'C98 67 100.5 84 100.5 106 L37 106 C34 95 35 83 39.5 73 C42.5 66 45 61 45.3 56 '
           'C45.5 52 45 49.5 45.5 47.5 Z')
# Schwarz: Scheitel, Querbalken hinter der Wange, Bartstreif, Halsseite und Rücken in einem Stück
SCHWARZ_FLAECHE = ('M49.5 36.5 C53 31.5 57.5 29.6 61.5 29.6 C69.5 29.6 76.3 34 79 40.5 '
                   'C82 47 87 53 92 59 C98 67 100.5 84 100.5 106 L86 106 C86 90 82 76 75 66.5 '
                   'C72 67.5 69 68.8 65.5 70 C67 66.5 68.6 62.5 69 59 C62 57.5 53 55.5 46 53.2 '
                   'L46 49.6 C53 50.6 61 51.6 67.6 52.4 C70 52.6 71.2 51 71.2 48 '
                   'C71.2 45 70.8 42.4 69.8 40.4 C63.5 38.6 56.5 37.6 49.5 36.5 Z')
NACKEN_ROT = 'M72.6 41.4 C75.4 39 79 38.8 80.4 40.6 C82 44 83.2 47.6 84.4 51 C80.6 52 76 51 73.6 48.4 C72.4 46.2 72.2 43.6 72.6 41.4 Z'
SCHULTER = 'M80.5 66.5 C85 64.5 89.5 66 91.5 70.5 C90 77.5 86.5 83.5 82.5 88 C80.2 82 79.4 74 80.5 66.5 Z'
SCHNABEL = 'M46.4 41.6 C40 42.6 32 44.2 24 46 C32 47.2 40 48.4 46.7 49.6 Z'

specht = hg_laub() + [
    form(KOERPER, WEISS),
    # Schatten auf der hellen Brust (unten rechts) und Licht oben links
    E('M66 70 C72 74 76 82 78 92 C79 97 79 102 78.5 106 L60 106 C64 96 66 86 66 78 Z', WEISS_D, o=0.6, rolle='schatten'),
    E('M42 72 C44.5 67 47 68 48 72 C46.5 80 44 88 42.5 97 C40 90 39.5 80 42 72 Z', WEISS_H, o=0.9, rolle='licht'),
    E('M47 52 C52 55 58 57 64 58.5 C58 59.6 52 59 47.5 57 Z', WEISS_D, o=0.4, rolle='schatten'),
    # schwarze Zeichnung
    form(SCHWARZ_FLAECHE, SCHWARZ),
    E('M52 34.6 C55.5 31.6 59 30.8 62.5 30.8 C68.5 30.8 73 33 75.6 36.4 C69.6 34.6 62.6 34.2 56.5 35.2 C54.6 35.4 53.2 35.2 52 34.6 Z', SCHWARZ_H, o=0.9, rolle='licht'),
    E('M50 51 C55 51.8 61 52.4 66 52.9', s=SCHWARZ_H, sw=0.8, o=0.8, rolle='licht'),
    # weißer Schulterfleck und Flügel mit weißen Punktreihen
    form(SCHULTER, WEISS),
    E('M84 80 C86.5 76 89 73 91 70.5 C90 77.5 86.5 83.5 82.5 88 C82.6 85 83 82.5 84 80 Z', WEISS_D, o=0.7, rolle='schatten'),
    E(' '.join(f'M{x} {y} a1.1 0.8 0 1 0 2.2 0 a1.1 0.8 0 1 0 -2.2 0 Z' for x, y in
               [(88, 92), (93, 91), (89.5, 98), (94.5, 97.5), (91, 104), (96, 103.5), (97.5, 86)]),
      WEISS, rolle='detail'),
    # roter Nackenfleck (Männchen)
    form(NACKEN_ROT, ROT),
    E('M73.6 42.6 C75.6 41.4 78 41.4 79.4 42.4 C77.4 42.8 75.4 43.6 74 44.8 Z', ROT_H, o=0.85, rolle='licht'),
    # Federstruktur auf der Brust
    E('M52 76 q1.5 2 1.2 4.5 M58 84 q1.5 2 1.2 4.5 M50 90 q1.5 2 1.2 4.5 M62 94 q1.5 2 1.2 4.5 M55 98 q1.5 2 1.2 4.5',
      s=WEISS_D, sw=0.7, o=0.8, rolle='detail'),
    # langer, gerader Meißelschnabel
    form(SCHNABEL, '#3C3A39'),
    E('M44.8 42.6 C39 43.6 32 44.8 27 45.6 C32.5 45.4 39 45.1 45 45 Z', '#77736E', o=0.95, rolle='licht'),
    E('M46.6 45.8 L27 45.9', s='#141210', sw=0.6, o=0.8, rolle='detail'),
    E('M46.6 46 C40 46.8 32 46.6 26 46.2 C32 47.4 40 48.6 46.7 49.6 Z', '#22201F', o=0.5, rolle='schatten'),
    # Auge mit Glanzlicht
    E(kreis(56, 43.2, 2.9), '#2A1A14', s=INK, sw=0.7, rolle='detail'),
    E(kreis(56, 43.2, 1.9), '#0B0807', rolle='detail'),
    E(kreis(55.1, 42.3, 0.85), '#FFFFFF', o=0.95, rolle='detail'),
]

speichern('buntspecht', specht, quellen=[
    {'titel': 'Referenzfoto Great Spotted Woodpecker Image 2 – Magnus Johansson, CC BY-SA 2.0',
     'url': 'https://commons.wikimedia.org/wiki/File:Great_Spotted_Woodpecker_Image_2.jpg'},
    {'titel': 'Referenzfoto Dendrocopos major EM1B2679 – Bengt Nyman, CC BY 2.0',
     'url': 'https://commons.wikimedia.org/wiki/File:Dendrocopos_major_EM1B2679_(35219263071).jpg'},
])
print('buntspecht geschrieben')

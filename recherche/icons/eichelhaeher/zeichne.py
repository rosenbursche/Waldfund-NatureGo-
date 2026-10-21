"""Eichelhäher – Kopf-und-Brust-Porträt, Blick nach links. Aufruf: python3 recherche/icons/eichelhaeher/zeichne.py"""
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


KOERPER_F, KOERPER_D, KOERPER_H = '#B88A77', '#83604F', '#D4AE9C'
BLAU, BLAU_H, BLAU_D = '#3C7CC4', '#93C3EA', '#234E86'
SCHWARZ = '#1C1C21'
WEISS = '#EFECE6'

KOERPER = ('M45 44.5 C46 36.5 52 31 58.5 29.5 C62.5 26 69 25 74 27 C77.5 28.5 79.5 32 80.5 36.5 '
           'C82 43 85.5 49.5 91 55.5 C97 62.5 100.5 80 100.5 106 L36 106 '
           'C33 94 34 82 39 72 C42 66 44.5 61 45 56 C45.3 52 45 50 45.5 48 Z')
SCHEITEL = ('M46 41.5 C47.5 35.5 52.5 31.2 58.5 29.8 C62.5 26.5 69 25.6 73.8 27.6 C77 29 79 32 80 36 '
            'C74 35.6 67 36.4 61 38 C55 39.6 50 41.5 46 41.5 Z')
KEHLE = 'M45.5 49 C49 52.5 52 56.5 53.5 61.5 C52 65.5 48 67.5 43 67.5 C44.5 62 45.2 56 45 52 Z'
BART = 'M46 50.2 C49.5 50.6 53 52.6 55.2 56 C56.6 58.6 56.4 61.8 55 64.2 C53 61 50 57 46.6 54 Z'
SCHNABEL = 'M46.6 41.2 C41 42 34.5 43.6 28 46.4 C34 48 40.5 49.4 46.8 50.4 Z'

haeher = hg_laub() + [
    form(KOERPER, KOERPER_F),
    E('M80.5 36.5 C82 43 85.5 49.5 91 55.5 C97 62.5 100.5 80 100.5 106 L88 106 C89 88 86 72 80 60 C78 52 78.5 44 80.5 36.5 Z', KOERPER_D, o=0.75, rolle='schatten'),
    E('M58 66 C64 66 70 70 74 76 C70 84 62 92 52 98 C48 100 44 102 40 104 L38 106 L36 106 C38 98 44 88 50 80 C53 74 55 69 58 66 Z', KOERPER_D, o=0.35, rolle='schatten'),
    E('M44 70 C46 66 49 66 50 70 C48 78 45 86 43 95 C40 88 40 78 44 70 Z', KOERPER_H, o=0.8, rolle='licht'),
    # gestreifter weißlicher Scheitel mit Haube (Längsstriche von der Stirn nach hinten)
    E(SCHEITEL, '#E2DAD0', rolle='detail'),
    E('M46 41.5 C50 41.5 55 39.6 61 38 C67 36.4 74 35.6 80 36 C80.3 37.5 80.5 38.5 80.6 39.5 C74 39 67 39.8 61 41.4 C55 43 50 44 46.2 44 Z', KOERPER_F, o=0.6, rolle='detail'),
    E('M49 38.6 C53 36.6 57 35.2 61 34.4 M51 35.6 C55 33.2 59 31.8 63 31.2 M56 33.4 C60.5 30.4 65 29 69.5 28.8 '
      'M62 35.6 C66.5 33.6 71 32.8 75.5 32.6 M65 31.2 C69 29.8 73 29.6 76.5 30.4 M68.5 37 C72 36.2 75.5 36 78.6 36.2',
      s='#24201D', sw=0.9, rolle='detail'),
    E('M62 29 C66 27.4 70 27.2 73 28.2 C69 28.6 65.5 29.6 62.5 31 Z', '#FFFFFF', o=0.6, rolle='licht'),
    # weiße Kehle und schwarzer Bartstreif
    E(KEHLE, WEISS, rolle='detail'),
    E(BART, SCHWARZ, rolle='detail'),
    # Flügel (zusammengelegt): schwarze Schwingen mit weißem Feld, oben am Bug die blauen, schwarz gebänderten Decken
    form('M72 66 C80 60 92 61.5 97 69.5 C99 80 98.5 94 97 106 L74.5 106 C71.5 94 70.5 78 72 66 Z', SCHWARZ),
    E('M75 86 C79 84.5 84 84.5 88 85.5 L87 93.5 C83 93 79.5 93.6 76.5 94.6 Z', WEISS, rolle='detail'),
    E('M89.5 88 C92 88 94.5 88.6 97 89.4 M89 95.5 C91.5 95.6 94 96.2 96.5 97', s='#4A4A55', sw=0.8, rolle='detail'),
    E('M92 84 C95 90 96 98 95.5 106 L97 106 C98.5 94 99 80 97 69.5 C96 76 94 80 92 84 Z', '#000000', o=0.35, rolle='schatten'),
    form('M71.5 66.5 C78 60.5 91 61 96.2 69 L96.5 80 C88 78.5 80 79.5 71.5 82 C71 76.5 71 71 71.5 66.5 Z', BLAU),
    E('M71.5 75 C79 72.5 88 72 96.4 74.5 L96.5 80 C88 78.5 80 79.5 71.5 82 Z', BLAU_D, o=0.45, rolle='schatten'),
    E('M73.0 66.5 L74.2 80.9 M76.5 64.5 L77.7 80.6 M80.0 63.4 L81.2 80.3 M83.5 63.0 L84.7 80.0 M87.0 63.3 L88.2 79.8 M90.5 64.8 L91.7 79.5 M94.0 67.8 L95.2 79.2', s='#10151F', sw=0.9, rolle='detail'),
    E('M74.8 65.4 L76.0 80.7 M78.2 63.9 L79.5 80.5 M81.8 63.2 L83.0 80.2 M85.2 63.1 L86.5 79.9 M88.8 63.8 L90.0 79.6 M92.2 65.9 L93.5 79.3', s=BLAU_H, sw=0.8, o=0.9, rolle='detail'),
    # Federstruktur Brust
    E('M50 76 q2.5 1.8 5 0 M57 82 q2.5 1.8 5 0 M48 86 q2.5 1.8 5 0 M64 74 q2.5 1.8 5 0 M56 92 q2.5 1.8 5 0 M68 86 q2.5 1.8 5 0',
      s=KOERPER_D, sw=0.6, o=0.6, rolle='detail'),
    # kräftiger dunkler Schnabel
    form(SCHNABEL, '#2C2826'),
    E('M46.6 46.4 L30 46.7', s='#0E0B09', sw=0.7, o=0.9, rolle='detail'),
    E('M45 42.4 C40 43.2 35 44.4 31.5 45.4 C36 45.2 41 45 45.2 44.8 Z', '#6C6560', o=0.9, rolle='licht'),
    # helle, bläulich-weiße Iris mit Pupille und Glanzlicht
    E(kreis(57, 42.6, 3.3), '#D3DEE6', s=INK, sw=0.8, rolle='detail'),
    E(kreis(57, 42.6, 1.5), '#0E0A08', rolle='detail'),
    E(kreis(56, 41.6, 0.85), '#FFFFFF', o=0.95, rolle='detail'),
]

speichern('eichelhaeher', haeher, quellen=[
    {'titel': 'Referenzfoto Garrulus glandarius (captive) – Alpsdake, CC BY-SA 4.0',
     'url': 'https://commons.wikimedia.org/wiki/File:Garrulus_glandarius_(captive).jpg'},
    {'titel': 'Referenzfoto Garrulus glandarius B – Luc Viatour, CC BY-SA 3.0',
     'url': 'https://commons.wikimedia.org/wiki/File:Garrulus_glandarius_B_Luc_Viatour.jpg'},
])
print('eichelhaeher geschrieben')

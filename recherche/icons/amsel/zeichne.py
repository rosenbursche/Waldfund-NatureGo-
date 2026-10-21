"""Amsel (Männchen) – Kopf-und-Brust-Porträt, Blick nach links. Aufruf: python3 recherche/icons/amsel/zeichne.py"""
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


GEF, GEF_D, GEF_H = '#2C2724', '#120F0D', '#5A524B'
SCHN, SCHN_D, SCHN_H = '#E8961F', '#B06A18', '#F4C35A'

KOERPER = ('M44 42.5 C46.5 34 53.5 28.5 62 28.5 C70.5 28.5 77 33.5 79.5 41 '
           'C82.5 49 89 55.5 94 63.5 C99 73 101 89 100.5 106 L38 106 '
           'C35.5 96 36.5 84 40.5 74.5 C43.5 67 46 61 45.5 55.5 C45.2 52.5 44.6 51 45 49.5 Z')
FLUEGEL = 'M79 75 C86 69.5 95 70.5 101 77 L101 106 L82 106 C78 97 76.5 85 79 75 Z'
SCHNABEL = 'M46 40.8 C40 41.8 32 43.4 24.5 46.2 C31.5 47.8 39 49.4 46.4 50.6 Z'

amsel = hg_laub() + [
    form(KOERPER, GEF),
    # Schatten unten rechts: Rücken, Bauchseite, unter dem Kinn
    E('M79.5 41 C82.5 49 89 55.5 94 63.5 C99 73 101 89 100.5 106 L86 106 C88 90 86 74 80 62 C77 56 77 48 79.5 41 Z', GEF_D, o=0.85, rolle='schatten'),
    E('M45.5 55.5 C50 60 54 62 59 62.5 C54 66 49 72 47 80 C45 88 45 98 46 106 L38 106 C35.5 96 36.5 84 40.5 74.5 C43.5 67 46 61 45.5 55.5 Z', GEF_D, o=0.45, rolle='schatten'),
    # Licht oben links: Scheitel, Stirn, Brust
    E('M46.5 40 C49 33.5 55 30 62 30 C68 30 72.5 32.5 75 36 C68 33.5 60 33.5 54 36.5 C51 38 48.5 40 46.5 40 Z', GEF_H, o=0.95, rolle='licht'),
    E('M44 62 C46 58 50 61 52 66 C49 72 45 80 43.5 90 C42 84 41.5 72 44 62 Z', GEF_H, o=0.6, rolle='licht'),
    # matter Schimmer auf Hinterkopf und Nacken (Licht von oben)
    E('M66 31 C72 32 76.5 35.5 78.5 41 C81.5 48 86 53 90.5 58.5 C86 55.5 81 51 77.5 45 C75.5 40 71.5 35 66 31 Z', GEF_H, o=0.7, rolle='licht'),
    E('M50 46 C52 49 51 53 48.5 56 C47.5 53 47.2 50 47.6 47.5 Z', GEF_H, o=0.5, rolle='licht'),
    form(FLUEGEL, '#2A2420'),
    E('M83 80 C88 76 95 76 100.5 80 M82.5 89 C88 85 95 85 101 88.5 M83 98 C88 94.5 95 94.5 101 97',
      s='#4E453E', sw=0.9, o=0.8, rolle='detail'),
    E('M95 100 L101 106 L86 106 C90 104 93 102 95 100 Z', GEF_D, o=0.7, rolle='schatten'),
    # Federstruktur: feine Schuppenbögen auf Brust und Hals
    E('M48 70 q3 2 6 0 M46 79 q3 2 6 0 M53 76 q3 2 6 0 M45 88 q3 2 6 0 M52 85 q3 2 6 0 M59 82 q3 2 6 0 '
      'M51 94 q3 2 6 0 M58 91 q3 2 6 0 M65 88 q3 2 6 0 M68 66 q2.5 2 5 0 M71 74 q2.5 2 5 0',
      s='#57504A', sw=0.6, o=0.4, rolle='detail'),
    # Schnabel
    form(SCHNABEL, SCHN),
    E('M46.2 46.4 C39 46.5 31 46.5 26.5 46.6 C32 47.8 39.5 49.2 46.4 50.2 Z', SCHN_D, o=0.9, rolle='schatten'),
    E('M44.5 42.4 C39 43.2 33 44.3 29 45.4 C34 45 40 44.6 44.8 44.6 Z', SCHN_H, o=0.9, rolle='licht'),
    E('M46 46.4 L27 46.6', s='#5A3510', sw=0.8, o=0.9, rolle='detail'),
    E(oval(41.5, 44.1, 1.0, 0.55), '#5A3510', o=0.7, rolle='detail'),
    # Auge mit gelbem Augenring und Glanzlicht
    E(kreis(55.5, 41.2, 4.1), '#E6A52C', s=INK, sw=0.7, rolle='detail'),
    E(kreis(55.5, 41.2, 2.75), '#120C08', rolle='detail'),
    E(kreis(54.5, 40.2, 0.95), '#FFFFFF', o=0.95, rolle='detail'),
]

speichern('amsel', amsel, quellen=[
    {'titel': 'Referenzfoto Blackbird (male) – Tony Wills, CC BY 2.5',
     'url': 'https://commons.wikimedia.org/wiki/File:Blackbird_(male).jpg'},
    {'titel': 'Referenzfoto Common Blackbird – Andreas Trepte, CC BY-SA 2.5',
     'url': 'https://commons.wikimedia.org/wiki/File:Common_Blackbird.jpg'},
])
print('amsel geschrieben')

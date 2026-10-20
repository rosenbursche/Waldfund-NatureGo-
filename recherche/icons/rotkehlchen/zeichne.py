"""Rotkehlchen – Kopf-und-Brust-Porträt, Blick nach links. Aufruf: python3 recherche/icons/rotkehlchen/zeichne.py"""
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


def skaliert(pts, cx, cy, k):
    return [(round(cx + (x - cx) * k, 1), round(cy + (y - cy) * k, 1)) for x, y in pts]


BRAUN, BRAUN_D, BRAUN_H = '#86744F', '#5A4B32', '#A8966C'
OR, OR_D, OR_H = '#D8672A', '#A2461A', '#EE9254'
GRAU = '#8E979B'
BAUCH = '#ECE5D9'

KOERPER = ('M45.5 44.5 C46.5 35 54 30 62 30 C71 30 78 36 80.5 44 C84.5 52 92 58 97 68 '
           'C101 78 101 94 100.5 106 L35 106 C32 94 33 80 38 70 C41 64 44 60 45 55 C45.5 52 45 49.5 45.5 47.5 Z')
# Orange-Fläche als Punktliste (Start + Bezier-Dreiergruppen), damit der graue Saum daraus abgeleitet werden kann
ORANGE = [(45.5, 41), (47, 37), (50.5, 35.5), (54, 35.5), (58, 35.5), (60.5, 38), (62, 42),
          (64, 46.5), (68, 50.5), (72.5, 53.5), (77, 57), (79, 62.5), (78, 69),
          (77, 77), (72.5, 85), (66, 90.5), (58, 96.5), (46, 98.5), (36.5, 97.5),
          (33.5, 88), (34.5, 78), (38, 70), (41, 64), (44, 60), (45, 55),
          (45.5, 52), (45, 49.5), (45.5, 47.5), (45.5, 45), (45.5, 43), (45.5, 41)]
# grauer Saum: äußere Kante von Stirn über Scheitelrand und Halsseite zur Flanke, innen unter dem Orange versteckt
SAUM = ('M45.2 39.5 C46.6 34 50.5 32 54.5 32 C59.5 32 63 35 65 39.5 C67.5 44.5 71.5 48 76.5 51 '
        'C81.5 55 83.5 61.5 82.5 69 C81.5 78 77 86 70.5 92.5 L62 84 L50 50 Z')
FLUEGEL = 'M82 76 C88.5 71.5 96 72.5 101.5 78.5 L101.5 106 L85 106 C81.5 97 80 87 82 76 Z'
SCHNABEL = 'M46.6 43.4 C42 44.4 37.6 45.6 33.4 47 C37.6 47.8 42 48.6 46.9 49.4 Z'

robin = hg_laub() + [
    form(KOERPER, BRAUN),
    E('M80.5 44 C84.5 52 92 58 97 68 C101 78 101 94 100.5 106 L90 106 C91 90 88 74 82 62 C80 56 79.5 50 80.5 44 Z', BRAUN_D, o=0.8, rolle='schatten'),
    E('M50 37 C53 32.5 58 31 63 31 C69 31 74 34 76.5 38.5 C70 35.5 62 35 56 36.5 C53.5 37 51.5 37.5 50 37 Z', BRAUN_H, o=0.9, rolle='licht'),
    # weißlicher Bauch unten
    E('M35 106 C33.5 100 33.5 96 34 93 C45 97 60 96 74 90 C80 96 84 101 86 106 Z', BAUCH, rolle='detail'),
    # blaugrauer Saum um das Orange, dann das Orange
    E(SAUM, GRAU, rolle='detail'),
    form(bez(ORANGE[0], ORANGE[1:]), OR),
    E('M78 69 C77 77 72.5 85 66 90.5 C58 96.5 46 98.5 36.5 97.5 C35 94 34.5 91 34.5 88 C46 92 60 88 68 80 C72 76 75 72 78 69 Z', OR_D, o=0.7, rolle='schatten'),
    E('M48 62 C46 68 42 74 40 84 C38.5 78 39 70 42 64 C44 60 46 58 48 62 Z', OR_H, o=0.85, rolle='licht'),
    E('M48 38.5 C50 37 53 36.6 55.5 37.2 C53 38.4 50.5 39.6 48.6 41 Z', OR_H, o=0.8, rolle='licht'),
    # Brustfedern (feine Bögen)
    E('M50 72 q2.5 1.8 5 0 M57 78 q2.5 1.8 5 0 M49 82 q2.5 1.8 5 0 M64 70 q2.5 1.8 5 0 M56 88 q2.5 1.8 5 0 M44 90 q2.5 1.8 5 0',
      s=OR_D, sw=0.6, o=0.55, rolle='detail'),
    # Flügel
    form(FLUEGEL, '#7A6745'),
    E('M84 82 C89 78.5 95.5 78.5 101 81.5 M84 90 C89 87 95.5 87 101 89.5 M85.5 98 C90 95.5 95.5 95.5 101 97.5',
      s='#B5A27A', sw=0.9, o=0.85, rolle='detail'),
    E('M93 88 C97 87 100 88 101.5 89 L101.5 106 L92 106 C93 100 93 94 93 88 Z', BRAUN_D, o=0.6, rolle='schatten'),
    # feiner dunkler Schnabel
    form(SCHNABEL, '#2E2620'),
    E('M46.6 46.6 L35 47.1', s='#120C08', sw=0.6, o=0.8, rolle='detail'),
    E('M45 44.2 C42 44.9 39 45.6 36.5 46.3 C39.5 46.1 42.5 45.9 45 45.8 Z', '#6E6058', o=0.9, rolle='licht'),
    # großes dunkles Auge mit Glanzlicht
    E(kreis(55.6, 43.4, 3.6), '#3A2A1E', rolle='detail'),
    E(kreis(55.6, 43.4, 3.0), '#0E0A08', rolle='detail'),
    E(kreis(54.5, 42.3, 1.05), '#FFFFFF', o=0.95, rolle='detail'),
]

speichern('rotkehlchen', robin, quellen=[
    {'titel': 'Referenzfoto Erithacus rubecula with cocked head – Francis C. Franklin, CC BY-SA 3.0',
     'url': 'https://commons.wikimedia.org/wiki/File:Erithacus_rubecula_with_cocked_head.jpg'},
    {'titel': 'Referenzfoto Erithacus rubecula -Netherlands-8 – Arjan Haverkamp, CC BY 2.0',
     'url': 'https://commons.wikimedia.org/wiki/File:Erithacus_rubecula_-Netherlands-8.jpg'},
])
print('rotkehlchen geschrieben')

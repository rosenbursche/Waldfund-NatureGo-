import sys; sys.path.insert(0, 'scripts')
from icon_helfer import *
# Schwarzspecht, Männchen: ganz schwarz, roter Scheitel, helles Auge, heller Meißelschnabel
SW, SW_D, SW_H = '#1E1D22', '#0B0A0D', '#454A58'
ROT, ROT_D, ROT_H = '#B8282A', '#7A1618', '#DE5A4E'
SCHN, SCHN_D = '#E4DBC6', '#A99F8A'
e = hg_wald() + [
    # Hals und Brust
    form('M60 106 C62 94 61 82 57 72 C54 66 52 62 52 58 L80 46 C86 56 90 70 94 84 C96 92 97 100 97 106 Z', SW),
    E('M80 46 C86 56 90 70 94 84 C96 92 97 100 97 106 L84 106 C84 92 82 78 78 64 Z', SW_D, o=0.9, rolle='schatten'),
    # Kopf (etwas eckig, kleine Haube hinten)
    form('M47 47 C49 41 54 35 61 33 C67 31.5 74 32 79 34.5 C82 35.5 85 37 87.5 39.5 C85 40.5 83.5 41.5 82.8 43 C83.3 46 82.6 48.5 80.5 51 C78 56 72 60 64 61.5 C58 62.5 52 61 48.5 57.5 C46.5 54.5 46 50.5 47 47 Z', SW),
    # roter Scheitel von Stirn bis Haube
    form('M47.6 46.8 C49.5 40.5 55 35 61.5 33 C68 31.5 75 32 79 34.5 C82 35.5 85 37 87.5 39.5 C85 40.5 83.5 41.5 82.8 43 C78 42 73 41.2 68 41 C61 41 54.5 43 49.5 47 Z', ROT),
    E('M68 41 C73 41.2 78 42 82.8 43 C84 41.5 85.5 40.5 87.5 39.5 C84 39.5 80 39.6 76 39.4 C73 39.6 70 40 68 41 Z', ROT_D, o=0.8, rolle='schatten'),
    E('M52 41 C55 37 59 34.8 63.5 34 C60 36 56.5 38.5 54 41.5 Z', ROT_H, o=0.85, rolle='licht'),
    # Schatten unten rechts am Kopf, Licht oben links
    E('M80.5 51 C78 56 72 60 64 61.5 C58 62.5 52 61 48.5 57.5 C55 58.5 63 57.5 70 54 C75 51.5 79 47 82.5 44 C82.5 46.5 81.8 49 80.5 51 Z', SW_D, o=0.8, rolle='schatten'),
    E('M50 48 C53 45 58 43.5 63 43.5 C58 45 54.5 47 52 50 Z', SW_H, o=0.7, rolle='licht'),
    E('M57 68 C58 76 60 86 60.5 96 C59.5 86 57.5 77 55 70 Z', SW_H, o=0.5, rolle='licht'),
    # Meißelschnabel (lang, gerade, hell)
    form('M48.5 46.5 C40 47.5 30 49.5 21 51.5 C30 53 40 54.5 48.5 56 C47.5 53 47.5 49.5 48.5 46.5 Z', SCHN),
    E('M21 51.5 C30 53 40 54.5 48.5 56 C48.2 55 48 54 47.9 53 C39 52.6 30 52 21 51.5 Z', SCHN_D, o=0.9, rolle='schatten'),
    E('M21 51.5 L27 50.4 L27.5 52.4 Z', '#6E6658', o=0.9, rolle='schatten'),
    E('M47 51.5 L24 51.6', s='#5A5346', sw=0.7, rolle='detail'),
    # Bartfedern über der Schnabelbasis
    E('M48.5 46.5 q2 -1 3.5 0.5 M48.6 56 q2 1 3.6 -0.2', s=SW_H, sw=0.7, o=0.8, rolle='detail'),
    # helles Auge mit Pupille und Glanzlicht
    E(kreis(58.5, 47.8, 2.8), '#E6DEC2', s=INK, sw=0.7, rolle='detail'),
    E(kreis(58.4, 47.9, 1.3), '#0E0B09', rolle='detail'),
    E(kreis(57.8, 47.3, 0.6), '#FFFFFF', o=0.95, rolle='detail'),
    # Gefieder angedeutet
    E('M66 66 q3 3 3 7 M72 76 q3 3 2.5 7 M64 82 q2 3 2 7 M78 90 q2 3 2 7 M70 94 q1.5 3 1.5 6', s=SW_H, sw=0.8, o=0.6, rolle='detail'),
]
speichern('schwarzspecht', e, quellen=[
    {'titel': 'Referenzfoto Dryocopus martius 03.jpg (CC BY 1.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Dryocopus_martius_03.jpg'},
    {'titel': 'Referenzfoto Dryocopus martius, Perersberg, Brasov (CC BY-SA 2.0, xulescu_g)', 'url': 'https://commons.wikimedia.org/wiki/File:Dryocopus_martius,_Perersberg,_Brasov,_Romania_0_(cropped).jpg'},
])

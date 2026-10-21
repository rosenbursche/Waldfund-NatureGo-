# Wildschwein (Keiler) – Kopfporträt 3/4, Blick nach links: keilförmiger Kopf, Rüsselscheibe, kleine Augen,
# aufrechte behaarte Ohren, Borstenkamm, kleiner Hauer
import sys; sys.path.insert(0, 'scripts')
from icon_helfer import *

FELL, FELL_D, FELL_H = '#67584A', '#382D23', '#A3917A'
SCHEIBE, SCHEIBE_H = '#4A3D37', '#9A8A80'

def zack(pts):
    """Linienzug als Borstenkante (gerade Segmente)"""
    return ' '.join(f'L{x} {y}' for x, y in pts)

# Borstenkamm vom Scheitel über den Nacken nach hinten unten
kamm = [(66, 42), (68, 38.5), (69.6, 41.6), (72, 37.2), (73.6, 41.4), (76.4, 38), (77.6, 42.4), (80.4, 39.6), (81.4, 43.6), (84.6, 41.4), (85.2, 45.4), (88.6, 43.6), (88.8, 47.8), (92.4, 46.6), (92.2, 50.6), (95.8, 50), (95.2, 54), (99, 54), (97.8, 57.6), (102, 58.4)]

ebenen = hg_wald() + [
    # hinteres Ohr (rechts)
    form('M70 47 C72 40 76 34 82 29 C84 35 83 42 79 49 Z', FELL),
    E('M72.5 46 C74.5 40.5 77.5 36 81 33 C81.5 38 80.5 42.5 78 46.5 Z', '#7A6856', o=0.9, rolle='licht'),
    # Kopf mit Borstenkamm, Hals bis zum Rand
    form('M30.5 68 C38 63 44 57 50 52 C55 48 60 44 66 42 ' + zack(kamm) + ' L102 106 L50 106 C48 98 46 92 44 87 C41 84 37 82.5 34 81 C31.5 80 30 79.5 29.5 78.5 Z', FELL),
    # vorderes Ohr (links), behaart, aufrecht
    form('M56 50 C54 43 54.5 36 57.5 29 C62 33.5 65.5 40 66.5 47.5 Z', FELL),
    E('M58 48 C56.8 43 57.2 37.5 58.6 33.5 C61.4 37 63.4 41.5 64.2 46.5 Z', '#7A6856', o=0.9, rolle='licht'),
    E('M58 34 l1.5 3 M60 36 l1 3.5 M62 39 l0.8 3.5', s='#B3A391', sw=0.6, o=0.8, rolle='detail'),
    # Schatten: Hals, Unterkiefer
    E('M102 59 L102 106 L80 106 C82 92 86 76 97 62 Z', FELL_D, o=0.85, rolle='schatten'),
    E('M50 106 C48 98 46 92 44 87 C41 84 37 82.5 34 81 C40 81 46 82 52 86 C58 92 60 99 61 106 Z', FELL_D, o=0.8, rolle='schatten'),
    # Licht auf Nasenrücken und Stirn
    E('M32 68.2 C38.5 64 44 59 49.5 54.4 C54 50.6 58.5 48 62.5 47.5 C57 51 52 56 47 60.5 C42 64.6 37 67.4 32 68.2 Z', FELL_H, o=0.9, rolle='licht'),
    E('M66 50 C72 47 80 47 86 50 C80 50.5 74 52 68 55 Z', FELL_H, o=0.5, rolle='licht'),
    # helle Wangenpartie (typisch hellere Backen)
    E('M45 72 C51 67.5 60 67.5 67 70.5 C63 76.5 55 79 47 78 Z', FELL_H, o=0.6, rolle='licht'),
    # Rüsselscheibe von schräg vorn mit Nasenlöchern
    E('M22.4 73 C21.8 67 25.2 63.2 29.8 63.8 C34.6 64.6 36.6 70.2 36 75.8 C35.4 80.8 31.6 82.8 27.8 81.6 C24.4 80.4 22.8 77 22.4 73 Z', SCHEIBE, s=INK, sw=1.6, rolle='form'),
    E('M23.8 71.5 C23.8 67.8 26 65.4 29 65.6 C27 68 25.8 71 25.6 74.6 Z', SCHEIBE_H, o=0.85, rolle='detail'),
    E(oval(27.4, 73, 1.1, 1.9), '#120D0A', rolle='detail'),
    E(oval(31.6, 74.4, 1.1, 1.9), '#120D0A', rolle='detail'),
    # Maulspalte und kleiner Hauer
    E('M33.5 78.6 C37 79.6 40.5 79.4 43.5 78', s='#1A120C', sw=0.9, o=0.85, rolle='detail'),
    E('M38.4 79.6 C37.6 76.2 38.2 72.6 41 69.8 C41 73.2 41.4 76.4 42.2 79.6 Z', '#EDE5D2', s=INK, sw=0.7, rolle='detail'),
    # kleines Auge mit Glanzlicht, tief in Falten
    E('M51.5 60.4 C51.5 58 55.2 56.8 56.8 58.4 C56.4 60.4 53.4 61.4 51.5 60.4 Z', '#120C08', rolle='detail'),
    E(kreis(53.6, 58.9, 0.6), '#FFFFFF', o=0.9, rolle='detail'),
    E('M50 57.2 C52 55.4 55.4 55 58 56.4', s=FELL_D, sw=0.9, o=0.8, rolle='detail'),
    # Borstenstriche
    E('M70 60 l3 6 M76 58 l3 7 M84 58 l2.5 7 M90 64 l2 7 M74 74 l2 7 M84 76 l1.5 7 M92 82 l1 7 M66 86 l2 7 M78 90 l1 7 M56 64 l2 5 M44 66 l1.5 4', s=FELL_D, sw=0.9, o=0.7, rolle='detail'),
    E('M68 50 l2 4 M78 52 l2 4 M88 56 l2 5', s='#9A8A76', sw=0.7, o=0.7, rolle='detail'),
]

speichern('wildschwein', ebenen, quellen=[
    {'titel': 'Wild Boar Habbitat 2 (Richard Bartz, CC BY-SA 2.5)', 'url': 'https://commons.wikimedia.org/wiki/File:Wild_Boar_Habbitat_2.jpg'},
    {'titel': 'A young wild boar in his environment (Michael Gäbler, CC BY 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:A_young_wild_boar_in_his_environment.jpg'},
])

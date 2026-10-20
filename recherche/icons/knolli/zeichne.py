"""Grüner Knollenblätterpilz (Amanita phalloides) – Icon. Aufruf aus dem Projektordner:
python3 recherche/icons/knolli/zeichne.py"""
import sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

HUT, HUT_D, HUT_H, HUT_M = '#9FA44C', '#666C30', '#C4C97E', '#76753A'
WEISS, WEISS_D = '#F1EFE3', '#C9C8B2'
STIEL, NATTER = '#ECEEDB', '#B3B78E'

def zickzack(x0, x1, y, h, n):
    # Natternmuster: feine Zickzack-Bänder quer über den Stiel
    w = (x1 - x0) / n
    d = f'M{x0} {y}'
    for i in range(n):
        d += f' l{w/2:.2f} {-h if i % 2 == 0 else h} l{w/2:.2f} {h if i % 2 == 0 else -h}'
    return d

ebenen = hg_boden() + [
    # Stiel mit Natterung (weißlich, fein olivgrau gebändert)
    form('M54.6 59 C54.2 70 53.8 80 53.2 91 L66.8 91 C66.2 80 65.8 70 65.4 59 Z', STIEL),
    E('M62.4 59 C62.8 70 63.2 80 63.6 91 L66.8 91 C66.2 80 65.8 70 65.4 59 Z', '#C9CCAE', rolle='schatten'),
    E(zickzack(54.2, 65.8, 74, 1.4, 5) + ' ' + zickzack(54.0, 66.0, 78.6, 1.4, 5) + ' ' + zickzack(53.8, 66.2, 83, 1.3, 5), s=NATTER, sw=0.7, o=0.9, rolle='detail'),
    # große, häutige Knolle mit lappig abstehender Scheide (Volva)
    form('M46 101 C43.5 95 44.5 87.5 49 81 C51.8 83 53.6 85.5 54.4 88.5 C56.5 87.4 59 87.5 61 88.6 C63.5 86 67.5 83.5 72 82.5 C76.5 88 77.5 95 75 101 C66 103 55 103 46 101 Z', WEISS),
    E('M68.5 87.5 C72 91.5 73.4 96.5 72.4 101.7 C73.4 101.5 74.3 101.3 75 101 C77.5 95 76.5 88 72 82.5 C70.6 83.6 69.4 85.4 68.5 87.5 Z', WEISS_D, o=0.9, rolle='schatten'),
    E('M54.6 89 C57 88 59 88.1 61 89.2 C60 90.6 56 90.8 54.6 89 Z', '#8E8D76', o=0.8, rolle='schatten'),
    E('M47.5 92 C47.8 88 48.6 85.2 49.8 83.6 C50.8 85.4 51 87.6 50.6 89.4 C49.6 90 48.4 91 47.5 92 Z', '#FFFFFF', o=0.75, rolle='licht'),
    E('M49 97 q3 -1.6 6 0 M59 98.4 q3 -1.4 6 0 M67 96.6 q2.5 -1.2 5 0 M54.4 89.6 q-1 3 -0.6 6.4', s='#B5B49A', sw=0.8, rolle='detail'),
    # weiße Lamellen
    form('M35 53.5 C45 59.5 75 59.5 85 53.5 C78 62 42 62 35 53.5 Z', WEISS),
    E('M43 57.4 l1.5 2.6 M50 58.6 l0.9 2.6 M56.5 59 l0.4 2.7 M63.5 59 l-0.4 2.7 M70 58.6 l-0.9 2.6 M77 57.4 l-1.5 2.6', s='#B9B9A0', sw=0.7, rolle='detail'),
    # hängender, gerieft-häutiger Ring
    form('M54.4 61.2 C57.6 63.2 62.4 63.2 65.6 61.2 C68.3 64.2 69 67.8 68 71 C63.2 69.4 56.8 69.4 52 71 C51 67.8 51.7 64.2 54.4 61.2 Z', WEISS),
    E('M64.9 63.2 C66.7 65.6 67.4 68.2 67.1 70.7 L68 71 C69 67.8 68.3 64.2 65.6 61.2 Z', WEISS_D, rolle='schatten'),
    E('M56 64.4 l-0.8 5.4 M59 65 l-0.3 4.4 M62 65 l0.3 4.4 M64.6 64.4 l0.8 5.2', s='#BDBCA4', sw=0.6, rolle='detail'),
    # Hut: olivgrün, glockig-gewölbt, Mitte dunkler
    form('M33 54 C32.5 34 46 22 60 22 C74 22 87.5 34 87 54 C79 58.5 70 59.5 60 59.5 C50 59.5 41 58.5 33 54 Z', HUT),
    E('M33 54 C41 58.5 50 59.5 60 59.5 C70 59.5 79 58.5 87 54 C87.1 49.5 86.5 45.5 85.2 42 C82 51 72 54 60 54 C47 54 38 51.5 34.6 43.5 C33.6 47 33.1 50.5 33 54 Z', HUT_D, o=0.7, rolle='schatten'),
    E('M49 25.6 C55 22.8 66 22.8 72 25.8 C66 28 55 28 49 25.6 Z', HUT_M, o=0.8, rolle='schatten'),
    E('M38 42 C41.5 32 49.5 26.6 57 26 C49.5 30 44 36 41.5 45.5 Z', HUT_H, o=0.85, rolle='licht'),
    # eingewachsene, radiale Fasern
    E('M60 25 L60 36 M54 25.6 L51 37 M48 28 L43.5 39 M42.5 32.5 L37.5 42 M66 25.6 L69 37 M72 28 L76.5 39 M77.5 32.5 L82.5 42 M57 31 L55 43 M63 31 L65 43 M46.5 38 L43 49 M73.5 38 L77 49 M52 42 L50.5 52 M68 42 L69.5 52',
      s=HUT_D, sw=0.6, o=0.55, rolle='detail'),
]

speichern('knolli', ebenen, quellen=[
    {'titel': 'Referenzfoto Amanita phalloides (28889712950) – Björn S..., CC BY-SA 2.0', 'url': 'https://commons.wikimedia.org/wiki/File:Amanita_phalloides_(28889712950).jpg'},
    {'titel': 'Referenzfoto Amanita phalloides 1 – Archenzo, CC BY-SA 3.0', 'url': 'https://commons.wikimedia.org/wiki/File:Amanita_phalloides_1.JPG'},
    {'titel': 'Referenzfoto Amanita phalloides 98861352 – misspril, CC BY-SA 4.0', 'url': 'https://commons.wikimedia.org/wiki/File:Amanita_phalloides_98861352.jpg'},
])

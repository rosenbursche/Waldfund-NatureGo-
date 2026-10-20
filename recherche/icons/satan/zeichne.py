"""Satans-Röhrling-Icon: weißgrauer Polsterhut, rote Poren, bauchiger roter Stiel mit Netz (giftig)."""
import math, sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

HUT, HUT_D, HUT_H = '#E2DED0', '#A8A492', '#F6F4EC'
ROT, ROT_D, ROT_H = '#B8283A', '#7E1726', '#DE5A5E'
GELB, PORE, PORE_D, NETZ = '#E2C25A', '#C23A28', '#86231A', '#6E1420'

# Netz auf dem Stiel: Rauten innerhalb der bauchigen Form
def im_stiel(x, y):
    if not 76 <= y <= 95: return False
    # halbe Breite in Abhängigkeit von der Höhe (bauchig, Mitte bei y≈86)
    hb = 10.5 + 10 * math.sin(math.pi * (y - 66) / 36)
    return abs(x - 61) < hb - 2.5
netz = ''
for i in range(-10, 11):
    for j in range(0, 10):
        x = 61 + i * 2.6 + (1.3 if j % 2 else 0) + 0.5 * math.sin(i * 2.1 + j); y = 77 + j * 2.4 + 0.4 * math.cos(i * 1.3)
        y = round(y, 1); x = round(x, 1)
        if im_stiel(x, y) and im_stiel(x + 1.3, y + 1.2) and im_stiel(x - 1.3, y + 1.2):
            netz += f' M{x} {y} l1.3 1.2 l-1.3 1.2 l-1.3 -1.2 Z'

ebenen = hg_boden() + [
    # bauchiger Stiel (oben gelb, Mitte/unten karminrot)
    form('M50 61 C45 67 38 76 38.5 86 C39 93 46 98 61 98 C76 98 83 93 83.5 86 C84 76 77 67 72 61 Z', ROT),
    # gelblicher Stielkopf, gut sichtbar unter den Poren
    E('M50 61 C47.5 64 45.2 67.5 43.4 71.5 C47 74.5 54 76 61 76 C68 76 75 74.5 78.6 71.5 C76.8 67.5 74.5 64 72 61 Z', GELB, rolle='licht'),
    E('M43.4 71.5 C47 74.5 54 76 61 76 C68 76 75 74.5 78.6 71.5 C79.6 73.5 80.3 75.5 80.8 77.5 C75 80 67 81 61 81 C55 81 47 80 41.2 77.5 C41.7 75.5 42.4 73.5 43.4 71.5 Z', '#D9783E', o=0.75, rolle='licht'),
    E('M74 66 C80 73 84 80 83.5 86 C83 93 76 98 63 98 C72 95 77 89 77 82 C77 76 76 70 74 66 Z', ROT_D, o=0.8, rolle='schatten'),
    E('M43.5 80 C44 77 45.5 75.5 47 75 C46.5 79.5 46.5 84 47.5 89 C45.5 87.5 43.8 84 43.5 80 Z', ROT_H, o=0.8, rolle='licht'),
    # rotes Netz
    E(netz.strip(), s=NETZ, sw=0.55, o=0.7, rolle='detail'),
    # Erde und Laub um den Stielfuß
    E('M28 100 C36 94 48 95.5 61 96.5 C74 95.5 86 94 94 100 L94 103 L28 103 Z', '#3A2E1E', rolle='detail'),
    E('M36 99 C38 95 43 93.5 47 94.5 C45 97.5 41 99.5 36 99 Z M76 97 C80 93.5 86 93 90 95 C87 98 82 99 76 97 Z', '#8A6534', o=0.9, rolle='detail'),
    E('M36 99 C40 97 43.5 95.6 47 94.5 M76 97 C80.5 95.6 85 95 90 95', s='#4E3518', sw=0.6, o=0.8, rolle='detail'),
    # rote Poren als schmale Sichel unter dem Hutrand
    form('M28 57.5 C38 61 50 62.5 61 62.5 C72 62.5 84 61 93 57.5 C90 64 78 68.5 61 68.5 C44 68.5 32 64 28 57.5 Z', PORE),
    E('M34 62.5 h1 M39 64.6 h1 M45 66 h1 M51 66.9 h1 M57 67.3 h1 M63 67.3 h1 M69 66.9 h1 M75 66 h1 M81 64.6 h1 M86 62.6 h1 M42 63.4 h0.8 M54 64.8 h0.8 M66 64.8 h0.8 M78 63.4 h0.8', s=PORE_D, sw=1.0, rolle='detail'),
    E('M78 66.5 C84 64.5 89 61.5 93 57.5 C90 64 84 67 74 68 Z', PORE_D, o=0.6, rolle='schatten'),
    # dicker, buckliger Polsterhut, schmutzig grauweiß
    form('M22.5 54 C21 43 28 34 38 30.5 C44 26.5 52 26 58 27.5 C64 25 74 25.5 81 29 C91 33.5 98.5 42 97.5 53.5 C97.5 57 96 59 93 59.5 C82 61.5 70 62.5 60 62.5 C49 62.5 37 61.5 27 59.5 C24 58.5 22.5 56.5 22.5 54 Z', HUT),
    E('M97.5 53.5 C97.5 57 96 59 93 59.5 C82 61.5 70 62.5 60 62.5 C49 62.5 37 61.5 27 59.5 C40 58.5 56 57.5 70 55 C82 53 90 49 94 42 C96.5 45.5 97.7 49.5 97.5 53.5 Z', HUT_D, o=0.6, rolle='schatten'),
    E('M29 46 C31 37.5 39 32.5 48 30.5 C42 34.5 36 39 33.5 48 Z', HUT_H, rolle='licht'),
    E('M56 30.5 C61 29 67 29 72 30.5 C66 31 61 32 57.5 33.5 Z', HUT_H, o=0.9, rolle='licht'),
    # leichte Oliv-Flecken und Buckel (wie auf den Fotos)
    E(oval(76, 40, 4, 2.2) + ' ' + oval(42, 49, 3, 1.6), '#B9B58E', o=0.5, rolle='detail'),
    E('M58 28 C57 32.5 58.5 37.5 61.5 41', s=HUT_D, sw=0.9, o=0.7, rolle='detail'),
    E('M80 31.5 C83.5 35.5 85 40.5 84.5 45.5', s=HUT_D, sw=0.8, o=0.5, rolle='detail'),
    E('M44 36 l1.8 -0.9 M73 39.5 l1.2 1.2 M36 51 l1.6 0.2 M66 32.5 l1.4 -0.4', s='#6E5E46', sw=1.0, o=0.75, rolle='detail'),
]
quellen = [
    {'titel': 'Referenzfoto Boletus satanas.JPG', 'url': 'https://commons.wikimedia.org/wiki/File:Boletus_satanas.JPG'},
    {'titel': "Referenzfoto Frankenwarte 10.08.2016 Satan's Bolete (29189044936).jpg", 'url': 'https://commons.wikimedia.org/wiki/File:Frankenwarte_10.08.2016_Satan%27s_Bolete_-_Rubroboletus_satanas_(29189044936).jpg'},
    {'titel': "Referenzfoto Frankenwarte 10.08.2016 Satan's Bolete (29204856296).jpg", 'url': 'https://commons.wikimedia.org/wiki/File:Frankenwarte_10.08.2016_Satan%27s_Bolete_-_Rubroboletus_satanas_(29204856296).jpg'},
]
speichern('satan', ebenen, quellen)

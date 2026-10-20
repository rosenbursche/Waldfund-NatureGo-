"""Satans-Röhrling-Icon: weißgrauer Polsterhut, rote Poren, bauchiger roter Stiel mit Netz (giftig)."""
import math, sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

HUT, HUT_D, HUT_H = '#E2DED0', '#A8A492', '#F6F4EC'
ROT, ROT_D, ROT_H = '#B8283A', '#7E1726', '#DE5A5E'
GELB, PORE, PORE_D, NETZ = '#E2C25A', '#C23A28', '#86231A', '#6E1420'

# Netz auf dem Stiel: Rauten innerhalb der bauchigen Form
def im_stiel(x, y):
    if not 70 <= y <= 97: return False
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
    # bauchiger Stiel
    form('M51 64 C46 70 39 78 39.5 88 C40 95 46 99.5 61 99.5 C76 99.5 83 95 83.5 88 C84 78 76 70 71 64 Z', ROT),
    # gelblicher Stielkopf
    E('M48 70 C46 73 44.5 76 43.5 79 C50 81.5 72 81.5 78.5 79 C77.5 76 76 73 74 70 Z', GELB, o=0.85, rolle='licht'),
    E('M74 70 C80 76 84 82 83.5 88 C83 95 76 99.5 63 99.5 C72 96 77 90 77 83 C77 78 76 74 74 70 Z', ROT_D, o=0.8, rolle='schatten'),
    E('M44 80 C44 76 46.5 73 48.5 71.5 C47.5 76 47 82 48 88 C46 87 44.5 84 44 80 Z', ROT_H, o=0.8, rolle='licht'),
    # rotes Netz
    E(netz.strip(), s=NETZ, sw=0.55, o=0.7, rolle='detail'),
    # rote Poren unter dem Hut
    form('M24 58 C34 64 48 65 61 65 C74 65 88 64 97 58 C94 68 80 75.5 61 75.5 C42 75.5 28 68 24 58 Z', PORE),
    E('M31 65.5 l1 0.5 M35 68 l1 0.4 M40 69.6 l1 0.3 M45 71.2 l1 0.2 M50 72.4 h1 M56 73 h1 M62 73.2 h1 M68 72.8 h1 M74 72 l1 -0.2 M79 70.6 l1 -0.3 M84 68.8 l1 -0.4 M89 66.2 l1 -0.5 M42 72.2 h0.8 M53 74.2 h0.8 M65 74.4 h0.8 M76 73.2 h0.8', s=PORE_D, sw=1.0, rolle='detail'),
    E('M80 69.5 C86 67 92 63 97 58 C94 68 86 73 74 75 Z', PORE_D, o=0.6, rolle='schatten'),
    # dicker, buckliger Polsterhut
    form('M22.5 56 C21 44 28 34.5 38 31 C44 27 52 26.5 58 28 C64 25.5 74 26 81 29.5 C91 34 98.5 43 97.5 55 C97.5 59 96 61 93 61.5 C82 64.5 70 66 60 66 C49 66 37 64.5 27 61.5 C24 60.5 22.5 58.5 22.5 56 Z', HUT),
    E('M97.5 55 C97.5 59 96 61 93 61.5 C82 64.5 70 66 60 66 C49 66 37 64.5 27 61.5 C40 61 56 60 70 57.5 C82 55.5 90 51 94 43 C96.5 46.5 97.7 50.5 97.5 55 Z', HUT_D, o=0.6, rolle='schatten'),
    E('M29 47 C31 38.5 39 33 48 31 C42 35 36 40 33.5 49 Z', HUT_H, rolle='licht'),
    E('M56 31 C61 29.5 67 29.5 72 31 C66 31.5 61 32.5 57.5 34 Z', HUT_H, o=0.9, rolle='licht'),
    # Buckel und leichte Flecken auf dem Hut
    # Buckel (Einkerbung zwischen den Hutbeulen) und wenige Erdkrümel
    E('M58 28.5 C57 33 58.5 38 61.5 41.5', s=HUT_D, sw=0.9, o=0.7, rolle='detail'),
    E('M80 32 C83.5 36 85 41 84.5 46', s=HUT_D, sw=0.8, o=0.5, rolle='detail'),
    E('M44 36.5 l1.8 -0.9 M73 40 l1.2 1.2 M36 52 l1.6 0.2 M66 33 l1.4 -0.4', s='#6E5E46', sw=1.0, o=0.75, rolle='detail'),
    # Blatt am Boden
    E('M84 100 C86 94 92 91 97 92 C95 97 90 100 84 100 Z', '#6E8A3E', o=0.8, rolle='detail'),
]
quellen = [
    {'titel': 'Referenzfoto Boletus satanas.JPG', 'url': 'https://commons.wikimedia.org/wiki/File:Boletus_satanas.JPG'},
    {'titel': "Referenzfoto Frankenwarte 10.08.2016 Satan's Bolete (29189044936).jpg", 'url': 'https://commons.wikimedia.org/wiki/File:Frankenwarte_10.08.2016_Satan%27s_Bolete_-_Rubroboletus_satanas_(29189044936).jpg'},
    {'titel': "Referenzfoto Frankenwarte 10.08.2016 Satan's Bolete (29204856296).jpg", 'url': 'https://commons.wikimedia.org/wiki/File:Frankenwarte_10.08.2016_Satan%27s_Bolete_-_Rubroboletus_satanas_(29204856296).jpg'},
]
speichern('satan', ebenen, quellen)

# Feldhase – Kopfporträt 3/4, Blick nach links (Stil: docs/ICONS.md)
import sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

FELL, FELL_D, FELL_H = '#9A7448', '#5F4527', '#C29A68'
SPITZE, OHR_IN, HELL = '#1E1712', '#B7786A', '#E4D6BC'


def schiebe(d, dx, dy):
    # verschiebt alle absoluten Koordinaten (M, C, L, Q, T) eines Pfads; relative Befehle bleiben
    import re
    teile = re.split(r'([A-Za-z])', d)
    aus, cmd = '', ''
    for t in teile:
        if re.fullmatch(r'[A-Za-z]', t or ''):
            cmd = t
            aus += t
            continue
        if cmd in 'MCLQT' and t.strip():
            z = [float(v) for v in re.findall(r'-?\d*\.?\d+', t)]
            z = [round(v + (dx if i % 2 == 0 else dy), 2) for i, v in enumerate(z)]
            aus += ' '.join(f'{v:g}' for v in z) + ' '
        else:
            aus += t
    return aus


def kopf(liste, dx=0, dy=5):
    return [dict(e, d=schiebe(e['d'], dx, dy)) for e in liste]

ebenen = hg_boden() + [
    # hinteres Ohr (weiter weg, etwas dunkler), schwarze Spitze
    form('M57.5 56 C54.5 45 55.5 31 60.5 21.5 C65.5 25.5 67.5 38 66 56 Z', '#87653E'),
    E('M57.2 30.5 C58 27 59 24 60.5 21.5 C63.4 24 65.2 27.6 66.2 31.6 C63 30.2 60 30 57.2 30.5 Z', SPITZE, rolle='detail'),
    # vorderes Ohr, Innenseite sichtbar, schwarze Spitze
    form('M63.5 58 C64 44 68.5 32 78 24.5 C82.5 30 81 43 74 59 Z', FELL),
    E('M67 47 C68 39 71.5 32 76.5 28 C78.5 35 76.5 42 71 49 Z', OHR_IN, o=0.85, rolle='licht'),
    E('M72.6 28.6 C74.4 27 76.2 25.6 78 24.5 C80.6 27.4 81.4 31.6 81.2 35.6 C78.8 32.8 75.8 30.2 72.6 28.6 Z', SPITZE, rolle='detail'),
    E('M68 46 C69 39 72 33.5 76 30', s=HELL, sw=0.8, o=0.8, rolle='detail'),
] + kopf([
    # Kopf und Hals (gegenüber den Ohren um 5 nach unten gesetzt)
    form('M92 106 C90 92 87 80 81 70 C79 61 75 53 67 49.5 C59 46.5 50 48 44 54 C38 60 34.5 65 32.5 70 C31.5 74 33 78 37 79.5 C42 81 47 81 51.5 82 C56 86 58 95 58 106 Z', FELL),
    # Schatten unten rechts
    E('M92 106 C90 92 87 80 81 70 C78 78 76 90 75.5 106 Z', FELL_D, o=0.85, rolle='schatten'),
    E('M51.5 82 C56 86 58 95 58 106 L65 106 C65 96 62 87 57 82 C55 81 53 81 51.5 82 Z', FELL_D, o=0.75, rolle='schatten'),
    E('M75 60 C79 64 80 70 79 76 C76 72 73 68 70 66 Z', FELL_D, o=0.45, rolle='schatten'),
    # Licht oben links
    E('M46 54.5 C51 50 58 48.5 65 50 C58 51.5 52 54 47.5 59 Z', FELL_H, o=0.9, rolle='licht'),
    E('M36 70 C38 66 41 63.5 44.5 62.5 C42.5 66 40.5 69 39.5 72.5 Z', FELL_H, o=0.7, rolle='licht'),
    # helles Feld um Auge und Schnauze
    E('M46 58 C49 55 56 55 59 58.5 C59 63 55 66 50.5 66 C47 66 45 62 46 58 Z', HELL, o=0.55, rolle='licht'),
    E('M33 74 C35 72 39 72 42 74.5 C43 78 40.5 80.5 37 79.5 C34.5 79 33 77 33 74 Z', HELL, o=0.85, rolle='detail'),
    # Nase und gespaltene Lippe
    E('M32.4 70.2 C33.6 68.8 35.8 68.8 36.6 70.4 C36 71.8 34.4 72.6 33 72.2 C32.4 71.6 32.2 70.8 32.4 70.2 Z', '#3A2A20', rolle='detail'),
    E('M34.6 72.2 L35 75 M35 75 C34 76.2 33.4 76.4 32.8 76 M35 75 C36.2 76.4 37.4 76.6 38.4 76', s=SPITZE, sw=0.8, rolle='detail'),
    # großes Bernstein-Auge mit hellem Ring und Glanzlicht
    E(oval(52.5, 60.5, 5.6, 5.0), '#EADCC0', s=INK, sw=0.9, rolle='detail'),
    E(oval(52.5, 60.5, 4.3, 4.0), '#D99A2E', rolle='detail'),
    E(oval(52.0, 60.8, 2.3, 2.6), '#120C08', rolle='detail'),
    E(kreis(51.0, 58.8, 1.1), '#FFFFFF', o=0.95, rolle='detail'),
    # Tasthaare und Fellstriche
    E('M37 75 C31 73 26 72.5 21 73 M37.5 76.5 C32 77 27 78.5 22.5 81 M38 77.5 C34 80 31 83 28.5 87', s='#EDE5D6', sw=0.6, o=0.85, rolle='detail'),
    E('M80 82 q3 4 2 9 M72 88 q2 4 1 8 M84 94 q2 4 1.5 8 M66 68 q3 2 3.5 6 M60 72 q2 3 1.5 6', s=FELL_D, sw=0.9, o=0.7, rolle='detail'),
])

speichern('feldhase', ebenen, quellen=[
    {'titel': 'Referenzfoto „Brown Hare portrait“ (cazalegg, CC BY 4.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Brown_Hare_portrait.jpg'},
    {'titel': 'Referenzfoto „European Brown Hare Portrait“ (caroline legg, CC BY 2.0)', 'url': 'https://commons.wikimedia.org/wiki/File:European_Brown_Hare_Portrait.jpg'},
])

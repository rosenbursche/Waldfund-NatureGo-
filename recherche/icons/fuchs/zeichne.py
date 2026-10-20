# Rotfuchs – Kopfporträt 3/4, Blick nach links (Stil wie Reh-Vorbild)
import sys; sys.path.insert(0, 'scripts')
from icon_helfer import *

ROT, ROT_D, ROT_H = '#C4642A', '#84401A', '#E39457'
WEISS, WEISS_D = '#F1ECE2', '#C9C0B2'
SCHWARZ = '#231A14'

ebenen = hg_wald() + [
    # Ohren: groß, breit dreieckig; Rückseite und Spitzen schwarz
    form('M53 51 C46 43 41 32 39.5 20 C49 22.5 59 30 66 43 Z', SCHWARZ),
    form('M55 49 C49 42 44.5 33 43 23.5 C50.5 26 58 32.5 63.5 43 Z', ROT),
    form('M66 43 C72 32 80 25 89.5 21.5 C90 33 86 46 79 55 Z', SCHWARZ),
    form('M68.5 44 C73.5 35 79.5 29.5 86.5 26.5 C86.5 35.5 83 45 77.5 51.5 Z', ROT),
    # helles Ohrinneres (weiße Haarbüschel)
    E('M56 46 C51.5 40.5 47.5 33.5 46 27.5 C51.5 30 57 35.5 61 43 Z', '#EDE3D2', o=0.85, rolle='licht'),
    E('M71 45 C74.5 38 79 33 84 30.5 C83.5 37 80.5 43.5 76.5 48.5 Z', '#EDE3D2', o=0.8, rolle='licht'),
    E('M47 29 q4 5 8 9 M50 28.5 q3 4 7 9 M82 33 q-3 4 -6 9', s='#B9AA95', sw=0.6, o=0.8, rolle='detail'),
    # Kopf, Wangenkrause und Hals
    form('M61 43.5 C54 44.5 48 49 44 54 C39.5 58.5 33 61 28.5 62 C25.5 63 25 66.5 28 67.6 C33 69.5 38 70.5 42.5 70.8 C40.5 73.5 37.5 75.5 34 77 C35.5 78.2 36.5 78.8 37.2 79.4 C35 81 33 82.4 31 83.6 C37 84.6 41 86 43.5 88 C45.5 90.5 47.5 93 49 96 C50.5 99.5 51.5 103 52 106 L92 106 C90 92 86.5 79 81 67 C79 59 76.5 52 72.5 47.5 C69 44.5 65 43 61 43.5 Z', ROT),
    # weiße Schnauze, Wange und Kehle
    E('M28 67.6 C33 69.5 38 70.5 42.5 70.8 C40.5 73.5 37.5 75.5 34 77 C35.5 78.2 36.5 78.8 37.2 79.4 C35 81 33 82.4 31 83.6 C37 84.6 41 86 43.5 88 C45.5 90.5 47.5 93 49 96 C50.5 99.5 51.5 103 52 106 L70 106 C70 96 68 86 64 79 C60 73 55 70.5 50 69.5 C45 68.5 40 67.5 36 66.2 C33 65.6 30 66 28 67.6 Z', WEISS, s=INK, sw=0.9, rolle='detail'),
    E('M52 106 C51.5 103 50.5 99.5 49 96 C46.5 91 42 87 36.5 84.5 C46 86 52 88 56 93 C59 97 61 102 61.5 106 Z', WEISS_D, o=0.75, rolle='schatten'),
    # Schatten am Hals hinten und unter dem Ohr
    E('M92 106 C90 92 86.5 79 81 67 C78.5 76 76.5 88 75.5 106 Z', ROT_D, o=0.85, rolle='schatten'),
    E('M70 106 C70 96 68 86 64 79 C67 86 70 96 75.5 106 Z', ROT_D, o=0.5, rolle='schatten'),
    # Licht auf Stirn und Nasenrücken
    E('M60.5 45 C55 46 49.5 49.5 45.5 54 C51 51 56.5 49 63 48.6 C62.5 47 61.6 45.8 60.5 45 Z', ROT_H, o=0.9, rolle='licht'),
    E('M44 56 C40 59 35 61.2 31 62.2 C36 62.4 41 61 45.5 58.6 Z', ROT_H, o=0.75, rolle='licht'),
    # dunkle Tränenlinie vom Auge zur Schnauze
    E('M50.5 57.8 C48 60.5 45.5 63.6 43.2 66.8', s='#3A2418', sw=1.1, o=0.8, rolle='detail'),
    # Nase mit Glanz
    E('M26.4 64.4 C26 62.5 27.6 61.4 29.6 61.8 C30.6 63.2 30.4 65.6 29 67 C27.6 66.6 26.7 65.6 26.4 64.4 Z', '#140E0B', rolle='detail'),
    E(oval(28, 63, 0.8, 0.5), '#F2EEE4', o=0.7, rolle='detail'),
    # Maulspalte
    E('M29.5 67.6 C33 68.6 37 69.2 40.5 69.2', s='#3A2418', sw=0.8, o=0.8, rolle='detail'),
    # Auge: bernsteinfarben, schräg, senkrechte Pupille, Glanzlicht
    E('M47 55.6 C49 52.8 52.8 51.6 56 52.4 C55.6 55 53 57.4 50 57.6 C48.6 57.6 47.5 56.8 47 55.6 Z', '#140E0B', rolle='detail'),
    E('M48.5 55.4 C50 53.6 52.6 52.8 54.6 53.2 C54 55 52.4 56.4 50.2 56.6 C49.4 56.5 48.8 56 48.5 55.4 Z', '#D59A3A', rolle='detail'),
    E(oval(51.6, 54.9, 0.65, 1.4), '#140E0B', rolle='detail'),
    E(kreis(50.5, 54.2, 0.6), '#FFFFFF', o=0.95, rolle='detail'),
    # Schnurrhaare (fein) und Fellstriche
    E('M35 66.5 q-5 1 -9 4 M36 67.6 q-4 2.5 -7 6.5', s='#EDE3D2', sw=0.5, o=0.7, rolle='detail'),
    E('M80 80 q3 4 2 9 M75 90 q2 4 1 8 M84 92 q2 4 1.5 8 M70 64 q2 3 1 6 M43 88 q3 2 4 6 M48 96 q2 2 2.5 6', s=ROT_D, sw=0.9, o=0.6, rolle='detail'),
]

speichern('fuchs', ebenen, quellen=[
    {'titel': 'Rotfuchs Portrait 2011 (4028mdk09, CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Rotfuchs_Portrait_2011.JPG'},
    {'titel': 'Rotfuchs, Vulpes vulpes 6 (Böhringer Friedrich, CC BY-SA 2.5)', 'url': 'https://commons.wikimedia.org/wiki/File:Rotfuchs,_Vulpes_vulpes_6.JPG'},
])

import sys; sys.path.insert(0, 'scripts')
from icon_helfer import *
# Uhu: große orange Augen, Federohren, hell-graubrauner Gesichtsschleier mit dunklem Rand, gestreifte Brust
FE, FE_D, FE_H = '#9C7243', '#5E4126', '#C49A63'
SCHL, SCHL_D, SCHL_H = '#BCA27C', '#8A7152', '#DCC7A2'
RAND = '#33241A'
streifen = [(40, 82, 4), (47, 86, 5), (54, 90, 5), (64, 89, 5), (72, 86, 5), (80, 83, 5), (88, 84, 4), (44, 96, 5), (52, 99, 5), (61, 100, 5), (70, 98, 5), (79, 95, 5), (87, 96, 4), (35, 92, 4)]
e = hg_wald() + [
    # Federohren (hinter dem Kopf, schräg nach außen)
    form('M44 42 C41.5 36 39.6 30 39 23.5 C41.6 26.4 43.6 29.4 45.4 32.6 C45.8 30.6 46.4 29 47.2 27.6 C48.6 31.4 50 35 51.4 38.6 Z', FE_D),
    form('M76 42 C78.5 36 80.4 30 81 23.5 C78.4 26.4 76.4 29.4 74.6 32.6 C74.2 30.6 73.6 29 72.8 27.6 C71.4 31.4 70 35 68.6 38.6 Z', FE_D),
    E('M43.6 38 C42 33.6 41 29.8 40.6 26.4 C42.4 28.6 43.8 31 45 33.6 Z', SCHL_H, o=0.7, rolle='licht'),
    E('M76.4 38 C78 33.6 79 29.8 79.4 26.4 C77.6 28.6 76.2 31 75 33.6 Z', SCHL, o=0.45, rolle='licht'),
    E('M41.4 30 l1.4 1.6 M42.2 34 l1.6 1.4 M78.6 30 l-1.4 1.6 M77.8 34 l-1.6 1.4', s=SCHL_H, sw=0.6, o=0.7, rolle='detail'),
    # Körper mit Schultern
    form('M21 106 C20 92 24 80 31 70 C33 66 35 63 36.5 60 L84 60 C86 63 88 66 90 70 C96 80 100 92 99 106 Z', FE),
    E('M99 106 C100 92 96 80 90 70 C88 84 84 96 80 106 Z', FE_D, o=0.85, rolle='schatten'),
    E('M26 88 C28 80 31 74 35 70 C33 78 31 86 30 96 Z', FE_H, o=0.7, rolle='licht'),
    # Kopf
    form('M34 56 C33.5 46 37.5 39.5 45 37 C51 35.2 69 35.2 75 37 C82.5 39.5 86.5 46 86 56 C87 68 78 77 60 78 C43 77 34 68 34 56 Z', FE),
    E('M87 56 C87 68 78 77 60 78 C70 74 79 68 83 56 C84.5 50 84 44 81 40 C85 44 87 50 87 56 Z', FE_D, o=0.8, rolle='schatten'),
    E('M39 46 C42 40 47 36.5 54 35.5 C48 39 44 43 41.5 49 Z', FE_H, o=0.8, rolle='licht'),
    # dunkle Fleckung auf Scheitel und Stirn
    E('M46 39 l1 3 M51 37.4 l0.6 3 M56 36.8 l0.3 3 M64 36.8 l-0.3 3 M69 37.4 l-0.6 3 M74 39 l-1 3 M41 45 l1.6 2.4 M80 45.5 l-1.4 2.4 M38 52 l2 1.2 M83 52 l-2 1.2', s='#2E2014', sw=1.2, o=0.75, rolle='detail'),
    # Gesichtsschleier: zwei helle Scheiben mit dunklem Rand
    E('M38 58 C37 49 42 43.5 49.5 43.5 C55 43.5 58.5 48 58.5 55 C58.5 63 54 68.5 47.5 68.5 C42 68.5 38.5 64 38 58 Z', SCHL, s=RAND, sw=1.0, rolle='detail'),
    E('M59 55 C59 48 62.5 43.5 69 43.5 C76.5 43.5 81.5 49 81 57.5 C80.5 64 76.5 68.5 71 68.5 C64 68.5 59 63 59 55 Z', SCHL, s=RAND, sw=1.0, rolle='detail'),
    E('M48 68.5 C53 68 57 63 58.5 56 C59.5 63 64 68 71 68.5 C66 71 54 71 48 68.5 Z', SCHL_D, o=0.8, rolle='schatten'),
    E('M41 52 C42 47.5 45.5 45 49.5 45 C46 47 43.5 50 42.5 54 Z', SCHL_H, o=0.9, rolle='licht'),
    # Schleierfedern (feine Striche strahlenförmig)
    E('M40.5 60 l-2 1 M41.5 64 l-2 2 M44.5 67 l-1 2 M78.5 61 l2 1 M77 65 l2 2 M74 67.4 l1 2', s=RAND, sw=0.7, o=0.7, rolle='detail'),
    # dunkle Brauen-V und helle Brauenfedern
    E('M58.6 55 C55 48.5 50 45.2 43 45.5 C49 43 55 44 59.5 49.5 C64 44 70 43 76.5 45.5 C69.5 45.2 64 48.5 60.6 55 Z', RAND, o=0.9, rolle='detail'),
    E('M44 44.2 C49 41.8 54.5 42.2 58.6 46 M60.8 46 C65 42.2 70.5 41.8 75.5 44.2', s=SCHL_H, sw=0.9, o=0.9, rolle='detail'),
    # große orange Augen mit Pupille und Glanzlicht
    E(kreis(49.2, 55.2, 6.2), '#E07A1C', s=INK, sw=1.0, rolle='detail'),
    E(kreis(70.2, 55.2, 5.8), '#E07A1C', s=INK, sw=1.0, rolle='detail'),
    E(kreis(50.2, 56.6, 4.0), '#B4520F', o=0.8, rolle='schatten'),
    E(kreis(70.9, 56.4, 3.7), '#B4520F', o=0.8, rolle='schatten'),
    E(kreis(49.2, 55.6, 2.4), '#100B08', rolle='detail'),
    E(kreis(70.0, 55.6, 2.2), '#100B08', rolle='detail'),
    E(kreis(47.9, 54.9, 1.0), '#FFFFFF', o=0.95, rolle='detail'),
    E(kreis(68.8, 54.9, 0.95), '#FFFFFF', o=0.95, rolle='detail'),
    # schwere Oberlider unter den Brauen: strenger, wacher Blick statt rundem Kulleraugen-Gesicht
    E('M42.2 52.6 C42.8 49.4 46 48.2 49.2 48.2 C52.8 48.2 55.4 50.4 56.2 55.4 C51.8 53.6 47 52.6 42.2 52.6 Z', RAND, o=0.95, rolle='detail'),
    E('M77.8 52.6 C77.2 49.6 74 48.6 70.2 48.6 C67 48.6 64.6 50.6 64 55.2 C68.4 53.6 73.2 52.6 77.8 52.6 Z', RAND, o=0.95, rolle='detail'),
    # Hakenschnabel, dunkel, halb im Gefieder
    E('M57.2 58.5 C58.6 57.2 61.4 57.2 62.6 58.6 C62.4 62 61.2 65 59.4 67 C58.8 64.6 57.4 61.6 57.2 58.5 Z', '#3A3734', s=INK, sw=1.0, rolle='detail'),
    E('M58.4 59 C59.2 58.4 60.4 58.4 61 59 C60.4 61 59.8 62.6 59.2 63.6 Z', '#77736C', o=0.8, rolle='detail'),
    # weißer Kehlfleck
    E('M50 77.6 C54 76.2 66 76.2 70 77.6 C67.5 82 52.5 82 50 77.6 Z', '#E6DCC8', o=0.9, rolle='detail'),
] + [E(f'M{x} {y} q-0.8 {h/2} 0.2 {h}', s='#2A1C10', sw=1.4, o=0.85, rolle='detail') for x, y, h in streifen] + [
    E('M38 84 h3 M46 92 h3 M57 95 h3 M68 93 h3 M76 89 h3 M84 90 h3 M50 104 h3 M66 104 h3', s=FE_D, sw=0.7, o=0.7, rolle='detail'),
]
speichern('uhu', e, quellen=[
    {'titel': 'Referenzfoto Bubo bubo.jpg (CC BY 3.0, Adam Kumiszcza)', 'url': 'https://commons.wikimedia.org/wiki/File:Bubo_bubo.jpg'},
    {'titel': 'Referenzfoto Bubo bubo portrait.jpg (CC BY 2.0, indygnome)', 'url': 'https://commons.wikimedia.org/wiki/File:Bubo_bubo_portrait.jpg'},
    {'titel': 'Referenzfoto Eagle Owl IMG 9203.JPG (CC BY-SA 3.0, Brocken Inaglory)', 'url': 'https://commons.wikimedia.org/wiki/File:Eagle_Owl_IMG_9203.JPG'},
])

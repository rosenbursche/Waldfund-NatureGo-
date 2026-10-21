# Eurasischer Luchs – Kopfporträt 3/4, Blick nach links (Stil: docs/ICONS.md)
import sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

FELL, FELL_D, FELL_H = '#B07A48', '#73492A', '#D3A574'
BART, SCHWARZ, NASE, AUGE = '#EDE3D2', '#1E1712', '#B0705A', '#D9A23A'

ebenen = hg_wald() + [
    # Brust und Schultern
    form('M34 106 C37 97 43 90 52 87 L84 82 C93 88 99 97 101 106 Z', FELL),
    E('M101 106 C99 97 93 88 84 82 L78 84 C84 91 87 99 88 106 Z', FELL_D, o=0.8, rolle='schatten'),
    E('M44 106 C46 99 50 93 56 90 L66 90 C62 95 60 100 60 106 Z', BART, o=0.75, rolle='licht'),
    # Ohren: hoch, spitz, mit schwarzen Haarpinseln
    form('M78.2 36 C79 32.6 79.6 29.4 80.6 25.8 C81.4 29.4 82.2 32.8 82.4 36.4 Z', SCHWARZ),
    form('M65 44 C69 38 74.5 34.2 80.6 33 C82.2 39.4 81.6 45.4 79 51 Z', FELL),
    E('M68.6 43 C72 39.4 75.8 37 79.4 36 C80 40.4 79.4 44.6 77.6 48 Z', '#E2D2B8', o=0.8, rolle='licht'),
    E('M75.6 34.2 C77.4 33.6 79 33.2 80.6 33 C81.2 35.6 81.6 38.4 81.6 41 C80 38.4 78 36 75.6 34.2 Z', SCHWARZ, rolle='detail'),
    form('M38.2 35 C38.8 31.4 40 27.6 42 24.2 C42.2 27.8 42.4 31.4 42.6 34.6 Z', SCHWARZ),
    form('M35.5 52 C34.6 45 36.2 38.4 40.2 32.6 C45.8 35.2 50.4 39.2 53 43.4 Z', FELL),
    E('M38.4 48 C38 43 39.2 38.6 41.2 35.8 C44.6 37.8 47.6 40.4 49.6 43.2 Z', '#E2D2B8', o=0.8, rolle='licht'),
    E('M37.4 40 C37.9 37.4 38.9 35 40.2 32.6 C42 33.4 43.6 34.4 45 35.6 C42.4 36.4 39.8 38 37.4 40 Z', SCHWARZ, rolle='detail'),
    # Kopf mit Backenbart (abstehender Wangenkragen)
    form('M37 51 C41 44 50 40 59 40 C69 40 77 44 81 51 C84 56 86 61 86.6 67 L90.6 71.6 L87 72.8 L91.4 78.2 L86.8 78.8 L88.6 84 L83 82.8 L84 87.6 L78.6 85.6 C74 89.6 68 91.6 62 91.2 L59 94.6 L56.4 89.8 C50 88.6 45.5 86.4 42.5 83.4 C39 80.4 36 77 34.5 73 C32.5 70 32.2 66.5 33.4 63.5 C34.4 59.5 35 55 37 51 Z', FELL),
    # heller Bart mit schwarzen Streifen
    E('M65 67 C71 67.6 78 67 85 68.6 L90.6 71.6 L87 72.8 L91.4 78.2 L86.8 78.8 L88.6 84 L83 82.8 L84 87.6 L78.6 85.6 C74 89.6 68 91.6 62 91.2 L59 94.6 L56.4 89.8 C60 84.6 63.4 76 65 67 Z', '#E3D5BC', o=0.9, rolle='licht'),
    E('M69 72 C74.5 73 80 75.2 85 78.4 M66 80 C70.5 82 74.5 84.4 78 87.4', s='#2E2116', sw=1.3, o=0.8, rolle='detail'),
    E('M72 69.6 l3 3 M78 70 l3.6 2.6 M70 77 l2.6 3 M76 78 l3 2.6 M64 86 l1.6 3 M68 85 l2.4 3', s='#B49C7A', sw=0.7, o=0.8, rolle='detail'),
    # Schatten unten rechts
    E('M81 51 C84 56 86 61 87 66 C82 66 78 65.6 74 66 C76 60 77 55 76.5 49 Z', FELL_D, o=0.6, rolle='schatten'),
    E('M78.6 85.6 C74 89.6 68 91.6 62 91.2 C67 88.6 72 86 76 82.6 Z', '#B9A88E', o=0.7, rolle='schatten'),
    # Licht oben links
    E('M39.5 51.5 C43.5 45 50.5 41.5 58.5 42 C52 44.5 46.5 48.5 43 54.5 Z', FELL_H, o=0.9, rolle='licht'),
    # weiße Schnauze und Kinn, helle Augenumrandung
    E('M34.5 68.5 C37 66 42 65.6 46 67 C50 66.6 54 67.6 56 70.5 C56 76 52.5 82 46 82.5 C40 82.5 35.5 76 34.5 68.5 Z', BART, o=0.95, rolle='licht'),
    E('M51 62.4 C54 63.8 59 63.8 63.6 61.2 C62.6 64.6 59 66.4 55 66 C53 65.6 51.6 64.2 51 62.4 Z', BART, o=0.85, rolle='licht'),
    # Fleckung auf Stirn und Wangen
    E(' '.join(kreis(x, y, r) for x, y, r in [(50, 48, 0.9), (54, 45.5, 0.8), (58, 47.5, 1.0), (62, 45, 0.8), (66, 48.5, 0.9), (55, 51, 0.7), (61, 51.5, 0.8), (70, 55, 1.1), (73.5, 59, 1.0), (68.5, 60.5, 0.9), (77, 62.5, 1.0)]), '#4A2E1A', o=0.85, rolle='detail'),
    E('M48 53.5 C48.4 50 49.6 47 51.4 44.4 M57.4 53.2 C58 49.6 59.4 46.6 61.6 43.6', s='#4A2E1A', sw=0.9, o=0.6, rolle='detail'),
    # Augen: bernsteinfarben, runde Pupille, dunkler Lidstrich, Glanzlicht
    E('M40.2 58 C41.2 55.8 43.8 55.2 46.2 56.2 C46.8 58.8 45 61 42.6 61 C41.2 60.8 40.4 59.6 40.2 58 Z', AUGE, s=INK, sw=1.0, rolle='detail'),
    E(kreis(43.6, 58.2, 1.3), '#120C08', rolle='detail'),
    E(kreis(42.8, 57.2, 0.65), '#FFFFFF', o=0.95, rolle='detail'),
    E('M52.4 58 C53.6 54.8 58.2 53.6 62.8 55.4 C63.4 59 60.6 62 56.8 62 C54.4 61.8 52.6 60.2 52.4 58 Z', AUGE, s=INK, sw=1.0, rolle='detail'),
    E(kreis(57.8, 58.1, 1.9), '#120C08', rolle='detail'),
    E(kreis(56.6, 56.6, 0.95), '#FFFFFF', o=0.95, rolle='detail'),
    E('M63 55.6 C65 55.6 67 56.4 68.6 57.6', s=INK, sw=0.9, rolle='detail'),
    # Nase und Mund
    E('M36.2 64.4 C38 63.4 41.8 63.6 43.2 64.6 C42.6 66.4 40.8 68 39.6 68.2 C38.2 67.8 36.6 66.2 36.2 64.4 Z', NASE, s=INK, sw=0.8, rolle='detail'),
    E('M44 60.5 C42.6 61.4 41 62.6 40.4 63.8 C42 63.4 43.6 63.6 44.8 64.2 C45.6 62.6 46.4 61.2 47.4 60.6 Z', '#C08A5C', o=0.8, rolle='detail'),
    E('M39.6 68.2 L39.8 70.8 M39.8 70.8 C38.6 71.8 37.4 72 36.6 71.6 M39.8 70.8 C41.2 71.8 42.8 72 44 71.6', s=INK, sw=0.8, rolle='detail'),
    E(' '.join(kreis(x, y, 0.45) for x, y in [(43, 69.6), (45.4, 70.2), (44, 72), (46.6, 72.4)]), '#4A2E1A', rolle='detail'),
    # Tasthaare und Fellstriche
    E('M37 70 C31 69 26 69.5 21.5 71 M37.5 72 C32 73 27.5 75 23.5 78.5 M48 70.5 C54 70 60 70.5 65 72', s='#F4EFE6', sw=0.6, o=0.85, rolle='detail'),
    E('M86 94 q2 4 1.5 9 M78 96 q2 4 1 8 M93 98 q1.5 3 1 6', s=FELL_D, sw=0.9, o=0.7, rolle='detail'),
]

speichern('luchs', ebenen, quellen=[
    {'titel': 'Referenzfoto „Lynx lynx (Linnaeus, 1758)“ (Michael Gäbler, CC BY 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Lynx_lynx_(Linnaeus,_1758).jpg'},
    {'titel': 'Referenzfoto „Lynx lynx-3“ (David Castor, gemeinfrei)', 'url': 'https://commons.wikimedia.org/wiki/File:Lynx_lynx-3.JPG'},
])

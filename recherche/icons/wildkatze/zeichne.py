# Europäische Wildkatze – Kopfporträt 3/4, Blick nach links (Stil: docs/ICONS.md)
import sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

FELL, FELL_D, FELL_H = '#A88A60', '#6E5638', '#CDB48A'
STREIF, NASE, AUGE, HELL = '#3F2F20', '#D79A92', '#B4B65E', '#E8DCC4'

ebenen = hg_wald() + [
    # Brust und Schultern (dichtes Fell)
    form('M36 106 C38 96 44 88 52 85 L82 80 C92 86 99 96 101 106 Z', FELL),
    E('M101 106 C99 96 92 86 82 80 L76 82 C82 90 85 98 86 106 Z', FELL_D, o=0.8, rolle='schatten'),
    E('M46 106 C47 98 51 91 57 87 L64 86 C60 92 58 99 58 106 Z', HELL, o=0.6, rolle='licht'),
    # buschiger, stumpf endender Schwanz rechts hinter dem Kopf: dunkle Ringe, schwarze stumpfe Spitze
    # (wichtigstes Unterscheidungsmerkmal zur getigerten Hauskatze)
    form('M83 101 C86 90 89 80 87.5 68 C86.5 61 85.5 56 86 52 C87 47.5 92 46 95.5 48.5 C98.5 51 98.8 58 98 66 C97 78 95.5 90 93.5 101 Z', FELL),
    E('M93.5 101 C95.5 90 97 78 98 66 C98.8 58 98.5 51 95.5 48.5 C96 56 95 68 93 80 C91.5 88 90 95 89 101 Z', FELL_D, o=0.6, rolle='schatten'),
    E('M86.6 64 C86 59 85.8 55 86.6 52.5 C87.6 56 88.4 60 88.6 64 Z', FELL_H, o=0.8, rolle='licht'),
    E('M87.2 66 L98.1 64.6 L97.9 69.4 L87.6 70.8 Z M87.6 79 L97 77.6 L96.6 82.4 L87.2 83.8 Z', '#2E2218', o=0.92, rolle='detail'),
    E('M86 52 C87 47.5 92 46 95.5 48.5 C98.3 50.8 98.7 54.5 98.6 57.6 C94.6 56.6 90.4 56.8 86.1 58 C85.8 56 85.8 54 86 52 Z', '#241A12', rolle='detail'),
    E('M86 74 l-1.4 1 M85.6 88 l-1.4 1 M98.2 72 l1.4 0.6 M97.4 88 l1.4 0.6', s=FELL_D, sw=0.8, o=0.7, rolle='detail'),
    # Ohren: breit, abgerundet, ohne Pinsel
    form('M64 43 C68 36 74 31 81.5 29 C83.5 36 83 44 80 50.5 Z', FELL),
    E('M68 42 C71.5 37.5 75.5 34.5 79.8 33 C80.6 38 80 43 78 47 Z', '#7C5A44', o=0.85, rolle='schatten'),
    E('M70 41.5 C73 38.5 76 36.8 78.8 36 M71.6 44 C74.2 41.6 76.8 40.4 79 40', s=HELL, sw=0.6, o=0.7, rolle='detail'),
    form('M35.5 51 C34.5 44 36 36.5 40 31 C45.5 33.5 50.5 37.5 53 42 Z', FELL),
    E('M38.6 47 C38 42 39 37.4 41.2 34.6 C44.6 36.6 47.6 39.4 49.4 42.4 Z', '#7C5A44', o=0.85, rolle='schatten'),
    E('M40.4 44.6 C40.6 41 41.4 38.4 42.6 36.6', s=HELL, sw=0.6, o=0.7, rolle='detail'),
    # Kopf mit buschigem Backenfell, Schnauze nach links vorgeschoben (3/4)
    form('M37 51 C41 43.5 49.5 39 58.5 39 C68.5 39 78 43.5 82.5 51.5 C85.5 57 86.5 62 85 67 L89.5 69.5 L84.5 72 L87 76 L81.5 76.8 L82.5 81 L77 80.5 C72 85 65 87.5 57.5 87.5 C51.5 87.5 46 85.5 42.5 82 C39 79.5 36 76.5 34.5 73 C32.5 70 32.2 66.5 33.4 63.5 C34.4 59.5 35 55 37 51 Z', FELL),
    # Schatten unten rechts
    E('M85 67 L89.5 69.5 L84.5 72 L87 76 L81.5 76.8 L82.5 81 L77 80.5 C72 85 65 87.5 57.5 87.5 C64 82.5 70 76 73 67 C75 61 76 55 76 50 C80 54 83.5 60 85 67 Z', FELL_D, o=0.55, rolle='schatten'),
    E('M42.5 82 C46 85.5 51.5 87.5 57.5 87.5 C55 84.5 52 82.5 48 81.5 Z', FELL_D, o=0.5, rolle='schatten'),
    # Licht oben links
    E('M39.5 51.5 C43.5 45 50.5 41.5 58.5 41.5 C52 44 46.5 48 43 54 Z', FELL_H, o=0.9, rolle='licht'),
    E('M66 70 C70 72 75 73 80 72.5 C76 76 70 77 65 75 Z', FELL_H, o=0.5, rolle='licht'),
    # helles Schnauzenfeld und Kinn (gedämpft, nicht weiß)
    E('M34.5 68.5 C37 66 42 65.6 46 67 C50 66.6 54 67.6 55.5 70.5 C55 75 50.5 78.5 45 78.5 C40 78.5 35.5 75 34.5 68.5 Z', '#DCCBAA', o=0.85, rolle='licht'),
    E('M46 47 C47.5 46 49 46 50.5 47', s=STREIF, sw=0.8, o=0.5, rolle='detail'),
    # Stirnstreifen (5 dunkle Längsstreifen) und Wangenstreifen
    E('M47.5 53.5 C47 49 48 44.5 50 40.8 M51.8 53 C52 48 53.2 44 55.2 39.6 M56 53.4 C56.6 48.6 58.4 44.4 61 40.2 M60.4 54.4 C61.6 49.6 64 46 67.2 42.2 M64.6 56.4 C66.2 52.4 69 49.2 72.4 46', s=STREIF, sw=1.7, o=0.65, rolle='detail'),
    E('M67 60 C71 60 75.5 61.5 80 64.5 M65.5 64.5 C69.5 65.5 74 67.5 78 71 M38.5 60.5 C37.4 61.2 36.4 62 35.6 63', s=STREIF, sw=1.4, o=0.6, rolle='detail'),
    E('M72 54 q3 1 5 3.5 M74 76 q2 2 2.5 5 M62 80 q1 2.5 0.5 5', s=FELL_D, sw=0.9, o=0.6, rolle='detail'),
    # rötlicher Nasenrücken, dichtes Backenfell, verwaschene Halsbänder
    E('M44 60 C42.5 61 41 62.4 40.4 63.8 C42 63.4 43.6 63.6 44.8 64.2 C45.6 62.6 46.4 61.2 47.4 60.4 Z', '#B08458', o=0.8, rolle='detail'),
    E('M70 79 l3 2.6 M75 76 l3.4 2 M80 72 l3.4 1.4 M64 82.5 l2.4 2.6 M46 82 l-1 2.6 M42 79 l-2 2', s=FELL_H, sw=0.8, o=0.8, rolle='detail'),
    E('M54 90 C62 92 72 91 82 87 M58 97 C66 99 76 98 88 93', s=FELL_D, sw=1.4, o=0.45, rolle='detail'),
    # Augen: mandelförmig, grünlich-gelb, senkrechte Pupille, dunkler Lidrand, Glanzlicht
    E('M40 57.6 C41 55.4 43.6 54.8 46 55.8 C46.6 58.4 44.8 60.6 42.4 60.6 C41 60.4 40.2 59.2 40 57.6 Z', AUGE, s=INK, sw=1.0, rolle='detail'),
    E(oval(43.4, 57.7, 0.75, 2.1), '#120C08', rolle='detail'),
    E(kreis(42.6, 56.6, 0.7), '#FFFFFF', o=0.95, rolle='detail'),
    E('M52.4 57.6 C53.6 54.4 58.2 53.2 62.8 55 C63.4 58.6 60.6 61.6 56.8 61.6 C54.4 61.4 52.6 59.8 52.4 57.6 Z', AUGE, s=INK, sw=1.0, rolle='detail'),
    E(oval(57.8, 57.4, 1.1, 2.9), '#120C08', rolle='detail'),
    E(kreis(56.4, 55.9, 0.95), '#FFFFFF', o=0.95, rolle='detail'),
    E('M52 56.2 C54 53.2 59 52 63.6 54.2', s=INK, sw=1.0, rolle='detail'),
    # rosa Nase und kurzer Mund
    E('M36.4 64.4 C38.2 63.4 41.8 63.6 43.2 64.6 C42.6 66.4 40.8 68 39.6 68.2 C38.2 67.8 36.8 66.2 36.4 64.4 Z', NASE, s=INK, sw=0.8, rolle='detail'),
    E('M39.6 68.2 L39.8 70.8 M39.8 70.8 C38.6 71.8 37.4 72 36.6 71.6 M39.8 70.8 C41.2 71.8 42.8 72 44 71.6', s=INK, sw=0.8, rolle='detail'),
    # Tasthaare (weiß) und Fellstriche
    E('M37 70 C31 69 26 69.5 21.5 71 M37.5 72 C32 73 27.5 75 23.5 78.5 M48 70.5 C54 70 60 70.5 65 72 M48 72.5 C53 73.5 58 75.5 62 78.5', s='#F2EDE2', sw=0.6, o=0.85, rolle='detail'),
    E('M86 92 q2 4 1.5 9 M78 94 q2 4 1 8 M70 90 q1.5 4 0.5 8', s=FELL_D, sw=0.9, o=0.7, rolle='detail'),
]

speichern('wildkatze', ebenen, quellen=[
    {'titel': 'Referenzfoto „Felis silvestris silvestris“ (Michael Gäbler, CC BY 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Felis_silvestris_silvestris.jpg'},
    {'titel': 'Referenzfoto „European Wildcat Nationalpark Bayerischer Wald 02“ (Aconcagua, CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:European_Wildcat_Nationalpark_Bayerischer_Wald_02.jpg'},
])

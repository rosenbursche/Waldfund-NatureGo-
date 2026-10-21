# Dachs – Kopfporträt 3/4, Blick nach links: weißer Kopf mit schwarzen Längsstreifen über die Augen,
# kleine Ohren mit weißem Rand, silbergrauer Nacken, dunkle Kehle
import sys; sys.path.insert(0, 'scripts')
from icon_helfer import *
sys.path.insert(0, 'recherche/icons/dachs'); from drehen import drehe_pfad

GRAU, GRAU_D, GRAU_H = '#8D8982', '#57534D', '#B9B4AB'
WEISS, WEISS_D = '#EEEBE3', '#C8C3B8'
SCHWARZ, SCHWARZ_H = '#24201C', '#4A443D'

def linie(pts):
    return ' '.join(f'L{x} {y}' for x, y in pts)

teile = [
    # hinteres Ohr
    form('M84 52 C83 47 85.5 43.5 89.5 43.5 C93 43.8 94 47.5 92 52 Z', SCHWARZ),
    E('M84.6 48.5 C85.2 45.6 87.2 44.4 89.6 44.4 C92 44.6 93 46.4 92.8 48.6', s=WEISS, sw=1.2, rolle='detail'),
    # Kopf und Nacken (silbergrau)
    form('M28 67 C34 63 42 58 50 53 C56 49 62 46 68 45 C76 44 84 47 90 52 C96 57 102 62 106 68 L106 116 L54 116 C53 98 52 92 50 87 C45 83 38 79 33 76.5 C30 75.5 27.5 74 27 71.5 C26.6 69.5 27 68 28 67 Z', GRAU),
    # dunkle Kehle
    E('M50 87 C58 84 64 80 70 73 C71 84 70 96 70 116 L54 116 C53 98 52 92 50 87 Z', SCHWARZ, o=0.9, rolle='schatten'),
    # Schatten am Nacken, Licht auf dem Rücken
    E('M106 68 L106 116 L84 116 C86 92 90 80 99 64 Z', GRAU_D, o=0.8, rolle='schatten'),
    E('M80 47.5 C87 49.5 93 54 97 60 C91 57 85 55 78 54 Z', GRAU_H, o=0.8, rolle='licht'),
    # weißes Gesicht
    E('M28 67 C34 63 42 58 50 53 C56 49 62 46 68 45 C72 44.6 75 45 78 46.4 C77.5 55 75 63 70.5 70.5 C64.5 78.5 58 84 50 87 C45 83 38 79 33 76.5 C30 75.5 27.5 74 27 71.5 C26.6 69.5 27 68 28 67 Z', WEISS, s=INK, sw=0.9, rolle='detail'),
    E('M50 87 C58 84 64.5 78.5 70.5 70.5 C68 79 62 86 54 89.5 Z M33 76.5 C38 79 45 83 50 87 C44 85 37 81.5 32 78 Z', WEISS_D, o=0.8, rolle='schatten'),
    # fern liegender Streifen (Rand oben, zeigt die 3/4-Drehung)
    E('M53.5 50.8 C60 47 66 45.2 72.5 45 C75 45 77 45.6 78.2 46.4 C72 46.8 64 48.6 56 52.2 Z', SCHWARZ, rolle='detail'),
    # naher schwarzer Augenstreifen von der Schnauze bis zum Ohr
    E('M31 67.6 ' + linie([]) + 'C38 63.6 44 60 50 57.2 C56 54.4 62 52.2 68 51 C72 50.2 75.5 50 78 50.4 C77.8 54 77.2 57.6 76.4 61 C72 60.4 66 61 60 62.6 C53 64.6 45 67.6 38.6 70 C36 70.8 33.8 70.8 32.4 70.2 Z', SCHWARZ, s=INK, sw=0.6, rolle='detail'),
    E('M44 63.4 C50 60 58 56.6 66 54.6 C60 57.6 52 60.6 45.5 64.2 Z', SCHWARZ_H, o=0.9, rolle='licht'),
    # vorderes Ohr mit weißem Rand
    form('M73.5 53.5 C72 48 74.5 43 79 42.5 C83.5 42.4 85.4 46.2 84 51.4 C82 53.6 77 54.6 73.5 53.5 Z', SCHWARZ),
    E('M73.6 50 C73.4 46 75.6 43.4 79 43.2 C82.4 43.2 84.4 45.4 84.4 48.6', s=WEISS, sw=1.4, rolle='detail'),
    # Licht auf dem weißen Scheitelstreifen
    E('M36 63 C42 59.4 48 55.6 54 52.8', s='#FFFFFF', sw=1.2, o=0.6, rolle='licht'),
    # Nase
    E('M24 69.8 C24 67 26.6 65.6 29.4 66.4 C30.8 68.4 30.6 71.4 28.8 72.8 C26.6 72.6 24.4 71.6 24 69.8 Z', '#120D0A', rolle='detail'),
    E(oval(26.2, 67.8, 0.9, 0.55), '#F2EEE4', o=0.6, rolle='detail'),
    # Maulspalte
    E('M29.4 73.2 C33 74.6 36.6 75.2 40 75', s='#3A3029', sw=0.8, o=0.7, rolle='detail'),
    # kleines Auge im Streifen mit Glanzlicht
    E(oval(52.6, 61.2, 2.7, 2.1), '#6A5040', rolle='detail'),
    E(oval(52.5, 61.2, 1.8, 1.5), '#0B0806', rolle='detail'),
    E(kreis(51.8, 60.5, 0.75), '#FFFFFF', o=0.95, rolle='detail'),
    # grau melierte Fellstriche im Nacken
    E('M82 62 l3 7 M88 68 l3 8 M94 76 l2 8 M80 76 l2 8 M86 86 l2 8 M76 90 l1.5 8 M92 94 l1 7', s=GRAU_D, sw=0.9, o=0.7, rolle='detail'),
    E('M85 60 l2.5 6 M91 66 l2.5 6 M84 72 l2 7 M90 82 l2 7', s='#DAD5CC', sw=0.6, o=0.7, rolle='detail'),
]

# Kopf leicht angehoben (schnuppernd) – füllt die Scheibe besser
ebenen = hg_wald() + [dict(e, d=drehe_pfad(e['d'], 92, 104, 5, -3, 1)) for e in teile]

speichern('dachs', ebenen, quellen=[
    {'titel': "'Honey' – Dachs (Peter Trimming, geograph.org.uk, CC BY-SA 2.0)", 'url': 'https://commons.wikimedia.org/wiki/File:%27Honey%27_-_geograph.org.uk_-_2439869.jpg'},
    {'titel': 'Badger-badger (BadgerHero, CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Badger-badger.jpg'},
    {'titel': 'Badger (Andy Morffew, CC BY 2.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Badger_(51280963704).jpg'},
])

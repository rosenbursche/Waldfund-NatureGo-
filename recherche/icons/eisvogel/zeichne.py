import sys; sys.path.insert(0, 'scripts')
from icon_helfer import *
sys.path.insert(0, 'recherche/icons/eisvogel'); from _skal import skal
# Eisvogel: türkisblauer Kopf/Rücken, orange Brust und Wangenband, weißer Halsfleck, langer Dolchschnabel
BL, BL_D, BL_H = '#2385A0', '#14505F', '#58B7CB'
RU = '#2E9CC4'  # leuchtender Rückenstreif
OR, OR_D, OR_H = '#D5732E', '#94461A', '#EE9C58'
WEISS = '#F1ECE0'
punkte = [(56, 39.5), (61, 38), (66, 38.5), (71, 40.5), (53.5, 42.5), (58.5, 41.5), (63.5, 41.2), (68.5, 42.5), (73.5, 44), (75.5, 49)]
e = hg_licht() + [
    # Brust (orange)
    form('M50 58 C44 66 42 78 44 90 C45 96 46 101 47 106 L99 106 C99 90 95 70 83 57 C75 52 62 52 50 58 Z', OR),
    E('M58 106 C62 94 65 82 70 70 C72 84 74 96 76 106 Z', OR_D, o=0.75, rolle='schatten'),
    E('M48 68 C46 76 46 86 48 96 C49.5 86 50 76 52 66 Z', OR_H, o=0.8, rolle='licht'),
    # Flügel und Rücken (blaugrün), rechts
    form('M73 54 C84 57 92 67 96 79 C99 89 99.5 98 98.5 106 L75 106 C72 96 70 84 70 72 C70 64 70.5 58 73 54 Z', BL),
    E('M76 56 C84 62 89 72 91 84 C92 92 92 100 91.5 106 L86 106 C87 92 85 76 78 62 Z', RU, o=0.9, rolle='licht'),
    E('M98.5 106 C99.5 98 99 89 96 79 C95 90 93 99 91.5 106 Z', BL_D, o=0.85, rolle='schatten'),
    E('M75 106 C72 96 70 84 70 72 C72 84 75 96 79 106 Z', BL_D, o=0.7, rolle='schatten'),
]
kopf = [
    # Kopf (blaugrün)
    form('M47 46 C49 40 54 36 61 35 C68 34 75 37 78.5 43 C80.5 48 79.5 54 75.5 58 C70.5 62 62 63.5 55 61.5 C51 60.5 48 57.5 47 52 Z', BL),
    E('M78.5 43 C80.5 48 79.5 54 75.5 58 C70.5 62 62 63.5 55 61.5 C63 60 71 57 75.5 50 Z', BL_D, o=0.8, rolle='schatten'),
    E('M50.5 43 C53 39.5 57 37.5 62 37 C57.5 39 54.5 41.5 52.5 44.5 Z', BL_H, o=0.9, rolle='licht'),
    # weiße Kehle
    E('M48.2 54.5 C52 57.6 57 59.4 63 59.8 C60 61.6 55 62.2 51 60.6 C49.2 59.2 48.3 57 48.2 54.5 Z', '#EADFC8', o=0.95, rolle='detail'),
    # oranges Wangenband vom Zügel bis hinters Auge
    E('M48.5 49.2 C52.5 47.8 56.5 48.6 60 50.2 C64 50.8 68 49.4 72 48.6 C73.6 50.6 73.2 53 70.6 54.4 C66 55.4 62 55 58 54.6 C54 54.4 51 54 48.6 53.2 Z', OR, s=INK, sw=0.9, rolle='detail'),
    E(oval(53.2, 46.6, 2.6, 1.6), OR_H, rolle='detail'),
    # weißer Halsfleck hinter dem Ohrfleck
    E('M72.4 47.6 C75.4 46.6 78.6 47.8 80 50.6 C78.6 53.8 76 55.4 72.6 55 C74.2 52.8 74.2 50.2 72.4 47.6 Z', WEISS, s=INK, sw=0.9, rolle='detail'),
    # hellblaue Pünktchen auf dem Scheitel und Flecken auf dem Flügel
] + [E(oval(x, y, 1.1, 0.7), '#8FD3DC', o=0.85, rolle='detail') for x, y in punkte] + [
    E('M80 66 q2 1 3 0 M84 72 q2 1 3 0 M79 76 q2 1 3 0 M86 80 q2 1 3 0 M81 86 q2 1 3 0 M88 90 q2 1 3 0', s='#8FD3DC', sw=0.8, o=0.75, rolle='detail'),
    # Dolchschnabel (lang, gerade, schwarz)
    form('M48 45.8 C40 48 32 51.5 25 55.8 C32 55.6 39 55.8 48.2 55 C47 52 47 48.8 48 45.8 Z', '#211E22'),
    E('M25 55.8 C32 55.6 40 55.2 48.2 55 C48 54 47.8 53 47.7 52 C40 53 32 54.2 25 55.8 Z', '#4A3A30', o=0.9, rolle='schatten'),
    E('M46 47.4 C40 49.2 34 51.4 29 53.6 C34 52.2 39 50.6 46.5 49.4 Z', '#5C5E66', o=0.8, rolle='licht'),
    # dunkles Auge mit Glanzlicht
    E(kreis(60.2, 46.4, 2.2), '#100C0A', s=INK, sw=0.6, rolle='detail'),
    E(kreis(59.5, 45.7, 0.75), '#FFFFFF', o=0.95, rolle='detail'),
]
# Kopf etwas größer – der Eisvogel hat einen großen Kopf auf kurzem Hals
e += [dict(x, d=skal(x['d'], 1.12, 66, 48)) for x in kopf]
speichern('eisvogel', e, quellen=[
    {'titel': 'Referenzfoto Common Kingfisher Alcedo atthis.jpg (CC BY-SA 2.5, Andreas Trepte)', 'url': 'https://commons.wikimedia.org/wiki/File:Common_Kingfisher_Alcedo_atthis.jpg'},
    {'titel': 'Referenzfoto Alcedo Atthis.jpg (CC BY-SA 4.0, Artemy Voikhansky)', 'url': 'https://commons.wikimedia.org/wiki/File:Alcedo_Atthis.jpg'},
])

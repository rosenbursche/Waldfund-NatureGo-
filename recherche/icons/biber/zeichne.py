# Biber – Kopfporträt 3/4, Blick nach links, taucht aus dem Wasser auf (Stil: docs/ICONS.md)
import sys
sys.path.insert(0, 'scripts')
from icon_helfer import *

FELL, FELL_D, FELL_H = '#7A4E2C', '#4C2F1A', '#A87148'
NASE, ZAHN, WASSER, WASSER_H = '#2A1C14', '#D9792A', '#2F4B48', '#7FA39C'

ebenen = hg_wald() + [
    # Kopf mit Rumpfansatz, nasse Fellspitzen am Nacken
    form('M100 96 C99 84 97 72 92.5 63 L94 60.2 L90.6 59.6 C89.6 57.6 88.6 55.8 87.4 54.2 L88.4 51 L85.2 51.8 C81.5 47 76.5 42.5 70.5 40 L69.6 37.4 L67 38 C65 36.4 63 35.4 59.5 35.4 C52 35.6 45 40 40 47 C35 51.5 31.5 56 29.5 60.5 C27.5 65 27.5 70 30 73.5 C32.5 77 36 78.5 40 78.5 C44 80.5 49 82 54 84 C58 87 60 92 61 96 Z', FELL),
    # kleines rundes Ohr dicht am Kopf
    form('M70 46.5 C70.5 42 74.5 40 78 41.5 C80.5 43 80.5 47 78 49.5 C75.5 50.5 72 50 70 46.5 Z', FELL_D),
    E('M72.2 46.4 C72.8 44 75 43 77 43.8 C77.6 45.6 76.6 47.4 74.6 47.8 Z', '#6A4128', rolle='detail'),
    # Schatten unten rechts
    E('M100 96 C99 84 97 72 92 62 C88 70 85 82 84 96 Z', FELL_D, o=0.85, rolle='schatten'),
    E('M54 84 C58 87 60 92 61 96 L69 96 C68 90 65 85 60 82 C58 82 56 83 54 84 Z', FELL_D, o=0.7, rolle='schatten'),
    E('M66 58 C72 60 76 66 77 74 C72 70 67 66 62 64 Z', FELL_D, o=0.45, rolle='schatten'),
    # Licht oben links
    E('M42 47.5 C48 41 55 37.5 63 38 C56 41 49 45.5 44.5 52.5 Z', FELL_H, o=0.9, rolle='licht'),
    E('M31 64 C32.5 59.5 36 55.5 40 53.5 C38 58 36.5 62 36 66 Z', FELL_H, o=0.75, rolle='licht'),
    # breite, stumpfe Schnauze (etwas heller) und Nase
    E('M29.5 62 C31 57.5 36 56 40 57.5 C43 59.5 43.5 66 41.5 71 C39 75 33 75.5 30 72.5 C28 69.5 28 65.5 29.5 62 Z', '#8E6040', o=0.8, rolle='licht'),
    E('M28.6 61.6 C29.4 58.4 32.6 57.2 35.6 58.2 C37 59.6 36.6 62.4 34.6 63.6 C32.6 64.6 29.8 64.2 28.6 61.6 Z', NASE, rolle='detail'),
    E(oval(31.6, 59.8, 1.2, 0.7), '#C9B8A6', o=0.6, rolle='detail'),
    E('M31.4 63.8 L31.6 67.4 C30.6 68.8 29.6 69 28.8 68.6 M31.6 67.4 C33 68.8 34.6 69.2 36 68.8', s=NASE, sw=0.8, rolle='detail'),
    # orange Nagezähne
    E('M30.6 68.8 L37 69.2 L36.6 75.4 C34.8 76.4 32.4 76.4 31 75.6 Z', ZAHN, s=INK, sw=0.8, rolle='detail'),
    E('M31.6 69.6 L33.2 69.7 L33.1 75 L31.9 74.8 Z', '#F2B06A', o=0.85, rolle='detail'),
    E('M33.8 69.2 L33.7 76.1', s=INK, sw=0.6, rolle='detail'),
    # kleines Auge mit Glanzlicht
    E(oval(51, 53.5, 2.7, 2.3), '#120C08', rolle='detail'),
    E(kreis(50.1, 52.6, 0.85), '#FFFFFF', o=0.9, rolle='detail'),
    E('M47.6 51.2 C49.4 49.6 52.6 49.4 54.6 51', s=FELL_D, sw=0.8, o=0.8, rolle='detail'),
    # nasses, strähniges Fell (Spitzen) und Tasthaare
    E('M62 68 q2.5 5 1 11 M66 70 q2 4 2.5 9 M74 74 q2 5 0.5 11 M78 72 q2.5 4 3 9 M86 70 q2 5 1 11 M90 75 q1.5 4 2.5 8 M47 80 q2 3 1.5 6', s=FELL_D, sw=0.9, o=0.75, rolle='detail'),
    # nasser Glanz auf dem Fell
    E('M46 45 C51 41.2 56 39.6 61 39.8', s='#D9B48C', sw=1.1, o=0.6, rolle='detail'),
    E('M36 55 C38 52.5 40.5 50.5 43 49.5', s='#D9B48C', sw=0.9, o=0.5, rolle='detail'),
    # Backe
    E('M44 62 C48 66 53 68 58 68', s=FELL_D, sw=0.8, o=0.6, rolle='detail'),
    E('M56 48 l3 -2 M62 46 l3 -1.5 M47 58 l3 -1', s='#C69468', sw=0.8, o=0.8, rolle='detail'),
    E('M36 66 C31 66 26 66.5 21.5 68 M37 68 C32 69.5 27.5 71.5 24 74.5 M38 65 C33 63 28 62.5 23 63', s='#E6DCCB', sw=0.6, o=0.8, rolle='detail'),
    # Wasser vor dem Körper mit Ringwellen
    E('M19 92 C35 88 50 87 62 89.5 C76 92 90 89 101 90 L101 102 L19 102 Z', WASSER, o=0.95, rolle='detail'),
    E('M26 93 C36 90.5 46 90.5 54 92 M66 92.5 C76 94.5 86 92.5 95 93.5 M40 97 C48 95.8 56 96 62 97', s=WASSER_H, sw=0.9, o=0.75, rolle='detail'),
]

speichern('biber', ebenen, quellen=[
    {'titel': 'Referenzfoto „Castor dents-haye“ (Sylvain Haye, CC BY-SA 3.0)', 'url': 'https://commons.wikimedia.org/wiki/File:Castor_dents-haye.jpg'},
    {'titel': 'Referenzfoto „European beaver sitting in snow close up“ (Warren Garst, CC BY-SA 4.0)', 'url': 'https://commons.wikimedia.org/wiki/File:European_beaver_sitting_in_snow_close_up_-_DPLA_-_91ceee45dcf84a61a16e556c881ac667.jpg'},
])

"""Kohlmeise – Kopf-und-Brust-Porträt, Blick nach links. Aufruf: python3 recherche/icons/kohlmeise/zeichne.py"""
import sys
sys.path.insert(0, 'scripts')
from icon_helfer import *


def hg_laub():
    # heller Himmel mit Laub (weich, ohne Kontur) – gemeinsam für die Vogel-Icons
    return [E(kreis(60, 60, 41), '#2F4838', rolle='detail'),
            E(kreis(40, 38, 24), '#6F9278', o=0.5, rolle='detail'),
            E(kreis(34, 32, 11), '#C3D4C6', o=0.35, rolle='detail'),
            E(kreis(90, 40, 16), '#5F8462', o=0.5, rolle='detail'),
            E(kreis(26, 76, 12), '#43663F', o=0.4, rolle='detail'),
            E(kreis(92, 82, 10), '#3B5A39', o=0.35, rolle='detail')]


SCHWARZ, SCHWARZ_H = '#1C1D22', '#424A5A'
GELB, GELB_D, GELB_H = '#DCC646', '#A08A26', '#EEDD7C'
OLIV, OLIV_D = '#8A9250', '#5E6634'
FL, FL_D, FL_H = '#5D6976', '#3F4851', '#8E9AA6'
WEISS, WEISS_D = '#F1EEE6', '#C9C6BC'

KOERPER = ('M45 44 C46 35 53 29.5 61 29.5 C70 29.5 77 35 79 43 C83 51 91 57 96 66 '
           'C100 76 101 92 100.5 106 L36 106 C33 94 34 80 39 70 C42 64 45 59 45 54 C45 51 44.5 49 45 47.5 Z')
KOPF = ('M45 44 C46 35 53 29.5 61 29.5 C70 29.5 77 35 79 43 C80.5 47 82 50 84.5 53 '
        'C80 58 76 61 71 62.5 C65 63.5 58 63.5 52 62.5 C49 61.5 46.5 60 45.5 57 C45 53 44.5 49.5 45 47.5 Z')
WANGE = 'M48.5 49.5 C54 46.5 64 46 72 48 C76 49.5 79 52 80.5 54.5 C76 58 70 59.8 63 59.8 C56 59.8 50.5 56.5 48.5 49.5 Z'
KRAWATTE = ('M46 58 C50 61.5 56 62.8 63 62.5 C61 68 59.5 74 59 82 C58.8 90 59.8 98 61 106 L53 106 '
            'C52 99 51.2 91 50.6 83 C50 76 48.5 70 46.5 66 C45.6 63 45.5 60 46 58 Z')
MANTEL = 'M84.5 53 C90 58 96 66 99 76 L101 106 L86 106 C86 90 82 76 75 66 C78 62 81.5 57 84.5 53 Z'
FLUEGEL = 'M80 77 C87 72 95 73 101 79 L101 106 L84 106 C80 97 78 87 80 77 Z'
SCHNABEL = 'M46 43.6 C42.5 44.6 39.5 45.8 36.5 47.2 C39.5 48.4 42.5 49.6 46.2 50.6 Z'

meise = hg_laub() + [
    form(KOERPER, GELB),
    # Schatten der gelben Brust (unten rechts, unter dem Flügel)
    E('M75 66 C82 76 86 90 86 106 L64 106 C66 96 68 84 70 74 C71 70 73 67 75 66 Z', GELB_D, o=0.55, rolle='schatten'),
    E('M42 70 C45 66 47 70 47 76 C45 84 42 92 41 100 C38 92 38 80 42 70 Z', GELB_H, o=0.8, rolle='licht'),
    form(MANTEL, OLIV),
    E('M92 64 C96 70 99 78 100 88 L101 106 L94 106 C95 92 94 76 92 64 Z', OLIV_D, o=0.7, rolle='schatten'),
    form(FLUEGEL, FL),
    E('M90 86 C94 84 98 85 101 87 L101 106 L92 106 C91 100 90 92 90 86 Z', FL_D, o=0.8, rolle='schatten'),
    E('M81.5 83 C87.5 78.5 94.5 78.5 100.5 82.5', s=WEISS, sw=2.4, rolle='detail'),
    E('M82 92 C87 89 93 89 99 91 M83.5 100 C88 97.5 93 97.5 98 99.5', s=FL_H, sw=0.9, o=0.8, rolle='detail'),
    E('M80.5 79 C82 86 83 95 85 106', s=WEISS_D, sw=0.8, o=0.7, rolle='detail'),
    E('M81 78 C87 73.5 94 74 99.5 78.5 C93 76.5 87 77 81.5 80.5 Z', OLIV, o=0.8, rolle='licht'),
    # schwarzer Kopf und Krawatte
    form(KOPF, SCHWARZ),
    form(KRAWATTE, SCHWARZ),
    E('M47.5 40 C49.5 34 55 31 61.5 31 C67.5 31 72 33.5 74.5 37 C68 34.8 61 35 55.5 37.5 C52 39 49.5 40.5 47.5 40 Z', SCHWARZ_H, o=0.9, rolle='licht'),
    E('M51.5 72 C52.5 78 53 86 53.6 96 C52 90 51 82 50.8 75 Z', SCHWARZ_H, o=0.55, rolle='licht'),
    # weiße Wange
    form(WANGE, WEISS),
    E('M58 59.6 C66 59.8 74 57.5 80.5 54.5 C78 57.5 73 60 67 61 Z', WEISS_D, o=0.9, rolle='schatten'),
    # Federstruktur: feine Striche auf gelber Brust
    E('M60 70 q2 2 1.5 5 M66 76 q2 2 1.5 5 M62 84 q2 2 1.5 5 M70 88 q2 2 1.5 5 M64 95 q2 2 1.5 5 M40 84 q1.5 2 1 4',
      s=GELB_D, sw=0.6, o=0.45, rolle='detail'),
    # kurzer spitzer Kegelschnabel
    form(SCHNABEL, '#2A2A2E'),
    E('M44.5 44.4 C42 45.2 40 46 38.4 46.8 C40.5 46.6 43 46.4 45 46.4 Z', '#6A6E78', o=0.9, rolle='licht'),
    # Auge mit Glanzlicht (im schwarzen Kopf)
    E(kreis(55.2, 42.4, 3.0), '#3A3E48', rolle='detail'),
    E(kreis(55.2, 42.4, 2.3), '#07070A', rolle='detail'),
    E(kreis(54.3, 41.5, 0.9), '#FFFFFF', o=0.95, rolle='detail'),
]

speichern('kohlmeise', meise, quellen=[
    {'titel': 'Referenzfoto Great Tit (Parus major) 1 – Darkone, CC BY-SA 2.5',
     'url': 'https://commons.wikimedia.org/wiki/File:Great_Tit_(Parus_major)_1.jpg'},
    {'titel': 'Referenzfoto Great tit - Parus major – Francis Franklin, CC BY-SA 4.0',
     'url': 'https://commons.wikimedia.org/wiki/File:Great_tit_-_Parus_major.jpg'},
])
print('kohlmeise geschrieben')

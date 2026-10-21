"""Winterlinde (Tilia cordata): kleines herzförmiges, gesägtes Blatt, Unterseite blaugrün mit rostbraunen
Achselbärten; Fruchtstand mit Hochblatt und vielen (5–11) kleinen kugeligen Nüsschen."""
import sys
sys.path.insert(0, 'recherche/icons/winterlinde')
from linde import *  # noqa

speichern('winterlinde', linde('winterlinde'), quellen=[
    {'titel': 'Referenzfoto: Tilia cordata Greenspire 0zz (Blatt)', 'url': 'https://commons.wikimedia.org/wiki/File:Tilia_cordata_Greenspire_0zz.jpg'},
    {'titel': 'Referenzfoto: Daniel Fuchs – Tilia cordata Fruits', 'url': 'https://commons.wikimedia.org/wiki/File:Daniel_Fuchs.CC-BY-SA.Tilia_cordata.Fruits.jpg'},
])
print('winterlinde geschrieben')

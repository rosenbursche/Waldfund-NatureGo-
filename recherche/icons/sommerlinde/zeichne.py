"""Sommerlinde (Tilia platyphyllos): großes, weich behaartes herzförmiges Blatt (Oberseite);
Fruchtstand mit Hochblatt und nur 2–5 größeren, deutlich gerippten Nüssen."""
import sys
sys.path.insert(0, 'recherche/icons/winterlinde')
from linde import *  # noqa

speichern('sommerlinde', linde('sommerlinde'), quellen=[
    {'titel': 'Referenzfoto: Lipa list i plod (Blatt und Frucht)', 'url': 'https://commons.wikimedia.org/wiki/File:Lipa_list_i_plod.jpg'},
    {'titel': 'Referenzfoto: 20130623Tilia platyphyllos', 'url': 'https://commons.wikimedia.org/wiki/File:20130623Tilia_platyphyllos.jpg'},
])
print('sommerlinde geschrieben')

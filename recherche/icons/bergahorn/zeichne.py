"""Bergahorn (Acer pseudoplatanus): 5-lappiges, derbes Blatt, Lappen stumpf gekerbt-gesägt, Buchten SPITZ und eng;
Stiel oft rötlich; Flügelfrüchte im spitzen bis rechten Winkel, Nüsschen kugelig."""
import sys, math
sys.path.insert(0, 'scripts')
sys.path.insert(0, 'recherche/icons/rotbuche')
from icon_helfer import *  # noqa
from baum_helfer import *  # noqa

GRUEN = ('#3E6E2E', '#21421A', '#6B9A4A')
ADER = '#A8C27C'
LAPPEN = [(-124, 18), (-60, 30), (0, 34), (60, 30), (124, 18)]
BUCHTEN = [(1.0, 'k'), (11, 'k'), (13, 'k'), (13, 'k'), (11, 'k')]


def kante_fn(i, A, B, zur_spitze):
    L = LAPPEN[i][1]
    n = 4 if L > 25 else 2
    zaehne = []
    for k in range(n):
        u = 0.36 + 0.5 * k / max(n - 1, 1)
        zaehne.append((u if zur_spitze else 1 - u, 1.9 if L > 25 else 1.3, 0.1, 'c'))
    if not zur_spitze:
        zaehne = zaehne[::-1]
    return kante(A, B, 0.3, zaehne, spitze_bei_B=zur_spitze, breiteste=0.32)


def spitze_fn(i, w, L):
    t = pol(w, L)
    return [(t[0], t[1], 'k')]


pts, bidx, spitzen = ahorn_umriss(LAPPEN, BUCHTEN, kante_fn, spitze_fn)
S, GRAD, X, Y = 1.02, -12, 52, 63

T = lambda p: tf(p, S, GRAD, X, Y)
ebenen = hg_wald()
# rötlicher, langer Blattstiel in Verlängerung der Mittelachse
ebenen.append(form(band(T([(0, 1), (1.5, 16), (4, 34)]), 2.2, 2.6), '#A3523E'))
ebenen += ahorn_ebenen(pts, bidx, LAPPEN, S, GRAD, X, Y, GRUEN, ADER, schatten_o=0.5, licht_o=0.4)
# Flügelfrüchte (Paar, Winkel etwa 70°) rechts, hängend an kurzem Stiel
FR = ('#C49A72', '#86603F', '#E4C49E')
FX, FY = 85, 66
ebenen.append(form(band([(FX - 4, FY - 16), (FX - 1.5, FY - 8), (FX, FY - 1)], 1.6, 1.4), '#8A6A44'))
ebenen += fluegelfrucht(FX - 1.5, FY, 180 + 30, 1.0, FR, nuss_r=3.5, nuss_farbe='#A87C56')
ebenen += fluegelfrucht(FX + 1.5, FY, 180 - 30, 1.0, FR, nuss_r=3.5, spiegeln=True, nuss_farbe='#A87C56')

speichern('bergahorn', ebenen, quellen=[
    {'titel': 'Referenzfoto: Acer pseudoplatanus leaf Weinsberg 20070506',
     'url': 'https://commons.wikimedia.org/wiki/File:Acer_pseudoplatanus_leaf_Weinsberg_20070506.jpg'},
    {'titel': 'Referenzfoto: Auró Acer pseudoplatanus samaras',
     'url': 'https://commons.wikimedia.org/wiki/File:Aur%C3%B3_Acer_pseudoplatanus_samaras.jpg'},
])
print('bergahorn geschrieben')

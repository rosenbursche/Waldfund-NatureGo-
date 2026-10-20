"""Vogelkirsche: großes, eiförmig-längliches, gesägtes Blatt mit zwei roten Drüsen am Stiel + zwei dunkelrote Kirschen an langen Stielen."""
import sys, math
sys.path.insert(0, 'recherche/icons/waldkiefer')
from baum3_helfer import *

BLATT = ('#4C7D34', '#2E521E', '#7EA858')
KIRSCHE = ('#7E1626', '#480A14', '#B4404E')
STIEL = ('#7E9A44', '#536A26', '#A8C072')
ZWEIG = ('#6E4A3C', '#462C22', '#9A7464')
DRUESE = '#B2343A'
# rechte Blatthälfte: verkehrt-eiförmig-länglich, vorn lang zugespitzt
HALB = [(0, 0), (0.07, -0.04), (0.16, -0.16), (0.25, -0.36), (0.29, -0.54), (0.26, -0.7), (0.17, -0.82),
        (0.08, -0.91), (0.03, -0.96), (0, -1)]


def kirsche(cx, cy, r, stiel_von):
    t = [form(f'M{r1(cx)} {r1(cy - r * 0.78)} C{r1(cx + r * 0.5)} {r1(cy - r * 1.12)} {r1(cx + r * 1.08)} {r1(cy - r * 0.6)} '
              f'{r1(cx + r * 1.0)} {r1(cy + r * 0.05)} C{r1(cx + r * 0.95)} {r1(cy + r * 0.75)} {r1(cx + r * 0.45)} {r1(cy + r * 1.0)} '
              f'{r1(cx)} {r1(cy + r * 1.0)} C{r1(cx - r * 0.45)} {r1(cy + r * 1.0)} {r1(cx - r * 0.95)} {r1(cy + r * 0.75)} '
              f'{r1(cx - r * 1.0)} {r1(cy + r * 0.05)} C{r1(cx - r * 1.08)} {r1(cy - r * 0.6)} {r1(cx - r * 0.5)} {r1(cy - r * 1.12)} '
              f'{r1(cx)} {r1(cy - r * 0.78)} Z', KIRSCHE[0])]
    t.append(E(f'M{r1(cx + r * 0.95)} {r1(cy - r * 0.2)} C{r1(cx + r * 0.9)} {r1(cy + r * 0.8)} {r1(cx - r * 0.2)} {r1(cy + r * 1.1)} '
               f'{r1(cx - r * 0.75)} {r1(cy + r * 0.6)} C{r1(cx)} {r1(cy + r * 0.6)} {r1(cx + r * 0.6)} {r1(cy + r * 0.3)} {r1(cx + r * 0.95)} {r1(cy - r * 0.2)} Z',
               KIRSCHE[1], o=0.7, rolle='schatten'))
    t.append(E(oval(r1(cx - r * 0.42), r1(cy - r * 0.15), r1(r * 0.32), r1(r * 0.5)), KIRSCHE[2], o=0.6, rolle='licht'))
    t.append(E(oval(r1(cx - r * 0.45), r1(cy - r * 0.35), r1(r * 0.14), r1(r * 0.22)), '#F6E2E2', o=0.85, rolle='detail'))
    # Stielgrube
    t.append(E(f'M{r1(cx - r * 0.25)} {r1(cy - r * 0.72)} Q{r1(cx)} {r1(cy - r * 0.5)} {r1(cx + r * 0.25)} {r1(cy - r * 0.72)}',
               s=KIRSCHE[1], sw=0.7, o=0.8, rolle='detail'))
    return t


ebenen = hg_licht()
# Zweig oben rechts
ebenen += zweig([(106, 34), (92, 38), (78, 43)], 4.2, 3.4, ZWEIG)
ebenen.append(E('M96 35.5 l3 0.6 M88 39 l2.6 0.4', s='#C8A898', sw=0.7, o=0.8, rolle='detail'))  # Korkporen (quer)
# Blattstiel mit zwei Drüsen, großes Blatt nach unten links
st = [(80, 43), (72, 47), (64, 53)]
ebenen += zweig(st, 1.9, 1.6, STIEL, licht=False)
ebenen.append(E(kreis(68.6, 48.6, 1.7) + ' ' + kreis(66.6, 51.4, 1.6), DRUESE, s=INK, sw=0.6, rolle='detail'))
ebenen += blatt(HALB, 64, 53, 54, -124, BLATT, n_zaehne=16, amp=0.03, doppelt=True, adern=8, schatten_seite=-1,
                ader_neigung=0.12)
# zwei Kirschen an langen Stielen aus einem Punkt (paarweise)
basis = (82, 44)
for e, rk in (((71, 80), 6.6), ((86, 84), 7.0)):
    m = ((basis[0] + e[0]) / 2 + 3, (basis[1] + e[1]) / 2)
    ebenen += zweig([basis, m, (e[0], e[1] - rk * 0.7)], 1.3, 1.1, STIEL, licht=False)
ebenen += kirsche(71, 80, 6.6, basis)
ebenen += kirsche(86, 84, 7.0, basis)

speichern('vogelkirsche', ebenen, quellen=quellen('vogelkirsche'))

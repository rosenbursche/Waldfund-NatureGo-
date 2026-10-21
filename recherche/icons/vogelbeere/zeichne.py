"""Vogelbeere (Eberesche): unpaarig gefiedertes Blatt (13 schmale, gesägte Fiedern) + Doldenrispe orangeroter Beeren."""
import sys, math, random
sys.path.insert(0, 'recherche/icons/waldkiefer')
from baum3_helfer import *

BLATT = ('#4E7E36', '#30521F', '#80A85C')
BEERE = ('#D9531F', '#962F10', '#F38C52')
STIEL = ('#8E8A4E', '#5E5A2E', '#B8B47A')
ZWEIG = ('#7E6E5C', '#4E4438', '#AA9C88')
# Fieder: schmal-länglich, Rand gesägt, kurz zugespitzt
FIEDER = [(0, 0), (0.1, -0.06), (0.16, -0.22), (0.17, -0.5), (0.15, -0.72), (0.09, -0.88), (0.03, -0.96), (0, -1)]

ebenen = hg_licht()
# Zweig unten rechts
ebenen += zweig([(106, 54), (94, 58), (82, 62)], 4.0, 3.2, ZWEIG)
ebenen.append(E(kreis(98, 56.5, 0.7) + ' ' + kreis(90, 59.5, 0.6), '#D2C2A6', o=0.8, rolle='detail'))

# --- Fiederblatt: Spindel von rechts unten nach links oben, 6 Fiederpaare + Endfieder
sp = [(84, 60), (66, 48), (48, 38), (30, 30)]
g = richtung(sp[0], sp[-1])
ebenen += zweig(sp, 2.0, 1.3, BLATT, licht=False)
q = neu_abtasten(catmull(sp, 8), 60)
paare = []
for i in range(6):
    p = q[8 + i * 8]
    L = 15 - i * 0.5
    paare.append((p, L))
# erst die oberen (hinteren) Fiedern, dann die unteren (vorderen)
for p, L in paare:
    ebenen += blatt(FIEDER, r1(p[0]), r1(p[1]), L, g - 68, BLATT, n_zaehne=8, amp=0.035, adern=0,
                    schatten_seite=-1, ader_neigung=0.1)
for p, L in paare:
    ebenen += blatt(FIEDER, r1(p[0]), r1(p[1]), L, g + 72, BLATT, n_zaehne=8, amp=0.035, adern=0,
                    schatten_seite=1, ader_neigung=0.1)
ebenen += blatt(FIEDER, 31, 31, 15, g, BLATT, n_zaehne=8, amp=0.035, adern=0, schatten_seite=1)

# --- Doldenrispe orangeroter Beeren, unten Mitte
knoten = (72, 62)
ebenen += zweig([(82, 62), (77, 61), knoten], 2.4, 2.0, STIEL, licht=False)
random.seed(4)
strahlen = [(50, 76), (60, 82), (71, 85), (82, 82), (90, 74), (65, 74), (78, 74)]
for e in strahlen:
    m = ((knoten[0] + e[0]) / 2, (knoten[1] + e[1]) / 2 - 2)
    ebenen += zweig([knoten, m, e], 1.8, 1.4, STIEL, licht=False)
beeren, stielchen = [], []
for ex, ey in strahlen:
    for k in range(6):
        w = math.radians(-150 + k * 52 + random.uniform(-10, 10))
        r = 3.6 + random.uniform(0, 1.6)
        bx, by = ex + math.cos(w) * r, ey + math.sin(w) * r * 0.8
        stielchen.append(((ex, ey), (bx, by)))
        beeren.append((bx, by, 2.9 + random.uniform(-0.3, 0.3)))
    beeren.append((ex, ey + 1, 3.0))
for a, b in stielchen:
    ebenen.append(linie([a, b], STIEL[0], 0.9, 0.95))
for bx, by, r in sorted(beeren, key=lambda b: b[1]):
    ebenen += beere(r1(bx), r1(by), r1(r), BEERE, glanz=0.8)
    # dunkler Kelchrest (fünfzipflig) – typisch für Kernobstgewächse
    ebenen.append(E(kreis(r1(bx + r * 0.3), r1(by + r * 0.3), 0.6), '#3A1A0E', o=0.85, rolle='detail'))

speichern('vogelbeere', ebenen, quellen=quellen('vogelbeere'))

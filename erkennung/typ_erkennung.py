"""Was zeigt das Foto? Ganzes Lebewesen oder ein Fundstück (Trittsiegel, Losung, Feder, Fraßspur, Blatt, Rinde,
Knospe, Frucht)?

Per Text klappt das mit BioCLIP 2 nur in rund der Hälfte der Fälle (recherche/erkennung/fundstuecke-test.md, Variante D).
Darum ein kleiner gelernter Klassifikator auf den Bild-Fingerabdrücken: 768 Zahlen rein, 9 Wahrscheinlichkeiten raus.
Gelernt wird er mit typ_lernen.py, die Gewichte liegen in typ_klassifikator.npz (klein, im Repo).
"""
from pathlib import Path

import numpy as np
import torch
import torch.nn.functional as F

HIER = Path(__file__).resolve().parent
DATEI = HIER / 'typ_klassifikator.npz'
TYPEN = ['ganz', 'trittsiegel', 'losung', 'feder', 'frass', 'blatt', 'rinde', 'knospe', 'frucht']
SKALA = 30.0  # Fingerabdrücke haben Länge 1, die Skala macht die Unterschiede groß genug für das Lernen


class TypErkenner:
    def __init__(self, geraet, datei=DATEI):
        d = np.load(datei)
        assert list(d['typen']) == TYPEN, 'typ_klassifikator.npz passt nicht zu TYPEN'
        self.W = torch.tensor(d['W'], device=geraet)
        self.c = torch.tensor(d['c'], device=geraet)

    def wahrscheinlichkeiten(self, fingerabdruck):
        """→ {typ: Wahrscheinlichkeit}, zusammen 1."""
        p = F.softmax(SKALA * fingerabdruck @ self.W + self.c, dim=-1).cpu().numpy()
        return {t: float(x) for t, x in zip(TYPEN, p)}


def lernen(X, y, schritte=600, lr=0.01, l2=1e-3):
    """X: (n, 768) Fingerabdrücke, y: Index in TYPEN. Seltene Typen zählen stärker (Klassengewichte)."""
    W = torch.zeros(X.shape[1], len(TYPEN), requires_grad=True)
    c = torch.zeros(len(TYPEN), requires_grad=True)
    n = torch.bincount(y, minlength=len(TYPEN)).float().clamp(min=1)
    gewicht = (n.sum() / n) / len(TYPEN)
    opt = torch.optim.Adam([W, c], lr=lr)
    for _ in range(schritte):
        opt.zero_grad()
        verlust = F.cross_entropy(SKALA * X @ W + c, y, weight=gewicht) + l2 * (W ** 2).sum()
        verlust.backward()
        opt.step()
    return W.detach(), c.detach()

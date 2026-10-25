"""Die eigentliche Erkennung: Foto rein, Art mit Sicherheit raus.

Ablauf:
1. BioCLIP 2 macht aus dem Foto einen Fingerabdruck (Vektor).
2. Vorauswahl: nur Arten, die in Frage kommen. Heute: alle Arten in Deutschland ohne Mischlinge (×), optional nur
   eine Gruppe (Säugetiere, Vögel, Pflanzen, Pilze). Später: nur Arten aus diesem Rasterfeld und diesem Monat.
3. Vergleich mit den vorher berechneten Fingerabdrücken aller Arten (daten/artvektoren.npz).
   Dazu Vorwissen: Häufige Arten (viele GBIF-Nachweise in Deutschland) werden etwas bevorzugt. Im Test vom
   25.10.2026 stieg Top-1 damit von 76 % auf 89 % (erkennung/README.md).
4. Entscheidung: sicher (ab 90 %), nur Gattung sicher, oder unsicher (die App fragt nach).
"""
import json
import time
from pathlib import Path

import numpy as np
import open_clip as oc
import torch
import torch.nn.functional as F
from bioclip.predict import preprocess_img  # gleiche Bildvorbereitung wie im ersten Test

HIER = Path(__file__).resolve().parent
SCHWELLE = 0.90  # ab hier gilt eine Erkennung als sicher (recherche/erkennung/bioclip2-test.md)
VORWISSEN = 0.5  # Gewicht der Häufigkeit: logit + 0,5 · ln(1 + Nachweise). Im Test besser als 0, 1, 1,5 und 2
GEGEN_NACHWEISE = 1000  # Gegenklassen haben keine Wildnachweise, zählen für das Vorwissen wie eine mittlere Art
VORSCHLAEGE = 6  # so viele Kandidaten zeigt die App zur Auswahl (Gesamtkonzept Abschnitt 17)
PILZ_HINWEIS = 'Die Erkennung sagt nie, ob ein Pilz essbar ist. Nichts essen, was nicht Pilzsachverständige geprüft haben.'


class Erkenner:
    def __init__(self, datei=HIER / 'daten' / 'artvektoren.npz'):
        t0 = time.time()
        d = np.load(datei)
        self.arten = json.loads(str(d['meta']))
        self.gruppen = np.array([a['gruppe'] for a in self.arten])
        self.gattungen = np.array([a['wiss'].split()[0] for a in self.arten])
        self.geraet = 'mps' if torch.backends.mps.is_available() else 'cuda' if torch.cuda.is_available() else 'cpu'
        self.vektoren = torch.tensor(d['vektoren'], dtype=torch.float32, device=self.geraet)
        self.skala = float(d['logit_scale'])
        self.gegen = np.array([a['gegen'] for a in self.arten])
        self.mischling = np.array(['×' in a['wiss'] for a in self.arten])
        nachweise = np.array([GEGEN_NACHWEISE if a['gegen'] else a['nachweise'] for a in self.arten], dtype=np.float32)
        self.vorwissen = torch.tensor(VORWISSEN * np.log1p(nachweise), device=self.geraet)
        self.modell = oc.create_model('hf-hub:imageomics/bioclip-2', require_pretrained=True).to(self.geraet).eval()
        self.ladezeit = time.time() - t0

    def fingerabdruck(self, bild):
        with torch.no_grad():
            x = preprocess_img(bild.convert('RGB')).unsqueeze(0).to(self.geraet)
            return F.normalize(self.modell.encode_image(x).float(), dim=-1)[0]

    def erkennen(self, bild, gruppe=None, kandidaten=None, fingerabdruck=None):
        """gruppe: z. B. 'pflanzen'. kandidaten: Liste von Art-IDs (Vorauswahl nach Ort und Monat, später).
        fingerabdruck: schon berechneter Fingerabdruck (dann wird bild nicht gebraucht)."""
        t0 = time.time()
        f = self.fingerabdruck(bild) if fingerabdruck is None else fingerabdruck
        maske = ~self.mischling
        if gruppe:
            maske &= self.gruppen == gruppe
        if kandidaten is not None:
            erlaubt = set(kandidaten)
            maske &= np.array([a['id'] in erlaubt or a['gegen'] for a in self.arten])
        maske |= self.gegen  # Gegenklassen sind immer dabei
        idx = np.nonzero(maske)[0]
        logits = self.skala * (self.vektoren[idx] @ f) + self.vorwissen[idx]
        p = F.softmax(logits, dim=0).cpu().numpy()
        ordnung = np.argsort(-p)

        top = [self._art(idx[i], p[i]) for i in ordnung[:VORSCHLAEGE]]
        # Wahrscheinlichkeit je Gattung: Wenn das Modell zwischen Arten schwankt, ist oft die Gattung sicher
        gat = {}
        for i, wert in zip(idx, p):
            gat[self.gattungen[i]] = gat.get(self.gattungen[i], 0.0) + float(wert)
        gattung, gattung_p = max(gat.items(), key=lambda x: x[1])

        erste = top[0]
        if erste['gegenklasse'] and erste['sicherheit'] >= 0.5:
            status = 'kein_wildfund'
        elif erste['sicherheit'] >= SCHWELLE:
            status = 'sicher'
        elif gattung_p >= SCHWELLE:
            status = 'gattung'
        else:
            status = 'unsicher'
        return {
            'status': status,  # sicher | gattung | unsicher | kein_wildfund
            'art': erste if status == 'sicher' else None,
            'gattung': {'name': gattung, 'sicherheit': round(gattung_p, 3)} if status == 'gattung' else None,
            'vorschlaege': top,
            'kandidaten': int(len(idx)),
            'hinweis': PILZ_HINWEIS if any(t['gruppe'] == 'pilze' for t in top[:3]) else None,
            'sekunden': round(time.time() - t0, 2),
        }

    def _art(self, i, wert):
        a = self.arten[i]
        return {'id': a['id'], 'name': a['de'] or a['wiss'], 'wiss': a['wiss'], 'gruppe': a['gruppe'],
                'gegenklasse': a['gegen'], 'sicherheit': round(float(wert), 3)}

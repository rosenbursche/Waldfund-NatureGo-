"""Berechnet einmal den „Fingerabdruck“ (Vektor) jeder Art, die die Erkennung kennen soll.

    venv/bin/python artvektoren.py

Grundlage sind alle Arten der Datenbank (db/wildfund.sqlite, Stufe A Deutschland) plus die Gegenklassen
(gegenklassen.json: Haustiere und Menschen).

Woher der Vektor einer Art kommt:
1. Aus den fertigen Text-Vektoren von BioCLIP 2 (TreeOfLife-200M, „an image of <Systematik> with common name <Name>“),
   wenn die Art dort vorkommt. Mehrere Einträge einer Art werden gemittelt.
2. Sonst mit demselben Verfahren selbst berechnet, aus der Systematik in unserer Datenbank.
Später kommen Bild-Vektoren aus eigenen Referenzbildern dazu (Lizenz je Bild geprüft).

Ergebnis: daten/artvektoren.npz (nicht im Repo, wird neu erzeugt).
"""
import json
import os
import sqlite3
import sys
import time
from pathlib import Path

import numpy as np
import open_clip as oc
import torch
import torch.nn.functional as F
from huggingface_hub import hf_hub_download

HIER = Path(__file__).resolve().parent
DB = HIER.parent / 'db' / 'wildfund.sqlite'
AUS = HIER / 'daten' / 'artvektoren.npz'
# Reparierte Text-Vektoren aus dem ersten Test (in der veröffentlichten Datei fehlen u. a. Nadelbäume, siehe
# recherche/erkennung/bioclip2-test.md). Ohne diese Datei werden fehlende Arten einfach selbst berechnet.
REPARIERT = os.environ.get('WILDFUND_TOL_EMB')

# Obere Ränge je Gruppe, wie sie im TreeOfLife-Text vorkommen
OBEN = {
    'saeuger': ['Animalia', 'Chordata'],
    'voegel': ['Animalia', 'Chordata'],
    'pflanzen': ['Plantae', 'Tracheophyta'],
    'baeume': ['Plantae', 'Tracheophyta'],
    'pilze': ['Fungi', 'Basidiomycota'],
}


def arten_laden():
    con = sqlite3.connect(DB)
    zeilen = con.execute(
        """SELECT a.id, a.gruppe, a.wiss_name, a.klasse, a.ordnung, a.familie,
                  (SELECT name FROM name WHERE art_id = a.id AND sprache = 'de' AND haupt = 1),
                  (SELECT name FROM name WHERE art_id = a.id AND sprache = 'en' AND haupt = 1),
                  COALESCE((SELECT nachweise FROM vorkommen WHERE art_id = a.id AND gebiet = 'DE'), 0)
           FROM art a ORDER BY a.id"""
    ).fetchall()
    arten = [
        dict(id=z[0], gruppe=z[1], wiss=z[2], klasse=z[3], ordnung=z[4], familie=z[5], de=z[6], en=z[7],
             nachweise=z[8], gegen=False)
        for z in zeilen
    ]
    gegen = json.loads((HIER / 'gegenklassen.json').read_text())['klassen']
    vorhanden = {a['wiss']: a for a in arten}
    for g in gegen:
        if g['wiss'] in vorhanden:  # z. B. Hauskatze steht durch Nachweise schon in der Liste
            vorhanden[g['wiss']].update(gegen=True, de=g['de'])
        else:
            arten.append(dict(id=g['id'], gruppe=g['gruppe'], wiss=g['wiss'], klasse=None, ordnung=None, familie=None,
                              de=g['de'], en=None, nachweise=0, gegen=True))
    return arten


def main():
    t0 = time.time()
    arten = arten_laden()
    print(f'{len(arten)} Arten (davon {sum(a["gegen"] for a in arten)} Gegenklassen)')

    js = hf_hub_download('imageomics/TreeOfLife-200M', 'embeddings/txt_emb_species.json', repo_type='dataset')
    npy = REPARIERT or hf_hub_download('imageomics/TreeOfLife-200M', 'embeddings/txt_emb_species.npy',
                                       repo_type='dataset')
    namen = json.load(open(js))  # [[7 Ränge], englischer Name]
    emb = np.load(npy, mmap_mode='r')  # (768, N)

    # Schlüssel „Gattung Art“ und für Unterarten „Gattung Art Unterart“
    index = {}
    for i, (raenge, _) in enumerate(namen):
        if len(raenge) >= 7 and raenge[5] and raenge[6]:
            index.setdefault(f'{raenge[5]} {raenge[6]}', []).append(i)
    print(f'TreeOfLife: {len(namen)} Einträge, {len(index)} Artnamen')

    vektoren = np.zeros((len(arten), emb.shape[0]), dtype=np.float32)
    selbst = []
    for k, a in enumerate(arten):
        teile = a['wiss'].split()
        schluessel = ' '.join(teile[:2])
        spalten = index.get(schluessel) if len(teile) == 2 else None
        if spalten:
            v = np.asarray(emb[:, spalten], dtype=np.float32).mean(axis=1)
            if np.linalg.norm(v) > 0:
                vektoren[k] = v / np.linalg.norm(v)
                a['quelle'] = 'tol'
                continue
        selbst.append(k)

    # Fehlende Arten (und Unterarten wie der Haushund) selbst berechnen
    geraet = 'mps' if torch.backends.mps.is_available() else 'cpu'
    modell = oc.create_model('hf-hub:imageomics/bioclip-2', require_pretrained=True).to(geraet).eval()
    tok = oc.get_tokenizer('hf-hub:imageomics/bioclip-2')
    texte = []
    for k in selbst:
        a = arten[k]
        teile = a['wiss'].split()
        raenge = OBEN.get(a['gruppe'], []) + [r for r in (a['klasse'], a['ordnung'], a['familie']) if r] + teile
        name = f' with common name {a["en"]}' if a['en'] else ''
        texte.append(f'an image of {" ".join(raenge)}{name}.')
    with torch.no_grad():
        for s in range(0, len(texte), 256):
            f = F.normalize(modell.encode_text(tok(texte[s:s + 256]).to(geraet)).float(), dim=-1).cpu().numpy()
            for j, k in enumerate(selbst[s:s + 256]):
                vektoren[k] = f[j]
                arten[k]['quelle'] = 'selbst'

    AUS.parent.mkdir(exist_ok=True)
    np.savez_compressed(
        AUS,
        vektoren=vektoren.astype(np.float16),
        ids=np.array([a['id'] for a in arten]),
        meta=np.array(json.dumps(arten, ensure_ascii=False)),
        logit_scale=np.array(modell.logit_scale.exp().item()),
    )
    print(f'aus TreeOfLife: {len(arten) - len(selbst)}, selbst berechnet: {len(selbst)}')
    print(f'gespeichert: {AUS} ({AUS.stat().st_size / 1e6:.1f} MB) in {time.time() - t0:.0f} s')


if __name__ == '__main__':
    sys.exit(main())

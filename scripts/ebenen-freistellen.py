#!/usr/bin/env python3
"""
Stellt die ChatGPT-Ebenen einer Diorama-Szene frei: macht den Magenta-Hintergrund (#FF00FF)
durchsichtig, entfernt den pinken Saum an den Kanten und speichert kleine WebP-Dateien.

Ausführen:   python3 scripts/ebenen-freistellen.py assets/szene/heide-daemmerung
Ergebnis:    assets/szene/heide-daemmerung/fertig/0-himmel.webp … 5-vordergrund.webp
             plus vorschau.png (alle Ebenen übereinander, zum Prüfen)

Braucht: Python 3 mit Pillow und numpy, außerdem `cwebp` (brew install webp).
Prompts für die Bilder: docs/SZENE-PROMPTS.md
"""
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

BREITE, HOEHE = 1024, 1536
# Ebenen ohne Freistellen (füllen das ganze Bild)
VOLL = {"0-himmel"}
# Magenta-Anteil, ab dem ein Pixel halb bzw. ganz durchsichtig wird (0–1).
# Bewusst hoch: lila Heidekraut (etwa 0,3) darf nicht durchsichtig werden.
WEICH_AB, GANZ_AB = 0.5, 0.8


def magenta_anteil(rgb: np.ndarray) -> np.ndarray:
    """Wie stark ein Pixel nach Magenta aussieht: Rot und Blau hoch, Grün niedrig."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    return np.clip((np.minimum(r, b) - g) / 255.0, 0, 1)


def freistellen(bild: Image.Image) -> Image.Image:
    rgb = np.asarray(bild.convert("RGB"), dtype=np.float32)
    anteil = magenta_anteil(rgb)
    alpha = 1 - np.clip((anteil - WEICH_AB) / (GANZ_AB - WEICH_AB), 0, 1)
    # Pinker Saum: nur in einem schmalen Rand um die durchsichtigen Stellen Rot und Blau
    # auf das Grün-Niveau absenken – das Heidekraut mitten im Bild bleibt lila
    loch = Image.fromarray(((alpha < 0.99) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))
    ueberschuss = np.clip(np.minimum(rgb[..., 0], rgb[..., 2]) - rgb[..., 1], 0, None)
    saum = (np.asarray(loch) > 0)[..., None]
    rgb = np.where(saum, rgb - ueberschuss[..., None] * np.array([1, 0, 1], dtype=np.float32), rgb)
    rgba = np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit("Aufruf: python3 scripts/ebenen-freistellen.py assets/szene/<szenen-ordner>")
    ordner = Path(sys.argv[1])
    ziel = ordner / "fertig"
    ziel.mkdir(exist_ok=True)
    if not shutil.which("cwebp"):
        sys.exit("cwebp fehlt – installieren mit: brew install webp")

    dateien = sorted(p for p in ordner.glob("*.png") if p.stem != "hauptbild")
    if not dateien:
        sys.exit(f"Keine PNG-Ebenen in {ordner} gefunden.")
    vorschau = Image.new("RGBA", (BREITE, HOEHE), (11, 20, 20, 255))

    for datei in dateien:
        bild = Image.open(datei)
        if bild.size != (BREITE, HOEHE):
            print(f"  Hinweis: {datei.name} ist {bild.size[0]}×{bild.size[1]} – wird auf {BREITE}×{HOEHE} gebracht")
            bild = bild.resize((BREITE, HOEHE), Image.LANCZOS)
        ebene = bild.convert("RGBA") if datei.stem in VOLL else freistellen(bild)
        if datei.stem not in VOLL:
            durchsichtig = float((np.asarray(ebene)[..., 3] < 128).mean())
            if durchsichtig < 0.05:
                print(f"  Achtung: {datei.name} hat kaum Magenta – ist der Hintergrund wirklich #FF00FF?")
        zwischen = ziel / f"{datei.stem}.png"
        ebene.save(zwischen)
        webp = ziel / f"{datei.stem}.webp"
        subprocess.run(["cwebp", "-quiet", "-q", "82", "-alpha_q", "90", str(zwischen), "-o", str(webp)], check=True)
        zwischen.unlink()
        vorschau.alpha_composite(ebene)
        print(f"→ {webp}  ({webp.stat().st_size // 1024} KB)")

    vorschau.convert("RGB").save(ordner / "fertig" / "vorschau.png")
    print(f"→ {ziel / 'vorschau.png'} (alle Ebenen übereinander)")


if __name__ == "__main__":
    main()

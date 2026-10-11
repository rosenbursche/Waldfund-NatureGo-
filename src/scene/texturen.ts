import * as THREE from 'three';

/**
 * Weiche, runde Leuchttextur (in der Mitte hell, nach außen durchsichtig).
 * Wird im Code erzeugt statt als Bilddatei geladen – das funktioniert offline
 * und braucht keinen Speicherplatz.
 *
 * Damit entstehen: Lichthöfe um Fenster und Runensteine, Glühwürmchen, Nebelschwaden, Rauch.
 */
let leuchten: THREE.DataTexture | null = null;

export function leuchtTextur(): THREE.DataTexture {
  if (leuchten) return leuchten;
  const n = 64;
  const daten = new Uint8Array(n * n * 4);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const dx = (x + 0.5) / n - 0.5;
      const dy = (y + 0.5) / n - 0.5;
      const r = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2);
      // weicher Abfall: hell in der Mitte, sanft auslaufend
      const a = Math.pow(1 - r, 2.2);
      const i = (y * n + x) * 4;
      daten[i] = 255;
      daten[i + 1] = 255;
      daten[i + 2] = 255;
      daten[i + 3] = Math.round(a * 255);
    }
  }
  leuchten = new THREE.DataTexture(daten, n, n, THREE.RGBAFormat);
  leuchten.magFilter = THREE.LinearFilter;
  leuchten.minFilter = THREE.LinearFilter;
  leuchten.needsUpdate = true;
  return leuchten;
}

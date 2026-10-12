import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

/**
 * Rechenteil des LiDAR-Effekts (ohne React): Punkte auf den Flächen eines Modells verteilen,
 * Startwolke erzeugen, Materialien aus- und wieder einblenden.
 */
export const PUNKTE = 4000;
const EXEMPLAR = new THREE.Matrix4();

export type LidarZustand = {
  start: Float32Array; // Startpositionen (zufällige Wolke)
  ziel: Float32Array; // Positionen auf der Oberfläche
  hoehe: [number, number]; // min/max y für die Scan-Linie
  materialien: { m: THREE.Material & { opacity: number }; opacity: number; transparent: boolean }[];
  /** Modellteile – bleiben unsichtbar, bis das Einblenden beginnt (sonst verdecken sie die Punkte) */
  teile: THREE.Mesh[];
};

/** Modell-Materialien auf einen Anteil ihrer ursprünglichen Deckkraft setzen */
export function einblenden(z: LidarZustand, anteil: number): void {
  for (const t of z.teile) t.visible = anteil > 0;
  for (const { m, opacity } of z.materialien) m.opacity = opacity * anteil;
}

/** Materialien wieder genau so herstellen, wie sie vorher waren */
export function zuruecksetzen(z: LidarZustand | null): void {
  if (!z) return;
  for (const t of z.teile) t.visible = true;
  for (const { m, opacity, transparent } of z.materialien) {
    m.opacity = opacity;
    m.transparent = transparent;
    m.needsUpdate = true;
  }
}

/** Verteilt die Punkte auf allen sichtbaren Flächen und macht die Materialien durchsichtig. */
export function vorbereiten(g: THREE.Group, p: THREE.Points): LidarZustand | null {
  g.updateMatrixWorld(true);
  const zurueck = new THREE.Matrix4().copy(g.matrixWorld).invert();
  const meshes: { mesh: THREE.Mesh; flaeche: number }[] = [];
  g.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mat = mesh.material as THREE.Material & { opacity: number };
    if (Array.isArray(mesh.material) || mat.opacity === 0) return; // unsichtbare Tipp-Flächen überspringen
    const box = new THREE.Box3().setFromObject(mesh);
    const s = box.getSize(new THREE.Vector3());
    meshes.push({ mesh, flaeche: Math.max(1e-4, s.x * s.y + s.y * s.z + s.x * s.z) });
  });
  if (meshes.length === 0) return null;

  const gesamt = meshes.reduce((a, m) => a + m.flaeche, 0);
  const ziel = new Float32Array(PUNKTE * 3);
  const start = new Float32Array(PUNKTE * 3);
  const v = new THREE.Vector3();
  let i = 0;
  let ymin = Infinity;
  let ymax = -Infinity;
  for (const { mesh, flaeche } of meshes) {
    if (flaeche < 1e-3) continue; // ausgeblendete Teile (Größe ~0) überspringen
    const anzahl = Math.max(1, Math.round((flaeche / gesamt) * PUNKTE));
    const sampler = new MeshSurfaceSampler(mesh).build();
    // InstancedMesh (z. B. Blattbüschel): jedes Mal ein zufälliges Exemplar treffen
    const inst = (mesh as THREE.InstancedMesh).isInstancedMesh ? (mesh as THREE.InstancedMesh) : null;
    for (let k = 0; k < anzahl && i < PUNKTE; k++, i++) {
      sampler.sample(v);
      if (inst) v.applyMatrix4(inst.getMatrixAt(Math.floor(Math.random() * inst.count), EXEMPLAR));
      v.applyMatrix4(mesh.matrixWorld).applyMatrix4(zurueck);
      ziel.set([v.x, v.y, v.z], i * 3);
      ymin = Math.min(ymin, v.y);
      ymax = Math.max(ymax, v.y);
    }
  }
  // durch Rundung übrige Punkte auf schon gesetzte verteilen
  const gesetzt = Math.max(1, i);
  for (; i < PUNKTE; i++) {
    const q = (i % gesetzt) * 3;
    ziel.set([ziel[q], ziel[q + 1], ziel[q + 2]], i * 3);
  }

  // Start: jeder Punkt erscheint leicht versetzt (nach außen und oben) und setzt sich dann auf die Fläche
  for (let j = 0; j < PUNKTE; j++) {
    const w = j * 2.39996;
    const r = 0.12 + ((j * 0.618) % 1) * 0.22;
    start.set(
      [
        ziel[j * 3] + Math.cos(w) * r,
        ziel[j * 3 + 1] + 0.1 + ((j * 0.377) % 1) * 0.25,
        ziel[j * 3 + 2] + Math.sin(w) * r,
      ],
      j * 3,
    );
  }
  (p.geometry.attributes.position as THREE.BufferAttribute).array.set(start);

  // Modell zunächst unsichtbar (Materialien durchsichtig machen, später zurücksetzen)
  const materialien: LidarZustand['materialien'] = [];
  const gesehen = new Set<THREE.Material>();
  for (const { mesh } of meshes) {
    const m = mesh.material as THREE.Material & { opacity: number };
    if (gesehen.has(m)) continue;
    gesehen.add(m);
    materialien.push({ m, opacity: m.opacity, transparent: m.transparent });
    m.transparent = true;
    m.opacity = 0;
    m.needsUpdate = true;
  }
  const teile = meshes.map((x) => x.mesh);
  for (const t of teile) t.visible = false;
  return { start, ziel, hoehe: [ymin, ymax], materialien, teile };
}

/**
 * Punktpositionen für eine Scan-Höhe: Punkte unterhalb der Scan-Linie erscheinen und setzen
 * sich auf die Fläche; Punkte darüber sind noch nicht gescannt (unsichtbar unter dem Boden geparkt).
 */
export function lidarPunkteSetzen(z: LidarZustand, ziel: Float32Array, scanY: number): void {
  const [ymin, ymax] = z.hoehe;
  const band = Math.max(0.05, (ymax - ymin) * 0.2);
  for (let i = 0; i < PUNKTE; i++) {
    const zy = z.ziel[i * 3 + 1];
    if (zy > scanY) {
      ziel[i * 3] = 0;
      ziel[i * 3 + 1] = -100;
      ziel[i * 3 + 2] = 0;
      continue;
    }
    const k = 1 - Math.pow(1 - Math.min(1, (scanY - zy) / band), 3);
    for (let a = 0; a < 3; a++) ziel[i * 3 + a] = z.start[i * 3 + a] + (z.ziel[i * 3 + a] - z.start[i * 3 + a]) * k;
  }
}

/** Höhe der Scan-Linie für einen Fortschritt 0–1 (fährt bis kurz über das Modell, damit alle Punkte landen) */
export function scanHoehe(z: LidarZustand, fortschritt: number): number {
  const [ymin, ymax] = z.hoehe;
  return ymin + (ymax - ymin) * 1.25 * Math.max(0, Math.min(1, fortschritt));
}

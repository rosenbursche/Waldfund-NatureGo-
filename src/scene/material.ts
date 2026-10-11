import * as THREE from 'three';

/**
 * Geteilte Materialien und Formen.
 * Jede Farbe wird nur einmal als Material angelegt – das spart Grafikspeicher
 * und hält die Szene auch auf Mittelklasse-Handys flüssig.
 */
const materialien = new Map<string, THREE.MeshLambertMaterial>();

/** Mattes Low-Poly-Material (kantige Flächen) */
export function matt(farbe: string): THREE.MeshLambertMaterial {
  let m = materialien.get(farbe);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color: farbe, flatShading: true });
    materialien.set(farbe, m);
  }
  return m;
}

/** Farbe für noch nicht gefundene Arten: dunkle Silhouette im Nebel */
export const SILHOUETTE = '#16231F';

/** Farbe für noch nicht gefundene Arten im Kategorie-Wald: ausgegraut */
export const GRAU = '#6E7673';

/** Unsichtbares Material für größere Tipp-Flächen */
export const UNSICHTBAR = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });

// Grundformen mit wenigen Flächen (Low-Poly)
export const FORM = {
  kugel: new THREE.IcosahedronGeometry(1, 0),
  kugelFein: new THREE.IcosahedronGeometry(1, 1),
  kegel: new THREE.ConeGeometry(1, 1, 7),
  stamm: new THREE.CylinderGeometry(0.75, 1, 1, 6),
  kiste: new THREE.BoxGeometry(1, 1, 1),
  flach: new THREE.PlaneGeometry(1, 1),
  tannenSpitze: new THREE.CylinderGeometry(0.3, 1, 1, 7),
  trefferZylinder: new THREE.CylinderGeometry(1, 1, 1, 6),
};

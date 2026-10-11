import * as THREE from 'three';

import type { ModellParameter } from '@/data/artTypen';
import { colors } from '@/theme/theme';

/**
 * Baut das animierte 3D-Modell einer Art aus ihren Parametern.
 * Übertragen aus dem Prototyp (Funktion "build"), Formen und Bewegungen unverändert.
 *
 * Rückgabe: die 3D-Gruppe und eine Funktion `bewege(t)`, die in jedem Bild aufgerufen wird
 * (Flügelschlag, wippende Blüte, Ohrenzucken …).
 *
 * `silhouette = true`: dunkles Material – so sieht man die Form, aber nicht die Art.
 */
export type ArtModell = { gruppe: THREE.Group; bewege: (t: number) => void };

type Farbe = string | number;

export function baueArtModell(m: ModellParameter, silhouette: boolean): ArtModell {
  const T = THREE;
  const zahl = (k: string, standard = 0) => (typeof m[k] === 'number' ? (m[k] as number) : standard);
  const farbe = (k: string, standard: Farbe = '#888888'): Farbe => (m[k] as Farbe | undefined) ?? standard;
  const wahr = (k: string) => !!m[k];
  const form = m.shape as string | undefined;

  const M = (c: Farbe) =>
    silhouette
      ? new T.MeshLambertMaterial({ color: '#16231F', emissive: '#0C1C19', flatShading: true })
      : new T.MeshLambertMaterial({ color: c, flatShading: true });
  const mesh = (
    geo: THREE.BufferGeometry,
    c: Farbe,
    p: [number, number, number] = [0, 0, 0],
    sc: [number, number, number] = [1, 1, 1],
  ) => {
    const x = new T.Mesh(geo, M(c));
    x.position.set(...p);
    x.scale.set(...sc);
    return x;
  };
  const heller = (c: Farbe, um: number) => new T.Color(c).offsetHSL(0, 0, um).getHex();

  const g = new T.Group();
  let bewege: (t: number) => void = () => {};

  if (m.t === 'flower') {
    const L = farbe('leaf', '#4F8F3D');
    const kopf = new T.Group();
    if (form === 'drosera') {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const blatt = new T.Group();
        blatt.rotation.y = a;
        g.add(blatt);
        blatt.add(mesh(new T.CylinderGeometry(0.02, 0.02, 0.5, 4), L, [0.25, 0.05, 0]).rotateZ(Math.PI / 2));
        blatt.add(mesh(new T.SphereGeometry(0.14, 8, 6), farbe('c1'), [0.55, 0.07, 0], [1, 0.35, 1]));
        for (let j = 0; j < 7; j++) {
          blatt.add(
            mesh(new T.SphereGeometry(0.025, 6, 4), 0xd8f0ff, [0.55 + Math.cos(j) * 0.12, 0.13, Math.sin(j) * 0.12]),
          );
        }
      }
      g.add(mesh(new T.CylinderGeometry(0.015, 0.015, 1.1, 4), L, [0, 0.55, 0]));
      kopf.position.y = 1.1;
      g.add(kopf);
      kopf.add(mesh(new T.SphereGeometry(0.06, 6, 4), farbe('c2')));
    } else {
      g.add(mesh(new T.CylinderGeometry(0.025, 0.035, 1.3, 5), L, [0, 0.65, 0]));
      for (const s of [-1, 1]) {
        g.add(
          mesh(new T.SphereGeometry(0.25, 7, 5), L, [s * 0.2, 0.35 + (s > 0 ? 0.25 : 0), 0], [1, 0.12, 0.4]).rotateZ(
            s * 0.4,
          ),
        );
      }
      kopf.position.y = 1.3;
      g.add(kopf);
      const n = zahl('n', 6);
      if (form === 'bell') {
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          const glocke = new T.Group();
          const r = n > 1 ? 0.18 : 0;
          glocke.position.set(Math.cos(a) * r, -0.08, Math.sin(a) * r);
          glocke.add(mesh(new T.ConeGeometry(0.12, 0.26, 8, 1, true), farbe('c1'), [0, -0.1, 0]));
          glocke.add(mesh(new T.SphereGeometry(0.03, 5, 4), farbe('c2'), [0, -0.24, 0]));
          glocke.rotation.z = n > 1 ? 0.6 * Math.cos(a) : 0.4;
          kopf.add(glocke);
        }
      } else if (form === 'clover') {
        kopf.position.y = 0.9;
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI * 2;
          kopf.add(
            mesh(
              new T.SphereGeometry(0.18, 7, 5),
              L,
              [Math.cos(a) * 0.17, 0, Math.sin(a) * 0.17],
              [1, 0.12, 0.8],
            ).rotateY(-a),
          );
        }
        const bluete = new T.Group();
        bluete.position.set(0.25, 0.45, 0);
        kopf.add(bluete);
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2;
          bluete.add(
            mesh(
              new T.SphereGeometry(0.07, 6, 4),
              farbe('c1'),
              [Math.cos(a) * 0.07, 0, Math.sin(a) * 0.07],
              [1, 0.3, 0.6],
            ),
          );
        }
      } else if (form === 'slipper') {
        kopf.add(mesh(new T.SphereGeometry(0.2, 10, 8), farbe('c1'), [0, -0.05, 0.08], [1, 0.85, 1.2]));
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2 + 0.4;
          const p = mesh(new T.BoxGeometry(0.04, 0.5, 0.06), farbe('c2'), [
            Math.cos(a) * 0.18,
            0.12,
            Math.sin(a) * 0.18 - 0.05,
          ]);
          p.rotation.set(Math.sin(a) * 0.8, 0, -Math.cos(a) * 0.9);
          kopf.add(p);
        }
      } else {
        const lilie = form === 'lily';
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          const pt = new T.Group();
          pt.rotation.y = a;
          kopf.add(pt);
          const p = mesh(new T.SphereGeometry(0.22, 7, 5), farbe('c1'), [0.2, lilie ? 0.1 : 0, 0], [1, 0.12, 0.38]);
          p.rotation.z = lilie ? 0.9 : 0.15;
          pt.add(p);
        }
        kopf.add(mesh(new T.SphereGeometry(form === 'daisy' ? 0.11 : 0.07, 8, 6), farbe('c2'), [0, 0.03, 0]));
        if (lilie) kopf.rotation.x = Math.PI;
      }
    }
    bewege = (t) => {
      kopf.rotation.z = Math.sin(t * 1.5) * 0.08;
      g.rotation.z = Math.sin(t * 1.1) * 0.02;
    };
  } else if (m.t === 'shroom') {
    const n = zahl('cluster', 1);
    const huete: THREE.Group[] = [];
    for (let i = 0; i < n; i++) {
      const s = new T.Group();
      s.scale.setScalar(n > 1 ? [1, 0.75, 0.6][i] : 1);
      s.position.set(n > 1 ? [0, 0.45, -0.4][i] : 0, 0, n > 1 ? [0, 0.25, 0.2][i] : 0);
      g.add(s);
      if (form === 'coral') {
        for (let j = 0; j < 22; j++) {
          const a = j * 2.4;
          const r = 0.15 + (j % 5) * 0.08;
          s.add(
            mesh(
              new T.SphereGeometry(0.16, 6, 4),
              farbe('c1'),
              [Math.cos(a) * r, 0.3 + (j % 4) * 0.1, Math.sin(a) * r],
              [1, 0.35, 0.7],
            ).rotateX(j),
          );
        }
        s.add(mesh(new T.CylinderGeometry(0.08, 0.12, 0.3, 6), farbe('c2'), [0, 0.15, 0]));
      } else if (form === 'icicle') {
        s.add(mesh(new T.SphereGeometry(0.42, 9, 7), farbe('c1'), [0, 0.75, 0], [1, 0.7, 1]));
        for (let j = 0; j < 30; j++) {
          const a = j * 2.39;
          const r = (j % 6) * 0.07;
          s.add(
            mesh(new T.ConeGeometry(0.04, 0.32 + (j % 3) * 0.08, 5), farbe('c2'), [
              Math.cos(a) * r,
              0.4 - (j % 3) * 0.03,
              Math.sin(a) * r,
            ]).rotateX(Math.PI),
          );
        }
      } else if (form === 'funnel') {
        const pts = [
          [0, 0],
          [0.1, 0],
          [0.09, 0.4],
          [0.14, 0.55],
          [0.45, 0.75],
          [0.5, 0.8],
          [0.3, 0.8],
          [0, 0.74],
        ].map(([a, b]) => new T.Vector2(a, b));
        s.add(mesh(new T.LatheGeometry(pts, 14), farbe('c1')));
      } else if (form === 'tall') {
        const pts = [
          [0, 0],
          [0.08, 0],
          [0.07, 0.5],
          [0.2, 0.45],
          [0.24, 0.9],
          [0.2, 1.25],
          [0.08, 1.4],
          [0, 1.42],
        ].map(([a, b]) => new T.Vector2(a, b));
        s.add(mesh(new T.LatheGeometry(pts, 12), farbe('c1')));
        for (let j = 0; j < 14; j++) {
          const a = j * 2.4;
          s.add(
            mesh(new T.ConeGeometry(0.03, 0.06, 4), 0xc8a87a, [
              Math.cos(a) * 0.23,
              0.6 + (j % 5) * 0.15,
              Math.sin(a) * 0.23,
            ]),
          );
        }
      } else {
        const dick = wahr('thick');
        const th = dick ? 1.6 : 1;
        const hut = new T.Group();
        hut.position.y = 0.55 + (dick ? 0.05 : 0.15);
        s.add(hut);
        s.add(
          mesh(new T.CylinderGeometry(0.09 * th, 0.12 * th * (dick ? 1.4 : 1), hut.position.y, 9), farbe('c2'), [
            0,
            hut.position.y / 2,
            0,
          ]),
        );
        hut.add(
          mesh(
            new T.SphereGeometry(0.5, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2),
            farbe('c1'),
            [0, 0, 0],
            [1, form === 'flat' ? 0.35 : 0.7, 1],
          ),
        );
        hut.add(mesh(new T.CircleGeometry(0.5, 14), dick ? 0xd8c86a : 0xf1e9d6).rotateX(Math.PI / 2));
        if (wahr('spots')) {
          for (let j = 0; j < 16; j++) {
            const a = j * 2.4;
            const r = 0.12 + (j % 4) * 0.09;
            hut.add(
              mesh(new T.IcosahedronGeometry(0.035, 0), 0xffffff, [
                Math.cos(a) * r,
                Math.sqrt(Math.max(0, 0.25 - r * r)) * 0.7 + 0.01,
                Math.sin(a) * r,
              ]),
            );
          }
        }
        if (wahr('ring'))
          s.add(mesh(new T.CylinderGeometry(0.11, 0.2, 0.08, 10, 1, true), 0xf3ede0, [0, hut.position.y * 0.72, 0]));
        if (wahr('volva')) s.add(mesh(new T.SphereGeometry(0.17, 8, 6), 0xefe5cf, [0, 0.05, 0], [1, 0.7, 1]));
        huete.push(hut);
      }
    }
    // aufsteigende Sporen
    const N = 40;
    const sporen = new T.BufferGeometry();
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (((i * 0.618) % 1) - 0.5) * 0.8;
      pos[i * 3 + 1] = ((i * 0.377) % 1) * 1.5;
      pos[i * 3 + 2] = (((i * 0.239) % 1) - 0.5) * 0.8;
    }
    sporen.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.add(
      new T.Points(sporen, new T.PointsMaterial({ color: colors.rune, size: 0.025, transparent: true, opacity: 0.7 })),
    );
    bewege = (t) => {
      for (let i = 0; i < N; i++) pos[i * 3 + 1] = (pos[i * 3 + 1] + 0.004) % 1.6;
      sporen.attributes.position.needsUpdate = true;
      huete.forEach((c, i) => (c.rotation.z = Math.sin(t * 1.3 + i) * 0.03));
    };
  } else if (m.t === 'bird') {
    const s = zahl('s', 1);
    const koerper = new T.Group();
    g.add(koerper);
    koerper.scale.setScalar(s);
    const beinL = wahr('longLegs') ? 0.9 : 0.25;
    koerper.position.y = beinL;
    koerper.add(mesh(new T.SphereGeometry(0.4, 10, 8), farbe('c1'), [0, 0.35, 0], [1.35, 0.95, 0.95]));
    koerper.add(mesh(new T.SphereGeometry(0.33, 9, 7), farbe('c2'), [0.18, 0.28, 0], [1, 0.85, 0.8]));
    if (m.under) koerper.add(mesh(new T.SphereGeometry(0.14, 6, 5), farbe('under'), [-0.35, 0.18, 0]));
    const kopf = new T.Group();
    kopf.position.set(0.48, 0.72, 0);
    koerper.add(kopf);
    const eule = wahr('owl');
    kopf.add(mesh(new T.SphereGeometry(eule ? 0.3 : 0.24, 10, 8), farbe('head')));
    if (wahr('cheek'))
      for (const z of [-1, 1])
        kopf.add(mesh(new T.SphereGeometry(0.1, 6, 5), 0xffffff, [0.06, -0.03, z * 0.17], [1, 0.8, 0.5]));
    if (m.crown) kopf.add(mesh(new T.SphereGeometry(0.13, 6, 5), farbe('crown'), [0, 0.16, 0], [1.3, 0.6, 1]));
    for (const z of [-1, 1])
      kopf.add(
        mesh(new T.SphereGeometry(0.045, 6, 5), eule ? 0xff9a1a : 0x0a0a0a, [0.15, 0.06, z * (eule ? 0.18 : 0.15)]),
      );
    const schnabel = mesh(new T.ConeGeometry(0.06, wahr('longBeak') ? 0.55 : 0.2, 6), farbe('beak'), [
      wahr('longBeak') ? 0.48 : 0.3,
      -0.02,
      0,
    ]);
    schnabel.rotation.z = -Math.PI / 2 + (wahr('crest') ? 0.15 : 0);
    kopf.add(schnabel);
    if (eule)
      for (const z of [-1, 1]) kopf.add(mesh(new T.ConeGeometry(0.06, 0.22, 4), farbe('c1'), [-0.02, 0.3, z * 0.13]));
    if (wahr('crest')) {
      for (let i = 0; i < 6; i++) {
        const c = mesh(new T.ConeGeometry(0.035, 0.32, 4), i % 2 ? 0xd9a06a : 0x1b1b1b, [-0.05 - i * 0.04, 0.24, 0]);
        c.rotation.z = 0.2 + i * 0.18;
        kopf.add(c);
      }
    }
    const fluegel: [THREE.Group, number][] = [];
    for (const z of [-1, 1]) {
      const w = new T.Group();
      w.position.set(0.05, 0.5, z * 0.32);
      koerper.add(w);
      const fl = m.wing ? farbe('wing') : wahr('stripes') ? 0x1b1b1b : heller(farbe('c1'), -0.05);
      w.add(mesh(new T.SphereGeometry(0.34, 8, 6), fl, [-0.18, 0, 0], [1.3, 0.4, 0.2]));
      if (wahr('stripes'))
        for (let i = 0; i < 3; i++)
          w.add(mesh(new T.BoxGeometry(0.06, 0.1, 0.03), 0xffffff, [-0.3 + i * 0.15, -0.02, z * 0.06]));
      fluegel.push([w, z]);
    }
    const schwanz = mesh(
      new T.BoxGeometry(0.5, 0.06, 0.24),
      wahr('stripes') ? 0x1b1b1b : farbe('c1'),
      [-0.68, 0.42, 0],
    );
    schwanz.rotation.z = 0.35;
    koerper.add(schwanz);
    for (const z of [-1, 1])
      g.add(
        mesh(new T.CylinderGeometry(0.02, 0.02, beinL + 0.1, 4), wahr('longLegs') ? farbe('beak') : 0x5a4a3a, [
          0,
          beinL / 2,
          z * 0.12 * s,
        ]),
      );
    bewege = (t) => {
      const f = t % 3.2 < 0.5 ? Math.sin(t * 40) * 0.6 : 0;
      fluegel.forEach(([w, z]) => (w.rotation.x = z * (0.15 + Math.abs(f))));
      kopf.rotation.y = Math.sin(t * 1.7) * 0.3;
      kopf.rotation.z = Math.sin(t * 3.1) * 0.05;
      koerper.position.y = beinL + Math.abs(Math.sin(t * 2)) * 0.03;
    };
  } else if (m.t === 'mammal') {
    const s = zahl('s', 1);
    const lg = 0.25 + zahl('legs', 1) * 0.35;
    const schnauze = zahl('snout', 0.3);
    const streifen = wahr('stripes');
    const koerper = new T.Group();
    g.add(koerper);
    koerper.scale.setScalar(s);
    koerper.position.y = lg * s;
    koerper.add(mesh(new T.SphereGeometry(0.5, 12, 9), farbe('c1'), [0, 0.3, 0], [1.5, 0.85, 0.8]));
    if (wahr('spikes')) {
      for (let i = 0; i < 60; i++) {
        const a = i * 2.39;
        const y = 0.1 + (i % 10) * 0.065;
        const r = Math.sqrt(Math.max(0.02, 0.25 - (y - 0.3) ** 2)) * 0.85;
        const c = mesh(new T.ConeGeometry(0.04, 0.22, 4), i % 3 ? 0x3a2e24 : 0xd8c8a8, [
          Math.cos(a) * r * 1.5 - 0.05,
          y + 0.12,
          Math.sin(a) * r,
        ]);
        c.lookAt(new T.Vector3(Math.cos(a) * 3, y * 3 + 1, Math.sin(a) * 3));
        c.rotateX(Math.PI / 2);
        koerper.add(c);
      }
    }
    const kopf = new T.Group();
    kopf.position.set(0.78, 0.55, 0);
    koerper.add(kopf);
    kopf.add(mesh(new T.SphereGeometry(0.28, 10, 8), streifen ? 0xf0f0ea : farbe('c1'), [0, 0, 0], [1.1, 1, 0.95]));
    if (streifen)
      for (const z of [-1, 1]) kopf.add(mesh(new T.BoxGeometry(0.5, 0.08, 0.08), 0x111111, [0.08, 0.1, z * 0.12]));
    const sn = mesh(new T.ConeGeometry(0.14, schnauze * 0.6 + 0.15, 7), streifen ? 0xf0f0ea : farbe('c1'), [
      0.3 + schnauze * 0.2,
      -0.06,
      0,
    ]);
    sn.rotation.z = -Math.PI / 2;
    kopf.add(sn);
    kopf.add(mesh(new T.SphereGeometry(0.05, 6, 5), 0x111111, [0.38 + schnauze * 0.4, -0.06, 0]));
    for (const z of [-1, 1]) kopf.add(mesh(new T.SphereGeometry(0.04, 6, 5), 0x0a0a0a, [0.17, 0.1, z * 0.16]));
    const ohren: THREE.Mesh[] = [];
    for (const z of [-1, 1]) {
      let e: THREE.Mesh;
      if (m.ears === 'long')
        e = mesh(new T.CylinderGeometry(0.04, 0.07, 0.6, 6), farbe('c1'), [-0.05, 0.45, z * 0.12], [1, 1, 0.5]);
      else if (m.ears === 'round') e = mesh(new T.SphereGeometry(0.07, 6, 5), farbe('c1'), [-0.05, 0.24, z * 0.17]);
      else e = mesh(new T.ConeGeometry(0.1, 0.26, 4), farbe('c1'), [-0.05, 0.3, z * 0.15]);
      kopf.add(e);
      ohren.push(e);
      if (m.ears === 'lynx' || m.ears === 'tuft')
        kopf.add(mesh(new T.CylinderGeometry(0.01, 0.015, 0.14, 4), 0x111111, [-0.05, 0.5, z * 0.15]));
    }
    if (wahr('antler')) {
      for (const z of [-1, 1]) {
        const a = mesh(new T.CylinderGeometry(0.02, 0.03, 0.35, 5), 0x6b5440, [0, 0.38, z * 0.08]);
        a.rotation.x = z * 0.25;
        kopf.add(a);
      }
    }
    for (const [a, z] of [
      [0.45, 0.22],
      [0.45, -0.22],
      [-0.45, 0.22],
      [-0.45, -0.22],
    ]) {
      koerper.add(mesh(new T.CylinderGeometry(0.07, 0.06, lg, 6), heller(farbe('c1'), -0.08), [a, -lg / 2 + 0.05, z]));
    }
    const sg = new T.Group();
    sg.position.set(-0.72, 0.4, 0);
    koerper.add(sg);
    const tail = m.tail as string | undefined;
    let schwanz: THREE.Mesh | null = null;
    if (tail === 'bushy')
      schwanz = mesh(new T.SphereGeometry(0.2, 8, 6), farbe('c1'), [-0.35, -0.1, 0], [2.3, 0.9, 0.9]);
    else if (tail === 'bushyUp')
      schwanz = mesh(new T.SphereGeometry(0.25, 8, 6), farbe('c1'), [-0.15, 0.45, 0], [0.8, 2.4, 0.8]);
    else if (tail === 'flat') schwanz = mesh(new T.BoxGeometry(0.6, 0.06, 0.32), 0x3a2a1a, [-0.3, -0.25, 0]);
    else if (tail === 'puff') schwanz = mesh(new T.SphereGeometry(0.1, 6, 5), 0xf4f0e6, [-0.02, 0, 0]);
    else if (tail === 'thin' || tail === 'short')
      schwanz = mesh(
        new T.CylinderGeometry(0.03, 0.05, tail === 'short' ? 0.18 : 0.35, 5),
        farbe('c1'),
        [-0.12, -0.08, 0],
      ).rotateZ(0.9) as THREE.Mesh;
    if (schwanz) sg.add(schwanz);
    bewege = (t) => {
      koerper.scale.y = s * (1 + Math.sin(t * 2.4) * 0.015);
      sg.rotation.y = Math.sin(t * 4) * 0.35;
      kopf.rotation.y = Math.sin(t * 0.7) * 0.35;
      const zucken = t % 4 < 0.25;
      ohren.forEach((e) => (e.rotation.x = zucken ? Math.sin(t * 50) * 0.2 : 0));
    };
  }

  return { gruppe: g, bewege };
}

/** Skaliert ein Modell so, dass es gut in die Bühne passt (wie im Prototyp). Gibt die Höhe zurück. */
export function einpassen(gruppe: THREE.Object3D, zielGroesse = 2.6): number {
  const box = new THREE.Box3().setFromObject(gruppe);
  const groesse = box.getSize(new THREE.Vector3());
  const mitte = box.getCenter(new THREE.Vector3());
  const k = zielGroesse / Math.max(groesse.x, groesse.y * 1.1, groesse.z, 0.001);
  gruppe.scale.setScalar(k);
  gruppe.position.set(-mitte.x * k, -box.min.y * k, -mitte.z * k);
  return groesse.y * k;
}

import { useFrame } from '@react-three/fiber/native';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { AUSSTATTUNG, TUEMPEL, WEG, wegX } from '@/logic/lichtungDetails';
import type { Stimmung } from '@/logic/tageszeit';
import { augenPlaetze, augenZustand, dunkelheit, euleKopf, mausHervor, type Augenpaar } from '@/logic/verborgenes';
import { colors } from '@/theme/theme';

import { netzTextur } from './blattTexturen';
import { FORM, getoent, matt } from './material';
import { leuchtTextur } from './texturen';

/**
 * Versteckte Kleinigkeiten, die man erst beim genauen Hinsehen entdeckt:
 * - Augenpaare im Gebüsch und am Waldrand, die in der Dämmerung aufleuchten, blinzeln und wieder verschwinden.
 *   (Viele Säugetiere wie Fuchs oder Reh haben hinter der Netzhaut eine spiegelnde Schicht, das
 *   Tapetum lucidum – deshalb leuchten ihre Augen nachts auf, wenn Licht hineinfällt.)
 * - eine Eule auf dem Wegweiser, die ruckartig den Kopf dreht und blinzelt
 * - schwach leuchtendes Holz am umgestürzten Stamm (das Pilzgeflecht des Hallimasch kann Holz leuchten lassen)
 * - ein Spinnennetz an der Laterne mit glitzernden Tautropfen
 * - eine Schnecke, die langsam über einen Baumstumpf kriecht
 * - ein Frosch auf einem Seerosenblatt, dessen Kehle sich beim Atmen bewegt
 * - eine Maus, die ab und zu unter einem Baumstumpf hervorlugt
 * - Rehspuren im Sand des Weges und eine Feder auf der Bank
 *
 * Reine Stimmung: Nichts davon ist antippbar oder bringt Punkte.
 * Bei "Bewegung reduzieren" bleibt alles ruhig stehen (Augen leuchten dann dauerhaft schwach).
 */

const FARBE = {
  eule: '#6B5340',
  euleHell: '#A08868',
  maus: '#6E6458',
  mausOhr: '#9A7E70',
  frosch: '#4E6B3A',
  froschHell: '#B8B080',
  haus: '#8A6A4A',
  schnecke: '#7A7060',
  spur: '#3A332A',
  feder: '#C9C2B0',
  augen: [colors.amber, colors.rune, colors.legend],
};

type Props = { startwert: number; stimmung: Stimmung; ruhig: boolean };

export function LichtungVerborgenes({ startwert, stimmung, ruhig }: Props) {
  const gruppe = useRef<THREE.Group>(null);
  const dunkel = dunkelheit(stimmung);
  const paare = useMemo(() => augenPlaetze(startwert), [startwert]);

  // nichts davon soll Tipps abfangen
  useEffect(() => {
    gruppe.current?.traverse((o) => {
      o.raycast = () => {};
    });
  });

  return (
    <group ref={gruppe}>
      {dunkel > 0.05 && <Augen paare={paare} dunkel={dunkel} ruhig={ruhig} />}
      <Eule ruhig={ruhig} />
      <LeuchtendesHolz dunkel={dunkel} ruhig={ruhig} />
      <Spinnennetz licht={0.3 + 0.7 * stimmung.fenster} ruhig={ruhig} />
      <Schnecke ruhig={ruhig} />
      <Frosch ruhig={ruhig} />
      <Maus ruhig={ruhig} />
      <Spuren />
      <mesh
        geometry={FEDER}
        material={matt(FARBE.feder)}
        position={[AUSSTATTUNG.bank.x + 0.22, 0.375, AUSSTATTUNG.bank.z + 0.03]}
        rotation={[-Math.PI / 2, 0, 0.7]}
      />
    </group>
  );
}

function leuchtMaterial(farbe: string, deckkraft: number) {
  return new THREE.SpriteMaterial({
    map: leuchtTextur(),
    color: farbe,
    transparent: true,
    opacity: deckkraft,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

// ---------- Augenpaare ----------

function Augen({ paare, dunkel, ruhig }: { paare: Augenpaar[]; dunkel: number; ruhig: boolean }) {
  const koepfe = useRef<(THREE.Group | null)[]>([]);
  const materialien = useMemo(
    () => paare.map((p) => leuchtMaterial(FARBE.augen[Math.floor(p.ton * FARBE.augen.length)], 0)),
    [paare],
  );
  const schein = useMemo(
    () => paare.map((p) => leuchtMaterial(FARBE.augen[Math.floor(p.ton * FARBE.augen.length)], 0)),
    [paare],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    koepfe.current.forEach((kopf, i) => {
      if (!kopf) return;
      const p = paare[i];
      // ruhig: die Hälfte der Augenpaare leuchtet still, ohne Blinzeln
      const z = ruhig ? { sichtbar: p.phase < 0.5 ? 0.85 : 0, offen: 1 } : augenZustand(t, p.periode, p.phase);
      const augen = kopf.children[0] as THREE.Sprite;
      (augen.material as THREE.SpriteMaterial).opacity = z.sichtbar * dunkel;
      const hof = kopf.children[2] as THREE.Sprite;
      (hof.material as THREE.SpriteMaterial).opacity = z.sichtbar * dunkel * 0.3;
      // Blinzeln: Augen werden flach; Umschauen: Kopf dreht sich etwas
      kopf.scale.y = Math.max(0.05, z.offen);
      kopf.rotation.y = Math.atan2(p.x, p.z) + (ruhig ? 0 : Math.sin(t * 0.35 + p.phase * 9) * 0.5);
    });
  });

  return (
    <>
      {paare.map((p, i) => (
        <group
          key={i}
          ref={(g) => {
            koepfe.current[i] = g;
          }}
          position={[p.x, p.y, p.z]}
        >
          <sprite material={materialien[i]} position={[-p.abstand / 2, 0, 0]} scale={[0.17, 0.12, 1]} />
          <sprite material={materialien[i]} position={[p.abstand / 2, 0, 0]} scale={[0.17, 0.12, 1]} />
          {/* schwacher Lichthof, damit man die Stelle aus der Ferne bemerkt */}
          <sprite material={schein[i]} scale={[1.2, 0.8, 1]} />
        </group>
      ))}
    </>
  );
}

// ---------- Eule auf dem Wegweiser ----------

function Eule({ ruhig }: { ruhig: boolean }) {
  const kopf = useRef<THREE.Group>(null);
  const lider = useRef<THREE.Group>(null);
  const a = AUSSTATTUNG.wegweiser;

  useFrame(({ clock }) => {
    if (ruhig || !kopf.current || !lider.current) return;
    const t = clock.elapsedTime;
    kopf.current.rotation.y = euleKopf(t);
    // langsames Blinzeln alle paar Sekunden
    const b = (t + 1.3) % 5.3;
    lider.current.scale.y = b < 0.3 ? Math.abs(b - 0.15) / 0.15 : 1;
  });

  return (
    // sitzt dem Weg zugewandt, schaut also meist zum Betrachter
    <group position={[a.x, 1.3, a.z]} rotation={[0, 0.3, 0]}>
      <mesh
        geometry={FORM.kugelFein}
        material={matt(FARBE.eule)}
        position={[0, 0.11, 0]}
        scale={[0.085, 0.125, 0.075]}
      />
      {/* hellere, gemusterte Brust */}
      <mesh
        geometry={FORM.kugelFein}
        material={matt(FARBE.euleHell)}
        position={[0, 0.1, 0.03]}
        scale={[0.06, 0.09, 0.05]}
      />
      {/* Krallen am Pfahl */}
      {[-0.025, 0.025].map((x) => (
        <mesh key={x} geometry={FORM.kugel} material={matt(colors.amber)} position={[x, 0.005, 0.04]} scale={0.012} />
      ))}
      <group ref={kopf} position={[0, 0.25, 0]}>
        <mesh geometry={FORM.kugelFein} material={matt(FARBE.eule)} scale={[0.072, 0.065, 0.066]} />
        {/* Gesichtsschleier: zwei helle Scheiben um die Augen */}
        {[-1, 1].map((s) => (
          <mesh
            key={s}
            geometry={SCHEIBE}
            material={matt(FARBE.euleHell)}
            position={[s * 0.027, 0.004, 0.058]}
            rotation={[0, s * 0.35, 0]}
            scale={0.03}
          />
        ))}
        {/* Federohren */}
        {[-1, 1].map((s) => (
          <mesh
            key={s}
            geometry={FORM.kegel}
            material={matt(FARBE.eule)}
            position={[s * 0.04, 0.07, 0.01]}
            rotation={[0, 0, -s * 0.35]}
            scale={[0.014, 0.05, 0.012]}
          />
        ))}
        <group ref={lider}>
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.027, 0.006, 0.062]}>
              <mesh geometry={FORM.kugelFein} material={AUGE} scale={0.015} />
              <mesh geometry={FORM.kugelFein} material={PUPILLE} position={[0, 0, 0.009]} scale={0.008} />
            </group>
          ))}
        </group>
        <mesh
          geometry={FORM.kegel}
          material={matt(FARBE.spur)}
          position={[0, -0.016, 0.066]}
          rotation={[Math.PI, 0, 0]}
          scale={[0.008, 0.02, 0.008]}
        />
      </group>
    </group>
  );
}

// leuchtend, damit die Augen auch in der Nacht zu sehen sind
const AUGE = new THREE.MeshBasicMaterial({ color: colors.amber });
const PUPILLE = new THREE.MeshBasicMaterial({ color: colors.night });

// ---------- leuchtendes Holz ----------

const HOLZ_PUNKTE = Array.from({ length: 9 }, (_, i) => {
  const w = 1.2 + Math.sin(i * 7.3) * 1.3; // eher seitlich und unten am Stamm
  return { y: -1.4 + i * 0.34, x: Math.cos(w) * 0.29, z: Math.sin(w) * 0.29, groesse: 0.35 + (i % 3) * 0.12 };
});

function LeuchtendesHolz({ dunkel, ruhig }: { dunkel: number; ruhig: boolean }) {
  const punkte = useRef<(THREE.Sprite | null)[]>([]);
  const mat = useMemo(() => HOLZ_PUNKTE.map(() => leuchtMaterial(colors.rune, 0)), []);
  const s = AUSSTATTUNG.stamm;

  useFrame(({ clock }) => {
    const t = ruhig ? 0 : clock.elapsedTime;
    punkte.current.forEach((p, i) => {
      if (!p) return;
      // ganz langsames, ungleichmäßiges Pulsieren
      const puls = 0.6 + 0.4 * Math.sin(t * 0.5 + i * 1.9);
      (p.material as THREE.SpriteMaterial).opacity = Math.max(0, dunkel - 0.3) * 1.1 * puls;
    });
  });

  if (dunkel < 0.35) return null;
  return (
    <group position={[s.x, 0.28, s.z]} rotation={[0, s.drehung, Math.PI / 2]}>
      {HOLZ_PUNKTE.map((p, i) => (
        <sprite
          key={i}
          ref={(sp) => {
            punkte.current[i] = sp;
          }}
          material={mat[i]}
          position={[p.x, p.y, p.z]}
          scale={[p.groesse, p.groesse * 0.6, 1]}
        />
      ))}
    </group>
  );
}

// ---------- Spinnennetz mit Tau an der Laterne ----------

const TAU = Array.from({ length: 14 }, (_, i) => {
  const w = i * 2.4;
  const r = 0.02 + ((i * 37) % 10) * 0.008;
  return { x: Math.cos(w) * r, y: Math.sin(w) * r, p: i * 1.7 };
});

function Spinnennetz({ licht, ruhig }: { licht: number; ruhig: boolean }) {
  const tropfen = useRef<(THREE.Sprite | null)[]>([]);
  const netzMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: netzTextur(),
        color: colors.moon,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );
  const tauMat = useMemo(() => TAU.map(() => leuchtMaterial(colors.moon, 0.5)), []);
  const l = AUSSTATTUNG.laterne;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    tropfen.current.forEach((sp, i) => {
      if (!sp) return;
      // Glitzern: einzelne Tropfen blitzen kurz auf
      const funkeln = ruhig ? 0.5 : Math.pow(0.5 + 0.5 * Math.sin(t * 1.3 + TAU[i].p), 6);
      (sp.material as THREE.SpriteMaterial).opacity = (0.15 + 0.85 * funkeln) * licht;
    });
  });

  return (
    // im Winkel zwischen Pfahl und Laternenarm
    <group position={[l.x - 0.12, 1.22, l.z]}>
      <mesh geometry={FORM.flach} material={netzMat} scale={0.22} />
      {TAU.map((d, i) => (
        <sprite
          key={i}
          ref={(sp) => {
            tropfen.current[i] = sp;
          }}
          material={tauMat[i]}
          position={[d.x, d.y, 0.002]}
          scale={[0.025, 0.025, 1]}
        />
      ))}
    </group>
  );
}

// ---------- Schnecke auf dem Baumstumpf ----------

/** Schneckenhaus: Perlen entlang einer Spirale, nach innen kleiner, mit hellen und dunklen Bändern */
const SCHNECKENHAUS = (() => {
  const teile: THREE.BufferGeometry[] = [];
  const n = 30;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const w = t * Math.PI * 2.8;
    const r = 0.03 * (1 - t * 0.9);
    const k = new THREE.IcosahedronGeometry(0.017 * (1 - t * 0.7), 2);
    k.translate(Math.cos(w) * r, Math.sin(w) * r, t * 0.014);
    // dunkle Bänder quer zur Windung
    const ton = i % 4 === 0 ? 0.55 : 1.1;
    k.setAttribute('color', new THREE.BufferAttribute(new Float32Array(k.attributes.position.count * 3).fill(ton), 3));
    k.deleteAttribute('uv');
    teile.push(k);
  }
  return mergeGeometries(teile);
})();
const SCHNECKENKOERPER = new THREE.CapsuleGeometry(0.011, 0.07, 3, 6).rotateX(Math.PI / 2);

function Schnecke({ ruhig }: { ruhig: boolean }) {
  const schnecke = useRef<THREE.Group>(null);
  const s = AUSSTATTUNG.stuempfe[2];

  useFrame(({ clock }) => {
    const g = schnecke.current;
    if (!g) return;
    // sehr langsam im Kreis über den Stumpf (eine Runde in etwa zweieinhalb Minuten)
    const w = (ruhig ? 1 : clock.elapsedTime) * 0.04 + 1;
    g.position.set(s.x + Math.cos(w) * 0.15, 0.352, s.z + Math.sin(w) * 0.15);
    g.rotation.y = -w;
  });

  return (
    <group ref={schnecke}>
      <mesh geometry={SCHNECKENKOERPER} material={matt(FARBE.schnecke)} scale={[1, 0.7, 1]} />
      <mesh
        geometry={SCHNECKENHAUS}
        material={getoent(FARBE.haus)}
        position={[0, 0.032, -0.008]}
        rotation={[0, Math.PI / 2, 0]}
      />
      {/* Fühler */}
      {[-1, 1].map((x) => (
        <group key={x} position={[x * 0.006, 0.005, 0.045]} rotation={[0.6, 0, x * 0.3]}>
          <mesh
            geometry={FORM.stamm}
            material={matt(FARBE.schnecke)}
            position={[0, 0.012, 0]}
            scale={[0.002, 0.024, 0.002]}
          />
          <mesh geometry={FORM.kugel} material={matt(FARBE.spur)} position={[0, 0.025, 0]} scale={0.003} />
        </group>
      ))}
    </group>
  );
}

// ---------- Frosch auf dem Seerosenblatt ----------

function Frosch({ ruhig }: { ruhig: boolean }) {
  const kehle = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ruhig || !kehle.current) return;
    // Atmen: die helle Kehle hebt und senkt sich schnell
    kehle.current.scale.setScalar(0.014 + Math.max(0, Math.sin(clock.elapsedTime * 5)) * 0.006);
  });

  return (
    <group position={[TUEMPEL.x + 0.3 * TUEMPEL.rx, 0.04, TUEMPEL.z + 0.2 * TUEMPEL.rz]} rotation={[0, 0.5, 0]}>
      <mesh
        geometry={FORM.kugelFein}
        material={matt(FARBE.frosch)}
        position={[0, 0.03, 0]}
        scale={[0.045, 0.03, 0.06]}
      />
      <mesh
        ref={kehle}
        geometry={FORM.kugelFein}
        material={matt(FARBE.froschHell)}
        position={[0, 0.018, 0.05]}
        scale={0.014}
      />
      {/* angelegte Hinterbeine */}
      {[-1, 1].map((x) => (
        <mesh
          key={x}
          geometry={FORM.kugelFein}
          material={matt(FARBE.frosch)}
          position={[x * 0.042, 0.015, -0.02]}
          scale={[0.018, 0.014, 0.04]}
        />
      ))}
      {/* Augen oben auf dem Kopf */}
      {[-1, 1].map((x) => (
        <group key={x} position={[x * 0.022, 0.055, 0.035]}>
          <mesh geometry={FORM.kugelFein} material={matt(FARBE.froschHell)} scale={0.013} />
          <mesh geometry={FORM.kugelFein} material={PUPILLE} position={[x * 0.004, 0.003, 0.008]} scale={0.007} />
        </group>
      ))}
    </group>
  );
}

// ---------- Maus am Baumstumpf ----------

function Maus({ ruhig }: { ruhig: boolean }) {
  const maus = useRef<THREE.Group>(null);
  const s = AUSSTATTUNG.stuempfe[1];
  // schaut auf der zur Hütte gewandten Seite hervor
  const w = Math.atan2(-s.z, -s.x);

  useFrame(({ clock }) => {
    const g = maus.current;
    if (!g) return;
    const raus = ruhig ? 0.6 : mausHervor(clock.elapsedTime);
    const r = 0.22 + raus * 0.1;
    g.position.set(s.x + Math.cos(w) * r, 0.025, s.z + Math.sin(w) * r);
    g.scale.setScalar(raus < 0.02 ? 0.001 : 1);
    // schnuppern: Kopf wackelt leicht
    g.rotation.set(0, Math.PI / 2 - w + Math.sin(clock.elapsedTime * 11) * 0.12 * raus, 0);
  });

  return (
    <group ref={maus}>
      <mesh geometry={FORM.kugelFein} material={matt(FARBE.maus)} scale={[0.028, 0.025, 0.04]} />
      <mesh
        geometry={FORM.kegel}
        material={matt(FARBE.maus)}
        position={[0, 0, 0.045]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.016, 0.03, 0.016]}
      />
      {[-1, 1].map((x) => (
        <group key={x}>
          <mesh
            geometry={SCHEIBE}
            material={matt(FARBE.mausOhr)}
            position={[x * 0.018, 0.026, 0.012]}
            rotation={[0, x * 0.4, 0]}
            scale={0.012}
          />
          <mesh geometry={FORM.kugelFein} material={PUPILLE} position={[x * 0.014, 0.012, 0.032]} scale={0.005} />
        </group>
      ))}
    </group>
  );
}

// ---------- Rehspuren im Weg ----------

/** Trittsiegel eines Rehs: zwei schmale, spitz zulaufende Schalenhälften */
const TRITT = mergeGeometries(
  [-1, 1].map((x) => new THREE.CircleGeometry(1, 8).scale(0.011, 0.028, 1).translate(x * 0.013, 0, 0)),
);
TRITT.rotateX(-Math.PI / 2);

function Spuren() {
  const mesh = useMemo(() => {
    const liste: { x: number; z: number; w: number }[] = [];
    // ein Reh ist quer über den Weg und dann ein Stück den Weg entlang gelaufen
    for (let z = 5.6, i = 0; z < WEG.bis - 2; z += 0.32, i++) {
      const dx = Math.sin(z * 0.3) * 0.12;
      liste.push({ x: wegX(z) + dx + (i % 2 === 0 ? -0.06 : 0.06), z, w: Math.atan2(0.04, 0.32) });
    }
    const m = new THREE.InstancedMesh(TRITT, matt(FARBE.spur), liste.length);
    const o = new THREE.Object3D();
    liste.forEach((d, i) => {
      o.position.set(d.x, 0.014, d.z);
      o.rotation.set(0, d.w, 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    m.frustumCulled = false;
    return m;
  }, []);
  return <primitive object={mesh} />;
}

// ---------- Geometrien ----------

const SCHEIBE = new THREE.CircleGeometry(1, 10);
/** Feder: schmale, leicht geschwungene Fahne */
const FEDER = new THREE.CircleGeometry(1, 10).scale(0.022, 0.085, 1);

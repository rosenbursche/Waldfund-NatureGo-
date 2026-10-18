import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Options } from 'roughjs/bin/core';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

import type { ModellParameter, ZeichnungParameter } from '@/data/artTypen';
import { colors, fonts, radius, spacing } from '@/theme/theme';

import { skizze, SkizzePfad } from './Skizze';

/**
 * Lehrbuch-Zeichnung wie aus einem alten Biologiebuch:
 * Tinte auf Papier, Schraffuren, Beschriftungslinien mit Punkt.
 * Übertragen aus dem Prototyp (Funktion "drawEdu"), von Canvas auf SVG umgestellt.
 *
 * Zeichenfläche 460 × 290 (wie im Prototyp), alles um 70 nach rechts versetzt.
 */
const INK = colors.ink;
const BREITE = 460;
const HOEHE = 290;
const VERSATZ = 70;

type Eingabe = { id: string; name: string; zeichnung: ZeichnungParameter; modell?: ModellParameter };

/** Sammelt die Zeichenschritte als SVG-Elemente – entspricht dem Canvas-Kontext im Prototyp. */
class Blatt {
  teile: ReactNode[] = [];
  private n = 0;
  constructor(private seed: number) {}

  private o(e: Options = {}): Options {
    return { stroke: INK, strokeWidth: 1.3, roughness: 1.1, seed: this.seed, ...e };
  }
  wash(tint: string, e: Options = {}): Options {
    return this.o({ fill: tint, fillStyle: 'hachure', hachureGap: 5, fillWeight: 0.9, hachureAngle: -41, ...e });
  }
  private add(d: ReturnType<typeof skizze.line>) {
    this.teile.push(<SkizzePfad key={this.n++} drawable={d} />);
  }
  kreis(x: number, y: number, d: number, e?: Options) {
    this.add(skizze.circle(x, y, d, this.o(e)));
  }
  ellipse(x: number, y: number, w: number, h: number, e?: Options) {
    this.add(skizze.ellipse(x, y, w, h, this.o(e)));
  }
  linie(x1: number, y1: number, x2: number, y2: number, e?: Options) {
    this.add(skizze.line(x1, y1, x2, y2, this.o(e)));
  }
  kurve(p: [number, number][], e?: Options) {
    this.add(skizze.curve(p, this.o(e)));
  }
  pfad(d: string, e?: Options) {
    this.add(skizze.path(d, this.o(e)));
  }
  rechteck(x: number, y: number, w: number, h: number, e?: Options) {
    this.add(skizze.rectangle(x, y, w, h, this.o(e)));
  }
  punkt(x: number, y: number, r: number, fuellung: string = INK, rand?: string) {
    this.teile.push(
      <Circle key={this.n++} cx={x} cy={y} r={r} fill={fuellung} stroke={rand} strokeWidth={rand ? 0.8 : 0} />,
    );
  }
  text(
    x: number,
    y: number,
    t: string,
    ausrichtung: 'start' | 'end' = 'start',
    groesse = 17,
    schrift: string = fonts.hand,
  ) {
    this.teile.push(
      <SvgText key={this.n++} x={x} y={y} fill={INK} fontSize={groesse} fontFamily={schrift} textAnchor={ausrichtung}>
        {t}
      </SvgText>,
    );
  }
  /** Beschriftung: Punkt am Objekt, Linie, Text daneben */
  L(px: number, py: number, tx: number, ty: number, t: string, al?: 'left' | 'right') {
    this.linie(px, py, tx, ty, { strokeWidth: 0.8, roughness: 0.6 });
    this.punkt(px, py, 2);
    const rechts = al ? al === 'right' : tx < px;
    this.text(tx + (rechts ? -4 : 4), ty + 5, t, rechts ? 'end' : 'start');
  }
}

function startwert(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 9973;
}

/** Erzeugt Bildunterschrift und Zeichenschritte für eine Art. */
export function zeichne({ id, name, zeichnung: e, modell }: Eingabe): { titel: string; teile: ReactNode[] } {
  const b = new Blatt(startwert(id) + 1);
  const tint = (e.tint as string) ?? '#8a5a32';
  const m = (modell ?? {}) as Record<string, string | number | undefined>;
  let titel = '';

  if (e.t === 'tree') {
    titel = `Abb. 1 – Stammquerschnitt der ${name}`;
    const cx = 150;
    const cy = 148;
    b.kreis(cx, cy, 250, { fill: '#6b4a30', fillStyle: 'cross-hatch', hachureGap: 6, strokeWidth: 2 });
    b.kreis(cx, cy, 226, { fill: '#e9d3a8', fillStyle: 'solid' });
    b.kreis(cx, cy, 218, { strokeWidth: 0.7, stroke: '#7a5a3a' });
    b.kreis(cx, cy, 150, {
      fill: (e.kern as string) ?? '#a07850',
      fillStyle: 'hachure',
      hachureGap: 4,
      fillWeight: 0.7,
    });
    for (let r = 24; r < 215; r += 13 + (r % 3))
      b.kreis(cx, cy, r, { strokeWidth: 0.6, roughness: 1.6, stroke: '#7a5a3a' });
    b.punkt(cx, cy, 3.5);
    b.L(cx + 118, cy - 40, 262, 40, 'Borke');
    b.L(cx + 108, cy - 20, 262, 78, 'Bast');
    b.L(cx + 104, cy + 8, 262, 118, 'Kambium');
    b.L(cx + 88, cy + 30, 262, 158, 'Splintholz');
    b.L(cx + 40, cy + 46, 262, 198, 'Kernholz');
    b.L(cx + 57, cy - 20, 262, 238, 'Jahresring');
    b.L(cx, cy, 262, 276, 'Mark');
    b.text(8, 280, '1 Ring = 1 Jahr', 'start', 13);
  } else if (e.t === 'shroom') {
    const k = e.kind as string;
    titel = `Abb. 1 – Längsschnitt: ${name}`;
    b.linie(10, 250, 250, 252, { strokeWidth: 1 });
    for (let i = 0; i < 9; i++) {
      const sx = 60 + i * 20;
      b.kurve(
        [
          [sx + 40, 250],
          [sx + 30 + (i % 3) * 8, 265],
          [sx + 15, 276],
          [sx, 284],
        ],
        { strokeWidth: 0.6, roughness: 1.8 },
      );
    }
    if (k === 'mass') {
      b.pfad(
        'M60 180 C40 120 80 70 130 80 C150 40 210 60 210 100 C250 110 240 180 200 190 C170 215 90 215 60 180Z',
        b.wash(tint),
      );
      for (let i = 0; i < 8; i++)
        b.kurve(
          [
            [80 + i * 16, 100 + (i % 2) * 10],
            [86 + i * 16, 140],
            [80 + i * 16, 175],
          ],
          { strokeWidth: 0.7 },
        );
      b.rechteck(115, 190, 40, 60, { fill: '#8a6a4a', fillStyle: 'hachure', hachureGap: 4 });
      b.L(205, 105, 258, 60, 'Fruchtkörper');
      b.L(150, 178, 258, 128, 'Sporenschicht');
      b.L(150, 215, 258, 196, 'Ansatzstelle');
      b.L(150, 262, 258, 262, 'Myzel');
    } else if (k === 'ridges') {
      b.pfad(
        'M60 110 C90 140 120 150 128 170 L132 250 L168 250 L172 170 C180 150 210 140 240 110 C200 98 100 98 60 110Z',
        b.wash(tint),
      );
      for (let i = 0; i < 7; i++) {
        b.kurve(
          [
            [75 + i * 13, 118 + i * 3],
            [110 + i * 4, 140 + i * 2],
            [131 + i, 170 + i * 4],
          ],
          { strokeWidth: 0.7 },
        );
        b.kurve(
          [
            [225 - i * 13, 118 + i * 3],
            [190 - i * 4, 140 + i * 2],
            [169 - i, 170 + i * 4],
          ],
          { strokeWidth: 0.7 },
        );
      }
      b.L(80, 108, 44, 60, 'Hut');
      b.L(110, 138, 44, 130, 'Leisten');
      b.L(150, 210, 258, 200, 'Stiel');
      b.L(150, 262, 258, 262, 'Myzel');
      b.text(170, 72, 'Leisten statt Lamellen!', 'start', 13);
    } else {
      const dick = k === 'bolete';
      b.pfad('M45 120 C55 55 245 55 255 120 Z', { fill: tint, fillStyle: 'solid' });
      b.pfad('M55 118 C65 70 235 70 245 118 Z', { fill: '#f1e7cf', fillStyle: 'solid', strokeWidth: 0.7 });
      b.rechteck(48, 120, 204, dick ? 20 : 12, { fill: dick ? '#d8c86a' : '#e9e0cc', fillStyle: 'solid' });
      for (let xx = 54; xx < 250; xx += dick ? 4 : 6)
        b.linie(xx, 121, xx, dick ? 139 : 131, { strokeWidth: 0.5, roughness: 0.4 });
      const bw = dick ? 34 : 16;
      const o = dick ? 140 : 132;
      b.pfad(
        `M${150 - bw} ${o} C${150 - bw - 4} 180 ${150 - bw - (dick ? 14 : 4)} 220 ${150 - bw - 6} 246 L${150 + bw + 6} 246 C${150 + bw + (dick ? 14 : 4)} 220 ${150 + bw + 4} 180 ${150 + bw} ${o}Z`,
        { fill: dick && id === 'satan' ? '#c63b2c' : '#efe5cf', fillStyle: 'hachure', hachureGap: 6 },
      );
      if (k === 'amanita') {
        b.pfad('M134 152 C126 168 128 174 120 176 L180 176 C172 174 174 168 166 152', {
          fill: '#f3ede0',
          fillStyle: 'solid',
        });
        b.ellipse(150, 242, 76, 36, { fill: '#efe5cf', fillStyle: 'hachure', hachureGap: 5 });
        if (m.spots) {
          for (const [x, y] of [
            [80, 95],
            [120, 78],
            [175, 76],
            [215, 92],
            [150, 88],
          ]) {
            b.ellipse(x, y, 10, 7, { fill: '#fff', fillStyle: 'solid', strokeWidth: 0.8 });
          }
        }
      }
      b.L(90, 80, 44, 50, 'Huthaut');
      b.L(120, 100, 44, 92, 'Hutfleisch');
      b.L(70, 125, 22, 140, dick ? 'Röhren (Poren)' : 'Lamellen');
      b.L(150, 200, 258, 190, 'Stiel');
      if (k === 'amanita') {
        b.L(176, 168, 258, 148, 'Ring');
        b.L(178, 242, 258, 226, 'Knolle (Volva)');
      }
      b.L(150, 262, 258, 264, 'Myzel');
    }
    b.text(14, 174, 'Sporen entstehen hier ↓', 'start', 12, fonts.etikett);
  } else if (e.t === 'drosera') {
    titel = 'Abb. 1 – Fangblatt des Sonnentaus, stark vergrößert';
    b.linie(150, 280, 150, 170, { strokeWidth: 2 });
    b.ellipse(150, 110, 150, 130, { fill: '#c8a060', fillStyle: 'hachure', hachureGap: 5 });
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const ex = 150 + Math.cos(a) * 95;
      const ey = 110 + Math.sin(a) * 84;
      b.linie(150 + Math.cos(a) * 68, 110 + Math.sin(a) * 58, ex, ey, { stroke: '#a0242c', strokeWidth: 1 });
      b.punkt(ex, ey, 3.6, '#bcd8e8', INK);
    }
    b.ellipse(160, 100, 26, 12, { fill: INK, fillStyle: 'solid' });
    b.linie(150, 100, 140, 90);
    b.linie(150, 100, 140, 112);
    b.L(232, 70, 250, 30, 'Tentakel');
    b.L(244, 116, 258, 140, 'Klebetropfen');
    b.L(162, 100, 258, 190, 'gefangene Fliege');
    b.L(150, 230, 258, 250, 'Blattstiel');
  } else if (e.t === 'flower') {
    titel = `Abb. 1 – Bau der Pflanze: ${name}`;
    b.linie(10, 236, 250, 238, { strokeWidth: 1 });
    for (let i = 0; i < 6; i++)
      b.kurve(
        [
          [130, 238],
          [120 + i * 4, 256],
          [100 + i * 10, 280 - (i % 2) * 8],
        ],
        { strokeWidth: 0.7, roughness: 1.6 },
      );
    b.kurve(
      [
        [130, 238],
        [134, 180],
        [128, 120],
        [130, 84],
      ],
      { strokeWidth: 2.2 },
    );
    b.pfad('M131 200 C100 196 74 170 60 150 C90 150 118 172 131 200Z', {
      fill: '#7aa65a',
      fillStyle: 'hachure',
      hachureGap: 5,
    });
    b.pfad('M132 170 C160 160 186 136 196 116 C166 120 140 144 132 170Z', {
      fill: '#7aa65a',
      fillStyle: 'hachure',
      hachureGap: 5,
    });
    b.pfad('M130 84 C108 80 84 60 76 36 C100 40 120 54 130 76Z', b.wash(tint));
    b.pfad('M130 84 C152 80 176 60 184 36 C160 40 140 54 130 76Z', b.wash(tint));
    b.pfad('M122 86 C116 92 114 96 112 102 M138 86 C144 92 146 96 148 102', { strokeWidth: 1 });
    b.ellipse(130, 72, 16, 20, { fill: '#a8c070', fillStyle: 'solid' });
    b.linie(130, 62, 130, 36);
    b.ellipse(130, 34, 10, 6, { fill: INK, fillStyle: 'solid' });
    for (const d of [-1, 1]) {
      b.linie(130 + d * 6, 70, 130 + d * 20, 44, { strokeWidth: 0.8 });
      b.ellipse(130 + d * 21, 42, 6, 10, { fill: '#e6b33a', fillStyle: 'solid', strokeWidth: 0.8 });
    }
    b.L(80, 42, 44, 24, 'Kronblatt');
    b.L(151, 42, 258, 20, 'Staubblatt');
    b.L(130, 36, 258, 52, 'Narbe');
    b.L(136, 72, 258, 84, 'Fruchtknoten');
    b.L(114, 100, 44, 104, 'Kelchblatt');
    b.L(80, 160, 44, 170, 'Laubblatt');
    b.L(133, 214, 258, 206, 'Stängel');
    b.L(115, 262, 258, 270, 'Wurzel');
  } else if (e.t === 'bird') {
    titel = `Abb. 1 – Körperbau: ${name}`;
    const lb = !!m.longBeak;
    b.pfad('M70 150 L18 170 L22 182 L76 166Z', { fill: tint, fillStyle: 'hachure', hachureGap: 4 });
    b.ellipse(140, 150, 150, 94, b.wash(tint));
    b.ellipse(158, 170, 90, 44, {
      fill: (m.c2 as string) ?? tint,
      fillStyle: 'hachure',
      hachureGap: 4,
      hachureAngle: 30,
      strokeWidth: 0.5,
    });
    b.pfad('M100 128 C140 118 180 128 190 150 C160 168 110 172 72 160Z', {
      fill: tint,
      fillStyle: 'cross-hatch',
      hachureGap: 7,
    });
    for (let i = 0; i < 5; i++) b.linie(80 + i * 9, 156 + i, 62 + i * 8, 164 + i * 2, { strokeWidth: 0.8 });
    b.kreis(214, 104, 60, b.wash(tint));
    b.punkt(222, 98, 4);
    b.pfad(lb ? 'M240 100 L310 110 L240 114Z' : 'M240 100 L268 107 L240 114Z', { fill: '#c89a3a', fillStyle: 'solid' });
    if (m.crest)
      for (let i = 0; i < 5; i++) b.linie(204 + i * 4, 76, 192 + i * 8, 48, { strokeWidth: 2, stroke: '#b06a3a' });
    b.linie(140, 196, 136, 236, { strokeWidth: 2 });
    b.linie(158, 196, 164, 236, { strokeWidth: 2 });
    for (const fx of [136, 164]) {
      b.linie(fx, 236, fx - 14, 244);
      b.linie(fx, 236, fx + 12, 244);
      b.linie(fx, 236, fx - 2, 248);
    }
    b.L(262, 108, 262, 70, 'Schnabel');
    b.L(222, 98, 300, 150, 'Auge');
    b.L(198, 128, 300, 190, 'Kehle');
    b.L(176, 170, 300, 226, 'Brust');
    b.L(100, 140, 44, 100, 'Flügel');
    b.L(66, 162, 44, 136, 'Handschwingen');
    b.L(30, 176, 10, 214, 'Steuerfedern');
    b.L(150, 236, 300, 262, 'Lauf & Zehen');
  } else if (e.t === 'mammal') {
    titel = `Abb. 1 – Körperbau und Trittsiegel: ${name}`;
    const lg = 24 + ((m.legs as number) ?? 1) * 26;
    const schnauze = !!m.snout;
    const by = 110;
    b.ellipse(140, by, 170, 70, b.wash(tint));
    if (m.spikes) {
      for (let i = 0; i < 14; i++) {
        const a = Math.PI + (i / 13) * Math.PI;
        b.linie(140 + Math.cos(a) * 80, by + Math.sin(a) * 32, 140 + Math.cos(a) * 100, by + Math.sin(a) * 48, {
          strokeWidth: 0.9,
        });
      }
    }
    b.kreis(232, by - 22, 48, b.wash(tint));
    b.punkt(238, by - 28, 3);
    b.pfad(`M250 ${by - 30} L${schnauze ? 290 : 274} ${by - 16} L250 ${by - 8}Z`, { fill: tint, fillStyle: 'solid' });
    b.punkt(schnauze ? 290 : 274, by - 16, 3);
    const ohr =
      m.ears === 'long'
        ? `M222 ${by - 40} L214 ${by - 104} L234 ${by - 44}Z`
        : `M222 ${by - 40} L222 ${by - 70} L238 ${by - 44}Z`;
    b.pfad(ohr, { fill: tint, fillStyle: 'hachure', hachureGap: 3 });
    if (m.ears === 'lynx') b.linie(222, by - 70, 224, by - 86, { strokeWidth: 2.4 });
    for (const lx of [90, 112, 176, 196])
      b.linie(lx, by + 26, lx + (lx % 3) - 1, by + 26 + lg, { strokeWidth: 5, stroke: INK });
    const tail = m.tail as string;
    if (tail === 'bushy' || tail === 'bushyUp') {
      b.pfad(
        tail === 'bushyUp'
          ? `M60 ${by} C20 ${by - 10} 10 ${by - 70} 40 ${by - 80} C60 ${by - 60} 50 ${by - 30} 66 ${by - 10}Z`
          : `M60 ${by} C30 ${by + 10} 10 ${by + 30} 12 ${by + 44} C40 ${by + 40} 58 ${by + 24} 64 ${by + 10}Z`,
        b.wash(tint),
      );
    } else if (tail === 'flat')
      b.ellipse(34, by + 22, 56, 22, { fill: '#4a3a2a', fillStyle: 'cross-hatch', hachureGap: 4 });
    else if (tail !== 'none')
      b.linie(58, by - 4, 40, by + (tail === 'thin' ? 18 : 6), { strokeWidth: tail === 'puff' ? 6 : 2 });
    const tailX = tail === 'none' ? 60 : 28;
    b.L(226, by - 60, 300, 30, 'Ohr');
    b.L(238, by - 28, 300, 64, 'Auge');
    b.L(schnauze ? 286 : 270, by - 16, 300, 96, 'Nase');
    b.L(150, by - 20, 150, 22, 'Fell');
    b.L(176, by + 60, 300, 150, 'Vorderlauf');
    b.L(92, by + 60, 30, 200, 'Hinterlauf');
    b.L(tailX, by + 4, tailX - 24, 268, (e.tailL as string) ?? 'Schwanz', 'left');
    // Trittsiegel
    const ix = 216;
    const iy = 196;
    b.rechteck(ix, iy, 114, 86, { strokeWidth: 1, roughness: 0.8, fill: '#e7dbbd', fillStyle: 'solid' });
    b.text(ix + 6, iy + 15, 'Trittsiegel', 'start', 13);
    const fx = ix + 57;
    const fy = iy + 52;
    const f = e.foot as string;
    const blk: Options = { fill: INK, fillStyle: 'solid', strokeWidth: 0.6 };
    if (f === 'huf' || f === 'hufplus') {
      b.pfad(`M${fx - 3} ${fy + 22} C${fx - 16} ${fy + 16} ${fx - 14} ${fy - 10} ${fx - 4} ${fy - 24}Z`, blk);
      b.pfad(`M${fx + 3} ${fy + 22} C${fx + 16} ${fy + 16} ${fx + 14} ${fy - 10} ${fx + 4} ${fy - 24}Z`, blk);
      if (f === 'hufplus') {
        b.ellipse(fx - 18, fy + 26, 6, 8, blk);
        b.ellipse(fx + 18, fy + 26, 6, 8, blk);
      }
    } else if (f === 'hase') {
      b.ellipse(fx, fy + 8, 16, 30, blk);
      for (const [a, c] of [
        [-8, -18],
        [-3, -24],
        [3, -24],
        [8, -18],
      ])
        b.ellipse(fx + a, fy + c, 6, 9, blk);
    } else {
      const fuenf = f === 'pfote5';
      b.ellipse(fx, fy + 10, 26, 20, blk);
      const zehen = fuenf
        ? [
            [-16, -6],
            [-9, -16],
            [0, -19],
            [9, -16],
            [16, -6],
          ]
        : [
            [-13, -10],
            [-5, -19],
            [5, -19],
            [13, -10],
          ];
      for (const [a, c] of zehen) {
        b.ellipse(fx + a, fy + c, 8, 10, blk);
        // Krallen – außer bei Katzen (pfote4), die sie einziehen
        if (f !== 'pfote4') b.linie(fx + a * 1.15, fy + c - 6, fx + a * 1.3, fy + c - 12, { strokeWidth: 1.2 });
      }
    }
  }
  return { titel, teile: b.teile };
}

/**
 * Papierkarte "Aus dem Bestimmungsbuch".
 * `gesperrt`: Mystery-Art, noch nicht gefunden – die Zeichnung bleibt verborgen.
 */
export function LehrbuchKarte({ gesperrt, ...eingabe }: Eingabe & { gesperrt?: boolean }) {
  const { id, name, zeichnung, modell } = eingabe;
  const { titel, teile } = useMemo(() => zeichne({ id, name, zeichnung, modell }), [id, name, zeichnung, modell]);
  return (
    <View style={[stile.papier, gesperrt && stile.gesperrt]}>
      <Text style={stile.ueberschrift}>Aus dem Bestimmungsbuch</Text>
      {gesperrt ? (
        <Text style={stile.unterschrift}>Wird nach deinem ersten Fund freigeschaltet.</Text>
      ) : (
        <>
          <Text style={stile.unterschrift}>{titel}</Text>
          <View style={{ width: '100%', aspectRatio: BREITE / HOEHE, marginTop: 4 }}>
            <Svg width="100%" height="100%" viewBox={`${-VERSATZ} 0 ${BREITE} ${HOEHE}`}>
              {teile}
            </Svg>
          </View>
        </>
      )}
    </View>
  );
}

const stile = StyleSheet.create({
  papier: {
    backgroundColor: colors.paper,
    borderRadius: radius.s,
    padding: spacing.m - 2,
    paddingBottom: spacing.s + 2,
    shadowColor: colors.shadow,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  gesperrt: { opacity: 0.45, alignItems: 'center', paddingVertical: spacing.xl },
  ueberschrift: { fontFamily: fonts.titel, fontSize: 20, color: colors.ink },
  unterschrift: { fontFamily: fonts.etikett, fontSize: 11.5, color: colors.inkFaded },
});

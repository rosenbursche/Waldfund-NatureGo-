import type { Art, IconName, KategorieId, ModellParameter, ZeichnungParameter } from './artTypen';
import ROH from './testarten.json';

/**
 * BELASTUNGSTEST: 500 echte heimische Arten, um Stammbaum, Waldansicht und Katalog
 * mit vielen Arten zu prüfen. Nur für die Entwicklung, nicht für die Store-Version.
 *
 * - Namen: echte Arten (scripts/testarten/liste.mjs)
 * - Ordnung, Familie, Beobachtungen in Deutschland: GBIF (scripts/testarten-bauen.mjs)
 * - Seltenheit: grob aus der Zahl der GBIF-Beobachtungen – das ist NICHT die echte Seltenheit
 *   (z. B. werden Brombeeren unter vielen Kleinarten gemeldet und wirken deshalb selten)
 * - Gefahr/Giftigkeit: grobe Markierung, nicht fachlich geprüft
 *
 * Eingeschaltet wird der Test in den Einstellungen → Belastungstest.
 */

type Roh = {
  id: string;
  kategorie: KategorieId;
  name: string;
  lat: string;
  gruppe: string;
  ordnung: string;
  familie: string;
  beobachtungenDE: number;
  seltenheit: 1 | 2 | 3 | 4;
  gefahr?: string;
  farbe: string;
  vorlage: ModellParameter;
};

/** Wonach der Stammbaum im Test gruppiert wird */
export type TestGruppierung = 'vorschlag' | 'familie' | 'ordnung';

const ICON: Record<KategorieId, IconName> = { saeuger: 'mammal', voegel: 'bird', pilze: 'shroom', pflanzen: 'flower' };

function zeichnungFuer(r: Roh): ZeichnungParameter {
  const tint = r.farbe.toLowerCase();
  if (r.kategorie === 'saeuger') return { t: 'mammal', tint, foot: 'pfote4', tailL: 'Schwanz' };
  if (r.kategorie === 'voegel') return { t: 'bird', tint };
  if (r.kategorie === 'pilze') return { t: 'shroom', kind: r.vorlage.shape === 'dome' ? 'bolete' : 'gilled', tint };
  return r.vorlage.t === 'shrub' ? { t: 'tree', kern: tint } : { t: 'flower', tint };
}

function alsArt(r: Roh, gruppierung: TestGruppierung): Art {
  const giftig = r.gefahr?.includes('giftig') ? r.gefahr : undefined;
  return {
    id: r.id,
    kategorie: r.kategorie,
    gruppe: gruppierung === 'familie' ? r.familie : gruppierung === 'ordnung' ? r.ordnung : r.gruppe,
    name: r.name,
    lat: r.lat,
    icon: r.vorlage.t === 'shrub' ? 'tree' : ICON[r.kategorie],
    seltenheit: r.seltenheit,
    schutz: 0,
    giftig,
    gefahr: giftig ? undefined : r.gefahr,
    lebensraum: `Testart · ${r.ordnung} › ${r.familie}`,
    saison: '–',
    groesse: '–',
    wusstestDu: `Testdaten: ${r.beobachtungenDE.toLocaleString('de-DE')} Beobachtungen in Deutschland bei GBIF.`,
    raetsel: r.seltenheit >= 3 ? `Ein seltenes Wesen aus der Familie ${r.familie}.` : undefined,
    verbreitung: 'all',
    modell: { ...r.vorlage, c1: r.farbe },
    zeichnung: zeichnungFuer(r),
  };
}

const roh = ROH as unknown as Roh[];

/** Testarten je Gruppierung (einmal vorbereitet, damit das Umschalten nichts kostet) */
export const TESTARTEN: Record<TestGruppierung, Art[]> = {
  vorschlag: roh.map((r) => alsArt(r, 'vorschlag')),
  familie: roh.map((r) => alsArt(r, 'familie')),
  ordnung: roh.map((r) => alsArt(r, 'ordnung')),
};

/** Reihenfolge der vorgeschlagenen Gruppen wie in der Liste; Familien und Ordnungen alphabetisch */
export function testGruppenReihenfolge(kategorie: KategorieId, gruppierung: TestGruppierung): string[] {
  const namen = TESTARTEN[gruppierung].filter((a) => a.kategorie === kategorie).map((a) => a.gruppe);
  const eindeutig = [...new Set(namen)];
  return gruppierung === 'vorschlag' ? eindeutig : eindeutig.sort((a, b) => a.localeCompare(b));
}

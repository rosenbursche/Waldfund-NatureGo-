import Constants from 'expo-constants';

import { ARTEN } from '@/data/arten';
import type { FundTyp } from '@/logic/fundstueckErkennung';

/**
 * Verbindung zum eigenen Erkennungs-Server (BioCLIP 2, Ordner erkennung/, Gesamtkonzept Abschnitt 17).
 * Das Foto geht an den Server, der Server schickt 6 Kandidaten mit Sicherheit zurück. Fotos werden dort nicht
 * gespeichert. Die Adresse ist kein Geheimnis: zum Testen die IP des Macs im WLAN, z. B. in `.env.local`:
 *   EXPO_PUBLIC_ERKENNUNG_URL=http://192.168.2.221:8765
 */
export function erkennungsUrl(): string {
  const env = process.env.EXPO_PUBLIC_ERKENNUNG_URL;
  const extra = (Constants.expoConfig?.extra as { erkennungBioclip?: string } | undefined)?.erkennungBioclip;
  return (env || extra || '').trim().replace(/\/$/, '');
}

export type Gruppe = 'saeuger' | 'voegel' | 'pflanzen' | 'pilze';

export type Kandidat = {
  id: string;
  name: string;
  wiss: string;
  gruppe: Gruppe;
  gegenklasse: boolean;
  sicherheit: number;
  /** null = ganzes Lebewesen, sonst das erkannte Fundstück (trittsiegel, losung …) */
  typ?: FundTyp | null;
};

export type Erkennungsergebnis = {
  status: 'sicher' | 'gattung' | 'unsicher' | 'kein_wildfund';
  art: Kandidat | null;
  gattung: { name: string; sicherheit: number } | null;
  vorschlaege: Kandidat[];
  hinweis: string | null;
};

export type Vergleichsbild = { url: string; lizenz: string; urheber: string; quelle: string };

export class ErkennungNichtErreichbar extends Error {}

async function mitZeitlimit(url: string, init: RequestInit = {}, ms = 45000): Promise<Response> {
  const ctrl = new AbortController();
  let abgelaufen = false;
  const t = setTimeout(() => {
    abgelaufen = true;
    ctrl.abort();
  }, ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } catch (e) {
    if (abgelaufen)
      throw new ErkennungNichtErreichbar(
        'Der Erkennungs-Server hat zu lange gebraucht. Versuch es bitte gleich noch einmal.',
      );
    // Beim Entwickeln die genaue Adresse und den Fehler zeigen, damit man sieht, woran es liegt
    const genauer = __DEV__
      ? ` (${url.split('/').slice(0, 3).join('/')}: ${e instanceof Error ? e.message : String(e)})`
      : '';
    throw new ErkennungNichtErreichbar(
      `Der Erkennungs-Server ist nicht erreichbar. Läuft er, und ist das Handy im selben WLAN?${genauer}`,
    );
  } finally {
    clearTimeout(t);
  }
}

/**
 * Schickt ein Foto (lokale Datei) an den Server und gibt die Kandidaten zurück.
 * fundstuecke: je Fundstück-Typ die wissenschaftlichen Namen der Arten, die es haben. Der Server erkennt dann selbst,
 * ob das Foto ein ganzes Lebewesen oder ein Fundstück zeigt (jeder Vorschlag hat dann `typ`).
 */
export async function erkenneFoto(
  uri: string,
  optionen: { gruppe?: Gruppe; fundstuecke?: Record<string, string[]> } = {},
): Promise<Erkennungsergebnis> {
  const { gruppe, fundstuecke } = optionen;
  const url = erkennungsUrl();
  if (!url) throw new ErkennungNichtErreichbar('Es ist noch kein Erkennungs-Server eingetragen.');
  const daten = new FormData();
  // React Native: Dateien werden als {uri, name, type} angehängt
  daten.append('foto', { uri, name: 'foto.jpg', type: 'image/jpeg' } as unknown as Blob);
  if (gruppe) daten.append('gruppe', gruppe);
  if (fundstuecke) daten.append('fundstuecke', JSON.stringify(fundstuecke));
  const antwort = await mitZeitlimit(`${url}/erkennen`, { method: 'POST', body: daten });
  if (!antwort.ok) throw new ErkennungNichtErreichbar('Die Erkennung hat das Foto nicht verarbeiten können.');
  return (await antwort.json()) as Erkennungsergebnis;
}

/** Bis zu 3 Vergleichsfotos einer Art (mit Urheber und Lizenz für die Namensnennung). */
export async function vergleichsbilder(id: string): Promise<Vergleichsbild[]> {
  const url = erkennungsUrl();
  if (!url) return [];
  try {
    const antwort = await mitZeitlimit(`${url}/artbilder/${encodeURIComponent(id)}`, {}, 15000);
    if (!antwort.ok) return [];
    return ((await antwort.json()) as { bilder: Vergleichsbild[] }).bilder;
  } catch {
    return [];
  }
}

const norm = (s: string) => s.toLowerCase().trim().split(/\s+/).slice(0, 2).join(' ');
const APP_NACH_LATEIN = new Map(ARTEN.map((a) => [norm(a.lat), a.id]));

/** Gibt die App-Art zu einem Kandidaten zurück (über den wissenschaftlichen Namen), falls es sie gibt. */
export function appArtId(k: Pick<Kandidat, 'wiss'>): string | undefined {
  return APP_NACH_LATEIN.get(norm(k.wiss));
}

/**
 * Regel aus dem Gesamtkonzept 17.3: Wählt der Nutzer die Art, bei der die Erkennung „sicher“ war, zählt der Fund
 * sofort. Sonst ist er zuerst unbestätigt (später bestätigt die Community). Fundstücke nie allein durch die Erkennung.
 */
export function istBestaetigt(ergebnis: Erkennungsergebnis, gewaehlt: Kandidat): boolean {
  return ergebnis.status === 'sicher' && ergebnis.art?.id === gewaehlt.id && !gewaehlt.typ;
}

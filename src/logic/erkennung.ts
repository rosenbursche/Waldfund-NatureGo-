import Constants from 'expo-constants';

import { ARTEN } from '@/data/arten';

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

async function mitZeitlimit(url: string, init: RequestInit = {}, ms = 20000): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } catch {
    throw new ErkennungNichtErreichbar(
      'Der Erkennungs-Server ist nicht erreichbar. Läuft er, und ist das Handy im selben WLAN?',
    );
  } finally {
    clearTimeout(t);
  }
}

/** Schickt ein Foto (lokale Datei) an den Server und gibt die Kandidaten zurück. */
export async function erkenneFoto(uri: string, gruppe?: Gruppe): Promise<Erkennungsergebnis> {
  const url = erkennungsUrl();
  if (!url) throw new ErkennungNichtErreichbar('Es ist noch kein Erkennungs-Server eingetragen.');
  const daten = new FormData();
  // React Native: Dateien werden als {uri, name, type} angehängt
  daten.append('foto', { uri, name: 'foto.jpg', type: 'image/jpeg' } as unknown as Blob);
  if (gruppe) daten.append('gruppe', gruppe);
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
 * sofort. Sonst ist er zuerst unbestätigt (später bestätigt die Community).
 */
export function istBestaetigt(ergebnis: Erkennungsergebnis, gewaehlt: Kandidat): boolean {
  return ergebnis.status === 'sicher' && ergebnis.art?.id === gewaehlt.id;
}

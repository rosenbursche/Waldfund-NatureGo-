/**
 * Wildfund-Erkennungsserver (Cloudflare Worker).
 *
 * Aufgabe: Ein Foto von der App entgegennehmen, mit dem geheimen API-Schlüssel
 * an Pl@ntNet weiterreichen und nur die Artnamen mit Sicherheit zurückgeben.
 *
 * Datenschutz:
 * - Fotos werden NICHT gespeichert, nur durchgereicht.
 * - Keine IP-Adressen, keine Protokolle mit Inhalten.
 * - Gezählt wird nur pro zufälliger Geräte-ID und Tag (für das Kontingent); die
 *   Zähler verfallen nach 2 Tagen automatisch.
 *
 * Anleitung zum Einrichten: server/README.md
 */
import { geraetIdGueltig, kontingentOk, utcTag, zuKandidaten, type PlantnetAntwort } from './logik';

/** Minimale Typen, damit kein Cloudflare-Paket nötig ist */
type KV = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
};
type Umgebung = {
  PLANTNET_KEY: string; // geheim: `npx wrangler secret put PLANTNET_KEY`
  ZAEHLER: KV; // KV-Speicher für die Tageszähler
};

const MAX_BYTES = 4 * 1024 * 1024; // die App schickt verkleinerte Fotos (< 1 MB)

function antwort(daten: unknown, status = 200): Response {
  return new Response(JSON.stringify(daten), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

async function zaehlen(kv: KV, schluessel: string): Promise<number> {
  return Number((await kv.get(schluessel)) ?? 0);
}

export default {
  async fetch(anfrage: Request, env: Umgebung): Promise<Response> {
    const url = new URL(anfrage.url);
    if (anfrage.method !== 'POST' || url.pathname !== '/erkennen') return antwort({ fehler: 'Nicht gefunden' }, 404);

    const geraet = anfrage.headers.get('x-wildfund-geraet');
    if (!geraetIdGueltig(geraet)) return antwort({ fehler: 'Ungültige Anfrage' }, 400);

    // Kontingent prüfen
    const tag = utcTag(new Date());
    const kGeraet = `g:${tag}:${geraet}`;
    const kGesamt = `t:${tag}`;
    const [geraetHeute, gesamtHeute] = await Promise.all([
      zaehlen(env.ZAEHLER, kGeraet),
      zaehlen(env.ZAEHLER, kGesamt),
    ]);
    const k = kontingentOk(geraetHeute, gesamtHeute);
    if (!k.ok) return antwort({ fehler: k.grund }, 429);

    // Foto aus der Anfrage holen
    const form = await anfrage.formData();
    const foto = form.get('foto');
    if (!foto || typeof foto === 'string') return antwort({ fehler: 'Kein Foto' }, 400);
    if (foto.size > MAX_BYTES) return antwort({ fehler: 'Foto zu groß' }, 413);

    // An Pl@ntNet weiterreichen – der Schlüssel verlässt den Server nie
    const weiter = new FormData();
    weiter.append('images', foto, 'foto.jpg');
    weiter.append('organs', 'auto');
    const ziel = `https://my-api.plantnet.org/v2/identify/all?lang=de&nb-results=5&api-key=${encodeURIComponent(env.PLANTNET_KEY)}`;
    const pn = await fetch(ziel, { method: 'POST', body: weiter });

    // Zähler erhöhen (verfallen nach 2 Tagen)
    await Promise.all([
      env.ZAEHLER.put(kGeraet, String(geraetHeute + 1), { expirationTtl: 172800 }),
      env.ZAEHLER.put(kGesamt, String(gesamtHeute + 1), { expirationTtl: 172800 }),
    ]);

    if (pn.status === 404) return antwort({ kandidaten: [] }); // Pl@ntNet: keine Pflanze erkannt
    if (!pn.ok) return antwort({ fehler: 'Erkennung gerade nicht erreichbar' }, 502);
    return antwort({ kandidaten: zuKandidaten((await pn.json()) as PlantnetAntwort) });
  },
};

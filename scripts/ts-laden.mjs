/**
 * Lädt die TypeScript-Daten der App (src/data/*.ts) in Node-Skripten.
 * Node 24 versteht TypeScript selbst; hier kommt nur dazu, was die App über Metro bekommt:
 * Pfade ohne Endung, der Kurzweg `@/` für `src/`, JSON-Dateien und `require()` von Bildern.
 *
 *   import './ts-laden.mjs';   // als erste Zeile, danach normal importieren
 */
import { existsSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');

registerHooks({
  resolve(spezifizierer, kontext, weiter) {
    let s = spezifizierer;
    if (s.startsWith('@/')) s = pathToFileURL(join(SRC, s.slice(2))).href;
    if ((s.startsWith('.') || s.startsWith('file:')) && !/\.[a-z]+$/i.test(s)) {
      const basis = s.startsWith('file:') ? fileURLToPath(s) : join(dirname(fileURLToPath(kontext.parentURL)), s);
      for (const endung of ['.ts', '.tsx', '/index.ts']) {
        if (existsSync(basis + endung)) return weiter(pathToFileURL(basis + endung).href, kontext);
      }
    }
    if (s.endsWith('.json'))
      return { ...weiter(s, { ...kontext, importAttributes: { type: 'json' } }), importAttributes: { type: 'json' } };
    return weiter(s, kontext);
  },
});

// Bilder: `require('…jpg')` liefert in der App eine Nummer, hier reicht der Pfad
globalThis.require ??= (pfad) => pfad;

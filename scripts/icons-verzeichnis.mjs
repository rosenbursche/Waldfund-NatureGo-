/**
 * Baut src/data/icons/index.ts neu: alle Art-Icons (src/data/icons/<artId>.json) als statische requires,
 * damit Metro sie in die App packt. Nach neuen Icons ausführen: node scripts/icons-verzeichnis.mjs
 */
import { readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ordner = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'icons');
const ids = readdirSync(ordner)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.slice(0, -5))
  .sort();
writeFileSync(
  join(ordner, 'index.ts'),
  `// Erzeugt von scripts/icons-verzeichnis.mjs – nicht von Hand ändern.\n` +
    `import type { ArtIconDaten } from '@/logic/taler/taler';\n\n` +
    `export const ART_ICONS: Record<string, ArtIconDaten> = {\n` +
    ids.map((id) => `  '${id}': require('./${id}.json'),`).join('\n') +
    `\n};\n`,
);
console.log(`${ids.length} Icons → src/data/icons/index.ts`);

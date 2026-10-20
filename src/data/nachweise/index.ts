// Erzeugt von scripts/gbif-verbreitung.mjs – nicht von Hand ändern.
import type { EchteVerbreitung } from './typ';

export const ECHTE_VERBREITUNG: Record<string, EchteVerbreitung> = {
  'biber': require('./biber.json'),
  'dachs': require('./dachs.json'),
  'eichhoernchen': require('./eichhoernchen.json'),
  'feldhase': require('./feldhase.json'),
  'fuchs': require('./fuchs.json'),
  'igel': require('./igel.json'),
  'luchs': require('./luchs.json'),
  'reh': require('./reh.json'),
  'wildkatze': require('./wildkatze.json'),
  'wildschwein': require('./wildschwein.json'),
};

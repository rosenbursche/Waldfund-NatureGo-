import { STECKBRIEFE } from '@/data/steckbriefe';

/**
 * Nahrungsnetz: Wer frisst wen?
 * Die Tiere kennen ihre Nahrung (Steckbrief → nahrungIds).
 * Für Pflanzen, Pilze und Beutetiere wird daraus rückwärts "Wer frisst mich?".
 */
export function frisst(id: string): string[] {
  return STECKBRIEFE[id]?.nahrungIds ?? [];
}

export function wirdGefressenVon(id: string): string[] {
  return Object.entries(STECKBRIEFE)
    .filter(([, s]) => s.nahrungIds.includes(id))
    .map(([tier]) => tier);
}

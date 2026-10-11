import { geraetIdGueltig, GERAET_PRO_TAG, GESAMT_PRO_TAG, kontingentOk, utcTag, zuKandidaten } from '../logik';

describe('Erkennungsserver: Logik', () => {
  test('Pl@ntNet-Antwort wird in Kandidaten übersetzt', () => {
    const k = zuKandidaten({
      results: [
        { score: 0.12, species: { scientificNameWithoutAuthor: 'Quercus petraea', commonNames: ['Traubeneiche'] } },
        { score: 0.83, species: { scientificNameWithoutAuthor: 'Quercus robur', commonNames: ['Stieleiche'] } },
        { score: 0.5 }, // ohne Art – wird ignoriert
      ],
    });
    expect(k).toEqual([
      { lat: 'Quercus robur', name: 'Stieleiche', sicherheit: 0.83 },
      { lat: 'Quercus petraea', name: 'Traubeneiche', sicherheit: 0.12 },
    ]);
  });

  test('leere Antwort ergibt keine Kandidaten', () => {
    expect(zuKandidaten({})).toEqual([]);
  });

  test('Kontingent pro Gerät und gesamt', () => {
    expect(kontingentOk(0, 0)).toEqual({ ok: true });
    expect(kontingentOk(GERAET_PRO_TAG, 0).ok).toBe(false);
    expect(kontingentOk(0, GESAMT_PRO_TAG).ok).toBe(false);
    expect(GESAMT_PRO_TAG).toBeLessThan(500); // Pl@ntNet-Gratisgrenze
  });

  test('Geräte-ID muss eine zufällige ID sein', () => {
    expect(geraetIdGueltig('3f2a9c1e-7b4d-4e8a-9f01-2c3d4e5f6a7b')).toBe(true);
    expect(geraetIdGueltig('max.mustermann@example.com')).toBe(false);
    expect(geraetIdGueltig(null)).toBe(false);
  });

  test('Tageswechsel nach UTC', () => {
    expect(utcTag(new Date('2026-10-11T23:30:00Z'))).toBe('2026-10-11');
  });
});

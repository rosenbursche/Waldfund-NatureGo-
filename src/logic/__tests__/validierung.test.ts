import { bewerte, MIN_SICHERHEIT, validatePhoto, type ErwarteteArt } from '@/logic/validierung';

const fliegenpilz: ErwarteteArt = {
  id: 'fliegenpilz',
  name: 'Fliegenpilz',
  lat: 'Amanita muscaria',
  kategorie: 'pilze',
};

describe('Bewertung der Erkennung', () => {
  test('richtige Art mit hoher Sicherheit zählt', () => {
    expect(bewerte([{ lat: 'Amanita muscaria (L.) Lam.', sicherheit: 0.91 }], fliegenpilz)).toEqual({
      status: 'treffer',
      sicherheit: 0.91,
    });
  });

  test('richtige Art, aber zu unsicher: freundliche Tipps statt Fund', () => {
    const r = bewerte([{ lat: 'Amanita muscaria', sicherheit: MIN_SICHERHEIT - 0.1 }], fliegenpilz);
    expect(r.status).toBe('unsicher');
    if (r.status === 'unsicher') expect(r.tipps.some((t) => t.includes('nicht ausreißen'))).toBe(true);
  });

  test('richtige Art nur auf Platz 2 zählt nicht', () => {
    const r = bewerte(
      [
        { lat: 'Amanita pantherina', sicherheit: 0.7 },
        { lat: 'Amanita muscaria', sicherheit: 0.65 },
      ],
      fliegenpilz,
    );
    expect(r.status).toBe('unsicher');
  });

  test('andere Art erkannt', () => {
    const r = bewerte([{ lat: 'Boletus edulis', name: 'Steinpilz', sicherheit: 0.9 }], fliegenpilz);
    expect(r).toMatchObject({ status: 'andereArt', erkannt: { name: 'Steinpilz' } });
  });

  test('gar nichts erkannt', () => {
    expect(bewerte([], fliegenpilz).status).toBe('unsicher');
  });
});

describe('validatePhoto', () => {
  test('Demo-Modus findet die Art', async () => {
    const r = await validatePhoto({ uri: 'file://x.jpg' }, fliegenpilz, {
      modus: 'demo',
      demo: { fehlschlagQuote: 0 },
    });
    expect(r.status).toBe('treffer');
  });

  test('Demo-Modus kann ein unscharfes Foto simulieren', async () => {
    const r = await validatePhoto({ uri: 'file://x.jpg' }, fliegenpilz, {
      modus: 'demo',
      demo: { fehlschlagQuote: 0.5, zufall: () => 0.1 },
    });
    expect(r.status).toBe('unsicher');
  });

  test('echter Modus ist noch nicht eingerichtet', async () => {
    await expect(
      validatePhoto({ uri: 'file://x.jpg' }, fliegenpilz, { modus: 'echt', demo: { fehlschlagQuote: 0 } }),
    ).rejects.toThrow('Phase 8');
  });
});

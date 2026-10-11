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

  test('echter Modus ohne Server-Adresse meldet freundlich, dass er noch nicht eingerichtet ist', async () => {
    const stieleiche: ErwarteteArt = {
      id: 'stieleiche',
      name: 'Stieleiche',
      lat: 'Quercus robur',
      kategorie: 'pflanzen',
    };
    await expect(
      validatePhoto({ uri: 'file://x.jpg' }, stieleiche, { modus: 'echt', demo: { fehlschlagQuote: 0 } }),
    ).rejects.toThrow('noch nicht eingerichtet');
  });
});

describe('Echte Erkennung über den eigenen Server (mit Attrappe)', () => {
  const stieleiche: ErwarteteArt = {
    id: 'stieleiche',
    name: 'Stieleiche',
    lat: 'Quercus robur',
    kategorie: 'pflanzen',
  };
  const attrappe = (status: number, daten: unknown) =>
    jest.fn(async () => ({ ok: status < 300, status, json: async () => daten }) as unknown as Response);

  test('Pflanze wird über den Server erkannt', async () => {
    const senden = attrappe(200, { kandidaten: [{ lat: 'Quercus robur', name: 'Stieleiche', sicherheit: 0.88 }] });
    const r = await validatePhoto({ uri: 'file://x.jpg' }, stieleiche, {
      modus: 'echt',
      demo: { fehlschlagQuote: 0 },
      server: { url: 'https://server.test/', geraetId: 'abcdef0123456789abcd', senden },
    });
    expect(r).toMatchObject({ status: 'treffer', quelle: 'plantnet' });
    const [adresse, optionen] = senden.mock.calls[0] as unknown as [string, RequestInit];
    expect(adresse).toBe('https://server.test/erkennen');
    // Der API-Schlüssel steckt nicht in der App – nur die Geräte-ID wird mitgeschickt
    expect(JSON.stringify(optionen.headers)).not.toMatch(/api-key/i);
  });

  test('Kontingent erschöpft: Server-Meldung wird weitergegeben', async () => {
    const senden = attrappe(429, { fehler: 'Für heute sind alle Erkennungen verbraucht. Morgen geht es weiter!' });
    await expect(
      validatePhoto({ uri: 'file://x.jpg' }, stieleiche, {
        modus: 'echt',
        demo: { fehlschlagQuote: 0 },
        server: { url: 'https://server.test', geraetId: 'abcdef0123456789abcd', senden },
      }),
    ).rejects.toThrow('Morgen geht es weiter');
  });

  test('Pilze bleiben im Demo-Modus und sind so gekennzeichnet', async () => {
    const senden = attrappe(200, {});
    const r = await validatePhoto({ uri: 'file://x.jpg' }, fliegenpilz, {
      modus: 'echt',
      demo: { fehlschlagQuote: 0 },
      server: { url: 'https://server.test', geraetId: 'abcdef0123456789abcd', senden },
    });
    expect(r.quelle).toBe('demo');
    expect(senden).not.toHaveBeenCalled();
  });
});

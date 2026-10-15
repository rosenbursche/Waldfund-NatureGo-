/**
 * Render-Tests: Jeder Screen wird einmal komplett dargestellt.
 * So fallen Laufzeitfehler auf, die beim reinen Bauen nicht sichtbar sind.
 */
import { fireEvent, render, screen } from '@testing-library/react-native';

import ArtSeite from '@/app/art/[id]';
import { ARTEN } from '@/data/arten';
import { BAUMARTEN } from '@/data/baumarten';
import Einstellungen from '@/app/einstellungen';
import Start from '@/app/index';
import Katalog from '@/app/katalog/[kategorie]';
import Modelltest from '@/app/modelltest';
import Mystery from '@/app/mystery';
import Sammeln from '@/app/sammeln/[id]';
import Tagebuch from '@/app/tagebuch';
import Ergebnis from '@/app/onboarding/ergebnis';
import Willkommen from '@/app/onboarding/index';
import Liste from '@/app/onboarding/liste';
import Suche from '@/app/onboarding/suche';
import Waehlen from '@/app/onboarding/waehlen';
import { useEinstellungen } from '@/store/einstellungen';
import { useSammlung } from '@/store/sammlung';

const mockParams: Record<string, string> = { id: 'lueneburger-heide', per: 'liste' };
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), replace: jest.fn(), canDismiss: () => false, dismissAll: jest.fn() },
  useLocalSearchParams: () => mockParams,
  useFocusEffect: () => {},
  Redirect: () => null,
}));
jest.mock('expo-location', () => ({}));
// Im Test gibt es keine Grafikkarte – die 3D-Szene wird durch eine Attrappe ersetzt.
jest.mock('@/scene/Lichtung', () => ({ Lichtung: () => null }));
jest.mock('@/scene/ArtBuehne', () => ({ ArtBuehne: () => null }));
jest.mock('@/scene/KategorieWald', () => ({ KategorieWald: () => null }));
jest.mock('@/logic/foto', () => ({ fotoAufnehmen: jest.fn(), fotoBehalten: jest.fn(), alleFotosLoeschen: jest.fn() }));

describe('Screens rendern ohne Fehler', () => {
  test('Willkommen', async () => {
    await render(<Willkommen />);
    expect(screen.getByText('Wildfund')).toBeTruthy();
  });

  test('Naturraum wählen', async () => {
    await render(<Waehlen />);
    expect(screen.getByText('Standort verwenden')).toBeTruthy();
  });

  test('Suche', async () => {
    await render(<Suche />);
    expect(screen.getByText('Ort oder PLZ')).toBeTruthy();
  });

  test('Liste', async () => {
    await render(<Liste />);
    expect(screen.getByText('Lüneburger Heide')).toBeTruthy();
  });

  test('Ergebnis Lüneburger Heide', async () => {
    await render(<Ergebnis />);
    expect(screen.getByText('Stieleiche')).toBeTruthy();
    expect(screen.getByText(/Gemeine Fichte/)).toBeTruthy();
  });

  test('Startseite mit gewähltem Naturraum (Bild-Diorama)', async () => {
    useEinstellungen.setState({ naturraumId: 'hochharz', startSzene: 'diorama' });
    await render(<Start />);
    expect(screen.getByText(/Hochharz ·/)).toBeTruthy();
    expect(screen.getByText('Kippe das Handy · tippe einen Runenstein an')).toBeTruthy();
    expect(screen.getByText('Entdecker')).toBeTruthy(); // Rang in der Fortschrittsanzeige
    // alle vier Runensteine sind als Knöpfe erreichbar (auch für Screenreader)
    expect(screen.getByLabelText(/^Pflanzen: \d+ von \d+ gesammelt/)).toBeTruthy();
    expect(screen.getByLabelText(/^Säugetiere: \d+ von \d+ gesammelt/)).toBeTruthy();
  });

  test('Startseite mit 3D-Lichtung', async () => {
    useEinstellungen.setState({ naturraumId: 'hochharz', startSzene: '3d' });
    await render(<Start />);
    expect(screen.getByText('Tippe einen Baum oder Runenstein an')).toBeTruthy();
  });

  test('Artenseite einer Baumart', async () => {
    mockParams.id = 'fichte';
    useEinstellungen.setState({ naturraumId: 'lueneburger-heide' });
    await render(<ArtSeite />);
    expect(screen.getByText(/Gemeine Fichte – hier angepflanzt, nicht heimisch/)).toBeTruthy();
    expect(screen.getByText('Aus dem Bestimmungsbuch')).toBeTruthy();
  });

  test('Artenseite eines Tieres: Wild-Wert, Key Features, Nahrung mit Verknüpfungen, Spuren, Wohnen', async () => {
    mockParams.id = 'reh';
    useSammlung.setState({ gefunden: {} });
    await render(<ArtSeite />);
    expect(screen.getByText('Wild-Wert · 1–100')).toBeTruthy();
    expect(screen.getByText('Key Features')).toBeTruthy();
    expect(screen.getByLabelText('Stieleiche')).toBeTruthy(); // verknüpfte Nahrung
    expect(screen.getByText('Spuren')).toBeTruthy();
    expect(screen.getByText('Wohnen & Schlafen')).toBeTruthy();
    expect(screen.getByText('Fressfeinde')).toBeTruthy(); // der Luchs jagt Rehe
    expect(screen.getByText(/Realistisches 3D-Modell \(Platzhalter\)/)).toBeTruthy();
  });

  test('Artenseite eines Vogels: Füße, Nest, Warum so gebaut', async () => {
    mockParams.id = 'buntspecht';
    await render(<ArtSeite />);
    expect(screen.getByText('Füße & Krallen')).toBeTruthy();
    expect(screen.getByText('Nest')).toBeTruthy();
    expect(screen.getByText('Warum so gebaut?')).toBeTruthy();
  });

  test('Artenseite einer Pflanze: Wer frisst mich?', async () => {
    mockParams.id = 'stieleiche';
    await render(<ArtSeite />);
    expect(screen.getByText('Wer frisst mich?')).toBeTruthy();
    expect(screen.getByLabelText('Eichelhäher')).toBeTruthy();
  });

  test('Artenseite einer giftigen Pflanze warnt', async () => {
    mockParams.id = 'tollkirsche';
    await render(<ArtSeite />);
    expect(screen.getByText(/Nichts davon in den Mund nehmen/)).toBeTruthy();
  });

  test('Artenseite eines Pilzes: Giftwarnung, Schutzstatus, Wusstest du', async () => {
    mockParams.id = 'knolli';
    await render(<ArtSeite />);
    expect(screen.getByText(/Tödlich giftig/)).toBeTruthy();
    expect(screen.getByText(/Iss niemals Pilze/)).toBeTruthy();
    expect(screen.getByText('Wusstest du?')).toBeTruthy();
    expect(screen.getByText('Verbreitung in Deutschland')).toBeTruthy();
  });

  test('alle 48 Arten und alle Baumarten haben eine Artenseite', async () => {
    for (const id of [...ARTEN, ...BAUMARTEN].map((a) => a.id)) {
      mockParams.id = id;
      await render(<ArtSeite />);
      expect(screen.queryByText('Unbekannte Art')).toBeNull();
    }
  });

  test('Katalog: Wald-Ansicht ist Standard, mit Umschalter', async () => {
    mockParams.kategorie = 'voegel';
    useEinstellungen.setState({ katalogAnsicht: 'wald' });
    await render(<Katalog />);
    expect(screen.getByText('Tippe eine Art an')).toBeTruthy();
    expect(screen.getByLabelText('Ansicht Stammbaum')).toBeTruthy();
  });

  test('Katalog Pilze: Lebensbaum mit Ästen, Stern und Schattenwurzeln', async () => {
    mockParams.kategorie = 'pilze';
    useSammlung.setState({ gefunden: {} });
    useEinstellungen.setState({ katalogAnsicht: 'stammbaum' });
    await render(<Katalog />);
    expect(screen.getByLabelText('Ast Blätterpilze, 0 von 2 gefunden')).toBeTruthy();
    // Mystery-Art ist ein matter Stern und bleibt verborgen
    expect(screen.getByLabelText(/Unbekannter Stern, Legendär, 1000 Punkte/)).toBeTruthy();
    expect(screen.queryByText('Igel-Stachelbart')).toBeNull();
    // Arten erscheinen erst, wenn der Ast geöffnet wird
    expect(screen.queryByLabelText(/Fichten-Steinpilz/)).toBeNull();
    await fireEvent.press(screen.getByLabelText(/Ast Röhrlinge/));
    expect(screen.getByLabelText(/Fichten-Steinpilz/)).toBeTruthy();
    // Schattenwurzeln öffnen "Gefährlich & tödlich"
    expect(screen.queryByText('☠ Gefährlich & tödlich ☠')).toBeNull();
    await fireEvent.press(screen.getByLabelText(/Schattenwurzeln: Gefährlich/));
    expect(screen.getByText('☠ Gefährlich & tödlich ☠')).toBeTruthy();
    expect(screen.getByLabelText(/Grüner Knollenblätterpilz, tödlich giftig/)).toBeTruthy();
  });

  test('Katalog Pflanzen: Äste Bäume und Büsche, giftige Pflanzen nur in den Wurzeln', async () => {
    mockParams.kategorie = 'pflanzen';
    useEinstellungen.setState({ naturraumId: 'lueneburger-heide', katalogAnsicht: 'stammbaum' });
    await render(<Katalog />);
    expect(screen.getByText('Bäume')).toBeTruthy();
    await fireEvent.press(screen.getByLabelText(/Ast Büsche/));
    expect(screen.getByLabelText(/^Gewöhnliche Hasel,/)).toBeTruthy();
    expect(screen.queryAllByLabelText(/Blauer Eisenhut/)).toHaveLength(0);
    await fireEvent.press(screen.getByLabelText(/Schattenwurzeln: Gefährlich/));
    expect(screen.getAllByLabelText(/Blauer Eisenhut/)).toHaveLength(1);
  });

  test('Katalog Vögel: Schattenwurzeln erklären ehrlich, dass keine Vogelart gefährlich ist', async () => {
    mockParams.kategorie = 'voegel';
    useEinstellungen.setState({ katalogAnsicht: 'stammbaum' });
    await render(<Katalog />);
    await fireEvent.press(screen.getByLabelText(/Schattenwurzeln: Gefährlich/));
    expect(screen.getByText(/Keine heimische Vogelart ist für Menschen gefährlich/)).toBeTruthy();
  });

  test('Mystery-Zone über alle Reiche', async () => {
    await render(<Mystery />);
    expect(screen.getByText('Säugetiere')).toBeTruthy();
    expect(screen.queryByText('Eurasischer Luchs')).toBeNull();
  });

  test('Mystery-Art zeigt auf der Artenseite nur das Rätsel', async () => {
    mockParams.id = 'luchs';
    await render(<ArtSeite />);
    expect(screen.getByText('Mystery-Art')).toBeTruthy();
    expect(screen.queryByText('Eurasischer Luchs')).toBeNull();
  });

  test('Sammeln: Startschritt mit Schutzhinweis', async () => {
    mockParams.id = 'eisvogel';
    await render(<Sammeln />);
    expect(screen.getByText('Kamera öffnen')).toBeTruthy();
    expect(screen.getByText(/Streng geschützt: Nur aus Abstand fotografieren/)).toBeTruthy();
  });

  test('Sammeln einer Mystery-Art verrät den Namen nicht', async () => {
    mockParams.id = 'luchs';
    useSammlung.setState({ gefunden: {} });
    await render(<Sammeln />);
    expect(screen.getByText('Mystery-Art')).toBeTruthy();
    expect(screen.queryByText('Eurasischer Luchs')).toBeNull();
  });

  test('Feldtagebuch zeigt Level, Hütte und Erfolge', async () => {
    useSammlung.setState({ gefunden: { amsel: { datum: '2026-10-11' } }, ap: 120, serie: 2 });
    await render(<Tagebuch />);
    expect(screen.getByText('Spurenleser')).toBeTruthy(); // 120 AP = Level 3
    expect(screen.getByText('Waldhütte')).toBeTruthy();
    expect(screen.getByText('Erster Fund')).toBeTruthy();
  });

  test('3D-Test-Ansicht zeigt Modell-Herkunft und Namensnennung', async () => {
    await render(<Modelltest />);
    expect(screen.getByText(/Platzhalter, kein echtes Reh/)).toBeTruthy();
    expect(screen.getByText(/pighunt3r15/)).toBeTruthy();
  });

  test('Einstellungen', async () => {
    useEinstellungen.setState({ naturraumId: 'hochharz', gewaehltPer: 'liste' });
    await render(<Einstellungen />);
    expect(screen.getAllByText(/Thünen-Institut/).length).toBeGreaterThanOrEqual(2); // Naturräume und Karte
    expect(screen.getByText(/Natural Earth/)).toBeTruthy();
  });
});

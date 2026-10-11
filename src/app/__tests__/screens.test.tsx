/**
 * Render-Tests: Jeder Screen wird einmal komplett dargestellt.
 * So fallen Laufzeitfehler auf, die beim reinen Bauen nicht sichtbar sind.
 */
import { render, screen } from '@testing-library/react-native';

import ArtSeite from '@/app/art/[id]';
import Einstellungen from '@/app/einstellungen';
import Start from '@/app/index';
import Katalog from '@/app/katalog/[kategorie]';
import Mystery from '@/app/mystery';
import Ergebnis from '@/app/onboarding/ergebnis';
import Willkommen from '@/app/onboarding/index';
import Liste from '@/app/onboarding/liste';
import Suche from '@/app/onboarding/suche';
import Waehlen from '@/app/onboarding/waehlen';
import { useEinstellungen } from '@/store/einstellungen';

const mockParams: Record<string, string> = { id: 'lueneburger-heide', per: 'liste' };
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn(), replace: jest.fn(), canDismiss: () => false, dismissAll: jest.fn() },
  useLocalSearchParams: () => mockParams,
  Redirect: () => null,
}));
jest.mock('expo-location', () => ({}));
// Im Test gibt es keine Grafikkarte – die 3D-Szene wird durch eine Attrappe ersetzt.
jest.mock('@/scene/Lichtung', () => ({ Lichtung: () => null }));

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

  test('Startseite mit gewähltem Naturraum', async () => {
    useEinstellungen.setState({ naturraumId: 'hochharz' });
    await render(<Start />);
    expect(screen.getByText('Hochharz')).toBeTruthy();
    expect(screen.getByText('Tippe einen Baum oder Runenstein an')).toBeTruthy();
  });

  test('Artenseite (vorläufig)', async () => {
    mockParams.id = 'fichte';
    useEinstellungen.setState({ naturraumId: 'lueneburger-heide' });
    await render(<ArtSeite />);
    expect(screen.getByText('Gemeine Fichte – hier angepflanzt, nicht heimisch')).toBeTruthy();
  });

  test('Katalog Pilze mit Stammbaum und Mystery-Zone', async () => {
    mockParams.kategorie = 'pilze';
    await render(<Katalog />);
    expect(screen.getByText('Blätterpilze')).toBeTruthy();
    expect(screen.getByText('Mystery-Zone')).toBeTruthy();
    // Mystery-Arten bleiben verborgen: Rätsel statt Name
    expect(screen.queryByText('Igel-Stachelbart')).toBeNull();
    expect(screen.getByText(/weißer Wasserfall aus Eiszapfen/)).toBeTruthy();
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

  test('Einstellungen', async () => {
    useEinstellungen.setState({ naturraumId: 'hochharz', gewaehltPer: 'liste' });
    await render(<Einstellungen />);
    expect(screen.getByText(/Thünen-Institut/)).toBeTruthy();
  });
});

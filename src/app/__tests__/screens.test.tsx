/**
 * Render-Tests: Jeder Screen wird einmal komplett dargestellt.
 * So fallen Laufzeitfehler auf, die beim reinen Bauen nicht sichtbar sind.
 */
import { render, screen } from '@testing-library/react-native';

import Einstellungen from '@/app/einstellungen';
import Start from '@/app/index';
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
  });

  test('Einstellungen', async () => {
    useEinstellungen.setState({ naturraumId: 'hochharz', gewaehltPer: 'liste' });
    await render(<Einstellungen />);
    expect(screen.getByText(/Thünen-Institut/)).toBeTruthy();
  });
});

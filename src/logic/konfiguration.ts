import Constants from 'expo-constants';

/**
 * Öffentliche Einstellungen aus app.json → "extra".
 * Hier stehen KEINE Geheimnisse – nur die Adresse des eigenen Erkennungsservers.
 * Der Pl@ntNet-Schlüssel liegt ausschließlich auf dem Server.
 */
export function erkennungsServerUrl(): string {
  const url = (Constants.expoConfig?.extra as { erkennungsServer?: string } | undefined)?.erkennungsServer;
  return typeof url === 'string' ? url.trim() : '';
}

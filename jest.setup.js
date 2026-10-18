// Testumgebung: Handy-Funktionen, die es im Test nicht gibt, durch Attrappen ersetzen.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Animationen laufen im Test nicht wirklich – die Bibliothek liefert dafür eine Attrappe.
// „Bewegung reduzieren“ ist im Test an: Die lebendige Tierseite hat viele Endlos-Animationen
// (Teilchen, Nebel, Fährte), die sonst im Test ununterbrochen weiterlaufen und ihn sehr langsam machen.
jest.mock('react-native-reanimated', () => ({
  ...require('react-native-reanimated/mock'),
  useReducedMotion: () => true,
}));
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));

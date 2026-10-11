// Testumgebung: Handy-Funktionen, die es im Test nicht gibt, durch Attrappen ersetzen.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Animationen laufen im Test nicht wirklich – die Bibliothek liefert dafür eine Attrappe.
jest.mock('react-native-reanimated', () => ({
  ...require('react-native-reanimated/mock'),
  useReducedMotion: () => false,
}));
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));

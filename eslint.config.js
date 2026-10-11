// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.cache/*'],
  },
  {
    rules: {
      // Verbietet eigene Namen wie "Symbol", "Map" oder "Object", die eingebaute JavaScript-Namen
      // überdecken. Genau das hat in Phase 2 einen Absturz verursacht (React-Compiler nutzt Symbol.for).
      'id-denylist': ['error', 'Symbol', 'Map', 'Set', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Promise', 'Date', 'Error', 'JSON', 'Math'],
    },
  },
]);

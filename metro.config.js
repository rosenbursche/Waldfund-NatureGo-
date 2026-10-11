// Metro-Konfiguration (Bundler von Expo).
// https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// three.js ab Version 0.18x: Die alte CommonJS-Datei (three.cjs) ruft beim Laden
// process.emitWarning() auf – das gibt es nur in Node.js, auf dem Handy stürzt die App ab.
// Deshalb zeigen wir "three" immer auf die moderne ES-Modul-Datei.
const THREE_MODUL = path.resolve(__dirname, 'node_modules/three/build/three.module.js');
const standardAufloesung = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, modulName, plattform) => {
  if (modulName === 'three') return { type: 'sourceFile', filePath: THREE_MODUL };
  return (standardAufloesung ?? context.resolveRequest)(context, modulName, plattform);
};

// 3D-Modelle (GLB) als Dateien ins App-Paket aufnehmen
config.resolver.assetExts.push('glb');

module.exports = config;

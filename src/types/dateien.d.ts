// Dateien wie 3D-Modelle werden von Metro als Asset-Nummer eingebunden (wie bei Bildern).
declare module '*.glb' {
  const asset: number;
  export default asset;
}

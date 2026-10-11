import { Directory, File, Paths } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

/**
 * Fotos aufnehmen und auf dem Handy ablegen.
 *
 * Datenschutz:
 * - Fotos bleiben auf dem Gerät (App-Ordner "funde"), nichts wird hochgeladen.
 * - Das Bild wird verkleinert und neu gespeichert – dabei gehen die EXIF-Daten
 *   (z. B. der genaue GPS-Ort) verloren. So kann kein Foto einen Fundort verraten.
 */

export type FotoQuelle = 'kamera' | 'galerie';

export type FotoErgebnis = { status: 'ok'; uri: string } | { status: 'abgebrochen' } | { status: 'keineErlaubnis' };

const BREITE = 1024; // reicht für die Erkennung und spart Speicher

export async function fotoAufnehmen(quelle: FotoQuelle): Promise<FotoErgebnis> {
  const erlaubnis =
    quelle === 'kamera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!erlaubnis.granted) return { status: 'keineErlaubnis' };

  const optionen: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.8, exif: false };
  const ergebnis =
    quelle === 'kamera'
      ? await ImagePicker.launchCameraAsync(optionen)
      : await ImagePicker.launchImageLibraryAsync(optionen);
  if (ergebnis.canceled || !ergebnis.assets[0]) return { status: 'abgebrochen' };

  // verkleinern und als JPEG neu speichern (entfernt Metadaten)
  const bild = await ImageManipulator.manipulate(ergebnis.assets[0].uri).resize({ width: BREITE }).renderAsync();
  const gespeichert = await bild.saveAsync({ compress: 0.75, format: SaveFormat.JPEG });
  return { status: 'ok', uri: gespeichert.uri };
}

function fundOrdner(): Directory {
  const ordner = new Directory(Paths.document, 'funde');
  if (!ordner.exists) ordner.create({ idempotent: true });
  return ordner;
}

/** Verschiebt ein Foto aus dem Zwischenspeicher dauerhaft in den Fund-Ordner. */
export async function fotoBehalten(tempUri: string, artId: string): Promise<string> {
  const ziel = new File(fundOrdner(), `${artId}-${Date.now()}.jpg`);
  await new File(tempUri).move(ziel);
  return ziel.uri;
}

/** Löscht alle Fund-Fotos (z. B. beim Zurücksetzen der Sammlung). */
export function alleFotosLoeschen(): void {
  const ordner = new Directory(Paths.document, 'funde');
  if (ordner.exists) ordner.delete();
}

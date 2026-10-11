# Wildfund-Erkennungsserver

Ein kleiner Cloudflare Worker als Zwischenstück zwischen App und Pl@ntNet.

**Warum überhaupt ein Server?** Pl@ntNet braucht einen API-Schlüssel. Ein Schlüssel ist wie ein Passwort. Steckt er in der App, kann ihn jeder herauslesen und dein Kontingent verbrauchen oder dein Konto sperren lassen. Pro Person ist nur **ein** kostenloses Pl@ntNet-Konto erlaubt. Deshalb liegt der Schlüssel nur hier auf dem Server.

```
Handy ──Foto──▶ Worker (kennt den Schlüssel) ──▶ Pl@ntNet
Handy ◀──Artnamen + Sicherheit── Worker ◀──────────────
```

**Was der Server macht und was nicht:**
- Er reicht das Foto durch und gibt nur Artnamen mit Sicherheit zurück.
- Er speichert **keine Fotos und keine IP-Adressen**.
- Er zählt pro zufälliger Geräte-ID und Tag. Ein Gerät darf höchstens 20 Erkennungen am Tag machen, alle zusammen höchstens 450, damit die kostenlose Grenze von 500 nie überschritten wird. Die Zähler verfallen nach 2 Tagen.

## Einrichten (einmalig, ca. 20 Minuten)

Du brauchst zwei kostenlose Konten.

1. **Pl@ntNet-Konto anlegen:** https://my.plantnet.org → registrieren → unter „My account“ den **API-Schlüssel** kopieren. Gib ihn niemandem und schreib ihn nirgends in den Code.
2. **Cloudflare-Konto anlegen:** https://dash.cloudflare.com/sign-up
3. Im Terminal in diesen Ordner wechseln und anmelden:
   ```
   cd server
   npx wrangler login
   ```
   Es öffnet sich der Browser, dort bestätigst du die Anmeldung.
4. **Speicher für die Zähler anlegen:**
   ```
   npx wrangler kv namespace create ZAEHLER
   ```
   Die angezeigte `id` trägst du in `wrangler.toml` bei `HIER_DIE_KV_ID_EINTRAGEN` ein. Diese ID ist kein Geheimnis.
5. **Pl@ntNet-Schlüssel geheim hinterlegen.** Er landet verschlüsselt bei Cloudflare, nicht im Code:
   ```
   npx wrangler secret put PLANTNET_KEY
   ```
   Den Schlüssel einfügen und Enter drücken.
6. **Hochladen:**
   ```
   npx wrangler deploy
   ```
   Am Ende steht eine Adresse wie `https://wildfund-erkennung.DEINNAME.workers.dev`.
7. **Adresse in die App eintragen:** In `app.json` bei `"extra": { "erkennungsServer": "" }` die Adresse einsetzen. Die Adresse ist öffentlich und darf in der App stehen.
8. App neu laden → Einstellungen → **„Echte Erkennung für Pflanzen“** einschalten.

## Testen

Die Logik ist mit Tests abgedeckt (`npm test` im Hauptordner, Datei `server/src/__tests__/logik.test.ts`). Typprüfung des Servers:
```
npx tsc -p server
```

## Pflichten

- **Namensnennung in der App** (ist eingebaut): „The image-based plant species identification service used, is based on the Pl@ntNet recognition API“. Das Logo ergänzen wir vor einer Veröffentlichung.
- **Datenschutz (DSGVO):** Sobald Fotos das Handy verlassen, brauchst du vor einer Veröffentlichung eine **Datenschutzerklärung**. Bei Nutzerinnen und Nutzern **unter 16** stellt sich die Frage nach der **Einwilligung der Eltern** (Art. 8 DSGVO). Die App fragt vor dem Einschalten nach und weist darauf hin. Rechtlich prüfen lassen solltest du das trotzdem. Der Server speichert bewusst nichts Persönliches.
- **Kosten:** kostenlos, solange es unter 500 Erkennungen am Tag bleibt (Pl@ntNet) und im Gratis-Tarif von Cloudflare Workers.

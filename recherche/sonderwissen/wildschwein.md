# Sonderwissen Wildschwein (Sus scrofa)

Stand: 25.10.2026. 15 Einträge in `wildschwein.json`, davon 7 mit `wow: 3`. Jede Quelle wurde mit WebFetch geöffnet. PDFs wurden heruntergeladen und als Text gelesen (WSL-Merkblätter, Heinken & Raudnitschka, ASP-Merkblatt Odenwaldkreis). Die Prüfung mit `pruefeSonderwissen` gibt eine leere Liste.

Katalogwissen wie Größe, Nahrung, Spuren und Tagesrhythmus ist bewusst nicht wiederholt. Malbaum und Wühlen tauchen nur dort auf, wo es um etwas Neues geht: Samenausbreitung, Ökosystem-Ingenieur und den Mitmach-Eintrag.

## Die besten 3
1. **Das Wildschwein-Paradox und das Cäsium aus den Atombombentests** (`strahlen-paradox`, `atombomben-caesium`; q1 BfS, q2 TU Wien, q3 Stäger et al. 2023). Beim Wildschwein geht die Strahlung seit Tschernobyl kaum zurück, bei Reh und Hirsch schon. Grund ist der Hirschtrüffel. 10–68 % des Cäsiums stammen aus Atombombentests der 1960er.
2. **Die Löwin von Kleinmachnow war ein Wildschwein** (`loewin-kleinmachnow`; q19 ORF, q20 Nordkurier). Nach einer Großsuche im Juli 2023 bewies die DNA aus Kot und Haaren, dass es ein Wildschwein war.
3. **Samentaxi im Borstenkleid** (`samentaxi`; q14, q15). Ein Wildschwein trägt rund 20-mal so viele Samen im Fell wie ein Reh, ein Tier sogar 1.626. Um Malbäume liegen mehr keimfähige Samen im Boden.

Ebenfalls stark: die Leitbache, die per Duft die Paarungszeit der ganzen Rotte gleichschaltet (q8, q7). Außerdem Wildschweine als „positive Ökosystemingenieure“ auf Berliner Trockenrasen, wo Zauneidechsen und Heuschrecken profitieren (q11, q12).

## Monate und Meldungen
- `leitbache-takt`: Nov–Jan (Schwerpunkt Rauschzeit wie in `wildschwein.ts`). Die Meldung erklärt nur und lädt nicht zum Hingehen ein.
- `wurfkessel`: Mär–Mai (wie `frischzeit` in `wildschwein.ts`). Die Meldung sagt ausdrücklich „Bleib auf den Wegen und lass ihnen Ruhe“, dazu ein Sicherheitshinweis.
- Der `mitmachen`-Eintrag (Malbaum und Wühlstelle) heißt: vom Weg aus anschauen, nichts anfassen, keinen Spuren folgen. Er hat keine Meldung, damit niemand gezielt losgeschickt wird.

## Bewusst weggelassen
- Essbarkeit, Wildbret und Trichinen: wie gewünscht nicht aufgenommen.
- Wildunfälle: Die stehen schon in der Tierseite (`gefahrMensch`, g47–g55).
- Trüffelschwein und Androstenol (Claus et al. 1981): Der Artikel war nicht abrufbar. Er betrifft außerdem Hausschweine.

## Widersprüche
- **Suhlen gegen Parasiten:** Die DWS (q10) nennt als Zweck „abkühlen und Parasiten loswerden“. Die Übersichtsarbeit von Bracke 2011 (q9) findet für alles außer der Kühlung kaum wissenschaftliche Belege. Im Text steht deshalb „Oft heißt es …, gut belegt ist vor allem die Kühlung“.
- **Herkunft des Cäsiums:** Die TU Wien (q2) nennt bis 68 % aus Waffentests, das Abstract (q3) 10–68 %. Das ist kein echter Widerspruch, eingetragen ist die Spanne aus dem Abstract.
- **Domestikation:** Der DJV (q6) schreibt „vor 8.000 bis 10.000 Jahren“. Larson 2007 (q17) setzt den Beginn der Jungsteinzeit im Nahen Osten vor etwa 11.000 Jahren an. Im Text steht deshalb keine Jahreszahl.

## Abweichungen von den App-Daten (`src/data/tiere/wildschwein.ts`, `recherche/wildschwein/`)
| Stelle | App | neu gefunden | Quelle |
|---|---|---|---|
| `koerper.ohr` „Hört sehr gut“ (TODO keine Quelle) | unbelegt | Berlin: „Gehör- und Geruchssinn sind sehr gut entwickelt“. Damit ist der TODO belegbar. | q7 |
| Sehen | nicht in der App | Sehvermögen schwach (DJV, Berlin), Bewegungen werden aber gut erkannt (Berlin) | q6, q7 |
| Frischlingsstreifen | 3–5 Monate (Spanne aus fakten.md) | DWS-Steckbrief: Streifen verlieren sich nach etwa 3–6 Monaten | q10 |
| Wurfgröße | fakten.md: 4–8, bis 12 | DJV: 1–8 Frischlinge | q6 |
| Säugezeit | 3–4 Monate | DJV: 3 Monate | q6 |
| Frischlingssterblichkeit (fakten.md: „nur schwache Quellen“) | `gefahren` „Nasskaltes Wetter“ mit q3 | DJV bestätigt: viele Frischlinge sterben in den ersten Wochen an feuchtkalter Witterung und Krankheiten | q6 |
| `wusstestDu` Tarnung durch Streifen | weiter unbelegt | keine Quelle gefunden | – |
| Lebensalter | nicht in der App | DWS: bis 21 Jahre, in freier Wildbahn höchstens 10 Jahre (Katalogwissen, nicht als Eintrag aufgenommen) | q10 |

## Offen
- Geruchssinn im direkten Vergleich mit dem Hund (Riechzellen): keine belastbare Quelle gefunden. Belegt ist nur die Zahl der Geruchsgene (1.113 funktionierende Gene, „größtes Repertoire“).
- Tarnfunktion der Frischlingsstreifen: keine Quelle.
- Ob die Hirschtrüffel vor allem im Spätwinter gefressen werden, steht nur in Presseberichten, die nicht geöffnet wurden. Deshalb hat der Eintrag keine Monate.
- Schwimmen: nur eine Quelle (DJV), keine Strecken.
- Heinken & Raudnitschka (q14): Jahr und Band stehen nicht im PDF-Text.

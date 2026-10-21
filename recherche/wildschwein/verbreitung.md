# Verbreitung Wildschwein (Sus scrofa)

## GBIF-Abruf
- Abgerufen: 2026-10-19 mit `node scripts/gbif-verbreitung.mjs wildschwein "Sus scrofa"` (Stapelabruf)
- GBIF-Taxon: 7705930 (Sus scrofa Linnaeus, 1758)
- Filter: Deutschland, ab 2000, nur CC0 1.0 / CC BY 4.0, ohne Museums- und Zoobelege (Filter `basisOfRecord`; einzelne Wildpark-Meldungen möglich), ohne Geo-Fehler
- **16.531 Nachweise in 1.687 Rasterfeldern (TK25)**
- Verteilung der Nachweise je Feld: 537 Felder mit 1 Nachweis, 590 mit 2–5, 392 mit 6–20, 168 mit über 20
- Ausgeschlossene Felder: keine

## Verteilung (grob, nach Feld-Mittelpunkten)
- **Über ganz Deutschland verteilt**, von der Küste (Schleswig-Holstein, Vorpommern) bis an den Alpenrand.
- **Dichte Meldungen** (viele Felder mit über 20 Nachweisen):
  - Rhein-Main-Gebiet, Taunus, Odenwald, Spessart-Rand, Rheinhessen/Pfalz, nördliches Baden (Oberrheinebene)
  - Hochrhein und westlicher Bodensee, südlicher Schwarzwald
  - Großraum Hamburg und östliches Schleswig-Holstein (Holstein, Lauenburg)
  - Großraum Berlin
  - Mittelgebirge in Hessen/NRW (Sauerland, Siegerland, Westerwald, Eifel) mit vielen Feldern
- **Dünn belegt** (nur einzelne Felder trotz bekannter Vorkommen):
  - Ost- und Südbayern: Oberpfalz, Bayerischer Wald, Niederbayern, Oberbayern, Teile Frankens
  - Erzgebirge, Vogtland, Osterzgebirge (Süden Sachsens)
  - Nordwest-Niedersachsen (Emsland, Ostfriesland), Nordfriesland
  - Mecklenburg-Vorpommern und Brandenburg außerhalb von Berlin: zwar viele Felder, aber meist nur 1–5 Nachweise
- Alpenraum: nur wenige Einzelnachweise (Allgäu, Werdenfelser Land); am Hochrhein/Bodensee dagegen viele.
- Nordseeinseln: keine Nachweise; an der Nordseeküste nur Einzelfelder auf dem Festland.

## Fachquellen
1. **DJV, Jahresstrecke Schwarzwild 2014/15–2024/25** (Infografik, Quelle: DJV-Handbuch 2026):
   https://www.jagdverband.de/sites/default/files/2026-03/2026-02_Infografik_Jahresjagdstrecke_Schwarzwild_2024_2025.jpg
   (verlinkt auf https://www.jagdverband.de/zahlen-fakten/jagd-und-wildunfallstatistik/jagdstatistik-fuer-einzelne-wildarten)
   - Gesamtstrecke 2024/25: 568.497. Alle 16 Länder melden Schwarzwild-Strecke.
   - 2024/25 höchste Strecken: Bayern 69.116, Rheinland-Pfalz 62.005, Brandenburg 60.208, Mecklenburg-Vorpommern 59.631, Hessen 57.859, Baden-Württemberg 56.328, Niedersachsen 41.760, Nordrhein-Westfalen 40.088. Kleinste: Bremen 14, Hamburg 312, Berlin 1.875.
2. **Wildtier-Informationssystem der Länder Deutschlands (WILD)**, DJV und Landesjagdverbände; interaktive Streckenkarten unter https://www.wild-monitoring.de (Kreisebene nicht abgerufen).
3. **Metzger, J. (LWF Bayern, 2002): Das Wildschweinproblem**, waldwissen.net:
   https://www.waldwissen.net/de/lebensraum-wald/wald-und-wild/wildtiermanagement/wildschweinproblem
   – „In Bayern kommen Wildschweine zwischenzeitlich fast flächendeckend vor“; Inneres Bayerischer Wald besiedelt, „auf dem Vormarsch in die Bayerischen Alpen“.
4. **Petrak, M. (2009): Das Schwarzwild kehrt zurück**, Säugetierkundliche Informationen 7 (39), online bei waldwissen.net:
   https://www.waldwissen.net/de/lebensraum-wald/wald-und-wild/wildtiermanagement/das-schwarzwild-kehrt-zurueck
   – Wiederausbreitung seit etwa 1930 in lange verwaiste Räume; Lebensraum bis etwa zur 50-cm-Schneegrenze.
5. Thünen-Institut, Project Brief 2021/04 (Mecklenburg-Vorpommern): Wildschweine kommen im ganzen Land vor, die Streckendichte ist aber regional sehr unterschiedlich (nur über Suchergebnis-Zusammenfassung gesehen, PDF ließ sich nicht laden):
   https://www.thuenen.de/media/publikationen/project_brief/Project_brief_2021_04.pdf

## Vergleich GBIF ↔ Fachquellen
- **Grundbild passt**: Laut Jagdstrecken und Fachliteratur kommt das Wildschwein praktisch flächendeckend in Deutschland vor (außer Hochgebirge und Inseln). GBIF zeigt Nachweise in allen Großräumen.
- **Große Beobachtungslücken**:
  - **Bayern** hat die höchste Strecke aller Länder (69.116), ist in GBIF aber im Osten und Süden nur lückenhaft belegt. Das ist eine reine Melde- bzw. Lizenzlücke (viele Meldungen liegen vermutlich in Datensätzen mit NC-Lizenz oder gar nicht in GBIF). Dafür wurden keine Felder ergänzt.
  - **Mecklenburg-Vorpommern und Brandenburg** (je rund 60.000 Tiere Strecke) sind in GBIF nur dünn belegt, Sachsens Süden und Nordwest-Niedersachsen ebenso.
- **Dichte Schwerpunkte in GBIF** (Rhein-Main, Hamburg, Berlin, Hochrhein/Bodensee) spiegeln vor allem, wo viele Menschen beobachten und melden (Ballungsräume, Stadtwildschweine), nicht unbedingt die höchsten Bestände.
- **Ausreißer**: keine Felder weit außerhalb des bekannten Gebiets. Die Einzelnachweise im Allgäu und Werdenfelser Land liegen am Alpenrand, in den die Art laut LWF vordringt – plausibel, aber unsicher (je 1–2 Nachweise). Wildparks mit Schwarzwild gibt es viele, sie liegen aber alle innerhalb des natürlichen Verbreitungsgebiets; einzelne Gehege-Meldungen ändern das Kartenbild nicht und lassen sich ohne genauere Orte nicht sicher erkennen. Verwechslungen (z. B. mit Hausschweinen) sind bei dieser Art selten und ebenfalls nicht kartenrelevant.

## Ausgeschlossene Felder
Keine.

## Fazit
**Passt, mit Lücken.** Die Art ist mit über 16.500 Nachweisen in GBIF gut abgedeckt und erscheint in allen Landesteilen, wie es die Jagdstrecken aller 16 Länder erwarten lassen. Leere Felder – besonders in Ost-/Südbayern, im Erzgebirge, in Nordwest-Niedersachsen sowie die dünne Belegung in Mecklenburg-Vorpommern und Brandenburg – sind Beobachtungslücken, keine echten Verbreitungslücken; die Karte zeigt also eher „wo gemeldet“ als „wo vorkommend“.

Vor einer Veröffentlichung: GBIF-Download mit DOI anlegen und zitieren.

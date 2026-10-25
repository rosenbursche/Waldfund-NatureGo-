# Bildquellen und Rechtsrahmen für Artenbilder (Anzeige + Referenz/Training) – Wildfund

Stand der Recherche: 25.10.2026. Vorgaben: kommerzielle Nutzung, keine NC-Inhalte. Eigene GBIF-API-Abfragen vom 25.10.2026 sind als "eigene Abfrage" markiert (reproduzierbar über https://api.gbif.org/v1/occurrence/search). Hinweise mit **[ANWALT]** markieren Punkte, die ein Fachanwalt für Urheber-/IT-Recht prüfen muss.

## 1. Quellen mit kommerziell nutzbaren Lizenzen und ihr Umfang

### Takeaway
Die größte kommerziell nutzbare Quelle in großem Maßstab ist GBIF (aggregiert iNaturalist, Pl@ntNet, nationale Portale, Museen). In Europa sind von rund 107 Mio. GBIF-Datensätzen mit Bild aber nur etwa 29 Mio. als CC0/CC BY gekennzeichnet, und **die Lizenz des Datensatzes ist nicht die Lizenz des Bildes**: Man muss pro Bild filtern, weil auch in CC-BY-Datensätzen NC-, SA- und "All rights reserved"-Bilder vorkommen. iNaturalist ist mehrheitlich NC, seine Nutzungsbedingungen verbieten laut Zitat kommerzielles KI-Training, und Mushroom Observer sowie Observation.org werden auf GBIF als CC BY-NC geführt.

### Cited Findings

**GBIF – Gesamtmengen (eigene Abfrage 25.10.2026, Filter mediaType=StillImage, Lizenz = Lizenz des Datensatzes/Records)**
- Weltweit: 319.177.836 Datensätze mit Bild, davon CC0 40.702.546, CC BY 4.0 83.714.771 und CC BY-NC 4.0 194.760.519 (also ca. 61 % NC) — [GBIF Occurrence API](https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&limit=0)
- Europa (continent=EUROPE): 107.366.073 mit Bild, davon CC0 6.416.158, CC BY 22.966.027 und CC BY-NC 77.983.888 — [GBIF Occurrence API](https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&continent=EUROPE&limit=0)
- Europa, CC0 oder CC BY, mit Bild, Anzahl der Arten (Facette speciesKey) nach Zahl der Datensätze: mindestens 1 Datensatz: 171.515 Arten; mindestens 10: 60.457; mindestens 50: 27.767; mindestens 100: 19.262; mindestens 500: 7.539 (alle Organismengruppen, Herbarbelege eingeschlossen; gezählt sind Datensätze, nicht einzelne Bilder) — [GBIF Occurrence API (Facette)](https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&continent=EUROPE&license=CC0_1_0&license=CC_BY_4_0&limit=0&facet=speciesKey&facetMincount=50)
- Größte Lieferanten von CC0/CC-BY-Datensätzen mit Bild in Europa: iNaturalist Research-grade (8,42 Mio.), Pl@ntNet observations (2,29 Mio.), NABU|naturgucker (2,28 Mio.), Norwegian Species Observation Service/Artsobservasjoner (2,21 Mio.), NHM London Specimens (1,09 Mio.), Naturalis Botany (1,05 Mio.), Arter.dk Dänemark (1,03 Mio.), Herbarium Oslo (0,79 Mio.) — [GBIF API Datensatz-Facette](https://api.gbif.org/v1/occurrence/search?mediaType=StillImage&continent=EUROPE&license=CC0_1_0&license=CC_BY_4_0&limit=0&facet=datasetKey)
- **Die Bildlizenz weicht vom Datensatz ab (eigene Stichprobe, je 300 Records ab Offset 5000, nur Records mit Lizenz CC0/CC BY):**
  - iNaturalist: Bilder 372 CC BY, 73 CC0, 64 **CC BY-NC**, 1 SA, also auch in CC-BY-Datensätzen rund 13 % NC-Bilder.
  - Pl@ntNet: alle 386 Bilder **CC BY-SA** (Datensatz selbst CC BY 4.0).
  - Artsobservasjoner (Norwegen): 186 CC BY, **207 "© All rights reserved"**, 23 NC.
  - Naturalis Botany: 300 von 300 CC0.
  - NABU|naturgucker: Bildfeld nur mit "Copyright by the creator. For license and creator details, see https://nabu-naturgucker-beobachtungen.de/...", die Lizenz muss also pro Bild auf der Quellseite nachgeschaut werden.
  — [GBIF API, z. B. Pl@ntNet-Datensatz](https://api.gbif.org/v1/occurrence/search?datasetKey=7a3679ef-5582-4aaa-81f0-8c2545cafc81&mediaType=StillImage&limit=3)
- GBIF akzeptiert für Records nur CC0, CC BY und CC BY-NC; die meisten Records haben aber keine eigene Record-Lizenz. Ob die Datensatzlizenz für verlinkte Bilder gilt, ist unklar. Die Simple-Multimedia-Extension hat keine eigenen Rechtefelder, Audubon Core schon (rights, UsageTerms, Owner) — [GBIF data blog: Multimedia](https://data-blog.gbif.org/post/gbif-multimedia/), [GBIF license processing](https://data-blog.gbif.org/post/gbif-occurrence-license-processing/), [GBIF techdocs](https://techdocs.gbif.org/en/data-publishing/multimedia-publishing)
- Bulk-Weg: Occurrence Downloads mit Filter "Media type StillImage" bekommen eine DOI ("Please cite as"). Die Bilder selbst lädt man über die URLs in multimedia.txt (DwC-A) herunter — [Beispiel-Download GBIF](https://www.gbif.org/occurrence/download/0173704-200613084148143)

**Observation.org / Waarneming.nl**
- Auf GBIF als "Observation.org, Nature data from around the World" mit Lizenz **CC BY-NC 4.0** (Key 8a863029-…) — [GBIF Dataset API](https://api.gbif.org/v1/dataset/8a863029-f435-446a-821e-275f4f641165)

**Mushroom Observer**
- Auf GBIF mit Lizenz **CC BY-NC 4.0** (Key d714382d-…) — [GBIF Dataset API](https://api.gbif.org/v1/dataset/d714382d-5890-4234-ae81-696eeb53658a)
- 2007 unterstützte die Seite nur CC BY-NC-SA; der aktuelle Lizenzmix pro Bild ist nicht verifiziert — [Commons User talk](https://commons.wikimedia.org/wiki/User_talk:Alan_Rockefeller)

**Pl@ntNet**
- Bilder sind "usually licensed under Creative Commons Attribution-ShareAlike (CC BY-SA)". Bei Weiterverwendung muss man den Beitragenden, Pl@ntNet und die Lizenz nennen — [Pl@ntNet API Doku: Using images](https://my.plantnet.org/doc/references/using-images)
- Der GBIF-Datensatz "Pl@ntNet observations" ist CC BY 4.0 und enthält nur Beobachtungen von Nutzern, die einer CC-Freigabe zugestimmt haben — [Pl@ntNet terms / GBIF](https://tools.gbif.org/dataset/7a3679ef-5582-4aaa-81f0-8c2545cafc81)
- Fotos, die an die Pl@ntNet-API zur Bestimmung geschickt werden, werden laut API-Bedingungen nicht gespeichert, sondern nur im flüchtigen Speicher verarbeitet — [Pl@ntNet API Terms](https://my.plantnet.org/terms_of_use)

**iNaturalist Open Data (AWS)**
- Die Lizenz ist pro Bild CC0 oder CC; "over 400 million photos". Fotografen behalten das Urheberrecht. Vorgegebene Attribution: "© Name, some rights reserved (CC-BY)" bzw. "Name, no rights reserved (CC0)". Jede Nutzung muss den CC-Bedingungen entsprechen — [GitHub inaturalist-open-data](https://github.com/inaturalist/inaturalist-open-data), [AWS Registry](https://registry.opendata.aws/inaturalist-open-data)
- Die meisten iNat-Nutzer haben eine NC- oder "All rights reserved"-Standardlizenz: Laut Zählung einer Community-Freiwilligen (nicht offiziell) sind "over 99.5%" (Jan 2024) bzw. ca. 99,4 % (2026) der Beobachter mit einer Standard-Bildlizenz unterwegs, die nicht Wikipedia-kompatibel ist (also nicht CC0/BY/BY-SA) — [ArgentiNat Default Image Licenses 2024](https://www.argentinat.org/posts/88222-default-image-licenses-jan-2024), [Journal loopy30 2026](https://inaturalist.ala.org.au/journal/loopy30)
- **Nutzungsbedingungen:** Ein Nutzer zitiert im Forum (11.04.2026) die Terms mit dem Abschnitt "Prohibited Use for Commercial AI Training": "Users may not use any iNaturalist data for training artificial intelligence, machine learning models … used for commercial purposes". Staff hat nicht geantwortet. Ein anderer Nutzer meint, die Terms gälten nur für Zugriff über Website/API und nicht für die AWS-Kopie; das ist eine Privatmeinung. Die Terms-Seite selbst konnte ich nicht abrufen (Cloudflare 403) — [iNat Forum Thread 77663](https://forum.inaturalist.org/t/can-i-use-inaturalist-aws-open-data-to-train-commercial-ai-model/77663), [iNat Terms](https://www.inaturalist.org/pages/terms)
- Im älteren Thread (2023) gibt es ebenfalls keine Staff-Aussage. Die README der AWS-Daten verlangt nur die Einhaltung der CC-Lizenzen — [iNat Forum Thread 45139](https://forum.inaturalist.org/t/use-of-inaturalist-data-to-train-ai-computer-vision-outside-the-inaturalist-platform/45139)

**Fertige Datensätze**
- TreeOfLife-200M: ca. 214 Mio. Bilder, 952.257 Taxa, aus GBIF, EOL, BIOSCAN-5M und FathomNet. Die Dataset Card sagt "cc0-1.0", das gilt aber für Metadaten/Katalog. Lizenzen pro Bild stehen in einer Provenienzdatei — [HF TreeOfLife-200M README](https://huggingface.co/datasets/imageomics/TreeOfLife-200M/blob/refs%2Fpr%2F9/README.md)
- BioCLIP 2 Modell und Code: MIT-Lizenz — [HF bioclip-2](https://huggingface.co/imageomics/bioclip-2), [GitHub bioclip-2](https://github.com/Imageomics/bioclip-2)
- iNat2021: 2,7 Mio. Bilder, 10.000 Arten — [Van Horn et al. 2021, arXiv 2103.16483](https://arxiv.org/abs/2103.16483)
- Danish Fungi 2020 (DF20): 295.938 Bilder, 1.604 Arten aus dem Atlas of Danish Fungi. Eine Lizenz für kommerzielle Nutzung war nicht auffindbar — [arXiv 2103.10107](https://arxiv.org/pdf/2103.10107)

**Wikimedia Commons**
- Die strukturierten Daten (Wikibase) mit "depicts"-Aussagen lassen sich über den Commons Query Service abfragen. Ein Lizenzfilter greift nur, wenn die Lizenz in den strukturierten Daten steht (Ankündigung 2020) — [Commons:Structured data](https://commons.wikimedia.org/wiki/Structured_data), [Meta: Content Partnerships Hub/SDC](https://meta.wikimedia.org/wiki/Content_Partnerships_Hub/Structured_Data_on_Commons)

### Inferences
- In GBIF bedeutet "license=CC_BY_4_0" nicht, dass das Bild CC BY ist. Für Wildfund muss also das Feld `media[].license` je Bild normalisiert werden (bzw. in Downloads `multimedia.txt` → `license`/`rightsHolder`). Behalten werden nur CC0, PDM, CC BY und (falls Anwalt OK) CC BY-SA; NC, ND, ARR und leere oder "see source"-Felder werden verworfen. Die Artenzahlen oben (z. B. 27.767 Arten mit ≥ 50 Datensätzen) sind deshalb eine **Obergrenze**. Die echte Zahl kommerziell nutzbarer Bilder pro Art dürfte deutlich darunter liegen, besonders bei Artsobservasjoner (ca. 50 % ARR in der Stichprobe) und naturgucker (Lizenz nur auf der Quellseite).
- Die Datensatzzahlen enthalten Herbarbelege und Museumspräparate (NHM, Naturalis, Oslo). Die sind gut für Pflanzen-Referenz, für Feldfotos von Nutzern aber weniger repräsentativ. Für das Training sollte man nach basisOfRecord=HUMAN_OBSERVATION filtern.
- Pl@ntNet (BY-SA) ist wohl die größte europäische Pflanzenquelle mit kommerziell nutzbaren Bildern. ShareAlike gilt für "Adapted Material", also z. B. zugeschnittene oder bearbeitete Bilder in der App. Ob ein trainiertes Modell darunterfällt, ist offen **[ANWALT]**.
- iNaturalist-Bilder mit CC0/CC BY gibt es in großer Zahl (in der GBIF-Kopie Europa ca. 8,4 Mio. Datensätze). Wegen der zitierten Terms-Klausel ist der Bezug über AWS/API für kommerzielles Training aber riskant. Den Wortlaut muss man selbst prüfen und schriftlich bei iNaturalist (help@inaturalist.org) anfragen **[ANWALT]**.
- EOL, Europeana und die Lizenzmixe von Naturalis/Observation.org-Fotos wurden nicht im Detail geprüft (siehe Gaps).

### Gaps
- Kein offizieller Wortlaut und kein Datum der aktuellen iNaturalist-Terms (Seite blockiert); die Klausel ist nur indirekt über ein Forenzitat belegt.
- Kein exakter Anteil von CC0/CC-BY-Bildern auf Bildebene für Europa; nur kleine Stichproben (je 300 Records, nicht zufällig gezogen). Für belastbare Zahlen sollte man einen GBIF-Download mit Multimedia-Extension machen und `license` auszählen.
- Lizenz pro Bild in TreeOfLife-200M/BioTrove nicht ausgezählt; DF20/PlantCLEF-Lizenz für kommerzielle Nutzung nicht gefunden.
- EOL Media, Europeana, Flickr-CC-Mengen für Arten: nicht recherchiert.
- Aktuelle Lizenzoptionen von Mushroom Observer und die Fotolizenz bei Observation.org (Nutzerwahl?) nicht verifiziert; nur die GBIF-Datensatzlizenz (BY-NC) ist belegt.

## 2. Wie viele Bilder pro Art werden gebraucht?

### Takeaway
Mit biologischen Foundation-Embeddings (BioCLIP) erreicht man bei 5 Bildern pro Art auf seltenen, ungesehenen Arten ca. 66 % Top-1 (400-Klassen-Benchmark). Ein klassischer Classifier braucht deutlich mehr. Belastbare "N Bilder → X %"-Kurven für Zehntausende europäische Arten habe ich nicht gefunden.

### Cited Findings
- Rare-Species-Benchmark (400 IUCN-gefährdete Arten, 30 Bilder pro Art, beim Pretraining nicht gesehen), Top-1, ViT-B/16: BioCLIP 38,1 % zero-shot / 44,9 % one-shot / 65,7 % five-shot; CLIP 31,8 / 29,3 / 47,5; Modell nur auf iNat21 trainiert: 21,3 / 36,9 / 55,7 — [HF rare-species README](https://www.huggingface.co/datasets/imageomics/rare-species/blob/255eadc687b70fc46ec356b0a370a082ed28cf7d/README.md), [BioCLIP paper arXiv 2311.18803](https://arxiv.org/pdf/2311.18803)
- Few-shot-Ergebnisse schwanken je nach gezogenen Beispielen (5 Läufe mit Standardabweichung) — [BioCLIP CVPR 2024 Supplement](https://openaccess.thecvf.com/content/CVPR2024/supplemental/Stevens_BioCLIP_A_Vision_CVPR_2024_supplemental.pdf)
- BioCLIP 2 (trainiert auf TreeOfLife-200M) soll laut Sekundärquelle bei 1-shot/5-shot +14/+10 Punkte gegenüber BioCLIP 1 erreichen (nicht am Original verifiziert) — [emergentmind BioCLIP2](https://www.emergentmind.com/topics/bioclip2), [arXiv 2505.23883](https://arxiv.org/pdf/2505.23883)
- iNat2021 hat bewusst genug Bilder pro Art, um Long-Tail-Effekte durch Datenentzug zu untersuchen; überwachte Features schlagen self-supervised (SimCLR) — [Van Horn et al. 2021](https://arxiv.org/abs/2103.16483)
- Bei Long-Tail-Daten führt Cross-Entropy-Training dazu, dass häufige Klassen bevorzugt werden: hohe Micro-Accuracy, schlechter Macro-F1 (PlantCLEF 2026) — [CEUR-WS Vol-4283 paper358](https://ceur-ws.org/Vol-4283/paper358.pdf)
- CLIP-Variante mit 16 Bildern pro Art auf iNat2021-Teilgruppen: +6,2 bis +16,8 Punkte gegenüber dem Linear Probe — [Remote Sensing 2024 (DOAJ)](https://doaj.org/article/dfb69869fc0944408228f0b9ee8e8ef7)

### Inferences
- Pragmatische Staffelung (abgeleitet, nicht als Zahl belegt): Für den Long Tail reichen BioCLIP-2-Embeddings plus Nearest-Neighbour/Prototyp mit 5–30 Referenzbildern pro Art als Einstieg. Für häufige Arten, die den Großteil der Nutzeranfragen ausmachen, lohnt Fine-Tuning mit Hunderten Bildern. Evaluieren sollte man pro Art (Macro), nicht nur die Gesamtaccuracy.
- Laut GBIF-Facetten (Abschnitt 1) haben in Europa ca. 60.000 Arten ≥ 10 und ca. 19.000 Arten ≥ 100 CC0/CC-BY-Datensätze mit Bild. Nach dem Filtern auf Bildebene bleibt weniger. Es ist also realistisch, für einige Tausend bis wenige Zehntausend Arten genügend kommerziell lizenzierte Bilder zu bekommen. Für den Rest braucht man Few-Shot-Verfahren oder eigene Nutzerfotos.

### Gaps
- Keine publizierte Zahl "europäische Arten mit ≥ N kommerziell lizenzierten Bildern auf Bildebene".
- Original-Tabellen (iNat2021 vs. iNat2021-mini mit 50 Bildern/Art, BioCLIP 2 Few-Shot) nicht direkt verifiziert.

## 3. Recht: Urheberrecht/TDM, CC-Lizenzen, AI Act, DSGVO

### Takeaway
§ 44b UrhG (Art. 4 DSM-RL) erlaubt kommerzielles TDM an rechtmäßig zugänglichen Werken, außer der Rechteinhaber hat maschinenlesbar widersprochen. Das OLG Hamburg hat das im Fall LAION 2025 bestätigt, ob das eigentliche Training erfasst ist, ist aber offen und liegt beim BGH (I ZR 281/25, mündliche Verhandlung 03.09.2026, EuGH-Vorlage wahrscheinlich). Training auf CC-BY-NC-Bildern über § 44b ist rechtlich vertretbar, aber unsicher; die Vorgabe "kein NC" ist deshalb die richtige konservative Linie. Ein Arten-Classifier ist nach dem AI Act weder GPAI noch Hochrisiko; die Copyright-Policy-Pflicht (Art. 53) gilt nur für GPAI-Anbieter.

### Cited Findings

**§ 44b UrhG / Art. 4 DSM-Richtlinie**
- § 44b UrhG: "(1) Text und Data Mining ist die automatisierte Analyse von einzelnen oder mehreren digitalen oder digitalisierten Werken, um daraus Informationen insbesondere über Muster, Trends und Korrelationen zu gewinnen. (2) Zulässig sind Vervielfältigungen von rechtmäßig zugänglichen Werken für das Text und Data Mining. Die Vervielfältigungen sind zu löschen, wenn sie für das Text und Data Mining nicht mehr erforderlich sind. (3) … nur zulässig, wenn der Rechtsinhaber sich diese nicht vorbehalten hat. Ein Nutzungsvorbehalt bei online zugänglichen Werken ist nur dann wirksam, wenn er in maschinenlesbarer Form erfolgt." — [gesetze-im-internet.de § 44b UrhG](https://www.gesetze-im-internet.de/urhg/__44b.html)
- Unionsrechtliche Grundlage ist Art. 4 RL (EU) 2019/790; Art. 3 deckt Forschung (in DE § 60d) — [EUR-Lex RL 2019/790](https://eur-lex.europa.eu/eli/dir/2019/790/oj)
- LG Hamburg, 27.09.2024, 310 O 227/23 (Kneschke ./. LAION): Klage abgewiesen. Die Vervielfältigung ist nach § 60d gedeckt. Das Gericht sieht den Bild-Text-Abgleich als TDM im Sinne von § 44b und lehnt eine enge Auslegung ab, unter Verweis auf Art. 53 AI Act, der den Opt-out nach Art. 4 DSM-RL referenziert — [CMS Legal Update](https://cms.law/de/deu/legal-updates/erstes-urteil-deutschlands-zur-urheberrechtlichen-zulaessigkeit-des-ki-trainings-ergangen), [Noerr](https://www.noerr.com/de/insights/lg-hamburg-entscheidet-zu-urheberrechtlichem-schutz-von-in-ki-trainingsdatensaetzen-verwendeten-inhalten), [ai-laws.org](https://blog.ai-laws.org/landmark-court-decision-in-the-eu-copyright-permissibility-of-text-and-data-mining-for-the-purpose-of-ai-training/)
- OLG Hamburg, 10.12.2025, 5 U 104/24: Berufung zurückgewiesen; §§ 44b und 60d greifen, und der Gesetzgeber habe § 44b mit Blick auf KI geschaffen. Ein Hinweis in Nutzungsbedingungen, den nur Menschen lesen können, reicht als Opt-out nicht. Offen gelassen wurde, ob natürliche Sprache heute maschinenlesbar ist. Die Revision wurde zugelassen; BGH I ZR 281/25, Verhandlung am 03.09.2026, EuGH-Vorlage laut dpa/FAZ wahrscheinlich. Eine BGH-Entscheidung habe ich nicht gefunden — [urheber.info: OLG-Urteil](https://urheber.info/diskurs/hamburger-olg-urteil-im-fall-laion), [urheber.info: EuGH-Vorlage wahrscheinlich](https://urheber.info/diskurs/weiterleitung-an-eugh-wahrscheinlich), [photografix: Fotograf zieht vor den BGH](https://www.photografix-magazin.de/ki-training-fotograf-zieht-vor-den-bundesgerichtshof/), [Bild-Kunst](https://www.bildkunst.de/news/news.44.hamburger-olg-urteil-im-fall-laion-politischer-handlungsbedarf-ist-noch-offensichtlicher-als-zuvor/)
- Laut Kanzlei-Blog (20.01.2026): Das Urteil betrifft die Erstellung des Datensatzes, "ob das eigentliche KI-Training auch immer erlaubt ist, bleibt weiterhin offen". "Maschinenlesbar" heißt mehr als "elektronisch abrufbar", Beispiel robots.txt; maßgeblich ist der technische Stand zum Zeitpunkt des Downloads. § 60d hilft kommerziellen Produkten nicht, § 44b ist der Weg für Unternehmen — [Elbkanzlei](https://www.elbkanzlei.com/ki-training-mit-fremden-fotos-was-das-olg-hamburg-jetzt-erlaubt-az-5-u-104-24-laion-kneschke/)
- Gegenpol: LG München I, 11.11.2025, 42 O 14139/24 (GEMA ./. OpenAI) lehnte TDM-Schranken für die Memorisierung von Liedtexten ab — [Elbkanzlei](https://www.elbkanzlei.com/ki-training-mit-fremden-fotos-was-das-olg-hamburg-jetzt-erlaubt-az-5-u-104-24-laion-kneschke/)

**CC-Lizenzen und Training**
- CC: Alle CC-Lizenzen verlangen Attribution. Beim Modelltraining kann ein Link auf die Quelle des Datensatzes genügen. Oft ist das Training aber schon durch Schranken erlaubt, dann greifen die Lizenzbedingungen nur begrenzt. Eine restriktivere CC-Lizenz ist kein wirksames Mittel gegen KI-Training — [Creative Commons: Using CC-licensed works for AI training](https://creativecommons.org/using-cc-licensed-works-for-ai-training-2/)
- CC 4.0 Legal Code, Sec. 2(a)(2): Wenn Schranken (Exceptions and Limitations) greifen, gilt die Lizenz nicht und ihre Bedingungen müssen nicht eingehalten werden — [CC BY 4.0 Legal Code](https://creativecommons.org/licenses/by/4.0/legalcode)
- CC-Lizenzen regeln keine Persönlichkeits- oder Datenschutzrechte — [CC Blog 2021](https://creativecommons.org/2021/03/04/should-cc-licensed-content-be-used-to-train-ai-it-depends/)

**EU AI Act (VO (EU) 2024/1689)**
- Art. 50 (Transparenz, gilt ab 02.08.2026): Abs. 1 betrifft Systeme, die direkt mit Menschen interagieren (Hinweis, außer offensichtlich); Abs. 2 betrifft synthetische Inhalte (maschinenlesbare Kennzeichnung); Abs. 3 Emotionserkennung/biometrische Kategorisierung; Abs. 4 Deepfakes. Ein reiner Label-Classifier fällt nicht unter Abs. 2/4 — [artificialintelligenceact.eu Art. 50](https://artificialintelligenceact.eu/article/50/)
- GPAI-Modell (Art. 3 Nr. 63) heißt erhebliche Allgemeinheit für ein breites Aufgabenspektrum. Die Pflichten nach Art. 53 (u. a. Copyright-Policy inkl. Beachtung des Art.-4-Opt-outs, Trainingsdaten-Zusammenfassung) gelten für Anbieter von GPAI-Modellen. Hochrisiko richtet sich nach Art. 6 und Anhang III (Biometrie, kritische Infrastruktur, Bildung, Beschäftigung usw.); Artenbestimmung ist dort nicht gelistet. Art. 4 (KI-Kompetenz) gilt seit 02.02.2025 für alle Anbieter und Betreiber — [EUR-Lex VO 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)

**DSGVO / Nutzerfotos**
- Personenbezug entsteht durch Gesichter, Kennzeichen und vor allem EXIF-GPS mit Zeitstempel (Wohnort- und Bewegungsprofil). Rechtsgrundlagen sind Art. 6 Abs. 1 lit. a (Einwilligung) oder lit. f (berechtigtes Interesse); biometrische Daten zur eindeutigen Identifizierung fallen unter Art. 9. Nach Art. 8 können Kinder ab 16 selbst einwilligen (Deutschland hat das Alter nicht abgesenkt), darunter braucht es die Eltern. Hinzu kommen Informationspflichten (Art. 13) und das Widerrufsrecht (Art. 7 Abs. 3) — [EUR-Lex DSGVO 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- Pl@ntNet: Lizenzwahl für Beiträge (CC BY-SA), Name neben der Lizenz; API-Fotos werden nicht gespeichert — [Pl@ntNet General Terms](https://identify.plantnet.org/terms_of_use), [Pl@ntNet API Terms](https://my.plantnet.org/terms_of_use)
- iNaturalist trainiert seine Modelle laut eigener Angabe auf eigener Hardware; die Terms erlauben die Weitergabe an GBIF/AWS (nur Sekundärquellen) — [iNat Blog 113184](https://www.inaturalist.org/blog/113184), [ToS;DR iNaturalist](https://edit.tosdr.org/documents/1497)

### Inferences
- **Training auf CC0/CC BY:** urheberrechtlich unkritisch. Die Attribution ist für das Modell zumindest per Quellenliste oder Datensatz-DOI zu erfüllen (CC-Empfehlung; Overcompliance ist günstig). In der App angezeigte Bilder brauchen volle TASL-Attribution (Titel, Autor, Quelle, Lizenz).
- **Training auf CC BY-NC über § 44b:** Wenn § 44b greift, verdrängt er nach CC Sec. 2(a)(2) die NC-Bedingung. Ob eine NC-Lizenz selbst ein "maschinenlesbarer Vorbehalt" ist (die Lizenz-Metadaten sind maschinenlesbar!), ob § 44b das Training selbst deckt und was der BGH oder EuGH entscheidet, ist offen. Dazu kommen Plattform-AGB (iNat), die vertraglich unabhängig von § 44b binden können. Deshalb: bei "kein NC" bleiben **[ANWALT]**.
- **Anzeige in der App** ist kein TDM. Hier gilt nur die Lizenz: NC ist für eine kommerzielle App ausgeschlossen, und bei BY-SA (Pl@ntNet, Commons) müssen bearbeitete Fassungen wieder unter BY-SA stehen **[ANWALT: Thumbnails/Zuschnitte]**.
- **AI Act:** Wildfund ist Anbieter eines "normalen" KI-Systems mit geringem Risiko. Pflichten: KI-Kompetenz (Art. 4) und ggf. ein Hinweis nach Art. 50 Abs. 1, falls ein Chat-Assistent hinzukommt. Ein selbst feinjustiertes BioCLIP ist kein GPAI-Modell; das müsste man neu prüfen, wenn ein allgemeines Multimodal-LLM selbst trainiert oder angeboten wird **[ANWALT: Digital-Omnibus-Änderungen an Fristen 2025/26 prüfen]**.
- **Eigene Nutzerfotos fürs Training:** eigene, gesondert abwählbare Einwilligung (nicht in AGB versteckt) **und** ein urheberrechtliches Nutzungsrecht (Lizenzklausel; konkrete Formulierungen anderer Apps wurden nicht eingesehen, siehe Gaps). Unter 16 ohne Elternzustimmung nicht trainieren. EXIF beim Ingest entfernen und Koordinaten vergröbern (v. a. bei geschützten Arten). Gesichter und Kennzeichen erkennen und verwischen bzw. Bilder aussortieren.

### Gaps
- BGH-Urteil I ZR 281/25 und mögliche EuGH-Vorlage: kein Ergebnis bis 25.10.2026 gefunden.
- Keine Fundstelle dazu, ob CC-NC-Lizenzmetadaten als Vorbehalt nach § 44b Abs. 3 gelten.
- Wortlaut der Trainingsklauseln von PictureThis, Pl@ntNet (General Terms) und iNaturalist nicht direkt eingesehen.
- Digital Omnibus (Vorschlag zur Verschiebung von AI-Act-Fristen): Stand nicht recherchiert.

## 4. Praxis: Attribution, Lizenzmetadaten, Takedown

### Takeaway
Pro Bild unveränderliche Provenienz speichern (Quelle, ID, URL, Urheber, Lizenz-URI, Abrufdatum, GBIF-Download-DOI). Nur auf Whitelist-Lizenzen filtern, Attribution in der App anzeigen, ein Takedown-Verfahren einrichten, das Bilder aus Anzeige **und** künftigen Trainingsläufen entfernt.

### Cited Findings
- Attributionsformate: iNat "© Name, some rights reserved (CC-BY)" / "Name, no rights reserved (CC0)" — [inaturalist-open-data](https://github.com/inaturalist/inaturalist-open-data); Pl@ntNet "Nutzername, Pl@ntNet, CC BY-SA" — [Pl@ntNet Using images](https://my.plantnet.org/doc/references/using-images)
- GBIF-Downloads erhalten eine zitierbare DOI, mit der sich ein Trainingsdatensatz als Ganzes attribuieren lässt — [GBIF Download Beispiel](https://www.gbif.org/occurrence/download/0173704-200613084148143)
- GBIF-Mediendatensätze tragen `license`, `rightsHolder`, `creator` pro Bild (siehe Stichproben) — [GBIF API](https://api.gbif.org/v1/occurrence/search?datasetKey=50c9509d-22c7-4a22-a47d-8c48425ef4a7&mediaType=StillImage&limit=3)
- Lizenzen sind bei iNat änderbar; offen ist, ob Änderungen rückwirkend gelten und ob Bilder aus abgeleiteten Trainingssets entfernt werden — [iNat Forum 45139](https://forum.inaturalist.org/t/use-of-inaturalist-data-to-train-ai-computer-vision-outside-the-inaturalist-platform/45139)
- § 44b Abs. 2 S. 2: Vervielfältigungen sind zu löschen, wenn sie für das TDM nicht mehr erforderlich sind — [§ 44b UrhG](https://www.gesetze-im-internet.de/urhg/__44b.html)

### Inferences
- Schema-Vorschlag: `image_id, source (gbif|commons|plantnet|user), source_record_id, media_url, creator, rights_holder, license_uri (normalisiert), license_raw, retrieved_at, gbif_download_doi, sha256, usage_flags (display|train), exif_stripped, takedown_status`.
- Trainingsmanifest pro Modellversion versionieren (Liste der image_ids), damit sich Takedowns im nächsten Release nachweisen lassen. Wenn Bilder nur für TDM ohne Lizenz genutzt werden, die Kopien nach dem Training löschen (§ 44b Abs. 2), also die Lizenz-Whitelist einhalten und nicht auf § 44b bauen.
- Vor jedem Crawl robots.txt bzw. TDM-Rep-Vorbehalte loggen (Nachweis für § 44b Abs. 3).

### Gaps
- Kein Branchenstandard für Takedown-Fristen bei Modellen gefunden; zur Frage, ob ein bereits trainiertes Modell nach Lizenzwiderruf neu trainiert werden muss, fehlen Quellen **[ANWALT]**.

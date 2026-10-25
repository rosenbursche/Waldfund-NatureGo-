# Fertige Arterkennungs-APIs für "Wildfund" (kommerziell, Server-zu-Server) – Stand Recherche 25.10.2026

Hinweis: Preise wurden am 25.10.2026 von den offiziellen Preisseiten abgerufen. Was nicht gefunden wurde, steht unter "Gaps".

## 1. Welche Dienste gibt es und sind sie kommerziell per API nutzbar?

### Takeaway
Öffentlich buchbare, kommerziell lizenzierbare APIs mit Selbstbedienung gibt es im Kern nur zwei: **Pl@ntNet API** (Pflanzen, EU/Frankreich) und **Kindwise** (plant.id, insect.id, mushroom.id, crop.health; tschechische FlowerChecker s.r.o.). Dazu kommen allgemeine multimodale LLMs (z. B. Gemini) als Fallback. Für Säugetiere/Vögel gibt es keine vergleichbare fertige Arten-API zum Buchen: iNaturalist-CV ist nicht öffentlich, Merlin hat keine Dritt-API, BirdNET-Modelle sind nicht-kommerziell (CC BY-NC-SA), Naturalis gibt nur per individueller Kooperation Zugang. Eine seriöse API für Tierspuren/Fährten wurde nicht gefunden.

### Cited Findings
**Pl@ntNet API (my.plantnet.org)**
- Tarife: Free €0 = 500 Identifikationen/Tag, "50,000+ species", 50+ Sprachen, "European hosted"; Pro = €1.000/Jahr plus nutzungsbasierte Abrechnung je Identifikation, kein Logo nötig; Non-profit €0 (Bildung/Wissenschaft, Logo "powered by Pl@ntNet" Pflicht) — [Pl@ntNet Pricing](https://my.plantnet.org/pricing)
- Pro-Preis je Identifikation: bis 3 Mio. €0,005; über 3 Mio. €0,004; über 30 Mio. €0,003; über 300 Mio. €0,002 (Preise netto). Abrechnung: €1.000-Rechnung 30 Tage nach Vertragsschluss, Ausgleichsrechnung nach 365 Tagen; Vertragsvorlage v5.1 in EUR/USD — [Pl@ntNet Pricing](https://my.plantnet.org/pricing)
- "Pl@ntNet API is paying for commercial usage beyond 500 identification requests per day." Max. 20 parallele Anfragen pro Client; Pro-Kunden haben eine "security quota of 1M requests per day"; mehrere Free-Accounts zur Umgehung verboten — [Pl@ntNet API Terms](https://my.plantnet.org/terms_of_use)
- Ältere Vertragsvorlage (v4.5 USD) erlaubt explizit die Nutzung der API in namentlich genannten mobilen Apps "for commercial purposes" — [Agreement v4.5](https://my.plantnet.org/documents/agreement_PlantNet_API_english_v4.5_USD.pdf) (nur via Suchsnippet gesehen, nicht vollständig gelesen)

**Kindwise (plant.id, insect.id, mushroom.id, crop.health)**
- Ein Identifikationsaufruf = 1 Credit; eine gemeinsame Preistabelle für alle Kindwise-Produkte; 100 Gratis-Credits nach Registrierung — [Kindwise Pricing](https://www.kindwise.com/pricing)
- Staffel: ab 1.000 Credits €0,05 (Min. €50); ab 10.000 €0,03 (€300); ab 50.000 €0,02 (€1.000); ab 200.000 €0,015 (€3.000); ab 800.000 €0,012 (€9.600); ab 1.500.000 €0,01 (€15.000). Credits verfallen nach 3 Monaten (gilt nicht bei Käufen < 30.000 Credits). Rabatte bei reduzierter Klassenzahl (z. B. nur invasive Pflanzen); NGO-Sonderpreise — [Kindwise Pricing](https://www.kindwise.com/pricing)
- Betreiber laut Datenschutzerklärung: FlowerChecker s.r.o. (Tschechien) — [Kindwise Privacy Policy (Demo-Seiten, Stand 21.06.2023)](https://uploads-ssl.webflow.com/64876ae345f1e27598fafc02/65f46c2496d8857fa246d03d_Privacy%20policy%20for%20demos%20for%20end%20users.pdf); Firmensitz Brno, gegründet 2014, plant.id-API seit 2018 — [Wikipedia: Kindwise](https://en.wikipedia.org/wiki/Kindwise) (ein tschechisches Profil nennt Praha als Sitz – widersprüchlich, [cc.cz](https://cc.cz/profil/flowerchecker/))
- Kein Säugetier-/Vogel-Produkt; auf der Seite nur ein "snake.name"-App-Link ohne Details — [plant.id](https://www.kindwise.com/plant-id)

**iNaturalist / Seek Computer Vision**
- Laut iNaturalist-Staff im Forum ist die Vorschlags-API (computervision/score_image) nicht öffentlich; nur wenige ausgewählte Organisationen erhielten kostenpflichtigen Zugang für Forschung oder andere Citizen-Science-Apps — [iNat Forum "Hidden" CV API](https://forum.inaturalist.org/t/hidden-computer-vision-api/41775); [iNat Forum: API species from photograph](https://forum.inaturalist.org/t/inaturalist-api-species-from-photograph/24686)
- Nutzungsbedingungen verbieten laut Forumszitat das Training kommerzieller KI-Modelle mit iNaturalist-Daten — [iNat Forum](https://forum.inaturalist.org/t/can-i-use-inaturalist-aws-open-data-to-train-commercial-ai-model/77663) (Original-Terms-Seite lieferte HTTP 403, nicht direkt verifiziert)

**Naturalis / Observation.org (ObsIdentify) – "Nature Identification API"**
- Naturalis: "established service that continues to support organisations with a large number of end users"; Modell 2023 umfasst ca. 40.000 europäische Taxa, bedient sechs europäische Biodiversitätsportale; ObsIdentify >1 Mio. Downloads; Kontakt für Kooperation: Ni Yan (ni.yan@naturalis.nl). Keine öffentlichen Preise/Terms — [Naturalis AI](https://www.naturalis.nl/en/ai)
- ObsIdentify erkennt nur wildlebende Tiere, Pflanzen, Pilze in Europa und der Karibik-Niederlande — (Suchsnippet App Store) [ObsIdentify App Store](https://apps.apple.com/app/id1464543488)

**Flora Incognita (TU Ilmenau / MPI Biogeochemie Jena)**
- Keine offizielle API-/Lizenzdoku gefunden; Blog nennt nur support@floraincognita.com. Aggregator stork.ai behauptet "public API" – unbelegt — [Flora Incognita Blog](https://floraincognita.com/blog/2024/10/24/study-on-identification-accuracy-flora-incognita-reaches-98-8/); [stork.ai](https://www.stork.ai/en/flora-incognita)

**Merlin / eBird / Cornell**
- Keine öffentliche Merlin-API für Dritte gefunden. eBird-API-Terms: keine kommerzielle Nutzung "whatsoever without prior written permission"; Definition schließt Nutzung durch/für kommerzielle Unternehmen ein; Anfrage an ebird@cornell.edu — [eBird API Terms](https://www.birds.cornell.edu/home/ebird-api-terms-of-use/)
- Es existieren separate "Merlin computer vision terms of use" (NABirds) — [Merlin CV Terms](https://dl.allaboutbirds.org/merlin-computer-vision-terms-of-use) (nicht gelesen)

**BirdNET (Audio, Cornell + TU Chemnitz)**
- Code MIT, Modelle CC BY-NC-SA 4.0 (nicht-kommerziell) — [PyPI birdnet](https://pypi.org/project/birdnet); Repo verweist auf modellspezifische Lizenzen, Kontakt ccb-birdnet@cornell.edu — [BirdNET-Analyzer GitHub](https://github.com/kahst/BirdNET-Analyzer)

**Google SpeciesNet (Kamerafallen-Modell, selbst hostbar)**
- Apache-2.0-Lizenz (kommerziell nutzbar), >2.000 Labels (Arten + höhere Taxa + Nicht-Tier-Klassen wie "vehicle"), trainiert auf >65 Mio. Bildern; Basis von Wildlife Insights — [TechCrunch 03.03.2025](https://techcrunch.com/2025/03/03/google-releases-speciesnet-an-ai-model-designed-to-identify-wildlife/)

**Generische Cloud-/LLM-Dienste (Gemini)**
- Gemini-API-Preise je 1 Mio. Tokens (Standard, USD): 2.5 Flash $0,30 Input (Text/Bild) / $2,50 Output; 2.5 Flash-Lite $0,10 / $0,40; 3 Flash Preview $0,50 / $3,00; 3.1 Flash-Lite $0,25 / $1,50; 3.6 Flash $0,75 / $3,75 bis 31.12.2026, ab 01.01.2027 $1,50 / $7,50. Free-Tier-Daten werden zur Produktverbesserung genutzt, Paid-Tier nicht — [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)

**Tierspuren / Fährten**
- Einzige gefundene "API": Paw Print Identification API auf Marktplatz Zyla Labs, ohne Angaben zu Arten, Genauigkeit oder Anbieter-Seriosität — [Zyla Labs](https://creators.zylalabs.com/api-marketplace/ai+%26+machine+learning/paw+print+identification+api/6340); sonst nur Consumer-iOS-Apps mit unbelegten Genauigkeitsclaims ("95%+") — [Animal Track Identifier](https://apps.apple.com/us/app/-/id6748623645)

### Inferences
- Für Pflanzen ist Pl@ntNet die günstigste kommerziell klar lizenzierte Option; für Pilze und Insekten ist Kindwise praktisch der einzige Self-Service-Anbieter.
- Für Säugetiere/Vögel bleibt nur: (a) Verhandlung mit Naturalis (40k EU-Taxa inkl. Tiere – fachlich der beste Fit für "Deutschland/Europa zuerst"), (b) iNaturalist-Einzelvereinbarung (unsicher), (c) selbst gehostete offene Modelle (SpeciesNet; BioCLIP, siehe Frage 2) oder (d) LLM-Fallback (Gemini).
- Tierspuren: kein belastbarer Anbieter → eigenes Modell/Expertenvalidierung nötig.

### Gaps
- Pl@ntNet-Vertrag v5.1 nicht gelesen (Haftung, Exklusivität, Caching-Regeln).
- Ob iNaturalist 2026 neue kommerzielle API-Programme anbietet – keine offizielle Quelle gefunden.
- Naturalis-Konditionen (Preis, kommerzielle Nutzung) – nur per Kontakt.
- PictureThis (Glority) B2B-API: nicht recherchiert/gefunden. AWS Rekognition und Azure Vision: keine Primärquelle abgerufen; nach Kenntnis liefern sie generische Labels ("Bird", "Mushroom"), keine artgenauen Ergebnisse – unverifiziert.

## 2. Abdeckung und Genauigkeitsnachweise

### Takeaway
Herstellerangaben: Pl@ntNet 50.000+ Pflanzenarten; plant.id 35.000+ Klassen (93 % Top-3); insect.id 14.000+ (92 % Top-3); mushroom.id ~4.500–5.000 Klassen (88 % Top-3); Naturalis ~40.000 europäische Taxa. Unabhängige Studien: Pflanzen-Apps 2023–2025 bei ca. 69–90 % (Top-1, UK), Pilz-Apps nur 35–49 % und gefährlich bei Giftpilzen. LLMs (Gemini) liegen bei offener Artbestimmung deutlich unter Spezialmodellen.

### Cited Findings
- plant.id: "35 000+ classes" (Zimmerpflanzen, Zierpflanzen, Bäume, Unkräuter), weltweit; "93 %" korrekte Art in Top 3 (Methode nicht angegeben); verweist auf Studien, in denen plant.id besser als PlantNet, iNaturalist, Google Lens abschnitt (britische Flora; fremdländische Straßenbäume) — [plant.id](https://www.kindwise.com/plant-id)
- insect.id: >14.000 Klassen terrestrischer Wirbelloser, 92 % Top-3 — [insect.id](https://www.kindwise.com/insect-id)
- mushroom.id: 4.500+ Taxa / "almost 5,000 classes" (inkl. Schleimpilze, Flechten), 88 % Top-3; Essbarkeitsdaten nur für 13,15 % der Einträge, Doppelgänger 4,58 %, psychoaktiv 14,02 % — [mushroom.id](https://www.kindwise.com/mushroom-id)
- Pl@ntNet: "50,000+ species" — [Pl@ntNet Pricing](https://my.plantnet.org/pricing)
- Hart et al. 2023 (People and Nature): 5 kostenlose Apps, 857 Bilder, 277 Arten (UK); Top-5 korrekt 85 %, Top-1 69 %; App-Spannweite 86,9 % bis 46,4 % — [Hart et al. 2023](https://eprints.glos.ac.uk/12421); [Rzanny et al. 2024](https://doaj.org/article/c225b80bd4df45b4981e077694cee3ef)
- Rzanny et al. 2024: Flora Incognita mit demselben Datensatz 98,8 % nach Neuabgleich mit Botanikern (vor Korrektur >90 %) – Studie von den Flora-Incognita-Entwicklern selbst (Interessenkonflikt) — [Flora Incognita Blog](https://floraincognita.com/blog/2024/10/24/study-on-identification-accuracy-flora-incognita-reaches-98-8/)
- Urbane Flora Ostschottland (2025): beste Apps (u. a. Flora Incognita, PlantNet) 80–90 % artgenau; ~20 Prozentpunkte Verbesserung seit 2020 — [UWA Repository](https://research-repository.uwa.edu.au/en/publications/application-and-pitfalls-of-the-use-of-plant-id-apps-for-urban-fl/)
- Jones 2020 (AoB Plants): 9 Apps, 38 Bilder britischer/irischer Flora; Plant.id schnitt in den meisten Parametern am besten ab — [Jones 2020 PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7640754); [Wikipedia Kindwise](https://en.wikipedia.org/wiki/Kindwise)
- Giftpflanzen (J Med Toxicol 2020): PictureThis 10/17 (59 %), Pl@ntNet 8/17 (47 %) Arten 100 % korrekt — [DOI 10.1007/s13181-020-00803-6](https://dx.doi.org/10.1007/s13181-020-00803-6)
- Pilze: Hodgson et al. 2023 (Clinical Toxicology), 78 Proben aus Giftnotrufkontext, Australien: bestes App (Picture Mushroom) ~49 %, andere ~35 %; giftige Proben nur ~44 % korrekt; Amanita phalloides zweimal falsch — [PubMed 36794335](https://pubmed.ncbi.nlm.nih.gov/36794335/)
- Belgisches Giftinformationszentrum (EAPCCT 2022): nur 8 % der Fotos ergaben ohne Bearbeitung eine verlässliche Bestimmung; giftige als essbar verwechselt — [Antigifcentrum PDF](https://www.antigifcentrum.be/app/uploads/2025/11/EAPCCT-2022-identification-of-mushrooms.pdf)
- LLMs: Gemini-3 Pro ca. 39 % bei offener Pflanzen-/Unkraut-Artbestimmung — [arXiv 2512.15977](https://arxiv.org/pdf/2512.15977); Gemini bester Zero-Shot bei Kamerafallen-Tierarten mit 75,89 % — [JBCS 2026](https://journals-sol.sbc.org.br/index.php/jbcs/article/view/5894); BioCLIP (Spezialmodell) schlägt allgemeine VLMs (Qwen3-VL, Gemma3) — [arXiv 2609.11916](https://huggingface.co/papers/2609.11916) (Zahlen nur aus Snippets)

### Inferences
- Für Pflanzen sind Pl@ntNet und plant.id in Studien nahe beieinander; Flora Incognita ist in Mitteleuropa wohl am stärksten, aber nicht als API buchbar.
- Pilz-Ergebnisse dürfen in Wildfund nie als Essbarkeitsurteil erscheinen (rechtliches und Sicherheitsrisiko); deutliche Warnhinweise nötig.
- LLMs sind als Fallback/Erklärer brauchbar, nicht als primärer Artklassifikator.

### Gaps
- Aktuelle LifeCLEF/PlantCLEF-2025/2026-Ergebnisse nicht abgerufen.
- Keine unabhängige Benchmark für Kindwise insect.id/mushroom.id gefunden; die 88/92/93 %-Werte sind Herstellerangaben ohne Methodik.
- Keine Genauigkeitszahlen für Naturalis-API öffentlich gefunden.
- Europa-Abdeckung (Anteil der in DE vorkommenden Arten) für keinen Anbieter belegt.

## 3. Preise und Kosten für 1.000 / 100.000 / 1.000.000 Anfragen pro Monat

### Takeaway
Pl@ntNet ist ca. 4–10× günstiger als Kindwise. Bei 1 Mio./Monat: Pl@ntNet ca. €4.000–4.300/Monat, Kindwise ca. €10.000–12.000/Monat. Gemini Flash-Lite wäre per Token-Rechnung im Bereich von nur ~$100/Monat, aber mit deutlich schlechterer Artgenauigkeit.

### Cited Findings
- Preisgrundlagen siehe Frage 1: [Pl@ntNet Pricing](https://my.plantnet.org/pricing); [Kindwise Pricing](https://www.kindwise.com/pricing); [Gemini Pricing](https://ai.google.dev/gemini-api/docs/pricing)

### Inferences (eigene Rechnung, netto, Stand 25.10.2026)
| Volumen/Monat | Pl@ntNet | Kindwise (je Produkt gleicher Credit-Preis) |
|---|---|---|
| 1.000 | €0 (Free: 500/Tag ≈ 15.000/Monat; kommerziell innerhalb Free-Quota erlaubt laut Terms) | €50 (Tier A, €0,05) |
| 100.000 (1,2 Mio./Jahr) | 1,2 Mio. × €0,005 ≈ €6.000/Jahr ≈ €500/Monat; Pro-Mindestbetrag €1.000/Jahr | Tier C €0,02 → €2.000/Monat (Tier D: 200k für €3.000 alle 2 Monate ≈ €1.500/Monat, Verfall nach 3 Monaten beachten) |
| 1.000.000 (12 Mio./Jahr) | gestaffelt 3 Mio. × €0,005 + 9 Mio. × €0,004 = €51.000/Jahr ≈ €4.250/Monat (falls nicht gestaffelt, sondern Gesamttarif: €48.000/Jahr) | Tier E €0,012 → €12.000/Monat; Tier F (1,5 Mio. für €15.000) ≈ €10.000/Monat |
- Gemini 2.5 Flash-Lite: Annahme ~260 Bild-Tokens + ~150 Prompt-Tokens + ~150 Output-Tokens je Anfrage → ca. $0,0001 pro Anfrage → ~$100 je 1 Mio. Anfragen. Die Bild-Token-Zahl (≈258 Tokens pro kleinem Bild) stammt aus Vorwissen über Gemini-Doku und wurde hier nicht neu verifiziert.
- Router-Kosten: Wenn z. B. 60 % Pflanzen (Pl@ntNet), 25 % Pilze/Insekten (Kindwise), 15 % Tiere (LLM/eigenes Modell) bei 1 Mio./Monat → ca. €2.550 (Pl@ntNet, 600k ≈ 7,2 Mio./Jahr) + ca. €3.750–5.000 (Kindwise, 250k) + gering (LLM) ≈ €6.500–7.500/Monat. Grobe Schätzung.

### Gaps
- Unklar, ob Pl@ntNet-Staffeln marginal (gestaffelt) oder als Gesamtvolumen-Tarif gelten und ob die €1.000/Jahr auf die Nutzung angerechnet werden (Seite nennt "Ausgleichsrechnung" nach 365 Tagen – spricht für Anrechnung, aber nicht bestätigt).
- Ob die 500/Tag Free-Quota zusätzlich zum Pro-Vertrag gilt: nicht angegeben.
- Kindwise: Ob Zusatzfeatures (z. B. Health-Assessment, Detailabfragen, LLM-Fragen) zusätzliche Credits kosten – nicht auf Preisseite angegeben.
- Naturalis, iNaturalist, Cornell: keine Preise öffentlich.

## 4. Vertragsbedingungen und Datenschutz (kommerzielle Nutzung, Speicherung, Training, DSGVO)

### Takeaway
Pl@ntNet ist datenschutzseitig am klarsten: Fotos werden nicht gespeichert (nur im RAM, Speicherung nur von Query-Historie/Bild-URL), EU-gehostet (Frankreich, DSGVO + französisches Datenschutzgesetz). Kindwise (EU-Firma, Tschechien) gibt "GDPR compliant, extern auditiert" an, verarbeitet Daten aber laut Datenschutzerklärung auch "to improve identification accuracy" und nutzt LLM-Drittanbieter (OpenAI, Mistral, Google) für Chatfunktionen → AVV/DPA einholen. Gemini Paid Tier: kein Training, aber US-Anbieter (Drittlandtransfer via EU-US Data Privacy Framework/SCC zu prüfen).

### Cited Findings
- Pl@ntNet: "The photos sent by the user are not stored in the database. They are only kept in our server volatile memory during the identification process." Gespeichert wird die Query-Historie (Datum, Zeit, Bild-URLs) für Quoten und Statistiken; DSGVO und französisches Gesetz 78-17 zitiert; optionale Attribution (Satz + Logo) im Free-Plan; Zum Training und zum Caching von Ergebnissen sagen die Terms nichts — [Pl@ntNet API Terms](https://my.plantnet.org/terms_of_use)
- Pl@ntNet: Bilder, die die API als "ähnliche Bilder" zurückgibt, unterliegen ihren Lizenzen, meist CC BY-SA → Attribution (Plattform, Lizenz, Urheber) und Share-Alike bei Anzeige in der App — [Using images](https://my.plantnet.org/doc/references/using-images)
- Pl@ntNet Free-Plan "European hosted"; für Pro kein Ort angegeben — [Pl@ntNet Pricing](https://my.plantnet.org/pricing)
- Kindwise: "GDPR compliant", extern auditiert; Business-Plan mit "more than 3-month data retention" (impliziert Standard-Aufbewahrung ~3 Monate) — [Kindwise Pricing](https://www.kindwise.com/pricing)
- Kindwise-Datenschutzerklärung (Demo-Seiten, FlowerChecker s.r.o., Stand 21.06.2023): Verarbeitungszweck u. a. "to improve identification accuracy"; LLM-Integration (ChatGPT, Mistral, Google Gemini) – Eingaben werden an diese Anbieter weitergegeben; gilt ausdrücklich nicht für das Kindwise-Admin-Panel/Business-Kunden — [Kindwise Privacy Policy PDF](https://uploads-ssl.webflow.com/64876ae345f1e27598fafc02/65f46c2496d8857fa246d03d_Privacy%20policy%20for%20demos%20for%20end%20users.pdf)
- Gemini: Paid-Tier-Daten werden nicht zur Produktverbesserung genutzt, Free-Tier schon — [Gemini Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- eBird/Cornell: Attributionspflicht, keine kommerzielle Nutzung ohne schriftliche Genehmigung, Zugang jederzeit widerrufbar — [eBird API Terms](https://www.birds.cornell.edu/home/ebird-api-terms-of-use/)
- BirdNET: Modelle CC BY-NC-SA 4.0 → kommerzielle Nutzung nur mit Sondergenehmigung — [PyPI birdnet](https://pypi.org/project/birdnet)
- SpeciesNet: Apache 2.0, selbst hostbar → keine Datenweitergabe an Dritte — [TechCrunch](https://techcrunch.com/2025/03/03/google-releases-speciesnet-an-ai-model-designed-to-identify-wildlife/)

### Inferences
- Wildfund sollte Fotos vor dem API-Call serverseitig von EXIF-GPS befreien und auf nötige Auflösung verkleinern (Datensparsamkeit; reduziert auch Kosten bei LLMs).
- Für Kindwise vor Produktivstart: AVV nach Art. 28 DSGVO, Klärung Trainingsnutzung der Business-API-Bilder, Serverstandort und Subprozessoren schriftlich anfordern.
- Caching eigener Ergebnisse (Art-ID pro Beobachtung) ist bei keinem Anbieter ausdrücklich verboten, aber auch nicht ausdrücklich erlaubt → im Vertrag klären.

### Gaps
- Kindwise API-/Business-Terms (Bildeigentum, Training, Serverstandort, Subprozessoren, DPA) nicht auffindbar (Terms-URL 404); Datenschutzerklärung nur für Demo-Endnutzer.
- Pl@ntNet: Trainingsnutzung, Caching-Regeln und Serverstandort des Pro-Plans nicht dokumentiert (Vertrag v5.1 prüfen).
- Kindwise Rate-Limits nicht gefunden.

## 5. Kombination mehrerer Dienste (Router)

### Takeaway
Ein Router ist technisch und lizenzrechtlich machbar: Pflanzen → Pl@ntNet (günstig, EU, keine Bildspeicherung); Pilze und Insekten → Kindwise mushroom.id/insect.id; Tiere (Säugetiere/Vögel) → keine buchbare Spezial-API; Optionen: Naturalis-Kooperation anfragen, selbst gehostetes Modell (SpeciesNet/BioCLIP) oder Gemini-Fallback; Vogelstimmen nur mit Cornell-Genehmigung (BirdNET NC-Lizenz).

### Cited Findings
- Pl@ntNet erlaubt kommerzielle Nutzung (Free bis 500/Tag, darüber Pro) — [Pl@ntNet Terms](https://my.plantnet.org/terms_of_use)
- Kindwise-Credits gelten produktübergreifend zu gleichem Preis — [Kindwise Pricing](https://www.kindwise.com/pricing)
- Naturalis-API deckt Tiere, Pflanzen, Pilze Europas mit ~40.000 Taxa ab, offen für Kooperation — [Naturalis AI](https://www.naturalis.nl/en/ai)
- SpeciesNet kommerziell nutzbar (Apache 2.0) — [TechCrunch](https://techcrunch.com/2025/03/03/google-releases-speciesnet-an-ai-model-designed-to-identify-wildlife/)

### Inferences
- Vorgeschlagene Pipeline: (1) Grobklassifikation (Pflanze/Pilz/Insekt/Wirbeltier/Spur) per günstigem LLM oder kleinem eigenen Klassifikator oder per Nutzerauswahl in der App; (2) Spezial-API; (3) Plausibilisierung über GPS/Saison/Verbreitungsdaten (GBIF); (4) niedrige Konfidenz → Top-3 anzeigen bzw. Community-/Expertenprüfung.
- Naturalis als einzelner Anbieter könnte für "Europa zuerst" alle Gruppen abdecken – höchste Priorität für eine Anfrage.
- Unterschiedliche Taxonomien (Pl@ntNet/POWO, Kindwise/GBIF-IDs) → intern auf GBIF-Taxon-ID normalisieren (mushroom.id liefert GBIF-ID für ~97 % der Einträge, [mushroom.id](https://www.kindwise.com/mushroom-id)).

### Gaps
- Keine Erfahrungsberichte/Benchmarks zu Multi-API-Routern gefunden.
- Ob Kindwise oder Pl@ntNet Nutzung in Kombination mit Konkurrenzprodukten vertraglich einschränken: nicht geprüft.

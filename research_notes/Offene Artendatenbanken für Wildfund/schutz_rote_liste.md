# Machine-readable sources for protection status and Red List status (DE / EU / global / North America) – licence check for commercial use (Wildfund)

Research date: 2026-10-24. I checked licences on the official pages where those pages could be reached. iucnredlist.org and api.iucnredlist.org returned HTTP 403 to automated fetches, so the IUCN quotes come from search-engine snippets of the official pages. They are flagged as such.

## 1. German legal protection (BNatSchG "besonders/streng geschützt", BArtSchV Anlage 1) – WISIA and legal texts

### Takeaway
WISIA (BfN) is the reference for German protection status, but it has no documented download, API or open licence. It is a lookup website, and it states that the legal texts are binding. The clean route is to derive the status yourself from the legal sources. Laws and EU acts are not protected by copyright, so this is legally unproblematic. The sources are BArtSchV Anlage 1, EU 338/97 Annexes A/B, FFH Annex IV and the Birds Directive, combined according to the definitions in § 7 Abs. 2 Nr. 13/14 BNatSchG.

### Cited Findings
- WISIA-online is run by BfN: "In WISIA-online sind Informationen zum Schutzstatus von international und national geschützten Arten abrufbar." — [wisia.de](https://www.wisia.de/)
- WISIA disclaimer: it "dient als Hilfsmittel zur Ermittlung des vom Gesetzgeber festgelegten Schutzumfangs … verbindlich sind im Zweifelsfall die betreffenden Gesetzestexte und ihre Anhänge!" — [wisia.de](https://www.wisia.de/)
- The WISIA homepage mentions no download, export or API, and there is no separate Nutzungsbedingungen page (only Impressum and Datenschutz). Data as of 08.07.2026, application as of 01.09.2025, contact wisia@bfn.de. — [wisia.de](https://www.wisia.de/)
- WISIA holds about 35,443 valid names and about 61,500 synonyms or spellings, according to a scraper merge request by umwelt-info.de (the federal metadata portal), which apparently harvests WISIA metadata. — [gitlab.opencode.de umwelt-info MR 171](https://gitlab.opencode.de/umwelt-info/metadaten/-/merge_requests/171)
- BArtSchV Anlage 1 is a table with the columns "Wissenschaftliche Bezeichnung", "Deutscher Name", "Besonders geschützte Arten zu § 1 Satz 1" (+) and "Streng geschützte Arten zu § 1 Satz 2" (+). It covers fauna and flora, including fungi, and often uses genus-level entries such as "spp." or "alle heimischen Arten" with footnotes. — [gesetze-im-internet.de BArtSchV Anlage 1](https://www.gesetze-im-internet.de/bartschv_2005/anlage_1.html)
- The legal definitions of "besonders geschützte Arten" and "streng geschützte Arten" are in § 7 Abs. 2 Nr. 13 and 14 BNatSchG. They combine Annex A/B of Reg. (EC) 338/97, FFH Annex IV, the European bird species of the Birds Directive and the BArtSchV. — [gesetze-im-internet.de § 7 BNatSchG](https://www.gesetze-im-internet.de/bnatschg_2009/__7.html) (I did not fetch this page in this session; the structure is standard legal knowledge.)
- Laws and regulations are "amtliche Werke" without copyright protection under § 5 UrhG. — [gesetze-im-internet.de § 5 UrhG](https://www.gesetze-im-internet.de/urhg/__5.html) (I did not fetch this page in this session.)

### Inferences
- WISIA is the only ready-made dataset that combines everything (BNatSchG, BArtSchV, EU 338/97, FFH, VRL, CITES). Without written permission from BfN (wisia@bfn.de), scraping it for a commercial app is legally grey: database right under §§ 87a ff. UrhG, and no licence is stated. **Recommendation: email BfN and ask for a data export or licence.** In parallel, compute the status yourself from the legal sources.
- Derivation rule (simplified): streng geschützt = Annex A of 338/97, FFH Annex IV, or BArtSchV column "streng". Besonders geschützt = all of those plus Annex B of 338/97, all European birds (VRL Art. 1) and BArtSchV column "besonders". The genus-level entries in BArtSchV ("alle heimischen Arten") must be expanded against a taxonomy such as the German checklist.
- gesetze-im-internet.de normally offers an XML download for each law (pattern `…/bartschv_2005/xml.zip`). The fetched page did not show one, so this needs checking.

### Gaps
- No official WISIA download or API was found, and I found no licence statement. The WISIA Impressum (`Impressum.de.html`) was not read.
- I did not verify the last amendment date of BArtSchV Anlage 1.

## 2. Rote Liste Deutschland (Rote-Liste-Zentrum) and federal state red lists

### Takeaway
The Rote-Liste-Zentrum (RLZ, run by DLR Projektträger for BfN) offers ZIP files with Excel workbooks of the complete German Red List data for all organism groups, including mammals, birds, vascular plants and macrofungi. The data tables also contain columns for the federal states. There is **no open licence**: the usage terms are general DLR copyright terms ("Verwendungserlaubnis (Lizenz) anzufragen"), and the downloads only require citing the source. **Commercial use therefore needs written permission from RLZ/DLR/BfN.** One exception is a third-party republication of the vascular plant Red List 2018 on GBIF under CC BY 4.0 (see section 5).

### Cited Findings
- Download pages per group: Wirbeltiere, Wirbellose, Pflanzen, Pilze & Flechten. "Der Download Rote-Liste-Daten als ZIP-Datei enthält: Datenpakete zu jeder Organismengruppe als Excel-Arbeitsmappen mit den vollständigen Rote-Liste-Daten und eine Legende sowie ein von Browsern lesbares Info-Dokument". — [RLZ Download Wirbeltiere](https://www.rote-liste-zentrum.de/die-roten-listen/download-wirbeltiere/)
- Available vertebrate lists: mammals 2020 (and 2009), amphibians 2020, reptiles 2020, freshwater fish 2023, marine fish 2025, birds 2015/2016 (and 2009). "Die neue Rote Liste der Brutvögel wurde bisher nur in den 'Berichten zum Vogelschutz' 57 (2020) veröffentlicht, die Gefährdungseinstufung der Vögel ist beim DDA zu finden." In other words, the current breeding bird list (6th edition, 2020/2021) is not in the RLZ download. — [RLZ Download Wirbeltiere](https://www.rote-liste-zentrum.de/die-roten-listen/download-wirbeltiere/)
- Fungi: Großpilze 2016, Phytoparasitische Kleinpilze 2023, Flechten 2011, Schleimpilze 2011. — [RLZ Download Pilze/Flechten](https://www.rote-liste-zentrum.de/die-roten-listen/download-pilze-flechten/)
- Plants: Farn- und Blütenpflanzen 2018 (ZIP updated 2024-08-20), Moose 2018, plus several algae groups. — [RLZ Download Pflanzen](https://www.rote-liste-zentrum.de/die-roten-listen/download-pflanzen/)
- Contents of the mammal ZIP (downloaded and inspected): `02_Datentabelle_RL_Saeugetiere_2020_Deutschland.xlsx` with the columns Name, Deutscher Name, UUID des Taxons, Synonyme, Status, aktuelle Bestandssituation, kurz- und langfristiger Bestandstrend, Risiko, Letzter Nachweis, **RL Kat.**, alte RL-Kat., Kategorieänderung, Verantwortlichkeit, plus **one column per federal state (BB, BE, BW, BY, HE, HH, MV, NI, NW, RP, SH, SL, …) with "Tax. Bezug"**. — [RLZ Säugetiere 2020 ZIP](https://www.rote-liste-zentrum.de/wp-content/uploads/Download_RoteListe_Saeugetiere_2020_20210317-1601.zip) (Gaps: I did not check whether the state columns hold the state Red List categories or occurrence status. Check the legend file 03_Legende.)
- Usage note in the info file of the ZIP: "Bei Verwendung der Daten ist die Quelle der publizierten Roten Liste gemäß nachstehender Tabelle anzugeben." There is no licence (CC or dl-de) in the package. — same ZIP, file `01_Informationen_RL_Saeugetiere_2020.html`
- RLZ Impressum und Nutzungsbedingungen: "Die Urheberrechte aller in diesem öffentlichen Internet-Angebot … verwendeten urheberrechtlich geschützten Inhalte wie z.B. Bilder, Videos, Abbildungen und Texte liegen, sofern nicht anders angegeben, beim Deutschen Zentrum für Luft- und Raumfahrt e.V. (DLR)… Die jeweilig angegebenen Rechteinhaber sind vor der Verwendung des Materials in jedem Einzelfall um Verwendungserlaubnis (Lizenz) anzufragen." Free reuse is granted only to press, radio, TV and corresponding online information services. — [RLZ Impressum](https://www.rote-liste-zentrum.de/impressum/)
- The RLZ "Artensuchmaschine" offers per-species data (RL category, population status, trend). — [RLZ Artensuchmaschine](https://www.rote-liste-zentrum.de/artensuchmaschine/); [RLZ Kontakt (search result)](https://rote-liste-zentrum.de/en/kontakt.php)
- RLZ has been a GBIF publisher since 22.11.2023, but its only dataset so far is "Neuropteren Deutschlands" (occurrence data, **CC BY-NC 4.0**). It has published no Red List checklist on GBIF. — [GBIF publisher RLZ](https://www.gbif.org/publisher/25053eca-4437-41de-b675-444497ae24e6), checked via the GBIF API (`/v1/dataset/search?publishingOrg=25053eca…`)
- umwelt-info.de plans a scraper for RLZ downloads ("downloadable lists … as separate datasets"). — [gitlab.opencode.de issue 187](https://gitlab.opencode.de/umwelt-info/metadaten/-/issues/187)

### Inferences
- In terms of content, RLZ fully covers mammals, birds (2015 data, the current 2020 list via DDA), vascular plants and macrofungi (2016), in good machine-readable form (Excel with UUIDs). Legally, commercial use is **not** cleared. Facts such as a single RL category are not copyrightable, but copying the complete table touches the database right of the producer (§ 87b UrhG). **Recommendation: ask RLZ (info@rotelistezentrum.de) for a licence.** As a public-sector body funded by BfN, it may grant CC BY or dl-de/by-2.0, but this is unconfirmed.
- Federal state red lists: there is no central source. Each state (for example LfU Bayern, LANUV NRW) publishes its own lists, mostly as PDF, with its own licences. The state columns in the RLZ table may help, but their meaning still needs checking.

### Gaps
- I found no explicit statement from RLZ on commercial use of the Excel data, so you need to ask.
- I did not check the licence for the 2020 breeding bird Red List from DDA (dda-web.de).
- Federal state red lists were not researched one by one.

## 3. FloraWeb (BfN) – plants

### Takeaway
FloraWeb shows protection status and Red List status per plant species and offers downloads: the German checklist (Buttler et al. 2018) and a ZIP of the Rote Liste Farn- und Blütenpflanzen 2018. I found no licence statement and no API.

### Cited Findings
- FloraWeb: "Hintergrundinformationen zum gesetzlichen Schutz und zur Gefährdung nach Roter Liste"; species profiles include "Daten zu Gefährdung, Schutz, Ökologie". — [floraweb.de](https://www.floraweb.de/), [Artenschutz](https://www.floraweb.de/artenschutz.html)
- Downloads: checklist Buttler, May & Metzing 2018 (PDF plus Excel corrections, 22.03.2019) and "Rote Liste der Farn- und Blütenpflanzen (Trachaeophyta) Deutschlands (Stand: 28.02.2018)" as a ZIP (1.97 MB). There is no protection status per species as a download. — [FloraWeb Downloads](https://www.floraweb.de/downloads.html)
- No licence or usage terms were found on the homepage or the download page. — [FloraWeb Downloads](https://www.floraweb.de/downloads.html)

### Gaps
- I did not read the FloraWeb Impressum (https://www.floraweb.de/impressum.html) for usage terms.

## 4. EU: Habitats/Birds Directive annexes, EUNIS, European Red List, CITES/EU wildlife trade

### Takeaway
EEA material is generally licensed **CC BY 4.0, explicitly including commercial use**. The **European Red Lists of species 2009–2022** (DG ENV/EEA, published 28.03.2025, CSV/Excel, 19 groups including mammals, birds and vascular plants) are CC BY 4.0. That makes them the cleanest source for European Red List status. They do not cover fungi. Annex lists for FFH and the Birds Directive are available through EUNIS and the Article 17/12 reporting checklists (CC BY under the EEA policy), and the legal texts on EUR-Lex can be reused freely. CITES and EU wildlife trade data from Species+ (UNEP-WCMC) **prohibits commercial use and redistribution without written permission from UNEP**. The legal annexes of Reg. 338/97 (EUR-Lex) and the CITES appendices themselves are an alternative.

### Cited Findings
- EEA legal notice: "EEA materials are published under the CC-BY license … may be re-used without prior permission, free of charge, for commercial or non-commercial purposes … provided that the EEA is always acknowledged as the original source of the material … The above-mentioned permissions do not apply to content supplied by third parties." — [EEA legal notice](https://www.eea.europa.eu/en/legal-notice)
- "European Red Lists of species, 2009-2022": published 2025-03-28; CSV/TXT/SQL/Excel; "License CC-BY 4.0"; "Owners and Copyright holders: Directorate-General for Environment (DG ENV)"; 19 groups: mammals, birds, amphibians and reptiles, freshwater and marine fish, freshwater and terrestrial molluscs, vascular plants, medicinal plants, trees, endemic shrubs, lycopods and ferns, bryophytes, saproxylic beetles, butterflies, dragonflies, bees, hoverflies, Orthoptera. Download: https://sdi.eea.europa.eu/webdav/datastore/public/eea_t_european-red-list-species_p_2009-2022_v01_r00 — [EEA SDI record 2009-2022](https://sdi.eea.europa.eu/catalogue/srv/api/records/9a752c28-cb5f-4ead-9922-2a8173e0306b)
- Previous version 2006–2017 (superseded): CC BY 4.0, copyright holders "DG ENV, International Union for Conservation of Nature (IUCN)", more than 10,000 species (for example mammals 261, birds 533, vascular plants 1,826). — [EEA SDI record 2006-2017](https://sdi.eea.europa.eu/catalogue/srv/api/records/9c785326-8859-4abd-aad6-c8d35b619ff9)
- EUNIS species module: more than 278,000 taxa, including "Data on Species … compiled in the framework of NATURA2000 (EU Habitats and Birds Directives)" and "Information on Species … taken into account in relevant international conventions or from International Red Lists". On GBIF, the EUNIS checklist has 278,540 records, but its licence there is "unspecified" and it was last modified in 2016. — [GBIF EUNIS dataset](https://www.gbif.org/dataset/1bd42c2b-b58a-4a01-816b-bec8c8977927), [EUNIS](https://eunis.eea.europa.eu/about)
- BISE uses a table "BISE_Species_Legal_Status" with the legal instrument "EU Habitats Directive" (unconfirmed, from a search snippet). — [BISE Natura 2000 species protection statistics](https://biodiversity.europa.eu/data/natura-2000-species-protection-statistics)
- Article 17 and 12 reporting use official checklists (`art17_species_checklist.xsd`, `art12_birds_checklist.xsd`) in the EEA Data Dictionary. — [Eionet DD Habitats Directive schemaset](https://dd.eionet.europa.eu/schemaset/habitatsdirective/view); Art. 12 reference portal: [BfN Art. 12 report format](https://www.bfn.de/sites/default/files/2021-07/Article_12_report_format_2013-2018.pdf)
- Natura 2000 tabular data (site species lists) as CSV ZIP (`Natura2000_end2021_rev1_csv.zip`). Germany and others withhold sensitive species. — [EEA Natura 2000 dataset (search result)](https://www.eea.europa.eu/ds_resolveuid/YQAZDNXV81)
- Species+/CITES Checklist API (UNEP-WCMC): "'Commercial Use' means a) any use for profit or to generate revenue b) any use by an individual or entity operating within or on behalf of or to the benefit of … any entity other than a not-for-profit organisation"; "Neither (a) the Materials nor (b) any work derived from or based upon the Materials may be put to Commercial Use without the prior written permission of UNEP."; "You may not redistribute the Materials … through web services"; "You may not use the Materials for any application that replicates or attempts to replace the essential user experience of Speciesplus.net." — [Species+ Terms of Use](https://speciesplus.net/terms-of-use)
- The Species+ API needs a personal token. — [rcites docs](https://docs.ropensci.org/rcites/index.html)

### Inferences
- For FFH II/IV/V and VRL Annex I/II/III, the most robust approach is to parse the annexes from EUR-Lex (92/43/EEC consolidated, 2009/147/EC consolidated). EU legal texts are free to reuse under Decision 2011/833/EU (not verified in this session). Then cross-check against EUNIS or the Art. 17 checklist, which are CC BY via the EEA policy. EUNIS "legal status" exports would be the most convenient option, but I did not verify a direct download.
- For CITES and EU 338/97 Annex A–D, use the EUR-Lex annexes of the current implementing regulation (updated regularly) instead of Species+, unless UNEP grants permission.
- The European Red List has no fungi. Macrofungi have no comprehensive European Red List.

### Gaps
- I found no direct download URL for an Art. 17 species checklist 2019–2024 or for EUNIS legal-status tables.
- I did not check how often the European Red List is updated. Judging by its version history (2006–2017, then 2009–2022 published 2025), updates come at intervals of years.

## 5. GBIF datasets that republish red lists or protection lists

### Takeaway
GBIF has a **CC BY 4.0 version of the German Red List of vascular plants 2018** (5,312 taxa, published by Hortus botanicus Leiden, version 1.4, modified 2026-05). This is the only German national Red List with an open licence that I found. The RLZ itself only publishes CC BY-NC occurrence data. There are also CC0/CC BY Red Lists from neighbouring countries (Sweden 2025 CC0, Luxembourg CC0, Netherlands and Switzerland CC BY) and CC0 checklists of FFH Annexes II/IV/V (published by the Ukrainian Nature Conservation Group).

### Cited Findings
- "Red List Vascular Plants (2018, Germany) - Rote Liste Gefässpflanzen (2018, Deutschland)", Hortus botanicus Leiden, **CC BY 4.0**, 5,312 taxa, version 1.4, modified 2026-05-11; source Metzing et al. (2018), NaBiV 70(7). — [GBIF dataset 73370f38](https://www.gbif.org/dataset/73370f38-ed24-4dfa-9a17-4df3a1e816a3) (metadata via the GBIF API)
- Other open Red Lists on GBIF: Swedish Red List 2025 (SLU Artdatabanken, CC0), Luxembourg breeding birds 2019 (CC0), Netherlands vascular plants 2012 (CC BY), Switzerland vascular plants 2016 (CC BY), France vascular plants 2018 (CC BY), "National checklists and red lists for European butterflies" (INBO, CC0). — GBIF API search `type=CHECKLIST&q=Rote Liste / red list`, e.g. [GBIF dataset 87e639cc](https://www.gbif.org/dataset/87e639cc-30a9-4007-bd2c-b0cab60326b9), [GBIF dataset f9af6ffd](https://www.gbif.org/dataset/f9af6ffd-febc-4626-b2e8-809b1c60fa01)
- FFH Annex II/IV/V lists as CC0 checklists (Ukrainian Nature Conservation Group). — [GBIF 2f845607 (Annex II)](https://www.gbif.org/dataset/2f845607-9b6a-4b31-b283-b87b89241e20), [GBIF d1baf4e0 (Annex IV)](https://www.gbif.org/dataset/d1baf4e0-db47-4802-bce0-87881bc105d5), [GBIF 0bc4fb0e (Annex V)](https://www.gbif.org/dataset/0bc4fb0e-a8f2-4e77-a3cf-be1ed4c028bb)
- "The IUCN Red List of Threatened Species" on GBIF (IUCN as publisher): 338,085 records, GBIF licence field **CC BY 4.0**, version 2026-1, modified 2026-07-30. — [GBIF dataset 19491596](https://www.gbif.org/dataset/19491596-35ae-4a91-9a98-85cf505f1bd3)
- Global Register of Introduced and Invasive Species – Germany cites the German Red List volumes as sources. — [GBIF GRIIS Germany](https://www.gbif.org/dataset/2a281675-c184-4d54-a47e-5d3a7ec6653f)

### Inferences
- **Conflict or uncertainty:** the IUCN GBIF dataset is labelled CC BY 4.0 in GBIF metadata, but IUCN's own terms prohibit commercial use without permission (section 6). Before relying on this route, ask IUCN or GBIF in writing whether the GBIF export (name plus category) may be used commercially under CC BY 4.0. It is possible that GBIF requires CC BY and IUCN accepted this for the GBIF subset. That would make it a legal route, but this is unconfirmed.
- The Leiden republication of the German plant Red List is CC BY. Whether Leiden had the right to relicense RLZ/BfN data is a chain-of-title question. To be safe, document the attribution and, if needed, confirm with RLZ.
- The Ukrainian FFH annex lists cover the EU annexes, which apply EU-wide. Check them for completeness and for the current version of the annexes, since the annexes have been amended (for example on accession of new member states, and the 2023 downgrading of the wolf).

### Gaps
- No German fauna or fungi Red List was found on GBIF under an open licence.

## 6. IUCN Red List (global) – API and terms

### Takeaway
The IUCN Red List API (v4) is free for non-commercial use but explicitly **forbidden for commercial use**. Commercial use needs written permission from IUCN or a paid IBAT subscription, which is aimed at corporate risk screening and not app embedding. IUCN defines "commercial use" broadly, including any use by a for-profit company. For Wildfund (a commercial app), using the IUCN API directly is therefore not clean without a licence.

### Cited Findings
- "Use of the Red List API for commercial purposes is strictly forbidden. Users who wish to use Red List data for commercial purposes should consider subscribing to IBAT." / "The use of the API falls under the same Terms of Use as the Red List. By requesting a token, you are agreeing to abide by the Terms of Use of the Red List." — [api.iucnredlist.org](https://api.iucnredlist.org/) (quoted from a search snippet; the page itself returned HTTP 403)
- Red List Terms of Use: "Neither (a) IUCN Red List Data nor (b) any work derived from or based upon IUCN Red List Data (i.e., 'Derivative Works') may be put to Commercial Use without the prior written permission of IUCN." Commercial use includes any use by or for a for-profit entity. — [IUCN Terms of Use (staging copy)](https://apistaging.iucnredlist.org/terms/terms-of-use); [IUCN summary terms](https://www.iucnredlist.org/summary-terms/summary-terms-of-use) (search snippet, 403 on direct fetch)
- IBAT: free accounts "do not constitute a licence to inform commercial decisions (except when using Pay As You Go)". — [IBAT Services overview PDF](https://app.ibat-alliance.org/pdf/IBAT-Services-overview.pdf); [IBAT terms](https://www.ibat-alliance.org/terms)
- Official R package: [IUCN-UK/iucnredlist](https://github.com/IUCN-UK/iucnredlist)

### Inferences
- Options: (a) ask IUCN directly for a commercial licence (I found no price; it is negotiated case by case); (b) check whether the CC BY 4.0 GBIF export of the IUCN Red List can be used (see section 5, unresolved); (c) use Wikidata P141 (CC0), noting that the data were copied from IUCN, so there is a chain-of-title risk; (d) for Europe, use the CC BY 4.0 European Red List from the EEA instead of IUCN global.

### Gaps
- I found no published price for an IUCN commercial licence. The full terms page could not be fetched (403).

## 7. Wikidata (IUCN status and protection status)

### Takeaway
Wikidata P141 ("IUCN conservation status") is set on about **153,000 items** (live SPARQL count, 2026-10-24). Wikidata is CC0, but the values were copied from IUCN, so they are legally grey for commercial use and not guaranteed up to date. I found no reliable Wikidata properties for German Red List or protection status.

### Cited Findings
- SPARQL `SELECT (COUNT(DISTINCT ?i) AS ?c) WHERE { ?i wdt:P141 ?s }` returned 152,969 items. — [query.wikidata.org](https://query.wikidata.org/)
- Wikidata structured data is CC0. — [Wikidata:Licensing](https://www.wikidata.org/wiki/Wikidata:Licensing) (not fetched in this session; standard knowledge)

### Inferences
- P141 is good as a fallback or for coverage checks. For a commercial app, don't present it as an "official IUCN" value without a licence.

### Gaps
- My test query for other properties (for example a national Red List status) returned no results because of a syntax or property issue, so this is unclear.

## 8. North America (brief)

### Takeaway
NatureServe Explorer has open content under CC BY, but its Pro and Open Data maps are CC BY-NC, and commercial licences cost from USD 10,000. US federal lists (USFWS ECOS, ESA) are generally public domain as US government works. For Canada, the SARA Public Registry and COSEWIC are the authoritative sources, and ECCC datasets are often under the Open Government Licence – Canada (commercial use allowed), but I did not confirm a COSEWIC status table under OGL.

### Cited Findings
- NatureServe: Explorer content CC BY; Explorer Pro public data and Open Data maps CC BY-NC; licence agreements required for commercial use of some data; base fee from USD 10,000, regional from USD 100,000, national about USD 300,000 (summary from search results). — [NatureServe use guidelines](https://natureserve.org/nsexplorer/about-the-data/use-guidelines-citation), [NatureServe access data](https://www.natureserve.org/access-data), [Explorer Pro pricing](https://natureserve.org/access-data/explorer-pro-pricing)
- Canada: the SAR Public Registry is the official home of COSEWIC assessments and SARA listings; an ECCC range-map dataset (488 species) is under OGL-Canada. — [Canada.ca COSEWIC assessments](https://www.canada.ca/en/environment-climate-change/services/species-risk-public-registry/cosewic-assessments-status-reports.html), [ECCC catalogue range maps](https://catalogue.ec.gc.ca/geonetwork/srv/api/records/d00f8e8c-40c4-435a-b790-980339ce3121)

### Gaps
- I did not verify the NatureServe API terms directly. Their summary came from search results.
- I did not verify the USFWS ECOS export and licence (17 U.S.C. § 105).

## 9. Practical recommendation (legally clean)

### Takeaway
The legally clean stack is:
1. **Protection status for Germany and the EU:** compute it yourself from the legal texts (BArtSchV Anlage 1, FFH and VRL annexes from EUR-Lex, EU 338/97 annexes), which are not protected by copyright. Validate with EUNIS or Art. 17 checklists (CC BY) or the CC0 FFH lists on GBIF. In parallel, ask BfN (wisia@bfn.de) for a WISIA export.
2. **European Red List:** EEA "European Red Lists of species 2009–2022" (CC BY 4.0, covers mammals, birds and vascular plants; no fungi).
3. **Rote Liste Deutschland:** vascular plants via the CC BY 4.0 GBIF dataset (Leiden). For mammals, birds and macrofungi, ask RLZ/DLR for a licence (Excel downloads exist, but only with "Verwendungserlaubnis"). For the 2020 breeding bird list, contact DDA.
4. **IUCN global:** only with an IUCN licence. Alternatively, clarify the CC BY GBIF export with IUCN in writing. As a fallback, use Wikidata P141 (CC0, with a chain-of-title risk).
5. **CITES:** EUR-Lex annexes or CITES appendices instead of Species+ (Species+ prohibits commercial use and redistribution).

### Cited Findings
- See sections 1–8 for the sources: [EEA legal notice](https://www.eea.europa.eu/en/legal-notice), [EEA European Red Lists 2009-2022](https://sdi.eea.europa.eu/catalogue/srv/api/records/9a752c28-cb5f-4ead-9922-2a8173e0306b), [GBIF RL Gefäßpflanzen 2018 CC BY](https://www.gbif.org/dataset/73370f38-ed24-4dfa-9a17-4df3a1e816a3), [RLZ Impressum](https://www.rote-liste-zentrum.de/impressum/), [Species+ terms](https://speciesplus.net/terms-of-use), [IUCN API](https://api.iucnredlist.org/)

### Inferences
- Update frequency: German Red Lists come every 10+ years per group (the cycle 2020ff is still running). The European Red List comes every few years. BArtSchV, FFH and 338/97 change only through amendments (338/97 annexes about every 1–3 years after CITES CoPs). A yearly sync is enough.
- Macrofungi are the weakest group: only the RLZ Großpilze 2016 (licence still to be clarified) and BArtSchV (for example some Boletus and Cantharellus species are besonders geschützt). There is no open European Red List for fungi.

### Gaps
- All permission requests (BfN/WISIA, RLZ, IUCN) are still open. A legal review by a specialist lawyer on database rights is recommended before launch.

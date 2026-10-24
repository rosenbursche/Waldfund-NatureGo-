# Open trait and ecology databases for plants, trees and fungi (Europe/Germany) for Wildfund species profiles

Research date: 2026-10-24. Scope: whether a commercial app can clone or query each source. "Commercial OK" means the license as verified permits for-profit reuse. Anything not verified on a primary page is marked UNVERIFIED and listed under Gaps.

## TRY Plant Trait Database: license, open subset, commercial use

### Takeaway
TRY's public trait data are under CC BY 4.0, which permits commercial use with attribution. Data still under embargo are "restricted" and may not be redistributed. TRY 6.0 (Oct 2022) is the current major version. Access is by data request through the website, not a free bulk download or API, and every product must cite the individual contributing datasets.

### Cited Findings
- IP Guidelines (verbatim): "Plant trait data in the TRY Database are public under the Creative Commons Attribution License 'CC BY' (https://creativecommons.org/licenses/by/4.0)." Restricted data "also become public under the Creative Commons Attribution License 'CC BY'" once the embargo ends. — [TRY IP Guidelines PDF](https://www.try-db.org/TryWeb/TRY_Intellectual_Property_Guidelines.pdf)
- Restricted data (verbatim): "During the embargo period the custodian can restrict data availability and/or request involvement in publications ... It is not allowed to redistribute restricted trait data received via TRY, unless expressly permitted by the respective data custodian(s)." There are two restricted states, "Restricted, with permission by default" and "Restricted, permission required in each case." — [TRY IP Guidelines](https://www.try-db.org/TryWeb/TRY_Intellectual_Property_Guidelines.pdf)
- Metadata (verbatim): "definitions of traits, sampling location and date are public under the Creative Commons Attribution License 'CC BY'." — same PDF
- Turnaround (verbatim): for requests "asking for public data only, this will in general be one or two working days after submission of the request"; for public plus restricted data, "at least two weeks." — same PDF
- Products (verbatim): "Any product that involves data under the Creative Commons Attribution License 'CC BY' must provide appropriate credit ... Any product that involves trait data received via the TRY Database therefore needs to cite" the data sources. — same PDF
- Version 6 was released in October 2022 and contains 15.4 million trait records from 696 datasets. CC BY has been the default since version 5 (2019). — [MPI-BGC TRY page](https://www.bgc-jena.mpg.de/en/try-datenbank-fifth-version); [WUR: "TRY plant trait database – enhanced coverage and open access"](https://research.wur.nl/en/publications/try-plant-trait-database-enhanced-coverage-and-open-access/)
- The TRY data portal page (try-db.org/TryWeb/Data.php) returned HTTP 500 when fetched on 2026-10-24. — direct fetch attempt

### Inferences
- The CC BY subset can legally go into a commercial app. Attribution is the work: each TRY download carries many contributing datasets, each needing citation, so the app needs an attribution or credits page per trait.
- TRY data are raw, measurement-level records (many rows per species, varied units). Getting one value per species for plant height, leaf traits (SLA, leaf size), life form or seed mass takes aggregation (means or medians), plus taxonomic harmonisation.
- No API. Expect a manual request, a one-off bulk import and periodic manual refreshes.

### Gaps
- Could not confirm whether TRY 7 or another newer release exists as of Oct 2026, because the data portal page returned an error.
- How much of the German or Central European flora is fully public (not restricted) has to be checked in the TRY data explorer per trait.

## Ellenberg indicator values and EIVE (Dengler et al. 2023): download and license

### Takeaway
EIVE 1.0 is openly downloadable from Zenodo as Excel under CC BY 4.0, so commercial use with attribution is allowed. It gives moisture, nitrogen, reaction (pH), light and temperature values on a 0–10 scale for 14,835 European taxa. It is the best open source for soil, light and moisture preferences. The original Ellenberg values (book publication) have no verified open license, so use EIVE instead.

### Cited Findings
- Zenodo record 10.5281/zenodo.7534792: "Supplementary material to: Dengler, J., Jansen, F., … & Gillet, F. (2023) Ecological Indicator Values for Europe (EIVE) 1.0. Vegetation Classification and Survey." License id `cc-by-4.0`, published 2023-01-13. Files: EIVE_Paper_1.0_SM_02.xlsx (16 MB), SM_03.xlsx, SM_08.xlsx. No newer version is listed on the record. — [Zenodo API record](https://zenodo.org/api/records/7534792); [Zenodo](https://zenodo.org/records/7534792)
- EIVE covers 5 niche dimensions (moisture, nitrogen, reaction, light, temperature) for 14,835 European vascular plant taxa and is fully open on Zenodo. — [Pensoft news](https://vcs.pensoft.net/news/373)
- EIVE is built from 31 source indicator-value systems, rescaled to 0–10. — [AGRIS/FAO record](https://agris.fao.org/search/en/records/6474a76041fdddc90d2505be)
- The paper itself is CC BY 4.0. — [ZHAW repository](https://srv-clst-301-data66.zhaw.ch/handle/11475/26832)
- PLANTATT (Britain) contains Ellenberg values recalibrated for Britain (see the PLANTATT section). — [BRC](https://www.brc.ac.uk/bibcite/reference/5)

### Inferences
- EIVE gives the app "Licht / Feuchte / Nährstoff / Boden-pH / Wärme" bars for almost every German vascular plant. It also includes niche-width values, useful for "specialist vs. generalist" text.
- EIVE uses its own taxonomy (EuroSL-based). Names need matching to the app's backbone (GBIF or WFO).
- The record has not been updated since 2023. That is stable, but there is no sign of an EIVE 2.0 on Zenodo.

### Gaps
- The license of the original Ellenberg et al. indicator values (Scripta Geobotanica 18, 3rd ed. 2001) was not verified. Treat them as copyrighted and do not clone them. Note that German Ellenberg values are among EIVE's source systems, so EIVE is the open route to them.
- No salinity value in EIVE 1.0. The Ellenberg salt (S) and continentality (K) values are missing from EIVE's five axes.

## BiolFlor and FloraWeb (BfN): downloadable? terms?

### Takeaway
Both are rich German sources, but neither has a verified open license. BiolFlor (UFZ) is in a "prototype" state after a migration and needs registration. FloraWeb (BfN) is live in 2026, but I found no download and no CC license. Treat both as "query by hand, cite, ask permission" rather than clonable.

### Cited Findings
- BiolFlor covers about 3,660 German vascular plant species. Traits include flowering phenology, vegetative morphology, floral and reproductive traits, pollination, seed and fruit traits, strategy types, life forms and habitat. Sources are more than 1,800 literature sources plus the authors' own measurements. — [UFZ BiolFlor page](https://www.ufz.de/index.php?en=38567)
- Availability: "The migration of the database is complete, and it is currently available as a prototype." Users must re-register, and access questions go to Alexander Harpke (alexander.harpke@ufz.de). The page states no license or terms. — [UFZ BiolFlor page](https://www.ufz.de/index.php?en=38567)
- An earlier search snippet of the same UFZ page said "The Website is currently not available (22th April 2024)." — [UFZ](https://www.ufz.de/index.php?en=38567) (search snippet; the page now says prototype)
- BiolFlor data can also be retrieved programmatically through the CRAN R package TR8 (GPL). TR8 asks users to cite the original sources, and the GPL covers only the package code. — [TR8 manual](https://search.r-project.org/CRAN/packages/TR8/TR8.pdf)
- FloraWeb is live (footer "2026 FloraWeb", changelog item dated 2026-10-01). It offers distribution maps, photos, threat status (Rote Liste), protection status, ecology, pollination and host-plant relations ("Schmetterlingspflanzen"), phenology, plant communities and neophyte assessments for more than 4,000 plants. The homepage shows no license statement, and /downloads returned 404. — [FloraWeb](https://www.floraweb.de/)
- FlorKart distribution data (the R package distdrawr) are "owned and provided by" BfN and NetPhyD. — [distdrawr on rdrr.io](https://rdrr.io/cran/distdrawr/)

### Inferences
- Without a written license, cloning BiolFlor or FloraWeb content into a commercial app is legally risky under German database rights (§87a UrhG). This is my inference, not a cited finding.
- FloraWeb is still valuable as a reference for protection status and Rote Liste hints. The legal protection status itself (BArtSchV/BNatSchG) is statutory fact and can be compiled independently.

### Gaps
- BiolFlor terms of use and the FloraWeb Impressum/Nutzungsbedingungen were not retrieved. A direct email to UFZ (Harpke/Kühn) and to BfN is needed to ask about commercial licensing.

## BIEN, LEDA, Baseflor, PLANTATT: licenses

### Takeaway
None of these four is clearly commercial-ready. BIEN's official policy is CC BY-NC-ND, though the R package README claims a switch to CC BY (an unresolved conflict). LEDA is "freely available," but I found no license. PLANTATT (2004/2008 Excel, NERC copyright) has no open license stated. Baseflor (Julve, France) license was not found.

### Cited Findings
- BIEN data use policy (verbatim): "BIEN data and derived products are distributed via a CC-BY-NC-ND Creative Commons license." — [BIEN data use policy](https://bien.nceas.ucsb.edu/bien/biendata/data-use-policy/)
- The RBIEN README says the license on BIEN data "was updated to a CC-BY license," to be described in a forthcoming publication. This conflicts with the policy page. — [BIEN R package README (CRAN)](https://cran.nics.utk.edu/cran/web/packages/BIEN/readme/README.html)
- BIEN is Americas-focused, with about 25.9 M trait observations across 54 traits (BIEN 4.2). — [BIEN data and access](https://bien.nceas.ucsb.edu/bien/data-and-access/)
- The LEDA Traitbase (life-history traits of the NW European flora) is described in its paper as "freely available at www.leda-traitbase.org." No license was found. — [LEDA paper (Kleyer et al. 2008), Uni Regensburg](https://pred.uni-regensburg.de/id/eprint/30109/)
- PLANTATT (Hill, Preston & Roy 2004) covers status, size (height), life form, life history, geography, habitats and Ellenberg values for British and Irish plants. It ships as PLANTATT_19_Nov_08.zip (Excel plus PDF), last updated November 2008. The PDF reads "NERC Copyright 2004," and no open license is on the BRC pages. — [BRC PLANTATT](https://www.brc.ac.uk/bibcite/reference/26); [NORA PDF](https://nora.nerc.ac.uk/id/eprint/9535/1/PLANTATT.pdf)

### Inferences
- BIEN is of little value for Germany and is NC-ND per its official policy, so skip it.
- LEDA (seed mass, canopy height, dispersal, SLA, clonal traits) would be very useful for Germany, but it is unmaintained (circa 2008) and its license is unclear. Its data are also in TRY under CC BY, which is the cleaner route (inference).
- PLANTATT is unmaintained since 2008. Its British Ellenberg values are superseded for app purposes by EIVE.

### Gaps
- No primary license page was found for LEDA, Baseflor or PLANTATT. The LEDA website status in 2026 was not checked.

## POWO/WCVP and World Flora Online: text licenses

### Takeaway
WFO's taxonomic backbone is CC0. WFO descriptive "content" has per-contributor licenses, with CC0 or CC BY recommended, so it must be checked per element. Kew's POWO pages could not be fetched. Kew's terms say CC BY applies only where stated, and otherwise data owners' terms apply. Verify POWO description licenses before reuse.

### Cited Findings
- WFO FAQ: the backbone "is provided with a Creative Commons Zero (CC-0) license and is unrestricted for use." Static Zenodo releases of the backbone are CC0 1.0. — [WFO FAQ](https://about.worldfloraonline.org/faqs); [Zenodo WFO backbone](https://zenodo.org/records/7460932)
- WFO content (descriptions, images, distributions, habit/habitat, uses, threat status): "Content data contributors can determine what Creative Commons license applies to the data they provide," and each element links to its source and license. WFO recommends CC-0 or CC-BY. — [WFO FAQ](https://about.worldfloraonline.org/faqs)
- Kew Terms of Use: where data are not licensed under CC BY, the associated terms or metadata apply. Kew adds no restrictions to contributed scientific data beyond the owner's. — [Kew Terms of Use](https://www.kew.org/node/2426)
- powo.science.kew.org/about returned HTTP 403 to automated fetches. — direct fetch attempt

### Inferences
- Use the WFO backbone (CC0) or GBIF as the name backbone. POWO and WFO free-text descriptions are mostly global floras and not tailored to Germany. Even where licensed, they are generally not app-ready text.

### Gaps
- The POWO description license and the WCVP download license were not verified on a primary page. My understanding is that WCVP is CC BY via Kew's SFTP or the Scientific Data paper, but this is UNVERIFIED.

## Phenology: PEP725 and DWD open data

### Takeaway
DWD phenology on opendata.dwd.de is CC BY 4.0, so commercial use is allowed with attribution. It includes a `wild` category of wild-plant phases (flowering, fruit ripening, leaf colouring) from German observer networks, which makes it the best open source for regional flowering and fruiting times. PEP725 changed policy: until 2025 it was NC-only, and since the policy effective 15 May 2026 the license varies per dataset (CC BY, CC BY-SA 2.0, CC0, Etalab, or CC BY-NC). Registration and a statement of intended use are required.

### Cited Findings
- DWD CDC terms (verbatim, German): "Es gelten die Bedingungen der Lizenz Creative Commons BY 4.0 'CC BY 4.0'. Einzelheiten unter: https://www.dwd.de/copyright" — [DWD Nutzungsbedingungen PDF](https://opendata.dwd.de/climate_environment/CDC/Nutzungsbedingungen_German.pdf)
- DWD phenology directory: `annual_reporters/` and `immediate_reporters/`. Annual reporters has the subfolders crops, farming, fruit, vine and wild. — [opendata.dwd.de phenology](https://opendata.dwd.de/climate_environment/CDC/observations_germany/phenology/); [annual_reporters](https://opendata.dwd.de/climate_environment/CDC/observations_germany/phenology/annual_reporters/)
- PEP725 Data Use Policy (verbatim): "This policy will take effect on 15 May 2026 ... Until 2025, the PEP725 dataset was licensed exclusively for non-commercial use. In order to be able to offer data that uses a different license, the database was expanded accordingly. When accessing a dataset, please check under which license the data is provided." The licenses are CC BY 4.0, CC BY-NC 4.0 ("You may NOT use the material for commercial purposes"), CC BY-SA 2.0 ("All derived works must be distributed under the same license"), CC0 1.0, and LO 2.0/Etalab. — [PEP725 Data Use Policy PDF](https://pep725.geosphere.at/wp-content/uploads/2026/03/PEP725_Data_Use_Policy.pdf)
- PEP725 redistribution (verbatim): "redistribution of data outside the terms of the selected license is forbidden without written permission." Access requires registration (name, affiliation, email), acceptance of the policy and "A statement of intended use." The required acknowledgement is "Data were provided by the members of the PEP725 project." — same PDF
- PEP725 is now hosted by GeoSphere Austria (pep725@geosphere.at). — same PDF
- Conflict: an older PEP725 privacy page describes data as available for "academic research, education, government use, recreation, or other not-for-profit" purposes. It predates or conflicts with the 2026 policy. — [PEP725 privacy policy](https://pep725.eu/privacy_policy/)

### Inferences
- For Germany, use DWD directly (the German data in PEP725 largely originate from DWD). Compute the median flowering onset per species per Naturraum from the station data, for example "blüht in deiner Region typischerweise ab 12. April."
- DWD's wild-plant species list is limited to a few dozen indicator species (e.g. Hasel, Schneeglöckchen, Forsythie, Holunder, Stieleiche, Rosskastanie, Heidekraut). It cannot fill flowering times for all species. This is an inference from the network's design; the exact species list was not fetched.
- Generic flowering months for most species have to come from BiolFlor-like sources (not open) or manual or LLM-assisted compilation with references.

### Gaps
- The DWD wild-plant species list and phases were not enumerated (the description files are inside the folders).
- Which PEP725 datasets (country or network) carry CC BY versus BY-NC is visible only after login.

## Toxicity: open databases of poisonous plants and fungi

### Takeaway
The best structured Central European source is Agroscope's TPPT database: 844 poisonous plants and 1,586 phytotoxins, XLS on opendata.swiss. Its terms require permission from the data owner for commercial use, so it is not freely commercial. BfR offers authoritative German risk classes (251 plants, with severity for small children), but as PDFs and publications, not an open dataset. I found no open, commercially licensed dataset giving toxic parts plus severity per species, so this is largely manual research.

### Cited Findings
- TPPT (Toxic Plants – Phytotoxin) database: "a multi-purpose, freely available database providing information on 844 poisonous plants and 1586 of their phytotoxins in Switzerland and Central Europe." XLS, last modified May 2023. Terms: "Open use. Must provide the source. Use for commercial purposes requires permission of the data owner." — [opendata.swiss TPPT](https://ckan.opendata.swiss/dataset/giftpflanzen-phytotoxin-datenbank)
- The BfR committee "Giftigkeit von Pflanzen" re-evaluated 251 plants using poison-centre data and classified severity for oral, dermal and ocular exposure in small children. This fed the Bundesanzeiger list "Liste besonders giftiger Gartenpflanzen und einheimischer Pflanzen in der freien Natur." — [BfR: Neubewertung von Giftpflanzen (PDF)](https://www.bfr.bund.de/cm/343/neubewertung-von-giftpflanzen.pdf)
- BfR brochure "Risiko Pflanze – Einschätzung und Hinweise" (2005). — [BfR PDF](https://www.bfr.bund.de/cm/350/risiko-pflanze-einschaetzung-und-hinweise.pdf)
- BfR on fungi: the death cap (Grüner Knollenblätterpilz) causes at least 80% of fatal mushroom poisonings in Germany. A 2026 press release covers confusion species. — [BfR Presseinformation 2026](https://www.bfr.bund.de/presseinformation/pilze-verwechslungen-koennen-toedlich-enden-2026/)
- Cornell Poisonous Plants and the Open Sanctuary Toxic Plant Database focus on livestock and are US-centric. — [Cornell](https://poisonousplants.ansci.cornell.edu/php/plants.php); [Open Sanctuary](https://opensanctuary.org/the-open-sanctuary-projects-global-toxic-plant-database/)
- Wikidata (CC0) has the fungus property P789 "edibility" ("whether a mushroom can be eaten or not"). — [Wikidata API](https://www.wikidata.org/w/api.php?action=wbgetentities&ids=P789&props=labels|descriptions&languages=en&format=json)

### Inferences
- Recommended approach: build an in-house toxicity table (toxic part, toxin group, severity class, human/pet relevance). Use BfR classes and the literature as references; facts are not copyrightable, but wholesale database copying is. Ask Agroscope for a TPPT commercial license, since it is the best structured seed.
- Edibility for apps carries liability. Wikidata P789 values are crowd-sourced and coarse, so do not rely on them for safety-critical text.

### Gaps
- No Wikidata property for plant toxicity by part or severity was confirmed.
- BfR's reuse terms for its lists were not checked. Official works in the Bundesanzeiger may be "amtliche Werke" (§5 UrhG), which is unverified.

## Fungi: FungalTraits, FunGuild, Mushroom Observer, DGfM, GBIF, Index Fungorum/MycoBank

### Takeaway
For fungi, the commercially usable open data are the DGfM German checklist on GBIF (CC BY 4.0, updated Oct 2026), Wikidata mushroom morphology properties (CC0), and Mushroom Observer images under CC BY-SA (default) or per-image licenses (NC ones excluded). FungalTraits (Põlme et al. 2020) is a genus-level guild table (e.g. ectomycorrhizal, saprotroph). Its data license was not verified, and the GitHub "fungaltraits" R package is a different project. Index Fungorum is non-commercial per its custodians.

### Cited Findings
- DGfM checklist on GBIF: "Taxon list of fungi and fungal-like organisms from Germany compiled by the DGfM" (Dämmrich; publisher SNSB IT Center). License CC BY 4.0, modified 2026-10-20, about 32,676 name usages, DOI 10.15468/gtvmjw. — [GBIF API dataset](https://api.gbif.org/v1/dataset/155b33d2-84b1-4a31-9287-9d9e900bc6c8); [GBIF](https://www.gbif.org/dataset/155b33d2-84b1-4a31-9287-9d9e900bc6c8)
- Wikidata (CC0) fungus morphology properties ("Mycomorphbox"): P783 hymenium type, P784 mushroom cap shape, P785 hymenium attachment, P786 stipe character (veil), P787 spore print color, P788 mushroom ecological type, P789 edibility. — [Wikidata API](https://www.wikidata.org/w/api.php?action=wbgetentities&ids=P783|P784|P785|P786|P787|P788|P789&props=labels|descriptions&languages=en&format=json)
- Mushroom Observer: "all images are made available under one of the Creative Commons licenses or are in the public domain." The default is CC-BY-SA ("MO's default license"), and users can choose other licenses per image. The code is MIT. — [MO intro](https://mushroomobserver.org/info/intro); [MO how to use](https://mushroomobserver.org/info/how_to_use)
- MO API v2: `https://mushroomobserver.org/api2/<table>` (observations, images, names, locations …). GET needs no key. Anonymous traffic is limited to 20 requests per minute, and nightly CSV dumps are recommended for bulk use. The API page states no data license. — [MO README_API](https://github.com/MushroomObserver/mushroom-observer/blob/main/README_API.md)
- FungalTraits: Põlme et al. 2020, "FungalTraits: a user-friendly traits database of fungi and fungus-like stramenopiles," Fungal Diversity. — [UP repository](https://repository.up.ac.za/handle/2263/80202); [NINA Brage](https://brage.nina.no/nina-xmlui/handle/11250/2724487)
- The GitHub `traitecoevo/fungaltraits` package (MIT for code) is "fungaltraits aka funfun," a different database by Flores-Moreno, Treseder, Cornwell et al. Do not confuse it with Põlme's FungalTraits. — [fungaltraits R manual](https://traitecoevo.r-universe.dev/fungaltraits/doc/manual.html)
- FUNGuild: the database is served from stbates.org (funguild_db_2.php) and is "continually updated" by third-party annotation. No license was found. — [MiscMetabar funguild.R](https://github.com/adrientaudiere/MiscMetabar/blob/HEAD/R/funguild.R); [FUNGuild paper record](https://experts.umn.edu/en/publications/funguild-an-open-annotation-tool-for-parsing-fungal-community-dat/)
- Index Fungorum custodians claim no IPR over the compilation; the resource is "free of any charge to the community on a non-commercial use basis." A third-party catalogue claims CC BY 4.0, which conflicts. — [Index Fungorum Partnership](https://www.indexfungorum.org/names/IndexFungorumPartnership.htm); conflicting: [marineinfo.org](https://marineinfo.org/doc/dataset/3176)
- re3data lists the MycoBank license as "Copyrights," with a REST search service. — [re3data MycoBank](https://www.re3data.org/repository/r3d100011222)

### Inferences
- Use the DGfM checklist (CC BY) or the GBIF backbone for German fungal names. GBIF occurrences (filter by license, CC0/CC BY only) give mushroom season: monthly observation histograms per species in Germany are a good open proxy for fruiting season. This is an inference; GBIF occurrence licensing is per dataset and has to be filtered.
- Mushroom morphology from Wikidata P783–P789 is CC0 but sparse and coarse. Expect gaps for many German species.
- Neither FungalTraits nor FUNGuild gives species-level host trees. Both are genus-level or guild-level.
- For MO images, only CC BY, CC BY-SA and CC0 are commercially usable. SA requires the derivative image to stay SA. Exclude NC-licensed images.

### Gaps
- FungalTraits data license (the Fungal Diversity article and supplementary table, likely CC BY if the article is OA) was not verified. The Springer page redirected to login.
- FUNGuild license: none found.
- DGfM Pilzkartierung occurrence data (pilze-deutschland.de) terms of use were not found. Only the checklist on GBIF is confirmed CC BY.
- MO observation-text license (descriptions and notes) is not stated on the API page.

## Mycorrhiza partners (fungus–tree): open datasets

### Takeaway
FungalRoot (plant mycorrhizal type per plant species, e.g. "Fagus = EcM") is on GBIF under CC BY-NC 4.0, so it is NOT commercially usable. GloBI aggregates interactions (including fungus–host records) with per-source licenses. I found no open, commercially licensed species-level dataset of "fungus X associates with tree Y" for Europe.

### Cited Findings
- GBIF dataset "Taxon occurrence data for the FungalRoot database": license CC BY-NC 4.0, record modified 2023-03-21. — [GBIF API](https://api.gbif.org/v1/dataset/744edc21-8dd2-474e-8a0b-b8c3d56a3c2d)
- FungalRoot contains 36,303 species-by-site observations for 14,870 plant species (Soudzilovskaia et al. 2020, New Phytologist). — [UvA DARE](https://dare.uva.nl/id/3491f4a0-4155-4a82-8705-1d19b808ef74)
- GloBI: "an open service providing open data using open source software" that "continuously scans existing data infrastructures." Each record carries its reference and dataset citation, and original contributors should be credited. — [GloBI about](https://www.globalbioticinteractions.org/about); [GloBI blog about](https://blog.globalbioticinteractions.org/about)
- Conflicting statements on the GloBI data license: one mirror says CC BY 4.0, while the 2014 founding paper favoured CC BY-NC-SA. In practice licenses follow the source datasets. — [ecosyste.ms GloBI](https://ost.ecosyste.ms/projects/560); [Poelen et al. 2014](https://core.ac.uk/display/81975585)
- Wikidata P788 "mushroom ecological type" (e.g. mycorrhizal or saprotrophic) is CC0. It gives the type but not the partner. — [Wikidata API](https://www.wikidata.org/w/api.php?action=wbgetentities&ids=P788&props=labels|descriptions&languages=en&format=json)

### Inferences
- Commercially, the app can derive "this fungus is ectomycorrhizal" from FungalTraits genus guilds or Wikidata P788. The specific tree partners ("Steinpilz mit Fichte, Buche, Kiefer, Eiche") have to be compiled by hand from field-guide knowledge and literature. Alternatively, filter GloBI records to those whose source license is CC0 or CC BY.

### Gaps
- The exact current GloBI data license policy was not retrieved (the official wiki page did not load).

## Gaps: data points with NO open (commercial-OK) source, to be researched manually

### Takeaway
Open and commercially usable today: EIVE (soil/light/moisture/nitrogen/temperature), TRY public CC BY (height, leaf traits, life form, seed mass), DWD phenology (flowering and fruiting dates, limited species), the WFO backbone (CC0), the DGfM checklist (CC BY), Wikidata fungal morphology and edibility (CC0, sparse), and GBIF CC0/CC BY occurrences (season proxy). Everything else is NC, unlicensed or missing.

### Cited Findings
- Open and commercial-OK sources and their licenses are listed in the sections above: [TRY](https://www.try-db.org/TryWeb/TRY_Intellectual_Property_Guidelines.pdf), [EIVE](https://zenodo.org/records/7534792), [DWD](https://opendata.dwd.de/climate_environment/CDC/Nutzungsbedingungen_German.pdf), [WFO](https://about.worldfloraonline.org/faqs), [DGfM on GBIF](https://www.gbif.org/dataset/155b33d2-84b1-4a31-9287-9d9e900bc6c8)
- Non-commercial or permission-required sources: FungalRoot (CC BY-NC), BIEN (CC BY-NC-ND per policy), TPPT (commercial use needs permission), Index Fungorum (non-commercial basis), and parts of PEP725 (CC BY-NC). — sources cited in the sections above

### Inferences
Data-point coverage matrix (my synthesis):
- **Flowering time:** partial. DWD covers a few indicator species. BiolFlor has all German species but is not open. Manual or curated compilation is needed for most species.
- **Fruiting time:** same as flowering. DWD wild has fruit-ripening phases for a few species.
- **Plant height, life form, leaf traits:** TRY CC BY (needs aggregation). Raunkiær life form is also in BiolFlor and PLANTATT (not open).
- **Ellenberg / EIVE (soil, light, moisture):** EIVE, CC BY. Fully covered.
- **Habitat:** no open German habitat-per-species dataset was verified. BiolFlor and FloraWeb have it but are not open. Manual work, or derive from EUNIS-linked vegetation data (not researched).
- **Max age of trees:** no open dataset found. MANUAL. Literature or forestry handbooks (and possibly TRY "plant lifespan," which I did not verify).
- **Toxicity (parts, severity):** no commercial-open source. MANUAL using BfR classes plus a TPPT license request.
- **Pollinators:** GloBI (per-source licenses) and FloraWeb (not open). Mostly MANUAL or GloBI-filtered.
- **Mycorrhiza partners:** FungalRoot is NC. Partner species are MANUAL.
- **Mushroom season:** derive from GBIF CC0/CC BY occurrence months. Feasible.
- **Mushroom morphology:** Wikidata P783–P787 (sparse). Mostly MANUAL.
- **Edibility and toxicity of fungi:** Wikidata P789 (coarse, crowd-sourced). MANUAL expert review is required for liability reasons.
- **Look-alike (confusion) species:** no open structured dataset found. MANUAL.
- **Protection status:** legal status (BArtSchV/BNatSchG, FFH annexes) is statutory and can be compiled. The national Rote Liste (BfN/Rheinwerk) license was not verified. MANUAL compilation.

### Gaps
- Not researched: EU-level habitat or vegetation-plot data (EVA, sPlot), and the Rote Liste Zentrum data license. Both are worth a follow-up for the habitat and protection-status fields.
- Unmaintained or stale sources flagged: PLANTATT (last updated 2008), LEDA (circa 2008), BiolFlor (prototype after migration, earlier offline), and EIVE 1.0 (2023, no update).

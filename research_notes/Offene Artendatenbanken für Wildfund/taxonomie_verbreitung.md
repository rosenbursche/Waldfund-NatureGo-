# Offene Artendatenbanken für Taxonomie, Namen und Verbreitung (Wildfund)

Research date: 2026-10-24. Method: live API calls (api.gbif.org, api.checklistbank.org), fetches of official pages where reachable, and web search. **Caveat:** gbif.org (Cloudflare), powo.science.kew.org, iucnredlist.org and parts of ebird.org blocked automated fetching. Where a quote comes from a search snippet or a secondary source rather than a page I fetched myself, it is marked "(snippet)" or "(secondary)". Every license statement for production use should be re-checked by hand in a browser.

## 1. GBIF: backbone, Species API, occurrence downloads, maps and cubes

### Takeaway
GBIF is the core free source for per-country presence and grid maps. **Big change in 2026:** GBIF switched its default taxonomy from the frozen GBIF Backbone (last updated 2023) to the **Catalogue of Life Extended Release (COL XR, CC BY 4.0)**. For a commercial app, the main legal limit is that **about 28% of German occurrence records are CC BY-NC**. Downloads therefore have to be filtered to CC0 and CC BY, and each download's DOI has to be cited. The most efficient way to get per-country and grid presence for 20,000+ species is **one or a few SQL "cube" downloads** that aggregate species × country × grid cell (EEA 1/10 km, ISEA3H, MGRS, EQDG), filtered by license.

### Cited Findings
**Backbone / taxonomy**
- GBIF data blog, 24 June 2026: "Recently GBIF.org has updated the default taxonomy it uses to organize occurrence records to the Catalogue of Life Extended Release (COL XR). The GBIF backbone was last updated in 2023, and will not be updated again. We encourage users of our APIs to migrate towards using the COL XR, namely by switching the checklistKey parameter to checklistKey=7ddf754f-d193-4cc9-b351-99906754a03b." — [GBIF Discourse / Data Blog](https://discourse.gbif.org/t/how-to-migrate-from-the-legacy-gbif-backbone-taxonomy-to-catalogue-of-life-extended-release-gbif-data-blog/6398) (original: https://data-blog.gbif.org/post/catalogue-of-life-taxonomic-backbone/)
- rgbif 3.9.0 and pygbif 0.7.0 bring "potentially breaking changes" because the default taxonomy moved to COL XR (secondary, LinkedIn post by a GBIF staff member) — [search result](https://dk.linkedin.com/in/marie-grosjean). A Discourse topic "Preparing for rgbif v3.9.0 Moving to COL Extended Release" is dated 20 Aug 2026 — [GBIF Discourse](https://discourse.gbif.org/t/how-to-migrate-from-the-legacy-gbif-backbone-taxonomy-to-catalogue-of-life-extended-release-gbif-data-blog/6398)
- Legacy GBIF Backbone (dataset d7dddbf4-…, DOI 10.15468/39omei): API metadata gives license `CC BY 4.0`, pubDate 2023-08-28. Its description says it is "updated regularly through an automated process in which the Catalogue of Life acts as a starting point", adds names from 105 sources plus iBOL BINs and UNITE SHs, and is "available for download at https://hosted-datasets.gbif.org/datasets/backbone/ in different formats together with an archive of all previous versions." — [GBIF API dataset record](https://api.gbif.org/v1/dataset/d7dddbf4-2cf0-4f39-9b2a-bb099caae36c)
- The hosted download directory lists versions from 2009-09-01 to 2023-08-28; `current/` = 2023-08-28. Nothing newer exists, which confirms the freeze — [hosted-datasets.gbif.org/datasets/backbone/](https://hosted-datasets.gbif.org/datasets/backbone/)
- The COL XR dataset as registered in GBIF (key 7ddf754f-…): license `CC BY 4.0`, modified 2026-09-21, DOI 10.48580/dgyy9 — [GBIF API](https://api.gbif.org/v1/dataset/7ddf754f-d193-4cc9-b351-99906754a03b)
- Secondary claim: the switch took effect on 23 June 2026, and GBIF taxon IDs now match COL IDs (e.g. lion = 4CGXP). The same source says GBIF runs a single COL release, so it may lag behind the newest COL. Unverified from an official source — [packagist omnilab/gbif README](https://packagist.org/packages/omnilab/gbif)

**Species API (vernacular names, distributions)**
- `GET /v1/species/{key}/vernacularNames` returns aggregated names with language and source. Example for *Panthera leo* (5219404): "Afrikanischer Löwe" (deu, source Catalogue of Life) and "Afrikanischer Löwe" (deu, country DE, source "Taxon list of animals with German names (worldwide) compiled at the SMNS") — [GBIF API](https://api.gbif.org/v1/species/5219404/vernacularNames?limit=5)
- `GET /v1/species/{key}/distributions` returns locality, status and threatStatus from sources such as ITIS, COL and the IUCN Red List (e.g. "Global … threatStatus VULNERABLE, source The IUCN Red List"). Localities are coarse and heterogeneous ("Africa", "Southern Asia"), not per-country ISO codes — [GBIF API](https://api.gbif.org/v1/species/5219404/distributions?limit=5)

**Occurrence licenses and citation**
- Germany (country=DE): 83,835,007 occurrences. By license: CC BY 4.0 = 56,291,802 (67%), CC BY-NC 4.0 = 23,128,382 (28%), CC0 = 4,414,823 (5%). Live facet query on 2026-10-24 — [GBIF API](https://api.gbif.org/v1/occurrence/search?country=DE&limit=0&facet=license)
- GBIF Data User Agreement (snippet): users "must publicly acknowledge … the Data Publishers whose biodiversity data they have used, where appropriate through use of a Digital Object Identifier (DOI) applying to the dataset(s) and/or data downloads"; "licences selected by the Data Publisher shall prevail" — [GBIF data user agreement](https://tools.gbif.org/terms/data-user), [gbif.org/terms](https://www.gbif.org/terms)
- GBIF on CC BY-NC (snippet): data "are made available for any use provided that attribution is appropriately given and provided the use is not for commercial purposes". GBIF "has neither the interest nor the resources to enforce CC BY-NC", but publishers may take legal action — [GBIF terms / citation guidelines](https://www.gbif.org/citation-guidelines)
- Derived datasets: you can register a "derived dataset" with its own DOI, listing the source datasets (by DOI or datasetKey) and their record counts. This is the standard way to cite filtered or aggregated data used in a product (snippet) — [GBIF citation guidelines](https://www.gbif.org/citation-guidelines)
- The citation rules also apply to data pulled via rgbif and pygbif (snippet) — [GBIF citation guidelines](https://www.gbif.org/citation-guidelines)

**SQL downloads and species occurrence cubes**
- "This is an experimental feature, and the implementation may change throughout 2025. The experimental Occurrence SQL Download API allows users to query GBIF occurrences using SQL … allows selection of the columns of interest and generation of summary views of GBIF data." Requires a GBIF.org account. "HTTP/… 403 … means your username does not have permission to use this prototype feature — contact helpdesk@gbif.org". Output format: `SQL_TSV_ZIP`. Submitted at `https://api.gbif.org/v1/occurrence/download/request` — [GBIF TechDocs: API SQL Downloads](https://techdocs.gbif.org/en/data-use/api-sql-downloads)
- Gridding functions available in SQL: `GBIF_EEARGCode`, `GBIF_EuroStatCode`, `GBIF_EQDGCode`, `GBIF_MGRSCode`, `GBIF_ISEA3HCode`, `GBIF_DMSGCode`. The occurrence table has a `license` column, so you can filter with WHERE license IN (CC0, CC BY) — [GBIF TechDocs: API SQL Downloads](https://techdocs.gbif.org/en/data-use/api-sql-downloads)
- Cube recipe: species × year-month × 1 km EEA Reference Grid. It uses `GBIF_EEARGCode(1000, decimalLatitude, decimalLongitude, COALESCE(coordinateUncertaintyInMeters, 1000))`, randomizes points within their uncertainty, and excludes records without coordinates or with uncertainty above 1000 m. "The GBIF website allows users to create species occurrence cubes by using the 'Cube' download option" — [GBIF TechDocs: Species occurrence cubes](https://techdocs.gbif.org/en/data-use/data-cubes)
- Grid functions were built for the B-Cubed cubes. Set randomization to 0 if you don't want it — [rOpenSci rgbif SQL downloads vignette](https://docs.ropensci.org/rgbif/articles/gbif_sql_downloads.html)
- Ready-made example: INBO "Occurrence cubes for non-native taxa in Belgium and Europe" (species × year × 1 km EEA cell) on Zenodo — [Zenodo 3637911](https://zenodo.org/records/3637911)
- Cubes can also be generated on Azure Databricks from the GBIF cloud snapshots — [GBIF TechDocs Databricks](https://techdocs.gbif.org/en/data-use/b-cubed/generate-cube-databricks)

**Maps API**
- `https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?taxonKey=…&bin=hex` returns PNG tiles (HTTP 200 tested). A `capabilities.json` endpoint gives extent, year range and total for taxonKey+country. Example: taxonKey=2435099, country=DE → total 2, years 2009–2017 — [GBIF maps API test](https://api.gbif.org/v2/map/occurrence/density/capabilities.json?taxonKey=2435099&country=DE)

### Inferences
- **Per-country presence for 20,000+ species:** one SQL download like `SELECT speciesKey, countryCode, COUNT(*), MIN(year), MAX(year) FROM occurrence WHERE license IN ('CC0_1_0','CC_BY_4_0') AND occurrenceStatus='PRESENT' AND hasGeospatialIssues=false AND kingdom/class IN (…) AND continent='EUROPE' GROUP BY speciesKey, countryCode` gives the whole country matrix in one file, instead of more than 20,000 API calls. A second query with `GBIF_EEARGCode(10000, …)` (10 km) or `GBIF_ISEA3HCode` gives grid presence. Re-run monthly or quarterly. Each run creates a DOI to cite in the app's credits. Whether a cube honours the license filter should be tested once.
- The GBIF Maps API is convenient for display, but tiles **cannot be filtered by license** as far as I know (not verified this session). Commercial display of tiles that include CC BY-NC records is a grey zone. Self-generated cubes are cleaner.
- Raw GBIF data has known biases (coordinate errors, captive/garden records, outdated data). Filter on `basisOfRecord`, `establishmentMeans`, `coordinateUncertainty` and the issue flags.
- For taxonomy, use **COL XR IDs** from now on, not legacy GBIF backbone keys. The legacy backbone is frozen at 2023.

### Gaps
- No primary GBIF page confirming whether the SQL API still needs manual permission ("prototype") in late 2026; the docs text still says "throughout 2025".
- Not verified whether `/v1/species/...` vernacular and distribution endpoints now point at COL XR or still at the legacy backbone. A v2 species API may exist.
- Not verified whether a derived dataset that mixes CC BY sources can be relicensed. Under CC BY, attribution to each publisher is required (via the download DOI).

## 2. Catalogue of Life / ChecklistBank, NCBI Taxonomy, Wikidata

### Takeaway
**COL (CC BY 4.0) is the recommended taxonomic backbone.** It updates monthly, covers about 2.3M species with an XR version, is now also the GBIF default, and has free downloads via ChecklistBank. **Wikidata (CC0)** is the best free source for multilingual common names (DE/EN and all others) and cross-IDs, and ChecklistBank publishes a "Wikidata Species" export. **WFO Plant List is on ChecklistBank as CC0.** NCBI is useful only for DNA-related needs.

### Cited Findings
- COL Base Release, October 2026: ChecklistBank alias "COL26.10", issued 2026-10-14, DOI 10.48580/dgzh4, 5,466,019 name records, license "cc by". Description: "it probably includes just over 80% of the world's known species … estimates 2.3M extant species"; 95 checklists updated in October 2026 (incl. ITIS, WoRMS, FishBase) — [ChecklistBank API dataset 3LR](https://api.checklistbank.org/dataset/3LR)
- COL website footer: current XR "Version 2026-10-16 XR … DOI: 10.48580/dgzlf ChecklistBank: 316691"; "Unless otherwise indicated, all other content offered under Creative Commons Attribution 4.0 International License". Disclaimer: COL "cannot guarantee the accuracy or completeness … still incomplete and undoubtedly contains errors" — [catalogueoflife.org/about/licensing](https://www.catalogueoflife.org/about/licensing)
- XR = Base Release plus programmatically merged extra sources. Base Release "published monthly and annually" — [GBIF API COL XR record](https://api.gbif.org/v1/dataset/7ddf754f-d193-4cc9-b351-99906754a03b)
- COL download page lists Extended and Base releases (formats ColDP, DwC-A, TextTree via ChecklistBank) — [COL data download](https://www.catalogueoflife.org/data/download)
- Required citation format: "Bánki, O., Roskov, Y., … (2026). Catalogue of Life (Version 2026-10-14). Catalogue of Life Foundation, Amsterdam, Netherlands. https://doi.org/10.48580/dgzh4" — [ChecklistBank API](https://api.checklistbank.org/dataset/3LR)
- ChecklistBank also hosts: "Wikidata Species" (key 314569, cc0, 2026-08-02, 3,962,614 records); "NCBI Taxonomy" (key 2169, listed as cc by, 2026-04-17, 3,168,355 records); "World Flora Online Plant List 2026-06" (key 2004, cc0, 1,663,770 records); German Red List vascular plants 2018 (key 315075, cc by, 5,312 records) — [ChecklistBank API search](https://api.checklistbank.org/dataset?q=Wikidata&limit=4)
- Wikidata: data in the main, Property, Lexeme and EntitySchema namespaces "is released into the public domain under Creative Commons Zero"; "All data in Wikidata has a CC0 license" — [Wikidata:Licensing](https://www.wikidata.org/wiki/Wikidata:Licensing)
- Wikidata Query Service: "The runtime of the query on the public endpoint is limited to 60 seconds." Blazegraph "is not actively developed, it is planned to migrate Wikidata Query Service to another triplestore" — [WDQS User Manual](https://www.mediawiki.org/wiki/Wikidata_Query_Service/User_Manual)
- NCBI website policy says only that users must check the copyright of linked pages. I found no explicit data license on the fetched page — [NCBI policies](https://www.ncbi.nlm.nih.gov/home/about/policies/)

### Inferences
- COL CC BY 4.0 allows commercial use with attribution. Show the COL citation and version in the app's "Quellen/Credits" screen. No share-alike.
- Wikidata CC0 means common names (`P1843` taxon common name, plus labels in `de` and `en`) can be cloned without obligations. For 20,000+ taxa, use the weekly JSON dumps (dumps.wikimedia.org) or the ChecklistBank "Wikidata Species" export rather than SPARQL, because of the 60 s timeout. Quality of German names is mixed: labels are sometimes scientific names, and there may be several or uncurated names. Cross-check against curated lists, e.g. the SMNS German animal names list in GBIF, which is CC-licensed and needs checking.
- Wikidata also gives IDs (GBIF, COL, iNaturalist, EOL, POWO, Euro+Med, IUCN) for joining sources. Images linked via Commons have their own (often CC BY-SA) licenses.
- NCBI Taxonomy is not needed for an app backbone. Its names are oriented to sequences and it has no distribution data.

### Gaps
- NCBI's official reuse statement was not quoted; ChecklistBank's "cc by" label is CLB's metadata. NCBI data is generally regarded as without restrictions (US government work). Unverified.
- Exact current Wikidata dump frequency and size were not checked this session (historically weekly full JSON dumps).

## 3. Plants: POWO/WCVP, Euro+Med PlantBase, World Flora Online

### Takeaway
**WCVP (Kew) is the best free source for plant native/introduced status per TDWG region (CC BY 4.0 on GBIF).** It is updated continuously and can be downloaded as a zip. The TDWG level 3 regions roughly match countries (Germany = "GER"). WFO Plant List (CC0) is an alternative taxonomic list. Euro+Med is the most detailed European source, but its license is unclear.

### Cited Findings
- WCVP on GBIF (key f382f0ce-…): license CC BY 4.0, modified 2026-06-10; citation "Govaerts R (2026). The World Checklist of Vascular Plants (WCVP). Royal Botanic Gardens, Kew. Checklist dataset https://doi.org/10.15468/6h8ucr". Description: "a global consensus view of all known vascular plant species … built on the nomenclatural data provided by the International Plant Names Index (IPNI)" — [GBIF API WCVP](https://api.gbif.org/v1/dataset/f382f0ce-323a-4091-bb9f-add557f3a9a2)
- Bulk download: http://sftp.kew.org/pub/data-repositories/WCVP/wcvp.zip. Version 15 (2026), DOI 10.34885/nswv-8994 (secondary, R package metadata) — [wcvpdata R package](https://paulesantos.r-universe.dev/wcvpdata/doc/manual.html); data paper Govaerts et al. 2021, Sci Data 8:215, doi:10.1038/s41597-021-00997-6 — [PMC8363670](https://pmc.ncbi.nlm.nih.gov/articles/PMC8363670)
- The distribution table has an `introduced` field (0 = native, 1 = introduced) per TDWG WGSRPD area. Kew: "all data and downloads are standardised using standards set out by … (TDWG)". The WCVP database "is updated daily" and refreshed on POWO weekly (snippet) — [Kew About WCVP](https://powo.science.kew.org/about-wcvp), [wcvpdata manual](https://paulesantos.r-universe.dev/wcvpdata/doc/manual.html)
- WFO website: "Unless otherwise noted, text and images are licenced: CC BY 4.0"; citation "WFO (2026): World Flora Online" — [worldfloraonline.org/about](https://www.worldfloraonline.org/about). WFO Plant List 2026-06 on ChecklistBank: CC0, 1,663,770 records — [ChecklistBank](https://api.checklistbank.org/dataset?q=World%20Flora%20Online&limit=4)
- Euro+Med PlantBase: the GBIF "Euro+Med PlantBase data sample" has license "unspecified", last modified 2017-11-17, and "is an incomplete representation" — [GBIF API](https://api.gbif.org/v1/dataset/1c1f2cfc-8370-414f-9202-9f00ccf51413). Euro+Med Notulae papers are on ChecklistBank as CC0 — [ChecklistBank](https://api.checklistbank.org/dataset?q=Euro%2BMed&limit=4). Euro+Med "provides free access to a complete checklist of the European and the Mediterranean Flora" (snippet) — [Bocconea PDF](https://herbmedit.org/storage/2881/Bocc28_271-272.pdf)

### Inferences
- For "Stufe A" plants: WCVP gives accepted names, synonyms and native/introduced status for each TDWG L3 region (most European countries ≈ one region; some are merged, e.g. Belgium+Luxembourg = BGM). CC BY 4.0 means commercial use is OK with the Kew citation.
- Trees are a subset of vascular plants; a growth-form/lifeform field (`lifeform_description`) exists in WCVP.
- Euro+Med (finer European regions, more accurate status) should be used only after getting written permission from BGBM Berlin.

### Gaps
- The POWO terms page (powo.science.kew.org/terms-and-conditions) could not be fetched (403). The license of POWO **website content and images** (as distinct from WCVP data) is unverified; it is reportedly more restrictive for images.
- The Euro+Med PlantBase database license was not found. It needs to be confirmed with the Secretariat (BGBM).

## 4. Invasive and introduced species: GRIIS, EASIN, GBIF checklists

### Takeaway
**GRIIS country checklists (CC BY 4.0, on GBIF) cover introduced and invasive status per country**, including Germany, which was updated in March 2026. EASIN is the authoritative EU catalogue (15,751 species) and covers the EU list of invasive alien species (Union list), but its data license is not clearly stated.

### Cited Findings
- "Global Register of Introduced and Invasive Species - Germany", publisher ISSG, CHECKLIST, license CC BY 4.0, modified 2026-03-26, key 2a281675-c184-4d54-a47e-5d3a7ec6653f. Other GRIIS country lists are also CC BY 4.0 (e.g. Egypt 2026-08-10, Cuba 2026-07-01) — [GBIF dataset search API](https://api.gbif.org/v1/dataset/search?q=GRIIS%20Germany)
- EASIN homepage: "15751 Species Catalogue - 16/5/2026; 168294047 Species Observations - 16/10/2026; 42 Data Partners". Offers web services (pre-generated catalogue query URLs, geospatial API) and an "IAS in Europe App" — [EASIN](https://easin.jrc.ec.europa.eu/easin/Home)
- EASIN: "web tools can be utilized freely and independently by any website, while ownership of the data remains with its source, which is properly cited and linked" (JRC publication, snippet) — [JRC publication](https://publications.jrc.ec.europa.eu/repository/handle/JRC71705). The general Commission reuse policy (Decision 2011/833/EU) is CC BY 4.0 unless otherwise noted (snippet, not EASIN-specific) — [JRC page](https://science-art-society.ec.europa.eu/resonances-iv/catalogue)

### Inferences
- Use GRIIS per country for the native/introduced/invasive flag (fields: isInvasive, establishmentMeans/occurrenceStatus), plus WCVP for plants. Use EASIN only to tag the EU Union list (about 88 species, a small and public legal list). That can be maintained by hand from the Implementing Regulation text, which is EU law and free to reuse.
- North America: GRIIS lists for USA and Canada exist on GBIF (the same series). Their individual licenses were not checked.

### Gaps
- No explicit EASIN data license found, and the EASIN legal notice was not fetched. The current length of the Union list in 2026 was not verified.

## 5. Distribution maps: EEA Art. 17 and Art. 12, Map of Life, eBird S&T, BirdLife, IUCN

### Takeaway
For a commercial app, **only the EEA Article 17 and 12 10 km grids are likely to be freely usable**. They cover only Habitats Directive species and EU birds; sensitive species are removed, and the EEA license is not verified this session. **Map of Life (CC BY-NC), eBird Status & Trends (commercial use needs separate permission), BirdLife (commercial use only via IBAT) and IUCN (no commercial use or redistribution without permission) are all off-limits for commercial use without a paid license.**

### Cited Findings
- EEA Art. 17 (2013–2018) public version: "spatial dataset contains habitat and species distribution data (10km grid cells) as reported by Member States … public dataset, without sensitive species" (snippet) — [EEA metadata via Ifremer GeoNetwork](https://sextant.ifremer.fr/geonetwork/srv/api/records/9f71b3e3-f8ec-442b-a2d5-c3c190605ac4); EEA ArcGIS REST service "ART17_habitats_species_distribution_collection" — [bio.discomap.eea.europa.eu](https://bio.discomap.eea.europa.eu/arcgis/rest/services/Article17/ART17_habitats_species_distribution_collection/MapServer/info/iteminfo); rasterized EBV version, DOI 10.25829/2e2t47 (Viti & Quoß 2024) — [GEO BON portal](https://portal.geobon.org/ebv-detail?id=76)
- EEA Art. 12 birds (2013–2018): "gridded birds distribution data (10 km grid cells) as reported by EU Member States" (snippet) — [LifeWatch metadata](https://metadatacatalogue.lifewatch.eu/srv/api/records/010fb83b-de19-437b-865e-ed27ea7d0931); 2008–2012 version — [EEA SDI catalogue](https://sdi.eea.europa.eu/catalogue/srv/api/records/7c2dd14f-60b6-4009-aca8-5d20300479a9). National example, Ireland: "licensed for re-use under the Creative Commons Attribution 4.0 International licence" — [data.gov.ie](https://data.gov.ie/dataset/article-12-birds-directive-reporting-2013-2018-dataset-series)
- Some national Art. 17 and 12 data is on GBIF under CC BY 4.0 (e.g. Portugal ICNF "Birds Distribution from the Birds Directive (2013-2018)"; Natural Resources Wales). In total, 204 GBIF datasets match "Article 17 Habitats Directive" — [GBIF dataset search API](https://api.gbif.org/v1/dataset/search?q=Article%2017%20Habitats%20Directive)
- **eBird Status & Trends** (Terms of 30 Oct 2023): "In general, permissions for non-commercial uses are granted expeditiously upon acceptance of the Terms. Use for Commercial Purposes is not covered in these Terms, and require separate permission, which may be requested at ebird@cornell.edu." Commercial use is defined as "Any use by or on behalf of … a commercial entity … These uses include but are not limited to printed or online materials, bird guides, … commercial data provision, and redistributed Modified eBird Status and Trends Data Products." — [eBird S&T Terms of Use](https://ebird.org/about/products-access-terms-of-use)
- Raw eBird data: "freely available for non-commercial use" (snippet) — [eBird Data Access Terms](https://www.birds.cornell.edu/home/ebird-data-access-terms-of-use)
- **BirdLife DataZone**: "For commercial use, please access these data via the Integrated Biodiversity Assessment Tool. For non-commercial use, please complete the form below to request data." — [BirdLife DataZone request data](https://datazone.birdlife.org/contact-us/request-our-data)
- **IUCN Red List** (secondary quote of the terms): "Neither (a) IUCN Red List Data nor (b) any work derived from or based upon IUCN Red List Data … may be put to Commercial Use without the prior written permission of IUCN" — [Open Development Mekong dataset page](https://data.opendevelopmentmekong.net/vi/dataset/iucn-red-list-for-the-lower-mekong-2015); ranges are "made freely available … for non-commercial use", and commercial use goes via IBAT — [ScienceBase](https://www.sciencebase.gov/catalog/item/553a7ac3e4b0a658d792c982); restrictions "no commercial use … no reposting, sub-licensing and/or redistributing" — [UN-REDD training PDF](https://un-redd.org/sites/default/files/2021-09/Intro_to_species_mapping.pdf)
- **Map of Life**: ToS effective 1 Jan 2025: "all data, maps, content, and materials on this website are provided under the Creative Commons Attribution–NonCommercial 4.0 International License (CC BY-NC 4.0) unless otherwise noted". It also prohibits automated bulk downloading unless authorized (snippet) — [Map of Life ToS](https://mapoflife.ai/policies/tos-mol)

### Inferences
- Bird and mammal grid maps for a commercial app: build them from **GBIF CC0 and CC BY cubes** at 10 km EEA grid, plus EEA Art. 12 (birds, all EU breeding species) and Art. 17 (Annex II/IV/V mammals, plants and others) where licensed. IUCN, BirdLife, eBird and Map of Life only after a paid license (IBAT for Business pricing applies).
- The IUCN Red List category per species is visible in the GBIF distributions endpoint, but its use there still falls under IUCN terms. Showing the threat category in a commercial app may need permission (it is a "derivative" use). Alternative: national Red Lists (e.g. Rote Liste Gefäßpflanzen DE 2018, CC BY on ChecklistBank).

### Gaps
- The EEA license for the Art. 17 and 12 grid downloads was not confirmed this session; the EEA catalogue API returned no parsable JSON. The EEA has a general reuse policy (reportedly reuse permitted with source acknowledgement, often CC BY 4.0), but it is unverified here. The 2019–2024 (Art. 17) and 2019–2024 (Art. 12, reported 2025) data releases were not found. They may be published in 2026, which should be checked on the EEA Datahub / Eionet.
- The primary IUCN terms page (iucnredlist.org/terms) could not be fetched; the wording above is secondary.
- BirdLife and eBird North American coverage: eBird S&T is strong for North America but non-commercial without separate permission.

## 6. Germany specifically: FloraWeb / Deutschlandflora, Rote-Liste-Zentrum, TK25 grids

### Takeaway
The main German plant distribution source on TK25 (quadrant) grids, **"Flora von Deutschland (Phanerogamen)" from BfN/NetPhyD, is on GBIF but licensed CC BY-NC 4.0, so it is NOT commercially usable** without permission. The German Red List of vascular plants (2018) is available as CC BY on ChecklistBank.

### Cited Findings
- "Flora von Deutschland (Phanerogamen)", publisher "Bundesamt für Naturschutz / Netzwerk Phytodiversität Deutschland", license CC BY-NC 4.0, modified 2025-11-19, 9,283,055 occurrence records. Description: "Verbreitung der Farn- und Bluetenpflanzen in Deutschland, Vorkommensnachweise aggregiert auf Quadranten der Topographischen Karte 1 : 25000 (TK25 = MTB), sowie in Zeitperioden <1950 - 1980>" — [GBIF API dataset e6fab7b3](https://api.gbif.org/v1/dataset/e6fab7b3-c733-40b9-8df3-2a03e49532c1)
- VegetWeb (vegetation relevés, BfN/NetPhyD), also CC BY-NC 4.0 — [GBIF dataset search](https://api.gbif.org/v1/dataset/search?q=TK25)
- "Red List Vascular Plants (2018, Germany) - Rote Liste Gefässpflanzen (2018, Deutschland)", ChecklistBank key 315075, cc by, 5,312 records — [ChecklistBank API](https://api.checklistbank.org/dataset?q=Rote%20Liste&limit=4)
- The FloraWeb imprint fetched contains only liability and legal-notice text; I found no data reuse license there — [FloraWeb Impressum](https://www.floraweb.de/impressum.html)

### Inferences
- For a commercial German plant map, either ask BfN/NetPhyD for a license for the TK25 data (Deutschlandflora), or build your own maps from GBIF CC0/CC BY records (e.g. iNaturalist research-grade CC BY, observation.org) gridded to TK25 quadrants or EEA 10 km. WCVP gives only "present in Germany: native/introduced".
- Since 28% of German GBIF records are CC BY-NC, a license filter is essential. The BfN TK25 dataset alone accounts for about 9.3M of those 23M NC records.

### Gaps
- Rote-Liste-Zentrum (rote-liste-zentrum.de) distribution and status data terms were not checked. Mammals/birds atlases (e.g. ADEBAR / DDA) are not openly licensed as far as known, but this is unverified.
- The FloraWeb/Deutschlandflora website terms for maps and data were not found.

## 7. Practical "Stufe A" combination (free, commercially usable)

### Takeaway
A legally clean, commercially usable backbone for European mammals, birds, vascular plants, trees and macrofungi is: **COL XR (taxonomy, CC BY) + Wikidata (DE/EN common names and cross-IDs, CC0) + WCVP (plant native/introduced per TDWG region, CC BY) + GRIIS (introduced/invasive per country, CC BY) + GBIF SQL cubes filtered to CC0/CC BY (country presence and 10 km EEA / ISEA3H grid), cited via download DOI + EEA Art. 12/17 grids (after verifying the license)**. Avoid IUCN, BirdLife, eBird S&T, Map of Life, BfN TK25 data and CC BY-NC GBIF records unless separately licensed.

### Cited Findings
- COL is CC BY 4.0, monthly releases — [ChecklistBank](https://api.checklistbank.org/dataset/3LR); GBIF default since 2026 — [GBIF Data Blog](https://discourse.gbif.org/t/how-to-migrate-from-the-legacy-gbif-backbone-taxonomy-to-catalogue-of-life-extended-release-gbif-data-blog/6398)
- Wikidata is CC0 — [Wikidata:Licensing](https://www.wikidata.org/wiki/Wikidata:Licensing)
- WCVP is CC BY 4.0 — [GBIF API](https://api.gbif.org/v1/dataset/f382f0ce-323a-4091-bb9f-add557f3a9a2)
- GRIIS Germany is CC BY 4.0 — [GBIF API](https://api.gbif.org/v1/dataset/search?q=GRIIS%20Germany)
- GBIF SQL grid functions and the license column — [GBIF TechDocs](https://techdocs.gbif.org/en/data-use/api-sql-downloads)
- Non-commercial restrictions: eBird — [Terms](https://ebird.org/about/products-access-terms-of-use); BirdLife — [DataZone](https://datazone.birdlife.org/contact-us/request-our-data); Map of Life — [ToS](https://mapoflife.ai/policies/tos-mol); BfN TK25 — [GBIF](https://api.gbif.org/v1/dataset/e6fab7b3-c733-40b9-8df3-2a03e49532c1)

### Inferences
- **Obligations:** CC BY means attribution, with no share-alike. Put a credits page in the app listing COL (version and DOI), Kew WCVP (DOI), GRIIS/ISSG, each GBIF download DOI (or a GBIF derived-dataset DOI), and EEA. Wikidata (CC0) needs no attribution, though it is good practice.
- **Macrofungi:** COL XR covers fungi (Species Fungorum/IF is a COL source); GBIF has strong European fungi data (e.g. Danish and Dutch fungal atlases, licenses per dataset). There is no WCVP-like native/introduced status for fungi; GRIIS covers a few.
- **North America:** COL and Wikidata are global; WCVP covers North America at TDWG L3 (US states and Canadian provinces); GBIF cubes work globally with ISEA3H or EQDG instead of the EEA grid; GRIIS has USA and Canada lists. eBird S&T would be the best bird abundance product there but needs a commercial license.
- **Effort:** COL ColDP download (about 1–2 GB) and a monthly diff; WCVP zip (about 100 MB); Wikidata via ChecklistBank export or a filtered dump; 2–4 GBIF SQL downloads per quarter. All bulk, no rate-limit problems.

### Gaps
- GBIF data quality per species for grid presence (false positives from captive or garden plants) needs empirical testing. Filter with `establishmentMeans`, `degreeOfEstablishment` and `basisOfRecord`.
- No source quantifies German and English common-name coverage in Wikidata for European species; worth measuring with one SPARQL/dump pass.

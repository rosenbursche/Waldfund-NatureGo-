# Open trait and ecology databases for animals (Wildfund species profiles)

Research date: 2026-10-24. About 25 search and fetch calls. Several official license pages could not be fetched: eol.org and media.eol.org returned HTTP 403, figshare returned 403, and the Wikidata property page returned 404. Licenses that could not be verified from the primary page are marked **UNVERIFIED** and listed under Gaps.

## EOL (Encyclopedia of Life): TraitBank, text and media, licenses, dumps, maintenance

### Takeaway
EOL is an aggregator. All of its content is public domain or under a Creative Commons license, but the licenses are mixed and include NC variants, so each record or media item has to be filtered by its own license field before commercial use. There is a full TraitBank dump (about 592 MB of CSV on Zenodo, last updated Feb 2024). I found no evidence of a 2025/2026 release, so treat EOL as maintained only at low intensity.

### Cited Findings
- EOL terms: "all materials in EOL are either in the public domain or licensed under a Creative Commons license"; contributed information must be shared "under at least one of the creative commons licenses that allow re-use"; reuse through data services falls under a separate API Terms of Use. — [EOL Terms of Use (search snippet; the page itself returned 403)](https://media.eol.org/info/terms_of_use)
- The TraitBank full dump "All trait data" is a zip of all trait records in EOL's graph database. It holds 5 CSV files (traits.csv, inferred.csv, …), is about 592 MB, was created in 2019 and was last updated February 2024. The record points to the EOL Services forum for large aggregate files. No license was shown in the captured metadata. — [Zenodo 13305577](https://zenodo.org/records/13305577)
- "Most TraitBank data can be used and redistributed without copyright restrictions, while some datasets are under a Creative Commons Attribution license" (2015 paper). — [Parr et al., Semantic Web Journal](https://www.semantic-web-journal.net/content/traitbank-practical-semantics-organism-attribute-data-2)
- TraitBank pages exist on api.eol.org and media.eol.org, and TraitBank content "comes with detailed attribution data". — [api.eol.org/traitbank](https://api.eol.org/traitbank); [media.eol.org/traitbank](https://media.eol.org/traitbank)
- EOL ingests the trait datasets themselves, for example PanTHERIA as EOL resource 173. — [api.eol.org/resources/173](https://api.eol.org/resources/173)
- The GEO BON tool catalogue gives eol.org/docs/what-is-eol/terms-of-use as TraitBank's license reference. — [GEO BON](https://boninabox.geobon.org/tool-detail?id=150)
- I found no 2026 news on EOL funding or development. Wikipedia lists the site as "Active". — [Wikipedia: Encyclopedia of Life](https://en.wikipedia.org/wiki/Encyclopedia_of_Life)

### Inferences
- EOL text and media are a mix of CC0, CC BY, CC BY-SA, CC BY-NC and CC BY-NC-SA. Commercial use is only possible after filtering out every NC item per object. Much of EOL's descriptive text comes from Wikipedia (CC BY-SA), which brings share-alike obligations.
- For traits, it is cleaner to go to the primary datasets EOL aggregates (PanTHERIA, AnAge, Amniote, EltonTraits and so on) than to take the EOL dump, because the license and citation then attach directly to the source.
- Data points covered: body size and weight, lifespan, habitat, diet, litter and clutch size, some activity. Text: morphology and description, mostly Wikipedia-derived.

### Gaps
- The exact list of licenses EOL accepts and the API Terms of Use could not be read (403).
- No confirmed statement on EOL's operating status or funding in 2026, and no trait dump newer than Feb 2024 was found.

## Trait datasets: AnAge, PanTHERIA, COMBINE, EltonTraits, AVONET, Amniote, Storchová & Hořák 2018

### Takeaway
The confirmed commercially usable sources are AnAge (CC BY 3.0, commercial use explicitly allowed), AVONET (CC BY 4.0) and Storchová & Hořák 2018 (Dryad, so CC0 by repository policy). EltonTraits, PanTHERIA and the Amniote database sit in ESA Ecological Archives with no license statement I could verify, and COMBINE's data license is also unverified. All of these are static snapshots (2009–2022) rather than maintained databases. AnAge is the exception and is still being maintained (© 2002–2026).

### Cited Findings
**AnAge (Human Ageing Genomic Resources)**
- License: "This work is licensed under a Creative Commons Attribution 3.0 Unported License." Also: "HAGR is free for all purposes, including commercial, educational, and research purposes, provided you mention the use of HAGR in subsequent presentations, publications, etc." Users should cite the 2024 NAR HAGR paper. The terms "may change without prior notice". Copyright runs 2002–2026, so it is still maintained. — [HAGR legal page](https://genomics.senescence.info/legal.html)
- Data points (from general knowledge of AnAge, not verified this session): maximum longevity, body mass, gestation/incubation, litter/clutch size, age at maturity.

**AVONET (birds)**
- Contents: 11 continuous morphological measurements, 6 ecological variables, range size and location. Raw measurements come from 90,020 individuals of 11,009 extant species from 181 countries. Species averages are given in three taxonomies. — [Figshare record](https://figshare.com/articles/dataset/AVONET_morphological_ecological_and_geographical_data_for_all_birds_Tobias_et_al_2021_Ecology_Letters_/16586228)
- License: the article is CC BY 4.0 and the Cambridge repository item is licensed "http://creativecommons.org/licenses/by/4.0/". The Figshare page's own license field was not visible in the results. — [Cambridge Apollo](https://www.repository.cam.ac.uk/handle/1810/334410); Tobias et al. 2022, Ecol. Lett. 25:581–597, doi:10.1111/ele.13898
- Data points: morphology (beak, wing, tarsus, mass), habitat, trophic level/niche, migration (3-level), range.

**Storchová & Hořák 2018: Life-history characteristics of European birds**
- Covers 499 bird species breeding in Europe, with 34 traits in 85 variables. Variables are morphological (weight, wing, bill, tarsus), reproductive (clutch size, egg mass, incubation period, type of young), behavioural (nest type, mating system, parental care), dietary (folivore, granivore, insectivore, carnivore …) and habitat preferences. The main source was *Birds of the Western Palearctic*. Values are species-level means over the breeding area. The file is tab-delimited ASCII, about 254 KB. — [Dryad doi:10.5061/dryad.n6k3n](https://datadryad.org/dataset/doi:10.5061/dryad.n6k3n)
- Dryad license policy: authors agree to release data under CC0, and the depositor must hold the rights to make it available under CC0. — [Dryad publication policy](https://datadryad.org/publication_policy); [Dryad blog 2023](https://blog.datadryad.org/2023/05/30/good-data-practices-removing-barriers-to-data-reuse-with-cc0-licensing/)
- The dataset page itself only says "Content on this site is licensed for reuse". — [Dryad](https://datadryad.org/dataset/doi:10.5061/dryad.n6k3n)
- The dataset page does not mention migration or breeding dates.

**EltonTraits 1.0 (Wilman et al. 2014)**
- Species-level foraging attributes for 9,993 bird and 5,400 mammal species: diet as semiquantitative % per category, foraging stratum, and (per the paper) activity time. Files are BirdFuncDat.txt and MamFuncDat.txt. Interpolated values are flagged. Published as Ecology 95:2027, Ecological Archives E095-178-D1, doi:10.1890/13-1917.1. — [ESA Ecological Archives E095-178 metadata](https://esapubs.org/archive/ecol/E095/178/metadata.php)
- License: **UNVERIFIED**. The figshare copy could not be fetched.

**PanTHERIA (Jones et al. 2009)**
- Species-level life history, ecology and geography of extant and recently extinct mammals. Ecology 90:2648, Ecological Archives E090-184, tab-delimited PanTHERIA_1-0 files. — [ESA Ecological Archives E090-184](https://esapubs.org/archive/ecol/E090/184); mirror at [Zenodo 13313740](https://zenodo.org/records/13313740)
- License: third-party portals list "No License Provided". — [Ponderful data portal](https://dataportal.ponderful.eu/dataset/pantheria). **UNVERIFIED** at the primary source.

**Amniote life-history database (Myhrvold et al. 2015)**
- Ecology 96:3109, Ecological Archives E096-269, doi:10.1890/15-0846.1. CSV files include Amniote_Database_Aug_2015.csv. Covers mammals, birds and reptiles. — [ESA E096-269](https://esapubs.org/archive/ecol/E096/269/metadata.php)
- A full-archive figshare DOI, 10.6084/m9.figshare.3563457.v1, is cited by rOpenSci. — [rOpenSci traits docs](https://docs.ropensci.org/traits/reference/tr_ernest.html). License **UNVERIFIED** (figshare returned 403).

**COMBINE (Soria et al. 2021, Ecology)**
- "COalesced Mammal dataBase of INtrinsic and Extrinsic traits". Used as a life-history source in later studies. — [Biodiversity Science 2022](https://www.biodiversity-science.net/article/2022/1005-0094/1005-0094-30-2-21520.shtml); [Springer Nature "Behind the paper"](https://communities.springernature.com/amp/posts/putting-it-all-together-creating-a-more-user-friendly-database-for-nearly-all-your-mammal-macroecological-needs)
- The R package wrapper lists GPL-3, which is the wrapper's license and not necessarily the data's. — [r-packages.io](https://r-packages.io/datasets/COMBINE). Data license **UNVERIFIED**.

### Inferences
- CC0 or CC BY data can be cloned into the app database. CC BY needs visible attribution, for example a "Sources" section on each species page.
- Factual numeric values (mass in g, clutch size) are probably not copyrightable on their own in the EU. The compilation can still carry an EU sui generis database right, however, so a dataset with no stated license is a legal risk for wholesale copying. Confirm on figshare or contact the authors before cloning EltonTraits, PanTHERIA or Amniote. (This is a legal inference, not legal advice.)
- Coverage for European fauna: these sets are global and cover essentially all European mammals and birds. Storchová & Hořák is Europe-specific and probably the best single bird source.
- None of these sets is updated continuously. Taxonomy will lag (for example, splits after 2014), so a name-matching layer is needed.

### Gaps
- License fields for EltonTraits, PanTHERIA, Amniote (figshare) and COMBINE could not be read.
- No dedicated "European mammal trait dataset" comparable to Storchová & Hořák was found in this session.

## GloBI (Global Biotic Interactions): food web, predators

### Takeaway
GloBI offers versioned dumps of species interactions (eats/eatenBy, preysOn, parasiteOf …) in TSV, CSV, Parquet, RDF, DwC-A and Neo4j, hosted on Zenodo plus snapshots. It states no single data license. The data inherit the licenses of the underlying datasets, so filter per source before commercial use. It is the best open source for "who eats whom".

### Cited Findings
- GloBI is "an open service providing open data using open source software". Users must "attribute the original data contributors, including citing the specific datasets in derivative work". Formats: TSV and CSV (gzipped interactions, citations, taxon maps), RDF/N-Quads, Parquet, Darwin Core Archive, Neo4j 5.26. A stable release is at DOI 10.5281/zenodo.3950589, with unstable snapshots at depot.globalbioticinteractions.org. There are curl recipes for SQLite and DuckDB. — [GloBI data page](http://www.globalbioticinteractions.org/data)
- The Zenodo record includes citations.csv/tsv with per-record references. To credit GloBI itself, cite Poelen et al. 2014, Ecological Informatics, doi:10.1016/j.ecoinf.2014.08.005. — [Zenodo 3950590](https://zenodo.org/records/3950590)
- The license signals conflict: an aggregator lists the data as CC BY 4.0 but also carries a cc-by-nc tag, and the code is GPL-3. — [ecosyste.ms](https://science.ecosyste.ms/projects/75016)

### Inferences
- GloBI's interaction records ship with source citations, so building a commercial subset means joining to the dataset metadata and dropping NC or unknown sources.
- European coverage is probably good for well-studied vertebrates (diet studies, iNaturalist observations), but a record of an interaction is not a quantified diet. UNVERIFIED: I did not measure coverage.

### Gaps
- No quantitative statistic on European coverage was found.
- The share of records under NC licenses is unknown.

## Birds of the World (Cornell) and handbook-type sources

### Takeaway
Closed and proprietary. Text and media are copyrighted and need written permission, and access is by subscription (free in some regions since 2026). Do not clone or scrape. Handbook sources such as *Birds of the Western Palearctic* are only usable indirectly, through derived CC0 datasets like Storchová & Hořák.

### Cited Findings
- Cornell Lab terms of use are a "legal and binding agreement" covering the site, affiliate sites and apps (last edited Oct 23, 2024). — [Cornell Lab Terms of Use](https://www.birds.cornell.edu/home/terms-of-use/)
- Cornell material: "redistribution or any other use is prohibited without express written permission of the Cornell Lab of Ornithology or the copyright owner"; Birds of the World "is available by subscription". — [Newswise press release](https://www.newswise.com/articles/view/729509/?sc=sphn)
- From April 2026, BOW is freely accessible in the OSME region with a Cornell/eBird account. — [OSME 2026](https://osme.org/2026/04/birds-of-the-world-platform-now-freely-accessible-in-the-osme-region/)
- eBird raw data has its own Data Access Terms. — [eBird Data Access Terms](https://www.birds.cornell.edu/home/ebird-data-access-terms-of-use)

### Inferences
- Free access does not change the licensing. Reading BOW is free in some regions, but reusing its content is not allowed.

### Gaps
- The BOW-specific terms page (birdsoftheworld.org/bow/support/bow-terms-of-use) was not read.

## Wikipedia / Wikidata

### Takeaway
Wikidata is CC0 and can be cloned commercially. It has some trait properties, but they are sparsely filled for European fauna. Wikipedia text is CC BY-SA 4.0: commercial use is allowed, but any adapted text must stay CC BY-SA and be attributed, which affects app content.

### Cited Findings
- No primary page was retrieved this session: the WikiProject Taxonomy properties page returned 404 and the search returned nothing relevant.

### Inferences (from prior knowledge, NOT verified this session)
- Wikidata structured data is under CC0, and Wikipedia text is under CC BY-SA 4.0 (plus GFDL).
- Trait properties I believe exist: mass (P2067), life expectancy (P2250), gestation period (P3063), litter size (P7725), main food source (P1034), and possibly "diel cycle" and habitat-related properties. IDs and fill rates must be checked with a SPARQL query on query.wikidata.org.
- In practice, Wikidata is most useful for multilingual common names (DE/EN), images (Commons links, each with its own license), IUCN status and cross-links (GBIF, EOL, iNaturalist IDs). It is weak for traits.

### Gaps
- The property IDs and their coverage were not verified. A SPARQL count for European mammals and birds is recommended.

## Animal Diversity Web, Fauna Europaea / PESI

### Takeaway
ADW text is CC BY-NC-SA 3.0, so **no commercial use** without permission, and image licenses vary by image. On GBIF, the Fauna Europaea checklist shows an unspecified license. Its role is taxonomy and country-level distribution, not traits.

### Cited Findings
- ADW: text "is made available under the terms of the Creative Commons Attribution [ShareAlike/NonCommercial ShareAlike] 3.0 license" (the linked deed is BY-NC-SA 3.0). "All of the images are clearly marked with their respective copyright status and/or license terms." Footer: © 2025 Regents of the University of Michigan. — [ADW Conditions of Use](https://animaldiversity.org/about/use_conditions/); [ADW About](https://animaldiversity.org/about/)
- Fauna Europaea on GBIF covers "the scientific names and distribution of all living multicellular European land and fresh-water animals". It is available as a Darwin Core Archive, and the license is shown as "LicenceUnspecified" (DOI 10.15468/ymk1bx). — [GBIF dataset](https://demo.gbif.org/dataset/90d9e8a6-0ce1-472d-b682-3451095dbc5a)
- PESI papers in Biodiversity Data Journal are CC BY 4.0, but that covers the articles, not the checklist. — [PMC4609752](https://pmc.ncbi.nlm.nih.gov/articles/PMC4609752)

### Inferences
- ADW can serve as a manual reference for fact-checking, but its text cannot be copied into a commercial app.
- For taxonomy, a GBIF Backbone or Catalogue of Life checklist with a clear license may be safer than Fauna Europaea. This should be verified by the taxonomy researcher.

### Gaps
- Fauna Europaea's and PESI's own terms of use (faunaeur.org, eu-nomen.eu) were not read. I did not check whether Fauna Europaea is still updated in 2026.

## Tracks and signs, phenology and migration timing

### Takeaway
I found no open, machine-readable database of animal tracks or signs (footprints, scat, feeding signs). EuroBirdPortal has phenology and migration-timing data, but it is governed by EBCC partner agreements rather than an open license, so it is not cloneable.

### Cited Findings
- EuroBirdPortal is a partnership of 81 institutions from 29 countries (2017). Data sharing is governed by an EBP collaborative agreement under an EBCC parent agreement. — [EBP collaborative agreement](https://www.eurobirdportal.org/files/EBP_collaborative_agreement.pdf); [BirdGuides](https://www.birdguides.com/articles/new-pan-european-bird-sightings-project)
- An EU guidance report uses EBP and portal reporting-rate phenology graphs to set the start of spring migration. — [EC CIRCABC guidelines 2018](https://circabc.europa.eu/sd/a/e349a682-76e7-4098-a1df-9648e2eeb7ab/20181029%20Guidelines%20on%20the%20use%20of%20bird%20portals%20data%20-%20update%20of%20Key%20Concepts%20Document.pdf)
- None of my searches returned an open dataset of tracks or signs.

### Inferences
- Phenology can be derived from GBIF occurrence data, for example monthly observation frequencies for Europe. GBIF records carry CC0, CC BY or CC BY-NC per dataset, so a commercial pipeline has to filter out the NC records.
- Tracks and signs need original content: own photos, illustrations, or CC0/CC BY images from iNaturalist or Commons filtered by license.

### Gaps
- No search was done on iNaturalist annotations (e.g. the "Evidence of presence: track/scat" annotation), which could provide CC-licensed sign photos. Worth checking.

## Summary: data point vs. best open source (commercial-ok?)

| Data point | Best open source | Commercial |
|---|---|---|
| Body size and weight | AnAge (CC BY 3.0), AVONET (CC BY 4.0), Storchová (CC0), PanTHERIA/Amniote (license unverified) | yes / yes / yes / unclear |
| Lifespan | AnAge (max longevity), Amniote | yes / unclear |
| Activity (diurnal etc.) | EltonTraits (activity columns), PanTHERIA | unclear |
| Habitat | Storchová (birds), AVONET habitat, EltonTraits foraging stratum | yes / yes / unclear |
| Diet | EltonTraits (% diet), Storchová diet, AVONET trophic niche | unclear / yes / yes |
| Food web / predators | GloBI (filter per source license) | partially |
| Breeding season / phenology | No open trait dataset found. GBIF-derived only; EuroBirdPortal is closed | manual / derived |
| Litter / clutch size | AnAge, Amniote, Storchová, PanTHERIA | yes / unclear / yes / unclear |
| Migration status | AVONET migration (3 levels); Storchová not confirmed | yes |
| Description / morphology text | Wikipedia (CC BY-SA), EOL (mixed); ADW is NC (no) | share-alike |
| Tracks and signs | None found | manual |
| Confusion species | None found | manual |
| Danger to humans | None found | manual |

Fields with no open machine-readable source found, which need manual editorial research: tracks and signs, confusion species, danger to humans, breeding and mating calendar (month of mating, birth, migration timing), and German-language descriptive text. Amphibians, reptiles and insects were not researched in depth. The Amniote database covers reptiles, and AnAge covers some amphibians.

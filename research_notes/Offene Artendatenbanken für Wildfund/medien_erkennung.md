# Open species media (images, bird sounds) and recognition datasets/models for a commercial app (Wildfund)

Research date: 2026-10-24. Several official terms pages (iNaturalist, xeno-canto, observation.org) blocked automated fetching (HTTP 403 or bot walls). Where that happened, wording comes from search-engine extracts of the official page and is marked as such. The decisive clauses should be checked by hand in a browser before any legal sign-off.

## Wikimedia Commons / Wikidata as an image source

### Takeaway
Commons accepts only licenses that allow commercial use and derivatives, so it is structurally the cleanest large image source for a commercial app. The remaining obligations are attribution and share-alike (CC BY-SA is common), plus non-copyright rights such as personality rights and trademarks.

### Cited Findings
- Commons licensing policy says "Commercial use of the work must be allowed" and "Publication of derivative work must be allowed." — [Commons:Licensing](https://commons.wikimedia.org/wiki/Commons:Licensing)
- NC is excluded: "Media licensed exclusively under non-commercial only licenses (like CC BY-NC-SA) are not accepted either." "Creative Commons Non-Commercial Only (-NC) licenses" are listed as forbidden. — [Commons:Licensing](https://commons.wikimedia.org/wiki/Commons:Licensing)
- Reuse: "almost all content hosted on Wikimedia Commons may be freely reused", subject to restrictions. "Other restrictions may apply" (trademarks, patents, personality rights). "some licenses require that the original creator be attributed". For ShareAlike, "if you modify the work, your modifications must also be similarly freely licensed". For public domain, attribution "is recommended to give correct provenance". Credit the creator (author field), not the uploader. — [Commons:Reusing content outside Wikimedia](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- Large numbers of iNaturalist photos (about 250k, those with Commons-compatible licenses) have been uploaded to Commons. Part of Commons' species coverage therefore comes from iNat CC BY/CC0 photos. — [iNat forum: 250k iNat images uploaded to Wikimedia Commons](https://forum.inaturalist.org/t/250k-inat-images-uploaded-to-wikimedia-commons/73237)

### Inferences
- From general knowledge, not verified this session: the usual pipeline is to take the Wikidata taxon item (P225 taxon name, P18 image) and Commons categories or depicts (P180) statements, then query the MediaWiki API `action=query&prop=imageinfo&iiprop=url|extmetadata`. That returns `Artist`, `LicenseShortName` and `LicenseUrl` per file, which can be stored as attribution metadata. Wikidata data itself is CC0, but each image keeps its own Commons license.
- Commons typically has a handful to dozens of good images for common European species, but far fewer for insects, fungi and difficult groups. It works best as the source of display images ("hero images") and less well as a source of 20–50 field-style reference images per species.
- CC BY-SA images can be displayed with attribution. Whether a trained model counts as a "derivative" (adaptation) of SA images is legally unsettled. To be safe, train on CC0/CC BY only, or treat SA as acceptable risk only for display.

### Gaps
- Not verified this session: the extmetadata API documentation, the Commons media dump status (Wikimedia has no complete official media tarball; bulk download goes through the API or third-party mirrors), and the license-mix share (CC BY-SA vs CC BY vs CC0) of species photos.

## GBIF occurrence media

### Takeaway
GBIF aggregates media from iNaturalist, observation.org, museums and others. Licenses are per record or per image (CC0 / CC BY / CC BY-NC). A dataset-level license filter is not enough, because iNaturalist declares CC BY-NC for its whole dataset while individual records carry their own licenses. Filter on the license of each media item.

### Cited Findings
- iNaturalist applies one license to its whole GBIF dataset (the most conservative one, CC BY-NC), but "the records within the dataset retain their original license declarations", so consumers can filter afterwards. — [iNat forum: iNaturalist data on GBIF shows only CC BY-NC](https://forum.inaturalist.org/t/inaturalist-data-on-gbif-shows-only-cc-by-nc-excluding-cc0-and-cc-by/9952/11)
- GBIF accepts record-level licenses CC0, CC BY and CC BY-NC only. It is moving to record-by-record license processing, with iNaturalist research-grade data singled out. Most occurrences carry no record-level license. — [GBIF data blog: occurrence license processing](https://data-blog.gbif.org/post/gbif-occurrence-license-processing/)
- Only research-grade iNat observations under CC0, CC BY or CC BY-NC go to GBIF. CC BY-SA photos are excluded from GBIF imports. A photo's license is set separately from its observation's, and the photo default is CC BY-NC. — [iNat Tech Tip Tuesday: Understanding Licensing](https://www.inaturalist.org/posts/30692-tech-tip-tuesday-understanding-licensing); [iNat: Choosing licensing that allows scientists to use your observations](https://www.inaturalist.org/posts/84932-updated-choosing-licensing-that-allows-scientists-to-use-your-observations)
- TreeOfLife-200M, which is built mostly from GBIF, lists iNaturalist.org, observation.org, the Natural History Museum, SLU Artdatabanken and many museums and herbaria as publishers. iNat and observation.org are the dominant crowdsourced image publishers. — [HF: imageomics/TreeOfLife-200M](https://huggingface.co/datasets/imageomics/TreeOfLife-200M)

### Inferences
- Do iNaturalist's Terms of Use apply to iNat images obtained via GBIF? No official answer was found. The image license (CC0/CC BY) travels with the file. iNat's ToS bind users of iNat's platform and API, and the ToS clause says "any iNaturalist data" (see next section). Conservative reading: iNat-origin images, even CC BY ones, are a legal risk for *commercial ML training*. For *display* with attribution, CC BY/CC0 images are covered by their CC license.
- Practical filter (from general knowledge, not verified this session): GBIF occurrence search supports `mediaType=StillImage` (or `Sound`) and `license=` at record level, and each `media[]` element has its own `license` and `rightsHolder` fields. Filter on `media[].license` in {CC0, CC BY}. Also exclude `publisher = iNaturalist` if the goal is to avoid iNat ToS risk for training.

### Gaps
- No official statement was found on how GBIF's terms or iNat's ToS interact. The GBIF API reference page returned no parameter details, so the filter parameter names above are unverified.
- No statistics were found on publisher shares of GBIF images for Europe.

## iNaturalist (ToS on commercial AI, AWS Open Data, iNat2021)

### Takeaway
iNaturalist's Terms of Use explicitly prohibit using any iNaturalist data to train AI/ML models for commercial purposes. The iNat2021 competition dataset is limited to non-commercial research and education. iNat is not a legally clean training source for Wildfund. It can be used for display only where the per-photo license is CC0 or CC BY, with attribution.

### Cited Findings
- The ToS (search-engine extract of the official page; direct fetch returned 403) say users may not use "any iNaturalist data for training artificial intelligence, machine learning models, large language models, or similar networks, algorithms, or systems for commercial purposes." — [iNaturalist Terms of Use](https://www.inaturalist.org/pages/terms)
- Default content license: "Unless you specify otherwise when you post Content, you agree to license Content you contribute to the Platform under the Creative Commons Attribution Noncommercial license (CC BY-NC)." — [iNaturalist Terms of Use](https://www.inaturalist.org/pages/terms)
- A 2025 iNat blog post states that its Terms of Use prohibit "the use of our data for commercial AI training" and that iNaturalist does not have any commercial data deals (search extract; the page returned 403). — [iNat blog: Exploring New Ways to Learn from iNaturalist's Community Expertise](https://www.inaturalist.org/blog/118695-exploring-new-ways-to-learn-from-inaturalist-s-community-expertise)
- AWS Open Data: a community thread argues that the ToS cover only access through iNat's site, apps and API, so the AWS copy would fall under the image licenses alone. This is a contested community opinion with no official iNat position. — [iNat forum: Can I use iNaturalist AWS Open Data to train commercial AI model?](https://forum.inaturalist.org/t/can-i-use-inaturalist-aws-open-data-to-train-commercial-ai-model/77663)
- iNat2021 terms: "You will use the data only for non-commercial research and educational purposes." "You will NOT distribute the dataset images." "You will abide by the iNaturalist Terms of Service." Scale: 10,000 species; 2,686,843 training images; mini set 500k (50 per species); validation 100k; test 500k. — [visipedia/inat_comp 2021](https://github.com/visipedia/inat_comp/tree/master/2021)

### Inferences
- The ToS wording "any iNaturalist data" reaches beyond the API channel. Using iNat-origin images (including via GBIF, AWS, or derived datasets such as TreeOfLife) to train a commercial model is the highest-risk path, even when the individual photo is CC BY or CC0.
- Showing CC BY/CC0 iNat photos in the app with attribution is covered by the CC license itself.

### Gaps
- The full current ToS text and its "last updated" date could not be fetched (403). Manual verification is needed. No change in 2026 was found.

## observation.org / Waarneming

### Takeaway
This could not be verified. The official terms page blocked automated access.

### Cited Findings
- observation.org is a major GBIF image publisher (appears in TreeOfLife-200M publisher lists). — [HF: TreeOfLife-200M](https://huggingface.co/datasets/imageomics/TreeOfLife-200M)
- The terms page returned "Access Denied" and pointed to info@observation.org. — [observation.org terms](https://observation.org/pages/terms-of-use/)

### Inferences
- Use observation.org media only via GBIF, with a per-media license filter (CC0/CC BY). Contact Observation International (info@observation.org) for API or commercial terms. Their image-recognition backend (ObsIdentify, built with Naturalis) is a possible commercial partnership.

### Gaps
- Image license distribution, API terms, and any ML-training clause on observation.org are all unknown.

## Mushroom Observer, EOL, BOLD

### Takeaway
All three use per-image licenses with a mix that includes NC variants. They are usable only after per-file license filtering.

### Cited Findings
- Mushroom Observer images mirrored on EOL show mixed licenses, for example CC BY-SA 3.0 on one and CC BY-NC-SA 3.0 on another. The license is the contributor's choice. — [EOL media 10912938](https://api.eol.org/media/10912938); [EOL media 10883095](https://www.eol.org/media/10883095)
- In 2007 the MO maintainer said the site "currently only supports CC-by-nc-sa", with more licenses planned. This is dated. — [Commons User talk:Alan Rockefeller](https://commons.wikimedia.org/wiki/User_talk:Alan_Rockefeller)
- EOL is one of the sources of TreeOfLife-200M. — [HF: TreeOfLife-200M](https://huggingface.co/datasets/imageomics/TreeOfLife-200M)

### Gaps
- The current Mushroom Observer default license, EOL's overall license policy, and BOLD image licensing (believed, but not verified, to be largely CC BY-NC-SA) were not confirmed.

## TreeOfLife-10M / -200M and BioCLIP 2

### Takeaway
The BioCLIP 2 model weights are MIT-licensed, which permits commercial use. Its training set TreeOfLife-200M carries a CC0 tag on Hugging Face, but it is a compilation of GBIF (heavily iNaturalist), EOL, BIOSCAN and FathomNet images whose underlying per-image licenses include NC. The images themselves are not CC0, and iNat's commercial-AI clause casts a shadow over the model's provenance.

### Cited Findings
- TreeOfLife-200M is listed with license "cc0-1.0". Sources: GBIF (largest share; publishers iNaturalist.org, observation.org, NHM, SLU Artdatabanken, museums and herbaria), EOL, BIOSCAN. About 233M rows. — [HF: imageomics/TreeOfLife-200M](https://huggingface.co/datasets/imageomics/TreeOfLife-200M)
- The toolbox code is MIT. The GBIF citation block includes "Creative Commons Attribution Non Commercial 4.0 International", and the toolbox asks users to cite GBIF, BIOSCAN-5M, EOL and FathomNet. — [Imageomics TreeOfLife-toolbox README](https://raw.githubusercontent.com/Imageomics/TreeOfLife-toolbox/main/README.md)
- BioCLIP 2: license "MIT". Trained on "nearly 214M images covering 952K taxa". Usable for zero-shot classification given species names, and as a visual encoder. The card notes the data "does not provide geo-tagged information". No commercial-use restriction is stated. — [HF: imageomics/bioclip-2](https://huggingface.co/imageomics/bioclip-2)

### Inferences
- The MIT license on the weights allows commercial use of the model as distributed. The residual risk is upstream: the model was trained partly on iNat data whose ToS forbid commercial AI training. That clause binds the trainer (Imageomics, a research project) rather than downstream users, but this is untested legally. Risk is moderate. Get legal review.
- The CC0 tag on TreeOfLife-200M most plausibly applies to the compilation and metadata, since the images are referenced by URL with their source licenses. Do not treat the images as CC0.
- TreeOfLife-10M (BioCLIP 1) has a similar composition (iNat21, BIOSCAN-1M, EOL). iNat21 is non-commercial only (see above), and this was not verified this session.

### Gaps
- The full TreeOfLife-200M dataset card (license fine print, per-image license column) did not render. The TreeOfLife-10M license was not fetched.

## Other models and APIs (SpeciesNet, Pl@ntNet API, BirdNET)

### Takeaway
SpeciesNet (Apache-2.0 code) targets camera-trap images, not phone photos. The Pl@ntNet API is a commercially licensable plant ID service (500 free IDs per day, then paid). BirdNET models are CC BY-NC-SA 4.0, so they are not free for commercial use and need a licence from the Cornell/Chemnitz team.

### Cited Findings
- SpeciesNet: the repository is "Apache-2.0". The classifier has "more than 2000 labels" (species, higher taxa, blank/vehicle) and was trained on "over 65M images" from camera traps. Weights are hosted on Kaggle, and the README states no separate weights license. — [GitHub google/cameratrapai](https://github.com/google/cameratrapai)
- Pl@ntNet API: free tier "500 identifications / day", "35000+ supported species". Commercial usage beyond 500 requests per day is paid. The terms say "1,000 € (excluding taxes) for a volume of 200,000 requests per year", with a limit of 10 simultaneous requests. The pricing page shows pay-as-you-go rates of 5€, 4€, 3€ and 2€ per 1,000 at rising volumes. A contract-based Pro plan exists. The two pages give different figures. — [Pl@ntNet API Terms](https://my.plantnet.org/terms_of_use); [Pl@ntNet pricing](https://my.plantnet.org/pricing); [Pro plan](https://my.plantnet.org/doc/getting-started/pro-plan)
- BirdNET-Analyzer: source code is MIT. "The models used in this project are licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)." Educational and research uses count as non-commercial. Contact: ccb-birdnet@cornell.edu. — [GitHub birdnet-team/BirdNET-Analyzer](https://github.com/birdnet-team/BirdNET-Analyzer)

### Inferences
- For a commercial app, BirdNET needs a negotiated commercial license, or Wildfund must train its own audio model on CC0/CC BY audio. Some bird apps are known to have licensed BirdNET, but this was not verified here.
- For plants, Pl@ntNet API Pro is the cleanest licensed option.

### Gaps
- No public BirdNET commercial license terms or pricing were found. Kaggle weight terms for SpeciesNet were not checked. The PlantCLEF dataset licenses were not found; PlantCLEF data come from Pl@ntNet observations and are generally distributed for research use, which is unverified.

## Bird sounds (xeno-canto, Macaulay, Tierstimmenarchiv, BirdCLEF)

### Takeaway
No major bird sound archive is broadly commercial-clean. xeno-canto licenses are per recording and mostly NC (BY-NC-SA / BY-NC). A minority are CC BY / CC BY-SA / CC0 and can be filtered. Macaulay Library requires a paid or permissioned request for any revenue-generating use. Tierstimmenarchiv Berlin items on DDB are CC BY-NC-SA 4.0. BirdCLEF data inherit these NC licenses.

### Cited Findings
- xeno-canto: all recordings are under Creative Commons licenses, and each display must show recordist name, license and XC catalogue number (search extract of the terms page; the page itself was behind a bot wall). The standard license is described as BY-NC. Commercial use in mobile apps is the most commonly flagged violation. NC restrictions can be waived by the recordist on request. — [xeno-canto Terms](https://xeno-canto.org/about/terms); [XC forum topic 37726](https://www.xeno-canto.org/forum/topic/37726); [birding-aus 2010](https://cgi.cse.unsw.edu.au/~cs6714/bio/birding-aus/2010-07/msg00101.html)
- The xeno-canto API 2.0 returns a per-recording license URL field. — [XC API 2.0](https://www.xeno-canto.org/article/153)
- xeno-canto API v3 (secondary sources): endpoint `https://xeno-canto.org/api/3/recordings?query=...&key=...`. A key is required and is assigned to each member with a verified email at xeno-canto.org/account. — [publicapi.dev xeno-canto](https://publicapi.dev/xeno-canto-api); [rOpenSci suwo query_xenocanto](https://docs.ropensci.org/suwo/reference/query_xenocanto.html)
- Macaulay Library / eBird: "embedding/sharing media should be used for non-commercial purposes only." Revenue-generating use, including by for-profit companies, needs a request through their ticketing system. Attribution format: "Species name © Contributor's Name; Cornell Lab of Ornithology | Macaulay Library". — [eBird/Macaulay Terms of Use](https://support.ebird.org/en/support/solutions/articles/48001064570-terms-of-use)
- Tierstimmenarchiv (Museum für Naturkunde Berlin) records on the Deutsche Digitale Bibliothek are licensed "Attribution - NonCommercial - ShareAlike 4.0 International", with the rights holder "Tierstimmenarchiv - Museum für Naturkunde Berlin". — [DDB item example](https://www.deutsche-digitale-bibliothek.de/item/2GS7HN7SHP2VA7YSVQ7H4GCUKHOQMOT2?lang=en); [DDB item](https://deutsche-digitale-bibliothek.de/item/VCOMRYTU6LUOSY2AACXTXVSDAG2FYAKB)
- BirdCLEF 2025 audio comes from xeno-canto, iNaturalist and the Colombian Sound Archive. Earlier LifeCLEF rules forbade crawling xeno-canto for training data. — [habr BirdCLEF 2025](https://habr.com/ru/post/927372); [LifeCLEF 2018 Bird Monophone](https://www.aicrowd.com/challenges/lifeclef-2018-bird-monophone)

### Inferences
- Commercially usable bird audio: filter xeno-canto v3 results to `lic` in {CC0, CC BY, CC BY-SA}. Coverage of common European species is likely adequate for display or playback, but thin for training. Supplement with Wikimedia Commons audio (Commons-compatible licenses only, see Commons:Licensing), GBIF `mediaType=Sound` with CC0/CC BY, and direct licensing deals with recordists or with Macaulay / the Tierstimmenarchiv.
- iNaturalist sounds carry the same commercial-AI ToS restriction as iNat photos.

### Gaps
- The exact share of xeno-canto recordings under CC BY / CC BY-SA / CC0 was not found. Official v3 API documentation was not retrieved. The BirdCLEF 2025 Kaggle license was not confirmed. Tierstimmenarchiv commercial licensing (fees or contacts) was not found.

## Practical recommendation (legally clean pipeline)

### Takeaway
1. **Display images:** Wikimedia Commons via Wikidata (P18, Commons categories), storing author and license per file. Supplement with GBIF media filtered to CC0/CC BY (per-media license), with attribution in the app.
2. **Training and reference images (20–50 per species):** Use only CC0/CC BY media from Commons and GBIF. Exclude iNat-origin media from training, or accept that risk only after legal review. Add Wildfund's own users' photos under an explicit ML-training license in Wildfund's ToS.
3. **Recognition:** Build on BioCLIP 2 (MIT) as an embedding or zero-shot backbone, fine-tuned or kNN over the clean reference set, after legal review of its training provenance. Alternatively, license Pl@ntNet API Pro for plants.
4. **Bird sound ID:** License BirdNET commercially, or train a model on CC0/CC BY(-SA) xeno-canto, Commons and GBIF audio.
5. **Playback sounds:** Use xeno-canto CC BY/CC BY-SA recordings with recordist name, license and XC number, or license from Macaulay or the Tierstimmenarchiv.

### Cited Findings
- Commons guarantees commercial use and derivatives. — [Commons:Licensing](https://commons.wikimedia.org/wiki/Commons:Licensing)
- iNat forbids commercial AI training on its data. — [iNaturalist Terms](https://www.inaturalist.org/pages/terms)
- BioCLIP 2 is MIT. — [HF bioclip-2](https://huggingface.co/imageomics/bioclip-2)
- BirdNET models are CC BY-NC-SA 4.0. — [BirdNET-Analyzer](https://github.com/birdnet-team/BirdNET-Analyzer)
- Pl@ntNet paid API tiers exist. — [Pl@ntNet terms](https://my.plantnet.org/terms_of_use)

### Inferences
- The biggest legal risks are: (a) training on iNat-origin data, (b) BirdNET's NC license, and (c) the provenance of models trained on mixed-license data (BioCLIP). Get legal advice on all three, especially whether the ToS bind downstream users and whether training counts as a CC "adaptation".

### Gaps
- Per-species coverage counts (how many European species reach 20–50 CC0/CC BY images on Commons plus GBIF) were not measured. Running a GBIF/Commons count script for the target species list would answer this.

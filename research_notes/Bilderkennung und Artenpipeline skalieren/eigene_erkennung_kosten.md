# Running our own species recognition for Wildfund: models, licenses, approaches, hardware, on-device and LLM vision, with costs

Research date: 25 Oct 2026. Prices are as shown on the official pricing pages on that date, excluding VAT unless stated. Context: the internal BioCLIP 2 test (`recherche/erkennung/bioclip2-test.md`, 24 Oct 2026) found 96 % top-1 in a closed set of 73 species, 71 % species / 91 % genus in open-set search (867k species), threshold 0.90 → 87 % accepted at 99.5 % precision, 1.71 GB model, ~0.1 s/image on Apple MPS, ~1.4–4 GB RAM, and zeroed text embeddings for 15,487 species (all conifers and ferns) in the published file. None of that was re-tested here.

## 1. Candidate open models and licenses (code, weights, training data): which are clearly OK for commercial use?

### Takeaway
Hardly any model is "clean" on all three layers. BioCLIP 2 has MIT code and weights, but its training images include CC BY-NC(-SA/-ND) material, so the commercial risk comes from the data layer (an unresolved legal question about whether NC terms on training images carry over to the weights). SpeciesNet (Apache-2.0 code) and DINOv2 (Apache-2.0) / DINOv3 (custom license that allows commercial use) are the cleanest backbones. BirdNET is **not** usable commercially without a separate agreement. Perch, Pl@ntNet/PlantCLEF checkpoints, DF20 fungi models and BioTrove all have weight licenses that are unclear and must be checked directly.

### Cited Findings
**BioCLIP 2 / TreeOfLife-200M**
- BioCLIP 2 model card: license "MIT"; ViT-L/14 image encoder, fine-tuned from CLIP ViT-L/14 pre-trained on LAION-2B. Zero-shot species classification averages 55.6 across 11 benchmarks (BioCLIP v1: 37.6); Rare Species 76.8, NABirds 74.9, Camera Trap 53.9. The card says nothing about commercial-use restrictions — [HF bioclip-2](https://huggingface.co/imageomics/bioclip-2)
- TreeOfLife-200M dataset card: "This dataset (the compilation) has been marked as dedicated to the public domain by applying the CC0 Public Domain Waiver", but "The data (images and text) contain a variety of licensing restrictions mostly within the CC family." Per source: BIOSCAN-5M images are CC BY 3.0; FathomNet images are CC BY-NC-ND 4.0; "EOL and GBIF images contain a variety of licenses ranging from CC0 to CC BY-NC-SA"; the GBIF occurrence snapshot is CC BY-NC 4.0. Per-image licenses are in `provenance.parquet`. iNaturalist appears as one of the publishers inside GBIF — [TreeOfLife-200M README](https://huggingface.co/datasets/imageomics/TreeOfLife-200M/raw/main/README.md); [dataset page](https://huggingface.co/datasets/imageomics/TreeOfLife-200M)
- Short answer to "includes iNat/NC images?": yes. iNaturalist.org is listed as a publisher in the dataset viewer, and NC licenses appear explicitly in the card — same sources.
- The base model was pre-trained on LAION-2B (web-scraped images), which adds another layer of data-provenance uncertainty — [HF bioclip-2](https://huggingface.co/imageomics/bioclip-2)

**BioTrove / Arboretum (BT-CLIP)**
- BioTrove (161.9 M images) and Arboretum (134.6 M) are curated from iNaturalist research-grade data — [BioTrove arXiv](https://arxiv.org/html/2406.17720v2); [NeurIPS 2024](https://neurips.cc/virtual/2024/poster/97806)
- The BT-CLIP-O model card calls the models "an open-source product" and asks that "any derivative products are also open-source". I found no named license for the weights — [HF Arboretum/BT-CLIP-O](https://huggingface.co/Arboretum/BT-CLIP-O)

**Pl@ntNet / PlantCLEF**
- PlantNet-300K: code is BSD-2-Clause. For the v2 data, each image has its own license, including cc-by-sa, cc-by-nc and cc-by-nc-sa — [ecosyste.ms summary of GitHub](https://awesome.ecosyste.ms/projects/github.com%2Fplantnet%2Fplantnet-300k); [Zenodo](https://zenodo.org/records/5645731)
- PlantCLEF 2024 organisers released two DINOv2 ViT-B/14 (with registers, LVD-142M) checkpoints on Zenodo: one with only the classifier trained on a frozen backbone, one fully fine-tuned, with a 7,806-species head — [PlantCLEF 2024 overview](https://arxiv.org/pdf/2509.15768); [CEUR paper](https://ceur-ws.org/Vol-3740/paper-197.pdf). I could not verify the license of these checkpoints.

**DINOv2 / DINOv3 (backbones for "embeddings + own classifier")**
- DINOv3 License (Meta, 14 Aug 2025): non-exclusive, worldwide, royalty-free license to use, reproduce, distribute and modify the code and weights. It excludes ITAR-controlled, military, nuclear and espionage uses, and redistribution must include the license — [Meta DINOv3 License](https://ai.meta.com/resources/models-and-libraries/dinov3-license); [Roboflow](https://roboflow.com/blog/train-dinov3)
- A GitHub issue notes the custom terms "seem to allow commercial applications" but need legal review, and that DINOv2 moved to Apache 2.0 after a similar request — [dinov3 issue #31](https://github.com/facebookresearch/dinov3/issues/31)
- Some DINOv3 derivatives (EUPE) are under the FAIR Noncommercial Research License — [Lightly docs](https://docs.lightly.ai/train/0.16.3/pretrain_distill/models/dinov3.html)

**Google SpeciesNet (camera traps)**
- The GitHub repo is Apache-2.0. The species classifier is EfficientNet V2 M with >2,000 labels (species, higher taxa, blank, vehicle) and works together with MegaDetector. It has built-in geofencing (`--country` ISO-3 code): if the top prediction isn't allowed in that region, it is rolled up to a higher taxon. Weights download from Kaggle. The repo states no separate weight license — [github.com/google/cameratrapai](https://github.com/google/cameratrapai)
- Press coverage: Apache 2.0, "can be used commercially largely sans restrictions"; trained on >65 M images — [TechCrunch](https://techcrunch.com/2025/03/03/google-releases-speciesnet-an-ai-model-designed-to-identify-wildlife/)

**Fungi (DF20 / FungiTastic)**
- DF20: 1,604 classes, ~248k training images, built from Atlas of Danish Fungi observations — [arXiv 2103.10107](https://arxiv.org/abs/2103.10107v4); [hyper.ai](https://hyper.ai/en/datasets/21269). A third-party catalog lists the license only as "Other". I found no official license for the data or pretrained models — [hyper.ai](https://hyper.ai/en/datasets/21269)
- FungiTastic is a multimodal benchmark built on 20 years of data. I found no license — [arXiv 2408.13632](https://arxiv.org/html/2408.13632v1)

**Bird audio**
- BirdNET-Analyzer: "The source code for this project is licensed under the MIT License." The models are "licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)"; "all educational and research purposes are considered non-commercial use." The contact is ccb-birdnet@cornell.edu — [GitHub BirdNET-Analyzer](https://github.com/birdnet-team/BirdNET-Analyzer)
- A derivative (Finnish BSG model) explicitly forbids use "as part of a paid service or product", including free apps with paid subscriptions — [laji.fi](https://info.laji.fi/?p=2364)
- Perch: the google-research/perch code is Apache-2.0. Perch 2.0 (Aug 2025) is multi-taxa and covers >15,000 species per the Kaggle description. The weight license on Kaggle could not be verified. Community ONNX mirrors tag it apache-2.0, and a model card warns the code license doesn't automatically cover the weights — [Perch 2.0 arXiv](https://arxiv.org/pdf/2508.04665); [HF Perch-onnx](https://huggingface.co/justinchuby/Perch-onnx/blob/main/README.md); [ChickenNet card](https://huggingface.co/TheVortexProject/chickennet-research-0.1.0-perch2)

### Inferences
- **Clearly commercial-OK (weights and code):** DINOv2 (Apache-2.0, per the dinov3 issue thread) and DINOv3 (custom license that permits commercial use, needs legal review). SpeciesNet is probably OK (Apache-2.0 repo; weight license not separately stated).
- **Probably OK with legal risk:** BioCLIP 2 (MIT weights, NC data). Whether a model trained on CC BY-NC images is itself "NC" is legally unsettled; I found no court decision. The EU TDM exception (Art. 4 DSM Directive) could be relevant, but that is for a lawyer to assess and is not established here.
- **Not OK without a contract:** BirdNET (CC BY-NC-SA). Wildfund's planned paid tiers would fall foul of NC terms.
- **Unclear, check before use:** Perch weights, PlantCLEF checkpoints, DF20/FungiTastic, BioTrove.
- Practical mitigation: if Wildfund trains its **own** linear or MLP head on DINOv2/v3 or BioCLIP embeddings using its own, licensed images (e.g., CC0/CC BY from GBIF, filtered per image as in the internal test), the data layer of the head is clean. Only the backbone question remains.

### Gaps
- No official weight license found for Perch (Kaggle page didn't render), PlantCLEF 2024 Zenodo checkpoints, DF20 models or BT-CLIP.
- No legal source on whether NC training data restricts commercial use of MIT-licensed weights.
- No dedicated open insect image model was researched in depth (BIOSCAN-5M, CC BY 3.0, is part of TreeOfLife-200M, so BioCLIP 2 covers insects).

## 2. Approach comparison: zero-shot CLIP vs. own classifier vs. fine-tuning; hierarchy; geo/season priors

### Takeaway
Zero-shot BioCLIP 2 works very well on a small closed list (internal test) but degrades on open sets (71 %). For tens of thousands of species, the standard recipe is: a strong frozen backbone, plus a trained classifier head, plus a geo/season prior, plus genus fallback when confidence is low. A geo prior gave +6 to +12 points top-1 on iNaturalist benchmarks.

### Cited Findings
- Geo prior (Mac Aodha et al., "Presence-Only Geographical Priors"), top-1 accuracy: iNat2017 63.27 → 69.60 (+6.33); iNat2018 60.20 → 72.68 (+12.48); BirdSnap 70.07 → 71.84 (+1.77); YFCC 50.15 → 50.70 (+0.55, no date) — [arXiv 1906.05272 Table 1](https://arxiv.org/html/1906.05272v3)
- A spatio-temporal prior shrank candidate lists by an average of 62 % in a BMC Bioinformatics plant study (likely the Flora Incognita team; authors not verified) — [BMC Bioinformatics 10.1186/s12859-018-2201-7](https://bmcbioinformatics.biomedcentral.com/track/pdf/10.1186/s12859-018-2201-7)
- iNaturalist Geomodel: takes a location and returns the species expected there, trained only on iNat observations plus an elevation map. It drives "Expected Nearby", and suggestions fall back to all visually similar taxa if none are expected nearby — [iNat blog 84677](https://www.inaturalist.org/blog/84677); [iNat help](https://help.inaturalist.org/en/support/solutions/articles/151000170371-what-does-expected-nearby-mean-)
- Known geomodel errors: species outside their range still show up (e.g., Atlantic molluscs on the Pacific coast) — [iNat forum](https://forum.inaturalist.org/t/how-to-approach-geomodel-issues-and-a-deep-history-of-misidentification/49657)
- Spatial bias: >94 % of iNat observations in British Columbia lie within 1 km of a road — [UVic study](https://dspace.library.uvic.ca/items/20287507-48a0-42fd-8c21-994c88680ee2/full)
- SINR / range-map follow-up work uses 35.5 M iNat observations across 47,375 species, evaluated as a geo prior on a 282,974-image test set — [arXiv 2408.15956](https://arxiv.org/pdf/2408.15956)
- Merlin Photo ID uses where/when and eBird report frequencies to rank results — [Merlin](https://merlin.allaboutbirds.org/?p=1430)
- Seek offline "cannot take geography into account" and is often less specific than iNat's suggestions — [iNat forum](https://forum.inaturalist.org/t/seek-v-inaturalist/68129)
- SpeciesNet rolls a prediction up to a higher taxon when the species isn't allowed in the region (geofence plus hierarchical fallback) — [cameratrapai](https://github.com/google/cameratrapai)
- PlantCLEF 2024 organisers ship both a "frozen backbone + linear head" and a "full fine-tune" DINOv2 ViT-B checkpoint, showing both are standard baselines — [PlantCLEF 2024 overview](https://arxiv.org/pdf/2509.15768)
- Internal test (not redone): open-set BioCLIP 2 often picks a non-native close relative; genus-level accuracy is 91 % — `recherche/erkennung/bioclip2-test.md`

### Inferences
- For Wildfund: (1) compute BioCLIP 2 or DINOv2/v3 embeddings; (2) train a linear or MLP head per region (Germany first) on licensed images. Cheap: training a linear head on precomputed embeddings is minutes to hours on a single GPU (no source; standard practice); (3) multiply by a geo/month prior from GBIF occurrences per TK25/grid cell; (4) fall back to genus when the species probability is below threshold. This directly addresses the internal test's weaknesses (non-native relatives, oak/birch/lime pairs).
- Full fine-tuning of ViT-L is only worthwhile once there is a large in-house labelled set. It costs GPU hours and erases the license advantage of a frozen backbone.
- The size of the geo-prior gain depends on how confusable the regional species are: large for iNat (+12.5), small for BirdSnap (+1.8).

### Gaps
- No published number for the gain of a geo prior specifically on BioCLIP 2.
- No primary Pl@ntNet paper on the gain from a geo prior was retrieved.
- The iNat Geomodel blog post's quantitative results were not retrievable (HTTP 403).

## 3. Hardware and real cost per 1,000 inferences; scenarios for 1k / 100k / 1M per month

### Takeaway
At low volume, serverless GPU (Modal or RunPod) is practically free (Modal's $30/month credit). From roughly 100k/month, a single fixed Hetzner server (CPU CCX at €43–86 or GPU GEX45 at €214) costs well under €1 per 1,000 images. Even 1M/month fits in a few hundred euros. Self-hosted inference is 1–2 orders of magnitude cheaper than LLM vision APIs at scale. Latency figures for ViT-L/14 on CPU are rough (~0.5 s/image on a high-end desktop CPU), so a benchmark on the target server is needed.

### Cited Findings (prices as of 25 Oct 2026)
- Hetzner Cloud dedicated vCPU (EU, excl. VAT): CCX13 2 vCPU / 8 GB €43.49/mo (€0.0697/h); CCX23 4 / 16 GB €86.49; CCX33 8 / 32 GB €138.99; CCX43 16 / 64 GB €276.49; CCX53 32 / 128 GB €533.99 — [Hetzner General Purpose](https://www.hetzner.com/cloud/general-purpose/). Shared plans start at €5.99 (cost-optimised) and €6.49 (regular) — [Hetzner Cloud](https://www.hetzner.com/cloud/)
- Hetzner GPU dedicated: GEX45 (RTX PRO 4000 Blackwell 24 GB, 64 GB RAM) €214/mo + €209 setup (HEL1 only); GEX63 (RTX PRO 6000 96 GB) €999 + €999 setup. **GEX44 is no longer listed** — [Hetzner GPU matrix](https://www.hetzner.com/dedicated-rootserver/matrix-gpu/)
- Modal, per second: T4 $0.000164; L4 $0.000222; A10 $0.000306; L40S $0.000542; A100-40GB $0.000583; H100 $0.001097; CPU $0.0000131/core/s; memory $0.00000222/GiB/s. Starter plan includes $30/month free credits — [Modal pricing](https://modal.com/pricing)
- RunPod Serverless, per hour: 16 GB (A4000 etc.) $0.58; 24 GB L4/A5000/3090 $0.69; 4090 $1.10; L40S $1.75; A100 $2.72; H100 $4.79 — [RunPod pricing](https://www.runpod.io/pricing)
- Replicate (public models), per second: CPU $0.000100; T4 $0.000225; L40S $0.000975; A100-80GB $0.001400; H100 $0.001525 — [Replicate pricing](https://replicate.com/pricing)
- ViT-L/14 visual encoder on CPU: 0.534 ± 0.098 s with ONNX and 0.771 s with PyTorch on an AMD Threadripper 3970X; 0.503 s with PyTorch on an i3-9350KF — [clip2onnx README](https://awesome.ecosyste.ms/projects/github.com%2Fternaus%2Fclip2onnx). About 0.5 s on Apple M4 Pro with GGML — [TernaryCLIP arXiv](https://arxiv.org/pdf/2510.21879)
- Internal test: ~0.1 s/image on Apple MPS for the closed set; the open set adds ~0.3 s on CPU; RAM 1.4 GB, peak ~4 GB — `bioclip2-test.md`

### Cost scenarios (my calculations; assumptions stated)
Assumptions: closed set or regional head (no 867k open search, or open search limited to European species); GPU time per image 0.1 s (from the internal MPS test; a server GPU is likely faster, which makes this conservative); CPU time per image ~1 s on 4 vCPU (extrapolated from the 0.5 s Threadripper figure; **unverified**); peak load = 5× the average; USD and EUR not converted; no egress, storage or monitoring costs; VAT excluded.

| Option | 1,000 / month | 100,000 / month | 1,000,000 / month |
|---|---|---|---|
| Hetzner CCX13 (8 GB) | €43.49 → €43.49 per 1k | €43.49 → €0.43 per 1k (avg load 0.04 img/s, fits) | not enough at peak (avg 0.39/s, peak ~2/s) |
| Hetzner CCX23 (16 GB) | €86.49 | €86.49 → €0.86 per 1k | ~2–3 × CCX23 = €173–259 → €0.17–0.26 per 1k (assumes ~1 img/s per server) |
| Hetzner GEX45 (GPU) | €214 (+€209 once) — oversized | €214 → €2.14 per 1k | €214 → €0.21 per 1k (1M × 0.1 s = 100,000 GPU-s/month ≈ 28 GPU-hours; one GPU is ~4 % utilised on average) |
| Modal L4, pure compute | 1,000 × 0.1 s × $0.000222 = $0.02 | $2.22 | $22.20 |
| Modal L4 incl. idle/cold-start overhead (assume 2–10× compute; low volume much worse, see below) | within the $30 free credit → ~$0 | ~$5–25 | ~$45–220 |
| RunPod serverless L4 ($0.000192/s) pure compute | $0.02 | $1.92 | $19.20 |
| Modal CPU (4 cores + 16 GiB = $0.0000879/s, 1 s/img) | $0.09 | $8.79 | $87.90 |

- At low volume, serverless cost is dominated by the warm container after each call. If a container stays up 60 s after a request (assumption; the scale-down window is configurable on Modal and was not verified), a single isolated request costs 60 s × $0.000222 = $0.013, i.e. up to ~$13 per 1,000 if every request comes alone. Cold start for a 1.7 GB model: the internal test measured ~7 s load plus 6–14 s first inference on a Mac. Server values not measured.

### Inferences
- **1k/month (beta):** Modal or RunPod serverless (free credits). Accept 10–20 s cold starts, or keep one CCX13 for €43.
- **100k/month:** one Hetzner CCX13 or CCX23 (Germany/Finland, GDPR-friendly, fixed price) at €0.43–0.86 per 1k.
- **1M/month:** one GEX45 (€214) or 2–3 CCX23 (€173–259), plus a serverless fallback for spikes. Either way about €0.2–0.3 per 1k.
- The costs are trivial compared with LLM APIs (section 5) and with developer time. Hardware cost is not the decision driver; licenses and accuracy are.

### Gaps
- No verified ViT-L/14 CPU latency on Hetzner CCX vCPUs, and no GPU latency on RTX PRO 4000 or L4. Benchmark before committing.
- Modal and RunPod cold-start times for a 1.7 GB model were not found in official docs.
- AWS/GCP prices were not retrieved (not needed for the decision; Hetzner and serverless dominate on price).

## 4. On-device recognition (Core ML / TFLite / ONNX Runtime Mobile / ExecuTorch with Expo)

### Takeaway
On-device inference is feasible with Expo only via a development build (react-native-executorch supports Expo through config plugins). BioCLIP 2 (ViT-L, 1.71 GB) is too large; a ViT-B (~86 M params) or EfficientNet-class regional model is realistic. Merlin and Seek ship on-device models (offline, smaller, less specific); Flora Incognita does **not** identify on-device.

### Cited Findings
- react-native-executorch: "Expo is supported via development builds with config plugins". It ships an EfficientNet V2 classifier (ImageNet-1k) and CLIP image embeddings (`useImageEmbeddings`); v0.8.0 shipped quantised CLIP variants. Inference runs on-device, so images never leave the phone — [RN ExecuTorch architecture](https://www.mintlify.com/software-mansion/react-native-executorch/core-concepts/architecture); [classification docs](https://docs.swmansion.com/react-native-executorch/docs/extensions/image-classification); [v0.8.0 release](https://rec.swmansion.com/blog/react-native-executorch-v0.8.0-a-library-milestone)
- Seek: on-device identification "does not leave your device or require an internet connection". The offline model is smaller than the online one, is updated less often, can't use geography, and is often less specific — [iNat help](https://help.inaturalist.org/en/support/solutions/articles/151000169914-what-is-the-difference-between-inaturalist-and-seek-by-inaturalist-); [iNat forum](https://forum.inaturalist.org/t/seek-v-inaturalist/68129)
- The new iNaturalist app also downloads an offline model with the app — [iNat forum](https://forum.inaturalist.org/t/seek-vs-inaturalist-app-suggested-id/68938)
- Merlin Photo ID "works completely offline" and covers >8,000 species (650 at launch). Offline use needs a test identification at the destination first, so the regional data is stored — [Merlin](https://merlin.allaboutbirds.org/?p=1430); [eBird support](https://support.ebird.org/support/solutions/articles/48000961587)
- Flora Incognita offline mode only stores observations ("unknown herb or shrub") and identifies them later. Images are analysed by "a cascade of deep neural networks on the Flora Incognita computer cluster" — [Flora Incognita offline](https://floraincognita.com/?p=5366); [Flora Incognita structure](https://floraincognita.com/flora-incognita-app/)
- The PlantCLEF DINOv2 ViT-B/14 backbone has 86 M parameters — [CEUR PlantCLEF](https://ceur-ws.org/Vol-3740/paper-197.pdf)
- SpeciesNet uses EfficientNet V2 M — [cameratrapai](https://github.com/google/cameratrapai)
- Internal test: the BioCLIP 2 file is 1.71 GB and doesn't run in Expo Go — `bioclip2-test.md`

### Inferences
- Size estimate (my calculation): 86 M params × 4 bytes ≈ 344 MB fp32, ~172 MB fp16, ~86 MB int8. Plus a head for 20k species × 768-dim ≈ 15 M weights (~15–60 MB). A ViT-B regional model of ~100–150 MB (int8/fp16) is realistic as an on-demand download, not bundled in the app.
- Accuracy trade-off: Seek/iNat users report offline models are less specific. Expect a drop compared with server ViT-L; the size of the drop for Wildfund must be measured.
- The offline benefit fits Wildfund's "everything offline" principle and the forest dead zones. A hybrid is sensible: an on-device model for a quick suggestion, plus server confirmation for scoring/trust (anti-cheat must run server-side anyway).
- Zero server cost per inference, but adds app size/download, a development-build requirement and model updates through app or OTA asset downloads.

### Gaps
- No published on-device latency for a ViT-B on mid-range phones via ExecuTorch was found.
- No published on-device accuracy gap numbers for Seek/Merlin vs. their server models.
- Model sizes for Merlin's and Seek's on-device models were not found.

## 5. LLM vision (GPT-5 class, Gemini Flash, Claude): accuracy, price per image, hallucination; fallback or explainer?

### Takeaway
LLMs are much worse than specialist models at fine-grained species ID. On the hard RealBirdID benchmark, GPT-5 and Gemini 2.5 Pro score <13 % species accuracy, and they abstain poorly. Prices are low per image ($0.18–1.30 per 1,000 for Flash-Lite, Haiku and mini-class models), but still roughly 10–100× self-hosting at scale. Use them only as an explainer (feature descriptions, "why genus X") on top of the specialist result, never as the source of truth for points or edibility.

### Cited Findings
- RealBirdID (CVPR 2026): species ID on the answerable set: "less than 13% accuracy for MLLMs including GPT-5 and Gemini-2.5 Pro". Stronger classifiers aren't better at abstaining, and MLLMs give incorrect reasons when they abstain — [arXiv 2603.27033](https://arxiv.org/abs/2603.27033); CVPR listing cites up to 17 % — [CVPR 2026](https://cvpr.thecvf.com/virtual/2026/poster/36931)
- Agriculture VLM study: the best model (Gemini-3 Pro) reached only 39 % on open-ended plant/weed species ID; multiple-choice distractors inflate accuracy — [arXiv 2512.15977](https://arxiv.org/pdf/2512.15977)
- Camera-trap study: Gemini ~75.9 % zero-shot on animal species classification (an easier, coarser label set) — [JBCS](https://journals-sol.sbc.org.br/index.php/jbcs/article/download/5894/3925/38834)
- Anecdote: a Gemini test on spiders gave suggestions not even in the right genus — [iNat forum](https://forum.inaturalist.org/t/testing-gemini-vs-inat/50647)
- Gemini pricing (paid, per 1M tokens): 2.5 Flash-Lite $0.10 input / $0.40 output; 2.5 Flash $0.30 / $2.50; 3 Flash Preview $0.50 / $3.00; 3.1 Pro Preview $2.00 / $12.00 — [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing). Image tokens: 258 if both sides ≤384 px; larger images are tiled into 768×768 tiles at 258 tokens each; Gemini 3 has `media_resolution` — [Gemini image docs](https://ai.google.dev/gemini-api/docs/image-understanding)
- OpenAI pricing (per 1M, standard): gpt-5-mini $0.25 / $2.00; gpt-5-nano $0.05 / $0.40; gpt-5 $1.25 / $10; gpt-5.4-mini $0.75 / $4.50; gpt-5.6-luna $0.20 / $1.20; gpt-4.1-mini $0.40 / $1.60; gpt-4.1 $2.00 / $8.00 — [OpenAI pricing](https://developers.openai.com/api/docs/pricing). The image-token multiplier for gpt-5-mini is inconsistent between docs (1.62) and calculator (1.2), per a community report — [OpenAI forum](https://community.openai.com/t/gpt-5-mini-image-input-token-calculation-discrepancy-with-official-faq-formula/1344040/2)
- Claude: tokens = ⌈w/28⌉ × ⌈h/28⌉; a 1000×1000 image = 1,296 tokens. Per Anthropic's docs: "at Claude Haiku 4.5's $1 USD per million input tokens … the 1000×1000 image costs about $1.30 USD per thousand images"; on Opus 5.5 at $4/M, about $5.18 per 1,000. The docs warn that Claude "might hallucinate or make mistakes when interpreting low-quality … or very small images" — [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)

### Price per 1,000 images (my calculations)
Assumptions: ~1,000 input tokens (image + short prompt) and 200 output tokens; reasoning tokens excluded (they would add cost for GPT-5 and Gemini thinking modes).
- Gemini 2.5 Flash-Lite: 1,000 × $0.10/M + 200 × $0.40/M = $0.00018 per image → **$0.18 per 1k**; 1M/month ≈ $180
- Gemini 2.5 Flash: $0.0003 + $0.0005 = **$0.80 per 1k**; 1M ≈ $800
- Gemini 3 Flash Preview: $0.0005 + $0.0006 = **$1.10 per 1k**; 1M ≈ $1,100
- GPT-5-mini: $0.00025 + $0.0004 = **$0.65 per 1k** (plus reasoning tokens; image-token count uncertain)
- GPT-4.1-mini: $0.0004 + $0.00032 = **$0.72 per 1k**
- Claude Haiku 4.5: image input alone **~$1.30 per 1k** (Anthropic's figure); output price not retrieved in this session

### Inferences
- Compared with self-hosting at 1M/month (~€0.2–0.3 per 1k), LLMs cost ~1–5× (Flash-Lite) up to ~5× or more (Flash/mini). At 100k/month the costs are comparable in absolute terms ($18–110). Price isn't prohibitive; accuracy and hallucination are.
- An LLM answers fluently even when wrong. That is dangerous for rare-species points (cheating incentive) and for fungi. Suitable use: generate a child-friendly explanation of the features of the species the specialist model already determined (prompt constrained to "explain features of species X; do not identify"). That keeps hallucination contained.
- Data protection: images of minors' surroundings go to US providers. The DPA/DPF situation needs checking (out of scope here).

### Gaps
- No peer-reviewed head-to-head of GPT-5/Gemini 3 vs. iNaturalist/Pl@ntNet on European plants or fungi was found.
- The exact image-token counts for GPT-5-mini and Gemini 3 (media_resolution defaults) are unverified.

## 6. Fungi safety: recognition must never imply edibility

### Takeaway
Evidence is consistent that photo-based mushroom ID is unreliable (35–49 % correct in a peer-reviewed toxicology study on poisoning-relevant specimens). Poisonings have been linked to app misidentification. Wildfund must never show edibility based on recognition, which matches the existing CLAUDE.md rule.

### Cited Findings
- Clinical Toxicology 2023 (Victoria, Australia): 3 apps tested on photos of 78 specimens from poisoning cases (2020–2021). Best app (Picture Mushroom) 49 % correct, the others 35 %; for poisonous species the best was 44 %. The study was prompted by an apparent rise in poisonings after app-based misidentification — [PubMed 36794335](https://pubmed.ncbi.nlm.nih.gov/36794335/)
- Public Citizen report: AI mushroom ID apps "frequently misidentify edible and poisonous mushrooms, posing a serious risk of poisoning or death" — [Gizmodo](https://gizmodo.com/ai-mushroom-id-dangerous-consumer-advocates-warn-1851355484); [OECD AI incident](https://oecd.ai/en/incidents/2024-04-03-c733)
- A newer study (npj Science of Food, per press) tested 12 tools on >100 photos of ~60 species; even the best failed about 1 in 7. Paper not verified directly — [SGST](https://www.sgst.com.au/mushroom-foragers-warned-against-using-ai-apps-for-identification/)
- iNaturalist's own accuracy experiment: common European fungi research-grade accuracy 0.81 (0.68–0.91), vs. ~95 % average across taxa — [iNat blog](https://www.inaturalist.org/blog/91400-a-larger-experiment-to-learn-about-the-accuracy-of-inaturalist-observations)
- Internal test: fungi 99 % closed-set, but only 72 % open-set; a fungus model/diorama was recognised as real — `bioclip2-test.md`

### Inferences
- Even 99 % in a closed set of 9 species doesn't carry over to the real world, where a user may photograph any of thousands of fungi, including deadly look-alikes. Keep the closed set out of the edibility context entirely: no "edible" labels, a constant warning, and genus-level display for fungi.
- LLMs must not be asked about edibility (hallucination risk; RealBirdID shows poor abstention).

### Gaps
- The npj Science of Food paper itself was not read. Its numbers come from press only.

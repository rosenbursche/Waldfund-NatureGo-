# Agentic research pipeline for 1,000 to 30,000 species (Wildfund): prices, architecture, quality control, legal

Research date: 2026-10-25. All prices in USD, as shown on the official pricing pages fetched that day. Model names are copied exactly from those pages; some differ from older documentation.

Internal context, from reading the project files:
- `/Users/niklasros/Waldfund-NatureGo-/recherche/sonderwissen/AUFTRAG.md` defines the "Sonderwissen" task: 8–15 entries per species, each 2–4 sentences and at most 600 characters, with the fields `thema`, `wow` 1–3, `monate`, `meldung`, `sicherheit` and `quellen`. Every entry needs at least one source that was actually opened with WebFetch, and wow-3 entries should have two independent sources. A safety note is required for essbar/rezept/giftig, protected species must get no picking hints, and there must be no health claims. There is a validation script, `pruefeSonderwissen` in `db/felder/sonderwissen.mjs`.
- `walnuss.json` (21.7 KB) has the keys `artId, colId, wissName, gruppe, eintraege[], quellen{id:{titel,url,abgerufen}}, offen[]`. Its entries cite 2–5 sources each. Sources are mostly technical literature such as LWF, waldwissen and journal papers.
- Current cost per species (from the brief): about 125–150k subagent tokens, 50–70 tool calls and 8–12 minutes.

---

## 1. Current API prices (as of 2026-10-25) and cost per species / 1k / 10k / 30k

### Takeaway
At list prices, an open-web agent run like today's costs about $1.2 per species on Sonnet 5.5 and about $2.1 on Opus 5.5 (about $0.7 and $1.2 with the Batch API). That is $21k–63k for 30,000 species. A retrieval-first pipeline (Haiku extraction, Sonnet for Sonderwissen and verification) comes to about $0.57 standard or $0.33 batch per species, which is about $10k–17k for 30k species. Gemini Flash and OpenAI "luna" variants come to about $0.20–0.40 per species. These are estimates from stated assumptions, not measurements. The first step should be to measure 50 species through the API.

### Cited findings: Anthropic (platform.claude.com/docs/en/about-claude/pricing, fetched 2026-10-25)
- Prices per MTok (input / 5-min cache write / 1-h cache write / cache read / output) — [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing):
  - Claude Opus 5.5: $4 / $5 / $8 / $0.20 / $20
  - Claude Opus 5 and Opus 4.5–4.8: $5 / $6.25 / $10 / $0.50 / $25
  - Claude Sonnet 5.5: $2 / $2.50 / $4 / $0.10 / $10
  - Claude Sonnet 5: $2 / $2.50 / $4 / $0.20 / $10. The introductory price is now the standard price; the planned increase to $3/$15 on 2026-09-01 "will not occur".
  - Claude Sonnet 4.5/4.6: $3 / $3.75 / $6 / $0.30 / $15
  - Claude Haiku 5.5 with prompts ≤100k tokens: $0.10 / $0.125 / $0.20 / $0.01 / $0.50. With prompts >100k: $0.50 / $0.625 / $1 / $0.05 / $2.50. "A request's prompt length counts all of its input tokens, including cache reads and cache writes."
  - Claude Haiku 4.5: $1 / $1.25 / $2 / $0.10 / $5
  - Claude Fable 5.1 / Mythos 5.1 (top tier): $10 / $12.50 / $20 / $0.25 / $50
- Cache multipliers: 5-min write = 1.25x input, 1-h write = 2x, read = 0.1x. Opus 5.5 and Sonnet 5.5 read at 0.05x, Fable/Mythos 5.1 at 0.025x. "These multipliers stack with other pricing modifiers, including the Batch API discount" — [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Batch API: "50 percent discount on both input and output tokens". Opus 5.5 batch is $2/$10, Sonnet 5.5 $1/$5, Haiku 5.5 (≤100k) $0.05/$0.25 — [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Web search: "$10 USD per 1,000 searches, plus standard token costs for search-generated content". Results count as input tokens in later turns, and failed searches are not billed — [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Web fetch: "no additional cost. You only pay standard token costs for the fetched content" — [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Code execution is free when used with `web_search_20260209` / `web_fetch_20260209` or later — [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Opus/Sonnet 4.6 and later include the 1M-token context at the standard price. Haiku 5.5 is the exception, with its 100k threshold — [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Tokenizer: Claude 4.7 and later "produces approximately 30% more tokens for the same text" — [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- `inference_geo: "us"` costs 1.1x. The global default costs 1x — [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Claude Managed Agents: tokens are billed at model prices plus session runtime, and there is **no Batch discount** ("Sessions are stateful and interactive. There is no batch mode.") — [Anthropic Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Batch limits: at most 100,000 requests or 256 MB per batch. "most batches completing within 1 hour", and batches expire after 24 h. Results are retained for 29 days — [Anthropic Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
- Batch supports "all server tools (web search, web fetch, code execution, …)". "The batch worker runs the same server-side agentic loop as the synchronous Messages API." So an agent loop with server-side search/fetch can run inside a batch — [Anthropic Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
- Caching in batch is "best-effort". The docs recommend the 1-hour cache for batches with shared context — [Anthropic Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)

### Cited findings: OpenAI (developers.openai.com/api/docs/pricing, fetched 2026-10-25; openai.com/api/pricing returned 403)
- Prices per 1M tokens (input / cached / output) — [OpenAI Pricing](https://developers.openai.com/api/docs/pricing):
  - gpt-6-astra $10 / $1 / $50
  - gpt-6.1-sol $2 / $0.10 / $10
  - gpt-6-sol $2 / $0.20 / $10
  - gpt-6-luna $0.10 / $0.01 / $0.50
  - gpt-5.6-sol $4 / $0.40 / $20
  - gpt-5.6-terra $2 / $0.20 / $12
  - gpt-5.6-luna $0.20 / $0.02 / $1.20
  - gpt-5.4-mini $0.75 / $0.075 / $4.50
  - gpt-5.4-nano $0.20 / $0.02 / $1.25
  - Short context means ≤272k input.
- The Batch and Flex tables list half the standard price. The 50% figure comes from reading those tables; the page does not state it as a percentage — [OpenAI Pricing](https://developers.openai.com/api/docs/pricing)
- Web search costs $10 per 1k calls, "plus Search content tokens billed at model rates". For non-reasoning preview models it is $25 per 1k, and the content tokens are free — [OpenAI Pricing](https://developers.openai.com/api/docs/pricing)

### Cited findings: Google Gemini (ai.google.dev/gemini-api/docs/pricing, fetched 2026-10-25)
- Prices per 1M tokens (input / output / cache) — [Gemini Pricing](https://ai.google.dev/gemini-api/docs/pricing):
  - Gemini 3.1 Pro Preview: $2 / $12 / $0.20 at ≤200k context. Above 200k: $4 / $18.
  - Gemini 3.8 Flash and 3.6 Flash: $0.75 / $3.75 / $0.075, plus cache storage at $0.50/h. **These rise on 2027-01-01 to $1.50 / $7.50 / $0.15.**
  - Gemini 3.5 Flash-Lite: $0.30 / $2.50
  - Gemini 3.1 Flash-Lite: $0.25 / $1.50
  - Gemini 2.5 Flash-Lite: $0.10 / $0.40
  - Batch: "50% cost reduction"
- Grounding with Google Search on Gemini 3 and later: "5,000 free search requests per month (shared …), then $14 per 1,000 requests". On Gemini 2.5: 1,500 RPD free, then $35 per 1,000 grounded prompts — [Gemini Pricing](https://ai.google.dev/gemini-api/docs/pricing)

### Cost model (my own calculation; all token figures are ASSUMPTIONS)
Assumptions:
- Today's observed run is 125–150k tokens and 50–70 tool calls. In an API agent loop, the context is resent on every turn. I assume 25 searches and about 35 fetches, about 140k new tokens per species that are written to the cache once, 60 turns with an average context of about 70k (giving ≈4.2M cache-read tokens), and 15k output.
- Retrieval-first (B):
  1. The field catalogue is extracted from about 40k tokens of pre-loaded open sources by Haiku 5.5, with 5k of cached schema/system prompt and 8k output.
  2. The Sonderwissen agent uses 10 searches and about 15 fetches, with 60k new context, 600k cache reads and 10k output.
  3. A verifier gets 50k input (claims plus quoted passages) and produces 5k output.
- Batch halves token costs only; I assume search fees are not discounted.

| Variant | $/species standard | $/species batch | 1,000 (std/batch) | 10,000 | 30,000 |
|---|---|---|---|---|---|
| A: open-web agent like today, Sonnet 5.5 | 1.17 | 0.71 | $1,170 / $710 | $11.7k / $7.1k | $35.1k / $21.3k |
| A: same with Opus 5.5 | 2.09 | 1.17 | $2,090 / $1,170 | $20.9k / $11.7k | $62.7k / $35.1k |
| A: Haiku 5.5 (contexts >100k, so long-context prices) | ≈0.32–0.59 | n/a | $320–590 | $3.2k–5.9k | $9.5k–17.6k |
| B: retrieval-first, Haiku 5.5 extraction + Sonnet 5.5 Sonderwissen + Sonnet 5.5 verifier | 0.57 | 0.33 | $568 / $334 | $5.7k / $3.3k | $17.0k / $10.0k |
| B: same with an Opus 5.5 verifier | 0.72 | 0.41 | $718 / $409 | $7.2k / $4.1k | $21.5k / $12.3k |
| B: Gemini 3.8 Flash throughout + 10 grounding queries ($14/1k) | 0.38 | 0.26 | $384 / $262 | $3.8k / $2.6k | $11.5k / $7.9k |
| B: OpenAI gpt-5.6-luna + gpt-6.1-sol verifier, 10 searches ($10/1k) | 0.30 | 0.20 | $304 / $202 | $3.0k / $2.0k | $9.1k / $6.1k |

Breakdown of B on Anthropic, standard → batch:
- Extraction: $0.008 → $0.004
- Sonderwissen agent: $0.41 → $0.255, of which $0.10 is search fees
- Sonnet verifier: $0.15 → $0.075 (Opus verifier: $0.30 → $0.15)

Example calculation, A on Sonnet 5.5: 140k × $2.50/M = $0.35, plus 4.2M × $0.10/M = $0.42, plus 15k × $10/M = $0.15, plus 25 × $0.01 = $0.25, giving $1.17.

### Inferences
- In the open-web agent, the cost is driven by the **resent context (cache reads)** and the **search fees**, not by output. A retrieval-first design cuts both. Only the Sonderwissen part needs a real web agent; the field catalogue can come mostly from APIs/dumps.
- The Gemini 3.8 Flash price rise on 2027-01-01 doubles token costs there. Gemini grounding at $14/1k is more expensive than Claude/OpenAI search at $10/1k.
- Throughput: 30,000 species × 8–12 min sequentially would be 4,000–6,000 hours. Parallelism (batch or a worker pool) is essential. A batch of 100k requests is technically possible.
- With Claude Code subscription subagents, the token cost is not billed per token, but this is not a scalable, controllable production path. That conclusion is my inference; I did not check the terms of use for automated mass use.

### Gaps
- No measured API token profile exists yet for one species. The "4.2M cache reads" figure is a model assumption. It is unclear whether the 125–150k reported by Claude Code means total billed tokens or peak context.
- I found no explicit statement on whether search fees are discounted in batch, so I assumed they are not.
- Labour costs for human spot checks (biologist/editor hourly rates) were not researched.
- Rate limits per usage tier (RPM/TPM) were not fetched.

---

## 2. Architecture patterns

### Takeaway
Recommended setup:
1. **Retrieval-first:** pull open sources (GBIF, Wikipedia/Wikidata, trait databases) via API/dump, cache them locally, and let a cheap model extract from them into a JSON schema.
2. A **web agent only for Sonderwissen**, with an allowlist of good domains.
3. Then a **deterministic citation check** (re-fetch the URL, find the quote) plus a **second model as verifier**, confidence scores and random spot checks.
4. Orchestrate with a simple queue/DB plus workers, or the Batch API. A heavyweight framework is not needed.

### Cited findings
- Claude's citations feature: "citations are guaranteed to contain valid pointers to the provided documents". `cited_text` "does not count toward your output tokens" and is not counted as input when passed back — [Anthropic Citations](https://platform.claude.com/docs/en/build-with-claude/citations)
- **"Citations and structured outputs are incompatible"**: using `output_config.format` together with citations on documents/search_result blocks returns an error — [Anthropic Citations](https://platform.claude.com/docs/en/build-with-claude/citations)
- Batch API with server tools and best-effort caching — [Anthropic Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
- GBIF: "Rapid or numerous queries to search APIs may be rate limited" (HTTP 429). For work over 15 minutes, use the download API. Scraping web pages "may be blocked without warning" — [GBIF API docs](https://techdocs.gbif.org/en/openapi/)
- Chain-of-Verification (draft, then plan independent verification questions, answer them separately, then produce a final answer) "decreases hallucinations across a variety of tasks" — [Dhuliawala et al. 2023, arXiv:2309.11495](https://arxiv.org/abs/2309.11495)
- An LLM-based FActScore estimator reaches "less than a 2% error rate" compared with human fact-checking of atomic facts. This supports the idea of splitting statements into atomic claims and checking them automatically — [Min et al. 2023, arXiv:2305.14251](https://arxiv.org/abs/2305.14251)

### Inferences (proposed design)
1. **Species prioritisation:** start with the 1,000 species ranked by GBIF occurrence count in DE/AT/CH (via the download API or facet queries) or by app usage, then expand to 10k–30k.
2. **Source layer (no LLM):**
   - Wikipedia DE/EN as a pointer only (AUFTRAG says no copying of text), Wikidata, GBIF species/occurrence, plus trait databases where licences allow.
   - Store raw HTML/text with URL, retrieval date and hash in an object store or SQLite. That makes every claim reproducible and saves repeated fetches.
3. **Extraction:** Haiku-class or Flash model with a JSON schema (structured outputs). Each field gets `wert`, `quelle_id`, a `zitat` (verbatim quote, max ~300 characters) and `konfidenz`. Because of the incompatibility above, use the "quote-then-claim" pattern **in the JSON** rather than the native citations feature. Alternatively run two passes: citations first, then convert to JSON.
4. **Sonderwissen agent:** Sonnet-class with web search/fetch, a domain allowlist (BfN, FloraWeb, LWF, BfR, PubMed, …) and a hard cap on tool calls (e.g. 25) and tokens.
5. **Verification:**
   - (a) Deterministic: re-fetch the URL or use the cache, normalise the text, and fuzzy-match the quote (e.g. ≥90% token overlap).
   - (b) A verifier model (stronger, or from another provider) gets only the claim plus the quote and judges whether the quote supports the claim (supported / partial / no).
   - (c) The existing schema validation (`pruefeSonderwissen`).
   - (d) Rules: wow-3 needs two independent domains, a `sicherheit` field where required, and a list of banned words for `meldung`.
6. **Confidence/routing:**
   - Fields that are "supported" in both checks are published.
   - Partial, contradictory or safety-relevant fields go into a review queue.
   - Stratified spot checks of n species per batch, used to estimate the error rate.
7. **Orchestration:**
   - Postgres/SQLite job table (status, attempts, version, cost), workers with retry/backoff, idempotent steps, and results per step.
   - Either the Messages API with your own loop, the Claude Agent SDK, or the Batch API (cheapest, 24-h window, runs server tools).
   - LangGraph only if there is complex branching. Managed Agents has no batch discount.

### Gaps
- No public engineering report was found on comparable pipelines for species facts, so these are design proposals.
- Not checked: trait database licences (TRY, BiolFlor, etc.) for commercial use.

---

## 3. Evidence on hallucination rates and on the effect of citation verification

### Takeaway
Without verification, LLM citations are unreliable. Generative search engines fully support only about half of their sentences, and even RAG systems leave about 30% of individual statements unsupported. LLMs also perform poorly on species-specific judgement tasks (Red List status 27%). Structured extraction from supplied text is much better (about 6% error), but runs are not reproducible. Automated claim checking is cheap and close to human accuracy. That supports an "extract from source text plus automated support check" design, not an "agent knows it" design.

### Cited findings
- Generative search engines: "a mere 51.5% of generated sentences are fully supported by citations", and "only 74.5% of citations support their associated sentence" — [Liu et al. 2023, arXiv:2304.09848](https://arxiv.org/abs/2304.09848)
- Medicine (SourceCheckup): "between ~50% to 90% of LLM responses are not fully supported by the sources they provide". GPT-4 with RAG: "around 30% of individual statements are unsupported". GPT-4 agreed with doctors on source relevance 88% of the time — [Wu et al., arXiv:2402.02008](https://arxiv.org/abs/2402.02008), published in Nature Communications 2025 (DOI 10.1038/s41467-025-58551-6; the Nature page could not be fetched because of a login redirect)
- FActScore: ChatGPT reaches only 58% supported atomic facts in biographies. The automated estimator is within <2% error — [Min et al. 2023](https://arxiv.org/abs/2305.14251)
- IUCN Red List, 21,955 species, 5 models (GPT-4.1, Grok 3 without web, Claude Sonnet 4, Gemma 3-27B, Llama 3.3-70B), all **closed-book** — [Uryu 2025, arXiv:2510.02830](https://arxiv.org/html/2510.02830v1):
  - Accuracy: taxonomy 94.9%, Red List category 27.2%, distribution 45.6% (precision 23.4%), threats 46.4% (precision 4.2%).
  - Hallucination indicators: about 1.7 invented threats per species, and about 5% invalid country names.
  - Results are worse for invertebrates, plants and fungi than for vertebrates.
  - Recommendation: no conservation assessments without experts.
- Trait extraction from taxonomic descriptions (ChatGPT-4o, 51 characters, 1,121 descriptions / 945 taxa, Asteraceae): 5.8% error rate on a visual check of 109 profiles, mostly from assigning data to the wrong trait. Repeated runs were only partly consistent, and a local open model was less reproducible — [PMC12381580 / PhytoKeys](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12381580/)
- Benchmarks for citation quality: ALCE (citation recall/precision via NLI) and AttributionBench-style evaluations — [overview in arXiv:2406.15264](https://arxiv.org/pdf/2406.15264); [Yue et al. 2023, Automatic Evaluation of Attribution](https://preview.aclanthology.org/new-sigs/2023.findings-emnlp.307/)

### Inferences
- Closed-book is unsuitable, especially for protection status and distribution, even though Wildfund focuses on plants and fungi. Every fact must come from a stored source passage.
- Even with sources, expect roughly 10–30% of statements to be only partly supported unless they are checked automatically. That range is an extrapolation from the medical and search-engine studies and is not measured for biology.
- Run-to-run variance: run extraction at temperature 0 / deterministic, possibly twice, and treat disagreements as a review signal.

### Gaps
- I found no study that measures directly how much quote re-fetch checking lowers the error rate in a production pipeline. The effect is plausible (FActScore estimator <2% error, CoVe) but not quantified for this domain.
- I did not read the CoVe figures from the full paper.

---

## 4. Rate limits, politeness and legal issues for mass fetching (EU TDM)

### Takeaway
Use APIs and dumps first (GBIF download API, Wikimedia APIs/dumps with a proper User-Agent). For open-web fetching, follow robots.txt (RFC 9309), throttle per domain and use your own user agent. In the EU, commercial text and data mining (Art. 4 DSM Directive / §44b UrhG) is only allowed if the rights holder has not declared a machine-readable opt-out. Courts are also inclined to accept opt-outs written in plain language in terms of use. Since Wildfund publishes rewritten text with sources, short quotes are kept only internally as evidence; no source text is published.

### Cited findings
- RFC 9309: crawlers "MUST try to parse each line". Do not use the cache for more than 24 h. On 4xx, crawlers may fetch. On 5xx, "MUST assume complete disallow". "These rules are not a form of access authorization" — [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html)
- Wikimedia User-Agent policy: the format is `<client name>/<version> (<contact information>)`. Generic agents such as curl or Python-urllib get 403 — [Wikimedia UA Policy](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy)
- GBIF: rate limit with 429 on search APIs, the download API for bulk, and blocking of scraping — [GBIF API docs](https://techdocs.gbif.org/en/openapi/)
- Kneschke v. LAION (LG Hamburg 2024): an opt-out in natural language in terms of use is probably "sufficiently explicit" and probably also "machine-readable" — [Kluwer Copyright Blog](https://legalblogs.wolterskluwer.com/copyright-blog/kneschke-vs-laion-landmark-ruling-on-tdm-exceptions-for-ai-training-data-part-2/); [Taylor Wessing](https://www.taylorwessing.com/en/insights-and-events/insights/2024/11/aiq-----laion-first-eu-decision-on-the-tdm-exception-in-the-context-of-genai-model-training)
- Courts are requiring "clear, specific, and technically proper" opt-outs. GEMA v OpenAI (LG München, 11 Nov 2025): TDM generally covers AI training, but memorised reproduction does not — [Taylor Wessing 2025](https://www.taylorwessing.com/de/interface/2025/online-and-ai-generated-content/ai-and-copyright-litigation-in-the-eu-and-the-uk)
- Discussion of the appeal and of machine readability — [Open Future](https://openfuture.eu/blog/laion-round-2-machine-readable-but-still-not-actionable/)

### Inferences
- For a commercial app, Art. 3 (scientific research) does not apply, so Art. 4 does. Practical steps:
  - Check robots.txt, including AI-specific user agents.
  - Check terms of use for TDM reservations on the domain allowlist.
  - Prefer CC-licensed sources (Wikipedia CC BY-SA, GBIF data under CC0/CC BY/CC BY-NC per dataset, so filter for NC).
  - Log retrieval date and URL; this is already in the format.
- Wildfund's own fetches would go through Anthropic web fetch, which is server-side and controlled by Anthropic, or through its own crawler. With its own crawler: 1 request/s per domain, caching, and backoff on 429/5xx. These politeness values are common practice, not from a source.
- Storing quotes internally as evidence is TDM reproduction (deletion obligation under §44b(2) UrhG once no longer needed). Publishing rewritten text plus a link is safer than reusing the text. This needs legal review; it is not legal advice.

### Gaps
- I did not read the outcome of the LAION appeal (OLG Hamburg) in the original.
- The terms of individual German sources (LWF, BfN, FloraWeb) were not checked.
- The EU AI Act / GPAI Code of Practice concerns model training and is probably not directly relevant here; this was not examined in detail.

---

## 5. Which fields can be automated and which need review

### Takeaway
Morphological and phenological facts with multiple open sources (height, flowering time, leaf shape, habitat type) can be largely automated with quote verification and spot checks. **Toxicity/edibility, protection status/Red List, look-alikes with poisonous species, and recipes** need a mandatory human or expert review, or at least must come strictly from authoritative primary sources (BfR, poison information centres, BfN/BArtSchV, Red Lists). LLMs are demonstrably weak at conservation status (27% accuracy closed-book).

### Cited findings
- Red List category 27.2%, threats precision 4.2%, distribution precision 23.4% (closed-book). The paper recommends expert control for risk/status assessments — [Uryu 2025](https://arxiv.org/html/2510.02830v1)
- Trait extraction from descriptions has about 5.8% error, mostly from wrong trait assignment — [PMC12381580](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12381580/)
- The project's own rules require a safety note for essbar/rezept/giftig, and expert checking for fungi — `/Users/niklasros/Waldfund-NatureGo-/recherche/sonderwissen/AUFTRAG.md`

### Inferences (proposed tiers)
- **Tier 1, automatic** (quote check plus verifier, spot checks about 2–5%):
  - Height, size and shape descriptions, colours, flowering/fruiting months, life form, habitat types, altitude, native/introduced status, names and etymology, ecological relationships (pollinators, host plants).
- **Tier 2, automatic with stricter rules** (2 independent sources, verifier from another model family, higher spot-check rate):
  - Tracks and signs, behaviour, diet, look-alikes (harmless pairs), Sonderwissen with wow-3, history and myths (flagged as such).
- **Tier 3, mandatory human/expert review:**
  - Toxicity, edibility, recipes, look-alikes involving poisonous species (fungi, Apiaceae), medical/folk-medicine statements.
  - Protection status (BArtSchV/FFH/Red List, best taken directly from official lists or APIs rather than from an LLM), invasiveness / legal obligations.
- Distribution/occurrence comes from GBIF data, not from an LLM.

### Gaps
- I found no quantitative evidence for LLM error rates specifically on toxicity/edibility.
- I did not check which official machine-readable protection-status sources exist for DE (e.g. a BfN Red List API, WISIA). That is presumably covered by the parallel research on open species databases.

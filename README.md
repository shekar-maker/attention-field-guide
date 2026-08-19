# The Attention Field Guide

An interactive, source-verified history of modern attention mechanisms—from exact scaled dot-product attention to compressed, sparse and recurrent memory.

> **Central argument:** attention did not improve along a single axis. The dominant bottleneck moved from exact global access, to quadratic compute, to positional extrapolation, to KV-cache memory, and finally to hybrid compression plus selective retrieval.

## Live application

- **Live site:** add the final deployment URL here
- **Repository:** add the public GitHub URL here

The page is intentionally built as an explanatory instrument rather than a gallery of unrelated animations. Every mechanism answers the same six questions: what problem existed, what changed, what became cheaper, what became worse, when to choose it, and what later work tried to repair.

## What the application contains

- A chronological timeline with all mechanisms required by Assignment 8.
- Filters for position, compute, KV/memory, retrieval, systems and hybrid approaches.
- An attention-pattern experiment comparing dense, windowed, structured-sparse and top-k edges.
- A mechanism comparison instrument with compute, memory, access and context trade-offs.
- A live KV-cache calculator that makes the MHA → GQA → MQA memory slope visible.
- A forecast derived from the timeline: hybrid depth schedules with cheap state plus occasional selective exact retrieval.
- A complete primary-source audit trail.

## Required coverage

The source test fails if any of these are missing:

`standard attention`, `learned absolute positions`, `sinusoidal positions`, `RoPE`, `ALiBi`, `MQA`, `GQA`, `sliding-window attention`, `attention sinks`, `NTK-aware scaling`, `YaRN`, `linear attention`, `delta rule`, `Gated DeltaNet`, `MLA`, `sparse attention`, `top-k attention`, `DeepSeek sparse attention`, `DeepSeek compressed attention`, and `DroPE`.

BigBird and FlashAttention are included as bonus landmarks. FlashAttention is accurately labelled as an exact IO-aware algorithm—not incorrectly presented as an approximate attention rule.

## Chronology and primary sources

Dates use the **first public paper submission or official release**, not conference year or a later revision. Where first invention is disputed, the timeline names the concrete landmark being dated. For example, 11 June 2018 dates learned absolute positions in the GPT Transformer language model, not the first learned position vector in all neural architectures.

| Date | Landmark | Primary source |
|---|---|---|
| 12 Jun 2017 | Scaled dot-product attention; sinusoidal positions | [Attention Is All You Need](https://arxiv.org/abs/1706.03762) |
| 11 Jun 2018 | Learned absolute positions in a Transformer LM | [Improving Language Understanding by Generative Pre-Training](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf) |
| 23 Apr 2019 | Sparse Transformer | [Generating Long Sequences with Sparse Transformers](https://arxiv.org/abs/1904.10509) |
| 6 Nov 2019 | Multi-Query Attention | [One Write-Head is All You Need](https://arxiv.org/abs/1911.02150) |
| 25 Dec 2019 | Explicit top-k/sparse selection | [Explicit Sparse Transformer](https://arxiv.org/abs/1912.11637) |
| 10 Apr 2020 | Sliding-window attention | [Longformer](https://arxiv.org/abs/2004.05150) |
| 29 Jun 2020 | Linear attention | [Transformers are RNNs](https://arxiv.org/abs/2006.16236) |
| 28 Jul 2020 | BigBird *(bonus)* | [Big Bird](https://arxiv.org/abs/2007.14062) |
| 22 Feb 2021 | Delta rule / DeltaNet | [Linear Transformers Are Secretly Fast Weight Programmers](https://arxiv.org/abs/2102.11174) |
| 20 Apr 2021 | RoPE | [RoFormer](https://arxiv.org/abs/2104.09864) |
| 27 Aug 2021 | ALiBi | [Train Short, Test Long](https://arxiv.org/abs/2108.12409) |
| 27 May 2022 | FlashAttention *(bonus)* | [FlashAttention](https://arxiv.org/abs/2205.14135) |
| 22 May 2023 | GQA | [GQA](https://arxiv.org/abs/2305.13245) |
| 29 Jun 2023 | NTK-aware RoPE scaling | [Original bloc97 community release](https://www.reddit.com/r/LocalLLaMA/comments/14lz7j5/ntkaware_scaled_rope_allows_llama_models_to_have/) |
| 31 Aug 2023 | YaRN | [YaRN](https://arxiv.org/abs/2309.00071) |
| 29 Sep 2023 | Attention sinks | [StreamingLLM](https://arxiv.org/abs/2309.17453) |
| 7 May 2024 | Multi-head Latent Attention | [DeepSeek-V2](https://arxiv.org/abs/2405.04434) |
| 9 Dec 2024 | Gated DeltaNet | [Gated Delta Networks](https://arxiv.org/abs/2412.06464) |
| 29 Sep 2025 | DeepSeek Sparse Attention | [DeepSeek-V3.2-Exp](https://github.com/deepseek-ai/DeepSeek-V3.2-Exp) |
| 13 Dec 2025 | DroPE | [DroPE](https://arxiv.org/abs/2512.12167) |
| 24 Apr 2026 | DeepSeek V4 CSA / HCA | [DeepSeek official release record](https://www.deepseek.com/en/transparency/) |

### Important historical note

NTK-aware scaling began as a community post and code experiment, not an academic paper. The app preserves that provenance. DeepSeek Sparse Attention and DeepSeek V4 compressed attention are separated because they are distinct public milestones rather than one vague “DeepSeek attention” entry.

## Relation to the ERA V5 sessions

- The early sessions establish the Transformer and token sequence that attention receives.
- The tokenization session matters because tokenizer fertility changes how much comparable text fits inside the same nominal context window.
- The data sessions matter because architectural context length is useless without sufficiently long and representative training examples.
- Session 7 provides the `[B, T, D]` representation and explains why attention without position reads a set.
- Session 8 supplies the two-bill framework: quadratic attention compute versus the linear per-user KV-cache bill.

The site keeps those dependencies visible without turning Sessions 1–7 into unrelated timeline cards.

## Run locally

The project intentionally has no runtime dependencies.

```bash
node scripts/serve.mjs
```

Open `http://127.0.0.1:4173`.

## Validate and build

```bash
node --test tests/*.test.mjs
node scripts/build.mjs
```

Tests verify required coverage, unique identifiers, chronological ordering, trade-off completeness, primary-source URLs, anchor dates and required page sections. The build writes a static deployment to `dist/client` and a Cloudflare-compatible module to `dist/server/index.js`.

## Deployment

Vercel and Netlify configuration files are included. Both run the dependency-free build and publish `dist/client`.

Before submission:

1. Add the final live URL and GitHub URL above.
2. Open the live URL in an incognito/private window.
3. Check the timeline filters, dialog, pattern lab, comparison selectors and KV-cache sliders.
4. Submit both URLs as separate links.
5. Paste the prepared Question 2 response from [`SUBMISSION.md`](SUBMISSION.md).

## Known limitations

- Complexity labels summarize dominant asymptotic costs; kernels and hardware can change wall-clock ranking.
- A long advertised context does not prove retrieval quality at that length.
- “Exact” refers to the attention computation over the allowed keys, not guaranteed factual recall.
- Mechanism dates do not imply that every underlying mathematical ingredient originated on that date.

## Project structure

```text
web/                 browser application and source-verified data
scripts/build.mjs    dependency-free deployment build
scripts/serve.mjs    local preview server
tests/               coverage and chronology checks
SUBMISSION.md        ready-to-paste answers and checklist
vercel.json          Vercel deployment configuration
netlify.toml         Netlify deployment configuration
```

## License

MIT

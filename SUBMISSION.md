# Assignment 8 — Submission Pack

Replace the two placeholders only after deployment.

## Question 1 — Links

**Live application:** `https://attention-field-guide-era5.ramachandran-shekar.chatgpt.site`

**GitHub repository:** `PASTE_GITHUB_URL`

**Caption:**

> The Attention Field Guide is an interactive, source-verified chronology of modern attention mechanisms. It explains the computational, memory, positional and retrieval problem that drove each innovation—and the trade-off every solution introduced.

Before submitting, open the live application in an incognito/private window and verify that it loads without authentication.

## Question 2 — What does the timeline actually show?

> The timeline shows that attention did not evolve through one continuous improvement. Each mechanism solved the bottleneck that had become most expensive at that historical moment. Standard scaled dot-product attention prioritized exact global token interaction, but its quadratic computation encouraged sparse patterns, sliding windows and linear state. Autoregressive deployment exposed a second and different bottleneck—the KV cache—which led from MQA to GQA and then MLA. RoPE and ALiBi improved how position enters attention, but pushing models beyond their training length created another problem, motivating NTK-aware scaling, YaRN and eventually DroPE. Linear attention bounded memory but gave up exact softmax retrieval and struggled to overwrite old associations, which led to the delta rule and Gated DeltaNet. Recent DeepSeek systems combine lightweight indexing, sparse reads and compressed representations because no single mechanism simultaneously provides exact recall, low compute, a tiny cache and unlimited context. The direction suggested by the chronology is therefore hybrid: cheap local or recurrent state in most layers, compressed memory for continuity, and occasional learned sparse exact retrieval where its value justifies the cost.

### Bonus mechanism not named in the minimum list

**FlashAttention — 27 May 2022**  
Primary paper: [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness](https://arxiv.org/abs/2205.14135)

FlashAttention is important because it demonstrated that an attention bottleneck can come from data movement between GPU memory levels rather than from the mathematical operation alone. It uses tiling to compute the exact same attention result with fewer high-bandwidth-memory reads and writes. Its honest limitation is equally important: it improves wall-clock speed and memory use but does not remove quadratic arithmetic or the linear KV-cache growth of autoregressive decoding.

## Question 3 — Optional social post

> Why are there so many attention mechanisms? Because the bottleneck kept moving. I built an interactive, source-verified timeline from scaled dot-product attention and positional encodings through sparse/linear attention, MQA/GQA/MLA, RoPE extensions, Gated DeltaNet, DroPE and DeepSeek's compressed sparse systems. The main lesson: longer context is not one number—it is a negotiation between exactness, compute, KV memory, position, training and retrieval. Explore the field guide: https://attention-field-guide-era5.ramachandran-shekar.chatgpt.site #ERA5 #Transformers #Attention #MachineLearning

After publishing the post, add its URL to the optional submission field.

## Final checklist

- [ ] Live URL added and tested in incognito mode
- [ ] GitHub repository is public
- [ ] README displays correctly on GitHub
- [ ] All 20 required mechanisms appear
- [ ] Mechanisms are chronologically ordered
- [ ] Every card contains both a benefit and a cost
- [ ] Primary-source links work
- [ ] Timeline filters work
- [ ] Mechanism detail dialog works
- [ ] Matrix experiment switches among all four patterns
- [ ] Comparison selectors update the table
- [ ] KV-cache calculator responds to every slider
- [ ] Question 2 response pasted into the assignment
- [ ] FlashAttention bonus entry named, dated and sourced
- [ ] Optional social URL submitted if published

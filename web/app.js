import { mechanisms, familyMeta } from "./data.js";

const timeline = document.querySelector("#timeline-list");
const dialog = document.querySelector("#mechanism-dialog");
const dialogContent = document.querySelector("#dialog-content");
const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

const eraMeta = {
  2017: ["The exactness era", "Global access and a way to represent order."],
  2019: ["The first cost crisis", "Remove edges—or share what decoding stores."],
  2021: ["Position becomes geometry", "Relative distance moves inside the attention score."],
  2023: ["The serving era", "Context stretches; the KV cache becomes a product constraint."],
  2025: ["The hybrid era", "Compression, state and learned sparse reads coexist."]
};

function formatDate(date) {
  return dateFormat.format(new Date(`${date}T00:00:00Z`));
}

function mechanismCard(item) {
  const meta = familyMeta[item.family];
  return `
    <article class="timeline-row" style="--family:${meta.color}" data-id="${item.id}">
      <time class="timeline-date" datetime="${item.date}">${formatDate(item.date)}</time>
      <i class="timeline-dot" aria-hidden="true"></i>
      <div class="mechanism-card">
        <div class="card-top">
          <span class="card-family">${meta.label}</span>
          ${item.bonus ? '<span class="card-badge">BONUS LANDMARK</span>' : ""}
        </div>
        <h3>${item.name}</h3>
        <p class="label">${item.label}</p>
        <p class="problem-line"><strong>Pressure:</strong> ${item.problem}</p>
        <div class="trade-grid">
          <div><small>WHAT IT BOUGHT</small><p>${item.buys}</p></div>
          <div><small>WHAT IT PAID</small><p>${item.gives}</p></div>
        </div>
        <div class="card-footer">
          <a class="source-name" href="${item.sourceUrl}" target="_blank" rel="noreferrer">${item.sourceTitle} ↗</a>
          <button class="inspect" type="button" data-inspect="${item.id}">Inspect the mechanism →</button>
        </div>
      </div>
    </article>`;
}

function renderTimeline(family = "all") {
  const visible = family === "all" ? mechanisms : mechanisms.filter(item => item.family === family);
  let previousEra = null;
  const html = [];

  visible.forEach(item => {
    const year = Number(item.date.slice(0, 4));
    const eraYear = year >= 2025 ? 2025 : year >= 2023 ? 2023 : year >= 2021 ? 2021 : year >= 2019 ? 2019 : 2017;
    if (eraYear !== previousEra) {
      const [name, note] = eraMeta[eraYear];
      html.push(`<div class="era-break"><time>${eraYear}</time><div><strong>${name}</strong><span>${note}</span></div></div>`);
      previousEra = eraYear;
    }
    html.push(mechanismCard(item));
  });

  timeline.innerHTML = html.join("") || '<div class="empty-state">No mechanism matches this pressure.</div>';
  timeline.querySelectorAll("[data-inspect]").forEach(button => {
    button.addEventListener("click", () => openMechanism(button.dataset.inspect));
  });
}

function openMechanism(id) {
  const item = mechanisms.find(entry => entry.id === id);
  if (!item) return;
  const meta = familyMeta[item.family];
  dialogContent.innerHTML = `
    <article class="dialog-body" style="--family:${meta.color}">
      <span class="dialog-date">${formatDate(item.date)} · ${meta.label.toUpperCase()}</span>
      <h2 id="dialog-title">${item.name}</h2>
      <p class="dialog-label">${item.label}</p>
      <div class="dialog-metrics">
        <div><small>Compute</small><strong>${item.compute}</strong></div>
        <div><small>Memory</small><strong>${item.cache}</strong></div>
        <div><small>Access</small><strong>${item.exactness}</strong></div>
        <div><small>Context</small><strong>${item.context}</strong></div>
      </div>
      <dl>
        <dt>Problem before it</dt><dd>${item.problem}</dd>
        <dt>The move</dt><dd>${item.move}</dd>
        <dt>What it buys</dt><dd>${item.buys}</dd>
        <dt>What it gives up</dt><dd>${item.gives}</dd>
        <dt>Choose it when</dt><dd>${item.choose}</dd>
        <dt>What came next</dt><dd>${item.next}</dd>
      </dl>
      <a class="dialog-source" href="${item.sourceUrl}" target="_blank" rel="noreferrer">Read primary source: ${item.sourceTitle} ↗</a>
    </article>`;
  dialog.showModal();
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderTimeline(button.dataset.family);
  });
});

document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});
document.querySelector("#surprise-me").addEventListener("click", () => {
  openMechanism(mechanisms[Math.floor(Math.random() * mechanisms.length)].id);
});

const matrix = document.querySelector("#attention-matrix");
const patternCost = document.querySelector("#pattern-cost");
const patternNote = document.querySelector("#pattern-note");
const patternNotes = {
  dense: "Exact causal access to the entire prefix.",
  window: "Bounded and cheap, but distant evidence disappears.",
  sparse: "Structured global routes without every possible edge.",
  topk: "Relevant edges only—if the selector can find them cheaply."
};

function isActive(pattern, row, column) {
  if (column > row) return false;
  if (pattern === "dense") return true;
  if (pattern === "window") return row - column < 3;
  if (pattern === "sparse") return row - column < 2 || column % 4 === 0;
  return column === row || column === Math.max(0, row - 3) || column === 0;
}

function renderMatrix(pattern) {
  let edges = 0;
  const cells = [];
  for (let row = 0; row < 12; row += 1) {
    for (let column = 0; column < 12; column += 1) {
      const active = isActive(pattern, row, column);
      if (active) edges += 1;
      cells.push(`<i class="matrix-cell ${active ? "active" : ""} ${active && pattern === "topk" ? "selected" : ""}" title="query ${row + 1}, key ${column + 1}"></i>`);
    }
  }
  matrix.innerHTML = cells.join("");
  matrix.setAttribute("aria-label", `${pattern} causal attention matrix with ${edges} allowed edges out of 144`);
  patternCost.textContent = `${edges} / 144 edges`;
  patternNote.textContent = patternNotes[pattern];
}

document.querySelectorAll("#pattern-controls button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#pattern-controls button").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderMatrix(button.dataset.pattern);
  });
});

const compareA = document.querySelector("#compare-a");
const compareB = document.querySelector("#compare-b");
const compareTable = document.querySelector("#compare-table");
const optionHtml = mechanisms.map(item => `<option value="${item.id}">${item.name}</option>`).join("");
compareA.innerHTML = optionHtml;
compareB.innerHTML = optionHtml;
compareA.value = "standard-attention";
compareB.value = "linear-attention";

function updateCompare() {
  const a = mechanisms.find(item => item.id === compareA.value);
  const b = mechanisms.find(item => item.id === compareB.value);
  const rows = [
    ["Mechanism", a.name, b.name],
    ["Compute", a.compute, b.compute],
    ["Memory", a.cache, b.cache],
    ["Access", a.exactness, b.exactness],
    ["Context", a.context, b.context],
    ["Choose when", a.choose, b.choose],
    ["Main cost", a.gives, b.gives]
  ];
  compareTable.innerHTML = rows.map((row, index) => `<div class="compare-row ${index === 0 ? "head" : ""}"><b>${row[0]}</b><span>${row[1]}</span><span>${row[2]}</span></div>`).join("");
}
compareA.addEventListener("change", updateCompare);
compareB.addEventListener("change", updateCompare);

const cacheInputs = ["layers", "heads", "context", "batch"].map(id => document.querySelector(`#${id}`));
function compactTokens(value) { return value >= 1024 ? `${Math.round(value / 1024)}K` : String(value); }
function updateCache() {
  const [layers, heads, context, batch] = cacheInputs.map(input => Number(input.value));
  const bytes = 2 * layers * heads * 128 * context * batch * 2;
  const gib = bytes / (1024 ** 3);
  document.querySelector("#layers-out").textContent = layers;
  document.querySelector("#heads-out").textContent = heads;
  document.querySelector("#context-out").textContent = compactTokens(context);
  document.querySelector("#batch-out").textContent = batch;
  document.querySelector("#cache-value").textContent = `${gib.toFixed(gib >= 10 ? 1 : 2)} GiB`;
  document.querySelector("#cache-bar").style.width = `${Math.min(100, Math.max(2, gib / 64 * 100))}%`;
  const family = heads === 1 ? "MQA-like" : heads <= 8 ? "GQA-like" : "MHA-like";
  document.querySelector("#cache-explain").textContent = `${family} cache for ${batch} ${batch === 1 ? "sequence" : "sequences"}. It still grows linearly with context.`;
}
cacheInputs.forEach(input => input.addEventListener("input", updateCache));

document.querySelector("#source-ledger").innerHTML = mechanisms.map(item => `
  <li><time datetime="${item.date}">${formatDate(item.date)}</time><strong>${item.name} — ${item.sourceTitle}</strong><a href="${item.sourceUrl}" target="_blank" rel="noreferrer">OPEN ↗</a></li>`).join("");

window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector("#scroll-meter").style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}, { passive: true });

document.querySelector("#all-count").textContent = mechanisms.length;
renderTimeline();
renderMatrix("dense");
updateCompare();
updateCache();

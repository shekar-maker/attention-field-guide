import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { mechanisms, requiredIds } from "../web/data.js";

test("every required attention mechanism is covered", () => {
  const ids = new Set(mechanisms.map(item => item.id));
  assert.deepEqual(requiredIds.filter(id => !ids.has(id)), []);
});

test("mechanism identifiers and dates are unique", () => {
  assert.equal(new Set(mechanisms.map(item => item.id)).size, mechanisms.length);
  assert.equal(new Set(mechanisms.map(item => `${item.date}:${item.id}`)).size, mechanisms.length);
});

test("timeline is strictly chronological except legitimate same-day landmarks", () => {
  const dates = mechanisms.map(item => item.date);
  assert.deepEqual(dates, [...dates].sort());
});

test("every entry states the problem, bargain, selection rule and primary source", () => {
  const required = ["problem", "move", "buys", "gives", "choose", "next", "sourceTitle", "sourceUrl"];
  for (const item of mechanisms) {
    for (const field of required) assert.ok(item[field]?.length > 12, `${item.id} is missing ${field}`);
    assert.match(item.sourceUrl, /^https:\/\//, `${item.id} source must be HTTPS`);
  }
});

test("anchor dates match the verified source ledger", () => {
  const expected = {
    "standard-attention": "2017-06-12",
    "mqa": "2019-11-06",
    "linear-attention": "2020-06-29",
    "rope": "2021-04-20",
    "alibi": "2021-08-27",
    "gqa": "2023-05-22",
    "mla": "2024-05-07",
    "gated-deltanet": "2024-12-09",
    "drope": "2025-12-13",
    "deepseek-v4": "2026-04-24"
  };
  for (const [id, date] of Object.entries(expected)) {
    assert.equal(mechanisms.find(item => item.id === id)?.date, date);
  }
});

test("page exposes the timeline, experiments, forecast and audit trail", async () => {
  const html = await readFile(new URL("../web/index.html", import.meta.url), "utf8");
  for (const id of ["timeline", "lab", "forecast", "sources"]) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /correctness before spectacle/i);
});

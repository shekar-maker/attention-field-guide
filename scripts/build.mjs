import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const web = path.join(root, "web");
const dist = path.join(root, "dist");
const client = path.join(dist, "client");

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });

for (const file of ["index.html", "styles.css", "app.js", "data.js"]) {
  await cp(path.join(web, file), path.join(client, file));
}
if (existsSync(path.join(web, "og.png"))) {
  await cp(path.join(web, "og.png"), path.join(client, "og.png"));
}

const textAssets = {};
for (const [route, file, contentType] of [
  ["/", "index.html", "text/html; charset=utf-8"],
  ["/index.html", "index.html", "text/html; charset=utf-8"],
  ["/styles.css", "styles.css", "text/css; charset=utf-8"],
  ["/app.js", "app.js", "text/javascript; charset=utf-8"],
  ["/data.js", "data.js", "text/javascript; charset=utf-8"]
]) {
  textAssets[route] = { body: await readFile(path.join(web, file), "utf8"), contentType };
}

const sourceHtml = await readFile(path.join(web, "index.html"), "utf8");
const sourceCss = await readFile(path.join(web, "styles.css"), "utf8");
const sourceData = (await readFile(path.join(web, "data.js"), "utf8"))
  .replaceAll("export const ", "const ");
const sourceApp = (await readFile(path.join(web, "app.js"), "utf8"))
  .replace(/^import .*?;\r?\n/, "");
const preview = sourceHtml
  .replace('<link rel="stylesheet" href="/styles.css">', `<style>${sourceCss}</style>`)
  .replace('<script type="module" src="/app.js"></script>', `<script type="module">${sourceData}\n${sourceApp}</script>`);
await writeFile(path.join(dist, "preview.html"), preview, "utf8");

await mkdir(path.join(dist, "server"), { recursive: true });
await writeFile(path.join(dist, "server", "index.js"), `
const assets = ${JSON.stringify(textAssets)};
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (env?.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) return response;
    }
    const asset = assets[url.pathname];
    if (!asset) return new Response("Not found", { status: 404 });
    return new Response(asset.body, {
      headers: {
        "content-type": asset.contentType,
        "cache-control": url.pathname === "/" ? "no-cache" : "public, max-age=3600",
        "x-content-type-options": "nosniff"
      }
    });
  }
};
`, "utf8");

await mkdir(path.join(dist, ".openai"), { recursive: true });
await cp(path.join(root, ".openai", "hosting.json"), path.join(dist, ".openai", "hosting.json"));
console.log(`Built ${Object.keys(textAssets).length} routes in dist/`);

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), "web");
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png" };

createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, `http://localhost:${port}`).pathname;
    const relative = pathname === "/" ? "index.html" : pathname.slice(1);
    const resolved = path.resolve(root, relative);
    if (!resolved.startsWith(path.resolve(root))) throw new Error("Unsafe path");
    const body = await readFile(resolved);
    response.writeHead(200, { "content-type": types[path.extname(resolved)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`Local URL: http://127.0.0.1:${port}`));

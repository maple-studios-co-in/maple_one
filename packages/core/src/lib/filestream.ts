import "server-only";
import fs from "node:fs";
import { Readable } from "node:stream";

export function fileResponse(path: string, contentType: string, opts: { download?: string; cache?: string } = {}) {
  if (!fs.existsSync(path)) return new Response("Not found", { status: 404 });
  const stat = fs.statSync(path);
  const stream = Readable.toWeb(fs.createReadStream(path)) as unknown as ReadableStream;
  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Content-Length": String(stat.size),
    "Cache-Control": opts.cache || "public, max-age=3600",
  };
  if (opts.download) headers["Content-Disposition"] = `attachment; filename="${opts.download}"`;
  return new Response(stream, { headers });
}

/** Range-aware streaming (required for <video> seeking). */
export function rangeFileResponse(path: string, contentType: string, req: Request) {
  if (!fs.existsSync(path)) return new Response("Not found", { status: 404 });
  const size = fs.statSync(path).size;
  const range = req.headers.get("range");
  if (range) {
    const m = /bytes=(\d+)-(\d*)/.exec(range);
    if (m) {
      const start = parseInt(m[1], 10);
      const end = m[2] ? Math.min(parseInt(m[2], 10), size - 1) : size - 1;
      const chunk = end - start + 1;
      const stream = Readable.toWeb(fs.createReadStream(path, { start, end })) as unknown as ReadableStream;
      return new Response(stream, {
        status: 206,
        headers: { "Content-Type": contentType, "Content-Range": `bytes ${start}-${end}/${size}`, "Accept-Ranges": "bytes", "Content-Length": String(chunk), "Cache-Control": "public, max-age=3600" },
      });
    }
  }
  const stream = Readable.toWeb(fs.createReadStream(path)) as unknown as ReadableStream;
  return new Response(stream, { headers: { "Content-Type": contentType, "Content-Length": String(size), "Accept-Ranges": "bytes", "Cache-Control": "public, max-age=3600" } });
}

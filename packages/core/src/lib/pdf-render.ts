import "server-only";
import fs from "node:fs";
import sharp from "sharp";
import { pagesDir, coverPath, pagePath, ensureDir } from "./storage";

const PAGE_WIDTH = 1600;   // crisp but light
const PAGE_QUALITY = 72;
const COVER_WIDTH = 900;

/** Rasterize every page of `srcPdf` to webp under the collection's pages dir and
 *  write a cover from page 1. Returns the page count. */
export async function renderCollectionPdf(id: string, srcPdf: string): Promise<number> {
  const { pdf } = await import("pdf-to-img");
  ensureDir(pagesDir(id));
  const doc = await pdf(srcPdf, { scale: 2 });
  const count = doc.length;
  let n = 0;
  for await (const png of doc) {
    n += 1;
    await sharp(png).resize({ width: PAGE_WIDTH }).webp({ quality: PAGE_QUALITY }).toFile(pagePath(id, n));
    if (n === 1) await sharp(png).resize({ width: COVER_WIDTH }).webp({ quality: 78 }).toFile(coverPath(id));
  }
  return count;
}

export function hasCover(id: string) {
  return fs.existsSync(coverPath(id));
}

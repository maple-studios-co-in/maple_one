import path from "node:path";
import fs from "node:fs";

/** Root for catalog lookbook files (originals + rendered pages). Configurable so
 *  it can live on a bigger disk / shared volume in production. */
export const STORAGE_ROOT = process.env.CATALOG_STORAGE || path.join(process.cwd(), ".catalog-store");

export function collectionDir(id: string) {
  return path.join(STORAGE_ROOT, "collections", id);
}
export function pagesDir(id: string) {
  return path.join(collectionDir(id), "pages");
}
export function pdfPath(id: string) {
  return path.join(collectionDir(id), "original.pdf");
}
export function coverPath(id: string) {
  return path.join(collectionDir(id), "cover.webp");
}
export function pagePath(id: string, n: number) {
  return path.join(pagesDir(id), `p${String(n).padStart(3, "0")}.webp`);
}
export function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}
export function rmCollection(id: string) {
  fs.rmSync(collectionDir(id), { recursive: true, force: true });
}

// --- Photoshoot Studio ---
export function shootDir(id: string) {
  return path.join(STORAGE_ROOT, "shoots", id);
}
export function shootSourcePath(id: string) {
  return path.join(shootDir(id), "source.webp");
}
export function shootVideoPath(id: string) {
  return path.join(shootDir(id), "video.mp4");
}
export function shootPosterPath(id: string) {
  return path.join(shootDir(id), "poster.jpg");
}
export function rmShoot(id: string) {
  fs.rmSync(shootDir(id), { recursive: true, force: true });
}

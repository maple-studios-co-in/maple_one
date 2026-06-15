import "server-only";
import { spawn } from "node:child_process";
import { shootVideoPath, shootPosterPath } from "./storage";

/** Best-effort first-frame poster via ffmpeg if it's on PATH; silently skips otherwise. */
export function makePoster(id: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const p = spawn("ffmpeg", ["-y", "-i", shootVideoPath(id), "-vframes", "1", "-vf", "scale=900:-1", shootPosterPath(id)], { stdio: "ignore" });
      p.on("error", () => resolve());
      p.on("close", () => resolve());
    } catch { resolve(); }
  });
}

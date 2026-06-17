import "server-only";
import { spawn } from "node:child_process";
import { writeFileSync, renameSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function dataUriToBuffer(dataUri: string): Buffer | null {
  const m = /^data:(.+?);base64,(.*)$/s.exec(dataUri);
  return m ? Buffer.from(m[2], "base64") : null;
}

/** Overlay the logo (bottom-right) onto a video in place, via ffmpeg. Best-effort. */
export function watermarkVideo(videoPath: string, logoDataUri: string): Promise<boolean> {
  return new Promise((resolve) => {
    const logoBuf = dataUriToBuffer(logoDataUri);
    if (!logoBuf) return resolve(false);
    const logo = join(tmpdir(), `wm-${Date.now()}.png`);
    try { writeFileSync(logo, logoBuf); } catch { return resolve(false); }
    const out = videoPath + ".wm.mp4";
    const filter = "[1:v]scale=iw*0.18:-1,format=rgba,colorchannelmixer=aa=0.75[wm];[0:v][wm]overlay=W-w-24:H-h-24";
    const p = spawn("ffmpeg", ["-y", "-i", videoPath, "-i", logo, "-filter_complex", filter, "-c:a", "copy", out], { stdio: "ignore" });
    const done = (ok: boolean) => { try { unlinkSync(logo); } catch {} if (ok) { try { renameSync(out, videoPath); } catch { ok = false; } } else { try { unlinkSync(out); } catch {} } resolve(ok); };
    p.on("error", () => done(false));
    p.on("close", (code) => done(code === 0));
  });
}

/** Composite the logo (bottom-right) onto an image buffer, via sharp. */
export async function watermarkImage(buf: Buffer, logoDataUri: string, width: number): Promise<Buffer> {
  try {
    const sharp = (await import("sharp")).default;
    const logoBuf = dataUriToBuffer(logoDataUri);
    if (!logoBuf) return buf;
    const logoW = Math.round(width * 0.18);
    const logo = await sharp(logoBuf).resize({ width: logoW }).png().toBuffer();
    return await sharp(buf).composite([{ input: logo, gravity: "southeast" }]).toBuffer();
  } catch {
    return buf;
  }
}

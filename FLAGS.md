# Feature flags (Flipt)

Every tool — and any feature — can be turned on/off **per environment** without a redeploy,
using a self-hosted **Flipt** instance (one per environment, runs as a compose service).

## How it works
- Each env's apps read `FLIPT_URL` (e.g. `http://flipt:8080`) and ask Flipt whether a flag is on.
- **Fail-open:** if a flag doesn't exist, or Flipt is unreachable, the thing is **ON**. So you only
  create a flag when you want to **turn something off** or roll a new feature out gradually.
- Results are cached ~30s.

## Flag keys
- **Whole tool:** `tool.<name>` — e.g. `tool.quotations`, `tool.photoshoot`.
  Disabled → that tool shows a "turned off" page and disappears from the launcher/sidebar.
- **A feature inside a tool:** `<tool>.<feature>` — e.g. `quotations.excel_import`.
  In server code: `if (await isEnabled("quotations.excel_import")) { … }`
  (from `@maple/core/lib/flags`). For a feature inside a client screen, check it in that tool's
  server layout/page (or a small `/api/flags` route) and pass the result down.

## Managing flags
Open the Flipt console at **https://flags.maplefurnishers.com** (protect it — see the note in
`Caddyfile`). Create a **boolean** flag with the key above and toggle it. Because each environment
runs its own Flipt, dev / stage / prod are independent — you can ship a feature to stage with its
flag on while it stays off in prod.

## Local dev
No Flipt runs locally by default, so `FLIPT_URL` is unset → **everything is enabled** (fail-open).
To test flag behavior locally, run Flipt (`docker run -p 8080:8080 flipt/flipt`) and set
`FLIPT_URL=http://localhost:8080` for the app you're testing.

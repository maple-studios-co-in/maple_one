export type Step = { text: string; shot?: string };
export type Guide = { slug: string; title: string; tool?: string; tagline: string; intro: string; steps: Step[]; section?: "guide" | "dev"; body?: string };

export const GUIDES: Guide[] = [
  {
    slug: "getting-started", title: "Getting started", tagline: "Sign in once, use every tool.",
    intro: "MapleOne is one workspace split across subdomains. You sign in at admin.maplefurnishers.com and that login carries to every tool. What you can see and do depends on your role.",
    steps: [
      { text: "Go to admin.maplefurnishers.com and sign in with your email and password.", shot: "login" },
      { text: "The launcher shows every tool you have access to. Click one to open it.", shot: "launcher" },
      { text: "Inside any tool, the left sidebar jumps you between tools — you stay signed in across all of them.", shot: "shell" },
      { text: "Use the avatar menu (top-right) to change your password or sign out." },
    ],
  },
  {
    slug: "leads", title: "Leads", tool: "leads", tagline: "Capture enquiries and track them to won or lost.",
    intro: "Leads is where new enquiries land. Log a lead, then move it through the pipeline as you follow up.",
    steps: [
      { text: "Add a lead with the form at the top — name, phone, source and an estimated value.", shot: "new" },
      { text: "Change a lead's stage with the status dropdown: new → contacted → quoted → won / lost.", shot: "overview" },
      { text: "The header shows your open pipeline value so you always know what's in play." },
    ],
  },
  {
    slug: "crm", title: "Clients (CRM)", tool: "crm", tagline: "One record per client, linking everything.",
    intro: "Clients is the hub. Each client ties together their leads, quotations, orders and invoices, and marks them B2B or B2C.",
    steps: [
      { text: "Add a client with name, company, type (B2B/B2C), phone and GSTIN.", shot: "new" },
      { text: "The activity column shows counts of that client's leads, quotes, orders and invoices.", shot: "overview" },
      { text: "Set a client's status (lead / active / dormant) from the dropdown." },
    ],
  },
  {
    slug: "quotations", title: "Quotations", tool: "quotations", tagline: "Branded, room-wise quotation PDFs.",
    intro: "Build a detailed, room-by-room quotation and export a polished PDF. Saved quotes flow into Clients and reports.",
    steps: [
      { text: "Fill the Overview tab with the client and quote details.", shot: "overview" },
      { text: "In Rooms & Items, add rooms and line items (use the template picker to add common pieces fast).", shot: "rooms" },
      { text: "Set discounts, GST and terms in Finance & T&C; bank details in Settlement.", shot: "finance" },
      { text: "Click Save to store it (it links to the client), and Generate PDF to download the proposal.", shot: "pdf" },
      { text: "The Saved tab lists everything stored in the system — load or delete past quotes." },
    ],
  },
  {
    slug: "tasks", title: "Tasks", tool: "tasks", tagline: "Assign work and track it on a board.",
    intro: "A simple Kanban for the team. Create tasks, assign them, and drag them across stages.",
    steps: [
      { text: "Add a task with a title, assignee, priority and due date.", shot: "new" },
      { text: "Move a task between To do / In progress / Blocked / Done with the arrow buttons.", shot: "overview" },
      { text: "Overdue tasks show their date in red." },
    ],
  },
  {
    slug: "orders", title: "Orders", tool: "orders", tagline: "From accepted quote to installed.",
    intro: "Track each job as it moves through production. A won quotation becomes an order you can follow to delivery.",
    steps: [
      { text: "Create an order with a title, value and delivery date.", shot: "new" },
      { text: "Advance an order across Accepted → In production → Out for delivery → Installed.", shot: "overview" },
    ],
  },
  {
    slug: "challans", title: "Delivery challans", tool: "challans", tagline: "Dispatch notes & gate passes.",
    intro: "Record what's leaving the workshop — items, vehicle and driver — and track delivery status.",
    steps: [
      { text: "Add a challan with the items dispatched, vehicle number and driver.", shot: "new" },
      { text: "Move it from Prepared → Dispatched → Delivered.", shot: "overview" },
    ],
  },
  {
    slug: "invoices", title: "Invoices", tool: "invoices", tagline: "GST invoices with live preview.",
    intro: "Create a GST invoice with a live preview, save it (it creates a due payment automatically), and export a PDF.",
    steps: [
      { text: "Enter client, line items, discounts and GST — the preview updates as you type.", shot: "overview" },
      { text: "Click Save to store it and add it to Payments as a due amount; Download PDF for the document.", shot: "pdf" },
    ],
  },
  {
    slug: "payments", title: "Payments & reminders", tool: "payments", tagline: "Dues, overdue and reminders.",
    intro: "Track advance/balance amounts against invoices, see what's overdue, and copy a reminder message.",
    steps: [
      { text: "Add a payment (label, amount, method, due date) — saved invoices appear here automatically.", shot: "overview" },
      { text: "Use Remind to copy a ready reminder message, and Mark paid when it's settled." },
    ],
  },
  {
    slug: "catalog", title: "Catalog (collections)", tool: "catalog", tagline: "Theme collections + shareable lookbooks.",
    intro: "Organise products into theme collections, tag them by space and category, upload a lookbook PDF, and share a public link with clients.",
    steps: [
      { text: "Create a collection (theme, spaces, categories).", shot: "new" },
      { text: "Upload the lookbook PDF — it becomes a fast full-screen flipbook.", shot: "overview" },
      { text: "Publish it and Copy link to share a public, no-login viewer with clients.", shot: "preview" },
    ],
  },
  {
    slug: "photoshoot", title: "Photoshoot Studio", tool: "photoshoot", tagline: "Cinematic product videos.",
    intro: "Turn product renders into cinematic videos, preview them, and share a public link.",
    steps: [
      { text: "Create a shoot (product, colorway, style).", shot: "new" },
      { text: "Upload the generated video or import it by URL from your AI pipeline.", shot: "overview" },
      { text: "Publish and copy the public link to share the player." },
    ],
  },
  {
    slug: "inventory", title: "Inventory", tool: "inventory", tagline: "Stock with reorder alerts.",
    intro: "Track timber, fabric, hardware and finished-goods stock, with low-stock flags.",
    steps: [
      { text: "Add an item with category, unit, quantity and reorder level.", shot: "new" },
      { text: "Adjust stock with +/–; items at or below their reorder level are flagged.", shot: "overview" },
    ],
  },
  {
    slug: "purchase-orders", title: "Purchase orders", tool: "purchase-orders", tagline: "Commitments to vendors.",
    intro: "Raise POs to suppliers and track them to received.",
    steps: [
      { text: "Add a PO with vendor, items, total and expected date.", shot: "new" },
      { text: "Move it Draft → Sent → Received.", shot: "overview" },
    ],
  },
  {
    slug: "price-list", title: "Price list", tool: "price-list", tagline: "Products, materials and rates.",
    intro: "The product/rate list that feeds quotations.",
    steps: [
      { text: "Add a product with SKU, category, rate and unit.", shot: "new" },
      { text: "Toggle Published to mark items live.", shot: "overview" },
    ],
  },
  {
    slug: "finance", title: "Finance", tool: "finance", tagline: "Income, expenses and dues.",
    intro: "A running ledger of income and expenses.",
    steps: [{ text: "Record income or expense entries and review the running totals.", shot: "overview" }],
  },
  {
    slug: "expenses", title: "Expense log", tool: "expenses", tagline: "Operational spend by category.",
    intro: "Log day-to-day operational expenses by category, vendor and method.",
    steps: [{ text: "Add an expense (category, vendor, amount, method, date); the header shows this month vs all-time.", shot: "overview" }],
  },
  {
    slug: "hr", title: "HR documents", tool: "hr", tagline: "Offer, appointment, relieving letters.",
    intro: "Generate standard HR letters as PDFs.",
    steps: [
      { text: "Pick the document type and fill the employee details.", shot: "overview" },
      { text: "Download the PDF." },
    ],
  },
  {
    slug: "users", title: "Team & access", tool: "users", tagline: "Users, roles and permissions.",
    intro: "Admin-only. Manage who's on the team, what roles exist, and what each role can do.",
    steps: [
      { text: "On the Users tab, add people and assign each a role; enable/disable or reset passwords.", shot: "overview" },
      { text: "On the Roles tab, tick which tools and actions each role gets, or create a custom role.", shot: "roles" },
      { text: "After changing a role's permissions, members sign in again to pick up the change." },
    ],
  },
];

export function guideToHtml(g: Guide): string {
  const steps = g.steps.map((st, i) => `<li>${st.text}</li>`).join("");
  return `<p>${g.intro}</p><ol>${steps}</ol>`;
}

// ---------- Developer documentation ----------
const D: Guide[] = [
  {
    slug: "dev-architecture", title: "Architecture", section: "dev",
    tagline: "How the suite fits together.", intro: "",
    steps: [],
    body: `
<p>MapleOne is an <strong>npm-workspaces + Turborepo monorepo</strong>. Each tool is its own
Next.js 16 app; shared code lives in two packages.</p>
<pre><code>packages/
  db/    @maple/db    Prisma schema + client
  core/  @maple/core  auth/session/sso/rbac, UI kit, theme, brand, flags, tenant-db
apps/
  web/       marketing (Vite)      -> maplefurnishers.com
  admin/     login + launcher      -> admin.maplefurnishers.com
  docs/      this docs site        -> docs.maplefurnishers.com
  &lt;tool&gt;/    one app per tool      -> &lt;tool&gt;.maplefurnishers.com</code></pre>
<h3>Request flow</h3>
<p>Caddy terminates HTTPS and routes each subdomain to its app. Each app's <code>middleware.ts</code>
checks the session cookie and the tool permission; unauthenticated requests redirect to the central
<code>admin</code> login. One <code>mt_session</code> cookie scoped to <code>.maplefurnishers.com</code>
is shared across every subdomain (stateless SSO — same <code>AUTH_SECRET</code>).</p>
<h3>Shared packages</h3>
<ul>
<li><strong>@maple/db</strong> — the Prisma schema and a singleton client. One database backs everything.</li>
<li><strong>@maple/core</strong> — <code>session/auth/sso/rbac</code>, the <code>ui/</code> kit + Tailwind theme,
the <code>SuiteShell</code>, plus <code>brand</code>, <code>flags</code>, <code>tenant-db</code> and shared libs.</li>
</ul>
<p>Apps consume them via <code>transpilePackages: ["@maple/core","@maple/db"]</code> in <code>next.config.ts</code>.</p>`,
  },
  {
    slug: "dev-local", title: "Local development", section: "dev",
    tagline: "Run the whole thing on your machine.", intro: "",
    steps: [],
    body: `
<h3>One command</h3>
<pre><code>bash scripts/dev.sh</code></pre>
<p>It starts Postgres (Docker, :5544), installs deps, runs <code>prisma push</code> + <code>seed</code>,
adds the <code>*.maplefurnishers.com</code> entries to <code>/etc/hosts</code>, launches the marketing site +
admin + every tool, and finally Caddy (HTTPS on :443, needs sudo). Stop with <code>bash scripts/stop.sh</code>.</p>
<p>Then open <strong>https://admin.maplefurnishers.com</strong> and sign in with
<code>admin@maplefurnishers.com / maple@123</code>.</p>
<h3>Manual / single app</h3>
<pre><code># a single tool against the DB
DATABASE_URL=postgresql://postgres:maple@localhost:5544/mapletools \
  npm run -w @maple/app-leads dev -- -p 3002
# the marketing site only
npm run -w @maple/app-web dev          # http://localhost:5173</code></pre>
<p>Each app reads its <code>.env.local</code> (DATABASE_URL, AUTH_SECRET, COOKIE_DOMAIN, LOGIN_URL).
Ports are fixed per tool — see <code>PORTS.local.txt</code>. Caddy config for local certs is
<code>Caddyfile.local</code>.</p>
<h3>Gotchas</h3>
<ul>
<li>Run <code>npm install</code> after pulling a <em>new</em> app, or its workspace won't be linked.</li>
<li>The marketing dev server must bind <code>--host 127.0.0.1</code> so Caddy (IPv4) can reach it.</li>
<li>A real domain (the apex) needs the <code>/etc/hosts</code> override; if a page shows the live site,
disable Chrome "Secure DNS" or use an incognito window.</li>
</ul>`,
  },
  {
    slug: "dev-add-tool", title: "Adding a tool", section: "dev",
    tagline: "Scaffold a new app the right way.", intro: "",
    steps: [],
    body: `
<pre><code>bash scripts/new-tool.sh &lt;name&gt; "&lt;Label&gt;"</code></pre>
<p>That stamps <code>apps/&lt;name&gt;</code> from the template (config, middleware, layout, a stub page + API).
Then wire it into:</p>
<ul>
<li><code>packages/core/src/lib/nav.ts</code> — add to <code>TOOLS</code> (sidebar + launcher).</li>
<li><code>packages/core/src/lib/rbac.ts</code> — the legacy fallback map, and grant <code>tool:&lt;name&gt;</code>
in <code>prisma/seed.mjs</code> roles.</li>
<li><code>Caddyfile</code>, <code>Caddyfile.local</code>, <code>docker-compose.yml</code>, <code>scripts/dev.sh</code>
(host + a port).</li>
</ul>
<h3>Data &amp; isolation</h3>
<p>Add your model to <code>packages/db/prisma/schema.prisma</code> with a <code>tenantId String?</code> field, then
<code>npm run -w @maple/db push</code>. In API routes use <code>tenantDb()</code> instead of <code>prisma</code> so
reads are tenant-filtered and creates are tenant-stamped automatically:</p>
<pre><code>import { tenantDb } from "@maple/core/lib/tenant-db";
const db = await tenantDb();
const rows = await db.myModel.findMany();      // scoped to the current tenant
await db.myModel.create({ data: { ... } });    // tenantId stamped</code></pre>`,
  },
  {
    slug: "dev-auth", title: "Auth, roles & permissions", section: "dev",
    tagline: "Session, RBAC and middleware.", intro: "",
    steps: [],
    body: `
<h3>Session</h3>
<p>Login (in the <code>admin</code> app) verifies the user with bcrypt, resolves their role's permissions and
tenant, and signs a <strong>jose HS256 JWT</strong> stored in the httpOnly <code>mt_session</code> cookie. The
payload carries <code>{ sub, email, role, perms[], tid }</code>. Any app verifies it with the shared
<code>AUTH_SECRET</code> — no session store.</p>
<h3>Permissions</h3>
<p>A role is a bundle of permission keys: <code>tool:&lt;name&gt;</code> (open a tool) and
<code>act:&lt;action&gt;</code> (delete/export/publish/manage_*). <code>admin</code> holds <code>*</code>.</p>
<pre><code>import { canAccessTool, can } from "@maple/core/lib/rbac";
canAccessTool(user.perms, "quotations", user.role); // tool access (legacy fallback)
can(user.perms, "delete");                           // a sensitive action</code></pre>
<p>Each tool's <code>middleware.ts</code> calls <code>canAccessTool</code> and redirects to <code>LOGIN_URL</code>
when there's no session. Manage roles + assignments in the <strong>Team &amp; access</strong> tool.
Changing a role requires members to sign in again (perms live in the token).</p>`,
  },
  {
    slug: "dev-flags", title: "Feature flags", section: "dev",
    tagline: "Flipt, per environment.", intro: "",
    steps: [],
    body: `
<p>Each environment runs its own <strong>Flipt</strong> (a compose service). Apps read <code>FLIPT_URL</code>
and evaluate boolean flags; <strong>fail-open</strong> — a missing flag or an unreachable Flipt means ON.</p>
<pre><code>import { isEnabled } from "@maple/core/lib/flags";
if (await isEnabled("quotations.excel_import")) { /* gated feature */ }</code></pre>
<p>Keys: <code>tool.&lt;name&gt;</code> gates a whole tool (it disappears from the launcher + shows a
"turned off" page); <code>&lt;tool&gt;.&lt;feature&gt;</code> gates a feature. Toggle them in the Flipt console at
<code>flags.maplefurnishers.com</code> (protect it). See <code>FLAGS.md</code>.</p>`,
  },
  {
    slug: "dev-tenancy", title: "Multi-tenancy & branding", section: "dev",
    tagline: "Tenant isolation and white-label.", intro: "",
    steps: [],
    body: `
<h3>Tenants</h3>
<p>Every tenant-scoped model has a <code>tenantId</code>. The tenant is resolved from the request host
(registrable domain → <code>Tenant.domain</code>) or from the session. Use <code>getTenantId()</code> and the
<code>tenantDb()</code> client, which auto-filters reads and stamps creates. User emails, role names and
doc slugs are unique <em>per tenant</em>.</p>
<pre><code>import { getTenantId } from "@maple/core/lib/tenant";
import { tenantDb } from "@maple/core/lib/tenant-db";</code></pre>
<p><strong>Residual to harden:</strong> single <code>update/delete</code> by a unique id aren't auto-scoped —
guard them with a scoped <code>findFirst({ where: { id } })</code> first.</p>
<h3>Branding (white-label)</h3>
<p><code>getBrand()</code> / <code>currentTenant()</code> resolve the brand (name, logo, color) per host. The logo
is stored as a data-URI on the tenant and flows to the <code>SuiteShell</code> and the invoice/quotation/HR
PDFs (a <code>logo</code> prop fetched from each PDF app's <code>/api/brand</code>). Manage it at
<code>admin/branding</code>. Optional logo watermarking of photoshoot videos/images lives in
<code>@maple/core/lib/watermark.ts</code>.</p>`,
  },
  {
    slug: "dev-deploy", title: "Build, CI/CD & deploy", section: "dev",
    tagline: "From PR to production.", intro: "",
    steps: [],
    body: `
<h3>CI</h3>
<p><code>.github/workflows/ci.yml</code> runs <code>turbo run lint build</code> on every PR.
<code>deploy-stage.yml</code> / <code>deploy-prod.yml</code> deploy on merge to <code>develop</code> / <code>main</code>
by SSHing to the box and running <code>docker compose up -d --build</code> (set the GitHub Environment
secrets <code>DEPLOY_HOST/USER/SSH_KEY</code>).</p>
<h3>Production</h3>
<p>One parametrized <code>Dockerfile</code> builds every app; <code>docker-compose.yml</code> runs Postgres +
a one-off migrate/seed + one container per app (chosen via <code>$APP</code>) + Caddy (auto-HTTPS) + Flipt.
Config lives in <code>.env</code> (see <code>.env.example</code>). The full AWS walk-through is
<code>AWS-RUNBOOK-PHASE2.md</code> (Lightsail + RDS later + Route 53).</p>
<pre><code>cp .env.example .env   # set AUTH_SECRET, passwords
docker compose up -d --build</code></pre>`,
  },
];
GUIDES.push(...D);


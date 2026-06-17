export type Step = { text: string; shot?: string };
export type Guide = { slug: string; title: string; tool?: string; tagline: string; intro: string; steps: Step[] };

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

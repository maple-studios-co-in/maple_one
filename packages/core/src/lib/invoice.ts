import { discountAmount, makeId, todayISODate } from "./utils";

export type DiscType = "flat" | "percent";

export type InvoiceItem = {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  price: number;
  discountValue: number;
  discountType: DiscType;
};

export type InvoiceData = {
  number: string;
  date: string;
  dueDate: string;
  client: { name: string; phone: string; address: string; gstin: string };
  items: InvoiceItem[];
  charges: {
    overallDiscountValue: number;
    overallDiscountType: DiscType;
    packingPercent: number;
    loadingCharge: number;
    gstPercent: number;
    gstMode: "excluded" | "included";
    splitCgstSgst: boolean;
  };
  payment: { bankName: string; accountName: string; accountNumber: string; ifsc: string; upiId: string };
  notes: string;
};

export type InvoiceTotals = {
  subtotal: number;
  itemDisc: number;
  overallDisc: number;
  taxable: number;
  packing: number;
  loading: number;
  gst: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
};

export function newInvoiceItem(p?: Partial<InvoiceItem>): InvoiceItem {
  return { id: makeId(), description: "", hsn: "", qty: 1, price: 0, discountValue: 0, discountType: "flat", ...p };
}

export function genInvoiceNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `MF-INV-${ymd}-${Math.floor(100 + Math.random() * 900)}`;
}

export function emptyInvoice(): InvoiceData {
  return {
    number: genInvoiceNumber(),
    date: todayISODate(),
    dueDate: "",
    client: { name: "", phone: "", address: "", gstin: "" },
    items: [newInvoiceItem()],
    charges: {
      overallDiscountValue: 0,
      overallDiscountType: "flat",
      packingPercent: 0,
      loadingCharge: 0,
      gstPercent: 18,
      gstMode: "excluded",
      splitCgstSgst: true,
    },
    payment: { bankName: "", accountName: "Maple Furnishers", accountNumber: "", ifsc: "", upiId: "" },
    notes: "Goods once sold will not be taken back. Subject to Delhi jurisdiction.",
  };
}

export function computeInvoiceTotals(d: InvoiceData): InvoiceTotals {
  const subtotal = d.items.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0);
  const itemDisc = d.items.reduce(
    (s, it) => s + discountAmount((it.qty || 0) * (it.price || 0), it.discountValue, it.discountType),
    0,
  );
  const afterItem = Math.max(0, subtotal - itemDisc);
  const overallDisc = discountAmount(afterItem, d.charges.overallDiscountValue, d.charges.overallDiscountType);
  const taxable = Math.max(0, afterItem - overallDisc);
  const packing = taxable * ((d.charges.packingPercent || 0) / 100);
  const loading = d.charges.loadingCharge || 0;
  const rate = (d.charges.gstPercent || 0) / 100;

  let base = taxable + packing + loading;
  let gst = base * rate;
  let grandTotal = base + gst;
  if (d.charges.gstMode === "included") {
    const incl = base;
    base = incl / (1 + rate);
    gst = incl - base;
    grandTotal = incl;
  }
  const cgst = d.charges.splitCgstSgst ? gst / 2 : 0;
  const sgst = d.charges.splitCgstSgst ? gst / 2 : 0;

  return { subtotal, itemDisc, overallDisc, taxable, packing, loading, gst, cgst, sgst, grandTotal };
}

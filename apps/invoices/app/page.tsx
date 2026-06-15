"use client";

import React, { useEffect, useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { money } from "@maple/core/lib/utils";
import { InvoiceData, InvoiceItem, emptyInvoice, newInvoiceItem, computeInvoiceTotals, genInvoiceNumber } from "@maple/core/lib/invoice";
import { InvoicePdf } from "./invoice-pdf";
import { Button } from "@maple/core/ui/button";
import { Input, Select, Textarea } from "@maple/core/ui/input";
import { Label } from "@maple/core/ui/label";

const LS_KEY = "mapleInvoice.last.v1";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div><Label>{label}</Label>{children}</div>);
}

export default function InvoicesPage() {
  const [data, setData] = useState<InvoiceData>(emptyInvoice);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { try { const raw = localStorage.getItem(LS_KEY); if (raw) setData(JSON.parse(raw)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {} }, [data]);

  const totals = useMemo(() => computeInvoiceTotals(data), [data]);
  const set = (patch: Partial<InvoiceData>) => setData((d) => ({ ...d, ...patch }));
  const setClient = (p: Partial<InvoiceData["client"]>) => setData((d) => ({ ...d, client: { ...d.client, ...p } }));
  const setCharges = (p: Partial<InvoiceData["charges"]>) => setData((d) => ({ ...d, charges: { ...d.charges, ...p } }));
  const setPayment = (p: Partial<InvoiceData["payment"]>) => setData((d) => ({ ...d, payment: { ...d.payment, ...p } }));
  const updateItem = (id: string, p: Partial<InvoiceItem>) => setData((d) => ({ ...d, items: d.items.map((it) => (it.id === id ? { ...it, ...p } : it)) }));
  const addItem = () => setData((d) => ({ ...d, items: [...d.items, newInvoiceItem()] }));
  const removeItem = (id: string) => setData((d) => ({ ...d, items: d.items.filter((it) => it.id !== id) }));

  const download = async () => {
    setDownloading(true);
    try {
      const blob = await pdf(<InvoicePdf data={data} totals={totals} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${data.number || "invoice"}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } finally { setDownloading(false); }
  };
  const [saving, setSaving] = useState(false);
  const onSave = async () => {
    if (!data.client.name) { alert("Add a client name first."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ number: data.number, total: totals.grandTotal, dueDate: data.dueDate || null, status: "unpaid", data, client: { name: data.client.name, phone: data.client.phone, address: data.client.address, gstin: data.client.gstin } }) });
      const j = await res.json().catch(() => ({}));
      alert(res.ok ? "Saved ✓ — added to Payments as a due amount." : (j.error || "Save failed"));
    } finally { setSaving(false); }
  };

  const reset = () => setData({ ...emptyInvoice(), number: genInvoiceNumber() });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <h2 className="font-serif text-2xl text-foreground">Invoice generator</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}>New</Button>
          <Button variant="secondary" size="sm" onClick={onSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          <Button size="sm" onClick={download} disabled={downloading}>{downloading ? "Preparing…" : "Download PDF"}</Button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
        <div className="space-y-6 overflow-y-auto border-r border-border p-6">
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-primary">Invoice</h3>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Invoice no."><Input value={data.number} onChange={(e) => set({ number: e.target.value })} /></Field>
              <Field label="Date"><Input type="date" value={data.date} onChange={(e) => set({ date: e.target.value })} /></Field>
              <Field label="Due date"><Input type="date" value={data.dueDate} onChange={(e) => set({ dueDate: e.target.value })} /></Field>
            </div>
          </section>
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-primary">Billed to</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Client name"><Input value={data.client.name} onChange={(e) => setClient({ name: e.target.value })} /></Field>
              <Field label="Phone"><Input value={data.client.phone} onChange={(e) => setClient({ phone: e.target.value })} /></Field>
              <Field label="GSTIN"><Input value={data.client.gstin} onChange={(e) => setClient({ gstin: e.target.value })} /></Field>
              <Field label="Address"><Input value={data.client.address} onChange={(e) => setClient({ address: e.target.value })} /></Field>
            </div>
          </section>
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wide text-primary">Line items</h3>
              <button onClick={addItem} className="text-xs font-medium text-primary hover:underline">+ Add item</button>
            </div>
            <div className="space-y-2">
              {data.items.map((it) => (
                <div key={it.id} className="grid grid-cols-12 gap-2 rounded-md border border-border p-2">
                  <div className="col-span-5"><Input placeholder="Description" value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} /></div>
                  <div className="col-span-2"><Input placeholder="HSN" value={it.hsn} onChange={(e) => updateItem(it.id, { hsn: e.target.value })} /></div>
                  <div className="col-span-1"><Input type="number" placeholder="Qty" value={it.qty} onChange={(e) => updateItem(it.id, { qty: Number(e.target.value) })} /></div>
                  <div className="col-span-2"><Input type="number" placeholder="Rate" value={it.price} onChange={(e) => updateItem(it.id, { price: Number(e.target.value) })} /></div>
                  <div className="col-span-1 flex items-center justify-end text-xs text-muted-foreground">{money((it.qty || 0) * (it.price || 0))}</div>
                  <div className="col-span-1 flex items-center justify-end"><button onClick={() => removeItem(it.id)} className="text-muted-foreground/50 hover:text-destructive">×</button></div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-primary">Charges & tax</h3>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Overall discount"><Input type="number" value={data.charges.overallDiscountValue} onChange={(e) => setCharges({ overallDiscountValue: Number(e.target.value) })} /></Field>
              <Field label="Disc. type"><Select value={data.charges.overallDiscountType} onChange={(e) => setCharges({ overallDiscountType: e.target.value as "flat" | "percent" })}><option value="flat">Flat</option><option value="percent">Percent</option></Select></Field>
              <Field label="Packing %"><Input type="number" value={data.charges.packingPercent} onChange={(e) => setCharges({ packingPercent: Number(e.target.value) })} /></Field>
              <Field label="Loading ₹"><Input type="number" value={data.charges.loadingCharge} onChange={(e) => setCharges({ loadingCharge: Number(e.target.value) })} /></Field>
              <Field label="GST %"><Input type="number" value={data.charges.gstPercent} onChange={(e) => setCharges({ gstPercent: Number(e.target.value) })} /></Field>
              <Field label="GST mode"><Select value={data.charges.gstMode} onChange={(e) => setCharges({ gstMode: e.target.value as "excluded" | "included" })}><option value="excluded">Add GST</option><option value="included">GST included</option></Select></Field>
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-foreground/80"><input type="checkbox" checked={data.charges.splitCgstSgst} onChange={(e) => setCharges({ splitCgstSgst: e.target.checked })} />Split into CGST + SGST</label>
          </section>
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-primary">Payment & notes</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Bank name"><Input value={data.payment.bankName} onChange={(e) => setPayment({ bankName: e.target.value })} /></Field>
              <Field label="A/c name"><Input value={data.payment.accountName} onChange={(e) => setPayment({ accountName: e.target.value })} /></Field>
              <Field label="A/c number"><Input value={data.payment.accountNumber} onChange={(e) => setPayment({ accountNumber: e.target.value })} /></Field>
              <Field label="IFSC"><Input value={data.payment.ifsc} onChange={(e) => setPayment({ ifsc: e.target.value })} /></Field>
              <Field label="UPI ID"><Input value={data.payment.upiId} onChange={(e) => setPayment({ upiId: e.target.value })} /></Field>
            </div>
            <div className="mt-3"><Field label="Notes"><Textarea value={data.notes} onChange={(e) => set({ notes: e.target.value })} /></Field></div>
          </section>
        </div>

        <div className="overflow-y-auto bg-muted/40 p-6">
          <div className="mx-auto max-w-[640px] rounded-md bg-white p-8 text-[12px] text-black shadow-sm">
            <div className="flex items-start justify-between border-b-2 border-primary pb-4">
              <div className="text-lg font-extrabold text-primary">MAPLE FURNISHERS</div>
              <div className="text-right text-[10px] text-black/60">B-3, W.H.S. Timber Market<br />Kirti Nagar, Delhi-110015<br />+91 92118 19727</div>
            </div>
            <div className="mt-4 text-2xl font-bold tracking-wide">TAX INVOICE</div>
            <div className="mt-4 flex justify-between rounded bg-[#f9f6f1] p-3">
              <div>
                <div className="text-[9px] font-bold uppercase text-primary">Billed To</div>
                <div className="font-semibold">{data.client.name || "—"}</div>
                <div className="text-black/70">{data.client.address}</div>
                <div className="text-black/70">{data.client.phone}</div>
                {data.client.gstin && <div className="text-black/70">GSTIN: {data.client.gstin}</div>}
              </div>
              <div className="text-right">
                <div className="text-[9px] font-bold uppercase text-primary">Invoice</div>
                <div>{data.number}</div>
                <div className="text-black/70">{data.date}</div>
                {data.dueDate && <div className="text-black/70">Due {data.dueDate}</div>}
              </div>
            </div>
            <table className="mt-4 w-full">
              <thead><tr className="bg-primary text-left text-[10px] text-white"><th className="p-1.5">Description</th><th className="p-1.5">HSN</th><th className="p-1.5 text-right">Qty</th><th className="p-1.5 text-right">Rate</th><th className="p-1.5 text-right">Amount</th></tr></thead>
              <tbody>{data.items.map((it) => (<tr key={it.id} className="border-b border-black/10"><td className="p-1.5">{it.description || "—"}</td><td className="p-1.5">{it.hsn || "-"}</td><td className="p-1.5 text-right">{it.qty}</td><td className="p-1.5 text-right">{money(it.price)}</td><td className="p-1.5 text-right">{money((it.qty || 0) * (it.price || 0))}</td></tr>))}</tbody>
            </table>
            <div className="ml-auto mt-3 w-1/2 text-[11px]">
              <div className="flex justify-between py-0.5"><span className="text-black/60">Subtotal</span><span>{money(totals.subtotal)}</span></div>
              {totals.itemDisc > 0 && <div className="flex justify-between py-0.5"><span className="text-black/60">Item discounts</span><span>- {money(totals.itemDisc)}</span></div>}
              {totals.overallDisc > 0 && <div className="flex justify-between py-0.5"><span className="text-black/60">Overall discount</span><span>- {money(totals.overallDisc)}</span></div>}
              {totals.packing > 0 && <div className="flex justify-between py-0.5"><span className="text-black/60">Packing</span><span>{money(totals.packing)}</span></div>}
              {totals.loading > 0 && <div className="flex justify-between py-0.5"><span className="text-black/60">Loading</span><span>{money(totals.loading)}</span></div>}
              {data.charges.splitCgstSgst ? (<><div className="flex justify-between py-0.5"><span className="text-black/60">CGST</span><span>{money(totals.cgst)}</span></div><div className="flex justify-between py-0.5"><span className="text-black/60">SGST</span><span>{money(totals.sgst)}</span></div></>) : (<div className="flex justify-between py-0.5"><span className="text-black/60">GST ({data.charges.gstPercent}%)</span><span>{money(totals.gst)}</span></div>)}
              <div className="mt-1.5 flex justify-between border-t-2 border-primary pt-1.5 text-base font-bold text-primary"><span>Grand Total</span><span>{money(totals.grandTotal)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { MAPLE_LOGO_B64 } from "@maple/core/lib/maple-logo-b64";
import { money } from "@maple/core/lib/utils";
import type { InvoiceData, InvoiceTotals } from "@maple/core/lib/invoice";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf", fontWeight: 500 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
  ],
});

const MAROON = "#702119";
const s = StyleSheet.create({
  page: { padding: 38, backgroundColor: "#fff", fontFamily: "Roboto", fontSize: 9, color: "#222" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottom: 2, borderBottomColor: MAROON, paddingBottom: 16, marginBottom: 18 },
  logo: { width: 58, height: 58 },
  brand: { fontSize: 18, fontWeight: 700, color: MAROON },
  contact: { fontSize: 8, color: "#7d6e63", textAlign: "right", lineHeight: 1.4 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  invTitle: { fontSize: 22, fontWeight: 700, color: "#111", letterSpacing: 1 },
  metaBox: { flexDirection: "row", justifyContent: "space-between", marginBottom: 22, padding: 12, backgroundColor: "#f9f6f1" },
  metaCol: { flex: 1, paddingRight: 10 },
  label: { fontSize: 7, fontWeight: 700, color: MAROON, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  val: { fontSize: 9, color: "#222", lineHeight: 1.4 },
  thead: { flexDirection: "row", backgroundColor: MAROON, color: "#fff", paddingVertical: 6, paddingHorizontal: 6 },
  th: { fontSize: 8, fontWeight: 700, color: "#fff" },
  row: { flexDirection: "row", paddingVertical: 6, paddingHorizontal: 6, borderBottom: 1, borderBottomColor: "#eee" },
  cDesc: { flex: 4 }, cHsn: { flex: 1.4 }, cQty: { flex: 1, textAlign: "right" }, cRate: { flex: 1.6, textAlign: "right" }, cAmt: { flex: 1.8, textAlign: "right" },
  totals: { marginTop: 14, marginLeft: "auto", width: "55%" },
  tline: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  tlabel: { fontSize: 9, color: "#555" },
  tval: { fontSize: 9, color: "#222" },
  grand: { flexDirection: "row", justifyContent: "space-between", marginTop: 6, paddingTop: 6, borderTop: 2, borderTopColor: MAROON },
  grandT: { fontSize: 12, fontWeight: 700, color: MAROON },
  pay: { marginTop: 22, flexDirection: "row", justifyContent: "space-between" },
  notes: { marginTop: 14, fontSize: 8, color: "#7d6e63", lineHeight: 1.4 },
  footer: { position: "absolute", bottom: 24, left: 38, right: 38, textAlign: "center", fontSize: 7, color: "#999", borderTop: 1, borderTopColor: "#eee", paddingTop: 6 },
});

export function InvoicePdf({ data, totals, logo }: { data: InvoiceData; totals: InvoiceTotals; logo?: string }) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {(logo || MAPLE_LOGO_B64) ? <Image src={logo || MAPLE_LOGO_B64} style={s.logo} /> : null}
            <View>
              <Text style={s.brand}>MAPLE FURNISHERS</Text>
              <Text style={{ fontSize: 8, color: "#7d6e63" }}>Luxury furniture, factory prices</Text>
            </View>
          </View>
          <Text style={s.contact}>B-3, W.H.S. Timber Market{"\n"}Kirti Nagar, Delhi-110015{"\n"}+91 92118 19727{"\n"}contact@maplefurnishers.com</Text>
        </View>

        <View style={s.titleRow}>
          <Text style={s.invTitle}>TAX INVOICE</Text>
        </View>

        <View style={s.metaBox}>
          <View style={s.metaCol}>
            <Text style={s.label}>Billed To</Text>
            <Text style={[s.val, { fontWeight: 700 }]}>{data.client.name || "—"}</Text>
            {data.client.address ? <Text style={s.val}>{data.client.address}</Text> : null}
            {data.client.phone ? <Text style={s.val}>{data.client.phone}</Text> : null}
            {data.client.gstin ? <Text style={s.val}>GSTIN: {data.client.gstin}</Text> : null}
          </View>
          <View style={[s.metaCol, { flex: 0.8, paddingRight: 0 }]}>
            <Text style={s.label}>Invoice No.</Text>
            <Text style={s.val}>{data.number}</Text>
            <Text style={[s.label, { marginTop: 6 }]}>Date</Text>
            <Text style={s.val}>{data.date}</Text>
            {data.dueDate ? <><Text style={[s.label, { marginTop: 6 }]}>Due Date</Text><Text style={s.val}>{data.dueDate}</Text></> : null}
          </View>
        </View>

        <View style={s.thead}>
          <Text style={[s.th, s.cDesc]}>Description</Text>
          <Text style={[s.th, s.cHsn]}>HSN</Text>
          <Text style={[s.th, s.cQty]}>Qty</Text>
          <Text style={[s.th, s.cRate]}>Rate</Text>
          <Text style={[s.th, s.cAmt]}>Amount</Text>
        </View>
        {data.items.map((it) => (
          <View style={s.row} key={it.id}>
            <Text style={s.cDesc}>{it.description || "—"}</Text>
            <Text style={s.cHsn}>{it.hsn || "-"}</Text>
            <Text style={s.cQty}>{it.qty}</Text>
            <Text style={s.cRate}>{money(it.price)}</Text>
            <Text style={s.cAmt}>{money((it.qty || 0) * (it.price || 0))}</Text>
          </View>
        ))}

        <View style={s.totals}>
          <View style={s.tline}><Text style={s.tlabel}>Subtotal</Text><Text style={s.tval}>{money(totals.subtotal)}</Text></View>
          {totals.itemDisc > 0 ? <View style={s.tline}><Text style={s.tlabel}>Item discounts</Text><Text style={s.tval}>- {money(totals.itemDisc)}</Text></View> : null}
          {totals.overallDisc > 0 ? <View style={s.tline}><Text style={s.tlabel}>Overall discount</Text><Text style={s.tval}>- {money(totals.overallDisc)}</Text></View> : null}
          {totals.packing > 0 ? <View style={s.tline}><Text style={s.tlabel}>Packing ({data.charges.packingPercent}%)</Text><Text style={s.tval}>{money(totals.packing)}</Text></View> : null}
          {totals.loading > 0 ? <View style={s.tline}><Text style={s.tlabel}>Loading</Text><Text style={s.tval}>{money(totals.loading)}</Text></View> : null}
          {data.charges.splitCgstSgst ? (
            <>
              <View style={s.tline}><Text style={s.tlabel}>CGST ({(data.charges.gstPercent / 2)}%)</Text><Text style={s.tval}>{money(totals.cgst)}</Text></View>
              <View style={s.tline}><Text style={s.tlabel}>SGST ({(data.charges.gstPercent / 2)}%)</Text><Text style={s.tval}>{money(totals.sgst)}</Text></View>
            </>
          ) : (
            <View style={s.tline}><Text style={s.tlabel}>GST ({data.charges.gstPercent}%)</Text><Text style={s.tval}>{money(totals.gst)}</Text></View>
          )}
          <View style={s.grand}><Text style={s.grandT}>Grand Total</Text><Text style={s.grandT}>{money(totals.grandTotal)}</Text></View>
        </View>

        <View style={s.pay}>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Payment Details</Text>
            {data.payment.bankName ? <Text style={s.val}>Bank: {data.payment.bankName}</Text> : null}
            {data.payment.accountName ? <Text style={s.val}>A/c Name: {data.payment.accountName}</Text> : null}
            {data.payment.accountNumber ? <Text style={s.val}>A/c No: {data.payment.accountNumber}</Text> : null}
            {data.payment.ifsc ? <Text style={s.val}>IFSC: {data.payment.ifsc}</Text> : null}
            {data.payment.upiId ? <Text style={s.val}>UPI: {data.payment.upiId}</Text> : null}
          </View>
          <View style={{ width: 160, alignItems: "flex-end", justifyContent: "flex-end" }}>
            <Text style={{ fontSize: 8, color: "#7d6e63", marginTop: 28 }}>For MAPLE FURNISHERS</Text>
            <Text style={{ fontSize: 8, color: "#7d6e63", marginTop: 18 }}>Authorised Signatory</Text>
          </View>
        </View>

        {data.notes ? <Text style={s.notes}>{data.notes}</Text> : null}
        <Text style={s.footer} fixed>Maple Furnishers · In-house crafted in Delhi · 36-month warranty · This is a computer-generated invoice.</Text>
      </Page>
    </Document>
  );
}

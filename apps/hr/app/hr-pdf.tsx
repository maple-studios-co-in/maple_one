import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { MAPLE_LOGO_B64 } from "@maple/core/lib/maple-logo-b64";
import { HrDocType, HrFields, hrBody, hrSubject } from "@maple/core/lib/hr";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf", fontWeight: 300 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
  ],
});

const MAROON = "#702119";
const s = StyleSheet.create({
  page: { padding: 50, fontFamily: "Roboto", fontSize: 11, color: "#222", lineHeight: 1.6 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottom: 2, borderBottomColor: MAROON, paddingBottom: 14, marginBottom: 26 },
  logo: { width: 54, height: 54 },
  brand: { fontSize: 18, fontWeight: 700, color: MAROON },
  contact: { fontSize: 8, color: "#7d6e63", textAlign: "right", lineHeight: 1.4 },
  meta: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  small: { fontSize: 9, color: "#555" },
  subject: { fontSize: 12, fontWeight: 700, color: "#111", textAlign: "center", textDecoration: "underline", marginBottom: 18 },
  para: { marginBottom: 12, textAlign: "justify" },
  sign: { marginTop: 40 },
  footer: { position: "absolute", bottom: 28, left: 50, right: 50, textAlign: "center", fontSize: 7, color: "#999", borderTop: 1, borderTopColor: "#eee", paddingTop: 6 },
});

export function HrDocPdf({ type, fields }: { type: HrDocType; fields: HrFields }) {
  const body = hrBody(type, fields);
  const issue = fields.issueDate ? new Date(fields.issueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "";
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            {MAPLE_LOGO_B64 ? <Image src={MAPLE_LOGO_B64} style={s.logo} /> : null}
            <Text style={s.brand}>MAPLE FURNISHERS</Text>
          </View>
          <Text style={s.contact}>B-3, W.H.S. Timber Market{"\n"}Kirti Nagar, Delhi-110015{"\n"}contact@maplefurnishers.com</Text>
        </View>

        <View style={s.meta}>
          <Text style={s.small}>Ref: MF/HR/{new Date().getFullYear()}</Text>
          <Text style={s.small}>Date: {issue}</Text>
        </View>

        <Text style={s.subject}>{hrSubject(type)}</Text>

        {body.map((p, i) => (
          <Text key={i} style={s.para}>{p}</Text>
        ))}

        <View style={s.sign}>
          <Text>For Maple Furnishers,</Text>
          <Text style={{ marginTop: 26, fontWeight: 700 }}>{fields.signatory || "____________"}</Text>
          <Text style={s.small}>{fields.signatoryTitle}</Text>
          <Text style={[s.small, { marginTop: 6 }]}>Place: {fields.place}</Text>
        </View>

        <Text style={s.footer} fixed>Maple Furnishers · B-3 W.H.S. Timber Market, Kirti Nagar, New Delhi 110015</Text>
      </Page>
    </Document>
  );
}

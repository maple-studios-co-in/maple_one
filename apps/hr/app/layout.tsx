import type { Metadata } from "next";
import { Outfit, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { redirect } from "next/navigation";
import { getSession } from "@maple/core/lib/auth";
import { adminUrl } from "@maple/core/lib/nav";
import { SuiteShell } from "@maple/core/components/SuiteShell";
import { ToolDisabled } from "@maple/core/components/ToolDisabled";
import { isEnabled } from "@maple/core/lib/flags";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", weight: "400", subsets: ["latin"] });
export const metadata: Metadata = { title: "HR Documents · MapleTools" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect(adminUrl("/login"));
  const toolOn = await isEnabled(`tool.hr`);
  return (
    <html lang="en" className={`${outfit.variable} ${instrument.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full">
        {toolOn ? (<SuiteShell user={user} current="hr">{children}</SuiteShell>) : (<ToolDisabled label="Hr" />)}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

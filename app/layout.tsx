import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import AffiliateCapture from "@/components/AffiliateCapture";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mixfunded.com"),
  title: "MixFunded — Prop Firm Challenges from $5, Payouts On-Chain",
  description:
    "Prop firm evaluations from $5. No time limits, plain-English rules, and every payout published on-chain with its TRC-20 TXID.",
};

export const viewport: Viewport = {
  themeColor: "#101312",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('mf-theme');if(t!=='light'&&t!=='dark'){t='dark';}var r=document.documentElement;r.classList.remove('dark','light');r.classList.add(t);r.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${bricolage.variable} ${instrument.variable} ${plex.variable} min-h-screen bg-background antialiased`}>
        {children}
        <AffiliateCapture />
        <ChatWidget />
      </body>
    </html>
  );
}

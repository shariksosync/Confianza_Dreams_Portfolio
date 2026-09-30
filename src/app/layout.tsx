import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "@/styles.css";
import { Providers } from "./providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Confianza Event's and Entertainment — Luxury Wedding Planner in Pune",
  description:
    "Where Weddings Become Stories. Luxury wedding planning, decor, execution and destination weddings in Pune and across India.",
  authors: [{ name: "Confianza Events" }],
  openGraph: {
    title: "Confianza Event's and Entertainment — Where Weddings Become Stories",
    description:
      "Luxury wedding planning, bespoke decor, and flawless execution for weddings that become timeless stories.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@confianza_events",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

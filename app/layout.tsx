import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import AppProviders from "@/components/providers/app-providers";
import ThemeInit from "@/components/layout/theme-init";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LINH NAM | Huyền Sử Việt",
  description: "Digital Vietnamese Mythology Experience — Lục Giới, Thần Thoại, Linh Thú",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${cormorant.variable} ${inter.variable} selection:bg-gold/30 selection:text-gold`}
    >
      <body
        className="font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        <AppProviders>{children}</AppProviders>
        <ThemeInit />
      </body>
    </html>
  );
}

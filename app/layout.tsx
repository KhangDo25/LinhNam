import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Inter } from "next/font/google";
import AppProviders from "@/components/providers/app-providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem("linh-nam-theme");
    if (t === "light" || t === "dark") {
      document.documentElement.dataset.theme = t;
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      document.documentElement.dataset.theme = "light";
    } else {
      document.documentElement.dataset.theme = "dark";
    }
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

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
      <body className="font-sans antialiased bg-background text-foreground">
        <Script
          id="linh-nam-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

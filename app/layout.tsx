import type { Metadata } from "next";
import { Cairo, Tajawal, Inter, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/lib/LanguageContext";
import ScrollToTop from "@/components/shared/ScrollToTop";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karirak - Arab World Job Platform",
  description: "Find your dream job or hire the best talents in the Arab world.",
  metadataBase: new URL("https://karirak.com"),
  applicationName: "Karirak",
  openGraph: {
    type: "website",
    title: "Karirak - Arab World Job Platform",
    description: "Find your dream job or hire the best talents in the Arab world.",
    siteName: "Karirak",
  },
  twitter: {
    card: "summary_large_image",
    title: "Karirak - Arab World Job Platform",
    description: "Find your dream job or hire the best talents in the Arab world.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cairo.variable} ${tajawal.variable} ${inter.variable} ${geistMono.variable}`}
    >
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1016400499958413"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <ScrollToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}

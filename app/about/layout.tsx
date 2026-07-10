import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Karirak",
  description: "Learn more about Karirak, the premier job platform and talent network in the Arab world.",
  openGraph: {
    title: "About Us | Karirak",
    description: "Learn more about Karirak, the premier job platform and talent network in the Arab world.",
    type: "website",
    siteName: "Karirak",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Karirak",
    description: "Learn more about Karirak, the premier job platform and talent network in the Arab world.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

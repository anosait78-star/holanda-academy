import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "أكاديمية هولندا لكرة القدم",
    template: "%s | أكاديمية هولندا",
  },
  description: "أكاديمية هولندا لكرة القدم - نصنع أبطال المستقبل. برامج تدريبية احترافية للناشئين والشباب.",
  keywords: ["أكاديمية هولندا", "كرة القدم", "تدريب", "ناشئين", "أكاديمية رياضية"],
  authors: [{ name: "أكاديمية هولندا" }],
  openGraph: {
    title: "أكاديمية هولندا لكرة القدم",
    description: "نصنع أبطال المستقبل - برامج تدريبية احترافية",
    images: ["/logo.webp"],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "أكاديمية هولندا لكرة القدم",
    description: "نصنع أبطال المستقبل",
    images: ["/logo.webp"],
  },
  icons: {
    icon: "/logo.webp",
    apple: "/logo.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import portfolio from "@/data/portfolio";
import { LanguageProvider } from "@/components/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(portfolio.personal.website),
  title: {
    default: portfolio.site.title,
    template: `%s | ${portfolio.personal.name}`,
  },
  description: portfolio.site.description,
  authors: [{ name: portfolio.personal.name }],
  creator: portfolio.personal.name,
  publisher: portfolio.personal.name,
  keywords: [
    "software engineer",
    "backend developer",
    "web developer",
    "portfolio",
    "laravel",
    "node.js",
    "react",
    "next.js",
    "python",
    "mysql",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: portfolio.site.title,
    description: portfolio.site.description,
    siteName: portfolio.personal.name,
    images: [
      {
        url: "/img/logo.png",
        width: 512,
        height: 512,
        alt: `${portfolio.personal.name} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: portfolio.site.title,
    description: portfolio.site.description,
    images: ["/img/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/img/logo.png",
    shortcut: "/img/logo.png",
    apple: "/img/logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
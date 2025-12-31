import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dani Candles | Awaken to ambiance",
  description: "Handcrafted candles by Dani to transform your space.",
  keywords: [
    "soy candles",
    "handcrafted candles",
    "natural candles",
    "premium candles",
    "phthalate-free candles",
    "luxury candles",
    "scented candles",
    "home fragrance",
    "artisan candles",
    "Dani Candles",
    "Nashville candles",
    "small batch candles",
    "eco-friendly candles",
    "clean burning candles",
    "candle collections",
  ],

  authors: [{ name: "Dani Candles" }],
  creator: "Dani Candles",
  publisher: "Dani Candles",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  manifest: "/manifest.json",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://danicandles.com",
    siteName: "Dani Candles",
    title: "Dani Candles | Premium Handcrafted Soy Candles",
    description:
      "Discover premium handcrafted soy candles with natural, phthalate-free fragrances. Transform your space with our curated collections.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dani Candles - Premium Handcrafted Soy Candles",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Dani Candles | Premium Handcrafted Soy Candles",
    description:
      "Discover premium handcrafted soy candles with natural, phthalate-free fragrances.",
    images: ["/og-image.jpg"],
    creator: "@danicandles",
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

  verification: {
    google:
      "google-site-verification=cKmA6CLPDy-fiB3-z1HvYHFoS-CfLgja1H83aW8snAw",
  },

  alternates: {
    canonical: "https://danicandles.com",
  },

  category: "E-commerce",

  icons: {
    icon: [
      { url: "./icon.png" },
      { url: "./icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "./icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "./apple-icon-180x180.png" },
      { url: "./apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} overflow-x-hidden`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Dani Candles",
              description:
                "Premium handcrafted soy candles with natural fragrances",
              url: "https://danicandles.com",
              logo: "https://danicandles.com/logo.png",
              image: "https://danicandles.com/og-image.jpg",
              telephone: "+1-615-428-9475",
              email: "hello@danicandles.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nashville",
                addressRegion: "TN",
                addressCountry: "US",
              },
              priceRange: "$$",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "09:00",
                  closes: "17:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "10:00",
                  closes: "14:00",
                },
              ],
              sameAs: [
                "https://www.instagram.com/danicandles",
                "https://www.facebook.com/danicandles",
                "https://www.tiktok.com/@danicandles",
              ],
            }),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col overflow-x-hidden">
        <Header />
        <ToastContainer />
        <main className="flex-1 overflow-x-hidden pt-[73px] sm:pt-[81px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

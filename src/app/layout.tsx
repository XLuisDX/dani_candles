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
      <body className="flex min-h-screen flex-col overflow-x-hidden overflow-y-hidden">
        <Header />
        <ToastContainer />
        <main className="flex-1 overflow-x-hidden pt-[73px] sm:pt-[81px] overflow-y-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
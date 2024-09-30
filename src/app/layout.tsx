import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../app/components/Navbar";
import Footer from "./components/Footer";
import { TronLinkProvider } from "../../providers";
import { TokenProvider } from "./context/TokenContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PumpDomains",
  description: "Create Your Own Domains and TLDs at Ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full flex flex-col justify-between`}
      >
        <TokenProvider>
          <TronLinkProvider>
            <Navbar />
            {children}
            <Footer />
          </TronLinkProvider>
        </TokenProvider>
      </body>
    </html>
  );
}

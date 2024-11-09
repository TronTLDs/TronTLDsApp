import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import Navbar from "../app/components/Navbar";
import Footer from "./components/Footer";
import { TokenProvider } from "./context/TokenContext";
import { TronLinkProvider } from "../../providers";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Specify the weights you need
  display: "swap",
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
        className={`${fredoka.className} antialiased w-full h-full flex flex-col justify-between`}
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
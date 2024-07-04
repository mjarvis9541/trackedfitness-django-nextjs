import NavbarTwo from "@/components/Navbar";
import Providers from "@/contexts/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trackedfitness",
  description: "Welcome to Trackedfitness",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={`${inter.className}`}>
        <Providers>
          <NavbarTwo />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}

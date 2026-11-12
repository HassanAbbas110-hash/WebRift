import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import "./globals.css";
import "./print.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "WebRift — Websites that sell for South African shops", template: "%s · WebRift" },
  description:
    "WebRift builds premium websites, online stores and digital tools for local South African shops. Get an instant quote.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-ZA" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {/* Nav reads the pathname, which is unknown at build time on dynamic routes like /q/[id]. */}
        <Suspense fallback={<header className="glass sticky top-0 z-50 h-16 border-b border-line" />}>
          <Nav />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}

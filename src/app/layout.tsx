import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MswProvider } from "@/components/MswProvider";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transactions Dashboard",
  description: "Manage your subscription transactions and retry failed payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/*
          MswProvider must wrap Providers: TanStack Query may fire requests
          on mount, and those need to hit the MSW worker — which is only
          installed after MswProvider's effect resolves.
        */}
        <MswProvider>
          <Providers>{children}</Providers>
        </MswProvider>
      </body>
    </html>
  );
}

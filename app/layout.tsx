import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Founder Only (XLR8TER)",
  description: "Role-aware founder network and admin command center."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans app-shell`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

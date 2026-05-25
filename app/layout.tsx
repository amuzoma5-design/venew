import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "VENEW — Discover Events in Nigeria",
  description:
    "Find conferences, church events, seminars, and workshops happening near you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0d0d0d", minHeight: "100vh" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
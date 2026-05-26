import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "VENEW — Discover Events in Nigeria",
  description:
    "Find conferences, church events, seminars, and workshops happening near you.",
  manifest: "/manifest.json",
  themeColor: "#F5A623",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VENEW",
  },
  icons: {
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F5A623" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VENEW" />
      </head>
      <body style={{ backgroundColor: "#0d0d0d", minHeight: "100vh" }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
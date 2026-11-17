import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  title: "Global TOPIK IBT Platform",
  description:
    "Frictionless TOPIK I, II, and Speaking IBT simulation with instant multilingual vocabulary tooltips and AI essay grading.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TOPIK IBT",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

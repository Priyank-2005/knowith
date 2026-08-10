import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knowith Capital",
  description: "Institutional-grade mutual fund advisory, financial planning, and AI-powered tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

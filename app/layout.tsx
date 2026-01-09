import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dawat Ul Imaan",
  description: "A platform to learn Islamic teachings and values.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

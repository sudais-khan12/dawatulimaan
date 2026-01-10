import type { Metadata } from "next";
import "./globals.css";
import PageWrapper from "./components/PageWrapper";

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
      <body>
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  );
}

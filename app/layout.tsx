import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

// Font setup
const poppinsFont = Poppins({
  weight: ["400"],
  subsets: ["latin"],
});

// Metadata setup
export const metadata: Metadata = {
  title: "Projects Karo",
  description: "Jigyasu",
};

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppinsFont.className} antialiased`}>
          {children}
      </body>
    </html>
  );
}

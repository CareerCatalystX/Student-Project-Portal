import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

// Font setup
const poppinsFont = Poppins({
  weight: ["400", "500", "600", "700"], // normal, medium, semibold, bold
  subsets: ["latin"],
  variable: "--font-poppins",
});

// Metadata setup
export const metadata: Metadata = {
  title: "Career CatalystX",
  description: "Jigyasu",
  icons: {
    icon: "/favicon.ico",
  },
};

// Root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className={poppinsFont.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

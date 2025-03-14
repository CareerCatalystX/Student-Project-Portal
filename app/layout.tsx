import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";

import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";

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
        <SidebarProvider>
          {/* Show Sidebar only on mobile */}
          <div className="md:hidden">
            <AppSidebar />
          </div>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}

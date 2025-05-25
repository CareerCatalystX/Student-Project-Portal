import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children } : Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <body className="font-sans antialiased">
        <main>{children}</main>
        <Toaster richColors position="top-right" theme="light" />
      </body>
  )
}

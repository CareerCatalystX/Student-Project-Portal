import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children } : Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
        <main>{children}</main>
        <Toaster richColors position="top-right" theme="light" />
      </div>
  )
}

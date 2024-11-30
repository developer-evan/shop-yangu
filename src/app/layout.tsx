import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/sidebar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-100 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

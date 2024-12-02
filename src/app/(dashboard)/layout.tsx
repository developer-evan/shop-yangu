"use client"
import { useState } from 'react'
import { Inter } from 'next/font/google'
// import './globals.css'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'

const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-gray-800/60 lg:hidden z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

        
          <div className={`
            fixed inset-y-0 z-50 
            lg:relative lg:flex
            ${sidebarOpen ? 'flex' : 'hidden'}
          `}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
          
          
          <div className="flex-1 flex flex-col ">
            <div className="sticky top-0 z-40">
              <Header onMenuClick={() => setSidebarOpen(true)} />
            </div>            
            <main className="flex-1 overflow-y-auto bg-white p-4 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}

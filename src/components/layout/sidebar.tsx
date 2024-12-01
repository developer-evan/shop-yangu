"use client";
import { Home, ShoppingCartIcon, Package, Settings, LogOut, X, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Shops', href: '/shops', icon: ShoppingCartIcon },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Settings', href: '/settings', icon: Settings },
    {name: 'Profile', href: '/profile', icon: User}
  ]

  return (
    <aside className="h-full w-[240px] flex flex-col bg-white border-r">
      {/* Logo Section */}
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <div className="h-7 w-7 rounded-md bg-indigo-600" />
        <span className="text-lg font-semibold">ShopYangu</span>
        {/* Close button (Mobile Only) */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto lg:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 space-y-10 px-3 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onClose?.()}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout Section */}
      <div className="border-t p-4">
        <button
          onClick={() => {
            // Add your logout logic here
            onClose?.()
          }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  )
} 
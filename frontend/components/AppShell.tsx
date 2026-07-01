'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Sidebar from './Sidebar'

const NO_SHELL_PATHS = ['/login', '/register']

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const noShell = NO_SHELL_PATHS.some(p => pathname.startsWith(p))

  if (noShell) return <>{children}</>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
      </div>
    </div>
  )
}

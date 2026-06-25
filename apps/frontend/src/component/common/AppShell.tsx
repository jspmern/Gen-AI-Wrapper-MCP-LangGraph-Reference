"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

function AppShell({children}:{children:React.ReactNode}) {
    const pathName=usePathname()
    const isAuth=pathName==="/login"
    if(isAuth)
    {
        return  <>{children}</>
    }
  return (
      <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />
        <main className="p-6 bg-gray-50 flex-1">{children}</main>
      </div>
    </div>
  )
}

export default AppShell
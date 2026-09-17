import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-full">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <Topbar />
        <main className="flex-1 px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

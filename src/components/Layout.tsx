import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Topbar from './Topbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <main className="flex-1 px-5 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

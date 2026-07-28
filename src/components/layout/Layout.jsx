import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'
import PageTransition from './PageTransition.jsx'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <PageTransition />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default Layout

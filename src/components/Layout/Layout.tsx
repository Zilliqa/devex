import React, { useRef, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'

import { ThemeContext } from 'src/themes/themeProvider'

import Header from './Header/Header'
import App from './App/App'
import Footer from './Footer/Footer'

import 'src/themes/theme.css'
import './Layout.css'

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const prevLocation = useRef<string>()

  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      window.scrollTo(0, 0)
      prevLocation.current = location.pathname
    }
  }, [location])

  return <>{children}</>
}

const Layout: React.FC = () => {

  const themeContext = useContext(ThemeContext)
  const { theme } = themeContext!

  return <>
    <div className={theme === 'dark' ? 'dark-theme' : 'light-theme'}>
      <ScrollToTop>
        <Header />
        <App />
        <Footer />
      </ScrollToTop>
    </div>
  </>
}

export default Layout

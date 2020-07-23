import React, { useRef, useEffect, useContext } from 'react'
import { useLocation, Redirect } from 'react-router-dom'

import { useSearchParams, useNetworkUrl } from 'src/services/network/networkProvider'
import { UserPrefContext } from 'src/services/userPref/userPrefProvider'
import { ThemeContext } from 'src/themes/themeProvider'

import Header from './Header/Header'
import App from './App/App'
import Footer from './Footer/Footer'

import 'src/themes/theme.css'
import './Layout.css'

const RedirectToDefaultNetwork = ({ children }: { children: React.ReactNode }) => {

  const searchParams = useSearchParams()
  const networkUrl = useNetworkUrl()

  const userPrefContext = useContext(UserPrefContext)
  const { networkMap } = userPrefContext!

  if (networkUrl === '') {
    return <Redirect to={{
      pathname: searchParams,
      search: '?' + new URLSearchParams({ network: networkMap.keys().next().value || 'https://api.zilliqa.com' }).toString(),
    }}
    />
  } else {
    return <>{children}</>
  }
}

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
      <RedirectToDefaultNetwork>
        <ScrollToTop>
          <Header />
          <App />
          <Footer />
        </ScrollToTop>
      </RedirectToDefaultNetwork>
    </div>
  </>
}

export default Layout

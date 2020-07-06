import 'bootstrap/dist/css/bootstrap.min.css'

import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Link, useLocation, BrowserRouter as Router, Route } from 'react-router-dom'

import HomePage from './components/HomePage/HomePage'
import Layout from './components/Layout/Layout'
import DSBlocksPage from './components/ViewAllPages/DSBlocksPage/DSBlocksPage'
import TxBlocksPage from './components/ViewAllPages/TxBlocksPage/TxBlocksPage'
import TxnsPage from './components/ViewAllPages/TxnsPage/TxnsPage'
import DSBlockDetailsPage from './components/DetailsPages/DSBlockDetailsPage/DSBlockDetailsPage'
import TxBlockDetailsPage from './components/DetailsPages/TxBlockDetailsPage/TxBlockDetailsPage'
import TxnDetailsPage from './components/DetailsPages/TxnDetailsPage/TxnDetailsPage'
import AddressDetailsPage from './components/DetailsPages/AddressDetailsPage/AddressDetailsPage'
import LabelsPage from './components/LabelsPage/LabelsPage'
import * as serviceWorker from './serviceWorker'
import { NetworkProvider } from './services/networkProvider'
import { UserPrefProvider } from './services/userPrefProvider'

import './index.css'
import { ThemeProvider } from './themes/themeProvider'

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

export const QueryPreservingLink = ({ to, style, className, onClick, children }
  : {
    to: string, style?: React.CSSProperties, className?: string,
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void, children: React.ReactNode
  }): JSX.Element => {
  const location = useLocation()
  return <Link style={style} className={className} onClick={onClick} to={{
    pathname: to,
    search: location.search
  }}>{children}</Link>
}

ReactDOM.render(
  <>
    <ThemeProvider>
      <Router>
        <NetworkProvider>
          <UserPrefProvider>
            <Layout>
              <React.StrictMode>
                <ScrollToTop>
                  <Route exact path="/" component={HomePage} />
                  <Route exact path="/dsbk" component={DSBlocksPage} />
                  <Route path={`/dsbk/:blockNum`}><DSBlockDetailsPage /></Route>
                  <Route exact path="/txbk" component={TxBlocksPage} />
                  <Route path={`/txbk/:blockNum`}><TxBlockDetailsPage /></Route>
                  <Route exact path="/tx" component={TxnsPage} />
                  <Route path={`/tx/:txnHash`}><TxnDetailsPage /></Route>
                  <Route path="/address/:addr" component={AddressDetailsPage} />
                  <Route path="/labels" component={LabelsPage} />
                </ScrollToTop>
              </React.StrictMode>
            </Layout>
          </UserPrefProvider>
        </NetworkProvider>
      </Router>
    </ThemeProvider>
  </>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { Link, useLocation, BrowserRouter as Router } from 'react-router-dom'

import Layout from './components/Layout/Layout'
import { NetworkProvider } from './services/networkProvider'
import { UserPrefProvider } from './services/userPrefProvider'
import { ThemeProvider } from './themes/themeProvider'

import * as serviceWorker from './serviceWorker'

import './index.css'

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
    <React.StrictMode>
      <Router>
        <ThemeProvider>
          <NetworkProvider>
            <UserPrefProvider>
              <Layout />
            </UserPrefProvider>
          </NetworkProvider>
        </ThemeProvider>
      </Router>
    </React.StrictMode>
  </>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

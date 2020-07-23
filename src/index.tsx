import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import Layout from './components/Layout/Layout'
import { NetworkProvider } from './services/network/networkProvider'
import { UserPrefProvider } from './services/userPref/userPrefProvider'
import { ThemeProvider } from './themes/themeProvider'

import * as serviceWorker from './serviceWorker'

import './index.css'

ReactDOM.render(
  <>
    <React.StrictMode>
      <Router>
        <ThemeProvider>
          <UserPrefProvider>
            <NetworkProvider>
              <Layout />
            </NetworkProvider>
          </UserPrefProvider>
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

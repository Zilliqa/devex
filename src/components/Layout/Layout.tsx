import React, { useContext } from 'react'
import { Container, Spinner } from 'react-bootstrap'

import { ThemeContext } from 'src/themes/themeProvider'
import { NetworkContext } from 'src/services/networkProvider'

import Header from './Header/Header'
import Footer from './Footer/Footer'

import 'src/themes/theme.css'
import './Layout.css'

type Props = { children: React.ReactNode }

const Layout: React.FC<Props> = (props) => {

  const networkContext = useContext(NetworkContext)
  const themeContext = useContext(ThemeContext)
  const { inTransition } = networkContext!
  const { dark } = themeContext!

  return (
    <div id='app' className={dark ? 'dark-theme' : 'light-theme'}>
      <Header />
      <Container className="app-container">
        {inTransition
          ? <div className='center-spinner'><Spinner animation="border" /></div>
          : props.children}
      </Container>
      <Footer />
    </div>
  )
}

export default Layout

import React, { useContext } from 'react'
import { Container, Spinner } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'

import Header from './Header/Header'
import Footer from './Footer/Footer'
import './Layout.css'

type Props = { children: React.ReactNode }

const Layout: React.FC<Props> = (props) => {
  const networkContext = useContext(NetworkContext)
  const { inTransition } = networkContext!
  return (
    <div className='app-bg'>
      <Header />
      <Container className="app-container">
        {inTransition
          ? <div className='center-spinner'><Spinner animation="border" variant="secondary" /></div>
          : props.children}
      </Container>
      <Footer />
    </div>
  )
}

export default Layout

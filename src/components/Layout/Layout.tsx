import React from 'react'
import { Container } from 'react-bootstrap'

import Header from './header/Header'
import Footer from './footer/Footer'
import './Layout.css'

const Layout = (props: any) => (
  <div>
    <Header />
    <Container className="app-container">
      {props.children}
    </Container>
    <Footer />
  </div>

)

export default Layout

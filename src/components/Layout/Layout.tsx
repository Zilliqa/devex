import React from 'react'
import { Container } from 'react-bootstrap'

import Header from './Header/Header'
import Footer from './Footer/Footer'
import './Layout.css'

const Layout: React.FC = (props: any) => (
  <div>
    <Header />
    <Container className="app-container">
      {props.children}
    </Container>
    <Footer />
  </div>

)

export default Layout

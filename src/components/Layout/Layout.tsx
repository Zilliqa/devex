import React from 'react'
import { Container } from 'react-bootstrap'

import Header from './Header/Header'
import Footer from './Footer/Footer'
import './Layout.css'

type Props = { children: React.ReactNode }

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <Container className="app-container">
      {props.children}
    </Container>
    <Footer />
  </div>

)

export default Layout

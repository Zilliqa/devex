import React, { useState, useContext, useEffect } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

import ZilLogo from 'src/assets/images/ZilLogo.png'
import Searchbar from 'src/components/HomePage/Searchbar/Searchbar'
import { NetworkContext, QueryPreservingLink } from 'src/services/network/networkProvider'

import NetworkSwitcher from './NetworkSwitcher'

import './Header.css'

const Header: React.FC = () => {

  const location = useLocation()
  const networkContext = useContext(NetworkContext)
  const { isIsolatedServer } = networkContext!

  const [showSearchbar, setShowSearchbar] = useState(false)

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowSearchbar(true)
    }
    else {
      setShowSearchbar(false)
    }
  }, [location])

  return (
    <>
      <Navbar className="custom-navbar" fixed="top">
        <Nav>
          <QueryPreservingLink to={'/'} >
            <Navbar.Brand className="custom-navbar-brand">
              <img
                src={ZilLogo}
                alt=""
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              {' '}
              <span className='app-name'>DEVEX</span>
            </Navbar.Brand>
          </QueryPreservingLink>
          <QueryPreservingLink className='navbar-link' to={'/labels'}>Labels</QueryPreservingLink>
          <QueryPreservingLink className='navbar-link' to={'/networks'}>Networks</QueryPreservingLink>
        </Nav>
        {showSearchbar
          ? <div className="header-searchbar">
            <Searchbar isISSearchbar={isIsolatedServer!} isHeaderSearchbar={true} />
          </div>
          : null}
        <NetworkSwitcher />
      </Navbar>
    </>
  )
}

export default Header

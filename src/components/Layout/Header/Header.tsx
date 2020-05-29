import React, { useState, useContext } from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { NetworkContext } from 'src/services/networkProvider'
import Logo from 'src/assets/images/logo.png'
import './Header.css'

const Header: React.FC = () => {
  const networkContext = useContext(NetworkContext)
  const { setNodeUrl } = networkContext!
  const [currentNetwork, setCurrentNetwork] = useState('Mainnet')

  return (
    <>
      <Navbar className="custom-navbar" fixed="top">
        <Link to={'/'}>
          <Navbar.Brand className="custom-navbar-brand">
            <img
              src={Logo}
              alt=""
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
          Dev Explorer
        </Navbar.Brand>
        </Link>
        <Nav className="ml-auto">
          <NavDropdown title={currentNetwork} id="basic-nav-dropdown">
            <NavDropdown.Item onClick={() => {
              if (currentNetwork !== 'Mainnet') {
                setCurrentNetwork('Mainnet')
                setNodeUrl && setNodeUrl('https://api.zilliqa.com/')
              }
            }}>
              Mainnet
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => {
              if (currentNetwork !== 'Testnet') {
                setCurrentNetwork('Testnet')
                setNodeUrl && setNodeUrl('https://dev-api.zilliqa.com/')
              }
            }}>
              Testnet
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => {
              if (currentNetwork !== 'Simulated Env') {
                setCurrentNetwork('Simulated Env')
                setNodeUrl && setNodeUrl('https://zilliqa-isolated-server.zilliqa.com/')
              }
            }}>
              Simulated Env
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
    </>
  );
}

export default Header

import React, { useState, useContext } from 'react'
import { Navbar, Nav, NavDropdown, Tooltip, OverlayTrigger, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { NetworkContext } from 'src/services/networkProvider'
import Logo from 'src/assets/images/logo.png'
import './Header.css'

import { faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Header: React.FC = () => {
  const networkContext = useContext(NetworkContext)
  const { setNodeUrl, nodeUrlMap, setNodeUrlMap } = networkContext!
  const [currentNetwork, setCurrentNetwork] = useState(
    localStorage.getItem('nodeUrl') ? nodeUrlMap[localStorage.getItem('nodeUrl')!] : 'Mainnet')
  const [newNode, setNewNode] = useState('')
  const [show, setShow] = useState(false)

  const addNewNode = () => {
    nodeUrlMap[newNode] = newNode
    setNodeUrlMap((prev: any) => ({ ...prev, [newNode]: newNode }))
    setCurrentNetwork(newNode)
    setNodeUrl && setNodeUrl(newNode)
    setNewNode('')
    setShow(false)
  }

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
          <OverlayTrigger placement='left'
            overlay={<Tooltip id={'tt'}> {networkContext?.nodeUrl} </Tooltip>}>
            <FontAwesomeIcon style={{ alignSelf: 'center', color: 'black', opacity: '60%' }} icon={faInfoCircle} />
          </OverlayTrigger>
          <NavDropdown onToggle={(e: boolean) => { setShow(e) }} show={show} title={currentNetwork} id="basic-nav-dropdown">
            {Object.entries(nodeUrlMap).map(([k, v]) => (
              <NavDropdown.Item onClick={() => {
                if (currentNetwork !== v) {
                  setCurrentNetwork(v)
                  setNodeUrl && setNodeUrl(k)
                }
              }}>
                {v}
              </NavDropdown.Item>
            ))}
            <NavDropdown.Divider />
            <div style={{ display: 'flex', paddingLeft: '1rem' }}>
              <Form onSubmit={(e: any) => { e.preventDefault(); addNewNode() }}>
                <Form.Control type="text" value={newNode} onChange={(e) => { setNewNode(e.target.value) }} placeholder="Custom Node Url" />
              </Form>
              <NavDropdown.Item style={{ width: '2rem', margin: '0 0.5rem', padding: '0.5rem' }} onClick={addNewNode}>
                <FontAwesomeIcon size='lg' icon={faPlus} color='darkslategray' />
              </NavDropdown.Item>
            </div>
          </NavDropdown>
        </Nav>
      </Navbar>
    </>
  );
}

export default Header

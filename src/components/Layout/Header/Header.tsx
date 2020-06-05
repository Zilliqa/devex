import React, { useState, useContext } from 'react'
import { Navbar, Nav, NavDropdown, Tooltip, OverlayTrigger, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import Logo from 'src/assets/images/logo.png'
import { NetworkContext, defaultNetworks } from 'src/services/networkProvider'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import './Header.css'

const Header: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { nodeUrl, setNodeUrl, nodeUrlMap, setNodeUrlMap } = networkContext!
  const [currentNetwork, setCurrentNetwork] = useState(nodeUrlMap[localStorage.getItem('nodeUrl')!] || defaultNetworks[nodeUrl])
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

  const deleteNode = (k: any, v: any) => {
    delete nodeUrlMap[k]
    setNodeUrlMap(nodeUrlMap)
    if (currentNetwork === v) {
      setCurrentNetwork('Mainnet')
      setNodeUrl && setNodeUrl('https://api.zilliqa.com/')
    }
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
            <FontAwesomeIcon className='info-icon' icon={faInfoCircle} />
          </OverlayTrigger>
          <NavDropdown onToggle={(e: boolean) => { setShow(e) }} show={show} title={currentNetwork} id="basic-nav-dropdown">
            {Object.entries(defaultNetworks).map(([k, v]) => (
              <NavDropdown.Item key={k} onClick={() => {
                if (currentNetwork !== v) {
                  setCurrentNetwork(v)
                  setNodeUrl && setNodeUrl(k)
                }
              }}>
                {v}
              </NavDropdown.Item>
            ))}
            <NavDropdown.Divider />
            {Object.entries(nodeUrlMap).map(([k, v]) => (
              <div className='node-div'>
                <NavDropdown.Item className='node-item' onClick={() => {
                  if (currentNetwork !== v) {
                    setCurrentNetwork(v)
                    setNodeUrl && setNodeUrl(k)
                  }
                }}>
                  {v}
                </NavDropdown.Item>
                <NavDropdown.Item className='minus-icon-item' onClick={()=>{deleteNode(k, v)}}>
                  <FontAwesomeIcon size='lg' icon={faMinus} />
                </NavDropdown.Item>
              </div>
            ))}
            <div className='add-node-div'>
              <Form onSubmit={(e: any) => { e.preventDefault(); addNewNode() }}>
                <Form.Control
                  type="text"
                  value={newNode}
                  onChange={(e) => { setNewNode(e.target.value) }}
                  placeholder="DevNet Url" />
              </Form>
              <NavDropdown.Item className='plus-icon-item' onClick={addNewNode}>
                <FontAwesomeIcon size='lg' icon={faPlus} />
              </NavDropdown.Item>
            </div>
          </NavDropdown>
        </Nav>
      </Navbar>
    </>
  );
}

export default Header

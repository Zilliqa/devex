import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Navbar, Nav, NavDropdown, Tooltip, OverlayTrigger, Form } from 'react-bootstrap'
import { useLocation, useHistory } from 'react-router-dom'

import { QueryPreservingLink } from 'src'
import ZilLogo from 'src/assets/images/ZilLogo.png'
import Searchbar from 'src/components/HomePage/Searchbar/Searchbar'
import { NetworkContext, defaultNetworks, useNetworkName } from 'src/services/networkProvider'
import { UserPrefContext } from 'src/services/userPrefProvider'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import './Header.css'

const Header: React.FC = () => {

  const history = useHistory()
  const location = useLocation()
  const networkName = useNetworkName()
  const networkContext = useContext(NetworkContext)
  const userPrefContext = useContext(UserPrefContext)
  const { isIsolatedServer, nodeUrl } = networkContext!
  const { nodeUrlMap, setNodeUrlMap } = userPrefContext!

  const [newNode, setNewNode] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSearchbar, setShowSearchbar] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState(defaultNetworks[nodeUrl] || nodeUrl)

  const changeNetwork = useCallback((k: string) => {
    if (k === Object.keys(defaultNetworks)[0])
      history.push('/')
    else
      history.push({
        pathname: '/',
        search: '?' + new URLSearchParams({ network: k }).toString()
      })
  }, [history])

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowSearchbar(true)
    }
    else {
      setShowSearchbar(false)
    }
  }, [location])

  useEffect(() => {
    setCurrentNetwork(networkName)
  }, [networkName])

  const addNewNode = () => {
    if (!Object.keys({ ...defaultNetworks, ...nodeUrlMap }).includes(newNode)) {
      nodeUrlMap[newNode] = newNode
      setNodeUrlMap(nodeUrlMap)
    }
    changeNetwork(newNode)
    setNewNode('')
    setShowDropdown(false)
  }

  const deleteNode = (k: string) => {
    delete nodeUrlMap[k]
    setNodeUrlMap(nodeUrlMap)
    changeNetwork(Object.keys(defaultNetworks)[0])
    setShowDropdown(false)
  }

  return (
    <>
      <Navbar className="custom-navbar" fixed="top">
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
        <QueryPreservingLink className='label-link' to={'/labels'}>My Labels</QueryPreservingLink>
        {showSearchbar
          ? <div className="header-searchbar"><Searchbar isISSearchbar={isIsolatedServer!} isHeaderSearchbar={true} /></div>
          : null}
        <Nav className={showSearchbar ? '' : 'ml-auto'}>
          <OverlayTrigger placement='left'
            overlay={<Tooltip id={'tt'}> {networkContext?.nodeUrl} </Tooltip>}>
            <FontAwesomeIcon className='info-icon' icon={faInfoCircle} />
          </OverlayTrigger>
          <NavDropdown onToggle={(e: boolean) => { setShowDropdown(e) }} show={showDropdown} title={currentNetwork} id="header-network-dropdown">
            {Object.entries(defaultNetworks).map(([k, v]) => (
              <NavDropdown.Item key={k} onClick={() => {
                if (currentNetwork !== v) {
                  setShowSearchbar(false)
                  changeNetwork(k)
                }
              }}>
                {v}
              </NavDropdown.Item>
            ))}
            <NavDropdown.Divider />
            {Object.entries(nodeUrlMap).map(([k, v]) => (
              <div key={k} className='default-node-div'>
                <NavDropdown.Item className='default-node-item' onClick={() => {
                  if (currentNetwork !== v) {
                    setShowSearchbar(false)
                    changeNetwork(k)
                  }
                }}>
                  {v}
                </NavDropdown.Item>
                <NavDropdown.Item className='minus-icon-item' onClick={() => { deleteNode(k) }}>
                  <FontAwesomeIcon size='lg' icon={faMinus} />
                </NavDropdown.Item>
              </div>
            ))}
            <div className='add-node-div'>
              <Form onSubmit={(e: React.SyntheticEvent) => { e.preventDefault(); addNewNode() }}>
                <Form.Control
                  type="text"
                  value={newNode}
                  onChange={(e) => { setNewNode(e.target.value) }}
                  placeholder="Node Url" />
              </Form>
              <NavDropdown.Item className='plus-icon-item' onClick={addNewNode}>
                <FontAwesomeIcon size='lg' icon={faPlus} />
              </NavDropdown.Item>
            </div>
          </NavDropdown>
        </Nav>
      </Navbar>
    </>
  )
}

export default Header

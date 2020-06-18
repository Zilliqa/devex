import React, { useState, useContext, useEffect, useMemo, SyntheticEvent } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Navbar, Nav, NavDropdown, Tooltip, OverlayTrigger, Form } from 'react-bootstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { QueryPreservingLink } from 'src'
import ZilLogo from 'src/assets/images/ZilLogo.png'
import Searchbar from 'src/components/HomePage/Searchbar/Searchbar'
import { UserPrefContext } from 'src/services/userPrefProvider'
import { NetworkContext, defaultNetworks } from 'src/services/networkProvider'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import 'react-perfect-scrollbar/dist/css/styles.css'
import './Header.css'

const Header: React.FC = () => {

  const location = useLocation();
  const networkContext = useContext(NetworkContext)
  const userPrefContext = useContext(UserPrefContext)
  const { isIsolatedServer, nodeUrl, setNodeUrl } = networkContext!
  const { nodeUrlMap, setNodeUrlMap, labelMap } = userPrefContext!
  const [currentNetwork, setCurrentNetwork] = useState(defaultNetworks[nodeUrl] || nodeUrl)
  const [newNode, setNewNode] = useState('')
  const [showSearchbar, setShowSearchbar] = useState(false)
  const [showLabelbar, setShowLabelbar] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowSearchbar(true)
      setShowLabelbar(false)
    }
    else {
      setShowLabelbar(true)
      setShowSearchbar(false)
    }
  }, [location])

  const addNewNode = () => {
    if (Object.keys(nodeUrlMap).includes(newNode)) {
      setNewNode('')
      setShowDropdown(false)
      return
    }
    else {
      nodeUrlMap[newNode] = newNode
      setNodeUrlMap(nodeUrlMap)
      setCurrentNetwork(newNode)
      setNodeUrl && setNodeUrl(newNode)
      setNewNode('')
      setShowDropdown(false)
    }
  }

  const deleteNode = (k: string) => {
    delete nodeUrlMap[k]
    setNodeUrlMap(nodeUrlMap)
    setCurrentNetwork('Mainnet')
    setNodeUrl && setNodeUrl('https://api.zilliqa.com/')
    setShowDropdown(false)
  }

  const labels = useMemo(() => (
    Object.entries(labelMap)
      .filter(([k, v]) => (location.search === '' ? !k.includes('?network=') : k.includes(location.search))))
    , [labelMap, location]
  )

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
            <span style={{ color: 'white', fontFamily: 'Jura', fontSize: '20px' }}>DEVEX</span>
          </Navbar.Brand>
        </QueryPreservingLink>
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
                  setCurrentNetwork(v)
                  setNodeUrl && setNodeUrl(k)
                }
              }}>
                {v}
              </NavDropdown.Item>
            ))}
            <NavDropdown.Divider />
            {Object.entries(nodeUrlMap).map(([k, v]) => (
              <div key={k} className='node-div'>
                <NavDropdown.Item className='node-item' onClick={() => {
                  if (currentNetwork !== v) {
                    setShowSearchbar(false)
                    setCurrentNetwork(v)
                    setNodeUrl && setNodeUrl(k)
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
              <Form onSubmit={(e: SyntheticEvent) => { e.preventDefault(); addNewNode() }}>
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
      {showLabelbar && labels.length > 0 &&
        <div className='labelbar-div'>
          <PerfectScrollbar options={{ wheelPropagation: false }}>
            <div className='labelbar'>
              {labels.map(([k, v]) => (<Link key={k} to={k}>{v}</Link>))}
            </div>
          </PerfectScrollbar>
        </div>
      }
    </>
  )
}

export default Header

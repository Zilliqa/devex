import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Nav, NavDropdown, Tooltip, OverlayTrigger, Form } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import { defaultNetworks, useNetworkName, useNetworkUrl } from 'src/services/network/networkProvider'
import { UserPrefContext } from 'src/services/userPref/userPrefProvider'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import './NetworkSwitcher.css'

const NetworkSwitcher: React.FC = () => {

  const history = useHistory()
  const networkName = useNetworkName()
  const networkUrl = useNetworkUrl()

  const userPrefContext = useContext(UserPrefContext)
  const { nodeUrlMap, setNodeUrlMap } = userPrefContext!

  const [newNode, setNewNode] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState(defaultNetworks[networkUrl] || networkUrl)

  useEffect(() => {
    setCurrentNetwork(networkName)
  }, [networkName])

  const changeNetwork = useCallback((k: string) => {
    if (k === Object.keys(defaultNetworks)[0])
      history.push('/')
    else
      history.push({
        pathname: '/',
        search: '?' + new URLSearchParams({ network: k }).toString()
      })
  }, [history])

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
    <Nav>
      <OverlayTrigger placement='left'
        overlay={<Tooltip id={'network-tt'}> {networkUrl} </Tooltip>}>
        <FontAwesomeIcon className='info-icon' icon={faInfoCircle} />
      </OverlayTrigger>
      <NavDropdown onToggle={(e: boolean) => { setShowDropdown(e) }}
        show={showDropdown} title={currentNetwork} id="header-network-dropdown">
        {Object.entries(defaultNetworks).map(([k, v]) => (
          <NavDropdown.Item key={k} onClick={() => {
            if (currentNetwork !== v) {
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
              placeholder="Add Network" />
          </Form>
          <NavDropdown.Item className='plus-icon-item' onClick={addNewNode}>
            <FontAwesomeIcon size='lg' icon={faPlus} />
          </NavDropdown.Item>
        </div>
      </NavDropdown>
    </Nav>
  )
}

export default NetworkSwitcher

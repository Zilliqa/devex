import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Nav, NavDropdown, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import { useNetworkName, useNetworkUrl } from 'src/services/network/networkProvider'
import { UserPrefContext } from 'src/services/userPref/userPrefProvider'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

import './NetworkSwitcher.css'

const NetworkSwitcher: React.FC = () => {

  const history = useHistory()
  const networkName = useNetworkName()
  const networkUrl = useNetworkUrl()

  const userPrefContext = useContext(UserPrefContext)
  const { networkMap } = userPrefContext!

  const [showDropdown, setShowDropdown] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState(networkName)

  useEffect(() => {
    setCurrentNetwork(networkName)
  }, [networkName])

  const changeNetwork = useCallback((k: string) => {
    history.push({
      pathname: '/',
      search: '?' + new URLSearchParams({ network: k }).toString()
    })
  }, [history])

  return (
    <Nav style={{ minWidth: '120px' }}>
      <OverlayTrigger placement='left'
        overlay={<Tooltip id={'network-tt'}> {networkUrl} </Tooltip>}>
        <FontAwesomeIcon className='info-icon' icon={faInfoCircle} />
      </OverlayTrigger>
      <NavDropdown onToggle={(e: boolean) => { setShowDropdown(e) }}
        show={showDropdown} title={currentNetwork} id="header-network-dropdown">
        {networkMap.size === 0
          ? <div className='text-center'>
            No networks
          </div>
          : Array.from(networkMap, ([k, v]) => (
            <div key={k} className='node-div'>
              <NavDropdown.Item className='node-item' onClick={() => {
                if (currentNetwork !== v) {
                  changeNetwork(k)
                }
              }}>
                {v}
              </NavDropdown.Item>
            </div>
          ))}
      </NavDropdown>
    </Nav>
  )
}

export default NetworkSwitcher

import React, { useState, useEffect, useContext } from 'react'
import { useLocation, Link } from 'react-router-dom'

import { DataService } from './dataService'
import { UserPrefContext } from '../userPref/userPrefProvider'

type NetworkState = {
  isIsolatedServer: boolean | null,
  dataService: DataService | null,
  networkUrl: string,
  isValidUrl: boolean | null,
  inTransition: boolean,
  isLoadingNetworks: boolean,
}

export const QueryPreservingLink = ({ to, style, className, onClick, children }
  : {
    to: string, style?: React.CSSProperties, className?: string,
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void, children: React.ReactNode
  }): JSX.Element => {
  const location = useLocation()
  return <Link style={style} className={className} onClick={onClick} to={{
    pathname: to,
    search: location.search
  }}>{children}</Link>
}

export const useSearchParams = (): string => (
  useLocation().pathname
)

export const useNetworkUrl = (): string => {
  return new URLSearchParams(useLocation().search).get('network') || ''
}

export const useNetworkName = (): string => {

  const networkUrl = useNetworkUrl()
  const userPrefContext = useContext(UserPrefContext)
  const { networkMap } = userPrefContext!

  return networkMap.get(networkUrl) || defaultNetworks.get(networkUrl) || networkUrl
}

export let defaultNetworks: Map<string, string> = (process.env['REACT_APP_DEPLOY_ENV'] === 'prd')
  ? new Map([
    ['https://api.zilliqa.com', 'Mainnet'],
    ['https://dev-api.zilliqa.com', 'Testnet'],
    ['https://zilliqa-isolated-server.zilliqa.com', 'Isolated Server'],
    ['http://52.187.126.172:4201', 'Mainnet Staked Seed Node']
  ])
  : new Map([
    ['https://api.zilliqa.com', 'Mainnet'],
    ['https://dev-api.zilliqa.com', 'Testnet'],
    ['https://zilliqa-isolated-server.zilliqa.com', 'Isolated Server'],
    ['https://stg-zilliqa-isolated-server.zilliqa.com', 'Staging Isolated Server'],
    ['http://52.187.126.172:4201', 'Mainnet Staked Seed Node']
  ])

export const NetworkContext = React.createContext<NetworkState | null>(null)

export const NetworkProvider: React.FC = (props) => {

  const userPrefContext = useContext(UserPrefContext)
  const { networkMap, setNetworkMap } = userPrefContext!

  const network = useNetworkUrl()

  const [state, setState] = useState<NetworkState>({
    isValidUrl: null,
    isIsolatedServer: null,
    dataService: null,
    networkUrl: network,
    inTransition: true,
    isLoadingNetworks: true
  })

  // Load optional networks from public folder
  useEffect(() => {
    let localNetworks
    const loadNetworks = async () => {
      console.log('loading networks')
      try {
        const response = await fetch(process.env.PUBLIC_URL + '/networks.json')
        localNetworks = await response.json()
        defaultNetworks = new Map(localNetworks.networks.map((x: { [url: string]: string }) => Object.entries(x)[0]))
        if (networkMap.size === 0)
          setNetworkMap(defaultNetworks)
      } catch (e) {
        console.log('no local networks found')
      } finally {
        setState((prevState: NetworkState) => ({ ...prevState, isLoadingNetworks: false }))
      }
    }
    loadNetworks()
    // Only called once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (state.isLoadingNetworks) return
    return setState((prevState: NetworkState) => ({
      ...prevState, dataService: new DataService(network),
      inTransition: true, isIsolatedServer: null, networkUrl: network
    }))
  }, [network, state.isLoadingNetworks])

  // If dataservice changes, update isIsolatedServer
  useEffect(() => {
    let response: boolean
    const checkNetwork = async () => {
      try {
        if (!state.dataService) return
        response = await state.dataService.isIsolatedServer()
        setState((prevState: NetworkState) => ({ ...prevState, isIsolatedServer: response, isValidUrl: true }))
      } catch (e) {
        console.log(e)
        setState((prevState: NetworkState) => ({ ...prevState, isValidUrl: false }))
      } finally {
        setState((prevState: NetworkState) => ({ ...prevState, inTransition: false }))
      }
    }
    checkNetwork()
  }, [state.dataService])

  return <NetworkContext.Provider value={state}>
    {props.children}
  </NetworkContext.Provider>
}

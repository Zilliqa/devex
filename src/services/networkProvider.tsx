import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { DataService } from './dataService'

type NetworkState = {
  connStatus: boolean,
  isIsolatedServer: boolean | null,
  dataService: DataService | null,
  nodeUrl: string,
  inTransition: boolean,
}

export const useNetworkUrl = (): string => (
  new URLSearchParams(useLocation().search).get('network') || 'https://api.zilliqa.com/')

export const useNetworkName = (): string => {
  const network = useNetworkUrl()
  return defaultNetworks[network] || network
}

export let defaultNetworks: Record<string, string> = (process.env['REACT_APP_DEPLOY_ENV'] === 'prd')
  ? {
    'https://api.zilliqa.com/': 'Mainnet',
    'https://dev-api.zilliqa.com/': 'Testnet',
    'https://zilliqa-isolated-server.zilliqa.com/': 'Isolated Server',
    'http://52.187.126.172:4201': 'Mainnet Staked Seed Node'
  }
  : {
    'https://api.zilliqa.com/': 'Mainnet',
    'https://dev-api.zilliqa.com/': 'Testnet',
    'https://zilliqa-isolated-server.zilliqa.com/': 'Isolated Server',
    'https://stg-zilliqa-isolated-server.zilliqa.com/': 'Staging Isolated Server',
    'http://52.187.126.172:4201': 'Mainnet Staked Seed Node'
  }

export const NetworkContext = React.createContext<NetworkState | null>(null)

export const NetworkProvider: React.FC = (props) => {

  const network = useNetworkUrl()

  const [state, setState] = useState<NetworkState>({
    connStatus: false,
    isIsolatedServer: false,
    dataService: null,
    nodeUrl: network,
    inTransition: false,
  })

  useEffect(() => { // Load optional urls from public folder
    let urls: Record<string, string>
    const getUrls = async () => {
      try {
        const response = await fetch(process.env.PUBLIC_URL + '/urls.json')
        urls = await response.json()
      } catch (e) {
        console.log(e)
      }
      defaultNetworks = urls
    }
    getUrls()
  }, [])

  useEffect(() => {
    setState((prevState: NetworkState) => ({
      ...prevState, dataService: new DataService(network),
      inTransition: true, isIsolatedServer: null, nodeUrl: network
    }))
  }, [network])

  // If dataservice changes, update isIsolatedServer
  useEffect(() => {
    let response: boolean
    const checkNetwork = async () => {
      try {
        if (!state.dataService) return
        response = await state.dataService.isIsolatedServer()
        setState((prevState: NetworkState) => ({ ...prevState, isIsolatedServer: response, inTransition: false }))
      } catch (e) {
        console.log(e)
      }
    }
    checkNetwork()
  }, [state.dataService])

  return <NetworkContext.Provider value={state}>
    {props.children}
  </NetworkContext.Provider>
}

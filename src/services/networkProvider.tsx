import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { DataService } from './dataService'

type NetworkState = {
  isIsolatedServer: boolean | null,
  dataService: DataService | null,
  nodeUrl: string,
  isValidUrl: boolean | null,
  inTransition: boolean,
  isLoadingUrls: boolean,
}

export const useNetworkUrl = (): string => (
  new URLSearchParams(useLocation().search).get('network') || Object.keys(defaultNetworks)[0])

export const useSearchParams = (): string => (
  useLocation().pathname
)

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
    isValidUrl: null,
    isIsolatedServer: null,
    dataService: null,
    nodeUrl: network,
    inTransition: true,
    isLoadingUrls: true
  })

  // Load optional urls from public folder
  useEffect(() => {
    let localUrls: Record<string, string> = {}
    const loadUrls = async () => {
      console.log('loading urls')
      try {
        const response = await fetch(process.env.PUBLIC_URL + '/urls.json')
        localUrls = await response.json()
        defaultNetworks = localUrls
      } catch (e) {
        console.log('no local urls found')
      } finally {
        setState((prevState: NetworkState) => ({ ...prevState, isLoadingUrls: false }))
      }
    }
    loadUrls()
  }, [])

  useEffect(() => {
    if (state.isLoadingUrls) return
    return setState((prevState: NetworkState) => ({
      ...prevState, dataService: new DataService(network),
      inTransition: true, isIsolatedServer: null, nodeUrl: network
    }))
  }, [network, state.isLoadingUrls])

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

import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useHistory } from 'react-router-dom'

import { DataService } from './dataService'

type NetworkState = {
  connStatus: boolean,
  isIsolatedServer: boolean | null,
  dataService: DataService | null,
  nodeUrl: string,
  setNodeUrl: (nodeUrl: string) => void,
}

export const useNetworkUrl = (): string => (
  new URLSearchParams(useLocation().search).get('network') || 'https://api.zilliqa.com/')

export const useNetworkName = (): string => {
  const network = useNetworkUrl()
  return defaultNetworks[network] || network
}

export const defaultNetworks: Record<string, string> = (process.env['REACT_APP_DEPLOY_ENV'] === 'prd')
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
  const history = useHistory()

  const changeNetwork = useCallback((k: string) => {
    if (k === 'https://api.zilliqa.com/')
      history.push('/')
    else
      history.push({
        pathname: '/',
        search: '?' + new URLSearchParams({ network: k }).toString()
      })
  }, [history])

  const [state, setState] = useState<NetworkState>({
    connStatus: false,
    isIsolatedServer: false,
    dataService: null,
    nodeUrl: network,
    setNodeUrl: (newNodeUrl: string) => {
      setState((prevState: NetworkState) => {
        if (prevState.nodeUrl === newNodeUrl) return prevState
        else {
          console.log(newNodeUrl)
          changeNetwork(newNodeUrl)
          return { ...prevState, nodeUrl: newNodeUrl }
        }
      })
    }
  })

  useEffect(() => {
    state.setNodeUrl(network)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network])

  // If nodeurl changes, update dataservice
  useEffect(() => {
    setState((prevState: NetworkState) => (
      { ...prevState, dataService: new DataService(state.nodeUrl), isIsolatedServer: null }))
  }, [state.nodeUrl])

  // If dataservice changes, update isIsolatedServer
  useEffect(() => {
    let response: boolean
    const checkNetwork = async () => {
      try {
        if (!state.dataService) return
        response = await state.dataService.isIsolatedServer()
        setState((prevState: NetworkState) => ({ ...prevState, isIsolatedServer: response }))
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

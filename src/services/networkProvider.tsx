import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { DataService } from './dataService'

type NetworkState = {
  connStatus: boolean,
  isIsolatedServer: boolean | null,
  dataService: DataService | null,
  nodeUrl: string,
  setNodeUrl: (nodeUrl: string) => void,
  nodeUrlMap: Record<string, string>,
  setNodeUrlMap: (newNodeUrlMap: Record<string, string>) => void,
}

export const defaultNetworks: {[key: string]: string} = {
  'https://api.zilliqa.com/': 'Mainnet',
  'https://dev-api.zilliqa.com/': 'Testnet',
  'https://zilliqa-isolated-server.zilliqa.com/': 'Isolated Server',
  'https://stg-zilliqa-isolated-server.zilliqa.com/': 'Staging Isolated Server'
}

export const NetworkContext = React.createContext<NetworkState | null>(null)

export const NetworkProvider: React.FC = (props) => {
  
  const history = useHistory()

  const [state, setState] = useState<NetworkState>({
    connStatus: false,
    isIsolatedServer: false,
    dataService: null,
    nodeUrlMap: localStorage.getItem('nodeUrlMap')
      ? JSON.parse(localStorage.getItem('nodeUrlMap')!)
      : {},
    setNodeUrlMap: (newNodeUrlMap: { [key: string]: string }) => {
      setState({ ...state, nodeUrlMap: newNodeUrlMap })
    },
    nodeUrl: localStorage.getItem('nodeUrl') || 'https://api.zilliqa.com/',
    setNodeUrl: (newNodeUrl: string) => {
      setState({ ...state, nodeUrl: newNodeUrl })
    }
  })

  /* Storage useEffects */
  useEffect(() => {
    console.log(state.nodeUrl)
    localStorage.setItem('nodeUrl', state.nodeUrl);
  }, [state.nodeUrl])

  useEffect(() => {
    console.log(state.nodeUrlMap)
    localStorage.setItem('nodeUrlMap', JSON.stringify(state.nodeUrlMap));
    // Needed for deep compare of nodeUrlMap
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state.nodeUrlMap)])

  /* Redirect useEffect */
  useEffect(() => {
    return () => history.push('/')
    // Effect is independent of history
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.nodeUrl])

  // If nodeurl changes, update dataservice
  useEffect(()=> {
    setState((prevState: NetworkState) => (
      { ...prevState, dataService: new DataService(prevState.nodeUrl), isIsolatedServer: null }))
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

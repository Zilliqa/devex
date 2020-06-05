import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { DataService } from './dataService'

type NetworkState = {
  connStatus: boolean,
  dataService: DataService,
  nodeUrlMap: { [key: string]: string },
  setNodeUrlMap: any,
  nodeUrl: string,
  setNodeUrl: (nodeUrl: string) => void
}

export const defaultNetworks: {[key: string]: string} = {
  'https://api.zilliqa.com/': 'Mainnet',
  'https://dev-api.zilliqa.com/': 'Testnet',
  'https://zilliqa-isolated-server.zilliqa.com/': 'Isolated Server',
  'https://stg-zilliqa-isolated-server.zilliqa.com/': 'Staging Isolated Server'
}

export const NetworkContext = React.createContext<NetworkState | null>(null)

export const NetworkProvider: React.FC = (props) => {
  let history = useHistory()
  const dataService = new DataService(localStorage.getItem('nodeUrl'))

  const [state, setState] = useState<NetworkState>({
    connStatus: false,
    dataService: dataService,
    nodeUrlMap: localStorage.getItem('nodeUrlMap')
      ? JSON.parse(localStorage.getItem('nodeUrlMap')!)
      : {},
    setNodeUrlMap: (newNodeUrlMap: { [key: string]: string }) => {
      setState({ ...state, nodeUrlMap: newNodeUrlMap })
    },
    nodeUrl: localStorage.getItem('nodeUrl') || 'https://api.zilliqa.com/',
    setNodeUrl: (newNodeUrl: string) => {
      setState({ ...state, dataService: new DataService(newNodeUrl), nodeUrl: newNodeUrl })
    }
  })

  useEffect(() => {
    localStorage.setItem('nodeUrl', state.nodeUrl);
  }, [state.nodeUrl])

  useEffect(() => {
    localStorage.setItem('nodeUrlMap', JSON.stringify(state.nodeUrlMap));
    // Needed for deep compare of nodeUrlMap
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state.nodeUrlMap)])

  // Redirect to home page if dataservice change
  useEffect(() => {
    return () => history.push('/')
    // Effect is independent of history
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.dataService])

  return <NetworkContext.Provider value={state}>
    {props.children}
  </NetworkContext.Provider>
}

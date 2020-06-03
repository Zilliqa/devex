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

export const NetworkContext = React.createContext<NetworkState | null>(null)

export const NetworkProvider: React.FC = (props) => {
  let history = useHistory()
  const dataService = new DataService(localStorage.getItem('nodeUrl'))
  const [nodeUrlMap, setNodeUrlMap] = useState<{ [key: string]: string }>(
    localStorage.getItem('nodeUrlMap') ? JSON.parse(localStorage.getItem('nodeUrlMap')!)
      : ({
        'https://api.zilliqa.com/': 'Mainnet',
        'https://dev-api.zilliqa.com/': 'Testnet',
        'https://zilliqa-isolated-server.zilliqa.com/': 'Simulated Env'
      })
  )

  const [state, setState] = useState<NetworkState>({
    connStatus: false,
    dataService: dataService,
    nodeUrlMap: nodeUrlMap,
    setNodeUrlMap: setNodeUrlMap,
    nodeUrl: localStorage.getItem('nodeUrl') || 'https://api.zilliqa.com/',
    setNodeUrl: (newNodeUrl: string) => {
      setState({ ...state, dataService: new DataService(newNodeUrl), nodeUrl: newNodeUrl })
    }
  })

  useEffect(() => {
    localStorage.setItem('nodeUrl', state.nodeUrl);
  }, [state.nodeUrl]);

  useEffect(() => {
    localStorage.setItem('nodeUrlMap', JSON.stringify(nodeUrlMap));
  }, [nodeUrlMap]);

  // Redirect to home page of dataservice change
  useEffect(() => {
    return () => history.push('/')
  }, [state.dataService, history])

  return <NetworkContext.Provider value={state}>
    {props.children}
  </NetworkContext.Provider>
}

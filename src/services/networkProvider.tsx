import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { DataService } from './dataService'

type NetworkState = {
  connStatus: boolean,
  dataService: DataService,
  nodeUrl: string,
  setNodeUrl: (nodeUrl: string) => void
}

export const NetworkContext = React.createContext<NetworkState | null>(null)

export const NetworkProvider: React.FC = (props) => {
  let history = useHistory()
  const dataService = new DataService()

  const [state, setState] = useState<NetworkState>({
    connStatus: false,
    dataService: dataService,
    nodeUrl: '',
    setNodeUrl: (newNodeUrl: string) => {
      setState({ ...state, dataService: new DataService(newNodeUrl), nodeUrl: newNodeUrl })
    }
  })

  // Redirect to home page of dataservice change
  useEffect(() => {
    return () => history.push('/')
  }, [state.dataService, history])

  return <NetworkContext.Provider value={state}>
    {props.children}
  </NetworkContext.Provider>
}

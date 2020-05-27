import React, { useState } from 'react'

import { DataService } from './dataService'

type NetworkState = {
  connStatus: boolean,
  dataService: DataService,
  nodeUrl: string,
  setNodeUrl: (nodeUrl: string) => void
}

export const NetworkContext = React.createContext<NetworkState | null>(null)

export const NetworkProvider: React.FC = (props) => {
  const dataService = new DataService()

  const [state, setState] = useState<NetworkState>({
    connStatus: false,
    dataService: dataService,
    nodeUrl: '',
    setNodeUrl: (newNodeUrl: string) => {
      setState({ ...state, dataService: new DataService(newNodeUrl), nodeUrl: newNodeUrl })
    }
  })

  return <NetworkContext.Provider value={state}>
    {props.children}
  </NetworkContext.Provider>
}

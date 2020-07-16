import React, { useState } from 'react'

import { defaultNetworks } from '../network/networkProvider'

export interface LabelInfo {
  name: string,
  type: string,
  networkUrl: string,
  networkName: string,
  timeAdded: number,
}

type UserPrefState = {
  nodeUrlMap: Map<string, string>,
  setNodeUrlMap: (newNodeUrlMap: Map<string, string>) => void,
  labelMap: Record<string, LabelInfo>,
  setLabelMap: (newLabelMap: Record<string, LabelInfo>) => void,
}

export const UserPrefContext = React.createContext<UserPrefState | undefined>(undefined)

export const UserPrefProvider: React.FC = (props) => {

  const [state, setState] = useState<UserPrefState>({
    nodeUrlMap: localStorage.getItem('nodeUrlMap')
      ? new Map(JSON.parse(localStorage.getItem('nodeUrlMap')!))
      : defaultNetworks,
    setNodeUrlMap: (newNodeUrlMap) => {
      localStorage.setItem('nodeUrlMap', JSON.stringify(Array.from(newNodeUrlMap.entries())))
      setState((prevState) => ({ ...prevState, nodeUrlMap: newNodeUrlMap }))
    },
    labelMap: localStorage.getItem('labelMap')
      ? JSON.parse(localStorage.getItem('labelMap')!)
      : {},
    setLabelMap: (newLabelMap) => {
      localStorage.setItem('labelMap', JSON.stringify(newLabelMap))
      setState((prevState) => ({ ...prevState, labelMap: newLabelMap }))
    },
  })

  return <UserPrefContext.Provider value={state}>
    {props.children}
  </UserPrefContext.Provider>
}

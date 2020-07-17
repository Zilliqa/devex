import React, { useState } from 'react'

export interface LabelInfo {
  name: string,
  type: string,
  networkUrl: string,
  networkName: string,
  timeAdded: number,
}

type UserPrefState = {
  networkMap: Map<string, string>,
  setNetworkMap: (newNodeUrlMap: Map<string, string>) => void,
  labelMap: Record<string, LabelInfo>,
  setLabelMap: (newLabelMap: Record<string, LabelInfo>) => void,
}

export const UserPrefContext = React.createContext<UserPrefState | undefined>(undefined)

export const UserPrefProvider: React.FC = (props) => {

  const [state, setState] = useState<UserPrefState>({
    networkMap: localStorage.getItem('networkMap')
      ? new Map(JSON.parse(localStorage.getItem('networkMap')!))
      : new Map(),
    setNetworkMap: (newNodeUrlMap) => {
      localStorage.setItem('networkMap', JSON.stringify(Array.from(newNodeUrlMap.entries())))
      setState((prevState) => ({ ...prevState, networkMap: newNodeUrlMap }))
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

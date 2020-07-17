import React, { useState, useContext, useEffect, useRef } from 'react'

import { UserPrefContext } from 'src/services/userPref/userPrefProvider'

import NetworksDnd, { NetworkItem } from './NetworksDnd'
import './NetworksList.css'

const serialiseNetworks = (networkItems: NetworkItem[]): Map<string, string> => {
  return new Map(networkItems.map((x) => [x.url, x.name]))
}

const unserialiseNetworks = (networkMap: Map<string, string>): NetworkItem[] => {
  return Array.from(networkMap).map((x, index) => ({ id: index, url: x[0], name: x[1] }))
}

const NetworksList: React.FC = () => {

  const userPrefContext = useContext(UserPrefContext)
  const { nodeUrlMap, setNodeUrlMap } = userPrefContext!
  const [cards, setCards] = useState<NetworkItem[]>(unserialiseNetworks(nodeUrlMap))
  const cardsRef = useRef(cards)

  const deleteNode = (k: string) => {
    const temp = new Map(nodeUrlMap)
    temp.delete(k)
    setNodeUrlMap(temp)
  }

  const editNode = (url: string, newName: string) => {
    const temp = new Map(nodeUrlMap)
    temp.set(url, newName)
    setNodeUrlMap(temp)
  }

  useEffect(() => {
    if (JSON.stringify(cards) !== JSON.stringify(cardsRef.current)) {
      setNodeUrlMap(serialiseNetworks(cards))
      cardsRef.current = cards
    }
    // Ignored to avoid multiple calls
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards])

  useEffect(() => {
    setCards(unserialiseNetworks(nodeUrlMap))
  }, [nodeUrlMap])

  return (
    <>
      <NetworksDnd
        cards={cards}
        setCards={setCards}
        deleteNode={deleteNode}
        editNode={editNode} />
    </>
  )
}

export default NetworksList

import React, { useState, useContext, useEffect, useRef } from 'react'

import { UserPrefContext, NetworkMap } from 'src/services/userPref/userPrefProvider'

import Dropzone from '../Misc/Dropzone/Dropzone'
import NetworksDnd, { NetworkItem } from './NetworksDnd'
import './NetworksList.css'

const serialiseNetworks = (networkItems: NetworkItem[]): NetworkMap => {
  return new Map(networkItems.map((x) => [x.url, x.name]))
}

const unserialiseNetworks = (networkMap: NetworkMap): NetworkItem[] => {
  return Array.from(networkMap).map((x, index) => ({ id: index, url: x[0], name: x[1] }))
}

const NetworksList: React.FC = () => {

  const userPrefContext = useContext(UserPrefContext)
  const { networkMap, setNetworkMap } = userPrefContext!
  const [cards, setCards] = useState<NetworkItem[]>(unserialiseNetworks(networkMap))
  const cardsRef = useRef(cards)

  const deleteNode = (k: string) => {
    const temp = new Map(networkMap)
    temp.delete(k)
    setNetworkMap(temp)
  }

  const editNode = (url: string, newName: string) => {
    const temp = new Map(networkMap)
    temp.set(url, newName.toString())
    setNetworkMap(temp)
  }

  useEffect(() => {
    if (JSON.stringify(cards) !== JSON.stringify(cardsRef.current)) {
      setNetworkMap(serialiseNetworks(cards))
      cardsRef.current = cards
    }
    // Ignored to avoid multiple calls
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards])

  useEffect(() => {
    setCards(unserialiseNetworks(networkMap))
  }, [networkMap])

  return (
    <>
      {cards.length === 0
        ? <Dropzone
          fromJson={(json: any) => new Map(json.networks.map((x: { [url: string]: string }) => Object.entries(x)[0]))}
          dropCb={setNetworkMap} />
        : <NetworksDnd
          cards={cards}
          setCards={setCards}
          deleteNode={deleteNode}
          editNode={editNode} />
      }
    </>
  )
}

export default NetworksList

import React, { useState, useCallback, useContext, useEffect, useRef } from 'react'
import NetworkCard from './NetworkCard'
import update from 'immutability-helper'
import { UserPrefContext } from 'src/services/userPref/userPrefProvider'

interface NetworkItem {
  url: string
  name: string
}

const serialiseNetworks = (networkItems: NetworkItem[]) => {
  return new Map(networkItems.map(x => [x.url, x.name]))
}

const unserialiseNetworks = (networkMap: Map<string, string>) => {
  return Array.from(networkMap).map(x => ({ url: x[0], name: x[1] }))
}

const NetworksList: React.FC = () => {

  const userPrefContext = useContext(UserPrefContext)
  const { nodeUrlMap, setNodeUrlMap } = userPrefContext!

  const deleteNode = (k: string) => {
    const temp = new Map(nodeUrlMap)
    temp.delete(k)
    setNodeUrlMap(temp)
  }

  const [cards, setCards] = useState<NetworkItem[]>(unserialiseNetworks(nodeUrlMap))

  const cardsRef = useRef(cards)

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

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      console.log(dragIndex)
      console.log(hoverIndex)
      const dragCard = cards[dragIndex]
      setCards(
        update(cards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        }),
      )
    },
    [cards],
  )

  const renderCard = (card: NetworkItem, index: number) => {
    return (
      <NetworkCard
        key={card.url}
        index={index}
        url={card.url}
        name={card.name}
        moveCard={moveCard}
        deleteNode={deleteNode}
      />
    )
  }

  return (
    <>
      <div>
        {cards.map((card, i) => renderCard(card, i))}
      </div>
    </>
  )
}

export default NetworksList

import React, { useState, useContext, useEffect, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import { UserPrefContext } from 'src/services/userPref/userPrefProvider'

import NetworkCard from './NetworkCard'
import './NetworksList.css'

interface NetworkItem {
  id: number,
  url: string,
  name: string
}

const reorder = (list: NetworkItem[], startIndex: number, endIndex: number): NetworkItem[] => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const grid = 16

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "var(--color-highlight)" : "var(--color-card-bg)",
  ...draggableStyle
})

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "var(--color-card-bg)" : "var(--color-card-bg)",
  padding: grid,
  width: '100%',
  border: 'solid 1px var(--color-border)',
  borderRadius: '5px'
})

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

  const onDragEnd = (result: any) => {

    if (!result.destination) {
      return
    }

    const reorderedCards = reorder(
      cards,
      result.source.index,
      result.destination.index
    )

    setCards(reorderedCards)
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              className='dnd'
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <NetworkCard
                        key={card.url}
                        url={card.url}
                        name={card.name}
                        deleteNode={deleteNode}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}

export default NetworksList

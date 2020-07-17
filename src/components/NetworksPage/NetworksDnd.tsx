import React from 'react'
import { Container } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import NetworkCard from './NetworkCard/NetworkCard'
import './NetworksList.css'

export interface NetworkItem {
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

interface IProps {
  cards: NetworkItem[],
  setCards: (cards: NetworkItem[]) => void,
  deleteNode: (k: string) => void,
  editNode: (url: string, newName: string) => void
}

const NetworksDnd: React.FC<IProps> = ({ cards, setCards, deleteNode, editNode }) => {

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

  return <Container>
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
                      editNode={editNode}
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
  </Container>
}

export default NetworksDnd

import React, { useRef } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'

import { ItemTypes } from './ItemTypes'
import './NetworkCard.css'

interface IProps {
  url: string,
  name: string,
  index: number,
  moveCard: (dragIndex: number, hoverIndex: number) => void,
  deleteNode: (k: string) => void,
}

interface DragItem {
  index: number
  id: string
  type: string
}

const NetworkCard: React.FC<IProps> = ({ url, name, index, moveCard, deleteNode }) => {

  const ref = useRef<HTMLDivElement | null>(null)

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item: DragItem, monitor: DropTargetMonitor) {

      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect()

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()!
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY)
        return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
        return

      moveCard(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, url, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1;

  drag(drop(ref))

  return (
    <div ref={ref} style={{ opacity }} className='network-card'>
      <div className='network-card-div'>
        <div>
          {name}
        </div>
        <div>
          <FontAwesomeIcon
            onClick={() => { console.log('editing network') }}
            cursor='pointer'
            className='ml-3'
            icon={faEdit} />
          <FontAwesomeIcon
            onClick={() => deleteNode(url)}
            cursor='pointer'
            className='ml-3'
            icon={faTrashAlt} />
        </div>
      </div>
    </div>
  )
}

export default NetworkCard

import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'

import './NetworkCard.css'

interface IProps {
  url: string,
  name: string,
  deleteNode: (k: string) => void,
}

const NetworkCard: React.FC<IProps> = ({ url, name, deleteNode }) => {

  return (
    <div className='network-card'>
      <div className='network-card-div'>
        <div>
          {name}
          {' '}
          <small className='subtext'>
            ({url})
          </small>
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

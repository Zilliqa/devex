import React from 'react'
import { Card } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

import './NotFoundPage.css'

const NotFoundPage: React.FC = () => {
  return <>
    <Card className='not-found-card'>
      <Card.Body>
        <FontAwesomeIcon size='3x' icon={faExclamationTriangle} />
        <br />
        <h6>
          Could not find requested page. Try again later!
        </h6>
      </Card.Body>
    </Card>
  </>
}

export default NotFoundPage

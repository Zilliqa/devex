import React from 'react'
import { Card, Button } from 'react-bootstrap'

import { useNetworkUrl, useSearchParams } from 'src/services/networkProvider'

import './NotFoundPage.css'

const NotFoundPage: React.FC = () => {
  return <>
    <Card className='not-found-card'>
      <Card.Body>
        <h4 className='mb-3'>
          Sorry! Could not find requested page. Try again later!
        </h4>
        <h6>
          Network: <strong>{useNetworkUrl()}</strong>
        </h6>
        <h6>
          Search: <strong>{useSearchParams()}</strong>
        </h6>
        <Button className='mt-4 return-home-btn'>
          Return to Dashboard
        </Button>
      </Card.Body>
    </Card>
  </>
}

export default NotFoundPage

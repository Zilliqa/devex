import React from 'react'
import { Card, Button } from 'react-bootstrap'

import { useNetworkUrl } from 'src/services/network/networkProvider'

import './ErrorPages.css'

const NetworkErrPage: React.FC = () => {
  return <>
    <Card className='error-card'>
      <Card.Body>
        <h4 className='mb-3'>
          Sorry! Could not connect to network. Try again later!
        </h4>
        <h5>
          <strong>{useNetworkUrl()}</strong>
        </h5>
        <Button id='error-btn' onClick={() => window.location.reload()} className='mt-4'>
          <span>
            Retry Connection
          </span>
        </Button>
      </Card.Body>
    </Card>
  </>
}

export default NetworkErrPage

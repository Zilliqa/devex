import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { useLocation, Link } from 'react-router-dom'

import { useNetworkUrl, useSearchParams } from 'src/services/network/networkProvider'

import './ErrorPages.css'

const NotFoundPage: React.FC = () => {

  const location = useLocation()

  return <>
    <Card className='error-card'>
      <Card.Body>
        <h4 className='mb-3'>
          Sorry! Could not find requested page. Try again later!
        </h4>
        <h6 className='mb-2'>
          Network: <strong>{useNetworkUrl()}</strong>
        </h6>
        <h6>
          Search: <strong>{useSearchParams()}</strong>
        </h6>
        <Link to={{ pathname: '/', search: location.search }}>
          <Button id='error-btn' className='mt-4'>
            <span>
              Return to Dashboard
              </span>
          </Button>
        </Link>
      </Card.Body>
    </Card>
  </>
}

export default NotFoundPage

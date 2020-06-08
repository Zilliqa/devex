import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Collapse } from 'react-bootstrap'

import { hexAddrToZilAddr } from 'src/utils/Utils'
import { AccContract } from 'src/typings/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

interface IProps {
  contract: AccContract,
  index: number
}

const AccContractCard: React.FC<IProps> = ({ contract, index }) => {

  const [ showState, setShowState ] = useState<boolean>(false)

  return <Card style={{ border: '1px solid rgba(0, 0, 0, .3)', marginBottom: '1rem' }}>
    <Card.Body style={{ cursor: 'pointer' }} onClick={()=>{setShowState((prevState) => !prevState)}} key={index}>
      <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <span>
          {`${index + 1}) `}
          {<Link onClick={(e: any) => {e.stopPropagation()}} to={`/address/${hexAddrToZilAddr(contract.address)}`}>
            {hexAddrToZilAddr(contract.address)}
          </Link>}
        </span>
        <span>
          <FontAwesomeIcon icon={showState ? faChevronUp : faChevronDown} />
        </span>
      </div>
    </Card.Body>
    <Collapse in={showState}>
        <div style={{ borderTop: '1px solid rgba(0, 0, 0, .25)', whiteSpace: 'pre-wrap' }}>
          <div style={{ padding: '2rem' }}>
            <pre style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
              {JSON.stringify(contract.state, null, 2)}
            </pre>
          </div>
        </div>
      </Collapse>
  </Card>
}

export default AccContractCard
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Collapse } from 'react-bootstrap'

import { AccContract } from 'src/typings/api'
import { hexAddrToZilAddr } from 'src/utils/Utils'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

interface IProps {
  contract: AccContract,
  index: number
}

const AccContractCard: React.FC<IProps> = ({ contract, index }) => {

  const [showContractState, setShowContractState] = useState<boolean>(false)

  return <Card className='acc-contract-card'>
    <Card.Body onClick={() => { setShowContractState((prevState) => !prevState) }} key={index}>
      <div>
        <span>
          {`${index + 1}) `}
          {<Link onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.stopPropagation() }} to={`/address/${hexAddrToZilAddr(contract.address)}`}>
            {hexAddrToZilAddr(contract.address)}
          </Link>}
        </span>
        <span>
          <FontAwesomeIcon icon={showContractState ? faChevronUp : faChevronDown} />
        </span>
      </div>
    </Card.Body>
    <Collapse in={showContractState}>
      <div>
        <pre>
          {JSON.stringify(contract.state, null, 2)}
        </pre>
      </div>
    </Collapse>
  </Card>
}

export default AccContractCard

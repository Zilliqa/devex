import React, { useState } from 'react'
import { Card, Collapse } from 'react-bootstrap'

import { QueryPreservingLink } from 'src/services/network/networkProvider'
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
        <span className='mono'>
          {`${index + 1}) `}
          {<QueryPreservingLink onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.stopPropagation() }} 
            to={`/address/${hexAddrToZilAddr(contract.address)}`}>
            {hexAddrToZilAddr(contract.address)}
          </QueryPreservingLink>}
        </span>
        <span>
          <FontAwesomeIcon icon={showContractState ? faChevronUp : faChevronDown} />
        </span>
      </div>
    </Card.Body>
    <Collapse in={showContractState}>
      <div>
        <pre className='code-block'>
          {JSON.stringify(contract.state, null, 2)}
        </pre>
      </div>
    </Collapse>
  </Card>
}

export default AccContractCard

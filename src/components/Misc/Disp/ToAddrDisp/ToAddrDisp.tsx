import React from 'react'

import { QueryPreservingLink } from 'src/services/network/networkProvider'
import { TransactionDetails } from 'src/typings/api'
import { hexAddrToZilAddr } from 'src/utils/Utils'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileContract } from '@fortawesome/free-solid-svg-icons'

interface IProps {
  txnDetails: TransactionDetails
}

const ToAddrDisp: React.FC<IProps> = ({ txnDetails }) => (
  txnDetails.contractAddr
    ? txnDetails.isContractCreation
      ? <QueryPreservingLink to={`/address/${hexAddrToZilAddr(txnDetails.contractAddr)}`}>
        <FontAwesomeIcon color='darkturquoise' icon={faFileContract} />
        {' '}
        Contract Creation
      </QueryPreservingLink>
      : <QueryPreservingLink to={`/address/${hexAddrToZilAddr(txnDetails.contractAddr)}`}>
        <FontAwesomeIcon color='darkorange' icon={faFileContract} />
        {' '}
        Contract Execution
      </QueryPreservingLink>
    : <QueryPreservingLink to={`/address/${hexAddrToZilAddr(txnDetails.txn.txParams.toAddr)}`}>
      {hexAddrToZilAddr(txnDetails.txn.txParams.toAddr)}
    </QueryPreservingLink>
)

export default ToAddrDisp

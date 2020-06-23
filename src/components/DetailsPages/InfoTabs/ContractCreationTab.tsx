import React from 'react'

import { hexAddrToZilAddr } from 'src/utils/Utils'
import { QueryPreservingLink } from 'src'

interface IProps {
  contractAddr: string
}

const ContractCreationTab: React.FC<IProps> = ({ contractAddr }) => {
  return (
    <>
      {<QueryPreservingLink to={`/address/${hexAddrToZilAddr(contractAddr)}`} >{hexAddrToZilAddr(contractAddr)}</QueryPreservingLink>}
    </>
  )
}

export default ContractCreationTab

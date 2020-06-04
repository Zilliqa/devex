import React from 'react'
import { Link } from 'react-router-dom'

import { hexAddrToZilAddr } from 'src/utils/Utils'

const ContractCreationTab = ({ contractAddr }: { contractAddr: string }) => {
  return (
    <>
      {<Link to={`/address/${hexAddrToZilAddr(contractAddr)}`} >{hexAddrToZilAddr(contractAddr)}</Link>}
    </>
  )
}

export default ContractCreationTab

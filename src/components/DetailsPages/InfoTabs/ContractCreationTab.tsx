import React from 'react'
import { Link } from 'react-router-dom'

import { hexAddrToZilAddr } from 'src/utils/Utils'

interface IProps {
  contractAddr: string
}

const ContractCreationTab: React.FC<IProps> = ({ contractAddr }) => {
  return (
    <>
      {<Link to={`/address/${hexAddrToZilAddr(contractAddr)}`} >{hexAddrToZilAddr(contractAddr)}</Link>}
    </>
  )
}

export default ContractCreationTab

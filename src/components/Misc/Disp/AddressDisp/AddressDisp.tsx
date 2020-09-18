import React, { useState, useEffect } from 'react'

import { QueryPreservingLink } from 'src/services/network/networkProvider'
import { isValidAddr } from 'src/utils/Utils'
import { fromBech32Address, toBech32Address } from '@zilliqa-js/crypto'
import { validation } from '@zilliqa-js/util'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faRetweet } from '@fortawesome/free-solid-svg-icons'

import CustomToast from '../CustomToast'

import '../Disp.css'


interface IProps {
  addr: string,
  isLinked: boolean
}

const AddressDisp: React.FC<IProps> = ({ addr, isLinked }) => {

  const [showToast, setShowToast] = useState(false)
  const [addrPair, setAddrPair] = useState<string[] | null>(null) // [bech32, hex]
  const [toggle, setToggle] = useState(0)

  useEffect(() => {
    if (isValidAddr(addr)) {
      if (validation.isBech32(addr))
        setAddrPair([addr, fromBech32Address(addr).toLowerCase()])
      else {
        try {
          setAddrPair([toBech32Address(addr), addr])
        }
        catch(e) {
          //Ignore the catch
        }
      }
    }
  }, [addr])

  return (
    addrPair &&
    <>
      {showToast &&
        <CustomToast setShowToast={setShowToast} isSuccess bodyText='Copied' />
      }
      <div className='d-flex'>
        <h6 className='mr-2 mono'>
          {isLinked
            ? <QueryPreservingLink to={`/address/${addrPair[toggle]}`}>
              {addrPair[toggle]}
            </QueryPreservingLink>
            : addrPair[toggle]
          }
        </h6>
        <div
          onClick={() => {
            setToggle((prevToggle) => prevToggle === 0 ? 1 : 0)
          }}
          className='mr-2 disp-btn'>
          <FontAwesomeIcon size='sm' icon={faRetweet} />
        </div>
        <div
          onClick={() => {
            navigator.clipboard.writeText(addrPair[toggle])
            setShowToast(true)
          }}
          className='disp-btn'>
          <FontAwesomeIcon size='sm' icon={faCopy} />
        </div>
      </div>
    </>
  )
}

export default AddressDisp

import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'

import CustomToast from '../CustomToast'

interface IProps {
  hash: string
}

const HashDisp: React.FC<IProps> = ({ hash }) => {

  const [showToast, setShowToast] = useState(false)

  return (
    <>
      {showToast &&
        <CustomToast setShowToast={setShowToast} isSuccess bodyText='Copied' />
      }
      <div className='d-flex'>
        <h6 className='mono mr-2'>
          {hash}
        </h6>
        <div
          onClick={() => {
            navigator.clipboard.writeText(hash)
            setShowToast(true)
          }}
          className='disp-btn'>
          <FontAwesomeIcon size='sm' icon={faCopy} />
        </div>
      </div>
    </>
  )
}

export default HashDisp

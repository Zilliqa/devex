import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'

import CustomToast from './CustomToast'

import './Copyable.css'

interface IProps {
  textToBeCopied: string
}

const Copyable: React.FC<IProps> = ({ textToBeCopied }) => {

  const [showToast, setShowToast] = useState(false)

  return <>
    {showToast &&
      <CustomToast setShowToast={setShowToast} isSuccess bodyText='Copied' />
    }
    <div className='d-flex'>
      <h6 className='copy-text subtext'>
        {textToBeCopied}
      </h6>
      <div
        onClick={() => {
          navigator.clipboard.writeText(textToBeCopied)
          setShowToast(true)
        }}
        className='copy-btn subtext'>
        <FontAwesomeIcon icon={faCopy} />
      </div>
    </div>
  </>
}

export default Copyable
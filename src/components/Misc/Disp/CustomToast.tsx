import React from 'react'
import { Toast } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import './CustomToast.css'

interface IProps {
  setShowToast: (bool: boolean) => void,
  isSuccess: boolean,
  bodyText: string
}

const CustomToast: React.FC<IProps> = (props) => {

  const { setShowToast, isSuccess, bodyText } = props

  return <div
    aria-live="polite"
    aria-atomic="true"
    style={{
      position: 'fixed',
      top: '90px',
      right: '20px',
    }}
  >
    <Toast
      onClose={() => setShowToast(false)}
      show={true}
      delay={3000}
      autohide
      className={isSuccess ? 'custom-toast-success' : 'custom-toast-failure'}
    >
      <Toast.Body className='d-flex' style={{ padding: '0.35rem' }}>
        <span className='mr-2'>
          {
            isSuccess
              ? <FontAwesomeIcon size='lg' className='custom-toast-icon' icon={faCheck} />
              : <FontAwesomeIcon size='lg' className='custom-toast-icon' icon={faTimesCircle} />
          }
        </span>
        <span className='custom-toast-text'>{bodyText}</span>
      </Toast.Body>
    </Toast>
  </div>
}

export default CustomToast

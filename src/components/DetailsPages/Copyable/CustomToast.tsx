import React from 'react'
import { Toast } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

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
      zIndex: 1,
      position: 'absolute',
      top: '20px',
      right: '20px',
    }}
  >
    <Toast
      onClose={() => setShowToast(false)}
      show={true}
      delay={3000}
      autohide
      className={isSuccess ? 'copy-toast-success' : 'copy-toast-failure'}
    >
      <Toast.Body className='d-flex' style={{ padding: '0.35rem' }}>
        <span className='mr-2'>
          {
            isSuccess
              ? <FontAwesomeIcon size='lg' className='copy-toast-icon' icon={faCheck} />
              : <FontAwesomeIcon size='lg' className='copy-toast-icon' icon={faTimesCircle} />
          }
        </span>
        <span className='copy-toast-text'>{bodyText}</span>
      </Toast.Body>
    </Toast>
  </div>
}

export default CustomToast

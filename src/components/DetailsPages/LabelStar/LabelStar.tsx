import React, { useState, useContext, useEffect, useCallback, useMemo, SyntheticEvent } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

import { useNetworkUrl } from 'src/services/networkProvider'
import { UserPrefContext, LabelInfo } from 'src/services/userPrefProvider'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons'
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons'

import './LabelStar.css'

const LabelStar: React.FC = () => {
  const location = useLocation()
  const network = useNetworkUrl()
  const userPrefContext = useContext(UserPrefContext)
  const { labelMap, setLabelMap } = userPrefContext!
  const currPath = useMemo(() => (location.pathname + location.search), [location])

  const [isLit, setIsLit] = useState(Object.keys(labelMap).includes(currPath))
  const [show, setShow] = useState(false)
  const [labelInput, setLabelInput] = useState('')

  const handleCloseModal = () => setShow(false)
  const handleShowModal = () => setShow(true)

  useEffect(() => {
    setIsLit(Object.keys(labelMap).includes(currPath))
  }, [labelMap, currPath])

  const removeLabel = useCallback(() => {
    const temp = { ...labelMap }
    delete temp[currPath]
    setLabelMap(temp)
  }, [labelMap, setLabelMap, currPath])

  const getTypeFromPathname = useCallback((pathname: string) => {
    if (pathname.includes('address'))
      return 'Address'
    else if (pathname.includes('txbk'))
      return 'Tx Block'
    else if (pathname.includes('dsbk'))
      return 'DS Block'
    else if (pathname.includes('tx'))
      return 'Transaction'
    else
      return ''
  }, [])

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    const newLabelInfo: LabelInfo = {
      name: labelInput,
      type: getTypeFromPathname(location.pathname),
      network: network,
      timeAdded: Date.now()
    }
    setLabelMap({ ...labelMap, [currPath]: newLabelInfo })
    handleCloseModal()
    setLabelInput('')
  }

  return (
    <>
      {labelMap[location.pathname + location.search]
        ? <span className='label-name subtext'>
          ({labelMap[location.pathname + location.search].name})
          </span>
        : null}
      <span className='star-span' >
        <FontAwesomeIcon onClick={isLit ? removeLabel : handleShowModal} color='grey'
          className={isLit ? 'star-filled-icon' : 'star-outline-icon'}
          icon={isLit ? faStarFilled : faStarOutline} size='xs' />
        <Modal className='label-modal' show={show} onHide={handleCloseModal}>
          <div className='label-modal-header'>
            <h6>
              Add Label
            </h6>
          </div>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <Form.Control
                  autoFocus={true}
                  required
                  type='text'
                  value={labelInput}
                  maxLength={20}
                  onChange={(e) => { setLabelInput(e.target.value) }}
                  placeholder='Label Name' />
              </div>
              <div>
                <Button block type='submit'>
                  Save
              </Button>
              </div>
            </Form>
            <div className='label-modal-footer'>
              <span>Labels can be accessed from the Labels Page</span>
              <br />
              <span>Label data is saved in the local storage of your browser</span>
            </div>
          </Modal.Body>
        </Modal>
      </span>
    </>
  )
}

export default LabelStar

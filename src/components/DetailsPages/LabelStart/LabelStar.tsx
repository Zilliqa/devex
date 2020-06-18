import React, { useState, useContext, useEffect, useCallback, useMemo, SyntheticEvent } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'

import { UserPrefContext } from 'src/services/userPrefProvider'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons'
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons'

import './LabelStar.css'

const LabelStar: React.FC = () => {
  const location = useLocation()
  const userPrefContext = useContext(UserPrefContext)
  const { labelMap, setLabelMap } = userPrefContext!
  const currPath = useMemo(() => (location.pathname + location.search), [location])
  const [isLit, setIsLit] = useState(Object.keys(labelMap).includes(currPath))

  const [show, setShow] = useState(false)
  const [labelInput, setLabelInput] = useState('')

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    setIsLit(Object.keys(labelMap).includes(currPath))
  }, [labelMap, currPath])

  const removeLabel = useCallback(() => {
    const temp = { ...labelMap }
    delete temp[currPath]
    setLabelMap(temp)
  }, [labelMap, setLabelMap, currPath])

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    setLabelMap({ ...labelMap, [currPath]: labelInput })
    handleClose()
    setLabelInput('')
  }

  return (
    <>
      <span className='star-span' >
        <FontAwesomeIcon onClick={isLit ? removeLabel : handleShow} color='grey'
          className={isLit ? 'star-filled-icon' : 'star-outline-icon'}
          icon={isLit ? faStarFilled : faStarOutline} size='xs' />
        <Modal className='label-modal' show={show} onHide={handleClose}>
          <Modal.Body>
            <div style={{ marginBottom: '1rem' }}>
              <Form onSubmit={handleSubmit}>
                <Form.Control
                  type='text'
                  value={labelInput}
                  onChange={(e) => { setLabelInput(e.target.value) }}
                  placeholder='Label Name' />
              </Form>
            </div>
            <div>
              <Button block onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </span>
    </>
  )
}

export default LabelStar

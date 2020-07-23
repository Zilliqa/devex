import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { useNetworkUrl, useNetworkName } from 'src/services/network/networkProvider'
import { UserPrefContext, LabelInfo } from 'src/services/userPref/userPrefProvider'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons'
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons'

import LabelModal from './LabelModal'

import './LabelStar.css'

interface IProps {
  type: string
}

const LabelStar: React.FC<IProps> = ({ type }) => {

  const location = useLocation()
  const networkUrl = useNetworkUrl()
  const networkName = useNetworkName()

  const userPrefContext = useContext(UserPrefContext)
  const { labelMap, setLabelMap } = userPrefContext!

  const currPath = useMemo(() => (location.pathname + location.search), [location])
  const [isLit, setIsLit] = useState(Object.keys(labelMap).includes(currPath))
  const [show, setShow] = useState(false)

  const handleCloseModal = () => setShow(false)
  const handleShowModal = () => setShow(true)

  useEffect(() => {
    setIsLit(Object.keys(labelMap).includes(currPath))
  }, [labelMap, currPath])

  const addLabel = (labelName: string) => {
    const newLabelInfo: LabelInfo = {
      name: labelName,
      type: type,
      networkUrl: networkUrl,
      networkName: networkName,
      timeAdded: Date.now()
    }
    setLabelMap({ ...labelMap, [currPath]: newLabelInfo })
    handleCloseModal()
  }

  const removeLabel = useCallback(() => {
    const temp = { ...labelMap }
    delete temp[currPath]
    setLabelMap(temp)
  }, [labelMap, setLabelMap, currPath])

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
        <LabelModal show={show} handleCloseModal={handleCloseModal} addLabel={addLabel} />
      </span>
    </>
  )
}

export default LabelStar

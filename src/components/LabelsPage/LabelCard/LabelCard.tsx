import React, { useState, useRef, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'

import { defaultNetworks } from 'src/services/networkProvider'
import { UserPrefContext, LabelInfo } from 'src/services/userPrefProvider'
import { timestampToTimeago } from 'src/utils/Utils'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'

import './LabelCard.css'

const printable = (keyCode: number) => (
  (keyCode > 47 && keyCode < 58) ||
  keyCode === 32 ||
  (keyCode > 64 && keyCode < 91) ||
  (keyCode > 95 && keyCode < 112) ||
  (keyCode > 185 && keyCode < 193) ||
  (keyCode > 218 && keyCode < 223))

interface IProps {
  k: string,
  v: LabelInfo
}

const LabelCard: React.FC<IProps> = ({ k, v }) => {
  const userPrefContext = useContext(UserPrefContext)
  const { labelMap, setLabelMap } = userPrefContext!

  const text = useRef(v.name)
  const [isEditing, setEditing] = useState(false)
  const inner = React.createRef<HTMLElement>()

  const handleDelete = () => {
    const temp: Record<string, LabelInfo> = { ...labelMap }
    delete temp[k]
    setLabelMap(temp)
  }

  const handleChange = (e: ContentEditableEvent) => {
    text.current = e.target.value
  }

  const handleBlur = () => {
    setEditing(false)
    const temp: Record<string, LabelInfo> = { ...labelMap }
    temp[k].name = text.current
    setLabelMap(temp)
  }

  useEffect(() => {
    if (!inner.current) return
    inner.current.focus()
  }, [isEditing, inner])

  return <>
    <Card className='label-card'>
      <div className='label-card-div'>
        <div>
          {isEditing
            ? <ContentEditable
              onKeyDown={(e) => (
                (text.current.length >= 20 && printable(e.keyCode))
                  ? e.preventDefault()
                  : e.keyCode === 13 && (() => { inner.current?.blur() })()
              )}
              className='label-name-editable'
              innerRef={inner}
              html={text.current}
              onBlur={handleBlur}
              onChange={handleChange} />
            : <Link to={k}>{v.name}</Link>
          }
        </div>
        <div>
          <FontAwesomeIcon
            onClick={() => setEditing(true)}
            cursor='pointer'
            icon={faEdit} />
          <FontAwesomeIcon
            onClick={handleDelete}
            cursor='pointer'
            className='ml-3'
            icon={faTrashAlt} />
        </div>
      </div>
      <Card.Body>
        Type: {v.type}
        <br />
        Network: {defaultNetworks[v.network] || v.network}
        <br />
        Added: {timestampToTimeago(v.timeAdded * 1000)}
      </Card.Body>
    </Card>
  </>
}

export default LabelCard

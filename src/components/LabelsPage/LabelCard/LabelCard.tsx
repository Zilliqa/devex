import React, { useState, useRef, useContext, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { Link } from 'react-router-dom'

import { UserPrefContext, LabelInfo, LabelMap } from 'src/services/userPref/userPrefProvider'
import { timestampToTimeago, printableChars } from 'src/utils/Utils'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'

import sanitizeHtml from 'sanitize-html';

import './LabelCard.css'

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
    const temp: LabelMap = { ...labelMap }
    delete temp[k]
    setLabelMap(temp)
  }

  const handleChange = (e: ContentEditableEvent) => {
    text.current = sanitizeHtml(e.target.value)
  }

  const handleBlur = () => {
    setEditing(false)
    const temp: LabelMap = { ...labelMap }
    temp[k].name = sanitizeHtml(text.current)
    setLabelMap(temp)
  }

  const moveCaretToEnd = (el: HTMLElement) => {
    const target = document.createTextNode('')
    el.appendChild(target)
    if (target !== null && target.nodeValue !== null) {
      const sel = window.getSelection()
      if (sel === null) return
      const range = document.createRange()
      range.setStart(target, target.nodeValue.length)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
      if (el instanceof HTMLElement) el.focus()
    }
  }

  useEffect(() => {
    if (!inner.current) return
    inner.current.focus()
    moveCaretToEnd(inner.current)
  }, [isEditing, inner])

  return <>
    <Card className='label-card'>
      <div className='label-card-div'>
        <div>
          {isEditing
            ? <ContentEditable
              onKeyDown={(e) => (
                (text.current.length >= 20 && printableChars(e.keyCode))
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
        Network: {v.networkName}
        <br />
        Added: {timestampToTimeago(v.timeAdded * 1000)}
      </Card.Body>
    </Card>
  </>
}

export default LabelCard

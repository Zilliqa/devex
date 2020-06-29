import React, { useCallback } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'

import { LabelInfo } from 'src/services/userPrefProvider'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faDownload } from '@fortawesome/free-solid-svg-icons'

import './ImportExport.css'

const exportToJson = (objectData: Record<string, LabelInfo>) => {
  console.log('exporting json')
  const fileName = "labels"
  const json = JSON.stringify(objectData)
  const blob = new Blob([json], { type: 'application/json' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = fileName + ".json"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

interface IProps {
  labelMap: Record<string, LabelInfo>,
  setLabelCb: (labelMap: Record<string, LabelInfo>) => void
}

const ImportExport: React.FC<IProps> = ({ labelMap, setLabelCb }) => {

  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
      const reader = new FileReader()

      reader.onload = () => {
        const parsedFile = JSON.parse(reader.result as string)
        setLabelCb(parsedFile)
      }
      reader.readAsText(file)
    })
  }, [setLabelCb])

  const { getRootProps, getInputProps } = useDropzone({ noDrag: true, onDrop })

  return (
    <>
      <div className='import-export'>
        <span className='mr-1' {...getRootProps()}>
          <input {...getInputProps()} />
          <OverlayTrigger placement='top'
            overlay={<Tooltip id={'import-tt'}>Import Labels</Tooltip>}>
            <Button variant='outline-secondary'>
              <FontAwesomeIcon
                icon={faDownload}
                size='sm' />
            </Button>
          </OverlayTrigger>
        </span>
        <span className='ml-2'>
          <OverlayTrigger placement='top'
            overlay={<Tooltip id={'export-tt'}>Export Labels</Tooltip>}>
            <Button
              onClick={() => {
                exportToJson(labelMap)
              }}
              variant='outline-secondary'>
              <FontAwesomeIcon
                icon={faUpload}
                size='sm' />
            </Button>
          </OverlayTrigger>
        </span>
      </div>
    </>
  )
}

export default ImportExport

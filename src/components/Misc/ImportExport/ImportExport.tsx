import React, { useCallback } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faDownload } from '@fortawesome/free-solid-svg-icons'

import { LabelMap, NetworkMap } from 'src/services/userPref/userPrefProvider'

import './ImportExport.css'

const exportToJson = (type: string, toJson: any, map: NetworkMap | LabelMap) => {
  console.log('exporting json')
  const jsonStr = JSON.stringify(toJson ? toJson(map) : map)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = type + ".json"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

interface IProps {
  type: string,
  map: NetworkMap | LabelMap,
  setMapCb: ((map: NetworkMap) => void) | ((map: LabelMap) => void),
  fromJson?: any,
  toJson?: any
}

const ImportExport: React.FC<IProps> = ({ type, map, setMapCb, toJson, fromJson }) => {

  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
      const reader = new FileReader()

      reader.onload = () => {
        const parsedFile = JSON.parse(reader.result as string)
        setMapCb(fromJson ? fromJson(parsedFile) : parsedFile)
      }
      reader.readAsText(file)
    })
  }, [setMapCb, fromJson])

  const { getRootProps, getInputProps } = useDropzone({ noDrag: true, onDrop })

  return (
    <>
      <div className='import-export'>
        <span className='mr-1' {...getRootProps()}>
          <input {...getInputProps()} />
          <OverlayTrigger placement='top'
            overlay={<Tooltip id={'import-tt'}>{type === 'labels' ? 'Import Labels' : 'Import Networks'}</Tooltip>}>
            <Button>
              <FontAwesomeIcon
                icon={faDownload}
                size='sm' />
            </Button>
          </OverlayTrigger>
        </span>
        <span className='ml-2'>
          <OverlayTrigger placement='top'
            overlay={<Tooltip id={'export-tt'}>{type === 'labels' ? 'Export Labels' : 'Export Networks'}</Tooltip>}>
            <Button
              onClick={() => {
                exportToJson(type, toJson, map)
              }}>
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

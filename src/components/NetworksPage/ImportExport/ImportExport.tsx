import React, { useCallback } from 'react'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faDownload } from '@fortawesome/free-solid-svg-icons'

import './ImportExport.css'

const exportToJson = (networkData: Map<string, string>) => {
  console.log('exporting json')
  const fileName = "networks"
  const jsonStr = JSON.stringify({ networks: Array.from(networkData).map(([k, v]) => ({ [k]: v })) })
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = fileName + ".json"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

interface IProps {
  networkMap: Map<string, string>,
  setNodeUrlMapCb: (networkMap: Map<string, string>) => void
}

const ImportExport: React.FC<IProps> = ({ networkMap, setNodeUrlMapCb }) => {

  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
      const reader = new FileReader()

      reader.onload = () => {
        const parsedFile = JSON.parse(reader.result as string)
        console.log(parsedFile)
        setNodeUrlMapCb(new Map(parsedFile.networks.map((x: { [url: string]: string }) => Object.entries(x)[0])))
      }
      reader.readAsText(file)
    })
  }, [setNodeUrlMapCb])

  const { getRootProps, getInputProps } = useDropzone({ noDrag: true, onDrop })

  return (
    <>
      <div className='import-export'>
        <span className='mr-1' {...getRootProps()}>
          <input {...getInputProps()} />
          <OverlayTrigger placement='top'
            overlay={<Tooltip id={'import-tt'}>Import Network</Tooltip>}>
            <Button>
              <FontAwesomeIcon
                icon={faDownload}
                size='sm' />
            </Button>
          </OverlayTrigger>
        </span>
        <span className='ml-2'>
          <OverlayTrigger placement='top'
            overlay={<Tooltip id={'export-tt'}>Export Network</Tooltip>}>
            <Button
              onClick={() => {
                exportToJson(networkMap)
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

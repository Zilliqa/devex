import React, { useCallback } from 'react'
import { Container } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'

import './Dropzone.css'

interface IProps {
  setNodeUrlMapCb: (nodeUrlMap: Map<string, string>) => void
}

const Dropzone: React.FC<IProps> = ({ setNodeUrlMapCb }) => {

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

  const { getRootProps, getInputProps } = useDropzone({ accept: 'application/json', onDrop })

  return (
    <Container>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <span className='dropzone-prompt'>Drag and drop or click to load file</span>
      </div>
    </Container>
  )
}

export default Dropzone

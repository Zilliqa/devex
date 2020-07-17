import React, { useCallback } from 'react'
import { Container } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'

import './Dropzone.css'

interface IProps {
  dropCb: any,
  fromJson: any
}

const Dropzone: React.FC<IProps> = ({ dropCb, fromJson }) => {

  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
      const reader = new FileReader()

      reader.onload = () => {
        const parsedFile = JSON.parse(reader.result as string)
        dropCb(fromJson(parsedFile))
      }
      reader.readAsText(file)
    })
  }, [dropCb, fromJson])

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

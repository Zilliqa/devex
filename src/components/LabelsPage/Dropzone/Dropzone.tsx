import React, { useCallback } from 'react'
import { Container } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'

import { LabelInfo } from 'src/services/userPref/userPrefProvider'

import './Dropzone.css'

interface IProps {
  setLabelCb: (labelMap: Record<string, LabelInfo>) => void
}

const Dropzone: React.FC<IProps> = ({ setLabelCb }) => {

  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const parsedFile = JSON.parse(reader.result as string)
        setLabelCb(parsedFile)
      }
      reader.readAsText(file)
    })
  }, [setLabelCb])

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

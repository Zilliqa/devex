import React from 'react'

const ErrorsDisplay = ({ errors }: { errors: any }) => {
  return (
    <>
      <pre style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
        {typeof errors === 'object'
          ? JSON.stringify(errors, null, '\t')
          : errors.toString()
        }
      </pre>
    </>
  )
}

export default ErrorsDisplay

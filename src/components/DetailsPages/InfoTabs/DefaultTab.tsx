import React from 'react'

const DefaultTab = ({ content }: { content: any }) => {
  return (
    <>
      <pre style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
        {typeof content === 'object'
          ? JSON.stringify(content, null, 2)
          : content.toString()
        }
      </pre>
    </>
  )
}

export default DefaultTab

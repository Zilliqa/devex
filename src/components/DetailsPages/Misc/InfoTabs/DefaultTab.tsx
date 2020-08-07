import React from 'react'

interface IProps {
  content: any
}

const DefaultTab: React.FC<IProps> = ({ content }) => {
  return (
    <>
      <pre className='display-block'>
        {typeof content === 'object'
          ? JSON.stringify(content, null, 2)
          : content.toString()
        }
      </pre>
    </>
  )
}

export default DefaultTab

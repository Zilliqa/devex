import React, { useCallback } from 'react'

import { QueryPreservingLink } from 'src'
import { isValidAddr } from 'src/utils/Utils'
import { EventParam } from '@zilliqa-js/core/src/types'

import './EventsTab.css'

interface IProps {
  data: string
}

const OverviewTab: React.FC<IProps> = ({ data }) => {

  const parsedData = JSON.parse(data)
  const tag = parsedData._tag
  const params = tag ? parsedData.params : parsedData
  const highlightEventParams = useCallback((params: EventParam[]): React.ReactNode => {
    if (params.length === 0) return null
    return params
      .map((param, index) => (
        <span key={index}>
          <span className='event-type'>{param.type}</span>
          {' '}
          {param.vname}
        </span>))
      .reduce((acc: React.ReactNode | null, ele) => (
        acc === null
          ? <>{[ele]}</>
          : <>{[acc, ', ', ele]}</>
      ))
  }, [])

  return (
    <>
      {tag ?
        <>
          <span className='event-name'>
            {tag}
          </span>
          {' ('}{highlightEventParams(params)}{')'}
        </>
        :
        <span className='event-name'>
          Contract Parameters
        </span>
      }

      <table className='receipt-table'>
        <tbody>
          {params.length > 0 && (
            <>
              <tr><td><hr /></td></tr>
              <tr>
                <td>Variable</td>
                <td>Value</td>
              </tr>
              {params.map((param: EventParam, index: number) => (
                <tr key={index}>
                  <td>{param.vname}</td>
                  <td>
                    {typeof param.value === 'object'
                      ? <pre className='code-block'>
                        {JSON.stringify(param.value, null, 2)}
                      </pre>
                      : Array.isArray(param.value)
                        ? param.value.toString()
                        : isValidAddr(param.value)
                          ? <QueryPreservingLink to={`/address/${param.value}`}>
                            {param.value}
                          </QueryPreservingLink>
                          : param.value}
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </>
  )
}

export default OverviewTab

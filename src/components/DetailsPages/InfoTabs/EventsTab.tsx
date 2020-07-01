import React, { useCallback } from 'react'

import { QueryPreservingLink } from 'src'
import { hexAddrToZilAddr, isValidAddr } from 'src/utils/Utils'
import { EventLogEntry, EventParam } from '@zilliqa-js/core/src/types'

import './EventsTab.css'

interface IProps {
  events: EventLogEntry[]
}

const EventsTab: React.FC<IProps> = ({ events }) => {

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
      {events.map((event: EventLogEntry, index: number) => (
        <table key={index} className='receipt-table'>
          <tbody>
            <tr>
              <th>Function</th>
              <td>
                <span className='event-name'>
                  {event._eventname}
                </span>
                {' ('}{highlightEventParams(event.params)}{')'}
              </td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{<QueryPreservingLink to={`/address/${hexAddrToZilAddr(event.address)}`}>{hexAddrToZilAddr(event.address)}</QueryPreservingLink>}</td>
            </tr>
            {event.params.length > 0 && (
              <>
                <tr><td><hr /></td></tr>
                <tr>
                  <td>Variable</td>
                  <td>Value</td>
                </tr>
                {event.params.map((param, index) => (
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
      )).reduce((acc: (React.ReactNode | null), x) => (
        acc === null
          ? x
          : <>{acc}<hr />{x}</>)
        , null)
      }
    </>
  )
}

export default EventsTab

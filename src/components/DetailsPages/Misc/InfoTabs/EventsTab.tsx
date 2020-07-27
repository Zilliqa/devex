import React, { useCallback } from 'react'

import { hexAddrToZilAddr, isValidAddr } from 'src/utils/Utils'
import { EventLogEntry, EventParam } from '@zilliqa-js/core/src/types'

import AddressDisp from '../Disp/AddressDisp/AddressDisp'

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
        <>
          <div className='mb-2'>
            <span className='event-name'>
              {event._eventname}
            </span>
            {' ('}{highlightEventParams(event.params)}{')'}
          </div>
          <AddressDisp isLinked={true} addr={hexAddrToZilAddr(event.address)} />
          <table key={index} className='mt-3 mb-1 receipt-table'>
            <tbody>
              {event.params.length > 0 && (
                <>
                  <tr>
                    <td className='subtext'>Variable</td>
                    <td className='subtext'>Value</td>
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
                              ? <AddressDisp isLinked={true} addr={param.value} />
                              : param.value}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </>
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

import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'

import { hexAddrToZilAddr } from 'src/utils/Utils'
import { EventLogEntry, EventParam } from '@zilliqa-js/core/src/types'

const EventsTab = ({ events }: { events: EventLogEntry[] }) => {

  const highlightEventParams = useCallback((params: EventParam[]): React.ReactNode => {
    return params
      .map((param, index) => (
        <span key={index}>
          <span style={{ color: 'orangered' }}>{param.type}</span>
          {' '}
          {param.vname}
        </span>))
      .reduce((acc, ele): any => (acc === null ? [ele] : [acc, ', ', ele] as any))
  }, [])

  return (
    <>
      {events.map((event: EventLogEntry) => (
        <table className='receipt-table'>
          <tbody>
            <tr>
              <th>Function</th>
              <td>
                <span style={{ color: 'blueviolet' }}>
                  {event._eventname}
                </span>
                {' ('}{highlightEventParams(event.params)}{')'}
              </td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{<Link to={`/address/${hexAddrToZilAddr(event.address)}`}>{hexAddrToZilAddr(event.address)}</Link>}</td>
            </tr>
            {event.params.length > 0 && (
              <>
                <tr style={{ height: '20px' }}><td><hr /></td></tr>
                <tr>
                  <td className="txn-detail-header">Variable</td>
                  <td className="txn-detail-header">Value</td>
                </tr>
                {event.params.map((param, index) => (
                  <tr key={index}>
                    <td>{param.vname}</td>
                    <td>
                      {typeof param.value === 'object'
                        ? <pre style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
                          {JSON.stringify(param.value, null, 2)}
                        </pre>
                        : Array.isArray(param.value)
                          ? param.value.toString()
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

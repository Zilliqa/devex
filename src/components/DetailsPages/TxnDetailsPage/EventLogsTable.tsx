import React, { useCallback } from 'react'

import { hexAddrToZilAddr } from 'src/utils/Utils'
import { EventLogEntry, EventParam } from '@zilliqa-js/core/src/types'

const EventLogsTable = ({ events }: { events: EventLogEntry[] }) => {

  const highlightEventParams = useCallback((params: EventParam[]): React.ReactNode => {
    return params
      .map((param) => (
        <span>
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
              <td>{hexAddrToZilAddr(event.address)}</td>
            </tr>
            {event.params.length > 0 && (
              <>
                <tr style={{ height: '20px' }}><hr /></tr>
                <tr>
                  <td className="txn-detail-header">Variable</td>
                  <td className="txn-detail-header">Value</td>
                </tr>
                {event.params.map(param => (
                  <tr>
                    <td>{param.vname}</td>
                    {/* To be removed after SDK typing is updated
                    // @ts-ignore */}
                    <td>
                      {typeof param.value === 'object'
                        ? <pre style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
                          {JSON.stringify(param.value, null, '\t')}
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

export default EventLogsTable

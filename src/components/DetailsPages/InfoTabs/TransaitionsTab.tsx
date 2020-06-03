import React from 'react'

import { qaToZil, hexAddrToZilAddr } from 'src/utils/Utils'
import { TransitionEntry } from '@zilliqa-js/core/src/types'

const TransitionsTab = ({ transitions }: { transitions: TransitionEntry[] }) => (
  <>
    {transitions.map((transition: TransitionEntry) => (
      <table className='receipt-table'>
        <tbody>
          <tr>
            <th>Tag</th>
            <td>{transition.msg._tag === '' ? '-' : transition.msg._tag}</td>
          </tr>
          <tr>
            <th>Contract Address</th>
            <td>{hexAddrToZilAddr(transition.addr)}</td>
          </tr>
          <tr>
            <th>Accepts $ZIL</th>
            {/* To be removed after SDK typing is updated
            // @ts-ignore */}
            <td>{transition.accepted === undefined ? '-' : `${transition.accepted}`}</td>
          </tr>
          <tr>
            <th>Depth</th>
            <td>{transition.depth}</td>
          </tr>
          <tr>
            <th>Amount</th>
            <td>{qaToZil(transition.msg._amount)}</td>
          </tr>
          <tr>
            <th>Recipient</th>
            <td>{hexAddrToZilAddr(transition.msg._recipient)}</td>
          </tr>
          {transition.msg.params.length > 0 && (
            <>
              <tr style={{ height: '20px' }}><hr /></tr>
              <tr>
                <td className="txn-detail-header">Variable</td>
                <td className="txn-detail-header">Value</td>
              </tr>
              {transition.msg.params.map(param => (
                <tr>
                  <td>{param.vname}</td>
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
      , null
    )}
  </>
)

export default TransitionsTab
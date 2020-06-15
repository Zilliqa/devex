import React from 'react'

import { QueryPreservingLink } from 'src'
import { qaToZil, hexAddrToZilAddr } from 'src/utils/Utils'
import { TransitionEntry } from '@zilliqa-js/core/src/types'

interface IProps {
  transitions: TransitionEntry[]
}

const TransitionsTab: React.FC<IProps> = ({ transitions }) => (
  <>
    {transitions.map((transition: TransitionEntry, index: number) => (
      <table key={index} className='receipt-table'>
        <tbody>
          <tr>
            <th>Tag</th>
            <td>{transition.msg._tag === '' ? '-' : transition.msg._tag}</td>
          </tr>
          <tr>
            <th>Contract Address</th>
            <td>{<QueryPreservingLink to={`/address/${hexAddrToZilAddr(transition.addr)}`}>{hexAddrToZilAddr(transition.addr)}</QueryPreservingLink>}</td>
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
            <td>{<QueryPreservingLink to={`/address/${hexAddrToZilAddr(transition.msg._recipient)}`}>{hexAddrToZilAddr(transition.msg._recipient)}</QueryPreservingLink>}</td>
          </tr>
          {transition.msg.params.length > 0 && (
            <>
              <tr style={{ height: '20px' }}><td><hr /></td></tr>
              <tr>
                <td className="txn-detail-header">Variable</td>
                <td className="txn-detail-header">Value</td>
              </tr>
              {transition.msg.params.map((param, index) => (
                <tr key={index}>
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
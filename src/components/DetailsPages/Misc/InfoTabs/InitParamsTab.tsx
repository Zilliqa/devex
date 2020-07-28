import React from 'react'

import { isValidAddr } from 'src/utils/Utils'
import { Value } from '@zilliqa-js/contract/src/types'

import AddressDisp from '../Disp/AddressDisp/AddressDisp'

import './InitParamsTab.css'

interface IProps {
  initParams: Value[]
}

const InitParamsTab: React.FC<IProps> = ({ initParams }) => {
  console.log(initParams)
  return (
    <table className='init-params-table'>
      <tbody>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Type</th>
          <th>Value</th>
        </tr>
        {initParams.map((param, index) => (
          <tr key={index}>
            <td>{index}</td>
            <td>{param.vname}</td>
            <td>{param.type}</td>
            <td>{Array.isArray(param.value)
              ? param.value.map((x, index) => (
                isValidAddr(x as string)
                  ? <AddressDisp key={index} isLinked={true} addr={x as string} />
                  : x.toString()
              ))
                .map((ele: React.ReactNode, index) => (<div key={index}>{ele}</div>))
                .reduce((acc: React.ReactNode | null, ele) => {
                  return acc === null
                    ? <>{[ele]}</>
                    : <>{[acc, ele]}</>
                })
              : isValidAddr(param.value as string)
                ? <AddressDisp isLinked={true} addr={param.value as string} />
                : param.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default InitParamsTab

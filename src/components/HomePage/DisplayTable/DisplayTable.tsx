import React from 'react'
import { useTable, HeaderGroup, Column, Row, Cell } from 'react-table'

import { TransactionDetails } from 'src/typings/api'
import { DsBlockObj, TxBlockObj, PendingTxnResult } from '@zilliqa-js/core/src/types'

import './DisplayTable.css'

interface IDisplayTableParams<T extends object> {
  columns: Array<Column<T>>;
  data: T[];
  processMap?: Map<string, <T>(original: T) => T>
}

// React Table for DSBlocks, TxBlocks and TransactionDetails on Dashboard 
const DisplayTable: React.FC<IDisplayTableParams<DsBlockObj | TxBlockObj | TransactionDetails | PendingTxnResult>> =
  ({ columns, data, processMap }) => {
    const { getTableProps, headerGroups, rows, prepareRow } = useTable<DsBlockObj | TxBlockObj | TransactionDetails | PendingTxnResult>({
      columns,
      data,
    })

    return (
      <div className='display-table'>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: HeaderGroup<DsBlockObj | TxBlockObj | TransactionDetails | PendingTxnResult>) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} key={column.getHeaderProps().key} id={column.id}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row: Row<DsBlockObj | TxBlockObj | TransactionDetails | PendingTxnResult>) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={row.getRowProps().key}>
                  {row.cells.map((cell: Cell<DsBlockObj | TxBlockObj | TransactionDetails | PendingTxnResult>) => {
                    if (processMap) {
                      const procFunc = processMap.get(cell.column.id)
                      if (procFunc != null)
                        cell.value = procFunc(cell.value)
                    }
                    return (
                      <td {...cell.getCellProps()}
                        style={cell.column.Header === 'Amount' ? { textAlign: 'right' } : {}}
                        key={cell.getCellProps().key}>
                        {cell.value}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

export default DisplayTable

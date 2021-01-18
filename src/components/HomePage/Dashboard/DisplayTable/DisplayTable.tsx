import React from "react";
import { useTable, HeaderGroup, Column, Row, Cell } from "react-table";

import { TransactionDetails } from 'src/typings/api'
import { DsBlockObj, TxBlockObj, TransactionStatus } from '@zilliqa-js/core/src/types'

import "./DisplayTable.css";

interface IDisplayTableParams<T extends object> {
  columns: Column<T>[];
  data: T[];
}

// React Table for DSBlocks, TxBlocks and TransactionDetails on Dashboard 
const DisplayTable: React.FC<IDisplayTableParams<DsBlockObj | TxBlockObj | TransactionDetails | TransactionStatus>> =
  ({ columns, data }) => {
    const { getTableProps, headerGroups, rows, prepareRow } = useTable<DsBlockObj | TxBlockObj | TransactionDetails | TransactionStatus>({
      columns,
      data,
    })

    return (
      <div className='display-table'>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: HeaderGroup<DsBlockObj | TxBlockObj | TransactionDetails | TransactionStatus>) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    key={column.getHeaderProps().key}
                    id={column.id}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row: Row<DsBlockObj | TxBlockObj | TransactionDetails | TransactionStatus >) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={row.getRowProps().key}>
                  {row.cells.map((cell: Cell<DsBlockObj | TxBlockObj | TransactionDetails | TransactionStatus>) => {
                    return (
                      <td {...cell.getCellProps()}
                        key={cell.getCellProps().key}>
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayTable;

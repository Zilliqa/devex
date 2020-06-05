import React, { useEffect, useCallback } from 'react'
import { Pagination, Row as BRow, Col as BCol, Spinner } from 'react-bootstrap'
import { useTable, HeaderGroup, Column, Row, Cell, usePagination, useAsyncDebounce } from 'react-table'

import { DsBlockObj, TxBlockObj, TransactionObj, PendingTxnResult } from '@zilliqa-js/core/src/types'

import './ViewAllTable.css'

interface IViewAllTableParams<T extends object> {
  columns: Array<Column<T>>;
  data: T[];
  isLoading: boolean;
  fetchData: (...args: any[]) => void;
  pageCount: number;
  processMap?: Map<string, <T>(original: T) => T>
}

// React Table for DSBlocks, TxnBlocks and TransactionObj on Dashboard 
const ViewAllTable: React.FC<IViewAllTableParams<DsBlockObj | TxBlockObj | TransactionObj | PendingTxnResult>> =
  ({ columns, data, isLoading, fetchData, pageCount: controlledPageCount, processMap }) => {

    const { getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      canPreviousPage,
      canNextPage,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      // Get the state from the instance
      state: { pageIndex } } = useTable<DsBlockObj | TxBlockObj | TransactionObj | PendingTxnResult>({
        columns,
        data,
        initialState: { pageIndex: 0 },
        manualPagination: true,
        pageCount: controlledPageCount,
      }, usePagination)

    const fetchDataDebounce = useAsyncDebounce(fetchData, 300)

    useEffect(() => {
      fetchDataDebounce({ pageIndex })
      // fetchDataDebounce changes when fetchData function changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, fetchData])

    const generatePagination = useCallback((currentPage: number, pageCount: number, delta: number = 2) => {
      const separate = (a: number, b: number, isLower: boolean) => {
        let temp = b - a
        if (temp === 0)
          return [a]
        else if (temp === 1)
          return [a, b]
        else if (temp === 2)
          return [a, a + 1, b]
        else
          return [a, isLower ? -1 : -2, b]
      }

      return Array(delta * 2 + 1)
        .fill(0)
        .map((_, index) => currentPage - delta + index)
        .filter(page => 0 < page && page <= pageCount)
        .flatMap((page, index, { length }) => {
          if (!index) {
            return separate(1, page, true)
          }
          if (index === length - 1) {
            return separate(page, pageCount, false)
          }
          return [page]
        })
    }, [])

    return (
      <>
        <BRow>
          <BCol style={{ paddingLeft: '1.5rem', alignSelf: 'center' }}>
            {data.length === 0
              ? null
              : <span>Items Per Page: <strong>10</strong></span>}
          </BCol>
          <BCol>
            <Pagination className='viewall-pagination'>
              <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
              {generatePagination(pageIndex + 1, pageCount).map((page) => {
                if (page === -1)
                  return <Pagination.Ellipsis key={page} onClick={() => gotoPage(pageIndex - 5)} />
                else if (page === -2)
                  return <Pagination.Ellipsis key={page} onClick={() => gotoPage(pageIndex + 5)} />
                else if (page === pageIndex + 1)
                  return <Pagination.Item key={page} onClick={() => gotoPage(Number(page) - 1)} active>{page}</Pagination.Item>
                else
                  return <Pagination.Item key={page} onClick={() => gotoPage(Number(page) - 1)}>{page}</Pagination.Item>
              })}
              <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
            </Pagination>
          </BCol>
        </BRow>
        <div className='viewall-table table'>
          {isLoading ? <div className='spinner'><Spinner animation="border" variant="secondary" /></div> : null}
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup: HeaderGroup<DsBlockObj | TxBlockObj | TransactionObj | PendingTxnResult>) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} id={column.id}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody style={isLoading ? { opacity: '50%' } : {}}{...getTableBodyProps()}>
              {page.map((row: Row<DsBlockObj | TxBlockObj | TransactionObj | PendingTxnResult>) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell: Cell<DsBlockObj | TxBlockObj | TransactionObj | PendingTxnResult>) => {
                      if (processMap) {
                        const procFunc = processMap.get(cell.column.id)
                        if (procFunc != null)
                          cell.value = procFunc(cell.value)
                      }
                      return (
                        <td {...cell.getCellProps()}>
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
      </>
    )
  }

export default ViewAllTable

import React, { useMemo, useCallback } from 'react'
import { Pagination } from 'react-bootstrap'
import { useTable, Column, Row, Cell, usePagination } from 'react-table'

import { QueryPreservingLink } from 'src/services/network/networkProvider'
import { pubKeyToZilAddr } from 'src/utils/Utils'

interface IMinerTableParams {
  addresses: string[]
}

interface IMinerObj {
  address: string
}

// Display Miner Info 
const MinerTable: React.FC<IMinerTableParams> = ({ addresses }) => {

  const generatePagination = useCallback((currentPage: number, pageCount: number, delta = 1) => {
    const separate = (a: number, b: number, isLower: boolean) => {
      const temp = b - a
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

  const columns = useMemo(
    () => [{
      id: 'address-col',
      Header: 'Addresses',
      accessor: 'address',
      // eslint-disable-next-line react/display-name
      Cell: (props: Cell<IMinerObj>) =>
        (<>
          [{props.row.index}]
          {' '}
          <QueryPreservingLink to={`/address/${pubKeyToZilAddr(props.value)}`}>{pubKeyToZilAddr(props.value)}</QueryPreservingLink>
        </>)
    }], []
  ) as Array<Column<IMinerObj>>

  const data = useMemo(() => (addresses.map((x) => ({ address: x })) as IMinerObj[]), [addresses])

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable<IMinerObj>({
    columns,
    data,
    initialState: { pageIndex: 0 },
  }, usePagination)

  return (
    <>
      <div className='py-3'>
        <table {...getTableProps()}>
          <tbody {...getTableBodyProps()}>
            {page.map((row: Row<IMinerObj>) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={row.getRowProps().key}>
                  {row.cells.map((cell: Cell<IMinerObj>) => {
                    return (
                      <td {...cell.getCellProps()} key={cell.getCellProps().key}>
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className='mx-auto'>
        {data.length !== 0 &&
          <Pagination className='viewall-pagination'>
            <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
            {generatePagination(pageIndex + 1, pageCount).map((page) => {
              if (page === -1)
                return <Pagination.Ellipsis key={page} onClick={() => gotoPage(pageIndex - 5)} />
              else if (page === -2)
                return <Pagination.Ellipsis key={page} onClick={() => gotoPage(pageIndex + 5)} />
              else if (page === pageIndex + 1)
                return <Pagination.Item key={page} active>{page}</Pagination.Item>
              else
                return <Pagination.Item key={page} onClick={() => gotoPage(Number(page) - 1)}>{page}</Pagination.Item>
            })}
            <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
          </Pagination>
        }
      </div>
    </>
  )
}

export default MinerTable

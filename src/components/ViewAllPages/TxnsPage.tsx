import React, { useState, useRef, useCallback, useMemo, useContext } from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { Row } from 'react-table'

import ToAddrDisp from 'src/components/Misc/Disp/ToAddrDisp/ToAddrDisp'
import ViewAllTable from 'src/components/ViewAllPages/ViewAllTable/ViewAllTable'
import { NetworkContext, QueryPreservingLink } from 'src/services/network/networkProvider'
import { TransactionDetails } from 'src/typings/api'
import { hexAddrToZilAddr, qaToZil } from 'src/utils/Utils'
import { TxList } from '@zilliqa-js/core/src/types'
import { Transaction } from '@zilliqa-js/account/src/transaction'

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TxnsPage: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const fetchIdRef = useRef(0)
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [data, setData] = useState<TransactionDetails[] | null>(null)
  const [recentTxnHashes, setRecentTxnHashes] = useState<string[] | null>(null)

  const columns = useMemo(
    () => [{
      id: 'from-col',
      Header: 'From',
      accessor: 'txn.senderAddress',
      Cell: ({ value }: { value: string }) => (
        <QueryPreservingLink to={`/address/${hexAddrToZilAddr(value)}`}>
          {hexAddrToZilAddr(value)}
        </QueryPreservingLink>)
    }, {
      id: 'to-col',
      Header: 'To',
      Cell: ({ row }: { row: Row<TransactionDetails> }) => {
        return <ToAddrDisp txnDetails={row.original} />
      }
    }, {
      id: 'hash-col',
      Header: 'Hash',
      accessor: 'hash',
      Cell: ({ row }: { row: Row<TransactionDetails> }) => {
        console.log(row)
        return <QueryPreservingLink to={`/tx/0x${row.original.hash}`}>
          <div className='text-right mono'>
            {row.original.txn.txParams.receipt && !row.original.txn.txParams.receipt.success
              && <FontAwesomeIcon className='mr-1' icon={faExclamationCircle} color='red' />
            }
            {'0x' + row.original.hash}
          </div>
        </QueryPreservingLink>
      }
    }, {
      id: 'amount-col',
      Header: 'Amount',
      accessor: 'txn.amount',
      Cell: ({ value }: { value: string }) => (
        <OverlayTrigger placement='right'
          overlay={<Tooltip id={'amt-tt'}>{qaToZil(value)}</Tooltip>}>
          <div className='text-right sm'>{qaToZil(value, 12)}</div>
        </OverlayTrigger>
      )
    }, {
      id: 'fee-col',
      Header: 'Fee',
      accessor: 'txn',
      Cell: ({ value }: { value: Transaction }) => {
        const fee = Number(value.txParams.gasPrice) * value.txParams.receipt!.cumulative_gas
        return <OverlayTrigger placement='top'
          overlay={<Tooltip id={'fee-tt'}>{qaToZil(fee)}</Tooltip>}>
          <div className='text-center sm' >{qaToZil(fee, 4)}</div>
        </OverlayTrigger>
      }
    }], []
  )

  const fetchData = useCallback(({ pageIndex }) => {
    if (!dataService) return

    const fetchId = ++fetchIdRef.current
    let txnHashes: string[] | null
    let txnList: TxList
    let txnBodies: TransactionDetails[]
    const getData = async () => {
      try {
        setIsLoading(true)
        txnHashes = recentTxnHashes
        if (!txnHashes) {
          txnList = await dataService.getRecentTransactions()
          if (!txnList) return
          txnHashes = txnList.TxnHashes
          setPageCount(Math.ceil(txnList.number / 10))
          setRecentTxnHashes(txnHashes)
        }

        const slicedTxnHashes = txnHashes.slice(pageIndex * 10, pageIndex * 10 + 10)
        if (slicedTxnHashes) {
          txnBodies = await dataService.getTransactionsDetails(slicedTxnHashes)
          if (txnBodies)
            setData(txnBodies)
        }
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }

    if (fetchId === fetchIdRef.current)
      getData()
    // Recent transaction hashes is not changed after the initial fetch, until the user refreshes/re-render the component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataService])

  return (
    <>
      {<div>
        <h2>Recent Transactions</h2>
        <ViewAllTable
          columns={columns}
          data={data ? data : []}
          isLoading={isLoading}
          fetchData={fetchData}
          pageCount={pageCount}
        />
      </div>}
    </>
  )
}

export default TxnsPage

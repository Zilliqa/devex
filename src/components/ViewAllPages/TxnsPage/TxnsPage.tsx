import React, { useState, useRef, useCallback, useMemo, useContext } from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

import { QueryPreservingLink } from 'src/index'
import ViewAllTable from 'src/components/ViewAllPages/ViewAllTable/ViewAllTable'
import { NetworkContext } from 'src/services/networkProvider'
import { TransactionDetails } from 'src/typings/api'
import { hexAddrToZilAddr, qaToZil } from 'src/utils/Utils'
import { TxList } from '@zilliqa-js/core/src/types'

import './TxnsPage.css'

import { faFileContract } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Pre-processing data to display
const processMap = new Map()
processMap.set('amount-col', (amt: number) => (
  <OverlayTrigger placement='top'
    overlay={<Tooltip id={'tt'}> {qaToZil(amt)} </Tooltip>}>
    <span>{qaToZil(amt, 5)}</span>
  </OverlayTrigger>
))
processMap.set('from-col', (addr: string) => (<QueryPreservingLink to={`/address/${hexAddrToZilAddr(addr)}`}>{hexAddrToZilAddr(addr)}</QueryPreservingLink>))
processMap.set('to-col', (addr: string) => (
  addr.includes('contract-')
    ? <QueryPreservingLink to={`/address/${hexAddrToZilAddr(addr.substring(9))}`}>
      <FontAwesomeIcon color='darkturquoise' icon={faFileContract} />
      {' '}
      Contract Creation
    </QueryPreservingLink>
    : <QueryPreservingLink to={`/address/${hexAddrToZilAddr(addr)}`}>{hexAddrToZilAddr(addr)}</QueryPreservingLink>))
processMap.set('fee-col', (fee: number) => (
  <OverlayTrigger placement='top'
    overlay={<Tooltip id={'fee-tt'}>{qaToZil(fee)}</Tooltip>}>
    <span>{qaToZil(fee, 5)}</span>
  </OverlayTrigger>))
processMap.set('hash-col', (hash: number) => (
  <QueryPreservingLink to={`tx/0x${hash}`}>
    <span className='mono-sm'>{'0x' + hash}</span>
  </QueryPreservingLink>))

const TxnsPage: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const columns = useMemo(
    () => [{
      id: 'from-col',
      Header: 'From',
      accessor: 'txn.senderAddress',
    },
    {
      id: 'to-col',
      Header: 'To',
      accessor: (txnDetails: any) => (
        txnDetails.contractAddr
          ? 'contract-' + txnDetails.contractAddr
          : txnDetails.txn.toAddr),
    },
    {
      id: 'hash-col',
      Header: 'Hash',
      accessor: 'hash',
    }, {
      id: 'fee-col',
      Header: 'Fee',
      accessor: (txnDetails: any) => (
        Number(txnDetails.txn.txParams.gasPrice) * txnDetails.txn.txParams.receipt!.cumulative_gas)
    }, {
      id: 'amount-col',
      Header: 'Amount',
      accessor: 'txn.amount',
    }], []
  )

  const fetchIdRef = useRef(0)
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [data, setData] = useState<TransactionDetails[] | null>(null)
  const [recentTxnHashes, setRecentTxnHashes] = useState<string[] | null>(null)

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
        <h2 className='txnspage-header'>Recent Transactions</h2>
        <ViewAllTable
          columns={columns}
          data={data ? data : []}
          isLoading={isLoading}
          processMap={processMap}
          fetchData={fetchData}
          pageCount={pageCount}
        />
      </div>}
    </>
  )
}

export default TxnsPage

import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

import { TransactionObj } from '@zilliqa-js/core/src/types'
import { NetworkContext } from 'src/services/networkProvider'
import { hexAddrToZilAddr, qaToZil, pubKeyToZilAddr } from 'src/utils/Utils'

import ViewAllTable from '../ViewAllTable/ViewAllTable'
import './TxnsPage.css'

// Input processing to display input data in the right format
const processMap = new Map()
// Convert from Qa to Zil to display
processMap.set('amount-col', (amt: number) => (
  <OverlayTrigger placement='top'
    overlay={<Tooltip id={'tt'}> {qaToZil(amt)} </Tooltip>}>
    <span>{qaToZil(amt)}</span>
  </OverlayTrigger>
))
processMap.set('from-col', pubKeyToZilAddr)
processMap.set('to-col', hexAddrToZilAddr)
processMap.set('hash-col', (hash: number) => (<Link to={`tx/0x${hash}`}>{'0x' + hash}</Link>))

const TxnsPage = () => {
  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const columns = useMemo(
    () => [{
      id: 'from-col',
      Header: 'From',
      accessor: 'pubKey',
    },
    {
      id: 'to-col',
      Header: 'To',
      accessor: 'toAddr',
    },
    {
      id: 'amount-col',
      Header: 'Amount',
      accessor: 'amount',
    },
    {
      id: 'hash-col',
      Header: 'Hash',
      accessor: 'hash',
    }], []
  )

  const [recentTxnHashes, setRecentTxnHashes] = useState<string[] | null>(null)
  const [data, setData] = useState<TransactionObj[] | null>(null)
  const [toHome, setToHome] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(10)
  const fetchIdRef = useRef(0)

  const fetchData = useCallback(({ pageIndex }) => {
    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current
    const getData = async () => {
      try {
        setIsLoading(true)
        let txnHashes = recentTxnHashes
        if (!txnHashes) {
          let txnList = await dataService.getRecentTransactions()
          txnHashes = txnList.TxnHashes
          setPageCount(Math.ceil(txnList.number / 10))
          setRecentTxnHashes(txnHashes)
        }

        let slicedTxnHashes = txnHashes.slice(pageIndex * 10, pageIndex * 10 + 10)
        if (slicedTxnHashes) {
          let txnBodies = await dataService.getTransactionsDetails(slicedTxnHashes)
          setData(txnBodies)
          setIsLoading(false)
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (fetchId === fetchIdRef.current)
      getData()
    // Recent transaction hashes is not changed after the initial fetch, until the user refreshes/re-render the component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataService])

  // Redirect back to home page on url change after initial render
  useEffect(() => {
    return () => setToHome(true)
  }, [dataService])

  // Scroll to top on render
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      {toHome
        ? <Redirect to='/' />
        :
        <div className='txnpage-table'>
          <h2 className='txnpage-header'>Recent Transactions</h2>
          <ViewAllTable
            columns={columns}
            data={data ? data : []}
            isLoading={isLoading}
            processMap={processMap}
            fetchData={fetchData}
            pageCount={pageCount}
          />
        </div>
      }
    </>
  )
}

export default TxnsPage

import React, { useState, useEffect, useMemo, useContext } from 'react'
import { OverlayTrigger, Tooltip, Card, Spinner } from 'react-bootstrap'

import { QueryPreservingLink } from 'src'
import { refreshRate } from 'src/constants'
import { NetworkContext } from 'src/services/networkProvider'
import { TransactionDetails } from 'src/typings/api'
import { qaToZil, hexAddrToZilAddr } from 'src/utils/Utils'

import { faFileContract } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import DisplayTable from '../../DisplayTable/DisplayTable'
import './ValTxnList.css'

/*
    Display first 10 Validated Txns
    - Hash
    - From address
    - To address
    - Amount
    - Age
*/

// Pre-processing data to display
const processMap = new Map()
processMap.set('amount-col', (amt: number) => (
  <OverlayTrigger placement='top'
    overlay={<Tooltip id={'tt'}> {qaToZil(amt)} </Tooltip>}>
    <span>{qaToZil(amt)}</span>
  </OverlayTrigger>
))
processMap.set('from-col', (addr: string) => (
  <QueryPreservingLink to={`/address/${hexAddrToZilAddr(addr)}`}>
    {hexAddrToZilAddr(addr)}
  </QueryPreservingLink>))
processMap.set('to-col', (addr: string) => (
  addr.includes('contract-')
    ? <QueryPreservingLink to={`/address/${hexAddrToZilAddr(addr.substring(9))}`}>
      <FontAwesomeIcon color='darkturquoise' icon={faFileContract} />
      {' '}
      Contract Creation
    </QueryPreservingLink>
    : <QueryPreservingLink to={`/address/${hexAddrToZilAddr(addr)}`}>
      {hexAddrToZilAddr(addr)}
    </QueryPreservingLink>))

processMap.set('hash-col', (hash: number) => (
  <QueryPreservingLink to={`/tx/0x${hash}`}>
    <span className='mono'>{'0x' + hash}</span>
  </QueryPreservingLink>))

const ValTxnList: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService, nodeUrl } = networkContext!

  useEffect(() => { setData(null) }, [nodeUrl])

  const [data, setData] = useState<TransactionDetails[] | null>(null)

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
          : txnDetails.txn.txParams.toAddr),
    },

    {
      id: 'hash-col',
      Header: 'Hash',
      accessor: 'hash',
    }, {
      id: 'amount-col',
      Header: 'Amount',
      accessor: 'amount',
    }], []
  )

  // Fetch Data
  useEffect(() => {
    let isCancelled = false
    if (!dataService) return

    let receivedData: TransactionDetails[]
    const getData = async () => {
      try {
        receivedData = await dataService.getLatest5ValidatedTransactions()
        if (!isCancelled && receivedData)
          setData(receivedData)
      } catch (e) {
        if (!isCancelled)
          console.log(e)
      }
    }
    getData()
    const getDataTimer = setInterval(async () => {
      await getData()
    }, refreshRate)
    return () => {
      isCancelled = true
      clearInterval(getDataTimer)
    }
  }, [nodeUrl, dataService])

  return <>
    <Card className='valtxlist-card'>
      <Card.Header>
        <div className='valtxlist-card-header'>
          <span>Transactions</span>
          <QueryPreservingLink to={'tx'}>View Recent Transactions</QueryPreservingLink>
        </div>
      </Card.Header>
      <Card.Body>
        {data
          ? <DisplayTable columns={columns} data={data} processMap={processMap} />
          : <Spinner animation="border" role="status" />
        }
      </Card.Body>
    </Card>
  </>
}

export default ValTxnList

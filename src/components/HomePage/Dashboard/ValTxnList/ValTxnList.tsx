import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Card, Spinner } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'
import DisplayTable from '../../DisplayTable/DisplayTable'
import { TransactionObj } from '@zilliqa-js/core/src/types'

import { refreshRate } from 'src/constants'

import './ValTxnList.css'
import { qaToZil, pubKeyToZilAddr, hexAddrToZilAddr } from 'src/utils/Utils'

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
    overlay={ <Tooltip id={'tt'}> {qaToZil(amt)} </Tooltip>}>
    <span>{qaToZil(amt)}</span>
  </OverlayTrigger>
))
processMap.set('from-col', (addr: string) => (<Link to={`/address/${pubKeyToZilAddr(addr)}`}>{pubKeyToZilAddr(addr)}</Link>))
processMap.set('to-col', (addr: string) => (<Link to={`/address/${hexAddrToZilAddr(addr)}`}>{hexAddrToZilAddr(addr)}</Link>))
processMap.set('hash-col', (hash: number) => (<Link to={`/tx/0x${hash}`}>{'0x' + hash}</Link>))

const ValTxnList: React.FC = () => {
  
  const networkContext = useContext(NetworkContext)
  const { dataService, nodeUrl } = networkContext!

  useEffect(() => { setData(null) }, [nodeUrl]) // Unset data on url change

  const [data, setData] = useState<TransactionObj[] | null>(null)

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
 
  // Fetch Data
  useEffect(() => {
    let isCancelled = false
    if (!dataService) return

    let receivedData: TransactionObj[]
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
    }, refreshRate);
    return () => {
      isCancelled = true
      clearInterval(getDataTimer)
    }
  }, [dataService])

  return <>
    <Card className='valtxlist-card'>
      <Card.Header>
        <div className='valtxlist-card-header'>
          <span>Transactions</span>
          <Link to={'tx'}>View Recent Transactions</Link>
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

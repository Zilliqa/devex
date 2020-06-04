import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Card, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'
import DisplayTable from '../../DisplayTable/DisplayTable'
import { PendingTxnResult } from '@zilliqa-js/core/src/types'
import { refreshRate } from 'src/constants'

import './PendTxnList.css'

/*
    Display first 5 Pending Txns
    - Hash
    - Status
*/
const statusMap = new Map()
statusMap.set(0, 'Txn not pending')
statusMap.set(1, 'Nonce too high')
statusMap.set(2, 'Could not fit in as microblock gas limit reached')
statusMap.set(3, 'Transaction valid but consensus not reached')

// Pre-processing data to display
const processMap = new Map()
processMap.set('hash-col', (hash: number) => ('0x' + hash))
processMap.set('status-col', (status: string) => (
  <OverlayTrigger placement='top'
    overlay={<Tooltip id={'tt'}> {statusMap.get(status)} </Tooltip>}>
    <div className='pendtxlist-status-div'>{status}</div>
  </OverlayTrigger>
))

const PendTxnList: React.FC = () => {
  
  const networkContext = useContext(NetworkContext)
  const { dataService, nodeUrl } = networkContext!

  useEffect(() => { setData(null) }, [nodeUrl]) // Unset data on url change

  const [data, setData] = useState<PendingTxnResult[] | null>(null)

  const columns = useMemo(
    () => [{
      id: 'hash-col',
      Header: 'Hash',
      accessor: 'TxnHash',
    },
    {
      id: 'status-col',
      Header: 'Status',
      accessor: 'Status',
    }], []
  )

  // Fetch Data
  useEffect(() => {
    let isCancelled = false
    if (!dataService) return

    let receivedData: PendingTxnResult[]
    const getData = async () => {
      try {
        receivedData = await dataService.getLatest5PendingTransactions()
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
    <Card className='pendtxlist-card'>
      <Card.Header>
        <div className='pendtxlist-card-header'>
          <span>Pending Transactions</span>
        </div>
      </Card.Header>
      <Card.Body>
        {data
          ? data.length > 0
            ? <div className='pendtxlist-table'>
                <DisplayTable columns={columns} data={data} processMap={processMap}/>
              </div>
            : 'No Pending Transactions'
          : <Spinner animation="border" role="status" />
        }
      </Card.Body>
    </Card>
  </>
}

export default PendTxnList

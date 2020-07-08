import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Card, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap'

import { refreshRate } from 'src/constants'
import { NetworkContext } from 'src/services/network/networkProvider'
import { PendingTxnResultWithHash } from 'src/typings/api'

import DisplayTable from '../../DisplayTable/DisplayTable'
import './PendTxnList.css'


const PendTxnList: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService, nodeUrl } = networkContext!

  useEffect(() => { setData(null) }, [nodeUrl]) // Unset data on url change

  const [data, setData] = useState<PendingTxnResultWithHash[] | null>(null)

  const columns = useMemo(
    () => [{
      id: 'pend-hash-col',
      Header: 'Hash',
      accessor: 'hash',
      Cell: ({ value }: { value: string }) => (
        <div className='mono'>{'0x' + value}</div>
      )
    },
    {
      id: 'confirmed-col',
      Header: 'Confirmed',
      accessor: 'confirmed',
      Cell: ({ value }: { value: boolean }) => (
        <div className='text-center'>{value.toString()}</div>
      )
    },
    {
      id: 'code-col',
      Header: 'Code',
      accessor: 'code',
      Cell: ({ value }: { value: number }) => (
        <div className='text-center'>{value}</div>
      )
    },
    {
      id: 'status-col',
      Header: 'Status',
      accessor: 'info',
      Cell: ({ value }: { value: string }) => (
        <OverlayTrigger placement='top'
          overlay={<Tooltip id={'tt'}> {value} </Tooltip>}>
          <div>{value}</div>
        </OverlayTrigger>
      )
    }], []
  )

  // Fetch Data
  useEffect(() => {
    let isCancelled = false
    if (!dataService) return

    let receivedData: PendingTxnResultWithHash[]
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
    }, refreshRate)
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
              <DisplayTable columns={columns} data={data} />
            </div>
            : 'No Pending Transactions'
          : <Spinner animation="border" role="status" />
        }
      </Card.Body>
    </Card>
  </>
}

export default PendTxnList

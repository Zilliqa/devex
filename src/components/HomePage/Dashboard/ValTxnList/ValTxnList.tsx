import React, { useState, useEffect, useMemo, useContext } from 'react'
import { OverlayTrigger, Tooltip, Card, Spinner } from 'react-bootstrap'
import { Row } from 'react-table'

import { QueryPreservingLink } from 'src/services/network/networkProvider'
import { refreshRate } from 'src/constants'
import { NetworkContext } from 'src/services/network/networkProvider'
import { TransactionDetails } from 'src/typings/api'
import { qaToZil, hexAddrToZilAddr } from 'src/utils/Utils'
import { Transaction } from '@zilliqa-js/account/src/transaction'

import { faFileContract, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import DisplayTable from '../../DisplayTable/DisplayTable'

import './ValTxnList.css'

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
      Cell: ({ value }: { value: string }) => (
        <QueryPreservingLink to={`/address/${hexAddrToZilAddr(value)}`}>
          {hexAddrToZilAddr(value)}
        </QueryPreservingLink>)
    }, {
      id: 'to-col',
      Header: 'To',
      Cell: ({ row }: { row: Row<TransactionDetails> }) => {
        return (row.original.contractAddr
          ? <QueryPreservingLink to={`/address/${hexAddrToZilAddr(row.original.contractAddr)}`}>
            <FontAwesomeIcon color='darkturquoise' icon={faFileContract} />
            {' '}
            Contract Creation
          </QueryPreservingLink>
          : <QueryPreservingLink to={`/address/${hexAddrToZilAddr(row.original.txn.txParams.toAddr)}`}>
            {hexAddrToZilAddr(row.original.txn.txParams.toAddr)}
          </QueryPreservingLink>)
      }
    }, {
      id: 'hash-col',
      Header: 'Hash',
      accessor: 'hash',
      Cell: ({ row }: { row: Row<TransactionDetails> }) => {
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
          <div className='text-right sm'>{qaToZil(value)}</div>
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
          <div className='text-center sm'>{qaToZil(fee)}</div>
        </OverlayTrigger>
      }
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
          ? <DisplayTable columns={columns} data={data} />
          : <Spinner animation="border" role="status" />
        }
      </Card.Body>
    </Card>
  </>
}

export default ValTxnList

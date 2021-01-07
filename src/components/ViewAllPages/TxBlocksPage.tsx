import React, { useState, useRef, useCallback, useMemo, useContext } from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

import { QueryPreservingLink } from 'src/services/network/networkProvider'
import ViewAllTable from 'src/components/ViewAllPages/ViewAllTable/ViewAllTable'
import { NetworkContext } from 'src/services/network/networkProvider'
import { TxBlockObjListing } from 'src/typings/api'
import { timestampToTimeago, qaToZil, pubKeyToZilAddr } from 'src/utils/Utils'
import { TxBlockObj } from '@zilliqa-js/core/src/types'

const TxBlocksPage: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const fetchIdRef = useRef(0)
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [data, setData] = useState<TxBlockObj[] | null>(null)

  const columns = useMemo(
    () => [{
      id: 'height-col',
      Header: 'Height',
      accessor: 'header.BlockNum',
      Cell: ({ value }: { value: string }) => (
        <QueryPreservingLink to={`/txbk/${value}`}>
          {value}
        </QueryPreservingLink>
      )
    },
    {
      id: 'mbs-count-col',
      Header: 'MB Count',
      accessor: 'body.MicroBlockInfos',
      Cell: ({ value }: { value: string }) => (
        <div className='text-center'>
            {value.length > 0 ? value.length : '0'}
        </div>
      )
    },
    {
      id: 'numTxns-col',
      Header: 'Txns',
      accessor: 'header.NumTxns',
      Cell: ({ value }: { value: string }) => (
        <div className='text-center'>
          {value}
        </div>
      )
    },
    {
      id: 'ds-leader-col',
      Header: 'DS Leader',
      accessor: 'header.MinerPubKey',
      Cell: ({ value }: { value: string }) => (
        <div className='mono'>
          <QueryPreservingLink to={`/address/${pubKeyToZilAddr(value)}`}>
            {pubKeyToZilAddr(value)}
          </QueryPreservingLink>
        </div>
      )
    },
    {
      id: 'bkhash-col',
      Header: 'Block Hash',
      accessor: 'body.BlockHash',
      Cell: ({ value }: { value: string }) => (
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }} className='mono'>{'0x' + value}</div>
      )
    }, {
      id: 'total-txn-fees-col',
      Header: 'Txn Fees',
      accessor: 'header.TxnFees',
      Cell: ({ value }: { value: string }) => (
        <OverlayTrigger placement='right'
          overlay={<Tooltip id={'total-txn-fees-tt'}> {qaToZil(value)} </Tooltip>}>
          <div className='text-right'>{qaToZil(value, 5)}</div>
        </OverlayTrigger>
      )
    },
    {
      id: 'rewards-col',
      Header: 'Rewards',
      accessor: 'header.Rewards',
      Cell: ({ value }: { value: string }) => (
        <OverlayTrigger placement='right'
          overlay={<Tooltip id={'rewards-tt'}> {qaToZil(value)} </Tooltip>}>
          <div className='text-right'>{qaToZil(value, 5)}</div>
        </OverlayTrigger>
      )
    },
    {
      id: 'age-col',
      Header: 'Age',
      accessor: 'header.Timestamp',
      Cell: ({ value }: { value: string }) => (
        <div className='text-right'>{
          timestampToTimeago(value)}
        </div>
      )
    }], []
  )

  const fetchData = useCallback(({ pageIndex }) => {
    if (!dataService) return

    const fetchId = ++fetchIdRef.current
    let receivedData: TxBlockObjListing
    const getData = async () => {
      try {
        setIsLoading(true)
        receivedData = await dataService.getTxBlocksListing(pageIndex + 1)

        if (receivedData) {
          setData(receivedData.data)
          setPageCount(receivedData.maxPages)
        }
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }

    if (fetchId === fetchIdRef.current)
      getData()

  }, [dataService])

  return (
    <>
      {<div>
        <h2>Transaction Blocks</h2>
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

export default TxBlocksPage

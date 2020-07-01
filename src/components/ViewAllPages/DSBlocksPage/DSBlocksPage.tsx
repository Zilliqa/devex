import React, { useState, useRef, useCallback, useMemo, useContext } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { QueryPreservingLink } from 'src'
import ViewAllTable from 'src/components/ViewAllPages/ViewAllTable/ViewAllTable'
import { NetworkContext } from 'src/services/networkProvider'
import { DsBlockObjWithHashListing } from 'src/typings/api'
import { timestampToTimeago, pubKeyToZilAddr } from 'src/utils/Utils'
import { DsBlockObj } from '@zilliqa-js/core/src/types'

const DSBlocksPage: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const columns = useMemo(
    () => [{
      id: 'height-col',
      Header: 'Height',
      accessor: 'header.BlockNum',
      Cell: ({ value }: { value: string }) => (
        <QueryPreservingLink to={`txbk/${value}`}>
          {value}
        </QueryPreservingLink>
      )
    },
    {
      id: 'difficulty-col',
      Header: 'Difficulty',
      accessor: 'header.Difficulty',
    },
    {
      id: 'ds-difficulty-col',
      Header: 'DS Difficulty',
      accessor: 'header.DifficultyDS',
    },
    {
      id: 'ds-leader-col',
      Header: 'DS Leader',
      accessor: 'header.LeaderPubKey',
      Cell: ({ value }: { value: string }) => (
        <div className='mono'>
          <QueryPreservingLink to={`address/${pubKeyToZilAddr(value)}`}>
            {pubKeyToZilAddr(value)}
          </QueryPreservingLink>
        </div>
      )
    },
    {
      id: 'bkhash-col',
      Header: 'Block Hash',
      accessor: 'Hash',
      Cell: ({ value }: { value: string }) => (
        <OverlayTrigger placement='left'
          overlay={<Tooltip id={'bkhash-tt'}>{'0x' + value}</Tooltip>}>
          <div className='mono-sm bkhash-div'>{'0x' + value}</div>
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

  const fetchIdRef = useRef(0)
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [data, setData] = useState<DsBlockObj[] | null>(null)

  const fetchData = useCallback(({ pageIndex }) => {
    if (!dataService) return

    const fetchId = ++fetchIdRef.current
    let receivedData: DsBlockObjWithHashListing
    const getData = async () => {
      try {
        setIsLoading(true)
        receivedData = await dataService.getDSBlocksListing(pageIndex + 1)

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
        <h2>DS Blocks</h2>
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

export default DSBlocksPage

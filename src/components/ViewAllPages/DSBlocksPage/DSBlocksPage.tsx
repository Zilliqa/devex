import React, { useState, useRef, useCallback, useMemo, useContext } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import { QueryPreservingLink } from 'src'
import ViewAllTable from 'src/components/ViewAllPages/ViewAllTable/ViewAllTable'
import { NetworkContext } from 'src/services/networkProvider'
import { DsBlockObjWithHashListing } from 'src/typings/api'
import { timestampToTimeago, pubKeyToZilAddr } from 'src/utils/Utils'
import { DsBlockObj } from '@zilliqa-js/core/src/types'

// Pre-processing data to display
const processMap = new Map()
processMap.set('age-col', timestampToTimeago)
processMap.set('ds-leader-col', (addr: string) => (
  <QueryPreservingLink to={`address/${pubKeyToZilAddr(addr)}`}>
    {pubKeyToZilAddr(addr)}
  </QueryPreservingLink>))
processMap.set('height-col', (height: number) => (
  <QueryPreservingLink to={`dsbk/${height}`}>
    {height}
  </QueryPreservingLink>))
processMap.set('bkhash-col', (bkhash: number) => (<OverlayTrigger placement='left'
  overlay={<Tooltip id={'bkhash-tt'}>{'0x' + bkhash}</Tooltip>}>
  <span>{'0x' + bkhash}</span>
</OverlayTrigger>))

const DSBlocksPage: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const columns = useMemo(
    () => [{
      id: 'height-col',
      Header: 'Height',
      accessor: 'header.BlockNum',
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
    },
    {
      id: 'age-col',
      Header: 'Age',
      accessor: 'header.Timestamp',
    },
    {
      id: 'bkhash-col',
      Header: 'Block Hash',
      accessor: 'Hash',
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
          processMap={processMap}
          fetchData={fetchData}
          pageCount={pageCount}
        />
      </div>}
    </>
  )
}

export default DSBlocksPage

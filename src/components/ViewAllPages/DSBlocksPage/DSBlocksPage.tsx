import React, { useState, useRef, useCallback, useMemo, useContext } from 'react'
import { Link } from 'react-router-dom'

import ViewAllTable from 'src/components/ViewAllPages/ViewAllTable/ViewAllTable'
import { NetworkContext } from 'src/services/networkProvider'
import { timestampToTimeago, pubKeyToZilAddr } from 'src/utils/Utils'
import { DsBlockObj } from '@zilliqa-js/core/src/types'

import './DSBlocksPage.css'

// Pre-processing data to display
const processMap = new Map()
processMap.set('age-col', timestampToTimeago)
processMap.set('ds-leader-col', pubKeyToZilAddr)
processMap.set('height-col', (height: number) => (<Link to={`dsbk/${height}`}>{height}</Link>))
processMap.set('hash-col', (hash: number) => ('0x' + hash))

const DSBlocksPage = () => {

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
      id: 'hash-col',
      Header: 'Hash',
      accessor: 'header.Hash',
    }], []
  )

  const fetchIdRef = useRef(0)
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const [data, setData] = useState<DsBlockObj[] | null>(null)

  const fetchData = useCallback(({ pageIndex }) => {
    if (!dataService) return
    
    const fetchId = ++fetchIdRef.current
    const getData = async () => {
      try {
        setIsLoading(true)
        let receivedData = await dataService.getDSBlocksListing(pageIndex + 1)

        if (receivedData) {
          setData(receivedData.data)
          setPageCount(receivedData.maxPages)
          setIsLoading(false)
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (fetchId === fetchIdRef.current)
      getData()
  }, [dataService])

  return (
    <>
      {<div>
        <h2 className='dsblockpage-header'>DS Blocks</h2>
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

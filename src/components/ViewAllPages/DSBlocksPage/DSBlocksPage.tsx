import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'

import { DsBlockObj } from '@zilliqa-js/core/src/types'
import { NetworkContext } from 'src/services/networkProvider'
import { timestampToTimeago, pubKeyToZilAddr } from 'src/utils/Utils'

import './DSBlocksPage.css'
import ViewAllTable from '../ViewAllTable/ViewAllTable'

const processMap = new Map()
// Convert age from microseconds to milliseconds and find timeago
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

  const [data, setData] = useState<DsBlockObj[] | null>(null)
  const [toHome, setToHome] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pageCount, setPageCount] = useState(0)
  const fetchIdRef = useRef(0)

  const fetchData = useCallback(({ pageIndex }) => {
    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current

    const getData = async () => {
      try {
        setIsLoading(true)
        let receivedData = await dataService.getDSBlocksListing(pageIndex + 1)

        if (receivedData) {
          setData(receivedData.data)
          setIsLoading(false)
          setPageCount(receivedData.maxPages)
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (fetchId === fetchIdRef.current)
      getData()
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
        : <div className='dsblockpage-table'>
          <h2 className='dsblockpage-header'>DS Blocks</h2>
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

export default DSBlocksPage
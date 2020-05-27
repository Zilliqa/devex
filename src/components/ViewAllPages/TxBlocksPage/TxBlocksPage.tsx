import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

import { TxBlockObj } from '@zilliqa-js/core/src/types'
import { NetworkContext } from 'src/services/networkProvider'
import { timestampToTimeago, qaToZil, pubKeyToZilAddr } from 'src/utils/Utils'

import ViewAllTable from '../ViewAllTable/ViewAllTable'
import './TxBlocksPage.css'

// Input processing to display input data in the right format
const processMap = new Map()
processMap.set('age-col', timestampToTimeago)
processMap.set('reward-col', (amt: number) => (
  <OverlayTrigger placement='top'
    overlay={<Tooltip id={'tt'}> {qaToZil(amt)} </Tooltip>}>
    <span>{qaToZil(amt)}</span>
  </OverlayTrigger>
))
processMap.set('miner-col', pubKeyToZilAddr)
processMap.set('height-col', (height: number) => (<Link to={`txbk/${height}`}>{height}</Link>))
processMap.set('hash-col', (hash: number) => ('0x' + hash))

const TxBlocksPage = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const columns = useMemo(
    () => [{
      id: 'height-col',
      Header: 'Height',
      accessor: 'header.BlockNum',
    },
    {
      id: 'numTxns-col',
      Header: 'Transactions',
      accessor: 'header.NumTxns',
    },
    {
      id: 'reward-col',
      Header: 'Block Reward',
      accessor: 'header.Rewards',
    },
    {
      id: 'miner-col',
      Header: 'Miner',
      accessor: 'header.MinerPubKey',
    },
    {
      id: 'age-col',
      Header: 'Age',
      accessor: 'header.Timestamp',
    },
    {
      id: 'hash-col',
      Header: 'Hash',
      accessor: 'body.BlockHash',
    }], []
  )

  const [data, setData] = useState<TxBlockObj[] | null>(null)
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
        let receivedData = await dataService.getTxBlocksListing(pageIndex + 1)

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
        :
        <div className='txblockpage-table'>
          <h2 className='txblockpage-header'>Transaction Blocks</h2>
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

export default TxBlocksPage

import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Card, Spinner } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'
import DisplayTable from '../../DisplayTable/DisplayTable'
import { TxBlockObj } from '@zilliqa-js/core/src/types'

import { refreshRate } from 'src/constants'

import './TxBlockList.css'
import { timestampToTimeago, qaToZil, pubKeyToZilAddr } from 'src/utils/Utils'

/*
    Display first 5 Tx Block
      - Height
      - Number of Transactions
      - Block Reward
      - Miner Public Key
      - Age
      - Hash
*/

// Pre-processing data to display
const processMap = new Map()
processMap.set('age-col', timestampToTimeago)
processMap.set('reward-col', (amt: number) => (
  <OverlayTrigger placement='top'
    overlay={ <Tooltip id={'tt'}> {qaToZil(amt)} </Tooltip>}>
    <span>{qaToZil(amt)}</span>
  </OverlayTrigger>
))
processMap.set('miner-col', pubKeyToZilAddr)
processMap.set('height-col', (height: number) => (<Link to={`txbk/${height}`}>{height}</Link>))
processMap.set('hash-col', (hash: number) => ('0x' + hash))

const TxBlockList: React.FC = () => {
  
  const networkContext = useContext(NetworkContext)
  const { dataService, nodeUrl } = networkContext!

  useEffect(() => { setData(null) }, [nodeUrl]) // Unset data on url change

  const [data, setData] = useState<TxBlockObj[] | null>(null)

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
      Header: 'Reward',
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
    }], []
  )


  // Fetch Data
  useEffect(() => {
    let isCancelled = false
    if (!dataService) return

    let receivedData: TxBlockObj[]
    const getData = async () => {
      try {
        receivedData = await dataService.getLatest5TxBlocks()
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
    <Card className='txblock-card'>
      <Card.Header>
        <div className='dsblock-card-header'>
          <span>Transaction Blocks</span>
          <Link to={'txbk'}>View All</Link>
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

export default TxBlockList

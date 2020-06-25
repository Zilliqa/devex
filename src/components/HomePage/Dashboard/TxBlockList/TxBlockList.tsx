import React, { useState, useEffect, useMemo, useContext } from 'react'
import { OverlayTrigger, Tooltip, Card, Spinner } from 'react-bootstrap'

import { QueryPreservingLink } from 'src'
import { refreshRate } from 'src/constants'
import { NetworkContext } from 'src/services/networkProvider'
import { timestampToTimeago, qaToZil, pubKeyToZilAddr } from 'src/utils/Utils'
import { TxBlockObj } from '@zilliqa-js/core/src/types'

import DisplayTable from '../../DisplayTable/DisplayTable'
import './TxBlockList.css'

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
// https://github.com/react-bootstrap/react-bootstrap/issues/5075
processMap.set('reward-col', (amt: number) => (
  <OverlayTrigger placement='top'
    overlay={<Tooltip id={'tt'}> {qaToZil(amt)} </Tooltip>}>
    <span>{qaToZil(amt)}</span>
  </OverlayTrigger>
))
processMap.set('miner-col', (addr: string) => (
  <QueryPreservingLink to={`address/${pubKeyToZilAddr(addr)}`}>
    {pubKeyToZilAddr(addr)}
  </QueryPreservingLink>))
processMap.set('height-col', (height: number) => (
  <QueryPreservingLink to={`txbk/${height}`}>
    {height}
  </QueryPreservingLink>))
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
      Header: 'Txns',
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
    }, refreshRate)
    return () => {
      isCancelled = true
      clearInterval(getDataTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeUrl])

  return <>
    <Card className='txblock-card'>
      <Card.Header>
        <div className='dsblock-card-header'>
          <span>Transaction Blocks</span>
          <QueryPreservingLink to={'txbk'}>View All</QueryPreservingLink>
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

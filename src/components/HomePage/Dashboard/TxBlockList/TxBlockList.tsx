import React, { useState, useEffect, useMemo, useContext } from 'react'
import { OverlayTrigger, Tooltip, Card, Spinner } from 'react-bootstrap'

import { QueryPreservingLink } from 'src'
import { refreshRate } from 'src/constants'
import { NetworkContext } from 'src/services/networkProvider'
import { timestampToTimeago, qaToZil } from 'src/utils/Utils'
import { TxBlockObj } from '@zilliqa-js/core/src/types'

import DisplayTable from '../../DisplayTable/DisplayTable'
import './TxBlockList.css'

/*
    Display first 5 Tx Block
      - Height
      - Number of Transactions
      - Block Fees
      - Miner Public Key
      - Age
      - Hash
*/

const TxBlockList: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService, nodeUrl } = networkContext!

  useEffect(() => { setData(null) }, [nodeUrl]) // Unset data on url change

  const [data, setData] = useState<TxBlockObj[] | null>(null)

  const columns = useMemo(
    () => [{
      id: 'txheight-col',
      Header: 'Height',
      accessor: (txBlock: any) => (
        <QueryPreservingLink to={`txbk/${txBlock.header.BlockNum}`}>
          {txBlock.header.BlockNum}
        </QueryPreservingLink>
      )
    },
    {
      id: 'numTxns-col',
      Header: 'Transactions',
      accessor:  (txBlock: any) => <div className='text-center'>{txBlock.header.NumTxns}</div>,
    },
    {
      id: 'total-fees-col',
      Header: 'Total Fees',
      accessor:  (txBlock: any) => (<div className='text-right'>
        <OverlayTrigger placement='top'
          overlay={<Tooltip id={'amt-tt'}> {qaToZil(txBlock.header.Rewards)} </Tooltip>}>
          <span>{qaToZil(txBlock.header.Rewards, 5)}</span>
        </OverlayTrigger>
        </div>)
    },
    {
      id: 'age-col',
      Header: 'Age',
      // https://github.com/react-bootstrap/react-bootstrap/issues/5075
      accessor: (txBlock: any) => <div className='text-right'>{
        timestampToTimeago(txBlock.header.Timestamp)}
      </div>,
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
  }, [dataService])

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
          ? <DisplayTable columns={columns} data={data} />
          : <Spinner animation="border" role="status" />
        }
      </Card.Body>
    </Card>
  </>
}

export default TxBlockList

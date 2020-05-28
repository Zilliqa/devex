import React, { useMemo, useCallback, useState, useRef, useEffect, useContext } from 'react'
import { Link, useParams, Redirect } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Card, Row, Col, Container } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'
import { TransactionObj } from '@zilliqa-js/core/src/types'
import { MappedTxBlock } from 'src/services/dataService'

import { qaToZil, timestampToTimeago, hexAddrToZilAddr, timestampToDisplay, pubKeyToZilAddr } from 'src/utils/Utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-regular-svg-icons'

import './TxBlockDetailsPage.css'
import ViewAllTable from 'src/components/ViewAllPages/ViewAllTable/ViewAllTable'

const processMap = new Map()
// Convert from Qa to Zil to display
processMap.set('amount-col', (amt: number) => (
  <OverlayTrigger placement='top'
    overlay={<Tooltip id={'tt'}> {qaToZil(amt)} </Tooltip>}>
    <span>{qaToZil(amt)}</span>
  </OverlayTrigger>
))
processMap.set('from-col', pubKeyToZilAddr)
processMap.set('to-col', hexAddrToZilAddr)
processMap.set('hash-col', (hash: number) => (<Link to={`tx/0x${hash}`}>{'0x' + hash}</Link>))

const TxBlockDetailsPage = () => {
  const { blockNum } = useParams()
  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [toHome, setToHome] = useState(false)
  const [data, setData] = useState<MappedTxBlock | null>(null)
  const [latestTxBlockNum, setLatestTxBlockNum] = useState<number | null>(null)
  const [transactionData, setTransactionData] = useState<TransactionObj[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fetchIdRef = useRef(0)

  // Redirect back to home page on url change after initial render
  useEffect(() => {
    return () => setToHome(true)
  }, [dataService])

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let latestTxBlockNum: number
    let receivedData: MappedTxBlock
    const getData = async () => {
      try {
        receivedData = await dataService.getTxBlockDetails(blockNum)
        if (receivedData)
          setData(receivedData)
        latestTxBlockNum = await dataService.getNumTxBlocks()
        if (latestTxBlockNum)
          setLatestTxBlockNum(latestTxBlockNum)
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [dataService, blockNum])

  const columns = useMemo(
    () => [{
      id: 'from-col',
      Header: 'From',
      accessor: 'pubKey',
    },
    {
      id: 'to-col',
      Header: 'To',
      accessor: 'toAddr',
    },
    {
      id: 'amount-col',
      Header: 'Amount',
      accessor: 'amount',
    },
    {
      id: 'hash-col',
      Header: 'Hash',
      accessor: 'hash',
    }], []
  )

  const fetchData = useCallback(({ pageIndex }) => {
    if (!data) return
    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current

    const getData = async () => {
      try {
        setIsLoading(true)
        let receivedData = await dataService.getTransactionsDetails(data.txnHashes.slice(pageIndex * 10, pageIndex * 10 + 10))

        if (receivedData) {
          console.log(receivedData)
          setTransactionData(receivedData)
          setIsLoading(false)
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (fetchId === fetchIdRef.current)
      getData()
  }, [dataService, data])

  return <>
    {toHome
      ? <Redirect to='/' />
      : data ?
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3>Tx Block <span style={{ fontWeight: 350, color: 'rgb(93, 106, 133)' }}>#{data.header.BlockNum}</span></h3>
            <span>
              <Link style={{ marginRight: '1rem', color: '#019dac' }} className={parseInt(data.header.BlockNum) === 0 ? 'disabled-link' : ''} to={`/txbk/${parseInt(data.header.BlockNum) - 1}`}>
                <FontAwesomeIcon  size='2x' icon={faCaretSquareLeft} />
              </Link>
              <Link style={{ color: '#019dac' }} className={latestTxBlockNum && parseInt(data.header.BlockNum) === latestTxBlockNum - 1 ? 'disabled-link' : ''} to={`/txbk/${parseInt(data.header.BlockNum) + 1}`}>
                <FontAwesomeIcon size='2x' icon={faCaretSquareRight} />
              </Link>
            </span>
          </div>
          <div style={{ display: 'flex' }}>
            {/* To be removed after SDK typing is updated
        // @ts-ignore */}
            <h6 className='txblock-hash'>{'0x' + data.body.BlockHash}</h6>
            <div onClick={() => {
              {/* To be removed after SDK typing is updated
            // @ts-ignore */}
              navigator.clipboard.writeText(data.body.BlockHash)
            }} className='txblock-hash-copy-btn'>
              <FontAwesomeIcon icon={faCopy} />
            </div>
          </div>
          <Card className='txblock-details-card'>
            <Card.Body>
              <Container>
                <Row>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-details-card-header'>Date:</span>
                      <span>
                        {timestampToDisplay(data.header.Timestamp)}
                        {' '}
                        ({timestampToTimeago(data.header.Timestamp)})
                      </span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-details-card-header'>Transactions:</span>
                      <span>{data.header.NumTxns}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-details-card-header'>Gas Limit:</span>
                      <span>{data.header.GasLimit}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-details-card-header'>Gas Used:</span>
                      <span>{data.header.GasUsed}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-details-card-header'>Rewards:</span>
                      <span>{qaToZil(data.header.Rewards)}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-details-card-header'>DS Block:</span>
                      <span><Link to={`/dsbk/${data.header.DSBlockNum}`}>{data.header.DSBlockNum}</Link></span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-details-card-header'>Miner:</span>
                      <span>{pubKeyToZilAddr(data.header.MinerPubKey)}</span>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
          {/* To be removed after SDK typing is updated
              // @ts-ignore */}
          {data.body.MicroBlockInfos.length > 0 ?
            <Card className='txblock-details-card'>
              <Card.Body>
                <Container>
                  <h6>Micro Blocks</h6>
                  {/* To be removed after SDK typing is updated
              // @ts-ignore */}
                  {data.body.MicroBlockInfos.map((x) => <div>[{x.MicroBlockShardId}] {x.MicroBlockHash}</div>)}
                </Container>
              </Card.Body>
            </Card> : null}
          {data.txnHashes.length > 0
            ? <>
              <h4 style={{ marginTop: '1rem' }}>Transactions</h4>
              <Card className='txblock-details-card'>
                <Card.Body>
                  <ViewAllTable isLoading={isLoading} fetchData={fetchData}
                    pageCount={Math.ceil(data.txnHashes.length / 10)} columns={columns} data={transactionData ? transactionData : []} processMap={processMap} />
                </Card.Body>
              </Card></>
            : null}
        </>
        : null}
  </>
}

export default TxBlockDetailsPage
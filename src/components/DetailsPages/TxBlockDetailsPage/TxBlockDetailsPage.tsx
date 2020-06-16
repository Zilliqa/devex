import React, { useMemo, useCallback, useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { OverlayTrigger, Tooltip, Card, Row, Col, Container, Spinner } from 'react-bootstrap'

import { QueryPreservingLink } from 'src'
import ViewAllTable from 'src/components/ViewAllPages/ViewAllTable/ViewAllTable'
import { NetworkContext } from 'src/services/networkProvider'
import { MappedTxBlock } from 'src/typings/api'
import { qaToZil, timestampToTimeago, hexAddrToZilAddr, timestampToDisplay, pubKeyToZilAddr } from 'src/utils/Utils'
import { TransactionObj } from '@zilliqa-js/core/src/types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-regular-svg-icons'
import { faFileContract, faCubes } from '@fortawesome/free-solid-svg-icons'

import './TxBlockDetailsPage.css'
import NotFoundPage from '../NotFoundPage/NotFoundPage'

// Pre-processing data to display
const processMap = new Map()
processMap.set('amount-col', (amt: number) => (
  <OverlayTrigger placement='top'
    overlay={<Tooltip id={'tt'}> {qaToZil(amt)} </Tooltip>}>
    <span>{qaToZil(amt)}</span>
  </OverlayTrigger>
))
processMap.set('from-col', (addr: string) => (<QueryPreservingLink to={`/address/${pubKeyToZilAddr(addr)}`}>{pubKeyToZilAddr(addr)}</QueryPreservingLink>))
processMap.set('to-col', (addr: string) => (
  addr.includes('contract-')
    ? <QueryPreservingLink to={`/address/${hexAddrToZilAddr(addr.substring(9))}`}>
      <FontAwesomeIcon color='darkturquoise' icon={faFileContract} />
      {' '}
      Contract Creation
    </QueryPreservingLink>
    : <QueryPreservingLink to={`/address/${hexAddrToZilAddr(addr)}`}>{hexAddrToZilAddr(addr)}</QueryPreservingLink>))

processMap.set('hash-col', (hash: number) => (<QueryPreservingLink to={`/tx/0x${hash}`}>{'0x' + hash}</QueryPreservingLink>))

const TxBlockDetailsPage: React.FC = () => {

  const { blockNum } = useParams()
  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTrans, setIsLoadingTrans] = useState(false)
  const [data, setData] = useState<MappedTxBlock | null>(null)
  const [latestTxBlockNum, setLatestTxBlockNum] = useState<number | null>(null)
  const [transactionData, setTransactionData] = useState<TransactionObj[] | null>(null)

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let latestTxBlockNum: number
    let receivedData: MappedTxBlock | null
    const getData = async () => {
      try {
        setIsLoading(true)
        if (isNaN(blockNum))
          throw new Error('Not a valid block number')
        receivedData = await dataService.getTxBlockDetails(parseInt(blockNum))
        latestTxBlockNum = await dataService.getNumTxBlocks()
        if (receivedData)
          setData(receivedData)
        if (latestTxBlockNum)
          setLatestTxBlockNum(latestTxBlockNum)
      } catch (e) {
        console.log(e)
        setError(e)
      } finally {
        setIsLoading(false)
      }
    }

    getData()
    return () => {
      setData(null)
      setLatestTxBlockNum(null)
      setError(null)
    }
    // Run only once for each block
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNum, dataService])

  const columns = useMemo(
    () => [{
      id: 'from-col',
      Header: 'From',
      accessor: 'pubKey',
    },
    {
      id: 'to-col',
      Header: 'To',
      accessor: (value: any) => (value.contractAddr ? 'contract-' + value.contractAddr : value.toAddr),
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
    if (!data || !dataService) return

    let receivedData: TransactionObj[]
    const getData = async () => {
      try {
        setIsLoadingTrans(true)
        receivedData = await dataService.getTransactionsDetails(data.txnHashes.slice(pageIndex * 10, pageIndex * 10 + 10))

        if (receivedData) {
          setTransactionData(receivedData)
        }
        setIsLoadingTrans(false)
      } catch (e) {
        console.log(e)
      }
    }

    getData()
  }, [dataService, data])

  return <>
    {isLoading ? <div className='center-spinner'><Spinner animation="border" variant="secondary" /></div> : null}
    {error
      ? <NotFoundPage />
      : data && (
        <>
          <div className='txblock-header'>
            <h3>
              <span>
                <FontAwesomeIcon color='grey' icon={faCubes} />
              </span>
              <span style={{ marginLeft: '0.75rem' }}>
                Tx Block
            </span>
              {' '}
              <span className='txblock-header-blocknum'>#{data.header.BlockNum}</span>
            </h3>
            <span>
              <QueryPreservingLink
                style={{ marginRight: '1rem' }}
                className={parseInt(data.header.BlockNum) === 0 ? 'disabled-link' : ''}
                to={`/txbk/${parseInt(data.header.BlockNum) - 1}`}>
                <FontAwesomeIcon size='2x' icon={faCaretSquareLeft} />
              </QueryPreservingLink>
              <QueryPreservingLink
                className={latestTxBlockNum && parseInt(data.header.BlockNum) === latestTxBlockNum - 1 ? 'disabled-link' : ''}
                to={`/txbk/${parseInt(data.header.BlockNum) + 1}`}>
                <FontAwesomeIcon size='2x' icon={faCaretSquareRight} />
              </QueryPreservingLink>
            </span>
          </div>
          <div style={{ display: 'flex' }}>
            <h6 className='txblock-hash'>{'0x' + data.body.BlockHash}</h6>
            <div onClick={() => {
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
                      <span className='txblock-detail-header'>Date:</span>
                      <span>
                        {timestampToDisplay(data.header.Timestamp)}
                        {' '}
                        ({timestampToTimeago(data.header.Timestamp)})
                      </span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-detail-header'>Transactions:</span>
                      <span>{data.header.NumTxns}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-detail-header'>Gas Limit:</span>
                      <span>{data.header.GasLimit}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-detail-header'>Gas Used:</span>
                      <span>{data.header.GasUsed}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-detail-header'>Rewards:</span>
                      <span>{qaToZil(data.header.Rewards)}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-detail-header'>DS Block:</span>
                      <span><QueryPreservingLink to={`/dsbk/${data.header.DSBlockNum}`}>{data.header.DSBlockNum}</QueryPreservingLink></span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txblock-detail'>
                      <span className='txblock-detail-header'>Miner:</span>
                      <span>{pubKeyToZilAddr(data.header.MinerPubKey)}</span>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
          {data.body.MicroBlockInfos.length > 0 && (
            <Card className='txblock-details-card'>
              <Card.Body>
                <Container>
                  <h6>Micro Blocks</h6>
                  {data.body.MicroBlockInfos.map((x) => <div key={x.MicroBlockHash}>[{x.MicroBlockShardId}] {x.MicroBlockHash}</div>)}
                </Container>
              </Card.Body>
            </Card>
          )}
          {data.txnHashes.length > 0 && (
            <>
              <h4>Transactions</h4>
              <Card className='txblock-details-card'>
                <Card.Body>
                  <ViewAllTable
                    isLoading={isLoadingTrans}
                    fetchData={fetchData}
                    pageCount={Math.ceil(data.txnHashes.length / 10)}
                    columns={columns}
                    data={transactionData ? transactionData : []}
                    processMap={processMap} />
                </Card.Body>
              </Card>
            </>
          )}
        </>
      )}
  </>
}

export default TxBlockDetailsPage

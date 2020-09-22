import React, { useMemo, useCallback, useState, useEffect, useContext } from 'react'
import { OverlayTrigger, Tooltip, Card, Row as BRow, Col as BCol, Container, Spinner } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { Row } from 'react-table'

import HashDisp from 'src/components/Misc/Disp/HashDisp/HashDisp'
import ToAddrDisp from 'src/components/Misc/Disp/ToAddrDisp/ToAddrDisp'
import ViewAllTable from 'src/components/ViewAllPages/ViewAllTable/ViewAllTable'
import { NetworkContext, QueryPreservingLink } from 'src/services/network/networkProvider'
import { TransactionDetails } from 'src/typings/api'
import { qaToZil, timestampToTimeago, hexAddrToZilAddr, timestampToDisplay, pubKeyToZilAddr } from 'src/utils/Utils'
import { Transaction } from '@zilliqa-js/account/src/transaction'
import { TxBlockObj } from '@zilliqa-js/core/src/types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-regular-svg-icons'
import { faCubes, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

import LabelStar from '../Misc/LabelComponent/LabelStar'
import NotFoundPage from '../../ErrorPages/NotFoundPage'

import './TxBlockDetailsPage.css'

const TxBlockDetailsPage: React.FC = () => {

  const { blockNum } = useParams()
  const networkContext = useContext(NetworkContext)
  const { dataService, isIsolatedServer } = networkContext!

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTrans, setIsLoadingTrans] = useState(false)
  const [txBlockObj, setTxBlockObj] = useState<TxBlockObj | null>(null)
  const [txBlockTxns, setTxBlockTxns] = useState<string[] | null>(null)
  const [latestTxBlockNum, setLatestTxBlockNum] = useState<number | null>(null)
  const [transactionData, setTransactionData] = useState<TransactionDetails[] | null>(null)

  // Fetch data
  useEffect(() => {
    setIsLoading(true)
    if (!dataService || isIsolatedServer === null) return

    let latestTxBlockNum: number
    let txBlockObj: TxBlockObj
    let txBlockTxns: string[]
    const getData = async () => {
      try {
        if (isNaN(blockNum))
          throw new Error('Not a valid block number')
        if (isIsolatedServer) {
          txBlockTxns = await dataService.getISTransactionsForTxBlock(parseInt(blockNum))
          latestTxBlockNum = await dataService.getISBlockNum()
        } else {
          txBlockObj = await dataService.getTxBlockObj(parseInt(blockNum))
          latestTxBlockNum = await dataService.getNumTxBlocks()
          try {
            txBlockTxns = await dataService.getTransactionsForTxBlock(parseInt(blockNum))
          } catch (e) { console.log(e) }
        }
        if (txBlockObj)
          setTxBlockObj(txBlockObj)
        if (txBlockTxns)
          setTxBlockTxns(txBlockTxns)
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
      setTxBlockObj(null)
      setTxBlockTxns(null)
      setLatestTxBlockNum(null)
      setError(null)
    }
  }, [blockNum, dataService, isIsolatedServer])

  const columns = useMemo(
    () => [{
      id: 'from-col',
      Header: 'From',
      accessor: 'txn.senderAddress',
      Cell: ({ value }: { value: string }) => (
        <QueryPreservingLink to={`/address/${hexAddrToZilAddr(value)}`}>
          {hexAddrToZilAddr(value)}
        </QueryPreservingLink>
      )
    }, {
      id: 'to-col',
      Header: 'To',
      Cell: ({ row }: { row: Row<TransactionDetails> }) => {
        return <ToAddrDisp txnDetails={row.original} />
      }
    }, {
      id: 'hash-col',
      Header: 'Hash',
      Cell: ({ row }: { row: Row<TransactionDetails> }) => {
        console.log(row)
        return <QueryPreservingLink to={`/tx/0x${row.original.hash}`}>
          <div className='text-right mono'>
            {row.original.txn.txParams.receipt && !row.original.txn.txParams.receipt.success
              && <FontAwesomeIcon className='mr-1' icon={faExclamationCircle} color='red' />
            }
            {'0x' + row.original.hash}
          </div>
        </QueryPreservingLink>
      }
    }, {
      id: 'amount-col',
      Header: 'Amount',
      accessor: 'txn.amount',
      Cell: ({ value }: { value: string }) => (
        <OverlayTrigger placement='right'
          overlay={<Tooltip id={'amt-tt'}>{qaToZil(value)}</Tooltip>}>
          <div className='text-right'>{qaToZil(value, 10)}</div>
        </OverlayTrigger>
      )
    }, {
      id: 'fee-col',
      Header: 'Fee',
      accessor: 'txn',
      Cell: ({ value }: { value: Transaction }) => {
        const fee = Number(value.txParams.gasPrice) * value.txParams.receipt!.cumulative_gas
        return <OverlayTrigger placement='top'
          overlay={<Tooltip id={'fee-tt'}>{qaToZil(fee)}</Tooltip>}>
          <div className='text-center'>{qaToZil(fee, 4)}</div>
        </OverlayTrigger>
      }
    }], []
  )
  const fetchData = useCallback(({ pageIndex }) => {

    if (!txBlockTxns || !dataService) return

    let receivedData: TransactionDetails[]
    const getData = async () => {
      try {
        setIsLoadingTrans(true)
        receivedData = await dataService.getTransactionsDetails(txBlockTxns.slice(pageIndex * 10, pageIndex * 10 + 10))
        if (receivedData)
          setTransactionData(receivedData)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoadingTrans(false)
      }
    }

    getData()
  }, [dataService, txBlockTxns])

  return <>
    {isLoading ? <div className='center-spinner'><Spinner animation="border" /></div> : null}
    {error
      ? <NotFoundPage />
      : <>
        {latestTxBlockNum &&
          <div className={isIsolatedServer ? 'txblock-header mb-3' : 'txblock-header'}>
            <h3 className='mb-1'>
              <span className='mr-1'>
                <FontAwesomeIcon className='fa-icon' icon={faCubes} />
              </span>
              <span className='ml-2'>
                Tx Block
              </span>
              {' '}
              <span className='subtext'>#{blockNum}</span>
              <LabelStar type='Tx Block' />
            </h3>
            <span>
              <QueryPreservingLink
                className={
                  isIsolatedServer
                    ? parseInt(blockNum, 10) === 1 ? 'disabled mr-3' : 'mr-3'
                    : parseInt(blockNum, 10) === 0 ? 'disabled mr-3' : 'mr-3'}
                to={`/txbk/${parseInt(blockNum, 10) - 1}`}>
                <FontAwesomeIcon size='2x' className='fa-icon' icon={faCaretSquareLeft} />
              </QueryPreservingLink>
              <QueryPreservingLink
                className={
                  isIsolatedServer
                    ? parseInt(blockNum, 10) === latestTxBlockNum ? 'disabled' : ''
                    : parseInt(blockNum, 10) === latestTxBlockNum - 1 ? 'disabled' : ''}
                to={`/txbk/${parseInt(blockNum, 10) + 1}`}>
                <FontAwesomeIcon size='2x' className='fa-icon' icon={faCaretSquareRight} />
              </QueryPreservingLink>
            </span>
          </div>
        }
        {txBlockObj && (
          <>
            <div className='subtext'>
              <HashDisp hash={'0x' + txBlockObj.body.BlockHash} />
            </div>
            <Card className='txblock-details-card'>
              <Card.Body>
                <Container>
                  <BRow>
                    <BCol>
                      <div className='txblock-detail'>
                        <span>Date:</span>
                        <span>
                          {timestampToDisplay(txBlockObj.header.Timestamp)}
                          {' '}
                        ({timestampToTimeago(txBlockObj.header.Timestamp)})
                      </span>
                      </div>
                    </BCol>
                    <BCol>
                      <div className='txblock-detail'>
                        <span>Transactions:</span>
                        <span>{txBlockObj.header.NumTxns}</span>
                      </div>
                    </BCol>
                  </BRow>
                  <BRow>
                    <BCol>
                      <div className='txblock-detail'>
                        <span>Gas Limit:</span>
                        <span>{txBlockObj.header.GasLimit}</span>
                      </div>
                    </BCol>
                    <BCol>
                      <div className='txblock-detail'>
                        <span>Gas Used:</span>
                        <span>{txBlockObj.header.GasUsed}</span>
                      </div>
                    </BCol>
                  </BRow>
                  <BRow>
                    <BCol>
                      <div className='txblock-detail'>
                        <span>Txn Fees:</span>
                        <span>{qaToZil(txBlockObj.header.TxnFees)}</span>
                      </div>
                    </BCol>
                    <BCol>
                      <div className='txblock-detail'>
                        <span>Rewards Fees:</span>
                        <span>{qaToZil(txBlockObj.header.Rewards)}</span>
                      </div>
                    </BCol>
                  </BRow>
                  <BRow>
                    <BCol>
                      <div className='txblock-detail'>
                        <span>DS Block:</span>
                        <span><QueryPreservingLink to={`/dsbk/${txBlockObj.header.DSBlockNum}`}>{txBlockObj.header.DSBlockNum}</QueryPreservingLink></span>
                      </div>
                    </BCol>
                    <BCol>
                      <div className='txblock-detail'>
                        <span>DS Leader:</span>
                        <span><QueryPreservingLink to={`/address/${pubKeyToZilAddr(txBlockObj.header.MinerPubKey)}`}>{pubKeyToZilAddr(txBlockObj.header.MinerPubKey)}</QueryPreservingLink></span>
                      </div>
                    </BCol>
                  </BRow>
                </Container>
              </Card.Body>
            </Card>
            {txBlockObj.body.MicroBlockInfos.length > 0 && (
              <Card className='txblock-details-card mono'>
                <Card.Body>
                  <Container>
                    <span>Micro Blocks</span>
                    {txBlockObj.body.MicroBlockInfos
                      .map((x) => (
                        <div key={x.MicroBlockHash}>[{x.MicroBlockShardId}] {x.MicroBlockHash}</div>
                      ))}
                  </Container>
                </Card.Body>
              </Card>
            )}
          </>
        )}
        {txBlockTxns && txBlockTxns.length > 0 && (
          <>
            <h4>Transactions</h4>
            <ViewAllTable
              isLoading={isLoadingTrans}
              fetchData={fetchData}
              pageCount={Math.ceil(txBlockTxns.length / 10)}
              columns={columns}
              data={transactionData ? transactionData : []} />
          </>
        )}
      </>
    }
  </>
}

export default TxBlockDetailsPage

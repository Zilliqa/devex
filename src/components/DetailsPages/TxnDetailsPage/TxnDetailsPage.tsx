import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Row, Col, Container, Spinner } from 'react-bootstrap'

import { QueryPreservingLink } from 'src'
import { NetworkContext } from 'src/services/networkProvider'
import { TransactionDetails } from 'src/typings/api'
import { qaToZil, hexAddrToZilAddr } from 'src/utils/Utils'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faExclamationCircle, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

import InfoTabs, { generateTabsFromTxnDetails } from '../InfoTabs/InfoTabs'

import LabelStar from '../LabelStar/LabelStar'
import NotFoundPage from '../NotFoundPage/NotFoundPage'
import './TxnDetailsPage.css'

const TxnDetailsPage: React.FC = () => {

  const { txnHash } = useParams()
  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TransactionDetails | null>(null)


  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let receivedData: TransactionDetails
    const getData = async () => {
      try {
        setIsLoading(true)
        receivedData = await dataService.getTransactionDetails(txnHash)
        if (receivedData) {
          setData(receivedData)
        }
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
      setError(null)
    }
  }, [dataService, txnHash])

  return <>
    {isLoading ? <div className='center-spinner'><Spinner animation="border" variant="secondary" /></div> : null}
    {error
      ? <NotFoundPage />
      : data && data.txn.txParams.receipt && (
        <>
          <h3>
            <span>
              {(data.txn.txParams.receipt.success === undefined || data.txn.txParams.receipt.success)
                ? <FontAwesomeIcon color='green' icon={faExchangeAlt} />
                : <FontAwesomeIcon color='red' icon={faExclamationCircle} />}
            </span>
            <span style={{ marginLeft: '0.75rem' }}>
              Transaction
          </span>
            <LabelStar />
          </h3>
          <div style={{ display: 'flex' }}>
            <h6 className='txn-hash'>{'0x' + data.hash}</h6>
            <div onClick={() => {
              navigator.clipboard.writeText('0x' + data.hash)
            }} className='txn-hash-copy-btn'>
              <FontAwesomeIcon icon={faCopy} />
            </div>
          </div>
          <Card className='txn-details-card'>
            <Card.Body>
              <Container>
                <Row>
                  <Col>
                    <div className='txn-detail'>
                      <span>From:</span>
                      <span>
                        <QueryPreservingLink to={`/address/${hexAddrToZilAddr(data.txn.senderAddress)}`}>
                          {hexAddrToZilAddr(data.txn.senderAddress)}
                        </QueryPreservingLink>
                      </span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txn-detail'>
                      <span>To:</span>
                      <span>
                        <QueryPreservingLink to={`/address/${hexAddrToZilAddr(data.txn.txParams.toAddr)}`}>
                          {hexAddrToZilAddr(data.txn.txParams.toAddr)}
                        </QueryPreservingLink>
                      </span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txn-detail'>
                      <span>Amount:</span>
                      <span>{qaToZil(data.txn.txParams.amount.toString())}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txn-detail'>
                      <span>Nonce:</span>
                      <span>{data.txn.txParams.nonce}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txn-detail'>
                      <span>Gas Limit:</span>
                      <span>{data.txn.txParams.gasLimit.toString()}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txn-detail'>
                      <span>Gas Price:</span>
                      <span>{qaToZil(data.txn.txParams.gasPrice.toString())}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txn-detail'>
                      <span>Cumulative Gas:</span>
                      <span>{data.txn.txParams.receipt.cumulative_gas}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txn-detail'>
                      <span>Transaction Block:</span>
                      <span>
                        <QueryPreservingLink to={`/txbk/${data.txn.txParams.receipt.epoch_num}`}>
                          {data.txn.txParams.receipt.epoch_num}
                        </QueryPreservingLink>
                      </span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txn-detail'>
                      <span>Success:</span>
                      <span>{`${data.txn.txParams.receipt.success}`}</span>
                    </div>
                  </Col>
                  {data.txn.txParams.receipt.accepted !== undefined && (<Col>
                    <div className='txn-detail'>
                      <span>Accepts $ZIL:</span>
                      <span>{`${data.txn.txParams.receipt.accepted}`}</span>
                    </div>
                  </Col>)}
                </Row>
              </Container>
            </Card.Body>
          </Card>
          <InfoTabs tabs={generateTabsFromTxnDetails(data)} />
        </>
      )}
  </>
}

export default TxnDetailsPage

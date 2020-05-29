// @ts-nocheck
import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, Row, Col, Container, Tabs, Tab } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'
import { qaToZil, hexAddrToZilAddr } from 'src/utils/Utils'
import { TransactionObj } from '@zilliqa-js/core/src/types'
import { Long } from "@zilliqa-js/util"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'

import TransitionsTable from './TransitionsTable'
import EventLogsTable from './EventLogsTable'
import ErrorsDisplay from './ErrorsDisplay'

import './TxnDetailsPage.css'

const TxnDetailsPage: React.FC = () => {

  const { txnHash } = useParams()
  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [tab, setTab] = useState('')
  const [data, setData] = useState<TransactionObj | null>(null)

  const setDefaultTab = useCallback((data) => {
    if (!data) return
    const tabKeys: string[] = []
    if (data.receipt.event_logs)
      tabKeys.push('eventLog')
    if (data.receipt.transitions)
      tabKeys.push('transitions')
    // @ts-ignore
    if (data.receipt.exceptions && Object.keys(data.receipt.exceptions).length > 0)
      tabKeys.push('exceptions')
    if (data.receipt.errors && Object.keys(data.receipt.errors).length > 0)
      tabKeys.push('errors')
    if (tabKeys.length > 0) setTab(tabKeys[0])
  }, [])

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let receivedData: TransactionObj
    const getData = async () => {
      try {
        receivedData = await dataService.getTransactionDetails(txnHash)
        if (receivedData) {
          setData(receivedData)
          setDefaultTab(receivedData)
        }
      } catch (e) {
        console.log(e)
      }
    }

    getData()
  }, [dataService, txnHash, setDefaultTab])

  return <>
    {data && (
      <>
        <h3>Transaction</h3>
        <div style={{ display: 'flex' }}>
          {/* To be removed after SDK typing is updated
        // @ts-ignore */}
          <h6 className='txn-hash'>{data.hash}</h6>
          <div onClick={() => {
            {/* To be removed after SDK typing is updated
            // @ts-ignore */}
            navigator.clipboard.writeText(data.hash)
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
                    <span className='txn-detail-header'>From:</span>
                    {/* To be removed after SDK typing is updated
                        // @ts-ignore */}
                    <span>{hexAddrToZilAddr(data.senderAddress)}</span>
                  </div>
                </Col>
                <Col>
                  <div className='txn-detail'>
                    <span className='txn-detail-header'>To:</span>
                    <span>{hexAddrToZilAddr(data.toAddr)}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='txn-detail'>
                    <span className='txn-detail-header'>Amount:</span>
                    <span>{qaToZil(data.amount)}</span>
                  </div>
                </Col>
                <Col>
                  <div className='txn-detail'>
                    <span className='txn-detail-header'>Nonce:</span>
                    <span>{data.nonce}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='txn-detail'>
                    <span className='txn-detail-header'>Gas Limit:</span>
                    {/* To be removed after SDK typing is updated
                        // @ts-ignore */}
                    <span>{(new Long(data.gasLimit.low, data.gasLimit.high, data.gasLimit.unsigned)).toString()}</span>
                  </div>
                </Col>
                <Col>
                  <div className='txn-detail'>
                    <span className='txn-detail-header'>Gas Price:</span>
                    <span>{qaToZil(data.gasPrice)}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='txn-detail'>
                    <span className='txn-detail-header'>Cumulative Gas:</span>
                    <span>{data.receipt.cumulative_gas}</span>
                  </div>
                </Col>
                <Col>
                  <div className='txn-detail'>
                    <span className='txn-detail-header'>Transaction Block:</span>
                    {/* To be removed after SDK typing is updated
                        // @ts-ignore */}
                    <span><Link to={`/txbk/${data.receipt.epoch_num}`}>{data.receipt.epoch_num}</Link></span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='txn-detail'>
                    <span className='txn-detail-header'>Success:</span>
                    <span>{`${data.receipt.success}`}</span>
                  </div>
                </Col>
                {/* To be removed after SDK typing is updated
                        // @ts-ignore */}
                {data.receipt.accepted !== undefined && (<Col>
                  <div className='txn-detail'>
                    <span className='txn-detail-header'>Accepts $ZIL:</span>
                    {/* To be removed after SDK typing is updated
                        // @ts-ignore */}
                    <span>{`${data.receipt.accepted}`}</span>
                  </div>
                </Col>)}
              </Row>
            </Container>
          </Card.Body>
        </Card>
        {(tab !== '') && (
          <>
            <div style={{ marginTop: '2rem' }}>
              <h4>Additional Info</h4>
            </div>
            <Card className='tabs-card'>
              <Card.Header className='tabs-card-header'>
                <Tabs id="additional-info-tabs" activeKey={tab} onSelect={(k: string) => setTab(k)}>
                  {data.receipt.event_logs && <Tab eventKey="eventLog" title={`Event Log (${data.receipt.event_logs.length})`} />}
                  {data.receipt.transitions && <Tab eventKey="transitions" title={`Transitions (${data.receipt.transitions.length})`} />}
                  {/* To be removed after SDK typing is updated
                    // @ts-ignore */}
                  {data.receipt.exceptions && data.receipt.exceptions.length > 0 && <Tab eventKey="exceptions" title={`Exceptions (${data.receipt.exceptions.length})`} />}
                  {data.receipt.errors && Object.keys(data.receipt.errors).length > 0 && <Tab eventKey="errors" title={'Errors'} />}
                </Tabs>
              </Card.Header>
              <Card.Body>
                <Container>
                  {tab === 'eventLog'
                    ? <EventLogsTable events={data.receipt.event_logs} />
                    : tab === 'transitions'
                      ? <TransitionsTable transitions={data.receipt.transitions} />
                      : tab === 'errors'
                        ? <ErrorsDisplay errors={data.receipt.errors} />
                        : tab === 'exceptions'
                          ? <ErrorsDisplay errors={data.receipt.exceptions} />
                          : null
                  }
                </Container>
              </Card.Body>
            </Card>
          </>
        )}
      </>
    )}
  </>
}

export default TxnDetailsPage

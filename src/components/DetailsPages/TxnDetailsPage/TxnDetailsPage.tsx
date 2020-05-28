import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, Row, Col, Container, Tabs, Tab } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'
import { qaToZil, hexAddrToZilAddr } from 'src/utils/Utils'
import { TransactionObj, EventLogEntry, TransitionEntry, EventParam } from '@zilliqa-js/core/src/types'
import { Long } from "@zilliqa-js/util"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'

import './TxnDetailsPage.css'

const TxnDetailsPage: React.FC = () => {

  const { txnHash } = useParams()
  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [tab, setTab] = useState('eventLog')
  const [data, setData] = useState<TransactionObj | null>(null)

  const highlightEventParams = useCallback((params: EventParam[]): React.ReactNode => {
    return params
      .map((param) => (
        <span>
          <span style={{ color: 'orangered' }}>{param.type}</span>
          {' '}
          {param.vname}
        </span>))
      .reduce((acc, ele): any => (acc === null ? [ele] : [acc, ', ', ele] as any))
  }, [])

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let receivedData: TransactionObj
    const getData = async () => {
      try {
        receivedData = await dataService.getTransactionDetails(txnHash)
        if (receivedData)
          setData(receivedData)
      } catch (e) {
        console.log(e)
      }
    }

    getData()
  }, [dataService, txnHash])

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
            </Container>
          </Card.Body>
        </Card>
        {(data.receipt.event_logs || data.receipt.transitions) && (
          <>
            <div>
              <h4>Additional Info</h4>
            </div>
            <Card className='tabs-card'>
              <Card.Header className='tabs-card-header'>
                <Tabs id="additional-info-tabs" activeKey={tab} onSelect={(k: string) => setTab(k)}>
                  {data.receipt.event_logs && <Tab eventKey="eventLog" title={`Event Log (${data.receipt.event_logs.length})`} />}
                  {data.receipt.transitions && <Tab eventKey="transitions" title={`Transitions (${data.receipt.transitions.length})`} />}
                </Tabs>
              </Card.Header>
              <Card.Body>
                <Container>
                  {tab === 'eventLog'
                    ? <>
                      {data.receipt.event_logs.map((event: EventLogEntry) => (
                        <table className='receipt-table'>
                          <tbody>
                            <tr>
                              <th>Function</th>
                              <td>
                                <span style={{ color: 'blueviolet' }}>
                                  {event._eventname}
                                </span>
                                {' ('}{highlightEventParams(event.params)}{')'}
                              </td>
                            </tr>
                            <tr>
                              <th>Address</th>
                              <td>{hexAddrToZilAddr(event.address)}</td>
                            </tr>
                            {event.params.length > 0 && (
                              <>
                                <tr style={{ height: '20px' }}><hr /></tr>
                                <tr>
                                  <td className="txn-detail-header">Variable</td>
                                  <td className="txn-detail-header">Value</td>
                                </tr>
                                {event.params.map(param => (
                                  <tr>
                                    <td>{param.vname}</td>
                                    {/* To be removed after SDK typing is updated
                                  // @ts-ignore */}
                                    <td>
                                      {typeof param.value === 'object'
                                        ? <pre style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
                                          {JSON.stringify(param.value, null, '\t')}
                                        </pre>
                                        : Array.isArray(param.value)
                                          ? param.value.toString()
                                          : param.value}
                                    </td>
                                  </tr>
                                ))}
                              </>
                            )}
                          </tbody>
                        </table>
                      )).reduce((acc: (React.ReactNode | null), x) => (
                        acc === null
                          ? x
                          : <>{acc}<hr />{x}</>)
                        , null)
                      }
                    </>
                    : tab === 'transitions'
                      ? <>
                        {data.receipt.transitions.map((transition: TransitionEntry) => (
                          <table className='receipt-table'>
                            <tbody>
                              <tr>
                                <th>Tag</th>
                                <td>{transition.msg._tag}</td>
                              </tr>
                              <tr>
                                <th>Address</th>
                                <td>{hexAddrToZilAddr(transition.addr)}</td>
                              </tr>
                              <tr>
                                <th>Depth</th>
                                {/* To be removed after SDK typing is updated
                            // @ts-ignore */}
                                <td>{transition.depth}</td>
                              </tr>
                              <tr>
                                <th>Amount</th>
                                <td>{qaToZil(transition.msg._amount)}</td>
                              </tr>
                              <tr>
                                <th>Receipient</th>
                                <td>{transition.msg._recipient}</td>
                              </tr>
                              {transition.msg.params.length > 0 && (
                                <>
                                  <tr style={{ height: '20px' }}><hr /></tr>
                                  <tr>
                                    <td className="txn-detail-header">Variable</td>
                                    <td className="txn-detail-header">Value</td>
                                  </tr>
                                  {transition.msg.params.map(param => (
                                    <tr>
                                      <td>{param.vname}</td>
                                      <td>
                                        {typeof param.value === 'object'
                                          ? <pre style={{ backgroundColor: 'rgba(0, 0, 0, 0.03)' }}>
                                            {JSON.stringify(param.value, null, '\t')}
                                          </pre>
                                          : Array.isArray(param.value)
                                            ? param.value.toString()
                                            : param.value}
                                      </td>
                                    </tr>
                                  ))}
                                </>
                              )}
                            </tbody>
                          </table>
                        )).reduce((acc: (React.ReactNode | null), x) => (
                          acc === null
                            ? x
                            : <>{acc}<hr />{x}</>)
                          , null
                        )}
                      </>
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

import React, { useState, useEffect, useContext } from 'react'
import { useParams, Redirect, Link } from 'react-router-dom'
import { Card, Row, Col, Container, Tabs, Tab } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'
import { qaToZil, hexAddrToZilAddr } from 'src/utils/Utils'
import { TransactionObj, EventLogEntry, TransitionEntry } from '@zilliqa-js/core/src/types'
import { Long } from "@zilliqa-js/util"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'

import './TxnDetailsPage.css'

const TxnDetailsPage = () => {

  const { txnHash } = useParams()
  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [toHome, setToHome] = useState(false)
  const [data, setData] = useState<TransactionObj | null>(null)
  const [tab, setTab] = useState('eventLog')

  // Redirect back to home page on url change after initial render
  useEffect(() => {
    return () => setToHome(true)
  }, [dataService])

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
    {toHome
      ? <Redirect to='/' />
      : data ?
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
                      <span className='txn-details-card-header'>From:</span>
                      {/* To be removed after SDK typing is updated
                        // @ts-ignore */}
                      <span>{hexAddrToZilAddr(data.senderAddress)}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txn-detail'>
                      <span className='txn-details-card-header'>To:</span>
                      <span>{hexAddrToZilAddr(data.toAddr)}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txn-detail'>
                      <span className='txn-details-card-header'>Amount:</span>
                      <span>{qaToZil(data.amount)}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txn-detail'>
                      <span className='txn-details-card-header'>Nonce:</span>
                      <span>{data.nonce}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txn-detail'>
                      <span className='txn-details-card-header'>Gas Limit:</span>
                      {/* To be removed after SDK typing is updated
                        // @ts-ignore */}
                      <span>{(new Long(data.gasLimit.low, data.gasLimit.high, data.gasLimit.unsigned)).toString()}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txn-detail'>
                      <span className='txn-details-card-header'>Gas Price:</span>
                      <span>{qaToZil(data.gasPrice)}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='txn-detail'>
                      <span className='txn-details-card-header'>Cumulative Gas:</span>
                      <span>{data.receipt.cumulative_gas}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='txn-detail'>
                      <span className='txn-details-card-header'>Transaction Block:</span>
                      {/* To be removed after SDK typing is updated
                        // @ts-ignore */}
                      <span><Link to={`/txbk/${data.receipt.epoch_num}`}>{data.receipt.epoch_num}</Link></span>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
          {data.receipt.event_logs || data.receipt.transitions ?
            <>
              <div style={{ margin: '1rem 0' }}>
                <h4>Additional Info</h4>
              </div>
              <Card className='tabs-card'>
                <Card.Header className='tabs-card-header'>
                  <Tabs activeKey={tab} onSelect={(k: string) => setTab(k)} id="additional-info-tabs">
                    {data.receipt.event_logs ? <Tab eventKey="eventLog" title={`Event Log (${data.receipt.event_logs.length})`} /> : null}
                    {data.receipt.transitions ? <Tab eventKey="transitions" title={`Transitions (${data.receipt.transitions.length})`} /> : null}
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
                                {/* <td><span style={{color:'blueviolet'}}>{event._eventname}</span> ({event.params.map(param => param.type + ' ' + param.vname).join(', ')})</td> */}
                                <td>
                                  <span style={{color:'blueviolet'}}>{event._eventname}</span>
                                  {' '}
                                  ({event.params
                                    .map((param) => (<span><span style={{color: 'orangered'}}>{param.type}</span> {param.vname}</span>))
                                    .reduce((acc, ele): any => (acc === null ? [ele] : [acc, ', ', ele] as any))})</td>
                              </tr>
                              <tr style={event.params.length > 0 ? { borderBottom: 'solid transparent 2rem' } : {}}>
                                <th>Address</th>
                                <td>{hexAddrToZilAddr(event.address)}</td>
                              </tr>
                              {event.params.map(param => (
                                <tr>
                                  <td>{param.vname}</td>
                                  {/* To be removed after SDK typing is updated
                              // @ts-ignore */}
                                  <td>{typeof param.value.argtypes === 'object' ? param.type : param.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )).reduce((acc: (React.ReactElement | null), x) => acc === null ? x : <>{acc}<hr />{x}</>, null)}</>
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
                                <tr style={transition.msg.params.length > 0 ? { borderBottom: 'solid transparent 2rem' } : {}}>
                                  <th>Receipient</th>
                                  <td>{transition.msg._recipient}</td>
                                </tr>
                                {transition.msg.params.map(param => (
                                  <tr>
                                    <td>{param.vname}</td>
                                    <td>{typeof param.value === 'object' ? <pre>{JSON.stringify(param.value, null, '\t')}</pre>
                                      : Array.isArray(param.value) ? param.value.toString() : param.value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )).reduce((acc: (React.ReactElement | null), x) => acc === null ? x : <>{acc}<hr />{x}</>, null)}</>
                        : null}
                  </Container>
                </Card.Body>
              </Card>
            </> : null}
        </>
        : null}
  </>
}

export default TxnDetailsPage
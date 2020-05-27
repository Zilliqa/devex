import React, { useState, useEffect, useContext } from 'react'
import { useParams, Redirect } from 'react-router-dom'
import { Card, Row, Col, Container } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'
import { qaToZil, timestampToTimeago, timestampToDisplay, pubKeyToZilAddr } from 'src/utils/Utils'
import { DsBlockObj } from '@zilliqa-js/core/src/types'

import './DSBlockDetailsPage.css'

const DSBlockDetailsPage = () => {
  const { blockNum } = useParams() // From url params
  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [toHome, setToHome] = useState(false)
  const [data, setData] = useState<DsBlockObj | null>(null)

  // Redirect back to home page on url change after initial render
  useEffect(() => {
    return () => setToHome(true)
  }, [dataService])

  // Fetch data
  useEffect(() => {
    if (!dataService) return
    let isCancelled = false

    let receivedData: DsBlockObj
    const getData = async () => {
      try {
        receivedData = await dataService.getDSBlockDetails(blockNum)
        if (!isCancelled && receivedData)
          setData(receivedData)
      } catch (e) {
        if (!isCancelled)
          console.log(e)
      }
    }
    getData()
  }, [dataService, blockNum])

  return <>
    {toHome
      ? <Redirect to='/' />
      : data ?
        <>
          <h3>Block <span style={{ fontWeight: 350, color: 'rgb(93, 106, 133)' }}>#{data.header.BlockNum}</span></h3>
          <Card className='dsblock-details-card'>
            <Card.Body>
              <Container>
                <Row>
                  <Col>
                    <div className='dsblock-detail'>
                      <span className='dsblock-details-card-header'>Date:</span>
                      <span>
                        {timestampToDisplay(data.header.Timestamp)}
                        {' '}
                    ({timestampToTimeago(data.header.Timestamp)})
                    </span>
                    </div>
                  </Col>
                  <Col>
                    <div className='dsblock-detail'>
                      <span className='dsblock-details-card-header'>Difficulty:</span>
                      <span>{data.header.Difficulty}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='dsblock-detail'>
                      <span className='dsblock-details-card-header'>DS Difficulty:</span>
                      <span>{data.header.DifficultyDS}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='dsblock-detail'>
                      <span className='dsblock-details-card-header'>Gas Price:</span>
                      <span>{qaToZil(data.header.GasPrice)}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='dsblock-detail'>
                      <span className='dsblock-details-card-header'>DS Leader:</span>
                      <span>{pubKeyToZilAddr(data.header.LeaderPubKey)}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='dsblock-detail'>
                      <span className='dsblock-details-card-header'>Signature:</span>
                      <span style={{ maxWidth: 'calc(100% - 90px)' }}>{data.signature}</span>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
          <Card className='dsblock-details-card'>
            <Card.Body>
              <Container>
                <h6>PoW Winners</h6>
                {data.header.PoWWinners.map((x, index) => <div>[{index + 1}] {pubKeyToZilAddr(x)}</div>)}
              </Container>
            </Card.Body>
          </Card>
        </>
        : null}
  </>
}

export default DSBlockDetailsPage
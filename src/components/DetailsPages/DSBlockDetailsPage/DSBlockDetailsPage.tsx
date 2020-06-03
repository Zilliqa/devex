import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, Row, Col, Container } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'
import { qaToZil, timestampToTimeago, timestampToDisplay, pubKeyToZilAddr } from 'src/utils/Utils'
import { DsBlockObj } from '@zilliqa-js/core/src/types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-regular-svg-icons'
import { faCubes } from '@fortawesome/free-solid-svg-icons'

import './DSBlockDetailsPage.css'

const DSBlockDetailsPage: React.FC = () => {

  const { blockNum } = useParams() // From url params
  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [data, setData] = useState<DsBlockObj | null>(null)
  const [latestDSBlockNum, setLatestDSBlockNum] = useState<number | null>(null)

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let latestDSBlockNum: number
    let receivedData: DsBlockObj
    const getData = async () => {
      try {
        receivedData = await dataService.getDSBlockDetails(blockNum)
        if (receivedData)
          setData(receivedData)
        latestDSBlockNum = await dataService.getNumDSBlocks()
        if (latestDSBlockNum)
          setLatestDSBlockNum(latestDSBlockNum)
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [dataService, blockNum])

  return <>
    {data && (
      <>
        <div className='dsblock-header'>
          <h3>
            <span>
              <FontAwesomeIcon color='grey' icon={faCubes} />
            </span>
            <span style={{ marginLeft:'0.75rem' }}>
              DS Block
            </span>
            {' '}
            <span className='dsblock-header-blocknum'>#{data.header.BlockNum}</span>
          </h3>
          <span>
            <Link
              style={{ marginRight: '1rem' }}
              className={parseInt(data.header.BlockNum) === 0 ? 'disabled-link' : ''}
              to={`/dsbk/${parseInt(data.header.BlockNum) - 1}`}>
              <FontAwesomeIcon size='2x' icon={faCaretSquareLeft} />
            </Link>
            <Link
              className={latestDSBlockNum && parseInt(data.header.BlockNum) === latestDSBlockNum - 1 ? 'disabled-link' : ''}
              to={`/dsbk/${parseInt(data.header.BlockNum) + 1}`}>
              <FontAwesomeIcon size='2x' icon={faCaretSquareRight} />
            </Link>
          </span>
        </div>
        <Card className='dsblock-details-card'>
          <Card.Body>
            <Container>
              <Row>
                <Col>
                  <div className='dsblock-detail'>
                    <span className='dsblock-detail-header'>Date:</span>
                    <span>
                      {timestampToDisplay(data.header.Timestamp)}
                      {' '}
                        ({timestampToTimeago(data.header.Timestamp)})
                    </span>
                  </div>
                </Col>
                <Col>
                  <div className='dsblock-detail'>
                    <span className='dsblock-detail-header'>Difficulty:</span>
                    <span>{data.header.Difficulty}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='dsblock-detail'>
                    <span className='dsblock-detail-header'>DS Difficulty:</span>
                    <span>{data.header.DifficultyDS}</span>
                  </div>
                </Col>
                <Col>
                  <div className='dsblock-detail'>
                    <span className='dsblock-detail-header'>Gas Price:</span>
                    <span>{qaToZil(data.header.GasPrice)}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='dsblock-detail'>
                    <span className='dsblock-detail-header'>DS Leader:</span>
                    <span>{pubKeyToZilAddr(data.header.LeaderPubKey)}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='dsblock-detail'>
                    <span className='dsblock-detail-header'>Signature:</span>
                    <span style={{ maxWidth: 'calc(100% - 90px)' }}>{data.signature}</span>
                  </div>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
        {data.header.PoWWinners.length > 0 && (
          <Card className='dsblock-details-card'>
            <Card.Body>
              <Container>
                <h6>PoW Winners</h6>
                {data.header.PoWWinners.map((x, index) => <div>[{index + 1}] {pubKeyToZilAddr(x)}</div>)}
              </Container>
            </Card.Body>
          </Card>
        )}
      </>
    )}
  </>
}

export default DSBlockDetailsPage

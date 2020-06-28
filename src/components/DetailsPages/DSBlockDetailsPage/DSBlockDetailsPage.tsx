import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Row, Col, Container, Spinner, Collapse } from 'react-bootstrap'

import { QueryPreservingLink } from 'src'
import { NetworkContext } from 'src/services/networkProvider'
import { qaToZil, timestampToTimeago, timestampToDisplay, pubKeyToZilAddr } from 'src/utils/Utils'
import { DsBlockObj, MinerInfo } from '@zilliqa-js/core/src/types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-regular-svg-icons'
import { faCubes, faAngleUp, faAngleLeft, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'

import './DSBlockDetailsPage.css'
import NotFoundPage from '../NotFoundPage/NotFoundPage'
import MinerTable from './MinerTable/MinerTable'
import LabelStar from '../LabelStar/LabelStar'

const DSBlockDetailsPage: React.FC = () => {

  const { blockNum } = useParams()
  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DsBlockObj | null>(null)
  const [latestDSBlockNum, setLatestDSBlockNum] = useState<number | null>(null)
  const [minerInfo, setMinerInfo] = useState<MinerInfo | null>(null)
  const [currShardIdx, setCurrShardIdx] = useState<number>(0)
  const [showMore, setShowMore] = useState<boolean>(false)

  // Fetch data
  useEffect(() => {
    if (!dataService) return
    let latestDSBlockNum: number
    let receivedData: DsBlockObj
    let minerInfo: MinerInfo
    const getData = async () => {
      try {
        setIsLoading(true)
        if (isNaN(blockNum))
          throw new Error('Not a valid block number')
        receivedData = await dataService.getDSBlockDetails(blockNum)
        latestDSBlockNum = await dataService.getNumDSBlocks()
        try { // wrapped in another try catch because it is optional
          minerInfo = await dataService.getMinerInfo(blockNum)
        } catch (e) {console.log(e)}
        if (receivedData)
          setData(receivedData)
        if (latestDSBlockNum)
          setLatestDSBlockNum(latestDSBlockNum)
        if (minerInfo)
          setMinerInfo(minerInfo)
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
      setLatestDSBlockNum(null)
      setMinerInfo(null)
      setError(null)
      setCurrShardIdx(0)
      setShowMore(false)
    }
  }, [blockNum, dataService])

  return <>
    {isLoading ? <div className='center-spinner'><Spinner animation="border" variant="secondary" /></div> : null}
    {error
      ? <NotFoundPage />
      : data && (
        <>
          <div className='dsblock-header'>
            <h3>
              <span>
                <FontAwesomeIcon color='grey' icon={faCubes} />
              </span>
              <span style={{ marginLeft: '0.75rem' }}>
                DS Block
              </span>
              {' '}
              <span className='dsblock-header-blocknum'>#{data.header.BlockNum}</span>
              <LabelStar />
            </h3>
            <span>
              <QueryPreservingLink
                style={{ marginRight: '1rem' }}
                className={parseInt(data.header.BlockNum) === 0 ? 'disabled-link' : ''}
                to={`/dsbk/${parseInt(data.header.BlockNum) - 1}`}>
                <FontAwesomeIcon size='2x' icon={faCaretSquareLeft} />
              </QueryPreservingLink>
              <QueryPreservingLink
                className={latestDSBlockNum && parseInt(data.header.BlockNum) === latestDSBlockNum - 1 ? 'disabled-link' : ''}
                to={`/dsbk/${parseInt(data.header.BlockNum) + 1}`}>
                <FontAwesomeIcon size='2x' icon={faCaretSquareRight} />
              </QueryPreservingLink>
            </span>
          </div>
          <Card className='dsblock-details-card'>
            <Card.Body>
              <Container>
                <Row>
                  <Col>
                    <div className='dsblock-detail'>
                      <span>Date:</span>
                      <span>
                        {timestampToDisplay(data.header.Timestamp)}
                        {' '}
                        ({timestampToTimeago(data.header.Timestamp)})
                    </span>
                    </div>
                  </Col>
                  <Col>
                    <div className='dsblock-detail'>
                      <span>Difficulty:</span>
                      <span>{data.header.Difficulty}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='dsblock-detail'>
                      <span>DS Difficulty:</span>
                      <span>{data.header.DifficultyDS}</span>
                    </div>
                  </Col>
                  <Col>
                    <div className='dsblock-detail'>
                      <span>Gas Price:</span>
                      <span>{qaToZil(data.header.GasPrice)}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='dsblock-detail'>
                      <span>DS Leader:</span>
                      <span>
                        <QueryPreservingLink to={`address/${pubKeyToZilAddr(data.header.LeaderPubKey)}`}>
                          {pubKeyToZilAddr(data.header.LeaderPubKey)}
                        </QueryPreservingLink>
                      </span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='dsblock-detail'>
                      <span>Signature:</span>
                      <span style={{ lineHeight: '25px', fontSize: '13.2px', maxWidth: 'calc(100% - 90px)' }}>{data.signature}</span>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
          {data.header.PoWWinners.length > 0 && (
            <Card className='dsblock-details-card'>
              <Card.Body>
                <Container style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                  <h6>PoW Winners</h6>
                  {data.header.PoWWinners.map((x, index) => <div key={index}>[{index}]
                    {'  '}
                    <QueryPreservingLink to={`/address/${pubKeyToZilAddr(x)}`}>{pubKeyToZilAddr(x)}</QueryPreservingLink></div>)}
                </Container>
              </Card.Body>
            </Card>
          )}
          {minerInfo &&
            <>
              <Collapse in={showMore}>
                <Row>
                  <Col>
                    <Card className='miner-card'>
                      <Card.Body>
                        <Container style={{ fontSize: '15px', fontFamily: 'monospace' }}>
                          <Row>
                            <Col>
                              <Row style={{ width: 'fit-content' }}>
                                <h6>DS Committee</h6>
                              </Row>
                            </Col>
                            <Col>
                              <Row style={{ width: 'fit-content', marginLeft: 'auto' }}>
                                <span>Total: <strong>{minerInfo.dscommittee.length}</strong></span>
                              </Row>
                            </Col>
                          </Row>
                          <Row style={{ justifyContent: 'center' }}>
                            {minerInfo.dscommittee.length > 0
                              ? <MinerTable addresses={minerInfo.dscommittee} />
                              : <span style={{ padding: '1rem 0' }} >No addresses to show</span>
                            }
                          </Row>
                        </Container>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card className='miner-card ml-auto'>
                      <Card.Body>
                        <Container style={{ fontSize: '15px', fontFamily: 'monospace' }}>
                          <Row>
                            <Col>
                              <Row style={{ width: 'fit-content' }}>
                                <h6>Shard {currShardIdx + 1} of {minerInfo.shards.length}</h6>
                              </Row>
                            </Col>
                            <Col style={{ textAlign: 'center', marginTop: '-0.50rem' }}>
                              <span style={{ padding: '0 0.5rem' }}>
                                <FontAwesomeIcon size='2x'
                                  cursor='pointer'
                                  onClick={currShardIdx === 0 ? undefined : () => (setCurrShardIdx(currShardIdx - 1))}
                                  color={currShardIdx === 0 ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.55)'} icon={faAngleLeft} />
                              </span>
                              <span style={{ padding: '0 0.5rem' }}>
                                <FontAwesomeIcon size='2x'
                                  cursor='pointer'
                                  onClick={currShardIdx === minerInfo.shards.length - 1 ? undefined : () => (setCurrShardIdx(currShardIdx + 1))}
                                  color={currShardIdx === minerInfo.shards.length - 1 ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.55)'} icon={faAngleRight} />
                              </span>
                            </Col>
                            <Col>
                              <Row style={{ width: 'fit-content', marginLeft: 'auto' }}>
                                <span>Total: <strong>{minerInfo.shards[currShardIdx].nodes.length}</strong></span>
                              </Row>
                            </Col>
                          </Row>
                          <Row style={{ justifyContent: 'center' }}>
                            {minerInfo.shards[currShardIdx].nodes.length > 0
                              ? <MinerTable addresses={minerInfo.shards[currShardIdx].nodes} />
                              : <span style={{ padding: '1rem 0' }} >No addresses to show</span>
                            }
                          </Row>
                        </Container>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Collapse>
            </>
          }
          <Container className='showmore-container' onClick={() => setShowMore(!showMore)}>
            <Row>
              <FontAwesomeIcon icon={showMore ? faAngleUp : faAngleDown} size='2x' color='rgba(0, 0, 0, 0.55)' />
            </Row>
          </Container>
        </>
      )}
  </>
}

export default DSBlockDetailsPage

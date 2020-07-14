import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Row, Col, Container, Spinner, Collapse } from 'react-bootstrap'

import { QueryPreservingLink } from 'src/services/network/networkProvider'
import { NetworkContext } from 'src/services/network/networkProvider'
import { qaToZil, timestampToTimeago, timestampToDisplay, pubKeyToZilAddr } from 'src/utils/Utils'
import { DsBlockObj, MinerInfo } from '@zilliqa-js/core/src/types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-regular-svg-icons'
import { faCubes, faAngleUp, faAngleLeft, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'

import NotFoundPage from '../../ErrorPages/NotFoundPage'
import MinerTable from './MinerTable/MinerTable'
import LabelStar from '../Misc/LabelComponent/LabelStar'

import './DSBlockDetailsPage.css'

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
    setIsLoading(true)
    if (!dataService) return
    
    let latestDSBlockNum: number
    let receivedData: DsBlockObj
    let minerInfo: MinerInfo
    const getData = async () => {
      try {
        if (isNaN(blockNum))
          throw new Error('Not a valid block number')
        receivedData = await dataService.getDSBlockDetails(blockNum)
        latestDSBlockNum = await dataService.getNumDSBlocks()
        try { // wrapped in another try catch because it is optional
          minerInfo = await dataService.getMinerInfo(blockNum)
        } catch (e) { console.log(e) }
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
    {isLoading ? <div className='center-spinner'><Spinner animation="border" /></div> : null}
    {error
      ? <NotFoundPage />
      : data && (
        <>
          <div className='dsblock-header'>
            <h3 className='mb-1'>
              <span className='mr-1'>
                <FontAwesomeIcon className='fa-icon' icon={faCubes} />
              </span>
              <span className='ml-2'>
                DS Block
              </span>
              {' '}
              <span className='subtext'>#{data.header.BlockNum}</span>
              <LabelStar type='DS Block' />
            </h3>
            <span>
              <QueryPreservingLink
                className={parseInt(data.header.BlockNum) === 0
                  ? 'disabled mr-3' : 'mr-3'}
                to={`/dsbk/${parseInt(data.header.BlockNum) - 1}`}>
                <FontAwesomeIcon size='2x' className='fa-icon' icon={faCaretSquareLeft} />
              </QueryPreservingLink>
              <QueryPreservingLink
                className={latestDSBlockNum && parseInt(data.header.BlockNum) === latestDSBlockNum - 1 ? 'disabled' : ''}
                to={`/dsbk/${parseInt(data.header.BlockNum) + 1}`}>
                <FontAwesomeIcon size='2x' className='fa-icon' icon={faCaretSquareRight} />
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
                        <QueryPreservingLink to={`/address/${pubKeyToZilAddr(data.header.LeaderPubKey)}`}>
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
                      <span className='dsblock-signature'>{data.signature}</span>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
          {data.header.PoWWinners.length > 0 && (
            <Card className='dsblock-details-card'>
              <Card.Body>
                <Container className='mono'>
                  <h6 className='mb-2'>PoW Winners</h6>
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
                        <Container className='mono'>
                          <Row className='justify-content-between'>
                            <span>DS Committee</span>
                            <span>Total: <strong>{minerInfo.dscommittee.length}</strong></span>
                          </Row>
                          <Row className='justify-content-center'>
                            {minerInfo.dscommittee.length > 0
                              ? <MinerTable addresses={minerInfo.dscommittee} />
                              : <span className='my-3'>No addresses to show</span>
                            }
                          </Row>
                        </Container>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card className='miner-card ml-auto'>
                      <Card.Body>
                        <Container className='mono'>
                          <Row className='justify-content-between'>
                            <Col>
                              <span>Shard {currShardIdx + 1} of {minerInfo.shards.length}</span>
                            </Col>
                            <Col className='text-center shard-toggle'>
                              <span>
                                <FontAwesomeIcon size='2x'
                                  cursor='pointer'
                                  onClick={currShardIdx === 0 ? undefined : () => (setCurrShardIdx(currShardIdx - 1))}
                                  className={currShardIdx === 0 ? 'disabled' : ''} icon={faAngleLeft} />
                                <FontAwesomeIcon size='2x'
                                  cursor='pointer'
                                  onClick={currShardIdx === minerInfo.shards.length - 1 ? undefined : () => (setCurrShardIdx(currShardIdx + 1))}
                                  className={currShardIdx === minerInfo.shards.length - 1 ? 'disabled ml-3' : 'ml-3'} icon={faAngleRight} />
                              </span>
                            </Col>
                            <Col className='text-right'>
                              <span>
                                Total:
                                {' '}
                                <strong>{minerInfo.shards[currShardIdx].nodes.length}</strong>
                              </span>
                            </Col>
                          </Row>
                          <Row className='justify-content-center'>
                            {minerInfo.shards[currShardIdx].nodes.length > 0
                              ? <MinerTable addresses={minerInfo.shards[currShardIdx].nodes} />
                              : <span className='my-3'>No addresses to show</span>
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
              <FontAwesomeIcon icon={showMore ? faAngleUp : faAngleDown} size='2x' className='fa-icon' />
            </Row>
          </Container>
        </>
      )}
  </>
}

export default DSBlockDetailsPage

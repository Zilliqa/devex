import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'
import { BlockchainInfo } from '@zilliqa-js/core/src/types'
import { refreshRate } from 'src/constants'

import './BCInfo.css'

const BCInfo: React.FC = () => {
  const networkContext = useContext(NetworkContext)
  const { dataService, nodeUrl } = networkContext!

  const [data, setData] = useState<BlockchainInfo | null>(null)

  useEffect(() => { setData(null) }, [nodeUrl]) // Unset data on url change

  // Fetch data
  useEffect(() => {
    let isCancelled = false
    if (!dataService) return

    let receivedData: BlockchainInfo
    const getData = async () => {
      try {
        receivedData = await dataService.getBlockchainInfo()
        if (!isCancelled && receivedData)
          setData(receivedData)
      } catch (e) {
        if (!isCancelled)
          console.log(e)
      }
    }
    getData()
    const getDataTimer = setInterval(async () => {
      await getData()
    }, refreshRate);
    return () => {
      isCancelled = true
      clearInterval(getDataTimer)
    }
  }, [dataService])

  return <>
    <Card className='bcstats-card'>
      <Card.Header>
        <span>Blockchain Info</span>
      </Card.Header>
      <Card.Body>
        {data
          ? <Container>
            <Row style={{ marginBottom: '1rem' }}>
              <Col>
                <span className='bcstats-header'>DS Block Height:</span>
                <br />
                <span>{data.NumDSBlocks}</span>
              </Col>
              <Col>
                <span className='bcstats-header'>TX Block Height:</span>
                <br />
                <span>{data.NumTxBlocks}</span>
              </Col>
              <Col>
                <span className='bcstats-header'>Peers:</span>
                <br />
                <span>{data.NumPeers}</span>
              </Col>
              <Col>
                <span className='bcstats-header'>Number of Transactions:</span>
                <br />
                <span>{data.NumTransactions}</span>
              </Col>
            </Row>
            <Row>
              <Col>
                <span className='bcstats-header'>TPS:</span>
                <br />
                <span>{data.TransactionRate}</span>
              </Col>
              <Col>
                <span className='bcstats-header'>Number of Txns in DS Epoch:</span>
                <br />
                <span>{data.NumTxnsDSEpoch}</span>
              </Col>
              <Col>
                <span className='bcstats-header'>Number of Txns in Txn Epoch:</span>
                <br />
                <span>{data.NumTxnsTxEpoch}</span>
              </Col>
              <Col></Col>
            </Row>
          </Container>
          : <Spinner animation="border" role="status" />
        }
      </Card.Body>
    </Card>
  </>
}

export default BCInfo

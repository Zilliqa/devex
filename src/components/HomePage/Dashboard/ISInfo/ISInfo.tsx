/*
Not Used:
CreateTransaction
IncreaseBlocknum
SetMinimumGasPrice
GetNetworkID

Home:
GetBlocknum
GetMinimumGasPrice

Contract Pages:
GetSmartContractSubState
GetSmartContractCode
GetSmartContractInit

Account Pages:
GetBalance
GetSmartContracts

Tx Block Pages:
GetTransactionForTxBlock

Transaction Pages:
GetTransaction
GetRecentTransactions
*/

import React, { useState, useEffect, useContext } from 'react'
import { Spinner, Card, Container, Row, Col } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'

import './ISInfo.css'
import { QueryPreservingLink } from 'src'

const ISInfo: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [data, setData] = useState<any>(null)

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let receivedData: any
    const getData = async () => {
      try {
        receivedData = await dataService.getISInfo()
        if (receivedData)
          setData(receivedData)
      } catch (e) {
        console.log(e)
      }
    }
    getData()
    // Run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>
    <Container style={{ padding: 0 }}>
      <Row>
        <Col>
          <Card className='isinfo-card'>
            <Card.Body>
              {data
                ? <div className='isinfo-detail'>
                  <span>Latest Tx Block:</span>
                  <QueryPreservingLink to={`/txbk/${data.blockNum}`}>{data.blockNum}</QueryPreservingLink>
                </div>
                : <div><Spinner animation="border" role="status" /></div>
              }
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='isinfo-card'>
            <Card.Body>
              {data
                ? <div className='isinfo-detail'>
                  <span>Minimum Gas Price:</span>
                  <span>{data.minGasPrice}</span>
                </div>
                : <div><Spinner animation="border" role="status" /></div>
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

  </>
}

export default ISInfo

import React, { useState, useEffect, useContext } from 'react'
import { Spinner, Card, Container, Row, Col } from 'react-bootstrap'

import { QueryPreservingLink } from 'src/services/network/networkProvider'
import { NetworkContext } from 'src/services/network/networkProvider'
import { IISInfo } from 'src/typings/api'

import './ISInfo.css'

const ISInfo: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [data, setData] = useState<IISInfo | null>(null)

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let receivedData: IISInfo
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
  }, [dataService])

  return <>
    <Container className='p-0'>
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

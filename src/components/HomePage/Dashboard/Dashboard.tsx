import React, { useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import { NetworkContext } from 'src/services/network/networkProvider'

import BCInfo from './BCInfo/BCInfo'
import DSBlockList from './DSBlockList/DSBlockList'
import TxBlockList from './TxBlockList/TxBlockList'
import ValTxnList from './ValTxnList/ValTxnList'
// import PendTxnList from './PendTxnList/PendTxnList'

import './Dashboard.css'
import ISInfo from './ISInfo/ISInfo'

/*
              Dashboard Layout
    +++++++++++++++++++++++++++++++++++++
    |           BC Information          |
    +++++++++++++++++++++++++++++++++++++
    |  DS Blocks List | Tx Blocks List  |
    +++++++++++++++++++++++++++++++++++++
    |            ValTxnList             |
    +++++++++++++++++++++++++++++++++++++
    |            PendTxnList            |
    +++++++++++++++++++++++++++++++++++++
*/
const Dashboard: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { isIsolatedServer } = networkContext!

  return (
    <div>
      {isIsolatedServer
        ? <>
          <Container className='dashboard-container'>
            <Row>
              <ISInfo />
            </Row>
            <Row>
              <Col className='p-0'>
                <ValTxnList />
              </Col>
            </Row>
          </Container>
        </>
        : <>
          <Container className='dashboard-container'>
            <Row>
              <BCInfo />
            </Row>
            <Row>
              <Col className='p-0' sm={5} md={5} lg={5}>
                <DSBlockList />
              </Col>
              <Col className='p-0 ml-4'>
                <TxBlockList />
              </Col>
            </Row>
            <Row className='mt-3'>
              <Col className='p-0'>
                <ValTxnList />
              </Col>
            </Row>
            {/* <Row className='mt-3'>
              <Col className='p-0'>
                <PendTxnList />
              </Col>
            </Row> */}
          </Container>
        </>
      }
    </div>
  )
}

export default Dashboard

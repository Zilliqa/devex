import React, { useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'

import BCInfo from './BCInfo/BCInfo'
import DSBlockList from './DSBlockList/DSBlockList'
import TxBlockList from './TxBlockList/TxBlockList'
import ValTxnList from './ValTxnList/ValTxnList'
import PendTxnList from './PendTxnList/PendTxnList'

import './Dashboard.css'
import ISInfo from './ISInfo/ISInfo'

/*
              Dashboard Layout
    +++++++++++++++++++++++++++++++++++++
    |           BC Information          |
    +++++++++++++++++++++++++++++++++++++
    |  DS Blocks List | Tx Blocks List  |
    +++++++++++++++++++++++++++++++++++++
    |      ValTxnList     | PendTxnList |
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
              <Col style={{ padding: 0 }}>
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
              <Col style={{ padding: 0 }}>
                <DSBlockList />
              </Col>
              <Col style={{ padding: '0 0 0 1rem' }}>
                <TxBlockList />
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem' }}>
              <Col style={{ padding: 0 }}>
                <ValTxnList />
              </Col>
            </Row>
            <Row style={{ marginTop: '1rem' }}>
              <Col style={{ padding: 0 }}>
                <PendTxnList />
              </Col>
            </Row>
          </Container>
        </>
      }
    </div>
  )
}

export default Dashboard

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import BCInfo from './BCInfo/BCInfo';
import DSBlockList from './DSBlockList/DSBlockList';
import TxBlockList from './TxBlockList/TxBlockList';
import ValTxnList from './ValTxnList/ValTxnList';
import PendTxnList from './PendTxnList/PendTxnList';

/*
         Dashboard Layout
    +++++++++++++++++++++++++++++++++++++
    |           BC Information          |
    +++++++++++++++++++++++++++++++++++++
    |           DS Blocks List          |
    +++++++++++++++++++++++++++++++++++++
    |           Tx Blocks List         |
    +++++++++++++++++++++++++++++++++++++
    |      ValTxnList     | PendTxnList |
    +++++++++++++++++++++++++++++++++++++
*/
const Dashboard: React.FC = () => {
  return (
    <div>
      <Container>
        <Row>
          <BCInfo />
        </Row>
        <Row>
          <DSBlockList />
        </Row>
        <Row>
          <TxBlockList />
        </Row>
        <Row style={{ marginTop: '1rem' }}>
          <Col xs md lg={8} style={{ padding: 0 }}>
            <ValTxnList />
          </Col>
          <Col style={{ paddingRight: 0 }}>
            <PendTxnList />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;

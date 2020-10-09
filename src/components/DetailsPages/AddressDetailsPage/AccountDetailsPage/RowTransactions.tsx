import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  MutableRefObject,
} from "react";

import {
  Card,
  Container,
  Row,
  Col,
  Pagination,
  Spinner,
} from "react-bootstrap";

import { gql, useQuery } from "@apollo/client";

import "../AddressDetailsPage.css";

interface IProps {
  addr: string;
}

const RowTransactions: React.FC<IProps> = ({ addr }) => {
  const ACCOUNT_TRANSACTIONS = gql`
    query GetTransactions($addr: String!) {
      txnsByAddr(addr: $addr) {
        ID
      }
    }
  `;

  const { loading, error, data } = useQuery(ACCOUNT_TRANSACTIONS, {
    variables: { addr },
  });

  if (data) {
    console.log(data);
  }

  return loading ? (
    <div className="center-spinner">
      <Spinner animation="border" />
    </div>
  ) : (
    <Row>
      <Col>
        <div className="address-detail">
          <span>Transactions:</span>
          <span>{data.txnsByAddr.length}</span>
        </div>
      </Col>
    </Row>
  );
};

export default RowTransactions;

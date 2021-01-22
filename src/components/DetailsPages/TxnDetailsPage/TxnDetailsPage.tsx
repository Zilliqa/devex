import React, { useState, useEffect, useContext } from "react";
import { Card, Row, Col, Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

import HashDisp from "src/components/Misc/Disp/HashDisp/HashDisp";
import { QueryPreservingLink } from "src/services/network/networkProvider";
import { NetworkContext } from "src/services/network/networkProvider";
import { TransactionDetails } from "src/typings/api";
import { qaToZil, hexAddrToZilAddr } from "src/utils/Utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faExchangeAlt,
  faFileContract,
} from "@fortawesome/free-solid-svg-icons";

import InfoTabs, {
  generateTabsFromTxnDetails,
} from "../Misc/InfoTabs/InfoTabs";
import LabelStar from "../Misc/LabelComponent/LabelStar";
import NotFoundPage from "../../ErrorPages/NotFoundPage";
import ViewBlockLink from "../Misc/ViewBlockLink/ViewBlockLink";
import TransactionFlow from "./TransactionFlowNew";

import "./TxnDetailsPage.css";

const TxnDetailsPage: React.FC = () => {
  const { txnHash } = useParams();
  const networkContext = useContext(NetworkContext);
  const { dataService, networkUrl } = networkContext!;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TransactionDetails | null>(null);

  // Fetch data
  useEffect(() => {
    if (!dataService) return;

    let receivedData: TransactionDetails;
    const getData = async () => {
      try {
        setIsLoading(true);
        receivedData = await dataService.getTransactionDetails(txnHash);
        if (receivedData) {
          setData(receivedData);
        }
      } catch (e) {
        console.log(e);
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
    return () => {
      setData(null);
      setError(null);
    };
  }, [dataService, txnHash]);

  return (
    <>
      {isLoading ? (
        <div className="center-spinner">
          <Spinner animation="border" />
        </div>
      ) : null}
      {error ? (
        <NotFoundPage />
      ) : (
        data &&
        data.txn.txParams.receipt && (
          <>
            <div className="transaction-header">
              <h3 className="mb-1">
                <span className="mr-1">
                  {data.txn.txParams.receipt.success === undefined ||
                  data.txn.txParams.receipt.success ? (
                    <FontAwesomeIcon color="green" icon={faExchangeAlt} />
                  ) : (
                    <FontAwesomeIcon color="red" icon={faExclamationCircle} />
                  )}
                </span>
                <span className="ml-2">Transaction</span>
                <LabelStar type="Transaction" />
              </h3>
              <ViewBlockLink
                network={networkUrl}
                type="tx"
                identifier={data.hash}
              />
            </div>
            <div className="subtext">
              <HashDisp hash={"0x" + data.hash} />
            </div>
            <Card className="txn-details-card">
              <Card.Body>
                <Container>
                  <Row>
                    <Col>
                      <div className="txn-detail">
                        <span>From:</span>
                        <span>
                          <QueryPreservingLink
                            to={`/address/${hexAddrToZilAddr(
                              data.txn.senderAddress
                            )}`}
                          >
                            {hexAddrToZilAddr(data.txn.senderAddress)}
                          </QueryPreservingLink>
                        </span>
                      </div>
                    </Col>
                    <Col>
                      <div className="txn-detail">
                        <span>To:</span>
                        <span>
                          {data.contractAddr ? (
                            data.txn.txParams.receipt.success ? (
                              <QueryPreservingLink
                                to={`/address/${hexAddrToZilAddr(
                                  data.contractAddr
                                )}`}
                              >
                                <FontAwesomeIcon
                                  color="darkturquoise"
                                  icon={faFileContract}
                                />{" "}
                                {hexAddrToZilAddr(data.contractAddr)}
                              </QueryPreservingLink>
                            ) : (
                              <QueryPreservingLink
                                to={`/address/${hexAddrToZilAddr(
                                  data.txn.txParams.toAddr
                                )}`}
                              >
                                {hexAddrToZilAddr(data.txn.txParams.toAddr)}
                              </QueryPreservingLink>
                            )
                          ) : (
                            <QueryPreservingLink
                              to={`/address/${hexAddrToZilAddr(
                                data.txn.txParams.toAddr
                              )}`}
                            >
                              {hexAddrToZilAddr(data.txn.txParams.toAddr)}
                            </QueryPreservingLink>
                          )}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="txn-detail">
                        <span>Amount:</span>
                        <span>
                          {qaToZil(data.txn.txParams.amount.toString())}
                        </span>
                      </div>
                    </Col>
                    <Col>
                      <div className="txn-detail">
                        <span>Nonce:</span>
                        <span>{data.txn.txParams.nonce}</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="txn-detail">
                        <span>Gas Limit:</span>
                        <span>{data.txn.txParams.gasLimit.toString()}</span>
                      </div>
                    </Col>
                    <Col>
                      <div className="txn-detail">
                        <span>Gas Price:</span>
                        <span>
                          {qaToZil(data.txn.txParams.gasPrice.toString())}
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="txn-detail">
                        <span>Transaction Fee:</span>
                        <span>
                          {qaToZil(
                            Number(data.txn.txParams.gasPrice) *
                              data.txn.txParams.receipt!.cumulative_gas
                          )}
                        </span>
                      </div>
                    </Col>
                    <Col>
                      <div className="txn-detail">
                        <span>Transaction Block:</span>
                        <span>
                          <QueryPreservingLink
                            to={`/txbk/${data.txn.txParams.receipt.epoch_num}`}
                          >
                            {data.txn.txParams.receipt.epoch_num}
                          </QueryPreservingLink>
                        </span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="txn-detail">
                        <span>Success:</span>
                        <span>{`${data.txn.txParams.receipt.success}`}</span>
                      </div>
                    </Col>
                    {data.txn.txParams.receipt.accepted !== undefined && (
                      <Col>
                        <div className="txn-detail">
                          <span>Accepts $ZIL:</span>
                          <span>{`${data.txn.txParams.receipt.accepted}`}</span>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Container>
              </Card.Body>
            </Card>
            <TransactionFlow hash={txnHash} txn={data.txn} />
            <InfoTabs tabs={generateTabsFromTxnDetails(data)} />
          </>
        )
      )}
    </>
  );
};

export default TxnDetailsPage;

import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Pagination,
  Spinner,
} from "react-bootstrap";

import AddressDisp from "src/components/Misc/Disp/AddressDisp/AddressDisp";
import { NetworkContext } from "src/services/network/networkProvider";
import { AccData } from "src/typings/api";
import { qaToZil, zilAddrToHexAddr } from "src/utils/Utils";
import { ContractObj } from "@zilliqa-js/contract/src/types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";

import AccContractCard from "./AccContractCard";
import LabelStar from "../../Misc/LabelComponent/LabelStar";
import ViewBlockLink from "../../Misc/ViewBlockLink/ViewBlockLink";

import TransactionsCard from "../Transactions/TransactionsCard";

import { useQuery, gql } from "@apollo/client";

import "../AddressDetailsPage.css";

interface IProps {
  addr: string;
}

const AccountDetailsPage: React.FC<IProps> = ({ addr }) => {
  const networkContext = useContext(NetworkContext);
  const { dataService, networkUrl } = networkContext!;

  const addrRef = useRef(addr);
  const [isLoading, setIsLoading] = useState(false);
  const [accData, setAccData] = useState<AccData | null>(null);
  const [accContracts, setAccContracts] = useState<ContractObj[] | null>(null);
  const [contractPageIndex, setContractPageIndex] = useState<number>(0);

  const generatePagination = useCallback(
    (currentPage: number, pageCount: number, delta = 2) => {
      const separate = (a: number, b: number, isLower: boolean) => {
        const temp = b - a;
        if (temp === 0) return [a];
        else if (temp === 1) return [a, b];
        else if (temp === 2) return [a, a + 1, b];
        else return [a, isLower ? -1 : -2, b];
      };

      return Array(delta * 2 + 1)
        .fill(0)
        .map((_, index) => currentPage - delta + index)
        .filter((page) => 0 < page && page <= pageCount)
        .flatMap((page, index, { length }) => {
          if (!index) {
            return separate(1, page, true);
          }
          if (index === length - 1) {
            return separate(page, pageCount, false);
          }
          return [page];
        });
    },
    []
  );

  const ACCOUNT_TRANSACTIONS = gql`
    {
      txnsByAddr(addr: "${zilAddrToHexAddr(addrRef.current)}") {
        ID
        receipt {
          success
        }
        from
        toAddr
        amount
      }
    }
  `;

  const { loading, error, data: accTransactions } = useQuery(
    ACCOUNT_TRANSACTIONS
  );

  if (error) {
    console.log(error);
  }

  // Fetch data
  useEffect(() => {
    if (!dataService) return;

    let accData: AccData;
    let accContracts: ContractObj[];
    const getData = async () => {
      try {
        setIsLoading(true);
        accData = await dataService.getAccData(addrRef.current);
        accContracts = await dataService.getAccContracts(addrRef.current);
        if (accData) setAccData(accData);
        if (accContracts) setAccContracts(accContracts);
      } catch (e) {
        console.log(e);
        setAccData({
          balance: "0",
          nonce: "-",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [dataService]);

  return (
    <>
      {isLoading ? (
        <div className="center-spinner">
          <Spinner animation="border" />
        </div>
      ) : null}
      {accData && (
        <>
          <div className="address-header">
            <h3 className="mb-1">
              <span className="mr-1">
                <FontAwesomeIcon className="fa-icon" icon={faWallet} />
              </span>
              <span className="ml-2">Account</span>
              <LabelStar type="Account" />
            </h3>
            <ViewBlockLink
              network={networkUrl}
              type="address"
              identifier={addrRef.current}
            />
          </div>
          <div className="subtext">
            <AddressDisp isLinked={false} addr={addrRef.current} />
          </div>
          <Card className="address-details-card">
            <Card.Body>
              <Container>
                <Row>
                  <Col>
                    <div className="address-detail">
                      <span>Balance:</span>
                      <span>{qaToZil(accData.balance)}</span>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="address-detail">
                      <span>Nonce:</span>
                      <span>{accData.nonce}</span>
                    </div>
                  </Col>
                </Row>
                {accTransactions ? (
                  <Row>
                    <Col>
                      <div className="address-detail">
                        <span>Transactions:</span>
                        <span>{accTransactions.txnsByAddr.length}</span>
                      </div>
                    </Col>
                  </Row>
                ) : null}
              </Container>
            </Card.Body>
          </Card>

          <TransactionsCard addr={addrRef.current} />

          {accContracts && accContracts.length > 0 && (
            <>
              <Card className="address-details-card">
                <Card.Header>
                  <div className="dsblock-card-header">
                    <span>Deployed Contracts</span>
                  </div>
                </Card.Header>
                <div className="d-flex justify-content-between">
                  <span className="num-contracts">
                    Total: {accContracts.length}{" "}
                    {accContracts.length === 1 ? "contract" : "contracts"}
                  </span>
                  <Pagination className="contract-pagination">
                    <Pagination.Prev
                      onClick={() =>
                        setContractPageIndex(
                          (contractPageIndex) => contractPageIndex - 1
                        )
                      }
                      disabled={contractPageIndex === 0}
                    />
                    {generatePagination(
                      contractPageIndex,
                      Math.ceil(accContracts.length / 10)
                    ).map((page) => {
                      if (page === -1)
                        return (
                          <Pagination.Ellipsis
                            key={page}
                            onClick={() =>
                              setContractPageIndex(
                                (contractPageIndex) => contractPageIndex - 5
                              )
                            }
                          />
                        );
                      else if (page === -2)
                        return (
                          <Pagination.Ellipsis
                            key={page}
                            onClick={() =>
                              setContractPageIndex(
                                (contractPageIndex) => contractPageIndex + 5
                              )
                            }
                          />
                        );
                      else if (page === contractPageIndex + 1)
                        return (
                          <Pagination.Item key={page} active>
                            {page}
                          </Pagination.Item>
                        );
                      else
                        return (
                          <Pagination.Item
                            key={page}
                            onClick={() => setContractPageIndex(page - 1)}
                          >
                            {page}
                          </Pagination.Item>
                        );
                    })}
                    <Pagination.Next
                      onClick={() =>
                        setContractPageIndex(
                          (contractPageIndex) => contractPageIndex + 1
                        )
                      }
                      disabled={
                        contractPageIndex ===
                        Math.ceil(accContracts.length / 10) - 1
                      }
                    />
                  </Pagination>
                </div>
                <Card.Body>
                  {accContracts
                    .slice(10 * contractPageIndex, 10 * contractPageIndex + 10)
                    .map((contract: ContractObj, index: number) => {
                      return (
                        <AccContractCard
                          key={10 * contractPageIndex + index}
                          contract={contract}
                          index={10 * contractPageIndex + index}
                        />
                      );
                    })}
                </Card.Body>
              </Card>
            </>
          )}
        </>
      )}
    </>
  );
};

export default AccountDetailsPage;

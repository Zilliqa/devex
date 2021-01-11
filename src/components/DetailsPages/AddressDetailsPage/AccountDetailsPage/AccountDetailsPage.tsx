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
import { useQuery, gql } from "@apollo/client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";

import AccContractCard from "./AccContractCard";
import LabelStar from "../../Misc/LabelComponent/LabelStar";
import ViewBlockLink from "../../Misc/ViewBlockLink/ViewBlockLink";
import TransactionsCard from "../Transactions/TransactionsCard";

import "../AddressDetailsPage.css";

interface IProps {
  addr: string;
}

const AccountDetailsPage: React.FC<IProps> = ({ addr }) => {
  const networkContext = useContext(NetworkContext);
  const { dataService, networkUrl, apolloUrl } = networkContext!;

  const addrRef = useRef(addr);
  const [isLoading, setIsLoading] = useState(false);
  const [accData, setAccData] = useState<AccData | null>(null);
  const [accContracts, setAccContracts] = useState<ContractObj[] | null>(null);
  const [contractPageIndex, setContractPageIndex] = useState<number>(0);
  const [transactionsCount, setTransactionsCount] = useState<number>(0);

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

  const ACCOUNT_TRANSACTIONS = gql`
    query GetTransactions($addr: String!, $page: Int) {
      txPagination(
        page: $page
        filter: {
          OR: [
            { fromAddr: $addr }
            { toAddr: $addr }
            { receipt: { transitions: { addr: $addr } } }
            { receipt: { transitions: { msg: { _recipient: $addr } } } }
          ]
        }
        sort: TIMESTAMP_DESC
      ) {
        count
        items {
          ID
          receipt {
            success
            cumulative_gas
            transitions {
              addr
              msg {
                _recipient
              }
            }
          }
          gasPrice
          gasLimit
          fromAddr
          toAddr
          amount
          timestamp
          type
        }
        pageInfo {
          currentPage
          perPage
          pageCount
          itemCount
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `;

  const hexAddr = zilAddrToHexAddr(addr);

  const {
    loading: transactionsLoading,
    error,
    data: txData,
    fetchMore,
  } = useQuery(ACCOUNT_TRANSACTIONS, {
    variables: { addr: hexAddr, page: 1 },
    context: {
      uri: apolloUrl,
    },
    fetchPolicy: "cache-and-network",
  });

  if (txData && transactionsCount !== txData.txPagination.count) {
    setTransactionsCount(txData.txPagination.count);
  }

  const localFetch = (page: Number) => {
    return fetchMore({
      variables: {
        page,
      },
      updateQuery: (prev: any, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult;
      },
    });
  };

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
                <Row>
                  <Col>
                    <div className="address-detail">
                      <span>Transactions:</span>
                      <span>{transactionsCount}</span>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>

          <h4 className="py-2">Transactions</h4>
          <div className="row align-items-center mb-0">
            <div className="col subtext">
              Items Per Page: <strong>20</strong>
            </div>
            <div className="col">
              {txData && txData.txPagination ? (
                <Pagination className="justify-content-end">
                  <Pagination.Prev
                    onClick={() =>
                      localFetch(txData.txPagination.pageInfo.currentPage - 1)
                    }
                    disabled={!txData.txPagination.pageInfo.hasPreviousPage}
                  />
                  {generatePagination(
                    txData.txPagination.pageInfo.currentPage + 1,
                    txData.txPagination.pageInfo.pageCount
                  ).map((page) => {
                    if (page === -1)
                      return (
                        <Pagination.Ellipsis
                          key={page}
                          onClick={() =>
                            localFetch(
                              txData.txPagination.pageInfo.currentPage - 5
                            )
                          }
                        />
                      );
                    else if (page === -2)
                      return (
                        <Pagination.Ellipsis
                          key={page}
                          onClick={() =>
                            localFetch(
                              txData.txPagination.pageInfo.currentPage + 5
                            )
                          }
                        />
                      );
                    else if (page === txData.txPagination.pageInfo.currentPage)
                      return (
                        <Pagination.Item key={page} active>
                          {page}
                        </Pagination.Item>
                      );
                    else
                      return (
                        <Pagination.Item
                          key={page}
                          onClick={() => localFetch(Number(page))}
                        >
                          {page}
                        </Pagination.Item>
                      );
                  })}
                  <Pagination.Next
                    onClick={() =>
                      localFetch(txData.txPagination.pageInfo.currentPage + 1)
                    }
                    disabled={!txData.txPagination.pageInfo.hasNextPage}
                  />
                </Pagination>
              ) : null}
            </div>
          </div>
          <Card className="txblock-card mt-0 mb-4">
            <Card.Body>
              {transactionsLoading ? (
                <div className="center-spinner">
                  <Spinner animation="border" />
                </div>
              ) : null}
              {txData && txData.txPagination ? (
                <TransactionsCard
                  transactions={txData.txPagination.items}
                  addr={addrRef.current}
                />
              ) : null}
              {error ? "Error while loading transactions" : null}
            </Card.Body>
          </Card>

          {accContracts && accContracts.length > 0 && (
            <>
              <h4 className="py-2">Deployed Contracts</h4>
              <Card className="address-details-card">
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

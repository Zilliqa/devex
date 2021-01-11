import React, {
  useState,
  useCallback,
  useContext
} from "react";


import { Value } from "@zilliqa-js/contract/src/types";
import { NetworkContext } from "src/services/network/networkProvider";

import { zilAddrToHexAddr } from "src/utils/Utils";
import { useQuery, gql } from "@apollo/client";
import TransactionsCard from "../Transactions/TransactionsCard";
import { Spinner, Pagination } from "react-bootstrap";

interface IProps {
  initParams: Value[];
  contractAddr: any;
  onTransactionsCount: Function;
  fungibleToken: any;
}

const ContractTransactionsTab: React.FC<IProps> = ({
  contractAddr,
  onTransactionsCount,
  fungibleToken,
}) => {
  const [transactionsCount, setTransactionsCount] = useState<number>(0);

  const networkContext = useContext(NetworkContext);
  const { apolloUrl } = networkContext!;

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

  const hexAddr = zilAddrToHexAddr(contractAddr);

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
    onTransactionsCount(txData.txPagination.count);
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
    <div>
      {transactionsLoading ? (
        <div className="center-spinner">
          <Spinner animation="border" />
        </div>
      ) : null}
      {txData && txData.txPagination ? (
        <>
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
          <TransactionsCard
            transactions={txData.txPagination.items}
            fungibleToken={fungibleToken}
            addr={contractAddr}
          />
        </>
      ) : null}
      {error ? "Error while loading transactions" : null}
    </div>
  );
};

export default ContractTransactionsTab;

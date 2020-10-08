import React, { useMemo } from "react";
import { OverlayTrigger, Tooltip, Card, Spinner } from "react-bootstrap";

import { QueryPreservingLink } from "src/services/network/networkProvider";

import { useQuery, gql } from "@apollo/client";

import {
  qaToZil,
  hexAddrToZilAddr,
  zilAddrToHexAddr,
  stripHexPrefix,
} from "src/utils/Utils";

import ToAddrDispSimplified from "src/components/Misc/Disp/ToAddrDisp/ToAddrDispSimplified";
import DisplayTable from "src/components/HomePage/Dashboard/DisplayTable/DisplayTable";

import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  addr: string | null;
}

const TransactionsCard: any = ({ addr }: { addr: string }) => {
  const hexAddress = stripHexPrefix(zilAddrToHexAddr(addr)).toLowerCase();

  const ACCOUNT_TRANSACTIONS = gql`
    {
      txnsByAddr(addr: "${hexAddress}") {
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

  const columns = useMemo(
    () => [
      {
        id: "from-col",
        Header: "From",
        accessor: "from",
        Cell: ({ value }: { value: string }) => {
          const ziladdr = hexAddrToZilAddr(value);
          return (
            <>
              {addr === ziladdr ? (
                addr
              ) : (
                <QueryPreservingLink to={`/address/${ziladdr}`}>
                  {ziladdr}
                </QueryPreservingLink>
              )}
            </>
          );
        },
      },
      {
        id: "to-col",
        Header: "To",
        Cell: ({ row }: { row: any }) => {
          return (
            <ToAddrDispSimplified
              ownAddress={addr}
              txnDetails={{
                txn: row.original,
                hash: row.original.ID,
                toAddr: row.original.toAddr,
              }}
            />
          );
        },
      },
      {
        id: "hash-col",
        Header: "Hash",
        accessor: "hash",
        Cell: ({ row }: { row: any }) => {
          return (
            <QueryPreservingLink to={`/tx/0x${row.original.ID}`}>
              <div className="text-right mono">
                {row.original.receipt && !row.original.receipt.success && (
                  <FontAwesomeIcon
                    className="mr-1"
                    icon={faExclamationCircle}
                    color="red"
                  />
                )}
                {"0x" + row.original.ID}
              </div>
            </QueryPreservingLink>
          );
        },
      },
      {
        id: "amount-col",
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }: { value: string }) => (
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip id={"amt-tt"}>{qaToZil(value)}</Tooltip>}
          >
            <div className="text-right sm">{qaToZil(value, 13)}</div>
          </OverlayTrigger>
        ),
      },
      {
        id: "fee-col",
        Header: "Fee",
        accessor: "receipt",
        Cell: ({ value }: { value: { cumulative_gas: string } }) => {
          const fee = parseFloat(value.cumulative_gas) * 1000000;
          return (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={"fee-tt"}>{qaToZil(fee)}</Tooltip>}
            >
              <div className="text-center sm">{qaToZil(fee, 4)}</div>
            </OverlayTrigger>
          );
        },
      },
    ],
    [addr]
  );

  const { loading, error, data: queryData } = useQuery(ACCOUNT_TRANSACTIONS);

  if (error) {
    console.log(error);
  }

  return (
    <Card className="txblock-card">
      <Card.Header>
        <div className="dsblock-card-header">
          <span>Transactions</span>
        </div>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <Spinner animation="border" role="status" />
        ) : (
          <DisplayTable columns={columns} data={queryData.txnsByAddr} />
        )}
        {error ? <div>{error.message}</div> : null}
      </Card.Body>
    </Card>
  );
};

export default TransactionsCard;

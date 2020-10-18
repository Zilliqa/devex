import React, { useMemo, useState } from "react";
import { OverlayTrigger, Tooltip, Card, Spinner } from "react-bootstrap";

import { QueryPreservingLink } from "src/services/network/networkProvider";

import { qaToZil, hexAddrToZilAddr } from "src/utils/Utils";

import ToAddrDispSimplified from "src/components/Misc/Disp/ToAddrDisp/ToAddrDispSimplified";
import DisplayTable from "src/components/HomePage/Dashboard/DisplayTable/DisplayTable";

import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  transactions: [];
  fungibleToken?: any;
  addr: string;
}

const TransactionsCard: React.FC<IProps> = ({
  transactions: txs,
  addr,
  fungibleToken,
}) => {
  const transactions: any[] = txs.flatMap(
    (tx: { receipt: { transitions: [] } }) => {
      if (fungibleToken && tx.receipt.transitions.length) {
        console.log(tx.receipt.transitions)
        const tokenTx: any | undefined = tx.receipt.transitions.find(
          (transition: { msg: { _tag: string } }) =>
            transition.msg._tag === "TransferSuccessCallBack"
        );

        if (tokenTx !== undefined) {
          const toAddr = tokenTx.msg.params.find(
            (p: any) => p.vname === "recipient"
          );
          const fromAddr = tokenTx.msg.params.find(
            (p: any) => p.vname === "sender"
          );
          const amount = tokenTx.msg.params.find(
            (p: any) => p.vname === "amount"
          );
          return [
            { ...tx },
            {
              ...tx,
              ID: "token-transfer",
              toAddr: toAddr.value,
              fromAddr: fromAddr.value,
              amount: amount.value,
              type: "token-transfer",
              fungibleToken,
            },
          ];
        }
      }
      return {
        ...tx,
      };
    }
  );

  const columns = useMemo(
    () => [
      {
        id: "from-col",
        Header: "From",
        accessor: "fromAddr",
        Cell: ({ value }: { value: string }) => {
          const ziladdr = hexAddrToZilAddr(value);
          return (
            <>
              {addr === ziladdr ? (
                <span className="text-muted">{addr}</span>
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
              fromAddr={row.original.fromAddr}
              toAddr={row.original.toAddr}
              txType={row.original.type}
              addr={addr}
            />
          );
        },
      },
      {
        id: "hash-col",
        Header: "Hash",
        accessor: "hash",
        Cell: ({ row }: { row: any }) => {
          return row.original.ID !== "token-transfer" ? (
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
          ) : (
            `${fungibleToken.name.value} Transfer`
          );
        },
      },
      {
        id: "amount-col",
        Header: "Amount",
        Cell: ({ row }: any) => {
          const value = row.original.amount;
          let formattedValue: string = qaToZil(value);

          if (row.original.ID === "token-transfer") {
            formattedValue =
              value / Math.pow(10, parseInt(fungibleToken.decimals.value)) +
              ` ${fungibleToken.symbol.value}`;
          }
          return (
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip id={"amt-tt"}>{value}</Tooltip>}
            >
              <div className="text-right sm">{formattedValue}</div>
            </OverlayTrigger>
          );
        },
      },
      {
        id: "fee-col",
        Header: "Fee",
        Cell: ({ row }: any) => {
          const fee =
            parseFloat(row.original.receipt.cumulative_gas) *
            row.original.gasPrice;
          return (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={"fee-tt"}>{fee} Qa</Tooltip>}
            >
              <div className="text-center sm">{qaToZil(fee, 4)}</div>
            </OverlayTrigger>
          );
        },
      },
    ],
    [addr]
  );

  return (
    <div>
      <DisplayTable columns={columns} data={transactions} />
    </div>
  );
};

export default TransactionsCard;

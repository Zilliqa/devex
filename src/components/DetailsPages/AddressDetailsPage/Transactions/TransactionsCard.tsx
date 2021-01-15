import React, { useMemo } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { QueryPreservingLink } from "src/services/network/networkProvider";

import { qaToZilSimplified, qaToZil, hexAddrToZilAddr } from "src/utils/Utils";
import numbro from "numbro";

import ToAddrDispSimplified from "src/components/Misc/Disp/ToAddrDisp/ToAddrDispSimplified";
import DisplayTable from "src/components/HomePage/Dashboard/DisplayTable/DisplayTable";
import TypeDisplay from "./TypeDisplay";
import AgeDisplay from "./AgeDisplay";

import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./TransactionsCard.css";

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
        console.log(tx.receipt.transitions);
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
        id: "alert-col",
        Header: "",
        Cell: ({ row }: { row: any }) => {
          return (
            <div className="d-flex align-items-center justify-content-start">
              {row.original.receipt && !row.original.receipt.success && (
                <FontAwesomeIcon icon={faExclamationCircle} color="red" />
              )}
              <AgeDisplay className="ml-2" timestamp={row.original.timestamp} />
            </div>
          );
        },
      },
      {
        id: "hash-col",
        Header: "Hash",
        accessor: "hash",
        Cell: ({ row }: { row: any }) => {
          return row.original.ID !== "token-transfer" ? (
            <QueryPreservingLink
              to={`/tx/0x${row.original.ID}`}
              className="d-flex"
            >
              <div className="text-right mono ellipsis">
                {"0x" + row.original.ID}
              </div>
            </QueryPreservingLink>
          ) : (
            `${fungibleToken.name.value} Transfer`
          );
        },
      },
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
        id: "type-col",
        Header: "",
        Cell: ({ row }: { row: any }) => {
          console.log(row.original);
          return (
            <>
              <TypeDisplay
                fromAddr={row.original.fromAddr}
                toAddr={row.original.toAddr}
                addr={addr}
                type={row.original.type}
              />
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
        id: "amount-col",
        Header: "Amount",
        Cell: ({ row }: any) => {
          const value = row.original.amount;
          let formattedValue: string =
            numbro(qaToZilSimplified(value)).format({
              thousandSeparated: true,
              mantissa: 3,
            }) + " ZIL";

          if (row.original.ID === "token-transfer") {
            formattedValue =
              value / Math.pow(10, parseInt(fungibleToken.decimals.value)) +
              ` ${fungibleToken.symbol.value}`;
          }
          return (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={"amt-tt"}>
                  {numbro(value).format({ thousandSeparated: true })}
                </Tooltip>
              }
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

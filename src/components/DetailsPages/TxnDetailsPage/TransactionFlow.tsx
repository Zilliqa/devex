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
import {
  qaToZil,
  zilAddrToHexAddr,
  hexAddrToZilAddr,
  stripHexPrefix,
} from "src/utils/Utils";
import { ContractObj } from "@zilliqa-js/contract/src/types";
import { useQuery, gql } from "@apollo/client";

import TxBlock from "./TxBlock";

import "./TransactionFlow.css";

interface IProps {
  hash: string;
}

const TransactionFlow: React.FC<IProps> = ({ hash }) => {
  const [transaction, setTransaction] = useState<any>(undefined);
  const [transitions, setTransitions] = useState<any>(undefined);

  const ref: any = useRef<SVGElement>();

  const TRANSACTION_QUERY = gql`
    query GetTransaction($customId: String!) {
      txFindByCustomId(customId: $customId) {
        fromAddr
        toAddr
        amount
        receipt {
          event_logs {
            address
            _eventname
            params {
              vname
              type
              value
            }
          }
          transitions {
            accepted
            addr
            depth
            msg {
              _tag
              _amount
              _recipient
              params {
                vname
                type
                value
              }
            }
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(TRANSACTION_QUERY, {
    variables: { customId: stripHexPrefix(hash) },
    fetchPolicy: "cache-and-network",
  });

  if (
    data &&
    data.txFindByCustomId.length &&
    data.txFindByCustomId[0] !== transaction
  ) {
    setTransaction(data.txFindByCustomId[0]);
  }

  useEffect(() => {
    if (transaction && transaction.receipt.transitions.length) {
      const links: any = [
        {
          source: transaction.fromAddr,
          target: transaction.toAddr,
          amount: transaction.amount,
          index: 0,
        },
      ];

      const nodes: any = [
        {
          id: transaction.fromAddr,
        },
        {
          id: transaction.toAddr,
        },
      ];

      let ioo = 0;
      transaction.receipt.transitions.forEach((tr: any) => {
        ioo++;
        if (!nodes.find((node: any) => node.id === tr.addr)) {
          nodes.push({
            id: tr.addr,
          });
        }
        if (!nodes.find((node: any) => node.id === tr.msg._recipient)) {
          nodes.push({
            id: tr.msg._recipient,
          });
        }

        const events = transaction.receipt.event_logs.filter(
          (evv: any) => evv.address === tr.msg._recipient
        );

        links.push({
          source: tr.addr,
          target: tr.msg._recipient,
          data: { ...tr },
          index: ioo,
          events: events,
        });
      });

      const nest = (items: any, parent: any, nodes: any = []) => {
        const nested: any = [];

        Object.values(items).forEach((item: any) => {
          // parent can be a string or a number
          /* eslint-disable-next-line eqeqeq */
          if (item.source === parent) {
            nodes.push(item.source);

            if (!nodes.includes(item.target)) {
              const children: any = nest(items, item.target, nodes);

              if (children.length) {
                /* eslint-disable-next-line no-param-reassign */
                item.children = children;
              }
            }

            nested.push(item);
          }
        });

        return nested;
      };

      const tree = nest(links, transaction.fromAddr);

      if (links !== transitions) {
        console.log("----------");
        console.log("----------");
        console.log("----------");
        console.log(tree);
        console.log("----------");
        console.log("----------");
        console.log("----------");
        setTransitions(tree);
      }
    }
  }, [transaction]);

  const recursiveBlocks = (links: any, parent: any = undefined): any => {
    return links.map(
      (
        link: {
          children: any[];
          source: string;
          target: string;
          data?: { msg?: any };
          index?: any;
        },
        index: number
      ) => {
        return (
          <div className="d-flex align-items-center" key={index}>
            {link.index === 0 ? (
              <TxBlock
                link={{ ...link, index: -9 }}
                noDetails={true}
                parent={parent}
              />
            ) : null}

            <TxBlock link={link} parent={parent} />
            {link.children ? (
              <div className="children">
                {recursiveBlocks(link.children, link)}
              </div>
            ) : null}
          </div>
        );
      }
    );
  };

  return (
    <div>
      {loading ? (
        <div className="center-spinner">
          <Spinner animation="border" />
        </div>
      ) : null}
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        transaction && (
          <div className="mt-4">
            <h3 className="mb-4">Transaction Flow</h3>
            <div className="transaction-flow d-flex">
              <div className="transactions-flow">
                <div className="d-flex align-items-center">
                  {transitions && transitions[0] ? (
                    <>{recursiveBlocks(transitions, undefined)}</>
                  ) : null}
                </div>
              </div>

              <div id="d3-viewer" ref={ref}></div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TransactionFlow;

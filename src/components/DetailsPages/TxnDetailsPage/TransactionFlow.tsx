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
    query GetTransition($customId: String!) {
      txFindByCustomId(customId: $customId) {
        fromAddr
        toAddr
        amount
        transitions {
          addr
          msg {
            _tag
            _amount
            _recipient
            params
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
    if (transaction && transaction.transitions.length) {
      const links: any = [
        {
          source: transaction.fromAddr,
          target: transaction.toAddr,
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

      transaction.transitions.forEach((tr: any) => {
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

        links.push({
          source: tr.addr,
          target: tr.msg._recipient,
          data: { ...tr },
        });
      });

      const nodesTree: any = [];

      links.forEach((link: { data: {}; source: string; target: string }) => {
        if (link.source === transaction.fromAddr)
          return nodesTree.push({
            ...link,
          });

        const parentIndex = links.findIndex(
          (n: any) => n.target === link.source
        );

        if (!links[parentIndex].children) {
          return (links[parentIndex].children = [link]);
        }

        links[parentIndex].children.push(link);
      });

      if (links !== transitions) {
        setTransitions(links);
      }
    }
  }, [transaction]);

  const recursiveBlocks = (links: any): any => {
    return links.map(
      (
        link: {
          children: any[];
          source: string;
          target: string;
          data?: { msg?: any };
        },
        index: number
      ) => {
        return (
          <div className="d-flex align-items-center" key={index}>
            <TxBlock link={link} />
            {link.children ? (
              <div className="children">{recursiveBlocks(link.children)}</div>
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
              {transitions && transitions[0] ? (
                <div className="transactions-flow">
                  {recursiveBlocks([transitions[0]])}
                </div>
              ) : null}
              <div id="d3-viewer" ref={ref}></div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TransactionFlow;

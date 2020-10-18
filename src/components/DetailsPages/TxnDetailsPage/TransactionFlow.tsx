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

import * as d3 from "d3";

import "./TransactionFlow.css";

interface IProps {
  hash: string;
}

const TransactionFlow: React.FC<IProps> = ({ hash }) => {
  const [transaction, setTransaction] = useState<any>(undefined);
  const [transitions, setTransitions] = useState<any>(undefined);

  const width = 1000;
  const height = 460;

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

      const margin = { top: 10, right: 30, bottom: 30, left: 40 },
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      const svg = d3
        .select(ref.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const dW = 240;
      const dH = 30;

      const link: any = svg
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke", "#aaa");

      const node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("rect")
        .data(nodes)
        .enter()
        .append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", dW)
        .attr("height", dH);

      const label = svg
        .append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "label")
        .text(function (d: any) {
          return d.id;
        });

      // This function is run at each iteration of the force algorithm, updating the nodes position.
      const ticked = function () {
        link
          .attr("x1", function (d: any) {
            return d.source.x + dW;
          })
          .attr("y1", function (d: any) {
            return d.source.y;
          })
          .attr("x2", function (d: any) {
            return d.target.x + dW;
          })
          .attr("y2", function (d: any) {
            return d.target.y;
          });

        node
          .style("fill", "#d9d9d9")
          .style("stroke", "#969696")
          .style("stroke-width", "1px")
          .attr("x", function (d: any) {
            return d.x;
          })
          .attr("y", function (d: any) {
            return d.y;
          });

        label
          .attr("x", function (d: any) {
            return d.x + dW;
          })
          .attr("y", function (d: any) {
            return d.y - dH / 1.5;
          })
          .style("font-size", "10px")
          .style("fill", "#000");
      };

      console.log(nodes, links);

      // Let's list the force we wanna apply on the network
      const simulation = d3
        .forceSimulation(nodes) // Force algorithm is applied to data.nodes
        .force("alpha", function (alpha) {
          for (let i = 0, n = nodes.length, node, k = alpha * 0.1; i < n; ++i) {
            node = nodes[i];
            node.x = dW * i + (20 * i);
            node.y = 10;
          }
        })
        /* .force("center", d3.forceCenter(width / 4, height / 2))
        .force("charge", d3.forceManyBody().strength(-100)) */
        /* .force(
          "link",
          d3
            .forceLink() // This force provides links between nodes
            .id(function (d: any) {
              return d.id;
            }) // This provide  the id of a node
            .distance(function () {
              return 200
            })
            .links(links) // and this the list of links
        ) */
        .on("end", ticked);

      console.log(simulation);

      if (links !== transitions) {
        setTransitions(links);
      }
    }
  }, [transaction]);

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
          <div className="d-flex">
            <div id="d3-viewer" ref={ref}></div>
          </div>
        )
      )}
    </div>
  );
};

export default TransactionFlow;

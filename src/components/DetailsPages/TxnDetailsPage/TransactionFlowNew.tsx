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

import * as d3 from "d3";

import "./TransactionFlow.css";

interface IProps {
  hash: string;
}

const TransactionFlow: React.FC<IProps> = ({ hash }) => {
  const [transaction, setTransaction] = useState<any>(undefined);
  const [transitions, setTransitions] = useState<any>(undefined);

  const ref: any = useRef<SVGElement | null>();

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

      console.log("nodes", nodes);
      console.log("links", links);

      //const container = document.querySelector('.transactions-flow');

      // set the dimensions and margins of the graph
      const margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 1100 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      const svg = d3
        .select(ref.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Initialize the links
      /*  const link = svg
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .style("stroke", "#aaa"); */

      const link = svg
        .append("g")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("stroke", "#aaa")
        .attr("marker-end", (d: any) => {
          console.log(d);
          return `url(${new URL(`#arrow-${d.target}`, window.location.href)})`;
        });

      // Initialize the nodes
      const node = svg
        .selectAll("rect")
        .data(nodes)
        .enter()
        .append("rect")
        .attr("width", 300)
        .attr("height", 40)
        .style("fill", "#69b3a2");

      const label = node
        .append("text")
        .text(function (d: any) {
          return d.id;
        })
        .style("font-size", "14px")
        .attr("fill", "#fff");

      node.append("title").text(function (d: any) {
        return d.id;
      });

      // Per-type markers, as they don't inherit styles.
      svg
        .append("defs")
        .selectAll("marker")
        .data(nodes)
        .join("marker")
        .attr("id", (d: any) => `arrow-${d.id}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("fill", "#fff")
        .attr("d", "M0,-5L10,0L0,5");

      const linkArc = (d: any) => {
        const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);

        const fromx = d.source.x + 300;
        const fromy = d.target.y > d.source.y ? d.source.y + 40 : d.source.y;

        const tox =
          d.target.y > d.source.y ? d.target.x + 150 : d.target.x + 150;
        const toy = d.target.y > d.source.y ? d.target.y - 2 : d.target.y + 42;

        return `
          M${fromx},${fromy}
          A0,0 0 0,1 ${tox},${toy}
        `;
      };

      // This function is run at each iteration of the force algorithm, updating the nodes position.
      const ticked = () => {
        link.attr("d", linkArc);
        /*  link
          .attr("x1", function (d: any) {
            return d.source.x;
          })
          .attr("y1", function (d: any) {
            return d.source.y;
          })
          .attr("x2", function (d: any) {
            return d.target.x;
          })
          .attr("y2", function (d: any) {
            return d.target.y;
          }); */

        node
          .attr("x", function (d: any) {
            return d.x;
          })
          .attr("y", function (d: any) {
            return d.y;
          })
          .call(drag(simulation));

        label
          .attr("x", function (d: any) {
            return d.x;
          })
          .attr("y", function (d: any) {
            return d.y;
          });
      };

      // Let's list the force we wanna apply on the network
      const simulation = d3
        .forceSimulation(nodes) // Force algorithm is applied to data.nodes
        .force(
          "link",
          d3
            .forceLink() // This force provides links between nodes
            .id(function (d: any) {
              return d.id;
            }) // This provide  the id of a node
            .links(links) // and this the list of links
        )
        .force("charge", d3.forceManyBody().strength(-600)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
        //.force("x", d3.forceX())
        //.force("y", d3.forceY())
        .force("collide", d3.forceCollide(100))
        .on("end", ticked);

      const drag = (simulation: any) => {
        function dragstarted(event: any) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragended(event: any) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }

        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      };

      setTransitions(links);
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
          <div className="mt-4">
            <h3 className="mb-4">Transaction Flow</h3>
            <div className="transaction-flow d-flex">
              <div id="d3-viewer" ref={ref}></div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TransactionFlow;

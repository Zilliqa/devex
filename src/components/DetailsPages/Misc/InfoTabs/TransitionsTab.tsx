import React, { useRef, useEffect } from "react";

import AddressDisp from "src/components/Misc/Disp/AddressDisp/AddressDisp";
import { qaToZil, hexAddrToZilAddr, isValidAddr } from "src/utils/Utils";
import { TransitionEntry } from "@zilliqa-js/core/src/types";
import * as d3 from "d3";

interface IProps {
  transitions: TransitionEntry[];
}

const TransitionsTab: React.FC<IProps> = ({ transitions }) => {
  const width = 1000;
  const height = 460;

  const ref: any = useRef<SVGElement>();

  const data = {
    children: [
      {
        name: "boss1",
        children: [
          { name: "mister_a", colname: "level3", children: [] },
          { name: "mister_b", colname: "level3", children: [] },
          { name: "mister_c", colname: "level3", children: [] },
          { name: "mister_d", colname: "level3", children: [] },
        ],
        colname: "level2",
      },
      {
        name: "boss2",
        children: [
          { name: "mister_e", colname: "level3", children: [] },
          { name: "mister_f", colname: "level3", children: [] },
          { name: "mister_g", colname: "level3", children: [] },
          { name: "mister_h", colname: "level3", children: [] },
        ],
        colname: "level2",
      },
    ],
    name: "CEO",
  };

  console.log(transitions);

  useEffect(() => {
    if (transitions.length) {
      // append the svg object to the body of the page
      const svg = d3
        .select(ref.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g").attr("transform", "translate(40,0)"); // bit of margin on the left = 40

      // Create the cluster layout:
      const cluster = d3.cluster().size([height, width - 100]); // 100 is the margin I will have on the right side

      // Give the data to this cluster layout:
      const root = d3.hierarchy(data, function (d) {
        return d.children;
      });
      cluster(root);

      // Add the links between nodes:
      svg
        .selectAll("path")
        .data(root.descendants().slice(1))
        .enter()
        .append("path")
        .attr("d", function (d: any) {
          return (
            "M" +
            d.y +
            "," +
            d.x +
            "C" +
            (d.parent.y + 50) +
            "," +
            d.x +
            " " +
            (d.parent.y + 150) +
            "," +
            d.parent.x + // 50 and 150 are coordinates of inflexion, play with it to change links shape
            " " +
            d.parent.y +
            "," +
            d.parent.x
          );
        })
        .style("fill", "none")
        .attr("stroke", "#ccc");

      // Add a circle for each node.
      const node: any = svg
        .selectAll("g")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("transform", function (d: any) {
          return "translate(" + d.y + "," + d.x + ")";
        });

      node
        .append("circle")
        .attr("r", 7)
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .style("stroke-width", 2);

      node
        .append("text")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .attr("fill", "#fff")
        .text(function (d: any) {
          return d.data.name;
        })
        .attr("transform", function (d: any) {
          return "translate(15,-35)";
        });
    }
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <div id="d3-viewer" ref={ref}></div>
      </div>
      <div className="col-12">
        {transitions
          .map((transition: TransitionEntry, index: number) => (
            <>
              <table key={index} className="receipt-table">
                <tbody>
                  <tr>
                    <th>Tag</th>
                    <td>
                      {transition.msg._tag === "" ? "-" : transition.msg._tag}
                    </td>
                  </tr>
                  <tr>
                    <th>Contract Address</th>

                    <td>
                      <AddressDisp
                        isLinked={true}
                        addr={hexAddrToZilAddr(transition.addr)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Accepts $ZIL</th>
                    <td>
                      {transition.accepted === undefined
                        ? "-"
                        : `${transition.accepted}`}
                    </td>
                  </tr>
                  <tr>
                    <th>Depth</th>
                    <td>{transition.depth}</td>
                  </tr>
                  <tr>
                    <th>Amount</th>
                    <td>{qaToZil(transition.msg._amount)}</td>
                  </tr>
                  <tr>
                    <th>Recipient</th>
                    <td>
                      <AddressDisp
                        isLinked={true}
                        addr={hexAddrToZilAddr(transition.msg._recipient)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              {transition.msg.params.length > 0 && (
                <>
                  <hr />
                  <table key={index} className="receipt-table">
                    <tbody>
                      <tr>
                        <td className="subtext">Variable</td>
                        <td className="subtext">Value</td>
                      </tr>
                      {transition.msg.params.map((param, index) => (
                        <tr key={index}>
                          <th>{param.vname}</th>
                          <td>
                            {typeof param.value === "object" ? (
                              <pre className="display-block">
                                {JSON.stringify(param.value, null, "\t")}
                              </pre>
                            ) : Array.isArray(param.value) ? (
                              param.value.toString()
                            ) : isValidAddr(param.value.toString()) ? (
                              <AddressDisp isLinked={true} addr={param.value} />
                            ) : (
                              param.value
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          ))
          .reduce(
            (acc: React.ReactNode | null, x) =>
              acc === null ? (
                x
              ) : (
                <>
                  {acc}
                  <hr />
                  {x}
                </>
              ),
            null
          )}
      </div>
    </div>
  );
};

export default TransitionsTab;

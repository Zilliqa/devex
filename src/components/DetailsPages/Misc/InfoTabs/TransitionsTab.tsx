import React from "react";

import AddressDisp from "src/components/Misc/Disp/AddressDisp/AddressDisp";
import { qaToZil, hexAddrToZilAddr, isValidAddr } from "src/utils/Utils";
import { TransitionEntry } from "@zilliqa-js/core/src/types";


interface IProps {
  transitions: TransitionEntry[];
}

const TransitionsTab: React.FC<IProps> = ({ transitions }) => {

  return (
    <div className="row">
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

import React, { useState } from "react";
import { qaToZil } from "src/utils/Utils";
import AddressDisp from "src/components/Misc/Disp/AddressDisp/AddressDisp";
import { isValidAddr } from "src/utils/Utils";

import "./TransactionFlowDetails.css";
import TxBlock from "./TxBlock";

interface IProps {
  links: {
    source: {
      id: string;
      color: string;
      type: string;
    };
    target: {
      id: string;
      color: string;
      type: string;
    };
    receipt: {
      event_logs: {
        address: string;
        _eventname: string;
        __typename: string;
      }[];
    };
    txData: {
      amount: string;
      fromAddr: string;
      toAddr: string;
    };
    events:
      | undefined
      | {
          address: string;
          _eventname: string;
          params: {
            type: string;
            value: string;
            vname: string;
          }[];
        }[];
    data:
      | undefined
      | {
          accepted: boolean;
          addr: string;
          depth: number;
          msg: {
            params: {
              type: string;
              value: string;
              vname: string;
              __typename: string;
            }[];
            __typename: string;
            _amount: string;
            _recipient: string;
            _tag: string;
          };
          __typename: string;
        };
    index: number;
    amount: string;
  }[];
  txn: any;
}

const TransactionFlowDetails: React.FC<IProps> = ({ links, txn }) => {
  let txData: any = undefined;
  if (txn.data !== "") {
    txData = JSON.parse(txn.data);
  }
  const [loading, setLoading] = useState(false);

  return loading ? null : (
    <div className="transaction-flow-details mt-4">
      <h3 className="mb-4">Transaction flow</h3>
      {links &&
        links.length &&
        links.map((l) => (
          <div className="link-item d-flex" key={l.index}>
            <div className="link-index mr-2">{l.index + 1}</div>

            {l.index === 0 ? (
              <div className="link-details mb-4">
                <div>
                  <span className="badge badge-secondary">{l.source.id}</span>{" "}
                  sent{" "}
                  <span className="font-weight-bold">{qaToZil(l.amount)}</span>{" "}
                  {l.target.type === "contract" && txData && txData._tag ? (
                    <span>
                      and called{" "}
                      <span className="txData-tag">{txData._tag}</span> on
                    </span>
                  ) : (
                    "to"
                  )}{" "}
                  <span className="badge badge-warning">{l.target.id}</span>
                </div>

                {txData && txData.params && txData.params.length ? (
                  <div>
                    <div className="my-2 font-weight-bold text-warning">
                      Transaction parameters:
                    </div>
                    <div className="parameters-container">
                      {txData.params.map(
                        (param: {
                          type: string;
                          value: string;
                          vname: string;
                        }) => (
                          <div
                            className="d-flex align-items-center"
                            key={`param-${param.vname}`}
                          >
                            <span className="mr-2">{param.vname}:</span>
                            {param.value !== undefined &&
                            isValidAddr(param.value.toString()) ? (
                              <AddressDisp
                                isLinked={true}
                                addr={param.value as string}
                              />
                            ) : param.value ? (
                              param.value.toString()
                            ) : null}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="link-details mb-4">
                <div>
                  <span className="badge badge-warning">{l.source.id}</span>{" "}
                  sent <b>{l.data && qaToZil(l.data.msg._amount)}</b> and
                  invoked{" "}
                  <span className="txData-tag">
                    {l.data && l.data.msg ? l.data.msg._tag : null}
                  </span>{" "}
                  to{" "}
                  <span
                    className={`badge ${
                      l.target.id === links[0].source.id
                        ? "badge-secondary"
                        : "badge-warning"
                    }`}
                  >
                    {l.target.id}
                  </span>
                </div>
                {l.data && l.data.msg.params.length > 0 && (
                  <div>
                    <div className="my-2 font-weight-bold text-warning">
                      Transaction parameters:
                    </div>
                    <div className="parameters-container">
                      {l.data && l.data.msg.params && l.data.msg.params.length
                        ? l.data.msg.params.map(
                            (param: {
                              type: string;
                              value: string;
                              vname: string;
                            }) => (
                              <div
                                className="d-flex align-items-center"
                                key={`param-${param.vname}`}
                              >
                                <span className="mr-2">{param.vname}:</span>
                                {isValidAddr(param.value.toString()) ? (
                                  <AddressDisp
                                    isLinked={true}
                                    addr={param.value as string}
                                  />
                                ) : param.value ? (
                                  param.value.toString()
                                ) : null}
                              </div>
                            )
                          )
                        : null}
                    </div>
                  </div>
                )}

                {l.events && l.events.length ? (
                  <div className="link-events mb-4">
                    <div className="my-2 font-weight-bold text-info">
                      {l.events.length}{" "}
                      {l.events.length > 1 ? "events were" : "event was"}{" "}
                      emitted during this call:
                    </div>
                    <div className="events-container">
                      {l.events.map(
                        (ev: {
                          address: string;
                          params: any[];
                          _eventname: string;
                        }) => (
                          <div className="mb-2" key={`event-${ev._eventname}`}>
                            <span className="badge badge-info">
                              {ev.address}
                            </span>{" "}
                            emitted{" "}
                            <span className="font-weight-bold">
                              {ev._eventname}
                            </span>{" "}
                            with params:
                            <div>
                              {ev.params.map(
                                (param: {
                                  type: string;
                                  value: string;
                                  vname: string;
                                }) => (
                                  <div
                                    className="d-flex align-items-center"
                                    key={`param-event-${param.vname}`}
                                  >
                                    <span className="mr-2">{param.vname}:</span>
                                    {isValidAddr(
                                      param.value.toString() as string
                                    ) ? (
                                      <AddressDisp
                                        isLinked={true}
                                        addr={param.value.toString() as string}
                                      />
                                    ) : param.value ? (
                                      param.value.toString()
                                    ) : null}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default TransactionFlowDetails;

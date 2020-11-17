import React, { useState, useCallback, useEffect } from "react";

import {
  qaToZil,
  hexAddrToZilAddr,
  isValidAddr,
  qaToZilSimplified,
} from "src/utils/Utils";

import { QueryPreservingLink } from "src/services/network/networkProvider";
import AddressDisp from "src/components/Misc/Disp/AddressDisp/AddressDisp";
import { EventLogEntry, EventParam } from "@zilliqa-js/core/src/types";
import "./TransactionFlow.css";

interface IProps {
  link: {
    source: string;
    target: string;
    data?: any;
    amount?: number | string;
    index?: any;
    events?: EventLogEntry[];
  };
  noDetails?: boolean;
  parent?: any;
}

const TxBlock: React.FC<IProps> = ({ link, parent, noDetails }) => {
  const [modalOpen, setModalOpen] = useState<any>(false);

  const highlightEventParams = useCallback(
    (params: EventParam[]): React.ReactNode => {
      if (params.length === 0) return null;
      return params
        .map((param, index) => (
          <span key={index}>
            <span className="event-type">{param.type}</span> {param.vname}
          </span>
        ))
        .reduce((acc: React.ReactNode | null, ele) =>
          acc === null ? <>{[ele]}</> : <>{[acc, ", ", ele]}</>
        );
    },
    []
  );

  if (parent) {
    const start = document.getElementById(`txblock-${parent.index}`);
    const end = document.getElementById(`txblock-${link.index}`);

    if (start !== null && end !== null) {
      /* @ts-ignore */
      const line = new LeaderLine({
        start,
        end,
        color: "#fff",
        path: "grid",
        // middleLabel: "test",
        size: 4,
      });

      line.positionByWindowResize = false;

      const scrollableBox = document.querySelector(".transaction-flow");

      const ns = document.querySelector(".leader-line:last-of-type");
      /* @ts-ignore */
      //scrollableBox.appendChild(ns);

      /* @ts-ignore */
      if (AnimEvent) {
        /* @ts-ignore */
        scrollableBox.addEventListener(
          "scroll",
          /* @ts-ignore */
          AnimEvent.add(function () {
            line.position();
          }),
          false
        );
      }
    }
  }

  const openModal = () => {
    if (link.index !== 0) {
      document.body.classList.add("has-modal-open");
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    document.body.classList.remove("has-modal-open");
    setModalOpen(false);
  };

  return (
    <div>
      {!noDetails && link.index !== 0 ? (
        <div className={modalOpen ? "tx-modal open" : "tx-modal"}>
          <div className="close-modal" onClick={() => closeModal()}>
            Close
          </div>
          <div className="modal-details">
            <h5>Transition details</h5>
            <table className="receipt-table">
              <tbody>
                {link.data ? (
                  <tr>
                    <th>Tag</th>
                    <td>
                      {link.data.msg._tag === "" ? "-" : link.data.msg._tag}
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <th>Contract Address</th>

                  <td>
                    <AddressDisp
                      isLinked={true}
                      addr={hexAddrToZilAddr(link.data.addr)}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Accepts $ZIL</th>
                  <td>
                    {link.data.accepted === undefined
                      ? "-"
                      : `${link.data.accepted}`}
                  </td>
                </tr>
                <tr>
                  <th>Depth</th>
                  <td>{link.data.depth}</td>
                </tr>
                <tr>
                  <th>Amount</th>
                  <td>{qaToZil(link.data.msg._amount)}</td>
                </tr>
                <tr>
                  <th>Recipient</th>
                  <td>
                    {link.data.msg._recipient ? (
                      <AddressDisp
                        isLinked={true}
                        addr={hexAddrToZilAddr(link.data.msg._recipient)}
                      />
                    ) : null}
                  </td>
                </tr>
              </tbody>
            </table>
            {link.data.msg.params && link.data.msg.params.length > 0 && (
              <>
                <hr />
                <table className="receipt-table">
                  <tbody>
                    <tr>
                      <td className="subtext">Variable</td>
                      <td className="subtext">Value</td>
                    </tr>
                    {link.data.msg.params.map((param: any, index: any) => (
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

            <h5 className="mt-4 mb-4">Transition Events</h5>
            {link.events ? (
              <>
                {link.events
                  .map((event: EventLogEntry, index: number) => (
                    <>
                      <div className="mb-2">
                        <span className="event-name">{event._eventname}</span>
                        {" ("}
                        {highlightEventParams(event.params)}
                        {")"}
                      </div>
                      <AddressDisp
                        isLinked={true}
                        addr={hexAddrToZilAddr(event.address)}
                      />
                      <table key={index} className="mt-3 mb-1 receipt-table">
                        <tbody>
                          {event.params.length > 0 && (
                            <>
                              <tr>
                                <td className="subtext">Variable</td>
                                <td className="subtext">Value</td>
                              </tr>
                              {event.params.map((param, index) => (
                                <tr key={index}>
                                  <td>{param.vname}</td>
                                  <td>
                                    {typeof param.value === "object" ? (
                                      <pre className="display-block">
                                        {JSON.stringify(param.value, null, 2)}
                                      </pre>
                                    ) : Array.isArray(param.value) ? (
                                      param.value.toString()
                                    ) : isValidAddr(param.value.toString()) ? (
                                      <AddressDisp
                                        isLinked={true}
                                        addr={param.value}
                                      />
                                    ) : (
                                      param.value
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </>
                          )}
                        </tbody>
                      </table>
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
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <div
        className="tx-block"
        onClick={() => openModal()}
        id={`txblock-${link.index}`}
      >
        {!noDetails ? (
          <QueryPreservingLink
            className="from"
            to={`/address/${hexAddrToZilAddr(link.source)}`}
          >
            from {hexAddrToZilAddr(link.source)}
          </QueryPreservingLink>
        ) : null}

        {!noDetails ? (
          <>
            <div className="details">
              {link.amount ? (
                <div className="simple-info align-items-center d-flex flex-column">
                  <div className="tag">
                    <div className="badge badge-secondary">
                      {qaToZilSimplified(link.amount)} ZIL
                    </div>
                  </div>
                </div>
              ) : null}
              {link.data && link.data.msg ? (
                <>
                  <div className="simple-info align-items-center d-flex flex-column">
                    <div className="tag">
                      <div className="badge badge-secondary">
                        {link.data.msg._tag}
                      </div>
                    </div>
                  </div>
                  <div className="extended-info">
                    <div className="amount">
                      Amount: {link.data.msg._amount}
                    </div>
                    <div className="expand-button text-muted">
                      click to expand
                    </div>
                    {link.data.msg.params ? (
                      <div className="code extended-data">
                        {Object.entries(link.data.msg.params).map(
                          ([key, value]: any): any => {
                            return (
                              <div className="mono" key={key}>
                                {key}: {JSON.stringify(value)}
                              </div>
                            );
                          }
                        )}
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  {!link.amount ? (
                    <div className="simple-info align-items-center d-flex flex-column">
                      <div className="tag">
                        <div className="badge badge-secondary">
                          contract call
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
            <QueryPreservingLink
              className="to"
              to={`/address/${hexAddrToZilAddr(link.target)}`}
            >
              {hexAddrToZilAddr(link.target)}
            </QueryPreservingLink>
          </>
        ) : (
          <div className="details">
            <div className="simple-info align-items-center d-flex flex-column">
              <div className="p-5 justy">{hexAddrToZilAddr(link.source)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TxBlock;

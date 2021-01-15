import React, { useCallback } from "react";

import {
  qaToZil,
  hexAddrToZilAddr,
  isValidAddr,
} from "src/utils/Utils";

import AddressDisp from "src/components/Misc/Disp/AddressDisp/AddressDisp";
import { EventLogEntry, EventParam } from "@zilliqa-js/core/src/types";
import "./TransactionFlow.css";

interface IProps {
  modalData: any;
  display: boolean;
  closeModal: Function;
}

const TransitionModal: React.FC<IProps> = ({
  display,
  modalData,
  closeModal,
}) => {
  const highlightEventParams = useCallback(
    (params: EventParam[]): React.ReactNode => {
      if (params.length === 0) return null;
      return params
        .map((param, index) => (
          <span key={`event-param-${index}`}>
            <span className="event-type">{param.type}</span> {param.vname}
          </span>
        ))
        .reduce((acc: React.ReactNode | null, ele) =>
          acc === null ? <>{[ele]}</> : <>{[acc, ", ", ele]}</>
        );
    },
    []
  );

  const events = modalData
    ? modalData.events
      ? modalData.events
      : modalData.txData.receipt.event_logs
    : [];

  return (
    <>
      {display ? (
        <div className={display ? "tx-modal open" : "tx-modal"}>
          <div className="close-modal" onClick={() => closeModal()}>
            Close
          </div>
          <div className="modal-details">
            {modalData.data ? (
              <>
                <h5>Transition details</h5>
                <table className="receipt-table">
                  <tbody>
                    <tr>
                      <th>Tag</th>
                      <td>
                        {modalData.data.msg._tag === ""
                          ? "-"
                          : modalData.data.msg._tag}
                      </td>
                    </tr>
                    <tr>
                      <th>Contract Address</th>

                      <td>
                        <AddressDisp
                          isLinked={true}
                          addr={hexAddrToZilAddr(modalData.data.addr)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>Accepts $ZIL</th>
                      <td>
                        {modalData.data.accepted === undefined
                          ? "-"
                          : `${modalData.data.accepted}`}
                      </td>
                    </tr>
                    <tr>
                      <th>Depth</th>
                      <td>{modalData.data.depth}</td>
                    </tr>
                    <tr>
                      <th>Amount</th>
                      <td>{qaToZil(modalData.data.msg._amount)}</td>
                    </tr>
                    <tr>
                      <th>Recipient</th>
                      <td>
                        {modalData.data.msg._recipient ? (
                          <AddressDisp
                            isLinked={true}
                            addr={hexAddrToZilAddr(
                              modalData.data.msg._recipient
                            )}
                          />
                        ) : null}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {modalData.data.msg.params &&
                  modalData.data.msg.params.length > 0 && (
                    <>
                      <hr />
                      <table className="receipt-table">
                        <tbody>
                          <tr>
                            <td className="subtext">Variable</td>
                            <td className="subtext">Value</td>
                          </tr>
                          {modalData.data.msg.params.map(
                            (param: any, index: any) => (
                              <tr key={`msg-param-${index}`}>
                                <th>{param.vname}</th>
                                <td>
                                  {typeof param.value === "object" ? (
                                    <pre className="display-block">
                                      {JSON.stringify(param.value, null, "\t")}
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
                            )
                          )}
                        </tbody>
                      </table>
                    </>
                  )}
              </>
            ) : (
              <>
                {modalData.txData ? (
                  <>
                    <h5>Transaction details</h5>

                    <table className="receipt-table">
                      <tbody>
                        <tr>
                          <th>From</th>
                          <td>
                            <AddressDisp
                              isLinked={true}
                              addr={hexAddrToZilAddr(modalData.txData.fromAddr)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>To</th>
                          <td>
                            <AddressDisp
                              isLinked={true}
                              addr={hexAddrToZilAddr(modalData.txData.toAddr)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Amount</th>
                          <td>{modalData.txData.amount}</td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                ) : null}
              </>
            )}
            <h5 className="mt-4 mb-4">Events</h5>
            {events &&
              events
                .map((event: EventLogEntry, index: number) => (
                  <div key={`events-${index}`}>
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
                              <tr key={`event-param-2-${index}`}>
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
                  </div>
                ))
                .reduce(
                  (acc: React.ReactNode | null, x: any) =>
                    acc === null ? (
                      x
                    ) : (
                      <div key={`transition-event-${x}`}>
                        {acc}
                        <hr />
                        {x}
                      </div>
                    ),
                  null
                )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TransitionModal;

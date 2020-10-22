import { info } from "console";
import React, { useState } from "react";

import AddressDisp from "src/components/Misc/Disp/AddressDisp/AddressDisp";
import { hexAddrToZilAddr } from "src/utils/Utils";
import { QueryPreservingLink } from "src/services/network/networkProvider";

import "./TransactionFlow.css";

interface IProps {
  link: any;
}

const TxBlock: React.FC<IProps> = ({ link }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div
      className={expanded ? "tx-block expanded" : "tx-block"}
      onClick={() => setExpanded(!expanded)}
    >
      <QueryPreservingLink
        className="from"
        to={`/address/${hexAddrToZilAddr(link.source)}`}
      >
        from {hexAddrToZilAddr(link.source)}
      </QueryPreservingLink>

      <div className="details">
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
              <div className="amount">Amount: {link.data.msg._amount}</div>
              <div className="expand-button text-muted">click to expand</div>
              <div className="code extended-data">
                {Object.entries(link.data.msg.params).map(
                  ([key, value]: any): any => {
                    return (
                      <div className="mono" key={key}>
                        {key}: {value}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="simple-info align-items-center d-flex flex-column">
            <div className="tag">
              <div className="badge badge-secondary">contract call</div>
            </div>
          </div>
        )}
      </div>

      <QueryPreservingLink
        className="to"
        to={`/address/${hexAddrToZilAddr(link.target)}`}
      >
        {hexAddrToZilAddr(link.target)}
      </QueryPreservingLink>
    </div>
  );
};

export default TxBlock;

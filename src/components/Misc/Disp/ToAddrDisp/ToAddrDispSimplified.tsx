import React from "react";

import { QueryPreservingLink } from "src/services/network/networkProvider";
import { TransactionDetails } from "src/typings/api";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import {
  hexAddrToZilAddr,
  zilAddrToHexAddr,
  stripHexPrefix,
} from "src/utils/Utils";

import { ReactComponent as LeftArrow } from "src/assets/images/left-arrow.svg";
import { ReactComponent as RightArrow } from "src/assets/images/right-arrow.svg";
import { ReactComponent as BothArrow } from "src/assets/images/both-arrow.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";

interface IProps {
  txnDetails: TransactionDetails;
}

const ToAddrDispSimplified: any = ({ toAddr, fromAddr, txType, addr }: any) => {
  const hexAddr = stripHexPrefix(zilAddrToHexAddr(addr));
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let type: any;

  if (fromAddr.toLowerCase() === toAddr.toLowerCase()) {
    type = <BothArrow width="20px" height="14px" fill="gray" />;
  } else {
    type =
      fromAddr.toLowerCase() === hexAddr ? (
        <RightArrow width="20px" height="14px" fill="red" />
      ) : (
        <LeftArrow width="20px" height="14px" fill="green" />
      );
  }

  let txTypeIcon: any = undefined;

  if (txType === "contract-creation") {
    txTypeIcon = (
      <FontAwesomeIcon color="darkturquoise" icon={faFileContract} />
    );
  }

  if (txType === "contract-call") {
    txTypeIcon = <FontAwesomeIcon color="darkorange" icon={faFileContract} />;
  }

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={"overlay-to"}>{txType}</Tooltip>}
    >
      <div className="d-flex align-items-center">
        {txTypeIcon ? <div className="mr-2">{txTypeIcon}</div> : null}
        {txType === "contract-creation" ? (
          <div>Contract</div>
        ) : toAddr.toLowerCase() !== hexAddr ? (
          <QueryPreservingLink to={`/address/${hexAddrToZilAddr(toAddr)}`} className="ellipsis mono">
            {hexAddrToZilAddr(toAddr)}
          </QueryPreservingLink>
        ) : (
          <span className="text-muted">{addr}</span>
        )}
      </div>
    </OverlayTrigger>
  );
};

export default ToAddrDispSimplified;

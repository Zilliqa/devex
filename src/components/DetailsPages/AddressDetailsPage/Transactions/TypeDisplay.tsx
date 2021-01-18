import React from "react";

import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { ReactComponent as RightArrow } from "src/assets/images/right-arrow.svg";
import { ReactComponent as BothArrow } from "src/assets/images/both-arrow.svg";

import { zilAddrToHexAddr } from "src/utils/Utils";

interface IProps {
  fromAddr: string;
  toAddr: string;
  addr: string;
  type?: string;
}

const TypeDisplay: React.FC<IProps> = ({ fromAddr, toAddr, addr, type }) => {
  const hexAddr = zilAddrToHexAddr(addr);
  let type2: any;
  let typeText: string;

  // sender
  if (hexAddr === fromAddr.toLowerCase()) {
    type2 = <RightArrow width="20px" height="14px" fill="red" />;
  }

  // receiver
  if (hexAddr === toAddr) {
    if (type === "contract-call") {
      type2 = <RightArrow width="20px" height="14px" fill="green" />;
    } else {
      type2 = <RightArrow width="20px" height="14px" fill="green" />;
    }
  }

  if (fromAddr.toLowerCase() === toAddr.toLowerCase()) {
    type2 = <BothArrow width="20px" height="14px" fill="gray" />;
    typeText = "SELF";
  } else {
    typeText = fromAddr.toLowerCase() === hexAddr ? "OUT" : "IN";
  }

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={"overlay-to"}>{typeText}</Tooltip>}
    >
      <div>{type2}</div>
    </OverlayTrigger>
  );
};

export default TypeDisplay;

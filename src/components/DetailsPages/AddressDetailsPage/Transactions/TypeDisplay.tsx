import React from "react";

import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { ReactComponent as LeftArrow } from "src/assets/images/left-arrow.svg";
import { ReactComponent as RightArrow } from "src/assets/images/right-arrow.svg";
import { ReactComponent as BothArrow } from "src/assets/images/both-arrow.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";

import { zilAddrToHexAddr, stripHexPrefix } from "src/utils/Utils";

interface IProps {
  fromAddr: string;
  toAddr: string;
  addr: string;
}

const TypeDisplay: React.FC<IProps> = ({ fromAddr, toAddr, addr }) => {
  const hexAddr = zilAddrToHexAddr(addr);
  let type: any;
  let typeText: string;

  if (fromAddr.toLowerCase() === toAddr.toLowerCase()) {
    type = <BothArrow width="20px" height="14px" fill="gray" />;
    typeText = "SELF";
  } else {
    type =
      fromAddr.toLowerCase() === hexAddr ? (
        <RightArrow width="20px" height="14px" fill="red" />
      ) : (
        <LeftArrow width="20px" height="14px" fill="green" />
      );
    typeText = fromAddr.toLowerCase() === hexAddr ? "OUT" : "IN";
  }

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={"overlay-to"}>{typeText}</Tooltip>}
    >
      <div>{type}</div>
    </OverlayTrigger>
  );
};

export default TypeDisplay;

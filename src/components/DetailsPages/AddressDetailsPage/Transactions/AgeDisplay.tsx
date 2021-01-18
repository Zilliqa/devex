import React from "react";

import { OverlayTrigger, Tooltip } from "react-bootstrap";

import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface IProps {
  timestamp: any;
  className?: string;
}

const AgeDisplay: React.FC<IProps> = ({ timestamp, className }) => {
  const parsedTime: Dayjs = dayjs(timestamp / 1000);

  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id={"overlay-to"}>
          {parsedTime.format("YYYY-DD-MM HH:mm")}
        </Tooltip>
      }
    >
      <div className={className}>
        <span>{parsedTime.fromNow()}</span>
      </div>
    </OverlayTrigger>
  );
};

export default AgeDisplay;

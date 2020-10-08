import React, { useContext, useState } from "react";

import {
  NetworkContext,
  QueryPreservingLink,
} from "src/services/network/networkProvider";
import { TransactionDetails } from "src/typings/api";
import { hexAddrToZilAddr } from "src/utils/Utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";

interface IProps {
  txnDetails: TransactionDetails;
}

const ToAddrDispSimplified: any = ({ txnDetails, ownAddress }: any) => {
  const networkContext = useContext(NetworkContext);
  const { dataService } = networkContext!;

  const [details, setDetails] = useState(txnDetails);

  if (!dataService) return;

  /*   dataService
    .getTransactionDetailsSimplified(txnDetails)
    .then((details) => setDetails(details)); */

  return ownAddress === hexAddrToZilAddr(details.toAddr) ? (
    <div>{hexAddrToZilAddr(details.toAddr)}</div>
  ) : (
    <QueryPreservingLink to={`/address/${hexAddrToZilAddr(details.toAddr)}`}>
      {hexAddrToZilAddr(details.toAddr)}
    </QueryPreservingLink>
  );
};

export default ToAddrDispSimplified;

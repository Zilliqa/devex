import {TxBlockObj, TransactionObj, TxList} from '@zilliqa-js/core/src/types'

export interface MappedDSBlockListing {
  data: DsBlockObj[],
  maxPages: number,
}

export interface MappedTxBlockListing {
  data: TxBlockObj[],
  maxPages: number,
}

export interface MappedTxBlock extends TxBlockObj {
  txnHashes: string[];
}

export interface TransactionDetails extends TransactionObj {
  hash: string;
  contractAddr?: string;
}

export interface InitParam {
  type: string;
  value: string;
  vname: string;
}

export interface ContractDetails {
  code: string;
  initParams: InitParam[];
  state: any;
}

export interface MappedTxList extends TxList {
  txnBodies: TransactionObj[];
}

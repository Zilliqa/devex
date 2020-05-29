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

export interface TransactionObjWithHash extends TransactionObj {
  hash: string;
}

export interface MappedTxList extends TxList {
  txnBodies: TransactionObj[];
}

/* This file includes additional typing needed for this application,
  built on top of Zilliqa's Javascript SDK */
import { Transaction } from '@zilliqa-js/account/src/transaction'
import { Value } from '@zilliqa-js/contract/src/types'
import { PendingTxnResult, DsBlockObj, TxBlockObj } from '@zilliqa-js/core/src/types'

export interface DsBlockObjWithHash extends DsBlockObj {
  Hash: string
}

export interface DsBlockObjWithHashListing {
  data: DsBlockObjWithHash[],
  maxPages: number,
}

export interface TxBlockObjListing {
  data: TxBlockObj[],
  maxPages: number,
}

export interface TransactionDetails {
  txn: Transaction,
  hash: string,
  contractAddr?: string,
}

export interface ContractData {
  code: string,
  initParams: Value[],
  state: any,
}

export interface AccData {
  balance: number,
  nonce: number,
}

export interface AccContract {
  address: string,
  state: any,
}

export interface PendingTxnResultWithHash extends PendingTxnResult {
  hash: string
}

export interface IISInfo {
  blockNum: string,
  minGasPrice: string
}
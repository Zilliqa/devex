export interface MappedDSBlockListing {
  data: DsBlockObj[],
  maxPages: number,
}

export interface MappedTxBlockListing {
  data: TxBlockObj[],
  maxPages: number,
}

/* NOT BEING USED, using the types in sdk repo */
/* API Interfaces (Needs to be updated with JS-SDK changes) */
import { BN } from "@zilliqa-js/util"

interface Indexable {
  [key: string]: any,
}

/* Blockchain-related Interfaces */
export interface IBCInfo extends Indexable { // Follows API structure
  NumDSBlocks: number,
  NumTxBlocks: number,
  NumPeers: number,
  NumTransactions: number,
  TransactionRate: number,
  NumTxnsDSEpoch: number,
  NumTxnsTxEpoch: number,
}

/* DS-related Interfaces */
export interface IDSBlockHeader { // Follows API structure
  BlockNum: number,
  Difficulty: number,
  DifficultyDS: number,
  GasPrice: number,
  LeaderPubKey: string,
  PoWWinners: string[],
  PrevHash: string,
  Timestamp: string,
  Hash: string,
}

export interface IDSBlock extends Indexable { // Follows API structure
  header: IDSBlockHeader,
  signature: string,
}

/* Transaction-related Intefaces */
export interface IMicroBlock extends Indexable {
  MicroBlockHash: string,
  MicroBlockShardId: number,
  MicroBlockTxnRootHash: string
}

export interface ITxnBlockBody extends Indexable { // Follows API structure
  BlockHash: string,
  HeaderSign: string,
  MicroBlockInfos: IMicroBlock[]
}

export interface ITxnBlockHeader extends Indexable { // Follows API structure
  BlockNum: number,
  DSBlockNum: number,
  GasLimit: number,
  GasUsed: number,
  MbInfoHash: string,
  MinerPubKey: string,
  NumMicroBlocks: number,
  NumTxns: number,
  PrevBlockHash: string,
  Rewards: number,
  StateDeltaHash: string,
  StateRootHash: string,
  Timestamp: Date,
  Version: number,
}

export interface ITxnBlock extends Indexable { // Follows API structure
  header: ITxnBlockHeader,
  body: ITxnBlockBody,
}

export interface ITxnEventParam extends Indexable {
  type: string,
  value: string,
  vname: string,
}

export interface ITxnEvent extends Indexable {
  _eventname: string,
  address: string,
  params: ITxnEventParam[]
}

export interface ITxnTransitionMsg extends Indexable {
  _amount: BN,
  _recipient: string,
  _tag: string,
  params: ITxnEventParam,
}

export interface ITxnTransitions extends Indexable {
  addr: string,
  depth: number,
  msg: ITxnTransitionMsg
}

export interface ITxnExceptions extends Indexable {
  line: number,
  message: string
}

export interface ITxnReceipt extends Indexable {
  accepted: boolean,
  cumulative_gas: number,
  epoch_num: number,
  event_logs: ITxnEvent[],
  success: boolean,
  transitions: ITxnTransitions[],
  exceptions: ITxnExceptions[]
}

export interface ITxn extends Indexable { // Follows API structure
  hash: string, // Not originally included
  amount: BN,
  blockConfirmation: number,
  code: string,
  data: string,
  gasLimit: number,
  gasPrice: number,
  nonce: number,
  pubKey: string,
  status: number,
  receipt: ITxnReceipt,
  signature: string,
  toAddr: string,
  toDS: boolean,
  version: number,
}

export interface IPendTxn extends Indexable {
  Status: number,
  TxnHash: string,
}
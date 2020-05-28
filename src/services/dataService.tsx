/* 
  Available Async Functions
  
  Blockchain-related:
  1) getBlockchainInfo(): Promise<BlockchainInfo>

  DSBlocks-related:
  1) getNumDSBlocks(): Promise<number>
  2) getDSBlockDetails(blockNum: number): Promise<DsBlockObj>
  3) getLatest5DSBlocks(): Promise<DsBlockObj[]>
  4) getDSBlocksListing(pageNum: number): Promise<MappedDSBlockListing>

  TxBlocks-related:
  1) getNumTxBlocks(): Promise<number>
  2) getTxBlockDetails(blockNum: number): Promise<MappedTxBlock>
  3) getLatest5TxBlocks(): Promise<TxBlockObj[]>
  4) getTxBlocksListing(pageNum: number): Promise<MappedTxBlockListing>
  
  Transactions-related:
  1) getTransactionDetails(txnHash: string): Promise<TransactionObj>
  2) getLatest5ValidatedTransactions(): Promise<TransactionObj[]>
  3) getTransactionDetails(txnHash: string): Promise<TransactionObj>
  4) getTransactionsForTxBlock(blockNum: number): Promise<string[]>
  5) getRecentTransactions(): Promise<TxList>
  6) getLatest5PendingTransactions(): Promise<PendingTxnResult[]>

*/

// Mainnet: https://api.zilliqa.com/
// Testnet: https://dev-api.zilliqa.com/

import { Zilliqa } from '@zilliqa-js/zilliqa'
import { BlockchainInfo, DsBlockObj, TransactionObj, TxBlockObj, TxList, PendingTxnResult } from '@zilliqa-js/core/src/types'
import { MappedDSBlockListing, MappedTxBlockListing } from 'src/typings/api'

export interface MappedTxBlock extends TxBlockObj {
  txnHashes: string[];
}

export interface MappedTxList extends TxList {
  txnBodies: TransactionObj[];
}

export class DataService {
  zilliqa: any;

  constructor(nodeUrl?: string) {
    if (nodeUrl)
      this.initDataService(nodeUrl)
    else
      this.initDataService('https://api.zilliqa.com/')
  }

  initDataService(nodeUrl: string): void {
    this.zilliqa = new Zilliqa(nodeUrl)
  }

  setNodeUrl(nodeUrl: string): void {
    this.initDataService(nodeUrl)
  }

  //================================================================================
  // Blockchain-related
  //================================================================================

  async getBlockchainInfo(): Promise<BlockchainInfo> {
    const blockChainInfo = await this.zilliqa.blockchain.getBlockChainInfo()
    return blockChainInfo.result as BlockchainInfo
  }

  //================================================================================
  // DSBlocks-related
  //================================================================================

  async getNumDSBlocks(): Promise<number> {
    console.log("getting number of DS blocks")
    const response = await this.zilliqa.blockchain.getNumDSBlocks()
    return parseInt(response.result)
  }

  async getDSBlockDetails(blockNum: number): Promise<DsBlockObj> {
    console.log("getting DS block details")
    const blockData = await this.zilliqa.blockchain.getDSBlock(blockNum)
    console.log(blockData)
    return blockData.result as DsBlockObj
  }

  async getLatest5DSBlocks(): Promise<DsBlockObj[]> {
    console.log("getting 5 ds blocks")
    const response = await this.zilliqa.blockchain.getDSBlockListing(1)
    const DSBlockListing: any[] = response.result.data.slice(0, 5)

    // Map DSBlock with header info
    const output = await Promise.all(DSBlockListing.map(async block => {
      const blockData = await this.zilliqa.blockchain.getDSBlock(block.BlockNum)

      return {
        header: { ...blockData.result.header, Hash: block.Hash },
        signature: blockData.result.signature,
      }
    }))
    return output as DsBlockObj[]
  }

  async getDSBlocksListing(pageNum: number): Promise<MappedDSBlockListing> {
    console.log("getting ds blocks")
    const response = await this.zilliqa.blockchain.getDSBlockListing(pageNum)
    const blockList = response.result
    const blockListData: any[] = blockList.data

    // Map DSBlock with header info
    const output = await Promise.all(blockListData.map(async block => {
      const blockData = await this.zilliqa.blockchain.getDSBlock(block.BlockNum)

      return {
        header: { ...blockData.result.header, Hash: block.Hash },
        signature: blockData.result.signature,
      }
    }))
    return {
      maxPages: blockList.maxPages,
      data: output as DsBlockObj[]
    }
  }

  //================================================================================
  // TxBlocks-related
  //================================================================================

  async getNumTxBlocks(): Promise<number> {
    console.log("getting number of tx blocks")
    const response = await this.zilliqa.blockchain.getNumTxBlocks()
    return parseInt(response.result)
  }

  async getTxBlockDetails(blockNum: number): Promise<MappedTxBlock> {
    console.log("getting tx block details")
    const blockData = await this.zilliqa.blockchain.getTxBlock(blockNum)
    const transactionData = await this.getTransactionsForTxBlock(blockNum)
    blockData.result['txnHashes'] = transactionData
    console.log(blockData.result)
    return blockData.result as MappedTxBlock
  }

  async getLatest5TxBlocks(): Promise<TxBlockObj[]> {
    console.log("getting 5 tx blocks")
    const response = await this.zilliqa.blockchain.getTxBlockListing(1)
    const txBlockListing: any[] = response.result.data.slice(0, 5)

    // Map TxBlock with header info
    const output = await Promise.all(txBlockListing.map(async block => {
      const blockData = await this.zilliqa.blockchain.getTxBlock(block.BlockNum)
      return {
        header: { ...blockData.result.header },
        body: blockData.result.body,
      }
    }))
    return output as TxBlockObj[]
  }

  async getTxBlocksListing(pageNum: number): Promise<MappedTxBlockListing> {
    console.log("getting tx blocks")
    const response = await this.zilliqa.blockchain.getTxBlockListing(pageNum)
    const blockList = response.result
    const blockListData: any[] = blockList.data

    // Map TxBlock with header info
    const output = await Promise.all(blockListData.map(async block => {
      const blockData = await this.zilliqa.blockchain.getTxBlock(block.BlockNum)

      return {
        header: { ...blockData.result.header },
        body: blockData.result.body,
      }
    }))
    return {
      maxPages: blockList.maxPages,
      data: output as TxBlockObj[]
    }
  }

  //================================================================================
  // Transactions-related
  // WIP
  //================================================================================

  async getLatest5ValidatedTransactions(): Promise<TransactionObj[]> {
    console.log("getting 5 validated tx")
    const response = await this.zilliqa.blockchain.getRecentTransactions()
    const txnHashes: any[] = response.result.TxnHashes.slice(0, 5)

    // Map DSBlock with header info
    const output = await Promise.all(txnHashes.map(async txnHash => {
      const txn = await this.zilliqa.blockchain.getTransaction(txnHash)
      txn.amount = txn.amount.toString()
      return { ...txn, hash: txnHash }
    }))
    return output as TransactionObj[]
  }

  async getTransactionDetails(txnHash: string): Promise<TransactionObj> {
    console.log("getting transaction details")
    const blockData = await this.zilliqa.blockchain.getTransaction(txnHash.substring(2))
    blockData['hash'] = txnHash
    return blockData as TransactionObj
  }

  async getTransactionsForTxBlock(blockNum: number): Promise<string[]> {
    console.log("getting transactions for Tx block")
    const response = await this.zilliqa.blockchain.getTransactionsForTxBlock(blockNum)
    console.log(response)
    if (response.error) return [] as string[]
    else return response.result.flat()
  }

  async getTransactionsDetails(txnHashes: string[]): Promise<TransactionObj[]> {
    console.log("getting transactions details")
    const output = await Promise.all(txnHashes.map(async txnHash => {
      const txn = await this.zilliqa.blockchain.getTransaction(txnHash)
      txn.amount = txn.amount.toString()
      return { ...txn, hash: txnHash }
    }))
    return output as TransactionObj[]
  }

  async getRecentTransactions(): Promise<TxList> {
    console.log("getting recent transactions")
    const response = await this.zilliqa.blockchain.getRecentTransactions()
    const result: TxList = response.result
    return result
  }

  async getLatest5PendingTransactions(): Promise<PendingTxnResult[]> {
    console.log("getting 5 pending tx")
    const response = await this.zilliqa.blockchain.getPendingTxns()
    console.log(response)
    const output: any[] = response.result.Txns

    return output as PendingTxnResult[]
  }
}

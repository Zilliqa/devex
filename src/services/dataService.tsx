/* 
  Available Async Functions
  
  Blockchain-related:
  getBlockchainInfo(): Returns a BlockchainInfo object

  DSBlocks-related:
  getTxBlockDetails(blockNum: number): Return the details of the DSBlock with the corresponding block number
  getLatest5DSBlocks(): Returns an array of 5 DsBlockObj objects
  getDSBlocksListing(pageNum: number): Returns a MappedDSBlockListing object for the corresponding page number

  TxBlocks-related:
  getTxBlockDetails(blockNum: number): Return the details of the TxBlock with the corresponding block number
  getLatest5TxBlocks(): Returns an array of 5 TxBlockObj objects
  getTxBlocksListing(pageNum: number): Returns a MappedTxBlockListing object for the corresponding page number
  
  Transactions-related:
  getTransactionDetails(txnHash: string): Return the details of the transaction with the corresponding transaction hash
  getLatest5DSBlocks

*/

// import { environment } from '../environments/environment';
// import { Constants } from './constants';
// import { sha256 } from 'bcrypto';

import { Zilliqa } from '@zilliqa-js/zilliqa'
import { BlockchainInfo, DsBlockObj, TransactionObj, TxBlockObj, PendingTxnResult } from '@zilliqa-js/core/src/types'
import { MappedDSBlockListing, MappedTxBlockListing } from 'src/typings/api'

// Mainnet: https://api.zilliqa.com/
// Testnet: https://dev-api.zilliqa.com/

export interface MappedTxBlock extends TxBlockObj {
  transactions: string[];
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

  async getTxBlockDetails(blockNum: number): Promise<MappedTxBlock> {
    console.log("getting tx block details")
    const blockData = await this.zilliqa.blockchain.getTxBlock(blockNum)
    const transactionData = await this.getTransactionsForTxBlock(blockNum)
    blockData.result['transactions'] = transactionData
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

  async getLatest5PendingTransactions(): Promise<PendingTxnResult[]> {
    console.log("getting 5 pending tx")
    const response = await this.zilliqa.blockchain.getPendingTxns()
    console.log(response)
    const output: any[] = response.result.Txns

    return output as PendingTxnResult[]
  }


  //   /**
  //    * fetch the details of a specific object
  //    * @param {string} type - the type of object being fetched eg dsblock/microblock/transaction/address
  //    * @param {string} id - the unique identifier of the object being fetched
  //    * @returns {Promise} Promise object containing the list of required objects
  //    */
  //   getDetailData(type, id): Promise<any> {
  //     this.startLoading()
  //     var deferred = new $.Deferred()

  //     let that = this
  //     if (type == 'address') {
  //       // check for addresses starting with 0x
  //       if (id.substr(0, 2) == '0x') {
  //         id = id.substr(2)
  //       }

  //       this.node.getBalance({address: id}, function(err, data) {
  //         if (err) {
  //           deferred.reject(err)
  //         } else {
  //           deferred.resolve({
  //             result: Object.assign({address: id}, data.result) // merge address with API result
  //           })
  //         }
  //         that.endLoading()
  //       })
  //     } else if (type == 'transactions') {
  //       this.node.getTransaction({TxnHash: id}, function(err, data) {
  //         if (err) {
  //           deferred.reject(err)
  //         } else {
  //           try {
  //             // calculate fromAddress using the sender's pubkey
  //             let senderPubKey = data.result['senderPubKey']
  //             if (senderPubKey.substr(0, 2) == '0x') {
  //               senderPubKey = senderPubKey.substr(2)
  //             }
  //             data.result['fromAddr'] = sha256.digest(new Buffer(senderPubKey, 'hex')).toString('hex', 12)
  //           } catch (e) { }

  //           deferred.resolve({
  //             result: data.result
  //           })
  //         }
  //         that.endLoading()
  //       })

  //     } else if (type == 'dsblocks') {
  //       this.node.getDsBlock({blockNumber: id}, function(err, data) {
  //         if (err || data.result.Error) {
  //           deferred.reject(err)
  //         } else {
  //           deferred.resolve({
  //             result: data.result
  //           })
  //         }
  //         that.endLoading()
  //       })

  //     } else if (type == 'Txnblocks') {
  //       this.node.getTxnBlock({blockNumber: id}, function(err, data) {
  //         if (err || data.result.Error) {
  //           deferred.reject(err)
  //         } else {
  //           // temp - remove 'MicroBlockEmpty', 'MicroBlockHashes', 'HeaderSign' props
  //           try {
  //             delete data.result.body['MicroBlockEmpty']
  //             delete data.result.body['MicroBlockHashes']
  //             delete data.result.body['HeaderSign']
  //           } catch (e) { }

  //           deferred.resolve({
  //             result: data.result
  //           })
  //         }
  //         that.endLoading()
  //       })
  //     }

  //     return deferred.promise()
  //   }

  //   getContractHistory(addr): Promise<any> {
  //     this.startLoading()
  //     var deferred = new $.Deferred();
  //     let that = this

  //     this.node.getSmartContracts({address: addr}, function (err, data) {
  //       if (err || data.error) {
  //         deferred.reject(err)
  //       } else {
  //          deferred.resolve({
  //           result: data.result
  //         })
  //       }
  //       that.endLoading()
  //     })
  //     return deferred.promise()
  //   }

  //   getNumTxnsDSEpoch(): Promise<any> {
  //     var deferred = new $.Deferred()

  //     this.node.getNumTxnsDSEpoch({}, function(err, data) {
  //       if (err || data.Error) {
  //         deferred.reject(err)
  //       } else {
  //         deferred.resolve({
  //           result: data.result
  //         })
  //       }
  //     })

  //     return deferred.promise()
  //   }

  //   getNumTxnsTxnEpoch(): Promise<any> {
  //     var deferred = new $.Deferred()

  //     this.node.getNumTxnsTxnEpoch({}, function(err, data) {
  //       if (err || data.result.Error) {
  //         deferred.reject(err)
  //       } else {
  //         deferred.resolve({
  //           result: data.result
  //         })
  //       }
  //     })

  //     return deferred.promise()
  //   }

  //   getContractCode(addr): Promise<any> {
  //     this.startLoading()
  //     var deferred = new $.Deferred();
  //     let that = this

  //     this.node.getSmartContractCode({address: addr}, function (err, data) {
  //       if (err || (data.result && data.result.Error)) {
  //         deferred.reject(err)
  //       } else {
  //         deferred.resolve({
  //           result: data.result
  //         })
  //       }
  //       that.endLoading()
  //     })

  //     return deferred.promise()
  //   }

  //   startLoading() {
  //     setTimeout(() => {this.networkLoading = true}, 0)
  //   }

  //   endLoading() {
  //     setTimeout(() => {this.networkLoading = false}, 0)
  //   }
}

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

  Account-related:
  1) getAccData(accAddr: string): Promise<AccData>
  2) getAccContracts(accAddr: string): Promise<AccContracts>

  Contract-related:
  1) getContractAddrFromTransaction(txnHash: string): Promise<string>
  2) getContractData(contractAddr: string): Promise<ContractDetails>

  Util:
  1) isContractAddr(addr: string): Promise<boolean>

  Isolated Server-related:
  1) getISInfo(): Promise<any>

*/

// Mainnet: https://api.zilliqa.com/
// Testnet: https://dev-api.zilliqa.com/
// Isolated Server: https://zilliqa-isolated-server.zilliqa.com/
// Staging Isolated Server: https://stg-zilliqa-isolated-server.zilliqa.com/

import { Zilliqa } from '@zilliqa-js/zilliqa'
import { BlockchainInfo, DsBlockObj, TransactionObj, TxBlockObj, TxList, PendingTxnResult } from '@zilliqa-js/core/src/types'
import { MappedTxBlock, MappedDSBlockListing, MappedTxBlockListing, TransactionDetails, ContractDetails, AccData, AccContracts } from 'src/typings/api'

export class DataService {
  zilliqa: any;
  nodeUrl: string;

  constructor(nodeUrl: string | null) {
    if (nodeUrl) {
      this.nodeUrl = nodeUrl
      this.initDataService(nodeUrl)
    }
    else {
      this.nodeUrl = 'https://api.zilliqa.com/'
      this.initDataService('https://api.zilliqa.com/')
    }
  }

  initDataService(nodeUrl: string): void {
    this.zilliqa = new Zilliqa(nodeUrl)
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
    if (blockData.result.header.BlockNum !== blockNum)
      throw new Error('Invalid DS Block Number')
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
    if (blockData.result.header.BlockNum !== blockNum)
      throw new Error('Invalid Tx Block Number')
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

  async getTransactionDetails(txnHash: string): Promise<TransactionDetails> {
    console.log("getting transaction details")
    const blockData = await this.zilliqa.blockchain.getTransaction(txnHash.substring(2))
    blockData['hash'] = txnHash
    const contractAddr = await this.getContractAddrFromTransaction(txnHash.substring(2))
    if (contractAddr)
      blockData['contractAddr'] = contractAddr
    console.log(blockData)
    return blockData as TransactionDetails
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
    return response.result.Txns as PendingTxnResult[]
  }
 
  //================================================================================
  // Account-related
  //================================================================================
 
  async getAccData(accAddr: string): Promise<AccData> {
    console.log('getting balance')
    const response = await this.zilliqa.blockchain.getBalance(accAddr)
    console.log(response)
    return response.result
  }

  async getAccContracts(accAddr: string): Promise<AccContracts> {
    console.log('getting smart contracts for addr')
    const response = await this.zilliqa.blockchain.getSmartContracts(accAddr)
    console.log(response)
    return response.result
  }

  //================================================================================
  // Contract-related
  //================================================================================

  async getContractAddrFromTransaction(txnHash: string): Promise<string> {
    console.log('getting smart contracts code')
    const response = await this.zilliqa.blockchain.getContractAddressFromTransactionID(txnHash)
    console.log(response)
    return response.result
  }

  async getContractData(contractAddr: string): Promise<ContractDetails> {
    console.log('getting contract data')
    const contractCode = async () => await this.zilliqa.blockchain.getSmartContractCode(contractAddr)
    const contractInit = async () => await this.zilliqa.blockchain.getSmartContractInit(contractAddr)
    const contractState = async () => await this.zilliqa.blockchain.getSmartContractState(contractAddr)
    
    const res = await Promise.all([contractCode(), contractInit(), contractState()])
    const contractDetails = {code: res[0].result.code, initParams: res[1].result, state: res[2].result}
    console.log(contractDetails)
    return contractDetails
  }

  //================================================================================
  // Util
  //================================================================================
  
  /* Until we find a better way to differentiate an isolated server, we will differentiate based
    on the available API */
  async isIsolatedServer(): Promise<boolean> {
    console.log('check whether connected to isolated server')
    const response = await this.zilliqa.blockchain.getBlockChainInfo()
    if (response.result) {
      return false
    }
    console.log(response)
    return true  
  }

  async isContractAddr(addr: string): Promise<boolean> {
    console.log('check whether is smart contract')
    const response = await this.zilliqa.blockchain.getSmartContractInit(addr)
    console.log(response)
    if (!response.error)
      return true
    else if (response.error.code === -5)
      return false
    else
      throw new Error('Invalid Address')
  }

  //================================================================================
  // Isolated Server-related
  //================================================================================

  async getISInfo(): Promise<any> {
    console.log('getting isolated server info')

    const getBlockNum = async () => {
      const response = await fetch(this.nodeUrl, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "id": "1",
          "jsonrpc": "2.0",
          "method": "GetBlocknum",
          "params": [""]
        })
      });
      return response.json()
    }

    const getMinGasPrice = async () => await this.zilliqa.blockchain.getMinimumGasPrice()
    
    const res: any = await Promise.all([getBlockNum(), getMinGasPrice()])
    console.log(res)
    const output = {
      minGasPrice: res[1].result
    }
    console.log(output)
    return output

  }
  
}
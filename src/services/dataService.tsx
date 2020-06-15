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
  1) getLatest5ValidatedTransactions(): Promise<TransactionObj[]>
  2) getTransactionOwner(txnHash: string): Promise<string>
  3) getTransactionDetails(txnHash: string): Promise<TransactionDetails>
  4) getTransactionsForTxBlock(blockNum: number): Promise<string[]>
  5) getTransactionsDetails(txnHashes: string[]): Promise<TransactionObj[]>
  6) getRecentTransactions(): Promise<TxList>
  7) getLatest5PendingTransactions(): Promise<PendingTxnResult[]>

  Account-related:
  1) getAccData(accAddr: string): Promise<AccData>
  2) getAccContracts(accAddr: string): Promise<AccContracts>

  Contract-related:
  1) getContractAddrFromTransaction(txnHash: string): Promise<string>
  2) getTxnIdFromContractData(contractData: ContractData): Promise<string>
  3) getContractData(contractAddr: string): Promise<ContractData>
    
  Util:
  1) isIsolatedServer(): Promise<boolean>
  2) isContractAddr(addr: string): Promise<boolean>

  Isolated Server-related:
  1) getISInfo(): Promise<any>

*/

// Mainnet: https://api.zilliqa.com/
// Testnet: https://dev-api.zilliqa.com/
// Isolated Server: https://zilliqa-isolated-server.zilliqa.com/
// Staging Isolated Server: https://stg-zilliqa-isolated-server.zilliqa.com/

import { Zilliqa } from '@zilliqa-js/zilliqa'
import { BlockchainInfo, DsBlockObj, TransactionObj, TxBlockObj, TxList, PendingTxnResult } from '@zilliqa-js/core/src/types'
import { MappedTxBlock, MappedDSBlockListing, MappedTxBlockListing, TransactionDetails, ContractData, AccData, AccContracts } from 'src/typings/api'

import { hexAddrToZilAddr } from 'src/utils/Utils'

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
    if (!blockData.result)
      throw new Error('Invalid Tx Block Number')
    const transactionData = await this.getTransactionsForTxBlock(blockNum)
    blockData.result['txnHashes'] = transactionData
    if (parseInt(blockData.result.header.BlockNum) !== blockNum)
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
    const output = await Promise.all(txnHashes.map(async txnHash => (
      await this.getTransactionDetails(txnHash))))
    return output as TransactionObj[]
  }

  async getTransactionOwner(txnHash: string): Promise<string> {
    const blockData: TransactionObj = await this.zilliqa.blockchain.getTransaction(txnHash.substring(2))
    // @ts-ignore
    return hexAddrToZilAddr(blockData.senderAddress)
  }

  async getTransactionDetails(txnHash: string): Promise<TransactionDetails> {
    console.log("getting transaction details")
    if (txnHash.substring(0, 2) === '0x')
      txnHash = txnHash.substring(2)
    const txn = await this.zilliqa.blockchain.getTransaction(txnHash)
    if (txn.toAddr === '0x0000000000000000000000000000000000000000') {
      const contractAddr = await this.getContractAddrFromTransaction(txnHash)
      return { ...txn, hash: txnHash, contractAddr: contractAddr } as TransactionDetails
    }
    return { ...txn, hash: txnHash } as TransactionDetails
  }

  async getTransactionsForTxBlock(blockNum: number): Promise<string[]> {
    console.log("getting transactions for Tx block")
    const response = await this.zilliqa.blockchain.getTransactionsForTxBlock(blockNum)
    if (response.error) return [] as string[]
    else return response.result.flat()
  }

  async getTransactionsDetails(txnHashes: string[]): Promise<TransactionObj[]> {
    console.log("getting transactions details")
    const output = await Promise.all(txnHashes.map(
      async txnHash => (await this.getTransactionDetails(txnHash))))
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
    const txnHashes = response.result.Txns.map((x: any) => x.TxnHash)
    const output = await Promise.all(txnHashes.map(
      async (txnHash: any) => {
        const pendingTxn = await this.zilliqa.blockchain.getPendingTxn(txnHash)
        return {
          ...pendingTxn.result,
          hash: txnHash,
        }
    }))
    console.log(output)
    return output as PendingTxnResult[]
  }

  //================================================================================
  // Account-related
  //================================================================================

  async getAccData(accAddr: string): Promise<AccData> {
    console.log('getting balance')
    const response = await this.zilliqa.blockchain.getBalance(accAddr)
    return response.result
  }

  async getAccContracts(accAddr: string): Promise<AccContracts> {
    console.log('getting smart contracts for addr')
    const response = await this.zilliqa.blockchain.getSmartContracts(accAddr)
    return response.result
  }

  //================================================================================
  // Contract-related
  //================================================================================

  async getContractAddrFromTransaction(txnHash: string): Promise<string> {
    console.log('getting smart contracts addr')
    const response = await this.zilliqa.blockchain.getContractAddressFromTransactionID(txnHash)
    return response.result
  }

  async getTxnIdFromContractData(contractData: ContractData): Promise<string> {
    console.log('getting transaction id from contract data')
    const creationBlockData: MappedTxBlock = await this.getTxBlockDetails(
      parseInt(contractData.initParams.filter(x => x.vname === '_creation_block')[0].value))
    const contractAddrs = await Promise.all(creationBlockData.txnHashes.map(async (txnHash: string) => {
      const contractAddr = await this.getContractAddrFromTransaction(txnHash)
      return '0x' + contractAddr
    }))
    return '0x' + creationBlockData.txnHashes[contractAddrs.indexOf(
      contractData.initParams.filter(x => x.vname === '_this_address')[0].value)]
  }

  async getContractData(contractAddr: string): Promise<ContractData> {
    console.log('getting contract data')
    const contractCode = async () => await this.zilliqa.blockchain.getSmartContractCode(contractAddr)
    const contractInit = async () => await this.zilliqa.blockchain.getSmartContractInit(contractAddr)
    const contractState = async () => await this.zilliqa.blockchain.getSmartContractState(contractAddr)

    const res = await Promise.all([contractCode(), contractInit(), contractState()])
    const contractData = { code: res[0].result.code, initParams: res[1].result, state: res[2].result }
    return contractData
  }

  //================================================================================
  // Util
  //================================================================================

  /* Until we find a better way to differentiate an isolated server, we will differentiate based
    on the available API i.e. getBlockChainIfo */
  async isIsolatedServer(): Promise<boolean> {
    console.log('check whether connected to isolated server')
    const response = await this.zilliqa.blockchain.getBlockChainInfo()
    if (response.result) {
      return false
    }
    return true
  }

  /* Until we find a better way to differentiate an account address from a smart contract address, we will differentiate based
    on the the response error message if any */
  async isContractAddr(addr: string): Promise<boolean> {
    console.log('check whether is smart contract')
    const response = await this.zilliqa.blockchain.getSmartContractInit(addr)
    if (!response.error)
      return true
    else if (response.error.message === 'Address not contract address')
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

    const res = await Promise.all([getBlockNum(), getMinGasPrice()])
    const output = {
      minGasPrice: res[1].result
    }
    return output

  }
}

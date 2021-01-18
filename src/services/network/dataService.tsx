/* 
  Available Async Functions

  Blockchain-related:
  1) getBlockchainInfo(): Promise<BlockchainInfo>
  
  DSBlocks-related:
  1) getNumDSBlocks(): Promise<number>
  2) getDSBlockDetails(blockNum: string): Promise<DsBlockObj>
  3) getLatest5DSBlocks(): Promise<DsBlockObj[]>
  4) getDSBlocksListing(pageNum: number): Promise<DsBlockObjWithHashListing>
  5) getMinerInfo(blockNum: string): Promise<MinerInfo>

  TxBlocks-related:
  1) getNumTxBlocks(): Promise<number>
  2) getTxBlockObj(blockNum: number): Promise<TxBlockObj>
  3) getLatest5TxBlocks(): Promise<TxBlockObj[]>
  4) getTxBlocksListing(pageNum: number): Promise<TxBlockObjListing>

  Transactions-related:
  1) getLatest5ValidatedTransactions(): Promise<TransactionDetails[]>
  2) getTransactionOwner(txnHash: string): Promise<string>
  3) getTransactionDetails(txnHash: string): Promise<TransactionDetails>
  4) getTransactionsForTxBlock(blockNum: number): Promise<string[]>
  5) getTransactionsDetails(txnHashes: string[]): Promise<TransactionDetails[]>
  6) getRecentTransactions(): Promise<TxList>
  7) getLatest5PendingTransactions(): Promise<TransactionStatus[]>

  Account-related:
  1) getAccData(accAddr: string): Promise<AccData>
  2) getAccContracts(accAddr: string): Promise<ContractObj[]>

  Contract-related:
  1) getContractAddrFromTransaction(txnHash: string): Promise<string>
  2) getTxnIdFromContractData(contractData: ContractData): Promise<string>
  3) getContractData(contractAddr: string): Promise<ContractData>
  
  Isolated Server-related:
  1) getISInfo(): Promise<IISInfo>

  Util:
  1) isIsolatedServer(): Promise<boolean>
  2) isContractAddr(addr: string): Promise<boolean>
  
*/

// Mainnet: https://api.zilliqa.com
// Testnet: https://dev-api.zilliqa.com
// Isolated Server: https://zilliqa-isolated-server.zilliqa.com
// Staging Isolated Server: https://stg-zilliqa-isolated-server.zilliqa.com
// Seeds: https://stat.zilliqa.com/api/seeds

import { Zilliqa } from '@zilliqa-js/zilliqa'
import { ContractObj } from '@zilliqa-js/contract/src/types'
import { BlockchainInfo, DsBlockObj, TxBlockObj, TxList, MinerInfo, TransactionObj,TransactionStatus } from '@zilliqa-js/core/src/types'

import {
  DsBlockObjWithHashListing, TxBlockObjListing, TransactionDetails, ContractData,
  AccData, DsBlockObjWithHash, IISInfo
} from 'src/typings/api'
import { hexAddrToZilAddr, stripHexPrefix } from 'src/utils/Utils'

export class DataService {
  zilliqa: Zilliqa;
  networkUrl: string;

  constructor(networkUrl: string | null) {
    if (networkUrl) {
      this.networkUrl = networkUrl;
      this.zilliqa = new Zilliqa(networkUrl);
    } else {
      this.networkUrl = "https://api.zilliqa.com";
      this.zilliqa = new Zilliqa("https:/api.zilliqa.com");
    }
  }
  //================================================================================
  // Blockchain-related
  //================================================================================

  async getBlockchainInfo(): Promise<BlockchainInfo> {
    console.log("getting blockchain info");
    const response = await this.zilliqa.blockchain.getBlockChainInfo();
    if (response.error !== undefined) throw new Error(response.error.message);
    return response.result as BlockchainInfo;
  }

  //================================================================================
  // DSBlocks-related
  //================================================================================

  async getNumDSBlocks(): Promise<number> {
    console.log("getting number of DS blocks");
    const response = await this.zilliqa.blockchain.getNumDSBlocks();
    if (response.error !== undefined) throw new Error(response.error.message);
    return parseInt(response.result, 10);
  }

  async getDSBlockDetails(blockNum: string): Promise<DsBlockObj> {
    console.log("getting DS block details");
    const response = await this.zilliqa.blockchain.getDSBlock(
      parseInt(blockNum, 10)
    );
    if (response.error !== undefined) throw new Error(response.error.message);
    if (response.result.header.BlockNum !== blockNum)
      throw new Error("Invalid DS Block Number");
    return response.result as DsBlockObj;
  }

  async getLatest5DSBlocks(): Promise<DsBlockObj[]> {
    console.log("getting 5 ds blocks");
    const response = await this.zilliqa.blockchain.getDSBlockListing(1);
    if (response.error !== undefined) throw new Error(response.error.message);

    const latest5DSBlockShort = response.result.data.slice(0, 5);
    // Map DSBlock with header info
    const output = await Promise.all(
      latest5DSBlockShort.map(async (blockShort) => {
        const response = await this.zilliqa.blockchain.getDSBlock(
          blockShort.BlockNum
        );
        if (response.error !== undefined)
          throw new Error(response.error.message);
        return response.result as DsBlockObj;
      })
    );
    return output as DsBlockObj[];
  }

  async getDSBlocksListing(
    pageNum: number
  ): Promise<DsBlockObjWithHashListing> {
    console.log("getting ds blocks");
    const response = await this.zilliqa.blockchain.getDSBlockListing(pageNum);
    if (response.error !== undefined) throw new Error(response.error.message);
    const blockShorts = response.result.data;

    // Map DSBlock with header info
    const blockData = await Promise.all(
      blockShorts.map(async (blockShort) => {
        const response = await this.zilliqa.blockchain.getDSBlock(
          blockShort.BlockNum
        );
        if (response.error !== undefined)
          throw new Error(response.error.message);
        return {
          ...response.result,
          Hash: blockShort.Hash,
        } as DsBlockObjWithHash;
      })
    );
    return {
      maxPages: response.result.maxPages,
      data: blockData,
    };
  }

  async getMinerInfo(blockNum: string): Promise<MinerInfo> {
    console.log("getting miner info");
    const response = await this.zilliqa.blockchain.getMinerInfo(blockNum);
    console.log(response);
    if (response.error !== undefined) throw new Error(response.error.message);
    return response.result as MinerInfo;
  }

  //================================================================================
  // TxBlocks-related
  //================================================================================

  async getNumTxBlocks(): Promise<number> {
    console.log("getting number of tx blocks");
    const response = await this.zilliqa.blockchain.getNumTxBlocks();
    if (response.error !== undefined) throw new Error(response.error.message);
    return parseInt(response.result, 10);
  }

  async getTxBlockObj(blockNum: number): Promise<TxBlockObj> {
    console.log("getting tx block obj");
    const response = await this.zilliqa.blockchain.getTxBlock(blockNum);
    if (response.error !== undefined) throw new Error(response.error.message);
    if (parseInt(response.result.header.BlockNum) !== blockNum)
      throw new Error("Invalid Tx Block Number");
    return response.result as TxBlockObj;
  }

  async getLatest5TxBlocks(): Promise<TxBlockObj[]> {
    console.log("getting 5 tx blocks");
    const response = await this.zilliqa.blockchain.getTxBlockListing(1);
    if (response.error !== undefined) throw new Error(response.error.message);
    const blockShorts = response.result.data.slice(0, 5);

    // Map TxBlock with header info
    const output = await Promise.all(
      blockShorts.map(async (blockShort) => {
        const response = await this.zilliqa.blockchain.getTxBlock(
          blockShort.BlockNum
        );
        if (response.error !== undefined)
          throw new Error(response.error.message);
        return response.result as TxBlockObj;
      })
    );
    return output as TxBlockObj[];
  }

  async getTxBlocksListing(pageNum: number): Promise<TxBlockObjListing> {
    console.log("getting tx blocks");
    const response = await this.zilliqa.blockchain.getTxBlockListing(pageNum);
    if (response.error !== undefined) throw new Error(response.error.message);
    const blockShorts = response.result.data;

    // Map TxBlock with header info
    const blockData = (await Promise.all(
      blockShorts.map(async (blockShort) => {
        const response = await this.zilliqa.blockchain.getTxBlock(
          blockShort.BlockNum
        );
        if (response.error !== undefined)
          throw new Error(response.error.message);
        return response.result as TxBlockObj;
      })
    )) as TxBlockObj[];
    return {
      maxPages: response.result.maxPages,
      data: blockData,
    };
  }

  //================================================================================
  // Transactions-related
  //================================================================================

  async getLatest5ValidatedTransactions(): Promise<TransactionDetails[]> {
    console.log("getting 5 validated tx");
    const response = await this.zilliqa.blockchain.getRecentTransactions();
    if (response.error !== undefined) throw new Error(response.error.message);
    const txnHashes = response.result.TxnHashes.slice(0, 5);

    // Map DSBlock with header info
    const output = await Promise.all(
      txnHashes.map(
        async (txnHash) => await this.getTransactionDetails(txnHash)
      )
    );
    return output as TransactionDetails[];
  }

  async getTransactionOwner(txnHash: string): Promise<string> {
    const txn = await this.zilliqa.blockchain.getTransaction(
      stripHexPrefix(txnHash)
    );
    if (txn.senderAddress) return hexAddrToZilAddr(txn.senderAddress);
    else throw new Error("Invalid Transaction");
  }

  async getTransactionDetails(txnHash: string): Promise<TransactionDetails> {
    console.log("getting transaction details");
    txnHash = stripHexPrefix(txnHash);
    const txn = await this.zilliqa.blockchain.getTransaction(txnHash);
    if (
      txn.txParams &&
      txn.txParams.toAddr === "0x0000000000000000000000000000000000000000"
    ) {
      const contractAddr = await this.getContractAddrFromTransaction(txnHash);
      // @ts-ignore
      return {
        txn: txn,
        hash: txnHash,
        contractAddr: contractAddr,
        isContractCreation: true,
      } as TransactionDetails;
    } else if (await this.isContractAddr(txn.txParams.toAddr)) {
      // @ts-ignore
      return {
        txn: txn,
        hash: txnHash,
        contractAddr: txn.txParams.toAddr,
        isContractCreation: false,
      } as TransactionDetails;
    } else {
      // @ts-ignore
      return { txn: txn, hash: txnHash } as TransactionDetails;
    }
  }

  async getTransactionsForTxBlock(blockNum: number): Promise<string[]> {
    console.log("getting transactions for Tx block");
    const response = await this.zilliqa.blockchain.getTransactionsForTxBlock(
      blockNum
    );
    console.log(response);
    if (response.error !== undefined) throw new Error(response.error.message);
    return response.result.flat().filter((x) => x !== null) as string[];
  }

  async getTransactionsDetails(
    txnHashes: string[]
  ): Promise<TransactionDetails[]> {
    console.log("getting transactions details");
    const output = await Promise.all(
      txnHashes.map(
        async (txnHash) => await this.getTransactionDetails(txnHash)
      )
    );
    return output as TransactionDetails[];
  }

  async getRecentTransactions(): Promise<TxList> {
    console.log("getting recent transactions");
    const response = await this.zilliqa.blockchain.getRecentTransactions();
    if (response.error !== undefined) throw new Error(response.error.message);
    return response.result as TxList;
  }

  async getLatest5PendingTransactions(): Promise<TransactionStatus[]> {
    console.log("getting 5 pending tx")
    const pendingTxns = await this.zilliqa.blockchain.getPendingTxns()
    return pendingTxns.Txns as TransactionStatus[]
  }

  //================================================================================
  // Account-related
  //================================================================================

  async getAccData(accAddr: string): Promise<AccData> {
    console.log("getting balance");
    const response = await this.zilliqa.blockchain.getBalance(accAddr);
    if (response.error !== undefined) throw new Error(response.error.message);
    return response.result as AccData;
  }

  async getAccContracts(accAddr: string): Promise<ContractObj[]> {
    console.log("getting smart contracts for addr");
    const response = await this.zilliqa.blockchain.getSmartContracts(accAddr);
    if (response.error !== undefined) throw new Error(response.error.message);
    return response.result as ContractObj[];
  }

  //================================================================================
  // Isolated Server-related
  //================================================================================

  async getISBlockNum(): Promise<number> {
    console.log("getting isolated server tx block num");

    const response = await fetch(this.networkUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "1",
        jsonrpc: "2.0",
        method: "GetBlocknum",
        params: [""],
      }),
    });
    const parsedRes = await response.json();
    return parseInt(parsedRes.result, 10) as number;
  }

  async getISInfo(): Promise<IISInfo> {
    console.log("getting isolated server info");

    const blockNum = await this.getISBlockNum();

    const response = await this.zilliqa.blockchain.getMinimumGasPrice();
    if (response.error !== undefined) throw new Error(response.error.message);

    return {
      blockNum: blockNum,
      minGasPrice: response.result,
    } as IISInfo;
  }

  async getISTransactionsForTxBlock(blockNum: number): Promise<string[]> {
    console.log("getting transactions for Tx block");
    const response = await fetch(this.networkUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: "1",
        jsonrpc: "2.0",
        method: "GetTransactionsForTxBlock",
        params: [`${blockNum}`],
      }),
    });
    const res = await response.json();
    return res.result.map((txnObj: TransactionObj) => txnObj.ID) as string[];
  }

  async getTransactionDetailsSimplified({
    hash,
    toAddr,
  }: {
    hash: string;
    toAddr: string;
  }): Promise<TransactionDetails> {
    hash = stripHexPrefix(hash);
    if (toAddr === "0x0000000000000000000000000000000000000000") {
      const contractAddr = await this.getContractAddrFromTransaction(hash);
      // @ts-ignore
      return {
        hash,
        contractAddr: contractAddr,
        isContractCreation: true,
        toAddr,
      } as TransactionDetails;
    } else if (await this.isContractAddr(toAddr)) {
      // @ts-ignore
      return {
        hash,
        contractAddr: toAddr,
        isContractCreation: false,
        toAddr,
      } as TransactionDetails;
    } else {
      // @ts-ignore
      return { hash, toAddr } as TransactionDetails;
    }
  }

  //================================================================================
  // Contract-related
  //================================================================================

  async getContractAddrFromTransaction(txnHash: string): Promise<string> {
    console.log("getting smart contracts addr");
    const response = await this.zilliqa.blockchain.getContractAddressFromTransactionID(
      txnHash
    );
    if (response.error !== undefined) throw new Error(response.error.message);
    return response.result as string;
  }

  async getTxnIdFromContractData(contractData: ContractData): Promise<string> {
    console.log("getting transaction id from contract data");
    const _creationTxBlock = contractData.initParams.filter(
      (x) => x.vname === "_creation_block"
    )[0].value;
    const _contractAddr = contractData.initParams.filter(
      (x) => x.vname === "_this_address"
    )[0].value;

    if (
      typeof _creationTxBlock !== "string" ||
      typeof _contractAddr !== "string"
    )
      throw new Error("Type Error: Tx BlockNum or Contract Address not string");
    const txBlockTxns = await this.getTransactionsForTxBlock(
      parseInt(_creationTxBlock, 10)
    );
    const contractAddrs = await Promise.all(
      txBlockTxns.map(async (txnHash: string) => {
        let contractAddr: string | null;
        try {
          contractAddr = await this.getContractAddrFromTransaction(txnHash);
        } catch (e) {
          contractAddr = null;
        }
        return "0x" + contractAddr;
      })
    );
    return "0x" + txBlockTxns[contractAddrs.indexOf(_contractAddr)];
  }

  async getContractData(contractAddr: string): Promise<ContractData> {
    console.log("getting contract data");
    const contractCode = async () =>
      await this.zilliqa.blockchain.getSmartContractCode(contractAddr);
    const contractInit = async () =>
      await this.zilliqa.blockchain.getSmartContractInit(contractAddr);
    const contractState = async () =>
      await this.zilliqa.blockchain.getSmartContractState(contractAddr);

    const res = await Promise.all([
      contractCode(),
      contractInit(),
      contractState(),
    ]);
    if (res[0].error !== undefined) throw new Error(res[0].error.message);
    if (res[1].error !== undefined) throw new Error(res[1].error.message);
    if (res[2].error !== undefined) throw new Error(res[2].error.message);

    const contractData = {
      code: res[0].result.code,
      initParams: res[1].result,
      state: res[2].result,
    };
    return contractData as ContractData;
  }

  //================================================================================
  // Util
  //================================================================================

  /* Until we find a better way to differentiate an isolated server, we will differentiate based
    on the available API i.e. getBlockChainIfo */
  async isIsolatedServer(): Promise<boolean> {
    console.log("check whether connected to isolated server");
    const response = await this.zilliqa.blockchain.getBlockChainInfo();
    return !response.result;
  }

  /* Until we find a better way to differentiate an account address from a smart contract address, we will differentiate based
    on the the response error message if any */
  async isContractAddr(addr: string): Promise<boolean> {
    console.log("check whether is smart contract");
    const response = await this.zilliqa.blockchain.getSmartContractInit(addr);
    if (!response.error) return true;
    else if (response.error.message === "Address not contract address")
      return false;
    else throw new Error("Invalid Address");
  }
}

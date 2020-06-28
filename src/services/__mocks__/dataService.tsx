export const getBlockchainInfo = jest.fn()

export const getNumDSBlocks = jest.fn()
export const getDSBlockDetails = jest.fn()
export const getLatest5DSBlocks = jest.fn()
export const getDSBlocksListing = jest.fn()

export const getNumTxBlocks = jest.fn()
export const getLatest5TxBlocks = jest.fn()
export const getTxBlocksListing = jest.fn()

export const getLatest5ValidatedTransactions = jest.fn()
export const getTransactionOwner = jest.fn()
export const getTransactionDetails = jest.fn()
export const getTransactionsForTxBlock = jest.fn()
export const getTransactionsDetails = jest.fn()
export const getRecentTransactions = jest.fn()
export const getLatest5PendingTransactions = jest.fn()

export const getAccData = jest.fn()
export const getAccContracts = jest.fn()

export const getContractAddrFromTransaction = jest.fn()
export const getTxnIdFromContractData = jest.fn()
export const getContractData = jest.fn()
  
export const isIsolatedServer = jest.fn()
export const isContractAddr = jest.fn()

export const getISInfo = jest.fn()


const mockDataService = jest.fn().mockImplementation(() => {
})

export default mockDataService
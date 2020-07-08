import moment from 'moment'
import { units, BN, validation } from '@zilliqa-js/util'
import { getAddressFromPublicKey, toBech32Address } from '@zilliqa-js/crypto'

export const pubKeyToZilAddr: ((k: string) => string) = (pubKey: string) => {
  const strippedPubKey = stripHexPrefix(pubKey)
  if (!validation.isPubKey(strippedPubKey))
    return 'Invalid public key'
  else
    return toBech32Address(getAddressFromPublicKey(strippedPubKey))
}

export const hexAddrToZilAddr: ((addr: string) => string) = (hexAddr: string) => {
  if (!validation.isAddress(hexAddr))
    return 'Invalid hex-encoded address'
  else
    return toBech32Address(hexAddr)
}

// Convert timestamp to display format, M/D/YYYY, h:mm:ssa
export const timestampToDisplay: ((timestamp: string | number) => string) =
  (timestamp: string | number) => {
    if (typeof timestamp === 'string')
      return moment(parseInt(timestamp) / 1000).format("M/D/YYYY, h:mm:ssa")
    else
      return moment(timestamp / 1000).format("M/D/YYYY, h:mm:ssa")
  }

// Convert timestamp from microseconds to milliseconds and find timeago
export const timestampToTimeago: ((timestamp: string | number) => string) =
  (timestamp: string | number) => {
    if (typeof timestamp === 'string')
      return moment(parseInt(timestamp) / 1000).fromNow()
    else
      return moment(timestamp / 1000).fromNow()
  }

// Convert from Qa to Zil
export const qaToZil: ((amount: string | number, numOfDigits?: number) => string)
  = (amount: string | number, numOfDigits?: number) => {
    let parsedAmt = ''
    const splitAmt = units.fromQa(new BN(amount), units.Units.Zil).split('.')
    if (splitAmt.length === 1) {
      parsedAmt = parseInt(splitAmt[0]).toLocaleString('en')
    } else {
      parsedAmt = (parseInt(splitAmt[0])).toLocaleString('en') + '.' + splitAmt[1]
    }
    if (!numOfDigits)
      return parsedAmt + ' ZIL'
    let truncatedAmt = ''
    let counter = numOfDigits
    let i
    for (i = 0; i < parsedAmt.length; i++) {
      if ((counter) === 0)
        break
      truncatedAmt += parsedAmt[i]
      if (parsedAmt[i] !== '.' && parsedAmt[i] !== ',')
        counter--
    }
    if (i < parsedAmt.length)
      truncatedAmt += '...'
    return truncatedAmt + ' ZIL'
  }

// Strips hex prefix if exists
export const stripHexPrefix: ((inputHex: string) => string) = (inputHex: string) => {
  if (inputHex.substring(0, 2) === '0x')
    return inputHex.substring(2)
  return inputHex
}

// Add hex prefix if not already
export const addHexPrefix: ((inputHex: string) => string) = (inputHex: string) => {
  if (inputHex.substring(0, 2) !== '0x')
    return '0x' + inputHex
  return inputHex
}

export const isValidAddr: ((inputStr: string) => boolean) = (inputStr: string) => {
  const trimmedInput = inputStr.trim()
  let prefixedInput = trimmedInput
  if (trimmedInput.substring(0, 3) !== 'zil' && trimmedInput.substring(0, 2) !== '0x')
    prefixedInput = '0x' + trimmedInput
  if (validation.isAddress(prefixedInput) || validation.isBech32(prefixedInput))
    return true
  return false
}

type ErrorDetails = {
  status: string,
  description: string
}

export const errorCodeMapping: Record<number, ErrorDetails> = {
  0: {
    status: 'Confimed',
    description: 'Txn has been processed and confirmed'
  },
  1: {
    status: 'Pending',
    description: 'Txn has higher nonce than expected'
  },
  2: {
    status: 'Pending',
    description: 'Microblock has exceeded gas limit'
  },
  3: {
    status: 'Pending',
    description: 'Consensus failure in network'
  },
  4: {
    status: 'Error',
    description: 'Txn could not be found in the pool'
  },
  10: {
    status: 'Dropped',
    description: 'Math underflow or overflow encountered'
  },
  11: {
    status: 'Dropped',
    description: 'Failed to invoke scilla libraries'
  },
  12: {
    status: 'Dropped',
    description: 'Failed to initialise contract account'
  },
  13: {
    status: 'Dropped',
    description: 'Txn sent from an invalid account'
  },
  14: {
    status: 'Dropped',
    description: 'Txn\'s gas limit higher than shard/DS limit'
  },
  15: {
    status: 'Dropped',
    description: 'Txn could not be classified properly'
  },
  16: {
    status: 'Dropped',
    description: 'Txn not sharded to the correct shard'
  },
  17: {
    status: 'Dropped',
    description: 'Contract call txn does not have contract txn or from-account in same shard'
  },
  18: {
    status: 'Dropped',
    description: 'Code of contract txn is higher than prescribed limit'
  },
  19: {
    status: 'Dropped',
    description: 'Verfication of txn failed (signature, chain id, version)'
  },
  20: {
    status: 'Dropped',
    description: 'Txn\'s gas limit is insufficient'
  },
  21: {
    status: 'Dropped',
    description: 'Account has insufficient balance'
  },
  22: {
    status: 'Dropped',
    description: 'Txn has insufficient gas to invoke scilla checker'
  },
  23: {
    status: 'Dropped',
    description: 'Same txn was already present'
  },
  24: {
    status: 'Dropped',
    description: 'Txn with same nonce and higher gas price was present'
  },
  25: {
    status: 'Dropped',
    description: 'Type of to-address is invalid as it does not match txn receipient type'
  },
  26: {
    status: 'Dropped',
    description: 'Failed to add contract account to state'
  }
}
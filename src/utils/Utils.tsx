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
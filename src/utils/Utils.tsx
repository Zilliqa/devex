import moment from 'moment'
import { units, BN, validation } from '@zilliqa-js/util'
import { getAddressFromPublicKey, toBech32Address } from '@zilliqa-js/crypto'

export const pubKeyToZilAddr = (pubKey: string) => {
  if (!validation.isPubKey(pubKey))
    return 'Invalid public key'
  else
    return toBech32Address(getAddressFromPublicKey(pubKey))
}

export const hexAddrToZilAddr = (hexAddr: string) => {
  if (!validation.isAddress(hexAddr))
    return 'Invalid hex-encoded address'
  else
    return toBech32Address(hexAddr)
}

// Convert timestamp to display format, M/D/YYYY, h:mm:ssa
export const timestampToDisplay = (timestamp: string | number) => {
  if (typeof timestamp === 'string')
    return moment(parseInt(timestamp) / 1000).format("M/D/YYYY, h:mm:ssa")
  else
    return moment(timestamp / 1000).format("M/D/YYYY, h:mm:ssa")
}

// Convert timestamp from microseconds to milliseconds and find timeago
export const timestampToTimeago = (timestamp: string | number) => {
  if (typeof timestamp === 'string')
    return moment(parseInt(timestamp) / 1000).fromNow()
  else
    return moment(timestamp / 1000).fromNow()
}

// Convert from Qa to Zil
export const qaToZil = (amount: string | number) => {
  // @ts-ignore
  return units.fromQa(new BN(amount), units.Units.Zil).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + ' ZIL'
}

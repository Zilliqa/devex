/*
Not Used:
CreateTransaction
IncreaseBlocknum
SetMinimumGasPrice
GetNetworkID

Home:
GetBlocknum -- NOT IMPLEMENTED YET --
GetMinimumGasPrice

Contract Pages:
GetSmartContractSubState
GetSmartContractCode
GetSmartContractInit

Account Pages:
GetBalance
GetSmartContracts

Transaction Pages
GetTransaction
*/

import React, { useState, useEffect, useContext } from 'react'

import { NetworkContext } from 'src/services/networkProvider'

import './IsolatedServerPage.css'
import ISSearchbar from './ISSearchbar/ISSearchbar'

const IsolatedServerPage: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [data, setData] = useState<any>(null)

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let receivedData: any
    const getData = async () => {
      try {
        receivedData = await dataService.getISInfo()
        if (receivedData)
          setData(receivedData)
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [dataService])

  return <>
    {data && (
      <div>
        <ISSearchbar/>
      </div>
    )}
  </>
}

export default IsolatedServerPage

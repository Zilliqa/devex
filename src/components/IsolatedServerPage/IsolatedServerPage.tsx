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

import ISSearchbar from './ISSearchbar/ISSearchbar'
import { NetworkContext } from 'src/services/networkProvider'

import './IsolatedServerPage.css'

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
    // Run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>
    {data && (
      <div>
        <ISSearchbar />
      </div>
    )}
  </>
}

export default IsolatedServerPage

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
import { Spinner } from 'react-bootstrap'

import Searchbar from 'src/components/HomePage/Searchbar/Searchbar'
import { NetworkContext } from 'src/services/networkProvider'

import './IsolatedServerPage.css'

const IsolatedServerPage: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let receivedData: any
    const getData = async () => {
      try {
        setIsLoading(true)
        receivedData = await dataService.getISInfo()
        if (receivedData)
          setData(receivedData)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }
    getData()
    // Run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>
    {isLoading ? <div className='center-spinner'><Spinner animation="border" variant="secondary" /></div> : null}
    {data && (
      <div>
        <Searchbar isISSearchbar={true} isHeaderSearchbar={false} />
      </div>
    )}
  </>
}

export default IsolatedServerPage

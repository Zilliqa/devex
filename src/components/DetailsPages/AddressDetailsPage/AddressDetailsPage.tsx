import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'

import { NetworkContext } from 'src/services/network/networkProvider'
import { isValidAddr } from 'src/utils/Utils'

import AccountDetailsPage from './AccountDetailsPage/AccountDetailsPage'
import ContractDetailsPage from './ContractDetailsPage/ContractDetailsPage'
import NotFoundPage from '../../ErrorPages/NotFoundPage'

const AddressDetailsPage: React.FC = () => {

  const { addr } = useParams()
  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isContract, setIsContract] = useState<boolean | null>(null)

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let isContractRes: boolean
    const getData = async () => {
      try {
        setIsLoading(true)
        isContractRes = await dataService.isContractAddr(addr)
        setIsContract(isContractRes)
      } catch (e) {
        console.log(e)
        if (isValidAddr(addr))
          setIsContract(false)
        else
          setError(e)
      } finally {
        setIsLoading(false)
      }
    }
    getData()
    return () => {
      setIsContract(null)
      setError(null)
    }
  }, [addr, dataService])

  return <>
    {isLoading ? <div className='center-spinner'><Spinner animation="border" /></div> : null}
    {error
      ? <NotFoundPage />
      : <>
        {isContract !== null
          ? isContract
            ? <ContractDetailsPage addr={addr} />
            : <AccountDetailsPage addr={addr} />
          : null}
      </>
    }
  </>
}

export default AddressDetailsPage

import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import AccountDetailsPage from './AccountDetailsPage/AccountDetailsPage'
import ContractDetailsPage from './ContractDetailsPage/ContractDetailsPage'
import { NetworkContext } from 'src/services/networkProvider'
import NotFoundPage from '../NotFoundPage/NotFoundPage'

const AddressDetailsPage: React.FC = () => {

  const { addr } = useParams()
  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const [error, setError] = useState<string | null>(null)
  const [isContract, setIsContract] = useState<boolean | null>(null)

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let isContractRes: boolean
    const getData = async () => {
      try {
        isContractRes = await dataService.isContractAddr(addr)
        setIsContract(isContractRes)
      } catch (e) {
        console.log(e)
        setError(e)
      }
    }
    getData()
    return () => {
      setIsContract(null)
      setError(null)
    }
    // Run only once for each block
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addr])

  return <>
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

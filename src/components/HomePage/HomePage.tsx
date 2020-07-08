import React, { useContext } from 'react'
import { Spinner } from 'react-bootstrap'

import { NetworkContext } from 'src/services/network/networkProvider'

import Dashboard from './Dashboard/Dashboard'
import Searchbar from './Searchbar/Searchbar'

/*
            Home Layout
    ++++++++++++++++++++++++++++
    |        Search Bar        |
    ++++++++++++++++++++++++++++
    |                          |
    |                          |
    |        Dashboard         |
    |                          |
    |                          |
    ++++++++++++++++++++++++++++
*/
const HomePage: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { isIsolatedServer } = networkContext!

  return (
    <>
      {isIsolatedServer !== null // wait for isolated server check to complete
        ? <div>
          <Searchbar isISSearchbar={isIsolatedServer} isHeaderSearchbar={false} />
          <Dashboard />
        </div>
        : <div className='center-spinner'><Spinner animation="border" /></div>
      }
    </>
  )
}

export default HomePage

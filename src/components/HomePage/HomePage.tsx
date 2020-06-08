import React, { useContext } from 'react'

import { NetworkContext } from 'src/services/networkProvider'

import Dashboard from './Dashboard/Dashboard'
import Searchbar from './Searchbar/Searchbar'
import IsolatedServerPage from '../IsolatedServerPage/IsolatedServerPage'

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
    {isIsolatedServer !== null
      ? isIsolatedServer
        ? <IsolatedServerPage />
        : <div>
          <Searchbar isISSearchbar={false} isHeaderSearchbar={false} />
          <Dashboard />
        </div>
      : null
    }
  </>
  );
}

export default HomePage;

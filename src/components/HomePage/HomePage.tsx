import React, { useContext, useState, useEffect } from 'react'

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
  const { dataService } = networkContext!
  const [isIsolatedServer, setIsolatedServer] = useState<boolean | null>(null)

  useEffect(() => {
    if (!dataService) return

    const checkNetwork = async () => {
      try {
        setIsolatedServer(null)
        let res: boolean = await dataService.isIsolatedServer()
        setIsolatedServer(res)
      } catch (e) {
        console.log(e)
      }
    }
    checkNetwork()
  }, [dataService])

  return (<>
    {isIsolatedServer !== null
      ? isIsolatedServer
        ? <IsolatedServerPage />
        : <div>
          <Searchbar isHeaderSearchbar={false} />
          <Dashboard />
        </div>
      : null
    }
  </>
  );
}

export default HomePage;

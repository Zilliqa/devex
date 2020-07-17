import React from 'react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { shallow, mount } from 'enzyme'
import Layout from 'src/components/Layout/Layout'
import App from 'src/components/Layout/App/App'
import { NetworkContext } from 'src/services/network/networkProvider'
import { Spinner } from 'react-bootstrap'

describe('react router test', () => {
  const history = createMemoryHistory()

  it('renders layout', () => {
    const homePage = shallow(
      <Router history={history}>
        <Layout />
      </Router>
    )
    expect(homePage.find(Layout)).toHaveLength(1)
  })

  it('renders a spinner when in network transition', () => {
    const homePage = mount(
      <Router history={history}>
        <NetworkContext.Provider value={{
          isValidUrl: null,
          isIsolatedServer: true,
          dataService: null,
          networkUrl: '',
          inTransition: true,
          isLoadingNetworks: true
        }}>
        <App />
        </NetworkContext.Provider>
      </Router>
    )

    expect(homePage.find(Spinner)).toHaveLength(1)
  })
  
})
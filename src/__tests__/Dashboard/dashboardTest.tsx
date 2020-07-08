import * as React from 'react'
import { mount } from 'enzyme'
import Dashboard from 'src/components/HomePage/Dashboard/Dashboard'
import { BrowserRouter as Router } from 'react-router-dom'
import { NetworkContext } from 'src/services/network/networkProvider'

describe('Isolated Server <Dashboard />', () => {

  const dashboard = mount(
    <Router>
      <NetworkContext.Provider value={{
        isValidUrl: null,
        isIsolatedServer: true,
        dataService: null,
        nodeUrl: '',
        inTransition: true,
        isLoadingUrls: true
      }}>
        <Dashboard />
      </NetworkContext.Provider>
    </Router>
  )

  it('matches snapshot', () => {
    expect(dashboard).toMatchSnapshot()
  })

})

describe('Non-Isolated Server <Dashboard />', () => {

  const dashboard = mount(
    <Router>
      <NetworkContext.Provider value={{
        isValidUrl: null,
        isIsolatedServer: false,
        dataService: null,
        nodeUrl: '',
        inTransition: true,
        isLoadingUrls: true
      }}>
        <Dashboard />
      </NetworkContext.Provider>
    </Router>
  )

  it('matches snapshot', () => {
    expect(dashboard).toMatchSnapshot()
  })

})
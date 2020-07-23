import * as React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import NetworkSwitcher from 'src/components/Layout/Header/NetworkSwitcher'
import DropdownItem from 'react-bootstrap/DropdownItem'

const mockHistoryPush = jest.fn()

jest.mock("react-router-dom", () => {
  const orig = jest.requireActual("react-router-dom")
  return {
    ...orig,
    useHistory: () => ({
      push: mockHistoryPush
    })
  }
})

jest.mock("src/services/network/networkProvider", () => {
  const orig = jest.requireActual("src/services/network/networkProvider")
  return {
    ...orig,
    defaultNetworks: {
      'https://api.zilliqa.com': 'Mainnet',
      'https://dev-api.zilliqa.com': 'Testnet',
      'https://zilliqa-isolated-server.zilliqa.com': 'Isolated Server',
      'http://52.187.126.172:4201': 'Mainnet Staked Seed Node'
    },
    useNetworkName: () => ('Mainnet'),
    useNetworkUrl: () => ('https://api.zilliqa.com'),
  }
})

describe('<NetworkSwitcher />', () => {
  const mockSetNetworkMap = jest.fn()

  beforeEach(() => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      networkMap: new Map([
        ['https://api.zilliqa.com', 'Mainnet'],
        ['https://dev-api.zilliqa.com', 'Testnet']]),
      setNetworkMap: mockSetNetworkMap
    }))
  })

  it('renders with a given list of default networks and switches correctly', () => {
    const wrapper = shallow(<NetworkSwitcher />)
    expect(wrapper).toMatchSnapshot()
    wrapper.find(DropdownItem).findWhere(node => node.text() === 'Testnet').at(0).simulate('click')
  })

  it('renders with no networks and matches snapshot', () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      networkMap: new Map(),
      setNetworkMap: mockSetNetworkMap
    }))
    const wrapper = shallow(<NetworkSwitcher />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
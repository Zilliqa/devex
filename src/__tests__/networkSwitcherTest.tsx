import * as React from 'react'
import { shallow } from 'enzyme'

import NetworkSwitcher from 'src/components/Layout/Header/NetworkSwitcher'
import { Form } from 'react-bootstrap'

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
  const mockSetNodeUrlMap = jest.fn()

  beforeEach(() => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      nodeUrlMap: {},
      setNodeUrlMap: mockSetNodeUrlMap
    }))
  })

  it('renders with a given list of default networks and switches correctly', () => {
    const wrapper = shallow(<NetworkSwitcher />)
    expect(wrapper).toMatchSnapshot()

    wrapper.findWhere(node => node.key() === 'https://dev-api.zilliqa.com').simulate('click')

    expect(mockHistoryPush).toHaveBeenCalledWith({ "pathname": "/", "search": "?network=https%3A%2F%2Fdev-api.zilliqa.com" })
  })

  it('adds new network url correctly', () => {
    const wrapper = shallow(<NetworkSwitcher />)
    const inputUrlForm = wrapper.find(Form)
    inputUrlForm.simulate('submit', {
      preventDefault: jest.fn(),
      target: { name: "networkUrl", value: "spam" }
    })
    expect(mockSetNodeUrlMap).toHaveBeenCalledTimes(1)
  })
})
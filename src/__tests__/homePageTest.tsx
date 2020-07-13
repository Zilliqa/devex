import * as React from 'react'
import { shallow } from 'enzyme'
import HomePage from 'src/components/HomePage/HomePage'
import toJson from 'enzyme-to-json'

describe('<HomePage /> without knowing isIsolatedServer', () => {

  jest.spyOn(React, 'useContext').mockImplementation(() => ({
    isIsolatedServer: null
  }))

  const homePage = shallow(<HomePage />)

  it('matches snapshot', () => {
    expect(toJson(homePage)).toMatchSnapshot()
  })

})

describe('Isolated Server\'s <HomePage />', () => {

  jest.spyOn(React, 'useContext').mockImplementation(() => ({
    isIsolatedServer: true
  }))

  const homePage = shallow(<HomePage />)

  it('matches snapshot', () => {
    expect(toJson(homePage)).toMatchSnapshot()
  })

})

describe('Non-Isolated Server <HomePage />', () => {

  jest.spyOn(React, 'useContext').mockImplementation(() => ({
    isIsolatedServer: false
  }))

  const homePage = shallow(<HomePage />)

  it('matches snapshot', () => {
    expect(toJson(homePage)).toMatchSnapshot()
  })

})
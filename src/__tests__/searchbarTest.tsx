import * as React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Searchbar from 'src/components/HomePage/Searchbar/Searchbar'

jest.mock("react-router-dom", () => {
  const orig = jest.requireActual("react-router-dom")
  return {
    ...orig,
    useLocation: () => ({})
  }
})

describe('Isolated Server Header <Searchbar />', () => {

  const searchbar = shallow(<Searchbar isISSearchbar={true} isHeaderSearchbar={true} />)

  it('matches snapshot', () => {
    expect(toJson(searchbar)).toMatchSnapshot()
  })

})

describe('Non-Isolated Server Header <Searchbar />', () => {

  const searchbar = shallow(<Searchbar isISSearchbar={false} isHeaderSearchbar={true} />)

  it('matches snapshot', () => {
    expect(toJson(searchbar)).toMatchSnapshot()
  })

})
describe('Isolated Server Non-Header <Searchbar />', () => {

  const searchbar = shallow(<Searchbar isISSearchbar={true} isHeaderSearchbar={false} />)

  it('matches snapshot', () => {
    expect(toJson(searchbar)).toMatchSnapshot()
  })

})
describe('Non-Isolated Server Non-Header <Searchbar />', () => {

  const searchbar = shallow(<Searchbar isISSearchbar={false} isHeaderSearchbar={false} />)

  it('matches snapshot', () => {
    expect(toJson(searchbar)).toMatchSnapshot()
  })

})
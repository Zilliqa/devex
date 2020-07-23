import * as React from 'react'
import { shallow } from 'enzyme'
import LabelStar from 'src/components/DetailsPages/Misc/LabelComponent/LabelStar'
import toJson from 'enzyme-to-json'

jest.mock("react-router-dom", () => {
  const orig = jest.requireActual("react-router-dom")
  return {
    ...orig,
    useLocation: () => ({})
  }
})

describe('<LabelStar />', () => {

  jest.spyOn(React, 'useContext').mockImplementation(() => ({
    labelMap: {},
    setLabelMap: jest.fn(),
    networkMap: new Map(),
  }))
  
  const labelStar = shallow(<LabelStar type='account' />)

  it('matches snapshot', () => {
    expect(toJson(labelStar)).toMatchSnapshot()
  })

})
import React, { useContext, useState } from 'react'
import { Container, Col, Row, Dropdown } from 'react-bootstrap'

import { defaultNetworks, useNetworkUrl } from 'src/services/networkProvider'
import { UserPrefContext } from 'src/services/userPrefProvider'

import LabelCard from './LabelCard/LabelCard'
import './LabelsPage.css'

const LabelsPage: React.FC = () => {
  const userPrefContext = useContext(UserPrefContext)
  const networkUrl = useNetworkUrl()
  const { labelMap, nodeUrlMap } = userPrefContext!

  const [typefilter, setTypefilter] = useState('All')
  const [networkFilter, setNetworkFilter] = useState(networkUrl)

  return (
    <>
      <Container style={{ padding: '1rem' }}>
        <Row style={{ alignItems: 'baseline', margin: 0 }}>
          <h4>
            Labels
          </h4>
        </Row>
        <Row style={{ margin: 0, padding: '0 0 1rem' }}>
          <span className='subtext'>Label data is stored in your browser's local storage. To browse labels in different networks, switch to that network using network selector.</span>
        </Row>
        <Row style={{ alignItems: 'baseline' }}>
          <span style={{ marginLeft: '1rem' }}>
            Network:
          </span>
          <Dropdown className="label-filter">
            <Dropdown.Toggle id="label-network-toggle">{defaultNetworks[networkFilter] || networkFilter}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setNetworkFilter('All')}>All</Dropdown.Item>
              {Object.entries({ ...defaultNetworks, ...nodeUrlMap }).map(([k, v], index) =>
                <Dropdown.Item onClick={() => setNetworkFilter(k)} key={index}>{v}</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
          <span style={{ marginLeft: '1rem' }}>
            Label Type:
          </span>
          <Dropdown className="label-filter">
            <Dropdown.Toggle id="label-type-toggle">{typefilter}</Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setTypefilter('All')}>All</Dropdown.Item>
              <Dropdown.Item onClick={() => setTypefilter('Address')}>Addresss</Dropdown.Item>
              <Dropdown.Item onClick={() => setTypefilter('Transaction')}>Transactions</Dropdown.Item>
              <Dropdown.Item onClick={() => setTypefilter('Tx Block')}>Tx Blocks</Dropdown.Item>
              <Dropdown.Item onClick={() => setTypefilter('DS Block')}>DS Blocks</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Row>
        <Row style={{ marginTop: '1rem' }}>
          {Object.entries(labelMap)
            .filter(([k, v]) => (typefilter === 'All' || v.type === typefilter))
            .filter(([k, v]) => (networkFilter === 'All' || v.network === networkFilter))
            .map(([k, v]) => (
              <Col style={{ marginBottom: '2rem' }} key={k} md={6} lg={4} >
                <LabelCard k={k} v={v} />
              </Col>
            ))}
        </Row>
      </Container>
    </>
  )
}

export default LabelsPage

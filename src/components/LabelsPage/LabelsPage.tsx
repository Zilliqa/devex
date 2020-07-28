import React, { useContext, useState } from 'react'
import { Container, Col, Row, Dropdown, Form } from 'react-bootstrap'

import { defaultNetworks } from 'src/services/network/networkProvider'
import { UserPrefContext } from 'src/services/userPref/userPrefProvider'

import LabelCard from './LabelCard/LabelCard'
import Dropzone from '../Misc/Dropzone/Dropzone'
import ImportExport from '../Misc/ImportExport/ImportExport'

import './LabelsPage.css'

const LabelsPage: React.FC = () => {

  const userPrefContext = useContext(UserPrefContext)
  const { labelMap, networkMap, setLabelMap } = userPrefContext!

  const [searchFilter, setSearchFilter] = useState('')
  const [typefilter, setTypefilter] = useState('All')
  const [networkNameFilter, setNetworkNameFilter] = useState('All')

  return (
    <>
      <Container>
        <Row className='m-0'>
          <h4>
            Labels
          </h4>
        </Row>
        <Row className='m-0 pb-3'>
          <span className='subtext'>Label data is stored in your browser&apos;s local storage.</span>
        </Row>
        <Row className='justify-content-between flex-nowrap m-0'>
          <div className='filter-div'>
            <span>
              Network:
            </span>
            <Dropdown className="ml-3">
              <Dropdown.Toggle id="label-network-toggle">
                {networkMap.get(networkNameFilter) || defaultNetworks.get(networkNameFilter) || networkNameFilter}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setNetworkNameFilter('All')}>All</Dropdown.Item>
                {
                  [...new Set(Object.values(labelMap).map(label => label.networkName))]
                    .map((labelName, index) => (
                      <Dropdown.Item onClick={() => setNetworkNameFilter(labelName)} key={index}>{labelName}</Dropdown.Item>
                    ))
                }
              </Dropdown.Menu>
            </Dropdown>
            <span className='ml-3'>
              Label Type:
            </span>
            <Dropdown className="ml-3">
              <Dropdown.Toggle id="label-type-toggle">{typefilter}</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setTypefilter('All')}>All</Dropdown.Item>
                <Dropdown.Item onClick={() => setTypefilter('Account')}>Accounts</Dropdown.Item>
                <Dropdown.Item onClick={() => setTypefilter('Contract')}>Contracts</Dropdown.Item>
                <Dropdown.Item onClick={() => setTypefilter('Transaction')}>Transactions</Dropdown.Item>
                <Dropdown.Item onClick={() => setTypefilter('Tx Block')}>Tx Blocks</Dropdown.Item>
                <Dropdown.Item onClick={() => setTypefilter('DS Block')}>DS Blocks</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Form.Control
              className='search-filter-form'
              type="text"
              value={searchFilter}
              autoFocus
              placeholder='Search for label'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchFilter(e.target.value) }} />
          </div>
          <ImportExport
            type='labels'
            map={labelMap}
            setMapCb={setLabelMap}
            />
        </Row>
        <Row className='mt-3'>
          {Object.entries(labelMap).length === 0
            ? <Dropzone
              fromJson={(x: any) => x}
              dropCb={setLabelMap} />
            : Object.entries(labelMap)
              .filter(([, v]) => (typefilter === 'All' || v.type === typefilter))
              .filter(([, v]) => (networkNameFilter === 'All' || v.networkName === networkNameFilter))
              .filter(([, v]) => (v.name.includes(searchFilter)))
              .map(([k, v]) => (
                <Col className='my-3' key={k} md={6} lg={4} >
                  <LabelCard k={k} v={v} />
                </Col>
              ))}
        </Row>
      </Container>
    </>
  )
}

export default LabelsPage

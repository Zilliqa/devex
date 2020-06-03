import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Card, Container, Row, Col } from 'react-bootstrap'

import InfoTabs from 'src/components/DetailsPages/InfoTabs/InfoTabs'
import DefaultTab from 'src/components/DetailsPages/InfoTabs/DefaultTab'
import CodeTab from 'src/components/DetailsPages/InfoTabs/CodeTab'
import { NetworkContext } from 'src/services/networkProvider'
import { ContractDetails } from 'src/typings/api'
import { qaToZil } from 'src/utils/Utils'

import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '../AddressDetailsPage.css'

type IProps = {
  addr: string,
}

const ContractDetailsPage: React.FC<IProps> = ({ addr }) => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const addrRef = useRef(addr)
  const [contractData, setContractData] = useState<ContractDetails | null>(null)

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let receivedData: any
    const getData = async () => {
      try {
        receivedData = await dataService.getContractData(addrRef.current)
        if (receivedData)
          setContractData(receivedData)
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [dataService])

  const generateTabsObj = () => {

    const tabs: { tabHeaders: string[], tabTitles: string[], tabContents: React.ReactNode[] } = {
      tabHeaders: [],
      tabTitles: [],
      tabContents: [],
    }

    if (!contractData) return tabs

    tabs.tabHeaders.push('initParams')
    tabs.tabTitles.push('Init Parameters')
    tabs.tabContents.push(<DefaultTab content={contractData.initParams} />)

    tabs.tabHeaders.push('State')
    tabs.tabTitles.push('State')
    tabs.tabContents.push(<DefaultTab content={contractData.state} />)

    tabs.tabHeaders.push('code')
    tabs.tabTitles.push('Code')
    tabs.tabContents.push(<CodeTab code={contractData.code} />)

    return tabs
  }

  return <>
    {contractData && (
      <>
        <div className='address-header'>
          <h3>
            Contract
        </h3>
        </div>
        <div style={{ display: 'flex' }}>
          <h6 className='address-hash'>{addrRef.current}</h6>
          <div onClick={() => {
            navigator.clipboard.writeText(addrRef.current)
          }} className='address-hash-copy-btn'>
            <FontAwesomeIcon icon={faCopy} />
          </div>
        </div>
        <Card className='address-details-card'>
          <Card.Body>
            <Container>
              <Row>
                <Col>
                  <div className='address-detail'>
                    <span className='address-detail-header'>Balance:</span>
                    <span>{qaToZil(contractData.state['_balance'])}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='address-detail'>
                    <span className='address-detail-header'>Created:</span>
                    <span>
                      {'Block '}
                      <Link to={`/txbk/${contractData.initParams.filter(x => x.vname === '_creation_block')[0].value}`}>
                        {contractData.initParams.filter(x => x.vname === '_creation_block')[0].value}
                      </Link>
                    </span>
                  </div>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
        <InfoTabs tabs={generateTabsObj()} />
      </>
    )}
  </>
}

export default ContractDetailsPage

import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Card, Container, Row, Col } from 'react-bootstrap'

import InfoTabs from 'src/components/DetailsPages/InfoTabs/InfoTabs'
import DefaultTab from 'src/components/DetailsPages/InfoTabs/DefaultTab'
import CodeTab from 'src/components/DetailsPages/InfoTabs/CodeTab'
import { NetworkContext } from 'src/services/networkProvider'
import { ContractData } from 'src/typings/api'
import { qaToZil } from 'src/utils/Utils'

import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faFileContract } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '../AddressDetailsPage.css'

interface IProps {
  addr: string,
}

const ContractDetailsPage: React.FC<IProps> = ({ addr }) => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const addrRef = useRef(addr)
  const [contractData, setContractData] = useState<ContractData | null>(null)
  const [creationTxnHash, setCreationTxnHash] = useState<string | null>(null)
  const [owner, setOwner] = useState<string | null>(null)

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let contractData: ContractData
    let creationTxnHash: string
    let owner: string
    const getData = async () => {
      try {
        contractData = await dataService.getContractData(addrRef.current)
        creationTxnHash = await dataService.getTxnIdFromContractData(contractData)
        owner = await dataService.getTransactionOwner(creationTxnHash)
      } catch (e) {
        console.log(e)
      } finally {
        if (contractData)
          setContractData(contractData)
        if (creationTxnHash)
          setCreationTxnHash(creationTxnHash)
        if (owner)
          setOwner(owner)
      }
    }
    getData()
    // Run only once for each block
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
            <span>
              <FontAwesomeIcon color='grey' icon={faFileContract} />
            </span>
            <span style={{ marginLeft: '0.75rem' }}>
              Contract
            </span>
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
              {creationTxnHash && <>
              <Row>
                <Col>
                  <div className='address-detail' style={{ justifyContent: 'start' }}>
                    <span className='address-detail-header' style={{ marginRight:'auto' }}>Contract Creation:</span>
                    <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Link to={`/address/${owner}`}>
                        {owner}
                      </Link>
                    </span>
                    <span>{'at'}</span>
                    <span style={{ paddingLeft:'0.5rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Link to={`/tx/${creationTxnHash}`}>
                        {creationTxnHash}
                      </Link>
                    </span>
                  </div>
                </Col>
              </Row>
              </>}
            </Container>
          </Card.Body>
        </Card>
        <InfoTabs tabs={generateTabsObj()} />
      </>
    )}
  </>
}

export default ContractDetailsPage

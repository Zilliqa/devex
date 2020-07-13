import React, { useContext, useState, useEffect, useRef } from 'react'
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap'

import { QueryPreservingLink } from 'src/services/network/networkProvider'
import InfoTabs from 'src/components/DetailsPages/InfoTabs/InfoTabs'
import DefaultTab from 'src/components/DetailsPages/InfoTabs/DefaultTab'
import CodeTab from 'src/components/DetailsPages/InfoTabs/CodeTab'
import { NetworkContext } from 'src/services/network/networkProvider'
import { ContractData } from 'src/typings/api'
import { qaToZil, addHexPrefix } from 'src/utils/Utils'
import { fromBech32Address, toBech32Address } from '@zilliqa-js/crypto'
import { validation } from '@zilliqa-js/util'

import { faFileContract } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Copyable from '../../Copyable/Copyable'
import LabelStar from '../../LabelComponent/LabelStar'
import ViewBlockLink from '../../ViewBlockLink/ViewBlockLink'

import '../AddressDetailsPage.css'

interface IProps {
  addr: string,
}

const ContractDetailsPage: React.FC<IProps> = ({ addr }) => {

  const networkContext = useContext(NetworkContext)
  const { dataService, isIsolatedServer, nodeUrl } = networkContext!

  const addrRef = useRef(addr)
  const [contractData, setContractData] = useState<ContractData | null>(null)
  const [creationTxnHash, setCreationTxnHash] = useState<string | null>(null)
  const [owner, setOwner] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch data
  useEffect(() => {
    setIsLoading(true)
    if (!dataService || isIsolatedServer === null) return

    let contractData: ContractData
    let creationTxnHash: string
    let owner: string
    const getData = async () => {
      try {
        if (isIsolatedServer) {
          contractData = await dataService.getContractData(addrRef.current)
        } else {
          contractData = await dataService.getContractData(addrRef.current)
          creationTxnHash = await dataService.getTxnIdFromContractData(contractData)
          owner = await dataService.getTransactionOwner(creationTxnHash)
        }
        if (contractData)
          setContractData(contractData)
        if (creationTxnHash)
          setCreationTxnHash(creationTxnHash)
        if (owner)
          setOwner(owner)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    }
    getData()
  }, [dataService, isIsolatedServer])

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
    {isLoading ? <div className='center-spinner'><Spinner animation="border" /></div> : null}
    {contractData && (
      <>
        <div className='address-header'>
          <h3>
            <span className='mr-1'>
              <FontAwesomeIcon className='fa-icon' icon={faFileContract} />
            </span>
            <span className='ml-2'>
              Contract
            </span>
            <LabelStar type='Contract' />
          </h3>
          <ViewBlockLink network={nodeUrl} type='address' identifier={addrRef.current} />
        </div>
        {/* Bech32 */}
        <Copyable
          textToBeCopied={
            validation.isBech32(addrRef.current)
              ? addrRef.current
              : toBech32Address(addrRef.current)}
        />
        {/* Hex */}
        <Copyable
          textToBeCopied={
            validation.isBech32(addrRef.current)
              ? addHexPrefix(fromBech32Address(addrRef.current).toLowerCase())
              : addHexPrefix(addrRef.current)}
        />
        <Card className='address-details-card'>
          <Card.Body>
            <Container>
              <Row>
                <Col>
                  <div className='address-detail'>
                    <span>Balance:</span>
                    <span>{qaToZil(contractData.state['_balance'])}</span>
                  </div>
                </Col>
              </Row>
              {creationTxnHash && <>
                <Row>
                  <Col>
                    <div className='address-detail'>
                      <span className='mr-auto'>Contract Creation:</span>
                      <span className='owner-span'>
                        <QueryPreservingLink to={`/address/${owner}`}>
                          {owner}
                        </QueryPreservingLink>
                      </span>
                      <span>{'at'}</span>
                      <span className='owner-span pl-2'>
                        <QueryPreservingLink to={`/tx/${creationTxnHash}`}>
                          {creationTxnHash}
                        </QueryPreservingLink>
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

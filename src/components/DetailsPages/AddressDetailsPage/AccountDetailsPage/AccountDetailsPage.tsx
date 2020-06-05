import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Card, Container, Row, Col } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'
import { qaToZil, hexAddrToZilAddr } from 'src/utils/Utils'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faWallet } from '@fortawesome/free-solid-svg-icons'

import '../AddressDetailsPage.css'
import { AccData, AccContracts } from 'src/typings/api'

type IProps = {
  addr: string,
}

const AccountDetailsPage: React.FC<IProps> = ({ addr }) => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const addrRef = useRef(addr)
  const [accData, setAccData] = useState<AccData | null>(null)
  const [accContracts, setAccContracts] = useState<AccContracts | null>(null)

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let accData: AccData
    let accContracts: AccContracts
    const getData = async () => {
      try {
        accData = await dataService.getAccData(addrRef.current)
        if (accData)
          setAccData(accData)
        accContracts = await dataService.getAccContracts(addrRef.current)
        if (accContracts)
          setAccContracts(accContracts)
      } catch (e) {
        console.log(e)
      }
    }
    getData()
    // Run only once for each block
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>
    {accData && (
      <>
        <div className='address-header'>
          <h3>
            <span>
              <FontAwesomeIcon color='grey' icon={faWallet} />
            </span>
            <span style={{ marginLeft: '0.75rem' }}>
              Account
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
                    <span>{qaToZil(accData.balance)}</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className='address-detail'>
                    <span className='address-detail-header'>Nonce:</span>
                    <span>{accData.nonce}</span>
                  </div>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
        {accContracts && accContracts.length > 0 && (
          <>
            <h4>Deployed Contracts</h4>
            <Card className='address-details-card'>
              <Card.Body>
                {accContracts.map((contract: any, index: number) => {
                  return <div key={index} style={{ padding: '0.25rem 0' }}>
                    {`${index + 1}) `}
                    {<Link to={`/address/${hexAddrToZilAddr(contract.address)}`}>
                      {hexAddrToZilAddr(contract.address)}
                    </Link>}
                  </div>
                })}
              </Card.Body>
            </Card>
          </>
        )}
      </>
    )}
  </>
}

export default AccountDetailsPage

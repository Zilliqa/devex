import React, { useContext, useState, useEffect, useRef, useCallback } from 'react'
import { Card, Container, Row, Col, Pagination, Spinner } from 'react-bootstrap'

import { NetworkContext } from 'src/services/networkProvider'
import { AccData, AccContracts, AccContract } from 'src/typings/api'
import { qaToZil } from 'src/utils/Utils'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import { faWallet } from '@fortawesome/free-solid-svg-icons'

import AccContractCard from './AccContractCard'
import '../AddressDetailsPage.css'

interface IProps {
  addr: string,
}

const AccountDetailsPage: React.FC<IProps> = ({ addr }) => {

  const networkContext = useContext(NetworkContext)
  const { dataService } = networkContext!

  const addrRef = useRef(addr)
  const [isLoading, setIsLoading] = useState(false)
  const [accData, setAccData] = useState<AccData | null>(null)
  const [accContracts, setAccContracts] = useState<AccContracts | null>(null)
  const [contractPageIndex, setContractPageIndex] = useState<number>(0)

  const generatePagination = useCallback((currentPage: number, pageCount: number, delta: number = 2) => {
    const separate = (a: number, b: number, isLower: boolean) => {
      let temp = b - a
      if (temp === 0)
        return [a]
      else if (temp === 1)
        return [a, b]
      else if (temp === 2)
        return [a, a + 1, b]
      else
        return [a, isLower ? -1 : -2, b]
    }

    return Array(delta * 2 + 1)
      .fill(0)
      .map((_, index) => currentPage - delta + index)
      .filter(page => 0 < page && page <= pageCount)
      .flatMap((page, index, { length }) => {
        if (!index) {
          return separate(1, page, true)
        }
        if (index === length - 1) {
          return separate(page, pageCount, false)
        }
        return [page]
      })
  }, [])

  // Fetch data
  useEffect(() => {
    if (!dataService) return

    let accData: AccData
    let accContracts: AccContracts
    const getData = async () => {
      try {
        setIsLoading(true)
        accData = await dataService.getAccData(addrRef.current)
        if (accData)
          setAccData(accData)
        accContracts = await dataService.getAccContracts(addrRef.current)
        if (accContracts)
          setAccContracts(accContracts)
        setIsLoading(false)
      } catch (e) {
        console.log(e)
      }
    }
    getData()
    // Run only once for each account
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
        {isLoading ? <div className='contract-spinner'><Spinner animation="border" variant="secondary" /></div> : null}
        {accContracts && accContracts.length > 0 && (
          <>
            <h4 style={{ padding: '0.5rem 0' }}>Deployed Contracts</h4>
            <Card className='address-details-card'>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className='num-contracts'>
                  Total:&nbsp;{<span style={{ fontWeight: 500 }}>{accContracts.length}</span>}&nbsp;contracts
                </span>
                <Pagination className='contract-pagination'>
                  <Pagination.Prev onClick={() => setContractPageIndex((contractPageIndex) => contractPageIndex - 1)}
                    disabled={contractPageIndex === 0} />
                  {generatePagination(contractPageIndex, Math.ceil(accContracts.length / 10)).map((page) => {
                    if (page === -1)
                      return <Pagination.Ellipsis key={page} onClick={() => setContractPageIndex((contractPageIndex) => contractPageIndex - 5)} />
                    else if (page === -2)
                      return <Pagination.Ellipsis key={page} onClick={() => setContractPageIndex((contractPageIndex) => contractPageIndex + 5)} />
                    else if (page === contractPageIndex + 1)
                      return <Pagination.Item key={page} active>{page}</Pagination.Item>
                    else
                      return <Pagination.Item key={page} onClick={() => setContractPageIndex(page - 1)}>{page}</Pagination.Item>
                  })}
                  <Pagination.Next onClick={() => setContractPageIndex((contractPageIndex) => contractPageIndex + 1)}
                    disabled={contractPageIndex === Math.ceil(accContracts.length / 10) - 1} />
                </Pagination>
              </div>
              <Card.Body>
                {accContracts
                  .slice(10 * contractPageIndex, 10 * contractPageIndex + 10)
                  .map((contract: AccContract, index: number) => {
                  return <AccContractCard key={10 * contractPageIndex + index}
                    contract={contract} index={10 * contractPageIndex + index} />
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

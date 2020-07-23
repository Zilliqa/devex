import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Card, Spinner } from 'react-bootstrap'

import { QueryPreservingLink } from 'src/services/network/networkProvider'
import { refreshRate } from 'src/constants'
import { NetworkContext } from 'src/services/network/networkProvider'
import { timestampToTimeago } from 'src/utils/Utils'
import { DsBlockObj } from '@zilliqa-js/core/src/types'

import DisplayTable from '../DisplayTable/DisplayTable'

import './DSBlockList.css'

const DSBlockList: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService, networkUrl } = networkContext!

  useEffect(() => { setData(null) }, [networkUrl]) // Unset data on url change

  const [data, setData] = useState<DsBlockObj[] | null>(null)

  const columns = useMemo(
    () => [{
      id: 'dsheight-col',
      Header: 'Height',
      accessor: 'header.BlockNum',
      Cell: ({ value }: { value: string }) => (
        <QueryPreservingLink to={`/dsbk/${value}`}>
          {value}
        </QueryPreservingLink>
      ),
    },
    {
      id: 'difficulty-col',
      Header: 'Difficulty',
      accessor: 'header.Difficulty',
      Cell: ({ value }: { value: string }) => (
        <div className='text-center'>{value}</div>
      ),
    },
    {
      id: 'ds-difficulty-col',
      Header: 'DS Difficulty',
      accessor: 'header.DifficultyDS',
      Cell: ({ value }: { value: string }) => (
        <div className='text-center'>{value}</div>
      ),
    },
    {
      id: 'age-col',
      Header: 'Age',
      accessor: 'header.Timestamp',
      Cell: ({ value }: { value: string }) => (
        <div className='text-right'>{timestampToTimeago(value)}</div>
      ),
    }], []
  )


  // Fetch data
  useEffect(() => {
    let isCancelled = false
    if (!dataService) return

    let receivedData: DsBlockObj[]
    const getData = async () => {
      try {
        receivedData = await dataService.getLatest5DSBlocks()
        if (!isCancelled && receivedData)
          setData(receivedData)
      } catch (e) {
        if (!isCancelled)
          console.log(e)
      }
    }
    getData()
    const getDataTimer = setInterval(async () => {
      await getData()
    }, refreshRate)
    return () => {
      isCancelled = true
      clearInterval(getDataTimer)
    }
  }, [dataService])

  return <>
    <Card className='dsblock-card'>
      <Card.Header>
        <div className='dsblock-card-header'>
          <span>DS Blocks</span>
          <QueryPreservingLink to={'/dsbk'}>View All</QueryPreservingLink>
        </div>
      </Card.Header>
      <Card.Body>
        {data
          ? <DisplayTable columns={columns} data={data} />
          : <Spinner animation="border" role="status" />
        }
      </Card.Body>
    </Card>
  </>
}

export default DSBlockList

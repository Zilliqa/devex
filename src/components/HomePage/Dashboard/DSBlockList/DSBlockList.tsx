import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Card, Spinner } from 'react-bootstrap'

import { QueryPreservingLink } from 'src'
import { refreshRate } from 'src/constants'
import { NetworkContext } from 'src/services/networkProvider'
import { timestampToTimeago } from 'src/utils/Utils'
import { DsBlockObj } from '@zilliqa-js/core/src/types'

import DisplayTable from '../../DisplayTable/DisplayTable'
import './DSBlockList.css'

/*
    Display first 5 DS Block
      - Height
      - Difficulty
      - DS Difficulty
      - DS Leader
      - Age
      - Hash
*/

const DSBlockList: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService, nodeUrl } = networkContext!

  useEffect(() => { setData(null) }, [nodeUrl]) // Unset data on url change

  const [data, setData] = useState<DsBlockObj[] | null>(null)

  const columns = useMemo(
    () => [{
      id: 'dsheight-col',
      Header: 'Height',
      accessor: (dsBlock: any) => (
          <QueryPreservingLink to={`dsbk/${dsBlock.header.BlockNum}`}>
            {dsBlock.header.BlockNum}
          </QueryPreservingLink>
      )
    },
    {
      id: 'difficulty-col',
      Header: 'Difficulty',
      accessor: (dsBlock: any) => <div className='text-center'>{dsBlock.header.Difficulty}</div>,
    },
    {
      id: 'ds-difficulty-col',
      Header: 'DS Difficulty',
      accessor: (dsBlock: any) => <div className='text-center'>{dsBlock.header.DifficultyDS}</div>,
    },
    {
      id: 'age-col',
      Header: 'Age',
      accessor: (dsBlock: any) => <div className='text-right'>{timestampToTimeago(dsBlock.header.Timestamp)}</div>,
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
          <QueryPreservingLink to={'dsbk'}>View All</QueryPreservingLink>
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

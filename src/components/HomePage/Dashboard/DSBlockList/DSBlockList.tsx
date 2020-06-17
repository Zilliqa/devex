import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Card, Spinner } from 'react-bootstrap'

import { QueryPreservingLink } from 'src'
import { refreshRate } from 'src/constants'
import { NetworkContext } from 'src/services/networkProvider'
import { timestampToTimeago, pubKeyToZilAddr } from 'src/utils/Utils'
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

// Pre-processing data to display
const processMap = new Map()
processMap.set('age-col', timestampToTimeago)
processMap.set('ds-leader-col', pubKeyToZilAddr)
processMap.set('height-col', (height: number) => (<QueryPreservingLink to={`dsbk/${height}`}>{height}</QueryPreservingLink>))
processMap.set('hash-col', (hash: number) => ('0x' + hash))

const DSBlockList: React.FC = () => {

  const networkContext = useContext(NetworkContext)
  const { dataService, nodeUrl } = networkContext!

  useEffect(() => { setData(null) }, [nodeUrl]) // Unset data on url change

  const [data, setData] = useState<DsBlockObj[] | null>(null)

  const columns = useMemo(
    () => [{
      id: 'height-col',
      Header: 'Height',
      accessor: 'header.BlockNum',
    },
    {
      id: 'difficulty-col',
      Header: 'Difficulty',
      accessor: 'header.Difficulty',
    },
    {
      id: 'ds-difficulty-col',
      Header: 'DS Difficulty',
      accessor: 'header.DifficultyDS',
    },
    {
      id: 'ds-leader-col',
      Header: 'DS Leader',
      accessor: 'header.LeaderPubKey',
    },
    {
      id: 'age-col',
      Header: 'Age',
      accessor: 'header.Timestamp',
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
    }, refreshRate);
    return () => {
      isCancelled = true
      clearInterval(getDataTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeUrl])

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
          ? <DisplayTable columns={columns} data={data} processMap={processMap} />
          : <Spinner animation="border" role="status" />
        }
      </Card.Body>
    </Card>
  </>
}

export default DSBlockList

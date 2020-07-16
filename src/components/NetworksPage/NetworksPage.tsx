import React, { useContext, useState } from 'react'
import { Container, Row, Button } from 'react-bootstrap'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { defaultNetworks } from 'src/services/network/networkProvider'
import { UserPrefContext } from 'src/services/userPref/userPrefProvider'

import NetworksList from './NetworksList'
import NetworkModal from './NetworkModal'

const NetworksPage: React.FC = () => {

  const userPrefContext = useContext(UserPrefContext)
  const { nodeUrlMap, setNodeUrlMap } = userPrefContext!
  const [show, setShow] = useState(false)

  const handleCloseModal = () => setShow(false)
  const handleShowModal = () => setShow(true)

  const addNetwork = (networkUrl: string, networkName: string) => {
    if (!Object.keys({ ...nodeUrlMap }).includes(networkUrl)) {
      nodeUrlMap.set(networkUrl, networkName)
      const temp = new Map(nodeUrlMap)
      temp.set(networkUrl, networkName)
      setNodeUrlMap(temp)
    }
    else {
      // show network has already been added notif
    }
    handleCloseModal()
  }

  return (
    <>
      <NetworkModal show={show} handleCloseModal={handleCloseModal} cb={addNetwork} />
      <Container>
        <Row className='m-0'>
          <h4>
            Networks
          </h4>
        </Row>
        <Row className='m-0 pb-3'>
          <span className='subtext'>Network data is stored in your browser&apos;s local storage.</span>
        </Row>
        <Row className='m-0 pb-3'>
          <Button className='mr-3' onClick={handleShowModal}>Add Network</Button>
          <Button onClick={() => setNodeUrlMap(defaultNetworks)}>Reset to default</Button>
        </Row>
        <Row className='m-0'>
          <DndProvider backend={HTML5Backend}>
            <NetworksList />
          </DndProvider>
        </Row>
      </Container>
    </>
  )
}

export default NetworksPage

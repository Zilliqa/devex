import React, { useContext, useState } from 'react'
import { Container, Row, Button } from 'react-bootstrap'

import { defaultNetworks } from 'src/services/network/networkProvider'
import { UserPrefContext, NetworkMap } from 'src/services/userPref/userPrefProvider'

import ImportExport from '../Misc/ImportExport/ImportExport'
import NetworksList from './NetworksList'
import NetworkModal from './NetworkModal'

const NetworksPage: React.FC = () => {

  const userPrefContext = useContext(UserPrefContext)
  const { networkMap, setNetworkMap } = userPrefContext!
  const [show, setShow] = useState(false)

  const handleCloseModal = () => setShow(false)
  const handleShowModal = () => setShow(true)

  const addNetwork = (networkUrl: string, networkName: string) => {
    const temp = new Map(networkMap)
    temp.set(networkUrl, networkName)
    setNetworkMap(temp)
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
          <span className='subtext'>
            Network data is stored in your browser&apos;s local storage.
            Default network is highlighted in green.
            <br />
            Use the network selector in the top-right to toggle between different networks.
            </span>
        </Row>
        <Row className='m-0 pb-3'>
          <Button className='mr-3' onClick={handleShowModal}>Add Network</Button>
          <Button className='mr-3' onClick={() => setNetworkMap(new Map())}>Clear Networks</Button>
          <Button className='mr-auto' onClick={() => setNetworkMap(defaultNetworks)}>Reset to default</Button>
          <ImportExport
            type='networks'
            map={networkMap}
            setMapCb={setNetworkMap}
            fromJson={(json: any) => new Map(json.networks.map((x: { [url: string]: string }) => Object.entries(x)[0]))}
            toJson={(map: NetworkMap) => ({ networks: Array.from(map).map(([k, v]) => ({ [k]: v })) })} />
        </Row>
        <Row>
          <NetworksList />
        </Row>
      </Container>
    </>
  )
}

export default NetworksPage

import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import VBLogo from 'src/assets/images/VBLogo.png'

import './ViewBlockLink.css'

interface IProps {
  network: string,
  type: string,
  identifier: string
}

const ViewBlockLink: React.FC<IProps> = ({ network, type, identifier }) => {
  if (network !== 'https://api.zilliqa.com' && network !== 'https://dev-api.zilliqa.com')
    return null
  let viewBlockUrl = `https://viewblock.io/zilliqa/${type}/${identifier}`
  if (network === 'https://dev-api.zilliqa.com')
    viewBlockUrl += '?network=testnet'
  return <a href={viewBlockUrl} className='vb-link-div'>
    <OverlayTrigger placement='top'
      overlay={<Tooltip id={'vb-tt'}>Open in ViewBlock</Tooltip>}>
      <span className='p-1'>
        <img
          src={VBLogo}
          alt=""
          width="28"
          height="28"
          className="d-inline-block align-top"
        />
      </span>
    </OverlayTrigger>
  </a>
}

export default ViewBlockLink

import React, { useState } from 'react'
import { Card, Container, Tabs, Tab } from 'react-bootstrap'

import { TransactionDetails } from 'src/typings/api'

import DefaultTab from './DefaultTab'
import EventsTab from './EventsTab'
import OverviewTab from './OverviewTab'
import TransitionsTab from './TransitionsTab'
import CodeTab from './CodeTab'

import './InfoTabs.css'

export interface ReceiptTabs {
  tabHeaders: string[],
  tabTitles: string[],
  tabContents: React.ReactNode[]
}

interface IProps {
  tabs: ReceiptTabs
}

export const generateTabsFromTxnDetails = (data: TransactionDetails): ReceiptTabs => {

  const tabs: ReceiptTabs = {
    tabHeaders: [],
    tabTitles: [],
    tabContents: [],
  }

  if (!data.txn.txParams.receipt) return tabs

  const receipt = data.txn.txParams.receipt

  if (receipt.success === undefined || (data.contractAddr)) {
    if (data.txn.txParams.data) {
      tabs.tabHeaders.push('params')
      tabs.tabTitles.push(`Params`)
      tabs.tabContents.push(<OverviewTab data={data.txn.txParams.data!} />)
    }
    if (data.txn.txParams.code) {
      tabs.tabHeaders.push('code')
      tabs.tabTitles.push(`Code`)
      tabs.tabContents.push(<CodeTab code={data.txn.txParams.code!} />)
    }
  } else {
    if (data.txn.txParams.data) {
      tabs.tabHeaders.push('overview')
      tabs.tabTitles.push(`Overview`)
      tabs.tabContents.push(<OverviewTab data={data.txn.txParams.data} />)
    }
  }

  if (receipt.event_logs) {
    tabs.tabHeaders.push('eventLog')
    tabs.tabTitles.push(`Event Log (${receipt.event_logs.length})`)
    tabs.tabContents.push(<EventsTab events={receipt.event_logs} />)
  }

  if (receipt.transitions) {
    tabs.tabHeaders.push('transitions')
    tabs.tabTitles.push(`Transitions (${receipt.transitions.length})`)
    tabs.tabContents.push(<TransitionsTab transitions={receipt.transitions} />)
  }

  if (receipt.exceptions && receipt.exceptions.length > 0) {
    tabs.tabHeaders.push('exceptions')
    tabs.tabTitles.push(`Exceptions (${receipt.exceptions.length})`)
    tabs.tabContents.push(<DefaultTab content={receipt.exceptions} />)
  }

  if (receipt.errors && Object.keys(receipt.errors).length > 0) {
    tabs.tabHeaders.push('errors')
    tabs.tabTitles.push('Errors')
    tabs.tabContents.push(<DefaultTab content={receipt.errors} />)
  }
  return tabs
}

const InfoTabs: React.FC<IProps> = ({ tabs }) => {

  const { tabHeaders, tabTitles, tabContents } = tabs
  const [currTab, setCurrTab] = useState(tabHeaders[0])

  return <>
    {tabHeaders.length > 0
      ? <Card className='tabs-card'>
        <Card.Header className='tabs-card-header'>
          <Tabs id="info-tabs" activeKey={currTab} onSelect={(k: string) => setCurrTab(k)}>
            {tabHeaders.map((tabHeader: string, index: number) => (
              <Tab key={index} eventKey={tabHeader} title={[tabTitles[index]]} />
            ))}
          </Tabs>
        </Card.Header>
        <Card.Body>
          <Container>
            {tabContents[tabHeaders.indexOf(currTab)]}
          </Container>
        </Card.Body>
      </Card>
      : null}
  </>
}

export default InfoTabs

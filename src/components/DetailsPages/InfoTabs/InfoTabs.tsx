import React, { useState } from 'react'
import { Card, Container, Tabs, Tab } from 'react-bootstrap'

type IProps = {
  tabs: {
    tabHeaders: string[],
    tabTitles: string[],
    tabContents: React.ReactNode[]
  }
}

const InfoTabs: React.FC<IProps> = ({ tabs }) => {
  const { tabHeaders, tabTitles, tabContents } = tabs
  const [currTab, setCurrTab] = useState(tabHeaders[0])

  return <>
    {tabHeaders.length > 0
      ? <Card className='tabs-card'>
        <Card.Header className='tabs-card-header'>
          <Tabs id="additional-info-tabs" activeKey={currTab} onSelect={(k: string) => setCurrTab(k)}>
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

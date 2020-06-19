import React from 'react'
import { Row, Col, Container } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebookF, faRedditAlien, faMediumM, faYoutube, faTelegramPlane } from '@fortawesome/free-brands-svg-icons'

import './Footer.css'

const Footer: React.FC = () => {
  return <div className='custom-footer'>
    <Container>
      <Row style={{ justifyContent: 'space-between' }}>
        <Col sm md lg={2}>
          <Row>
            <span style={{ paddingLeft: '0.3rem', marginBottom: '10px', color: 'rgba(255,255,255,0.4)' }}>Social</span>
          </Row>
          <Row>
            <a target='_blank' rel='noopener noreferrer' href='https://www.twitter.com/zilliqa'>
              <FontAwesomeIcon size='lg' icon={faTwitter} cursor='pointer' />
            </a>
            <a target='_blank' rel='noopener noreferrer' href='https://www.facebook.com/zilliqa/'>
              <FontAwesomeIcon size='lg' icon={faFacebookF} cursor='pointer' />
            </a>
            <a target='_blank' rel='noopener noreferrer' href='https://www.reddit.com/r/zilliqa'>
              <FontAwesomeIcon size='lg' icon={faRedditAlien} cursor='pointer' />
            </a>
          </Row>
          <Row>
            <a target='_blank' rel='noopener noreferrer' href='https://blog.zilliqa.com'>
              <FontAwesomeIcon size='lg' icon={faMediumM} cursor='pointer' />
            </a>
            <a target='_blank' rel='noopener noreferrer' href='https://www.youtube.com/channel/UCvinnFbf0u71cajoxKcfZIQ'>
              <FontAwesomeIcon size='lg' icon={faYoutube} cursor='pointer' />
            </a>
            <a target='_blank' rel='noopener noreferrer' href='https://t.me/zilliqachat'>
              <FontAwesomeIcon size='lg' icon={faTelegramPlane} cursor='pointer' />
            </a>
          </Row>
        </Col>
        <Col>
          <span style={{ paddingLeft: '0.2rem', color: 'rgba(255,255,255,0.4)' }}>Related Links</span>
          <div>
            <a target='_blank' rel='noopener noreferrer' href='https://github.com/Zilliqa/dev-explorer'>Project Repo</a>
          </div>
          <div>
            <a target='_blank' rel='noopener noreferrer' href='https://ide.zilliqa.com/#/'>Neo Savant IDE</a>
          </div>
          <div>
            <a target='_blank' rel='noopener noreferrer' href='https://github.com/Zilliqa/Zilliqa-JavaScript-Library'>Javascript SDK</a>
          </div>
        </Col>
        <Col style={{ alignSelf: 'center' }}>
          <Row style={{ justifyContent: 'flex-end' }}>
            Powered by <a href='http://www.zilliqa.com'><span style={{ textDecoration: 'underline' }}>Zilliqa</span></a>
          </Row>
          <Row style={{ justifyContent: 'flex-end' }}>
            <span><small>© 2020 Zilliqa</small></span>
          </Row>
        </Col>
      </Row>
    </Container>
  </div >
}

export default Footer

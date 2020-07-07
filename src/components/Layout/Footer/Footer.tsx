import React, { useContext } from 'react'
import { Row, Col, Container, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Switch from 'rc-switch'

import { ThemeContext } from 'src/themes/themeProvider'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faFacebookF, faRedditAlien, faMediumM, faYoutube, faTelegramPlane } from '@fortawesome/free-brands-svg-icons'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

import './Footer.css'

const Footer: React.FC = () => {

  const themeContext = useContext(ThemeContext)
  const { theme, toggle } = themeContext!

  return <div className='custom-footer'>
    <Container>
      <Row className='justify-content-between'>
        <Col sm md lg={2}>
          <Row>
            <span className='social-header'>Social</span>
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
          <span className='related-links-header'>Related Links</span>
          <div>
            <a target='_blank' rel='noopener noreferrer' href='https://github.com/Zilliqa/dev-explorer'>Project Repo</a>
          </div>
          <div>
            <a target='_blank' rel='noopener noreferrer' href='https://ide.zilliqa.com/#/'>Neo Savant IDE</a>
          </div>
          <div>
            <a target='_blank' rel='noopener noreferrer' href='https://github.com/Zilliqa/Zilliqa-JavaScript-Library'>Javascript SDK</a>
          </div>
          <div>
            <a target='_blank' rel='noopener noreferrer' href='https://viewblock.io/zilliqa'>ViewBlock</a>
          </div>
        </Col>
        <Col className='align-self-center'>
          <Row className='justify-content-end'>
            Powered by <a href='http://www.zilliqa.com'>
              <span><u>Zilliqa</u></span></a>
          </Row>
          <Row className='justify-content-end'>
            <span><small>© 2020 Zilliqa</small></span>
          </Row>
          <Row className='justify-content-end pt-1'>
            <OverlayTrigger placement='top'
              overlay={<Tooltip id={'theme-tt'}>Toggle Light/Dark</Tooltip>}>
              <Switch
                className='theme-switch'
                loadingIcon={null}
                onChange={() => {
                  toggle()
                }}
                disabled={false}
                defaultChecked={theme === 'light'}
                checkedChildren={
                  <div className='theme-icon-div'>
                    <FontAwesomeIcon className='theme-icon' icon={faMoon} size='xs' color='white' />
                  </div>}
                unCheckedChildren={
                  <div className='theme-icon-div'>
                    <FontAwesomeIcon className='theme-icon' icon={faSun} size='xs' color='white' />
                  </div>}
              />
            </OverlayTrigger>
          </Row>
        </Col>
      </Row>
    </Container>
  </div >
}

export default Footer

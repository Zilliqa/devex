import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Form, InputGroup, Button, Dropdown, DropdownButton } from 'react-bootstrap'

import { validation } from '@zilliqa-js/util'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './Searchbar.css'

interface IProps {
  isHeaderSearchbar: boolean,
  isISSearchbar: boolean,
}

const Searchbar: React.FC<IProps> = ({ isHeaderSearchbar, isISSearchbar }) => {
  const [input, setInput] = useState("")
  const [searchType, setSearchType] = useState('Txn/Addr')
  const history = useHistory()
  const location = useLocation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    let trimmedInput = input.trim()
    switch (searchType) {
      case 'Txn/Addr':
        if (trimmedInput.substring(0, 3) !== 'zil' && trimmedInput.substring(0, 2) !== '0x')
          trimmedInput = '0x' + trimmedInput
        if (validation.isAddress(trimmedInput) || validation.isBech32(trimmedInput))
          history.push({
            pathname: `/address/${trimmedInput}`,
            search: location.search
          })
        else
          history.push({
            pathname: `/tx/${trimmedInput}`,
            search: location.search
          })
        break
      case 'Tx Block':
        history.push({
          pathname: `/txbk/${trimmedInput}`,
          search: location.search
        })
        break
      case 'DS Block':
        history.push({
          pathname: `/dsbk/${trimmedInput}`,
          search: location.search
        })
        break
    }
    setInput('')
  }

  return <>
    <Form onSubmit={handleSubmit}>
      <InputGroup className="searchbar-ig" id="searchbar-ig">
        {!isISSearchbar &&
          <InputGroup.Prepend>
            <DropdownButton variant="outline-secondary" id='searchbar-dropdown' title={searchType}>
              <Dropdown.Item onClick={() => setSearchType('Txn/Addr')}>Txn/Addr</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType('Tx Block')}>Tx Block</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType('DS Block')}>DS Block</Dropdown.Item>
            </DropdownButton>
          </InputGroup.Prepend>
        }
        <Form.Control type="text" value={input} autoFocus={!isHeaderSearchbar}
          placeholder={
            searchType === 'Txn/Addr'
              ? 'Search for a transaction or an address'
              : searchType === 'Tx Block'
                ? 'Search by Tx Block height'
                : 'Search by DS Block height'}
          onChange={handleChange} />
        <InputGroup.Append>
          <Button type="submit" variant="outline-secondary">
            {isHeaderSearchbar ? <FontAwesomeIcon icon={faSearch} /> : <div>Search</div>}
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  </>
}

export default Searchbar

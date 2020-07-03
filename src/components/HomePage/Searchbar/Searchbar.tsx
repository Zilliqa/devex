import React, { useState } from 'react'
import { Form, InputGroup, Button, Dropdown, DropdownButton } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'

import { isValidAddr } from 'src/utils/Utils'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import './Searchbar.css'

interface IProps {
  isHeaderSearchbar: boolean,
  isISSearchbar: boolean,
}

const Searchbar: React.FC<IProps> = ({ isHeaderSearchbar, isISSearchbar }) => {

  const history = useHistory()
  const location = useLocation()
  const [input, setInput] = useState("")
  const [searchType, setSearchType] = useState('Txn/Addr')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => (
    setInput(e.target.value)
  )

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    switch (searchType) {
      case 'Txn/Addr':
        if (isValidAddr(trimmedInput))
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
      <InputGroup className="searchbar-ig" id={isHeaderSearchbar ? "header-searchbar-ig" : "searchbar-ig"}>
        {isISSearchbar
          ? <InputGroup.Prepend>
            <DropdownButton id='searchbar-dropdown' title={searchType}>
              <Dropdown.Item onClick={() => setSearchType('Txn/Addr')}>Txn/Addr</Dropdown.Item>
              <Dropdown.Item onClick={() => setSearchType('Tx Block')}>Tx Block</Dropdown.Item>
            </DropdownButton>
          </InputGroup.Prepend>
          :
          <InputGroup.Prepend>
            <DropdownButton id='searchbar-dropdown' title={searchType}>
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
          <Button type="submit">
            {isHeaderSearchbar ? <FontAwesomeIcon icon={faSearch} /> : <div>Search</div>}
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  </>
}

export default Searchbar

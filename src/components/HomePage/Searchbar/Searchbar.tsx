import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, InputGroup, Button, Dropdown, DropdownButton } from 'react-bootstrap'

import { validation } from '@zilliqa-js/util'

import './Searchbar.css'

const Searchbar: React.FC = () => {
  const [input, setInput] = useState("")
  const [searchType, setSearchType] = useState('Txn/Addr')
  let history = useHistory()

  const handleChange = (e: any) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    let trimmedInput = input.trim()
    switch (searchType) {
      case 'Txn/Addr':
        if (trimmedInput.substring(0, 3) !== 'zil' && trimmedInput.substring(0, 2) !== '0x')
          trimmedInput = '0x' + trimmedInput
        if (validation.isAddress(trimmedInput) || validation.isBech32(trimmedInput))
          history.push(`/address/${trimmedInput}`)
        else
          history.push(`/tx/${trimmedInput}`)
        break
      case 'Tx Block':
        history.push(`/txbk/${trimmedInput}`)
        break
      case 'DS Block':
        history.push(`/dsbk/${trimmedInput}`)
        break
    }
  }

  return <>
    <Form onSubmit={handleSubmit}>
      <InputGroup className="searchbar-ig" id="contractAddress">
        <InputGroup.Prepend>
          <DropdownButton variant="outline-secondary" id='searchbar-dropdown' title={searchType}>
            <Dropdown.Item onClick={() => setSearchType('Txn/Addr')}>Txn/Addr</Dropdown.Item>
            <Dropdown.Item onClick={() => setSearchType('Tx Block')}>Tx Block</Dropdown.Item>
            <Dropdown.Item onClick={() => setSearchType('DS Block')}>DS Block</Dropdown.Item>
          </DropdownButton>
        </InputGroup.Prepend>
        <Form.Control type="text" value={input} autoFocus
          placeholder={
            searchType === 'Txn/Addr'
              ? 'Search for a transaction or an address'
              : searchType === 'Tx Block'
                ? 'Search by Tx Block height'
                : 'Search by DS Block height'}
          onChange={handleChange} />
        <InputGroup.Append>
          <Button type="submit" variant="outline-secondary">
            <div>Search</div>
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  </>
}

export default Searchbar

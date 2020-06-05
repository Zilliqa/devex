import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, InputGroup, Button } from 'react-bootstrap'

import { validation } from '@zilliqa-js/util'

import 'src/components/HomePage/Searchbar/Searchbar.css'

const ISSearchbar: React.FC = () => {
  const [input, setInput] = useState("")
  let history = useHistory()

  const handleChange = (e: any) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    let trimmedInput = input.trim()
    if (trimmedInput.substring(0, 3) !== 'zil' && trimmedInput.substring(0, 2) !== '0x')
      trimmedInput = '0x' + trimmedInput
    if (validation.isAddress(trimmedInput) || validation.isBech32(trimmedInput))
      history.push(`/address/${trimmedInput}`)
    else
      history.push(`/tx/${trimmedInput}`)
  }

  return <>
    <Form onSubmit={handleSubmit}>
      <InputGroup className="searchbar-ig" id="contractAddress">
        <Form.Control type="text" value={input} autoFocus
          placeholder="Search for a transaction or an address" onChange={handleChange} />
        <InputGroup.Append>
          <Button type="submit" variant="outline-secondary">
            <div>Search</div>
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  </>
}

export default ISSearchbar

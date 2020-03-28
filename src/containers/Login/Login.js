import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { Auth } from 'aws-amplify'

import './style.css'

import { useFormFields } from '../../libs/hooksLib'

import LoaderButton from '../../components/LoaderButton'

export default function Login(props) {
  const [isLoading, setIsLoading] = useState(false)
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
  })

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setIsLoading(true)

    try {
      await Auth.signIn(fields.email, fields.password)
      props.userHasAuthenticated(true)
    } catch (e) {
      alert(e.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={fields.password}
            onChange={handleFieldChange}
            type="password"
          />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </Form>
    </div>
  )
}

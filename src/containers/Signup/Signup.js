import React, { useState } from 'react'
import { Alert, Form } from 'react-bootstrap'
import { Auth } from 'aws-amplify'

import './style.css'

import { useFormFields } from '../../libs/hooksLib'

import LoaderButton from '../../components/LoaderButton'

export default function Signup(props) {
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  })
  const [newUser, setNewUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    )
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setIsLoading(true)

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      })
      setIsLoading(false)
      setNewUser(newUser)
    } catch (e) {
      if (e.code === 'UsernameExistsException') {
        const tryAgain = await Auth.resendSignUp(fields.email)

        console.log(tryAgain)
        setNewUser(tryAgain)
      } else {
        alert(e.message)
      }
      setIsLoading(false)
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault()

    setIsLoading(true)

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode)
      await Auth.signIn(fields.email, fields.password)

      props.userHasAuthenticated(true)
      props.history.push('/')
    } catch (e) {
      alert(e.message)
      setIsLoading(false)
    }
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
        </Form.Group>
        <Alert variant="warning">Please check your email for the code.</Alert>
        <LoaderButton
          block
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </Form>
    )
  }

  function renderForm() {
    return (
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
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </Form>
    )
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  )
}

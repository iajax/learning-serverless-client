import React, { useState } from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'
import { API } from 'aws-amplify'

import './style.css'

import config from '../../config'

import BillingForm from '../../components/BillingForm'

export default function Settings(props) {
  const [isLoading, setIsLoading] = useState(false)

  function billUser(details) {
    return API.post('notes', '/billing', {
      body: details,
    })
  }

  async function handleFormSubmit(storage, { token, error }) {
    if (error) {
      alert(error)
      return
    }

    setIsLoading(true)

    try {
      await billUser({
        storage,
        source: token.id,
      })

      alert('Your card has been charged successfully!')
      props.history.push('/')
    } catch (e) {
      alert(e)
      setIsLoading(false)
    }
  }

  return (
    <div className="Settings">
      <StripeProvider apiKey={config.STRIPE_KEY}>
        <Elements>
          <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
        </Elements>
      </StripeProvider>
    </div>
  )
}

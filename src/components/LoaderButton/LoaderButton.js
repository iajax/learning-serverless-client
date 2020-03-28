import React from 'react'
import { Button } from 'react-bootstrap'
import { FaCircleNotch } from 'react-icons/fa'

import './style.css'

export default function LoaderButton({
  isLoading,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <FaCircleNotch />}
      {props.children}
    </Button>
  )
}

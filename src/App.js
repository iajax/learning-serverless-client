import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import { Auth } from 'aws-amplify'

import Routes from './Routes'

import './App.css'

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(true)

  let history = useHistory()

  useEffect(() => {
    onLoad()
  }, [])

  async function onLoad() {
    try {
      await Auth.currentSession()
      userHasAuthenticated(true)
    } catch (e) {
      if (e !== 'No current user') {
        alert(e)
      }
    }

    setIsAuthenticating(false)
  }

  async function handleLogout() {
    await Auth.signOut()
    userHasAuthenticated(false)
    history.push('/login')
  }

  return (
    !isAuthenticating && (
      <>
        <Navbar bg="light">
          <Navbar.Brand>
            <Link to="/">Scratch</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              {isAuthenticated ? (
                <>
                  <Nav.Link href="/settings">
                    <Nav.Item>Settings</Nav.Item>
                  </Nav.Link>
                  <Nav.Link href="#" onClick={handleLogout}>
                    <Nav.Item>Logout</Nav.Item>
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Item>
                    <Nav.Link href="/signup">Signup</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/login">Login</Nav.Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="container">
          <Routes appProps={{ isAuthenticated, userHasAuthenticated }} />
        </div>
      </>
    )
  )
}

export default App

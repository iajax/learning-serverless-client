import React, { useState, useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { API } from 'aws-amplify'

import './style.css'

export default function Home(props) {
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        return
      }

      try {
        const notes = await loadNotes()
        setNotes(notes)
      } catch (e) {
        alert(e)
      }

      setIsLoading(false)
    }

    onLoad()
  }, [props.isAuthenticated])

  function loadNotes() {
    return API.get('notes', '/notes')
  }

  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroup.Item header={note.content.trim().split('\n')[0]}>
            {'Created: ' + new Date(note.createdAt).toLocaleString()}
          </ListGroup.Item>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/notes/new">
          <ListGroup.Item>
            <h4>
              <b>{'\uFF0B'}</b> Create a new note
            </h4>
          </ListGroup.Item>
        </LinkContainer>
      )
    )
  }

  function renderLander() {
    return (
      <div className="lander">
        <h3>Scratch</h3>
        <p>A simple note taking app</p>
      </div>
    )
  }

  function renderNotes() {
    return (
      <div className="notes">
        <h3>Your Notes</h3>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    )
  }

  return (
    <div className="Home">
      {props.isAuthenticated ? renderNotes() : renderLander()}
    </div>
  )
}

import React, { useRef, useState, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap'
import { API, Storage } from 'aws-amplify'

import './style.css'

import config from '../../config'

import { s3Upload } from '../../libs/awsLib'

import LoaderButton from '../../components/LoaderButton'

export default function Notes(props) {
  const file = useRef(null)
  const [note, setNote] = useState(null)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    function loadNote() {
      return API.get('notes', `/notes/${props.match.params.id}`)
    }

    async function onLoad() {
      try {
        const note = await loadNote()
        const { content, attachment } = note

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment)
        }

        setContent(content)
        setNote(note)
      } catch (e) {
        alert(e)
      }
    }

    onLoad()
  }, [props.match.params.id])

  function validateForm() {
    return content.length > 0
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, '')
  }

  function handleFileChange(event) {
    file.current = event.target.files[0]
  }

  function saveNote(note) {
    return API.put('notes', `/notes/${props.match.params.id}`, {
      body: note,
    })
  }

  async function handleSubmit(event) {
    let attachment

    event.preventDefault()

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      )
      return
    }

    setIsLoading(true)

    try {
      if (file.current) {
        attachment = await s3Upload(file.current)
      }

      await saveNote({
        content,
        attachment: attachment || note.attachment,
      })
      props.history.push('/')
    } catch (e) {
      alert(e)
      setIsLoading(false)
    }
  }

  function deleteNote() {
    return API.del('notes', `/notes/${props.match.params.id}`)
  }

  function deleteAttachment() {
    if (!note.attachment) {
      return
    }

    Storage.vault.remove(note.attachment)
  }

  async function handleDelete(event) {
    event.preventDefault()

    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteNote()
      await deleteAttachment()
      props.history.push('/')
    } catch (e) {
      alert(e)
      setIsDeleting(false)
    }
  }

  return (
    <div className="Notes">
      {note && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              value={content}
              as="textarea"
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          {note.attachment && (
            <Button
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href={note.attachmentURL}
              variant="link"
            >
              {formatFilename(note.attachment)}
            </Button>
          )}
          <Form.Group controlId="file">
            <Form.File>
              {!note.attachment && (
                <Form.File.Label>Attachment</Form.File.Label>
              )}
              <Form.File.Input onChange={handleFileChange} type="file" />
            </Form.File>
          </Form.Group>
          <LoaderButton
            block
            type="submit"
            size="large"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="large"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  )
}

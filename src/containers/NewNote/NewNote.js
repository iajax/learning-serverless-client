import React, { useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import { API } from 'aws-amplify'

import './style.css'

import config from '../../config'

import { s3Upload } from '../../libs/awsLib'

import LoaderButton from '../../components/LoaderButton'

export default function NewNote(props) {
  const file = useRef(null)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function validateForm() {
    return content.length > 0
  }

  function handleFileChange(event) {
    file.current = event.target.files[0]
  }

  function createNote(note) {
    return API.post('notes', '/notes', {
      body: note,
    })
  }

  async function handleSubmit(event) {
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
      const attachment = file.current ? await s3Upload(file.current) : null

      await createNote({ content, attachment })
      props.history.push('/')
    } catch (e) {
      alert(e)
      setIsLoading(false)
    }
  }

  return (
    <div className="NewNote">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            as="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.File>
            <Form.File.Label>Attachment</Form.File.Label>
            <Form.File.Input onChange={handleFileChange} />
          </Form.File>
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  )
}

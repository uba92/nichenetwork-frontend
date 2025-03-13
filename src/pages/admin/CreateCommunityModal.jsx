import axios from 'axios'
import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const API_URL = 'http://localhost:8080/api/communities'

function CreateCommunityModal({ show, handleClose, getCommunities }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  // eslint-disable-next-line no-unused-vars
  const [isError, setIsError] = useState(false)

  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !description) {
      setIsError('Tutti i campi sono obbligatori')
      return
    }

    try {
      await axios.post(
        `${API_URL}`,
        { name, description },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )

      handleClose()
      getCommunities()
    } catch (error) {
      setIsError('Errore nella creazione della community')
      console.error('Errore nella creazione della community: ', error)
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title>Crea una nuova Community</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='name'>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              onChange={(e) => {
                setName(e.target.value)
              }}
              value={name}
              type='text'
              placeholder='Inserisci Nome'
            />
          </Form.Group>

          <Form.Group controlId='description'>
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as='textarea'
              rows={4}
              onChange={(e) => {
                setDescription(e.target.value)
              }}
              value={description}
              placeholder='Inserisci Descrizione'
            />
          </Form.Group>

          <Button variant='primary' type='submit' className='mt-3'>
            Crea Community
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateCommunityModal

import axios from 'axios'
import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const API_URL = 'http://localhost:8080/api/communities'

function CreateCommunityModal({ show, handleClose, getCommunities }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [color, setColor] = useState('#000000')

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
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)

      if (imageUrl) {
        formData.append('image', imageUrl)
      }
      formData.append('color', color)
      console.log('Color inviato:', formData.get('color'))
      await axios.post(`${API_URL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })

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

          <Form.Group controlId='color'>
            <Form.Label>Colore</Form.Label>
            <Form.Control
              onChange={(e) => {
                setColor(e.target.value)
              }}
              value={color}
              type='color'
            />
          </Form.Group>

          <Form.Group controlId='imageUrl'>
            <Form.Label>Immagine</Form.Label>
            <Form.Control
              onChange={(e) => {
                setImageUrl(e.target.files[0])
              }}
              type='file'
              accept='/image'
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

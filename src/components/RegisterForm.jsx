import { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import AuthService from '../services/AuthService'
import { useNavigate } from 'react-router-dom'

function RegisterForm() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validatePassword, setValidatePassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== validatePassword) {
      setError('Le password non corrispondono')
      return
    }

    const requestData = {
      username,
      email,
      password,
      firstName,
      lastName,
    }

    console.log('Utente registrato con successo ', requestData)

    try {
      setIsLoading(true)
      setError('')
      await AuthService.register(requestData)
      setShowSuccessModal(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Errore di registrazione')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {error && <Alert variant='danger'>{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Inserisci Username'
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Inserisci Email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Inserisci Password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Conferma Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Conferma Password'
            onChange={(e) => setValidatePassword(e.target.value)}
            value={validatePassword}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type='text'
            placeholder='Inserisci Nome'
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type='text'
            placeholder='Inserisci Cognome'
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
        </Form.Group>

        <Button className='btn-custom mt-3' type='submit'>
          {isLoading ? (
            <span className='spinner-border spinner-border-sm'></span>
          ) : (
            'Registrati'
          )}
        </Button>
      </Form>

      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Registrazione completata!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Il tuo account è stato creato con successo. Ora puoi accedere.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowSuccessModal(false)}
          >
            Chiudi
          </Button>
          <Button variant='primary' onClick={() => navigate('/login')}>
            Accedi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default RegisterForm

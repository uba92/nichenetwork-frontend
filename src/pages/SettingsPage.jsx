import { Button, Card, Container, Form } from 'react-bootstrap'
import '../assets/css/SettingsPage.css'
import { useEffect, useState } from 'react'
import axios from 'axios'

function SettingsPage() {
  const [me, setMe] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [username, setUsername] = useState('')

  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0])
  }

  const handleBioChange = (e) => {
    setBio(e.target.value)
  }

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value)
  }

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value)
  }

  const updateAvatar = async () => {
    if (!authenticatedUser) {
      console.log('Nessun utente autenticato!')
      return
    }

    if (!avatar) {
      alert('Selezionare un avatar!')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', avatar)

      const response = await axios.put(
        `http://localhost:8080/api/users/changeAvatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )

      console.log('Avatar aggiornato con successo', response.data)
      alert('Avatar aggiornato con successo!')
      window.location.href = `/home/profile/${me.id}`
    } catch (error) {
      setIsError(true)
      console.error('Error updating avatar:', error)
    }
  }

  const updateBio = async () => {
    if (bio.trim() === '') {
      alert('La bio non può essere vuota')
      return
    }
    try {
      await axios.put(
        'http://localhost:8080/api/users/updateProfile',
        { bio },
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser.token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      alert('Bio aggiornata con successo!')
      window.location.href = `/home/profile/${me.id}`
    } catch (error) {
      console.error('Errore aggiornando bio:', error)
    }
  }

  const updatePassword = async () => {
    if (!oldPassword || !newPassword) {
      return alert('Inserisci entrambe le password!')
    }

    if (newPassword.length < 8) {
      alert('La nuova password deve contenere almeno 8 caratteri.')
      return
    }

    try {
      await axios.put(
        'http://localhost:8080/api/users/changePassword',
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser.token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      alert('Password aggiornata con successo!')
      setOldPassword('')
      setNewPassword('')
    } catch (error) {
      console.error('Errore aggiornando password:', error)
    }
  }

  const deleteAccount = async () => {
    if (!authenticatedUser) {
      console.log('Nessun utente autenticato!')
      return
    }

    const userConfirmed = window.confirm(
      'Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.'
    )
    if (!userConfirmed) return

    const password = prompt(
      "Inserisci la tua password per confermare l'eliminazione:"
    )
    if (!password) {
      alert(
        "Operazione annullata. La password è obbligatoria per eliminare l'account."
      )
      return
    }

    try {
      const requestData = {
        username: username,
        password: password,
      }
      const response = await axios.delete(
        'http://localhost:8080/api/users/deleteUser',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
          data: requestData,
        }
      )

      alert(response.data)
      localStorage.removeItem('user')
      window.location.href = '/'
    } catch (error) {
      console.error("Errore nell'eliminazione dell'account:", error)
      alert(
        error.response?.data || "Errore durante l'eliminazione dell'account."
      )
    }
  }

  const getMe = async () => {
    if (!authenticatedUser) {
      console.log('Nessun utente autenticato!')
      return
    }

    try {
      const response = await axios.get('http://localhost:8080/api/users/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })

      setMe(response.data)
      setUsername(response.data.username)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching user:', error)
    }
  }

  useEffect(() => {
    getMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  return (
    <>
      <Container className='settings-container my-4'>
        <Card>
          <Card.Body>
            <Card.Title className='text-center'>
              Impostazioni Account
            </Card.Title>

            <Form.Group className='update-account-form'>
              <Form.Label>Modifica Avatar</Form.Label>
              <Form.Control
                type='file'
                accept='image/*'
                onChange={handleAvatarChange}
              />
              <Button variant='primary' className='mt-2' onClick={updateAvatar}>
                Aggiorna Avatar
              </Button>
            </Form.Group>

            <Form.Group className='update-account-form'>
              <Form.Label>Modifica Bio</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Inserisci la tua bio...'
                onChange={handleBioChange}
                value={bio}
              />
              <Button variant='primary' className='mt-2' onClick={updateBio}>
                Salva Bio
              </Button>
            </Form.Group>

            <Form.Group className='update-account-form'>
              <Form.Label>Vecchia Password</Form.Label>
              <Form.Control
                type='password'
                value={oldPassword}
                onChange={handleOldPasswordChange}
              />
            </Form.Group>
            <Form.Group className='update-account-form'>
              <Form.Label>Nuova Password</Form.Label>
              <Form.Control
                type='password'
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
            </Form.Group>
            <Button variant='danger' onClick={updatePassword}>
              Aggiorna Password
            </Button>
          </Card.Body>
        </Card>
        <Card className='delete-account-card'>
          <div className='card-overlay'></div>
          <Card.Body>
            <Button
              onClick={deleteAccount}
              className='delete-account-button'
              variant='secondary'
            >
              Elimina Account
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default SettingsPage

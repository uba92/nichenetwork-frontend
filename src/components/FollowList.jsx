import { useEffect, useState } from 'react'
import axios from 'axios'
import { Spinner } from 'react-bootstrap'

function FollowList({ userId, type, token }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchFollowList = async () => {
      try {
        const response = await axios.get(
          `https://renewed-philomena-nichenetwork-60e5fcc0.koyeb.app/api/follows/${userId}/${type}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (response.data.length === 0) {
          setMessage('Nessun utente trovato.')
        } else {
          setUsers(response.data)
        }
      } catch (err) {
        console.error('Errore nel caricamento:', err)
        setMessage('Errore nel caricamento della lista.')
      } finally {
        setLoading(false)
      }
    }

    fetchFollowList()
  }, [userId, type, token])

  return (
    <div>
      <h3>{type === 'followers' ? 'Follower' : 'Seguiti'}</h3>
      {loading && <Spinner animation='border' />}
      {!loading && users.length > 0 && (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <img
                src={user.avatar || '/img/avatar-profilo.jpg'}
                alt='avatar'
                width={30}
                height={30}
                style={{ borderRadius: '50%', marginRight: '8px' }}
              />
              {user.username}
            </li>
          ))}
        </ul>
      )}
      {!loading && message && <p>{message}</p>}
    </div>
  )
}

export default FollowList

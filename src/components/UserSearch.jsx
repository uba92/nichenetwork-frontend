import axios from 'axios'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Alert, Spinner } from 'react-bootstrap'
import '../assets/css/UserSearch.css'

function UserSearch() {
  const { user } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [page, setPage] = useState(0)

  const [hasMore, setHasMore] = useState(true)

  const handleSearch = async (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setPage(0)
    setHasMore(true)
    setIsError(false)
    setIsLoading(true)

    if (value.trim() === '') {
      setSearchResults([])
      setIsLoading(false)
      return
    }

    try {
      const size = 10
      const response = await axios.get(
        `https://renewed-philomena-nichenetwork-60e5fcc0.koyeb.app/api/users/search`,
        {
          params: {
            query: value,
            page: 0,
            size,
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      const fetched = response.data.content

      if (!Array.isArray(fetched)) {
        setSearchResults([])
        setIsLoading(false)
        setHasMore(false)
        return
      }

      setSearchResults(fetched)
      setHasMore(fetched.length === size)
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
      console.error('Error fetching search results:', error)
    }
  }

  const loadMore = async () => {
    try {
      const size = 10
      const response = await axios.get(
        `https://renewed-philomena-nichenetwork-60e5fcc0.koyeb.app/api/users/search`,
        {
          params: { query: searchQuery, page: page + 1, size },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      )

      const fetched = response.data.content

      if (!Array.isArray(fetched) || fetched.length === 0) {
        setHasMore(false)
        return
      }

      setSearchResults((prev) => [...prev, ...fetched])
      setPage((prev) => prev + 1)
      setHasMore(fetched.length === size)
    } catch (err) {
      console.error('❌ Errore in loadMore:', err)
      setHasMore(false)
    }
  }

  return (
    <div className='search-container'>
      <h1>Search</h1>
      <input
        className='search-input'
        placeholder='Cerca Utenti...'
        type='text'
        value={searchQuery}
        onChange={handleSearch}
      />

      {isLoading && <Spinner animation='border' />}

      {isError && (
        <Alert variant='danger'>
          Si è verificato un errore durante la ricerca.
        </Alert>
      )}

      {searchResults.length > 0 && (
        <div className='search-results'>
          {searchResults.map((user) => (
            <div key={user.id} className='search-result-item'>
              <img
                src={user.avatar || '/img/avatar-profilo.jpg'}
                alt='Avatar'
                className='search-result-avatar'
              />
              {user.username}
            </div>
          ))}
        </div>
      )}

      {searchQuery && searchResults.length === 0 && (
        <p>Nessun utente trovato.</p>
      )}

      {searchResults.length > 0 && hasMore && (
        <button onClick={loadMore} disabled={isLoading}>
          {isLoading ? 'Caricamento...' : 'Carica altri'}
        </button>
      )}
    </div>
  )
}

export default UserSearch

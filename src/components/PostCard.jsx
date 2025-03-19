import { Card, Dropdown } from 'react-bootstrap'
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react'
import '../assets/css/Postcard.css'
import axios from 'axios'
import { useEffect, useState } from 'react'

function PostCard({ post }) {
  const [likeCount, setLikeCount] = useState(0)
  const [likedByUser, setLikedByUser] = useState(false)
  const [userId, setUserId] = useState(null)
  const rawUser = localStorage.getItem('user')
  const authenticatedUser = rawUser ? JSON.parse(rawUser) : null

  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')

  const getUserId = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/me', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authenticatedUser.token}`,
        },
      })
      setUserId(response.data.id)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchLikes = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/likes/post/${post.id}/count`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )
      setLikeCount(response.data)

      const userLikeResponse = await axios.get(
        `http://localhost:8080/api/likes/post/${post.id}/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )

      setLikedByUser(userLikeResponse.data)
    } catch (error) {
      console.error('Error fetching likes:', error)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/comments/post/${post.id}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getUserId()
    }
    fetchData()
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (userId) {
      fetchLikes(userId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, post.id])

  const handleLike = async () => {
    if (!userId) {
      console.error('Errore: userId non trovato')
      return
    }

    try {
      await axios.post(
        `http://localhost:8080/api/likes/post/${post.id}/user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )

      setLikedByUser((prev) => !prev)
      setLikeCount((prev) => (likedByUser ? prev - 1 : prev + 1))

      fetchLikes(userId)
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    const requestBody = { content: newComment }
    console.log('Invio commento:', requestBody)

    try {
      await axios.post(
        `http://localhost:8080/api/comments/post/${post.id}/user/${userId}`,
        null,

        {
          headers: { Authorization: `Bearer ${authenticatedUser.token}` },
          params: { content: newComment },
        }
      )

      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error(`Errore nell'aggiungere il commento:`, error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    console.log('UserId:', userId)
    try {
      await axios.delete(
        `http://localhost:8080/api/comments/${commentId}/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser.token}`,
          },
        }
      )
      console.log('Commento eliminato con successo')
      fetchComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const formatDate = (dateString) => {
    const parsedDate = new Date(Date.parse(dateString))

    return parsedDate.toLocaleString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const detectLinks = (text) => {
    if (!text) return ''

    // RegExp per rilevare link
    const urlRegex = /(https?:\/\/[^\s]+)/g

    // Sostituisce i link con <a href>
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target='_blank'
          rel='noopener noreferrer'
          className='post-link'
        >
          {part}
        </a>
      ) : (
        part
      )
    )
  }

  return (
    <Card className='my-3 post-card'>
      <Card.Header className='postcard-header'>
        <div>
          <Card.Img
            className='postcard-avatar me-3'
            src={post.author.avatar || '/img/avatar-profilo.jpg'}
            alt='avatar'
          />
          <span className='postcard-username'>{post.author.username}</span>
        </div>
        <div className='postcard-date'>{formatDate(post.createdAt)}</div>
      </Card.Header>
      <Card.Body>
        <Card.Text className='postcard-content'>
          {detectLinks(post.content)}
        </Card.Text>
        {post.image && (
          <Card.Img className='postcard-image' variant='top' src={post.image} />
        )}
        <div className='postcard-actions'>
          <button
            className={`like-button ${likedByUser ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <Heart size={20} color={likedByUser ? 'red' : 'black'} />
            <span>{likeCount}</span>
          </button>
          <button
            className='comment-button'
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle size={20} /> <span>{comments.length}</span>
          </button>
        </div>

        {showComments && (
          <div className={`comment-section ${showComments ? '' : 'hidden'}`}>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className='comment d-flex justify-content-between'
                >
                  <div>
                    <strong>{comment.author.username}:</strong>{' '}
                    {comment.content}
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle
                      className='comment-dropdown-btn'
                      id='dropdown-basic'
                    >
                      <MoreHorizontal size={20} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className='comment-dropdown-menu'>
                      <Dropdown.Item
                        className='comment-dropdown-item text-light'
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Elimina
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ))
            ) : (
              <p>Nessun commento</p>
            )}

            <div className='comment-form'>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder='Scrivi un commento...'
              />
              <button onClick={handleAddComment} disabled={!newComment.trim()}>
                Invia
              </button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default PostCard

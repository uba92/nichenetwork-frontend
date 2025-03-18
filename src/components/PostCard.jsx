import { Card } from 'react-bootstrap'
import { Heart, MessageCircle } from 'lucide-react'
import '../assets/css/Postcard.css'
function PostCard({ post }) {
  return (
    <Card className='my-3 post-card'>
      <Card.Header className='postcard-header'>
        <Card.Img
          className='postcard-avatar'
          src={post.author.avatar || 'https://placedog.net/50'}
          alt='avatar'
        />
        <span className='postcard-username'>{post.author.username}</span>
      </Card.Header>
      <Card.Body>
        <Card.Text className='postcard-content'>{post.content}</Card.Text>
        {post.image && (
          <Card.Img className='postcard-image' variant='top' src={post.image} />
        )}
        <div className='postcard-actions'>
          <button className='comment-button'>
            <MessageCircle size={20} /> <span>3</span>
          </button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default PostCard

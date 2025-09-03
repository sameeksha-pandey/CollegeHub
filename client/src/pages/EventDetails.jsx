import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link} from 'react-router-dom'
import api from '../lib/api';
import { AuthContext } from '../context/AuthContext';

export default function EventDetails(){
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  const navigate = useNavigate();
  const{user} = useContext(AuthContext);

  useEffect(() => {
    fetchEvent()
    fetchComments()
  }, [id])

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`)
      setEvent(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load event');
    }
  }

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${id}`)
      setComments(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const addComment = async (e) => {
  e.preventDefault()
  if (!newComment.trim()) return
  await api.post(`/comments/${id}`, { text: newComment })
  setNewComment('')
  fetchComments()
}


  const canEdit = () => {
    if (!user || !event) return false;
    const isOwner = event.createdBy?._id === user?.id || event.createdBy?._id === user?._id ;
    const isAdmin = user?.role === 'admin';
    return isOwner || isAdmin;
}

  const onDelete = async () => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  if (error) return <div className="text-red-600">{error}</div>
  if (!event) return <div>Loading...</div>

   return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</p>
       {event.imageUrl && (
        <img
          src={`http://localhost:5000${event.imageUrl}`}   // ✅ prepend backend URL
          alt={event.title}
          className="mt-3 rounded max-h-72 object-cover"
        />
      )}
      <div className="mt-4">{event.description}</div>
      <div className="mt-4 text-sm text-gray-500">
        By: {event.createdBy?.name} ({event.createdBy?.email})
      </div>

     {/*Comment Section*/}
       <div className="mt-6">
        <h3 className="font-bold mb-2">Comments</h3>
        {comments.map((c) => (
          <div key={c._id} className="border-b py-2">
            <span className="font-semibold">{c.user?.name}:</span> {c.text}
          </div>
        ))}
        {user && (
          <form onSubmit={addComment} className="mt-3 flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment"
              className="border p-2 flex-1 rounded"
            />
            <button className="px-3 bg-blue-600 text-white rounded">Post</button>
          </form>
        )}
      </div>

      {/* Edit/Delete Buttons */}
      {canEdit() && (
        <div className="mt-6 flex gap-3">
          <Link to={`/events/${id}/edit`} className="px-3 py-2 bg-yellow-500 text-white rounded">Edit</Link>
          <button onClick={onDelete} className="px-3 py-2 bg-red-600 text-white rounded">Delete</button>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link} from 'react-router-dom'
import api from '../lib/api';
import { AuthContext } from '../context/AuthContext';

export default function EventDetails(){
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const{user} = useContext(AuthContext);

  useEffect(() => { fetchEvent() }, [id])

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`)
      setEvent(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load event');
    }
  }

  const canEdit = () => {
    if (!user || !event) return false;
    const isOwner = event.createdBy && (event.createdBy._id === user.id);
    const isAdmin = user.role === 'admin';
    return isOwner || isAdmin;
  };

  const onDelete = async () => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };


  if (!event) return <div>Loading...</div>

   return (
    <div className="bg-white p-6 rounded shadow">
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</p>
      {event.imageUrl && <img src={event.imageUrl} alt="" className="mt-3 rounded max-h-72 object-cover" />}
      <div className="mt-4">{event.description}</div>
      <div className="mt-4 text-sm text-gray-500">
        By: {event.createdBy?.name} ({event.createdBy?.email})
      </div>

      {canEdit() && (
        <div className="mt-6 flex gap-3">
          <Link to={`/events/${id}/edit`} className="px-3 py-2 bg-yellow-500 text-white rounded">Edit</Link>
          <button onClick={onDelete} className="px-3 py-2 bg-red-600 text-white rounded">Delete</button>
        </div>
      )}
    </div>
  );
}

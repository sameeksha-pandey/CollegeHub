import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../lib/api'
import EventCard from '../components/EventCard'

export default function Profile(){
  const { user } = useContext(AuthContext)
  const [myEvents, setMyEvents] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/user/my-events')
        setMyEvents(res.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load your events')
      }
    })()
  }, [])

  if (!user) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="mt-2 text-sm">Role: {user.role}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Your Events</h3>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {myEvents.length === 0 ? (
          <div className="text-gray-600">You haven't created any events yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {myEvents.map(ev => <EventCard key={ev._id} event={ev} />)}
          </div>
        )}
      </div>
    </div>
  )
}

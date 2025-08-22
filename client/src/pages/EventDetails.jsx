import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function EventDetails(){
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { fetchEvent() }, [id])

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`)
      setEvent(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (!event) return <div>Loading...</div>

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</p>
      <div className="mt-4">{event.description}</div>
      <div className="mt-4 text-sm text-gray-500">By: {event.createdBy?.name}</div>
    </div>
  )
}

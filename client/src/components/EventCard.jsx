import React from 'react'
import { Link } from 'react-router-dom'

export default function EventCard({ event }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="text-lg font-semibold"><Link to={`/events/${event._id}`}>{event.title}</Link></h3>
      <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</p>
      <p className="mt-2 text-gray-700">{event.description?.slice(0, 120)}...</p>
      <div className="mt-3 text-sm text-gray-500">By: {event.createdBy?.name || 'Unknown'}</div>
    </div>
  )
}
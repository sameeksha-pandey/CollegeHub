import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import EventCard from '../components/EventCard'

export default function Events() {
  const [events, setEvents] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [page, search])

  const fetchEvents = async () => {
    const res = await api.get(`/events?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`)
    setEvents(res.data.events)
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input placeholder="Search events" value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded flex-1" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {events.map(ev => <EventCard key={ev._id} event={ev} />)}
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
        <div>Page {page}</div>
        <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-gray-200 rounded">Next</button>
      </div>
    </div>
  )
}

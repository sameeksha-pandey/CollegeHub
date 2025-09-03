import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import EventCard from '../components/EventCard'
import { motion } from 'framer-motion'

export default function Events() {
  const [events, setEvents] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [page, search, category])

  const fetchEvents = async () => {
  const res = await api.get(
    `/events?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&category=${category}`
  )
  setEvents(res.data.events)
}


  return (
    <motion.div 
    className="grid md:grid-cols-2 gap-4"
  initial="hidden"
  animate="show"
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }}
>
  {events.map(ev => (
    <motion.div key={ev._id}
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
    >
      <EventCard event={ev}/>
    </motion.div>
  ))}
    <div>
      <div className="mb-4 flex gap-2">
        <input placeholder="Search events" value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded flex-1" />
      
      <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="border p-2 rounded"
  >
    <option value="">All Categories</option>
    <option value="Technical">Technical</option>
    <option value="Cultural">Cultural</option>
    <option value="Sports">Sports</option>
    <option value="Other">Other</option>
      </select>

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
  </motion.div>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
export default function EventCard({ event }) {
  return (
     <motion.div
      className="bg-white p-4 rounded shadow-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
    <div className="bg-white p-4 rounded shadow-sm hover:shadow-md transition-shadow duration-200">
      {event.imageUrl && (
        <img
          src={`http://localhost:5000${event.imageUrl}`}
          alt={event.title}
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}
      <h3 className="text-lg font-semibold">
        <Link to={`/events/${event._id}`} className="hover:text-blue-600">
         {event.title}
        </Link>
      </h3>
      <p className="text-sm text-gray-600">
        {new Date(event.date).toLocaleString()}
      </p>
      <p className="mt-2 text-gray-700">
        {event.description?.slice(0, 120)}...
      </p>
      <div className="mt-3 text-sm text-gray-500">
        By: {event.createdBy?.name || 'Unknown'}
      </div>
    </div>
  </motion.div>
  )
}
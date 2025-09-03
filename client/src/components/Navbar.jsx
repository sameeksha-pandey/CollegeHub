import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  return (
    <motion.nav 
  className="bg-white shadow"
  initial={{ y: -50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
    <nav className="bg-blue-600 shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center text-white">
        <Link to="/" className="font-bold text-xl tracking-wide">CollegeHub</Link>
        <div className="space-x-4">
          <Link to="/events" className="hover:underline">Events</Link>
          {user ? (
            <>
              <Link to="/create" className="hover:underline">Create</Link>
              <Link to="/profile" className="hover:underline">My Profile</Link>
              <button 
                onClick={() => { logout(); navigate('/login') }} 
                className="ml-2 bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                  Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  </motion.nav>
  )
}
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">CollegeHub</Link>
        <div className="space-x-4">
          <Link to="/events">Events</Link>
          {user ? (
            <>
              <Link to="/create" className="ml-2">Create</Link>
              <Link to="/profile" className="ml-2">{user.name || 'Profile'}</Link>
              <button onClick={() => { logout(); navigate('/login') }} className="ml-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
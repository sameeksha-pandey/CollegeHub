import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Profile(){
  const { user } = useContext(AuthContext)
  if (!user) return <div>Loading...</div>
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-sm text-gray-600">{user.email}</p>
      <p className="mt-2 text-sm">Role: {user.role}</p>
    </div>
  )
}
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Register(){
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    try {
      await register(form.name, form.email, form.password)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register')
    }
  }

  return (
    <form onSubmit={handle} className="max-w-md bg-white p-6 rounded shadow">
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <label className="block mb-2">Name<input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2 border rounded"/></label>
      <label className="block mb-2">Email<input name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-2 border rounded"/></label>
      <label className="block mb-2">Password<input type="password" name="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full p-2 border rounded"/></label>
      <div className="mt-4"><button className="px-4 py-2 bg-blue-600 text-white rounded">Register</button></div>
    </form>
  )
}

import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'
export default function Login(){
  const [form, setForm] = useState({ email: '', password: '' })
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    try {
      await login(form.email, form.password)
      toast.success('Logged in successfully!')
      navigate('/events')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to login')
    }
  }

  return (
    <form onSubmit={handle} className="max-w-md bg-white p-6 rounded shadow">
      <label className="block mb-2">Email<input name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-2 border rounded"/></label>
      <label className="block mb-2">Password<input type="password" name="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full p-2 border rounded"/></label>
      <div className="mt-4"><button className="px-4 py-2 bg-green-600 text-white rounded">Login</button></div>
    </form>
  )
}

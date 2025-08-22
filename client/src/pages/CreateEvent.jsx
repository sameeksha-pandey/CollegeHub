import React, { useState } from 'react'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function CreateEvent(){
  const [form, setForm] = useState({ title: '', description: '', date: '', venue: '', department: '', category: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/events', { ...form, date: new Date(form.date).toISOString() })
      navigate('/events')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed')
    }
  }

  return (
    <form onSubmit={submit} className="max-w-lg bg-white p-6 rounded shadow">
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <label className="block mb-2">Title<input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded"/></label>
      <label className="block mb-2">Date<input name="date" type="datetime-local" value={form.date} onChange={handleChange} className="w-full p-2 border rounded"/></label>
      <label className="block mb-2">Venue<input name="venue" value={form.venue} onChange={handleChange} className="w-full p-2 border rounded"/></label>
      <label className="block mb-2">Department<input name="department" value={form.department} onChange={handleChange} className="w-full p-2 border rounded"/></label>
      <label className="block mb-2">Category<input name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded"/></label>
      <label className="block mb-2">Description<textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded"/></label>
      <div className="mt-4"><button className="px-4 py-2 bg-blue-600 text-white rounded">Create event</button></div>
    </form>
  )
}
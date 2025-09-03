import React, { useState } from 'react'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function CreateEvent(){
  const [form, setForm] = useState({ title: '', description: '', date: '', venue: '', department: '', category: '', tags: '' })
  const [image, setImage] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      Object.keys(form).forEach((key) => {
        if (key === 'date' && form.date) {
          formData.append('date', new Date(form.date).toISOString())
        } else if (key === 'tags') {
          const tagsArray = form.tags
            ? form.tags.split(',').map((t) => t.trim())
            : []
          formData.append('tags', JSON.stringify(tagsArray))
        } else {
          formData.append(key, form[key])
        }
      })
      if (image) formData.append('image', image)

      await api.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Event created successfully!')
      
      navigate('/events')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create event')
    }
  }
  
  return (
    <form
      onSubmit={submit}
      className="max-w-lg bg-white p-6 rounded shadow space-y-3"
    >
      <label className="block">Title
        <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block">Date
        <input type="datetime-local" name="date" value={form.date} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block">Venue
        <input name="venue" value={form.venue} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block">Department
        <input name="department" value={form.department} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block">Category
        <input name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block">Tags (comma separated)
        <input name="tags" value={form.tags} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block">Description
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block">Image
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}/>
      </label>
      <button className="px-4 py-2 bg-blue-600 text-white rounded">Create Event</button>
    </form>
  )
}
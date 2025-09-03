import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast'
export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: '', description: '', date: '', venue: '', department: '', category: '', tags: '',  imageUrl: '' 
  });
  const [image, setImage] = useState(null) 

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const ev = res.data;
        setForm({
          title: ev.title || '',
          description: ev.description || '',
          date: ev.date ? new Date(ev.date).toISOString().slice(0,16) : '', // datetime-local
          venue: ev.venue || '',
          department: ev.department || '',
          category: ev.category || '',
           tags: (ev.tags || []).join(', '),
          imageUrl: ev.imageUrl || ''
        });
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to load event');
      }
    })();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
        } else if (key !== 'imageUrl') {
          formData.append(key, form[key])
        }
      })
      if (image) formData.append('image', image)

      await api.put(`/events/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Event updated successfully!')

      navigate(`/events/${id}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed')
    }
  }

  if (!user) return <div className="text-gray-600">Please login...</div>

  return (
    <form
      onSubmit={submit}
      className="max-w-xl bg-white p-6 rounded shadow space-y-3"
    >
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>

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

      {/* Show existing image if available */}
      {form.imageUrl && (
        <div className="mb-2">
          <p className="text-sm text-gray-600">Current Image:</p>
          <img
            src={`http://localhost:5000${form.imageUrl}`}
            alt="Current event"
            className="h-32 rounded mt-1"
          />
        </div>
      )}

      <label className="block">New Image
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}/>
      </label>

      <button className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
    </form>
  )
}

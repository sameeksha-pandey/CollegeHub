import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { AuthContext } from '../context/AuthContext';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: '', description: '', date: '', venue: '', department: '', category: '', imageUrl: '', tags: ''
  });
  const [error, setError] = useState('');

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
          imageUrl: ev.imageUrl || '',
          tags: (ev.tags || []).join(', ')
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load event');
      }
    })();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/events/${id}`, {
        ...form,
        date: form.date ? new Date(form.date).toISOString() : null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      });
      navigate(`/events/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  if (!user) return <div className="text-gray-600">Please login...</div>;

  return (
    <form onSubmit={submit} className="max-w-xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>
      {error && <div className="text-red-600 mb-3">{error}</div>}

      <label className="block mb-2">Title
        <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block mb-2">Date
        <input type="datetime-local" name="date" value={form.date} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block mb-2">Venue
        <input name="venue" value={form.venue} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block mb-2">Department
        <input name="department" value={form.department} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block mb-2">Category
        <input name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block mb-2">Image URL
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>
      <label className="block mb-2">Tags (comma separated)
        <input name="tags" value={form.tags} onChange={handleChange} className="w-full p-2 border rounded"/>
      </label>

      <div className="mt-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
      </div>
    </form>
  );
}

import React, { createContext, useState, useEffect } from 'react'
import api from '../lib/api'


export const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null)
const [token, setToken] = useState(localStorage.getItem('token') || null)
const [loading, setLoading] = useState(false)


useEffect(() => {
const onLogout = () => { setUser(null); setToken(null) }
window.addEventListener('auth-logout', onLogout)
return () => window.removeEventListener('auth-logout', onLogout)
}, [])


useEffect(() => {
const fetchProfile = async () => {
if (!token) { setUser(null); return }
try {
setLoading(true)
const res = await api.get('/user/profile')
setUser(res.data)
} catch {
localStorage.removeItem('token')
setUser(null)
setToken(null)
} finally { setLoading(false) }
}
fetchProfile()
}, [token])


const login = async (email, password) => {
const res = await api.post('/login', { email, password })
const { token: tkn, user: usr } = res.data
localStorage.setItem('token', tkn)
setToken(tkn)
// usr already has id, name, email, role from backend
setUser(usr)
return usr
}


const register = async (name, email, password) => {
const res = await api.post('/register', { name, email, password })
return res.data
}


const logout = () => {
localStorage.removeItem('token')
setToken(null)
setUser(null)
}


return (
<AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
{children}
</AuthContext.Provider>
)
}
import React, { createContext, useState, useEffect } from 'react'
import api from '../lib/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)

  useEffect(() => {
    if (token) {
      // optional: fetch profile
      api.get('/user/profile')
        .then(res => setUser(res.data))
        .catch(() => {
          // token invalid -> logout
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        })
    }
  }, [token])

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password })
    const { token, user } = res.data
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
    return user
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
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

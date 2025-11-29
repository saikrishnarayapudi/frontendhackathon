import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../App.jsx'
import { apiService } from '../services/api'

export default function Login() {
  const { navigate, setUser } = useContext(AppContext)

  // existing states
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')

  // captcha states
  const [captcha, setCaptcha] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')

  // helpers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let text = ''
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptcha(text)
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // client-side captcha check (works without a backend)
    if (captchaInput.trim().toUpperCase() !== captcha.toUpperCase()) {
      setError('Invalid Captcha')
      generateCaptcha()
      setIsLoading(false)
      return
    }

    try {
      if (isLogin) {
        const response = await apiService.auth.login(formData.email, formData.password)
        if (!response.success) {
          setError(response.error || 'Login failed')
          setIsLoading(false)
          return
        }

        localStorage.setItem('pve:currentUser', JSON.stringify(response.data.user))
        localStorage.setItem('pve:authToken', response.data.token)
        setUser(response.data.user)
        navigate('/')
      } else {
        // signup validations
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setIsLoading(false)
          return
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters')
          setIsLoading(false)
          return
        }

        const response = await apiService.auth.signup(
          formData.email,
          formData.password,
          formData.name
        )

        if (!response.success) {
          setError(response.error || 'Sign up failed')
          setIsLoading(false)
          return
        }

        localStorage.setItem('pve:currentUser', JSON.stringify(response.data.user))
        localStorage.setItem('pve:authToken', response.data.token)
        setUser(response.data.user)
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
      // Clear captcha input after an attempt (successful or not)
      setCaptchaInput('')
      generateCaptcha()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
            🏠
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Property Value Enhancer</h1>
          <p className="text-slate-600">Enhance your property value with smart recommendations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true)
                setError('')
                setFormData({ name: '', email: '', password: '', confirmPassword: '' })
                setCaptchaInput('')
                generateCaptcha()
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                isLogin ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError('')
                setFormData({ name: '', email: '', password: '', confirmPassword: '' })
                setCaptchaInput('')
                generateCaptcha()
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                !isLogin ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            {/* CAPTCHA */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Enter Captcha</label>

              <div className="flex items-center gap-3 mb-2">
                <div className="px-4 py-2 bg-slate-200 rounded-lg font-bold text-lg tracking-widest select-all">
                  {captcha}
                </div>
                <button
                  type="button"
                  onClick={() => { generateCaptcha(); setCaptchaInput('') }}
                  className="px-3 py-2 bg-slate-300 rounded-lg hover:bg-slate-400"
                >
                  Refresh
                </button>
              </div>

              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg"
                placeholder="Enter the captcha"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

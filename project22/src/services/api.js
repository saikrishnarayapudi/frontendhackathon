const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to make API calls
const apiCall = async (method, endpoint, data = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    if (data) {
      options.body = JSON.stringify(data)
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API Call Error:', error)
    throw error
  }
}

export const apiService = {
  auth: {
    async login(email, password) {
      await delay()
      try {
        const users = JSON.parse(localStorage.getItem('pve:users') || '[]')
        const user = users.find(u => u.email === email && u.password === password)
        
        if (!user) {
          throw new Error('Invalid credentials')
        }

        return {
          success: true,
          data: {
            user,
            token: `token_${Date.now()}`
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    },

    async signup(email, password, name) {
      await delay()
      try {
        const users = JSON.parse(localStorage.getItem('pve:users') || '[]')
        
        if (users.find(u => u.email === email)) {
          throw new Error('Email already exists')
        }

        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password,
          role: 'user',
          createdAt: new Date().toISOString()
        }

        users.push(newUser)
        localStorage.setItem('pve:users', JSON.stringify(users))

        return {
          success: true,
          data: {
            user: newUser,
            token: `token_${Date.now()}`
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    },

    async logout() {
      await delay(300)
      return { success: true }
    }
  },

  properties: {
    async create(propertyData) {
      try {
        const newProperty = {
          id: crypto.randomUUID(),
          ...propertyData,
          createdAt: new Date().toISOString()
        }
        const data = await apiCall('POST', '/properties', newProperty)
        return {
          success: true,
          data
        }
      } catch (error) {
        console.error('Create property error:', error)
        return {
          success: false,
          error: error.message
        }
      }
    },

    async getAll() {
      try {
        const data = await apiCall('GET', '/properties')
        return {
          success: true,
          data: Array.isArray(data) ? data : []
        }
      } catch (error) {
        console.error('Get properties error:', error)
        return {
          success: false,
          error: error.message,
          data: []
        }
      }
    },

    async getById(id) {
      try {
        const data = await apiCall('GET', `/properties/${id}`)
        return {
          success: true,
          data
        }
      } catch (error) {
        console.error('Get property error:', error)
        return {
          success: false,
          error: error.message
        }
      }
    },

    async update(id, updates) {
      try {
        const data = await apiCall('PUT', `/properties/${id}`, updates)
        return {
          success: true,
          data
        }
      } catch (error) {
        console.error('Update property error:', error)
        return {
          success: false,
          error: error.message
        }
      }
    },

    async delete(id) {
      try {
        await apiCall('DELETE', `/properties/${id}`)
        return {
          success: true,
          data: { id }
        }
      } catch (error) {
        console.error('Delete property error:', error)
        return {
          success: false,
          error: error.message
        }
      }
    }
  },

  recommendations: {
    async getRecommendations(formData) {
      try {
        const data = await apiCall('GET', '/recommendations')
        return {
          success: true,
          data: Array.isArray(data) ? data : []
        }
      } catch (error) {
        console.error('Get recommendations error:', error)
        return {
          success: false,
          error: error.message,
          data: []
        }
      }
    },

    async create(recommendationData) {
      try {
        const newRecommendation = {
          id: crypto.randomUUID(),
          ...recommendationData,
          createdAt: new Date().toISOString()
        }
        const data = await apiCall('POST', '/recommendations', newRecommendation)
        return {
          success: true,
          data
        }
      } catch (error) {
        console.error('Create recommendation error:', error)
        return {
          success: false,
          error: error.message
        }
      }
    },

    async update(id, updates) {
      try {
        const data = await apiCall('PUT', `/recommendations/${id}`, updates)
        return {
          success: true,
          data
        }
      } catch (error) {
        console.error('Update recommendation error:', error)
        return {
          success: false,
          error: error.message
        }
      }
    },

    async delete(id) {
      try {
        await apiCall('DELETE', `/recommendations/${id}`)
        return {
          success: true,
          data: { id }
        }
      } catch (error) {
        console.error('Delete recommendation error:', error)
        return {
          success: false,
          error: error.message
        }
      }
    }
  },

  saved: {
    async saveItem(item) {
      await delay()
      try {
        const saved = JSON.parse(localStorage.getItem('pve:saved') || '[]')
        
        if (saved.find(s => s.id === item.id)) {
          throw new Error('Item already saved')
        }

        saved.push(item)
        localStorage.setItem('pve:saved', JSON.stringify(saved))

        return {
          success: true,
          data: item
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    },

    async getSavedItems() {
      await delay()
      try {
        const saved = JSON.parse(localStorage.getItem('pve:saved') || '[]')
        return {
          success: true,
          data: saved
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    },

    async removeItem(id) {
      await delay()
      try {
        const saved = JSON.parse(localStorage.getItem('pve:saved') || '[]')
        const filtered = saved.filter(s => s.id !== id)
        localStorage.setItem('pve:saved', JSON.stringify(filtered))

        return {
          success: true,
          data: { id }
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    }
  },

  ideas: {
    async getIdeas() {
      await delay()
      try {
        const ideas = JSON.parse(localStorage.getItem('pve:ideas') || '[]')
        return {
          success: true,
          data: ideas
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    },

    async createIdea(ideaData) {
      await delay()
      try {
        const ideas = JSON.parse(localStorage.getItem('pve:ideas') || '[]')
        const newIdea = {
          id: Date.now().toString(),
          ...ideaData,
          createdAt: new Date().toISOString()
        }
        ideas.push(newIdea)
        localStorage.setItem('pve:ideas', JSON.stringify(ideas))

        return {
          success: true,
          data: newIdea
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    }
  }
}
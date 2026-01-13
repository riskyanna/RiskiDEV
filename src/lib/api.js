
const API_URL = '/api'

const getHeaders = (isJson = true) => {
  const headers = isJson ? { 'Content-Type': 'application/json' } : {}
  const token = localStorage.getItem('token')
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export const api = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    return res.json()
  },

  getPortfolio: async (type = 'web') => {
    const res = await fetch(`${API_URL}/portfolio?type=${type}`)
    return res.json()
  },

  addPortfolio: async (data) => {
    // If data is FormData, do not set Content-Type header (browser sets it with boundary)
    const isFormData = data instanceof FormData
    const res = await fetch(`${API_URL}/portfolio`, {
      method: 'POST',
      headers: getHeaders(!isFormData),
      body: isFormData ? data : JSON.stringify(data)
    })
    return res.json()
  },

  updatePortfolio: async (id, data) => {
    const isFormData = data instanceof FormData
    const res = await fetch(`${API_URL}/portfolio/${id}`, {
      method: 'PUT',
      headers: getHeaders(!isFormData),
      body: isFormData ? data : JSON.stringify(data)
    })
    return res.json()
  },

  deletePortfolio: async (id) => {
    const res = await fetch(`${API_URL}/portfolio/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false)
    })
    return res.json()
  },

  trackOrder: async (service_type) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_type })
    })
    return res.json()
  },

  getStats: async () => {
    const res = await fetch(`${API_URL}/stats`)
    return res.json()
  },

  // Pricing API
  getPricing: async (type = 'web') => {
    const res = await fetch(`${API_URL}/pricing?type=${type}`)
    return res.json()
  },

  addPricing: async (data) => {
    const res = await fetch(`${API_URL}/pricing`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data)
    })
    return res.json()
  },

  updatePricing: async (id, data) => {
    const res = await fetch(`${API_URL}/pricing/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data)
    })
    return res.json()
  },

  deletePricing: async (id) => {
    const res = await fetch(`${API_URL}/pricing/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false)
    })
    return res.json()
  }
}

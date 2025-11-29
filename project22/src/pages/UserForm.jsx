import React, { useContext, useState } from 'react'
import { AppContext } from '../App.jsx'

export default function UserForm() {
  const { form, setForm, navigate, properties, setProperties } = useContext(AppContext)
  const [selectedType, setSelectedType] = useState(form.type || 'Apartment')

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setForm((f) => {
        const amenities = new Set(f.amenities || [])
        if (checked) amenities.add(value)
        else amenities.delete(value)
        return { ...f, amenities: Array.from(amenities) }
      })
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }

  const selectPropertyType = (type) => {
    setSelectedType(type)
    setForm((f) => ({ ...f, type }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!form.city || !form.locality || !form.type || !form.rooms || !form.area) {
      alert('Please fill in all required fields')
      return
    }

    // Create a new property object
    const newProperty = {
      id: crypto.randomUUID(),
      city: form.city,
      locality: form.locality,
      type: form.type,
      rooms: form.rooms,
      area: form.area,
      amenities: form.amenities || [],
      currentValue: 0, // Can be updated later
      potentialIncrease: 0, // Can be updated later
      createdAt: new Date().toISOString()
    }

    // Add the property to the properties array
    setProperties(prev => [newProperty, ...prev])

    // Navigate to recommendations
    navigate('/recommendations')
  }

  const propertyTypes = [
    { name: 'Apartment', icon: '🏢' },
    { name: 'Villa', icon: '🏠' },
    { name: 'Independent House', icon: '🏡' }
  ]

  const amenities = [
    'Parking', 'Balcony', 'Garden', 'Swimming Pool',
    'Gym', 'Security', 'Elevator', 'Power Backup'
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Submit Your Property</h1>
        <p className="text-slate-600">Tell us about your property to get personalized recommendations</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
            <select 
              name="city" 
              value={form.city} 
              onChange={onChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select City</option>
              <option>Bangalore</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Hyderabad</option>
              <option>Chennai</option>
              <option>Pune</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Locality</label>
            <input 
              type="text"
              name="locality"
              value={form.locality}
              onChange={onChange}
              placeholder="e.g., Whitefield, Koramangala"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Property Type</label>
          <div className="grid grid-cols-3 gap-4">
            {propertyTypes.map((pt) => (
              <button
                key={pt.name}
                type="button"
                onClick={() => selectPropertyType(pt.name)}
                className={`p-4 rounded-xl border-2 transition ${
                  selectedType === pt.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-4xl mb-2">{pt.icon}</div>
                <div className="text-sm font-medium text-slate-900">{pt.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Number of Rooms</label>
            <select 
              name="rooms" 
              value={form.rooms} 
              onChange={onChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Rooms</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
              <option>3 BHK</option>
              <option>4 BHK</option>
              <option>5+ BHK</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Size (sq ft)</label>
            <input 
              type="number"
              name="area"
              value={form.area}
              onChange={onChange}
              placeholder="e.g., 1200"
              min="100"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Current Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amenities.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={amenity}
                  checked={(form.amenities || []).includes(amenity)}
                  onChange={onChange}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-slate-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Budget for Improvements</label>
          <select 
            name="budget" 
            value={form.budget} 
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Budget Range</option>
            <option value="50000">Up to ₹50,000</option>
            <option value="100000">Up to ₹1,00,000</option>
            <option value="200000">Up to ₹2,00,000</option>
            <option value="500000">Up to ₹5,00,000</option>
            <option value="1000000">Up to ₹10,00,000</option>
          </select>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
          >
            Get Personalized Recommendations
          </button>
        </div>
      </form>
    </div>
  )
}
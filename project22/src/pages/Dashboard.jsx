import React, { useContext } from 'react'
import { AppContext } from '../App.jsx'

export default function Dashboard() {
  const { properties, navigate, user, setProperties } = useContext(AppContext)

  const getPropertyIcon = (type) => {
    const icons = {
      'Apartment': '🏢',
      'Villa': '🏠',
      'Independent House': '🏡'
    }
    return icons[type] || '🏠'
  }

  const getPropertyColor = (type) => {
    const colors = {
      'Apartment': 'bg-blue-100',
      'Villa': 'bg-purple-100',
      'Independent House': 'bg-green-100'
    }
    return colors[type] || 'bg-slate-100'
  }

  const handleDeleteProperty = (propertyId) => {
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      setProperties(prev => prev.filter(prop => prop.id !== propertyId))
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Hi {user?.name || 'User'}, let's improve your property value!</h1>
        <p className="text-slate-600">Welcome back to your dashboard</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Your Properties</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Display saved properties */}
        {properties && properties.length > 0 ? (
          properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
              <div className={`${getPropertyColor(property.type)} h-32 flex items-center justify-center text-6xl`}>
                {getPropertyIcon(property.type)}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{property.rooms} - {property.type}</h3>
                    <p className="text-sm text-slate-600 mb-3">{property.locality}, {property.city}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProperty(property.id)}
                    className="text-red-500 hover:text-red-700 text-lg"
                    title="Delete property"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-1 mb-3">
                  <div className="text-sm">
                    <span className="text-slate-600">Area:</span>
                    <span className="font-semibold text-slate-900"> {property.area} sq ft</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-600">Amenities:</span>
                    <span className="font-semibold text-slate-900"> {property.amenities?.length || 0}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/recommendations')}
                  className="w-full bg-yellow-50 border border-yellow-200 rounded-md px-3 py-1.5 text-xs font-medium text-yellow-800 cursor-pointer hover:bg-yellow-100 transition"
                >
                  View Recommendations
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-slate-600 mb-4">No properties added yet</p>
            <button
              onClick={() => navigate('/submit')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Add Your First Property
            </button>
          </div>
        )}

        {/* Add New Property Card */}
        <button 
          onClick={() => navigate('/submit')}
          className="bg-white rounded-xl shadow-sm border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 overflow-hidden transition group"
        >
          <div className="bg-slate-50 h-32 flex items-center justify-center text-6xl group-hover:scale-110 transition">
            ➕
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-slate-900 mb-1">Add New Property</h3>
            <p className="text-sm text-slate-600 mb-8">Submit another property to get recommendations</p>
            <div className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition">
              Add Property
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}